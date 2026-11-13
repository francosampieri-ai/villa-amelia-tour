// Sanitarios GENÉRICOS (no están en el Revit; pedidos por Franco): inodoro, lavamanos con mueble y espejo, ducha con mampara.
// Datos: assets/bim/sanitarios.json (scripts/sanitarios.py). Marco local: frente = +x, ancho a lo largo de z, origen en el piso.
import * as THREE from 'three';
const M = {
  ceramic: new THREE.MeshStandardMaterial({ color: 0xf4f2ee, roughness: 0.12 }),
  chrome: new THREE.MeshStandardMaterial({ color: 0xdedede, roughness: 0.08, metalness: 1 }),
  wood: new THREE.MeshStandardMaterial({ color: 0x8a6446, roughness: 0.55 }),
  glass: new THREE.MeshStandardMaterial({ color: 0xeef4f4, roughness: 0.02, transparent: true, opacity: 0.18, depthWrite: false, side: THREE.DoubleSide }),
  mirror: new THREE.MeshStandardMaterial({ color: 0x9aa2a4, roughness: 0.12, metalness: 1, envMapIntensity: 0.35 }),
  tray: new THREE.MeshStandardMaterial({ color: 0xe9e6e0, roughness: 0.35 }),
};
const box = (w, h, d, m, x, y, z) => { const o = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), m); o.position.set(x, y, z); return o; };
function inodoro(f) {
  const g = new THREE.Group(), D = f.d, back = -D / 2;
  const base = new THREE.Mesh(new THREE.CylinderGeometry(0.17, 0.13, 0.38, 32), M.ceramic); base.scale.set(1.25, 1, 0.9); base.position.set(back + 0.42, 0.19, 0); g.add(base);
  const bowl = new THREE.Mesh(new THREE.CylinderGeometry(0.19, 0.17, 0.06, 40), M.ceramic); bowl.scale.set(1.3, 1, 0.95); bowl.position.set(back + 0.44, 0.41, 0); g.add(bowl);
  const seat = new THREE.Mesh(new THREE.TorusGeometry(0.15, 0.03, 12, 40), M.ceramic); seat.rotation.x = Math.PI / 2; seat.scale.set(1.3, 1, 1); seat.position.set(back + 0.45, 0.445, 0); g.add(seat);
  g.add(box(0.17, 0.38, 0.38, M.ceramic, back + 0.09, 0.62, 0));        // tanque
  g.add(box(0.03, 0.012, 0.08, M.chrome, back + 0.12, 0.815, 0));      // pulsador
  return g;
}
function lavamanos(f) {
  const g = new THREE.Group(), D = f.d, W = f.w, back = -D / 2;
  g.add(box(D, 0.42, W, M.wood, 0, 0.45 + 0.21, 0));                  // mueble flotante
  g.add(box(D + 0.01, 0.04, W + 0.01, M.ceramic, 0, 0.89, 0));         // encimera
  const basin = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.17, 0.02, 40), M.tray); basin.scale.set(0.85, 1, 1); basin.position.set(0.02, 0.905, 0); g.add(basin);
  const tap = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 0.22, 16), M.chrome); tap.position.set(back + 0.07, 1.0, 0); g.add(tap);
  g.add(box(0.12, 0.018, 0.022, M.chrome, back + 0.12, 1.105, 0));
  g.add(box(0.012, 0.8, Math.min(W, 0.7), M.mirror, back + 0.01, 1.55, 0));  // espejo
  return g;
}
function ducha(f) {
  const g = new THREE.Group(), D = f.d, W = f.w;
  g.add(box(D, 0.04, W, M.tray, 0, 0.02, 0));                          // plato
  const pl = W * 0.6; g.add(box(0.01, 2.0, pl, M.glass, D / 2 - 0.02, 1.04, -W / 2 + pl / 2));   // mampara fija en el lado abierto
  g.add(box(0.02, 2.0, 0.02, M.chrome, D / 2 - 0.02, 1.04, -W / 2 + pl));
  const head = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.11, 0.012, 32), M.chrome); head.position.set(-D / 2 + 0.25, 2.12, W / 4); g.add(head);
  g.add(box(0.25, 0.02, 0.02, M.chrome, -D / 2 + 0.125, 2.14, W / 4));
  g.add(box(0.03, 0.1, 0.06, M.chrome, -D / 2 + 0.02, 1.1, W / 4));    // mezcladora
  return g;
}
const MAKE = { inodoro, lavamanos, ducha };
export async function loadSanitarios({ levels, colliders, floorTargets }) {
  const list = await fetch('./assets/bim/sanitarios.json').then(r => r.ok ? r.json() : []).catch(() => []);
  const rc = new THREE.Raycaster(), down = new THREE.Vector3(0, -1, 0); const added = [];
  for (const f of list) {
    rc.set(new THREE.Vector3(f.x, f.zhint + 1.0, -f.y), down);
    const h = rc.intersectObjects(floorTargets, false).find(h => h.face && h.face.normal.y > 0.3);
    const z = h ? h.point.y : f.zhint;
    const g = MAKE[f.tipo](f); g.position.set(f.x, z, -f.y); g.rotation.y = f.rot * Math.PI / 180;
    g.traverse(o => { if (o.isMesh) { o.castShadow = true; o.receiveShadow = true; } });
    g.userData = { generico: true, ...f, z };
    const L = f.room.startsWith('N0') ? 0 : Number(f.room[1]); levels[Math.min(L, 3)].group.add(g); added.push(g);
    const a = f.rot * Math.PI / 180;
    if (f.tipo === 'ducha') {  // sólo la mampara bloquea el paso
      const pl = f.w * 0.6, lx = f.d / 2 - 0.02, lz = -f.w / 2 + pl / 2;
      const px = f.x + lx * Math.cos(a) + lz * Math.sin(a) * 1, py = f.y + lx * Math.sin(a) - lz * Math.cos(a);
      colliders.push({ cx: px, cy: py, hl: pl / 2, ht: 0.02, ang: a + Math.PI / 2, z0: z, z1: z + 2.0, generico: true });
    } else colliders.push({ cx: f.x, cy: f.y, hl: f.d / 2, ht: f.w / 2, ang: a, z0: z, z1: z + (f.tipo === 'inodoro' ? 0.8 : 0.9), generico: true });
  }
  return added.length;
}
