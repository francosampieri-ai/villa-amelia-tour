// Iluminación: luz de día suave (sol direccional + hemisferio + cielo). Gancho para hora del día (prompt 5/7).
import * as THREE from 'three';
import { skyGradient } from './textures.js';

const NORTH_ROT = 13.35 * Math.PI / 180; // norte verdadero respecto a Y+ del proyecto (PLAN §1.2)

export class Daylight {
  constructor(scene, { isMobile = false } = {}) {
    this.scene = scene;
    this.hemi = new THREE.HemisphereLight(0xdfe9f3, 0x9a8c74, 0.9);
    scene.add(this.hemi);
    this.ambient = new THREE.AmbientLight(0xffffff, 0.35);
    scene.add(this.ambient);

    this.sun = new THREE.DirectionalLight(0xfff2dc, 2.4);
    this.sun.castShadow = true;
    const sh = this.sun.shadow;
    sh.mapSize.set(isMobile ? 1024 : 2048, isMobile ? 1024 : 2048);
    sh.camera.near = 1; sh.camera.far = 140;
    sh.camera.left = -40; sh.camera.right = 40; sh.camera.top = 40; sh.camera.bottom = -40;
    sh.bias = -0.0006; sh.normalBias = 0.03; sh.radius = isMobile ? 1 : 2;
    this.sunTarget = new THREE.Object3D(); this.sunTarget.position.set(14, 2, -12);
    scene.add(this.sunTarget); this.sun.target = this.sunTarget;
    scene.add(this.sun);

    // Luz de relleno fría desde el norte (fachada de vidrio), sin sombra
    this.fill = new THREE.DirectionalLight(0xcfe0f5, 0.5);
    this.fill.position.set(10, 20, -60); scene.add(this.fill);

    // Cielo
    const sky = new THREE.Mesh(new THREE.SphereGeometry(400, 24, 12), new THREE.MeshBasicMaterial({ map: skyGradient(), side: THREE.BackSide, depthWrite: false }));
    sky.name = 'sky'; scene.add(sky); this.sky = sky;
    scene.fog = new THREE.Fog(0xdfe6ea, 120, 400);
    this.setHour(10.5);
  }

  /** Hora solar (0-24). Trayectoria aproximada para latitud ~10° N: sale por el este, culmina alto, se pone al oeste. */
  setHour(h) {
    this.hour = h;
    const t = (h - 6) / 12;                        // 0 amanecer, 1 atardecer
    const az = Math.PI * (1 - t);                  // este → oeste (en el marco norte-verdadero)
    const elev = Math.max(0.02, Math.sin(Math.PI * t)) * 1.15;
    // Vector hacia el sol en coordenadas del proyecto (x este, y norte), luego a mundo (x, z=-y)
    const ex = Math.cos(az), ny = -0.35 * Math.sin(Math.PI * t) + 0.1; // ligeramente al sur al mediodía
    const px = ex * Math.cos(NORTH_ROT) - ny * Math.sin(NORTH_ROT), py = ex * Math.sin(NORTH_ROT) + ny * Math.cos(NORTH_ROT);
    const d = new THREE.Vector3(px, Math.tan(elev), -py).normalize().multiplyScalar(70);
    this.sun.position.copy(this.sunTarget.position).add(d);
    const warm = Math.pow(1 - Math.sin(Math.PI * Math.min(Math.max(t, 0), 1)), 2);
    this.sun.color.setHSL(0.09, 0.3 + 0.6 * warm, 0.9 - 0.15 * warm);
    this.sun.intensity = 2.6 * Math.max(0.15, Math.sin(Math.PI * Math.min(Math.max(t, 0), 1)));
    this.hemi.intensity = 0.6 + 0.4 * Math.sin(Math.PI * Math.min(Math.max(t, 0), 1));
  }
}
