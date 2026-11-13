// Geometría EXACTA del modelo Revit (BIM) de Nones+Nones: muros, puertas, ventanas, losas, escaleras, mobiliario y vegetación.
// Reemplaza la geometría hecha a mano; colisiones = cortes horizontales de la geometría real (bim_build.py).
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';
import { boxUV, finishMaterial, texturesReady } from './bim_materials.js';
import { loadSanitarios } from './sanitarios.js';
const RADIUS = 0.22;  // radio del cuerpo (hombros ~0.45 m): permite puertas de 0.60-0.70 m como en la realidad

export async function loadBIM({ scene, levels, roof, site, colliders, floorTargets, fp }) {
  const draco = new DRACOLoader().setDecoderPath('./vendor/three/jsm/libs/draco/');
  const gl = new GLTFLoader().setDRACOLoader(draco);
  const [g, col, roles] = await Promise.all([gl.loadAsync('./assets/bim/bim.glb'), fetch('./assets/bim/bim_colliders.json').then(r => r.json()), fetch('./assets/bim/bim_roles.json').then(r => r.json())]);
  // ocultar la geometría hecha a mano (los grupos de nivel se conservan para el selector y la casa de muñecas)
  for (const grp of [...levels.map(l => l.group), roof, site]) grp.children.forEach(c => c.visible = false);
  g.scene.updateMatrixWorld(true);
  const meshes = []; g.scene.traverse(o => { if (o.isMesh) meshes.push(o); });
  floorTargets.length = 0; const stats = { meshes: meshes.length, floors: 0 };
  for (const m of meshes) {
    let n = m; while (n && !(n.name || '').includes('|')) n = n.parent;
    const [L, tag, cat, did] = (n ? n.name : 'L0|X|?|0').split('|'); const role = roles[did] || roles[(did || '').split('.')[0]] || 'default'; const li = Number(L.slice(1));
    const target = li >= 4 ? roof : levels[Math.min(li, 3)].group;
    // hornear la transformación en la geometría (normales en mundo: el piso se detecta por normal.y)
    m.geometry = m.geometry.clone(); m.geometry.applyMatrix4(m.matrixWorld);
    m.matrix.identity(); m.matrix.decompose(m.position, m.quaternion, m.scale); m.matrixAutoUpdate = true;
    boxUV(m.geometry); m.material = finishMaterial(m.material, role); m.userData.dbId = (did || '').split('.')[0]; m.userData.node = n ? n.name : '';
    target.add(m); m.updateMatrixWorld(true); m.userData.bim = { L: li, cat, role }; m.userData.node = n ? n.name : ''; m.castShadow = true; m.receiveShadow = true;
    if (tag === 'F') { floorTargets.push(m); stats.floors++; }
    const mats = Array.isArray(m.material) ? m.material : [m.material];
    mats.forEach(mt => { if (mt.transparent && mt.opacity < 0.6) { mt.depthWrite = false; m.castShadow = false; } });
  }
  colliders.length = 0; colliders.push(...col.segments, ...col.boxes);
  stats.sanitarios = await loadSanitarios({ levels, colliders, floorTargets });  // genéricos, fuera del Revit
  // índice espacial (celdas de 1 m) para que la colisión siga siendo rápida con ~8.000 colisionadores
  const cell = 1, grid = new Map(), key = (i, j) => i * 100003 + j;
  for (const c of colliders) {
    const r = Math.abs(c.hl * Math.cos(c.ang)) + Math.abs(c.ht * Math.sin(c.ang)) + RADIUS, s = Math.abs(c.hl * Math.sin(c.ang)) + Math.abs(c.ht * Math.cos(c.ang)) + RADIUS;
    for (let i = Math.floor((c.cx - r) / cell); i <= Math.floor((c.cx + r) / cell); i++)
      for (let j = Math.floor((c.cy - s) / cell); j <= Math.floor((c.cy + s) / cell); j++) { const k = key(i, j); (grid.get(k) || grid.set(k, []).get(k)).push(c); }
  }
  fp.collides = function (x, z) {
    const y0 = this.floorY + 0.3, y1 = this.floorY + 1.3, py = -z;
    const list = grid.get(key(Math.floor(x / cell), Math.floor(py / cell))); if (!list) return false;
    for (const c of list) {
      if (c.z1 <= y0 || c.z0 >= y1) continue;
      const dx = x - c.cx, dy = py - c.cy, cs = Math.cos(c.ang), sn = Math.sin(c.ang);
      const lx = dx * cs + dy * sn, ly = -dx * sn + dy * cs;
      const qx = Math.max(Math.abs(lx) - c.hl, 0), qy = Math.max(Math.abs(ly) - c.ht, 0);
      if (qx * qx + qy * qy < RADIUS * RADIUS) return true;
    }
    return false;
  };
  await texturesReady();
  fp.snapFloor(true); fp.unstick();
  return { ...stats, colliders: colliders.length };
}
