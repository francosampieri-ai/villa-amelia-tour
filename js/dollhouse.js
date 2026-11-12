// Vista dollhouse: cámara orbital cenital, techo oculto, niveles superiores ocultos según el selector.
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { toWorld } from './builder.js';

export class Dollhouse {
  /**
   * @param dom canvas
   * @param levels objetos { group } indexados 0..3
   * @param roof grupo de cubierta (siempre oculto en dollhouse)
   */
  constructor(dom, levels, roof, aspect) {
    this.levels = levels; this.roof = roof;
    this.camera = new THREE.PerspectiveCamera(45, aspect, 0.5, 600);
    this.center = toWorld(14.0, 12.0, 2.0);
    this.controls = new OrbitControls(this.camera, dom);
    this.controls.target.copy(this.center);
    this.controls.enableDamping = true; this.controls.dampingFactor = 0.08;
    this.controls.maxPolarAngle = Math.PI * 0.48; this.controls.minDistance = 6; this.controls.maxDistance = 140;
    this.controls.enablePan = true; this.controls.screenSpacePanning = false;
    this.controls.touches = { ONE: THREE.TOUCH.ROTATE, TWO: THREE.TOUCH.DOLLY_PAN };
    this.controls.enabled = false;
    this.enabled = false;
    this.resetView();
  }

  resetView() {
    // Vista cenital ligeramente inclinada desde el suroeste (la calle), toda la casa en cuadro
    // Distancia calculada para que la casa entera (radio ~20 m) quepa también en pantallas verticales (móvil)
    const R = 20, vf = this.camera.fov * Math.PI / 360, hf = Math.atan(Math.tan(vf) * this.camera.aspect);
    const dist = Math.min(140, R / Math.tan(Math.min(vf, hf)) * 1.05);
    const dir = new THREE.Vector3(-6, 42, 30).normalize();
    this.camera.position.copy(this.center).addScaledVector(dir, dist);
    this.controls.target.copy(this.center);
    this.controls.update();
  }

  /** Vista casi vertical para comparar con la planta (hook de verificación). */
  topView(height = 48) {
    this.camera.position.copy(this.center).add(new THREE.Vector3(0, height, 0.01));
    this.controls.target.copy(this.center); this.controls.update();
  }

  enable() {
    this.enabled = true; this.controls.enabled = true;
    this.roof.visible = false;
    this.applyLevel(this.level ?? 'all');
  }
  disable() {
    this.enabled = false; this.controls.enabled = false;
    this.roof.visible = true;
    for (const l of this.levels) l.group.visible = true;
  }

  /** level: 0..3 | 'all'. Oculta los niveles por encima del seleccionado. */
  applyLevel(level) {
    this.level = level;
    if (!this.enabled) return;
    const max = level === 'all' ? 99 : Number(level);
    this.levels.forEach((l, i) => { l.group.visible = i <= max; });
  }

  update() { if (this.enabled) this.controls.update(); }
  setAspect(a) { this.camera.aspect = a; this.camera.updateProjectionMatrix(); if (!this.enabled) this.resetView(); }
}
