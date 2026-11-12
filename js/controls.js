// Primera persona: WASD/flechas + ratón (pointer lock) en escritorio; joystick virtual + arrastre en móvil.
// Colisión círculo-vs-cajas orientadas (muros, columnas, mobiliario) y seguimiento del piso por raycast hacia abajo.
import * as THREE from 'three';

const EYE = 1.60, RADIUS = 0.32, STEP_MAX = 0.55, WALK = 1.8, RUN = 3.6;
const deg = Math.PI / 180;

export class FirstPerson {
  constructor(camera, dom, { colliders, raycastTargets, isMobile = false }) {
    this.camera = camera; this.dom = dom; this.colliders = colliders; this.raycastTargets = raycastTargets;
    this.isMobile = isMobile;
    this.enabled = true;
    this.pos = new THREE.Vector3(12.8, 1.40, -12.6);  // pies (mundo)
    this.floorY = 1.40; this.eyeY = this.floorY + EYE;
    this.yaw = 0; this.pitch = 0;                       // rotación de cámara (rad)
    this.keys = new Set(); this.joy = new THREE.Vector2(); this.lookDelta = new THREE.Vector2();
    this.ray = new THREE.Raycaster(); this.ray.far = 6;
    this.down = new THREE.Vector3(0, -1, 0);
    this.camera.rotation.order = 'YXZ';
    this.onMove = null;
    this.bind();
  }

  /** Coloca la cámara: coordenadas del plano (x, y), cota de piso z, yaw en grados (90 = mirar a +Y). */
  setPose(x, y, zFloor, yawDeg = 90) {
    this.pos.set(x, zFloor, -y); this.floorY = zFloor; this.eyeY = zFloor + EYE;
    this.yaw = (yawDeg - 90) * deg; this.pitch = 0;
    this.snapFloor(true);
    this.apply();
  }
  getPlan() { return { x: this.pos.x, y: -this.pos.z, z: this.floorY, yaw: this.yaw / deg + 90 }; }

  bind() {
    const d = this.dom;
    window.addEventListener('keydown', e => { if (e.target.tagName === 'INPUT') return; this.keys.add(e.code); });
    window.addEventListener('keyup', e => this.keys.delete(e.code));
    window.addEventListener('blur', () => this.keys.clear());
    if (!this.isMobile) {
      d.addEventListener('click', () => { if (this.enabled && document.pointerLockElement !== d) d.requestPointerLock?.(); });
      document.addEventListener('mousemove', e => {
        if (document.pointerLockElement !== d || !this.enabled) return;
        this.yaw -= e.movementX * 0.0022; this.pitch -= e.movementY * 0.0022;
        this.pitch = Math.max(-1.35, Math.min(1.35, this.pitch));
      });
    } else this.bindTouch();
  }

  bindTouch() {
    const joy = document.getElementById('joy'), knob = document.getElementById('joy-knob'), look = document.getElementById('look');
    if (!joy || !look) return;
    let joyId = null, lookId = null, lastX = 0, lastY = 0;
    const joyMove = (t) => {
      const r = joy.getBoundingClientRect(), cx = r.left + r.width / 2, cy = r.top + r.height / 2;
      let dx = (t.clientX - cx) / (r.width / 2), dy = (t.clientY - cy) / (r.height / 2);
      const len = Math.hypot(dx, dy); if (len > 1) { dx /= len; dy /= len; }
      this.joy.set(dx, -dy); knob.style.transform = `translate(${dx * 36}px, ${dy * 36}px)`;
    };
    joy.addEventListener('touchstart', e => { e.preventDefault(); const t = e.changedTouches[0]; joyId = t.identifier; joyMove(t); }, { passive: false });
    joy.addEventListener('touchmove', e => { e.preventDefault(); for (const t of e.changedTouches) if (t.identifier === joyId) joyMove(t); }, { passive: false });
    const joyEnd = e => { for (const t of e.changedTouches) if (t.identifier === joyId) { joyId = null; this.joy.set(0, 0); knob.style.transform = ''; } };
    joy.addEventListener('touchend', joyEnd); joy.addEventListener('touchcancel', joyEnd);
    look.addEventListener('touchstart', e => { e.preventDefault(); const t = e.changedTouches[0]; lookId = t.identifier; lastX = t.clientX; lastY = t.clientY; }, { passive: false });
    look.addEventListener('touchmove', e => {
      e.preventDefault();
      for (const t of e.changedTouches) if (t.identifier === lookId) {
        this.yaw -= (t.clientX - lastX) * 0.006; this.pitch -= (t.clientY - lastY) * 0.006;
        this.pitch = Math.max(-1.35, Math.min(1.35, this.pitch)); lastX = t.clientX; lastY = t.clientY;
      }
    }, { passive: false });
    const lookEnd = e => { for (const t of e.changedTouches) if (t.identifier === lookId) lookId = null; };
    look.addEventListener('touchend', lookEnd); look.addEventListener('touchcancel', lookEnd);
  }

  /** Raycast hacia abajo desde un poco por encima del piso actual; devuelve la cota del piso o null. */
  probeFloor(x, z) {
    this.ray.set(new THREE.Vector3(x, this.floorY + STEP_MAX + 0.05, z), this.down);
    const hits = this.ray.intersectObjects(this.raycastTargets(), false);
    for (const h of hits) { if (h.face && h.face.normal.y > 0.3) return h.point.y; }
    return null;
  }
  snapFloor(hard = false) {
    const y = this.probeFloor(this.pos.x, this.pos.z);
    if (y !== null) { this.floorY = y; this.pos.y = y; if (hard) this.eyeY = y + EYE; }
  }

  /** Colisión círculo (x,z,r) contra cajas orientadas activas en el rango de altura del cuerpo. */
  collides(x, z) {
    const y0 = this.floorY + 0.35, y1 = this.floorY + 1.75, py = -z;
    for (const c of this.colliders) {
      if (c.z1 <= y0 || c.z0 >= y1) continue;
      const dx = x - c.cx, dy = py - c.cy;
      if (Math.abs(dx) > c.hl + c.ht + RADIUS || Math.abs(dy) > c.hl + c.ht + RADIUS) continue;
      const cs = Math.cos(c.ang), sn = Math.sin(c.ang);
      const lx = dx * cs + dy * sn, ly = -dx * sn + dy * cs;
      const qx = Math.max(Math.abs(lx) - c.hl, 0), qy = Math.max(Math.abs(ly) - c.ht, 0);
      if (qx * qx + qy * qy < RADIUS * RADIUS) return true;
    }
    return false;
  }

  tryMove(dx, dz) {
    const nx = this.pos.x + dx, nz = this.pos.z + dz;
    if (this.collides(nx, nz)) return false;
    const fy = this.probeFloor(nx, nz);
    if (fy === null || fy - this.floorY > STEP_MAX) return false;
    this.pos.x = nx; this.pos.z = nz;
    if (fy < this.floorY - 0.02) this.pos.y = Math.max(fy, this.pos.y - 0.25); else this.pos.y = fy; // bajar suave
    this.floorY = fy;
    return true;
  }

  update(dt) {
    if (!this.enabled) return;
    const k = this.keys;
    let f = (k.has('KeyW') || k.has('ArrowUp') ? 1 : 0) - (k.has('KeyS') || k.has('ArrowDown') ? 1 : 0);
    let s = (k.has('KeyD') || k.has('ArrowRight') ? 1 : 0) - (k.has('KeyA') || k.has('ArrowLeft') ? 1 : 0);
    f += this.joy.y; s += this.joy.x;
    const len = Math.hypot(f, s); if (len > 1) { f /= len; s /= len; }
    if (len > 0.01) {
      const speed = (k.has('ShiftLeft') || k.has('ShiftRight') ? RUN : WALK) * dt;
      const fx = -Math.sin(this.yaw), fz = -Math.cos(this.yaw), rx = Math.cos(this.yaw), rz = -Math.sin(this.yaw);
      const dx = (fx * f + rx * s) * speed, dz = (fz * f + rz * s) * speed;
      if (!this.tryMove(dx, dz)) { this.tryMove(dx, 0) || this.tryMove(0, dz); }
    }
    // Altura de ojo suavizada (escaleras)
    const target = this.pos.y + EYE;
    this.eyeY += (target - this.eyeY) * Math.min(1, dt * 10);
    this.apply();
    if (this.onMove) this.onMove(this.getPlan());
  }

  apply() {
    this.camera.position.set(this.pos.x, this.eyeY, this.pos.z);
    this.camera.rotation.set(this.pitch, this.yaw, 0);
  }
}
