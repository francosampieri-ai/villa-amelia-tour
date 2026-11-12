// Mobiliario base con primitivas (cajas/cilindros). Cada mueble se construye en su marco local
// (x = ancho w, y = alto h, z = fondo d) y se coloca con toWorld(x, y, z) y giro en planta.
import * as THREE from 'three';
import { mats, colorMat } from './materials.js';

const deg = Math.PI / 180;
const NO_COLLIDE = new Set(['rug', 'pendant', 'hood', 'painting', 'tv', 'planter', 'umbrella', 'pergola', 'headboard', 'floorLamp']);

function box(g, w, h, d, x, y, z, mat) {
  const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat);
  m.position.set(x, y + h / 2, z); m.castShadow = true; m.receiveShadow = true; g.add(m); return m;
}
function cyl(g, r, h, x, y, z, mat, seg = 16, rTop = r) {
  const m = new THREE.Mesh(new THREE.CylinderGeometry(rTop, r, h, seg), mat);
  m.position.set(x, y + h / 2, z); m.castShadow = true; m.receiveShadow = true; g.add(m); return m;
}
function sphere(g, r, x, y, z, mat, seg = 12) {
  const m = new THREE.Mesh(new THREE.SphereGeometry(r, seg, seg), mat);
  m.position.set(x, y, z); m.castShadow = true; g.add(m); return m;
}
function legs(g, w, d, h, inset = 0.05, r = 0.025, mat = mats.metal) {
  for (const sx of [-1, 1]) for (const sz of [-1, 1]) cyl(g, r, h, sx * (w / 2 - inset), 0, sz * (d / 2 - inset), mat, 8);
}
function seat(g, w, d, h, mat, back = true, armsW = 0.15) {
  const seatH = Math.min(0.42, h * 0.55);
  box(g, w, seatH - 0.14, d, 0, 0.08, 0, mats.accent);                               // base
  box(g, w - 2 * armsW, 0.14, d - 0.12, 0, seatH - 0.14, 0.04, mat);                 // cojín de asiento
  if (back) box(g, w - 2 * armsW, h - seatH, 0.18, 0, seatH, -d / 2 + 0.09, mat);     // respaldo
  if (armsW > 0) for (const sx of [-1, 1]) box(g, armsW, seatH + 0.18, d, sx * (w / 2 - armsW / 2), 0.08, 0, mats.accent);
  legs(g, w, d, 0.08, 0.08, 0.02);
}

const B = {
  car(g, w, d, h, o) {
    const paint = o.color ? colorMat(o.color, 0.3) : mats.carPaint; paint.metalness = 0.5;
    box(g, w, h * 0.45, d, 0, 0.25, 0, paint);
    box(g, w * 0.9, h * 0.38, d * 0.52, 0, 0.25 + h * 0.45, -d * 0.05, mats.screen);
    for (const sx of [-1, 1]) for (const sz of [-1, 1]) { const t = cyl(g, 0.33, 0.22, sx * (w / 2 - 0.05), 0.33, sz * d * 0.32, mats.tire, 14); t.rotation.z = Math.PI / 2; }
  },
  appliance(g, w, d, h) { box(g, w, h, d, 0, 0, 0, mats.white); box(g, w * 0.6, w * 0.6, 0.02, 0, h * 0.25, d / 2, mats.screen); },
  counter(g, w, d, h) { box(g, w, h - 0.04, d, 0, 0, 0, mats.wood); box(g, w + 0.02, 0.04, d + 0.02, 0, h - 0.04, 0, mats.counter); },
  island(g, w, d, h) { box(g, w, h - 0.04, d, 0, 0, 0, mats.accent); box(g, w + 0.3, 0.04, d + 0.1, 0, h - 0.04, 0, mats.counter); },
  cabinet(g, w, d, h) { box(g, w, h, d, 0, 0, 0, mats.wood); },
  closet(g, w, d, h) { box(g, w, h, d, 0, 0, 0, mats.wood); for (let i = 1; i < Math.max(w, d) / 0.5; i++) box(g, w > d ? 0.01 : w + 0.01, h - 0.1, w > d ? d + 0.01 : 0.01, w > d ? -w / 2 + i * 0.5 : 0, 0.05, w > d ? 0 : -d / 2 + i * 0.5, mats.frame); },
  fridge(g, w, d, h) { box(g, w, h, d, 0, 0, 0, mats.chrome); },
  ovenTower(g, w, d, h) { box(g, w, h, d, 0, 0, 0, mats.accent); box(g, 0.02, 0.5, d * 0.8, w / 2, 0.9, 0, mats.screen); box(g, 0.02, 0.4, d * 0.8, w / 2, 1.5, 0, mats.screen); },
  hood(g, w, d, h, o) { box(g, w, h, d, 0, (o.hang || 1.6), 0, mats.chrome); },
  bed(g, w, d, h, o) {
    box(g, w, 0.25, d, 0, 0.1, 0, mats.wood); box(g, w - 0.1, 0.22, d - 0.1, 0, 0.35, 0, mats.mattress);
    const head = o.headAt || (w > d ? '-x' : '-y'); // cabecera
    const hx = head === '-x' ? -w / 2 : head === '+x' ? w / 2 : 0, hz = head === '-y' ? d / 2 : head === '+y' ? -d / 2 : 0;
    if (hx) box(g, 0.08, 1.1, d, hx, 0, 0, mats.leather); else box(g, w, 1.1, 0.08, 0, 0, hz, mats.leather);
    const n = Math.max(w, d) > 1.8 ? 2 : 1;
    for (let i = 0; i < n; i++) {
      const off = (i - (n - 1) / 2) * 0.5;
      if (hx) box(g, 0.15, 0.25, 0.45, hx * 0.8, 0.57, off, mats.pillow); else box(g, 0.45, 0.25, 0.15, off, 0.57, hz * 0.8, mats.pillow);
    }
  },
  headboard(g, w, d, h) { box(g, w, h, d, 0, 0, 0, mats.wood); },
  nightstand(g, w, d, h) { box(g, w, h, d, 0, 0, 0, mats.wood); cyl(g, 0.1, 0.35, 0, h, 0, mats.lamp, 10); },
  toilet(g, w, d, h) { box(g, w, 0.4, d * 0.6, 0, 0, d * 0.15, mats.ceramic); box(g, w * 0.9, h - 0.4, 0.18, 0, 0.4, -d / 2 + 0.09, mats.ceramic); },
  sink(g, w, d, h) { box(g, w, h - 0.15, d, 0, 0, 0, mats.wood); box(g, w + 0.02, 0.15, d + 0.02, 0, h - 0.15, 0, mats.ceramic); cyl(g, 0.012, 0.25, 0, h, -d * 0.3, mats.chrome, 8); },
  doubleSink(g, w, d, h) { B.sink(g, w, d, h); cyl(g, 0.012, 0.25, -w * 0.25, h, -d * 0.3, mats.chrome, 8); cyl(g, 0.012, 0.25, w * 0.25, h, -d * 0.3, mats.chrome, 8); },
  shower(g, w, d, h) { box(g, w, 0.05, d, 0, 0, 0, mats.ceramic); const gl = box(g, 0.01, h, d, w / 2, 0, 0, mats.vid); gl.castShadow = false; box(g, w, 0.01, d, 0, h - 0.3, 0, mats.vid).castShadow = false; cyl(g, 0.012, h - 0.3, -w / 2 + 0.08, 0, 0, mats.chrome, 8); },
  bathtub(g, w, d, h) { box(g, w, h, d, 0, 0, 0, mats.ceramic); box(g, w - 0.16, 0.02, d - 0.16, 0, h - 0.12, 0, mats.water); },
  shelf(g, w, d, h) { box(g, w, h, d, 0, 0, 0, mats.wood); },
  sideboard(g, w, d, h) { box(g, w, h, d, 0, 0, 0, mats.wood); },
  barCabinet(g, w, d, h) { box(g, w, h, d, 0, 0, 0, mats.wood); for (let i = 1; i < 5; i++) box(g, 0.02, 0.02, d - 0.1, w / 2, i * h / 5, 0, mats.lamp); },
  bar(g, w, d, h) { box(g, w, h - 0.05, d, 0, 0, 0, mats.accent); box(g, w + 0.25, 0.05, d + 0.1, 0.1, h - 0.05, 0, mats.counter); },
  grill(g, w, d, h) { box(g, w, h, d, 0, 0, 0, mats.dark); box(g, w, 0.04, d, 0, h, 0, mats.chrome); },
  desk(g, w, d, h) { box(g, w, 0.04, d, 0, h - 0.04, 0, mats.wood); legs(g, w, d, h - 0.04, 0.05, 0.02); },
  diningTable(g, w, d, h) { box(g, w, 0.05, d, 0, h - 0.05, 0, mats.wood); legs(g, w, d, h - 0.05, 0.08, 0.03, mats.wood); },
  coffeeTable(g, w, d, h) { cyl(g, Math.min(w, d) / 2, 0.04, 0, h - 0.04, 0, mats.wood, 24); cyl(g, 0.03, h - 0.04, 0, 0, 0, mats.metal, 8); cyl(g, Math.min(w, d) / 3, 0.02, 0, 0, 0, mats.metal, 24); },
  roundTable(g, w, d, h) { cyl(g, w / 2, 0.04, 0, h - 0.04, 0, mats.counter, 24); cyl(g, 0.04, h, 0, 0, 0, mats.metal, 8); cyl(g, w / 4, 0.03, 0, 0, 0, mats.metal, 20); },
  chair(g, w, d, h) { box(g, w, 0.05, d, 0, 0.42, 0, mats.wood); box(g, w, h - 0.47, 0.04, 0, 0.47, -d / 2 + 0.02, mats.wood); legs(g, w, d, 0.42, 0.03, 0.015, mats.wood); },
  stool(g, w, d, h) { cyl(g, w / 2, 0.06, 0, h - 0.06, 0, mats.leather, 16); cyl(g, 0.02, h - 0.06, 0, 0, 0, mats.metal, 8); cyl(g, w / 2.5, 0.02, 0, 0, 0, mats.metal, 16); },
  sofa(g, w, d, h) { seat(g, w, d, h, mats.fabric, true, 0.18); },
  outSofa(g, w, d, h) { seat(g, w, d, h, mats.pillow, true, 0.12); },
  chaise(g, w, d, h) { seat(g, w, d, h, mats.fabric, false, 0.0); box(g, 0.2, 0.3, d, -w / 2 + 0.1, h - 0.4, 0, mats.fabric); },
  armchair(g, w, d, h) { seat(g, w, d, h, mats.leather, true, 0.15); },
  daybed(g, w, d, h) { box(g, w, 0.15, d, 0, 0.15, 0, mats.wood); box(g, w - 0.05, 0.15, d - 0.05, 0, 0.3, 0, mats.fabric); },
  pouf(g, w, d, h) { cyl(g, w / 2, h, 0, 0, 0, mats.fabric, 16); },
  bench(g, w, d, h) { box(g, w, 0.06, d, 0, h - 0.06, 0, mats.wood); box(g, 0.05, h - 0.06, d, -w / 2 + 0.05, 0, 0, mats.wood); box(g, 0.05, h - 0.06, d, w / 2 - 0.05, 0, 0, mats.wood); },
  lounger(g, w, d, h) { box(g, w, 0.08, d, 0, h - 0.08, 0, mats.pillow); const b = box(g, w, 0.08, d * 0.3, 0, h, -d * 0.35, mats.pillow); b.rotation.x = -0.6; legs(g, w, d, h - 0.08, 0.05, 0.02); },
  rug(g, w, d, h, o) { const m = box(g, w, 0.012, d, 0, 0, 0, colorMat(o.color || 0xbbb3a4, 1)); m.castShadow = false; },
  tv(g, w, d, h) { const m = box(g, Math.max(w, 0.05), h, Math.max(d, 0.05), 0, 0.9, 0, mats.screen); m.castShadow = false; },
  painting(g, w, d, h, o) { box(g, Math.max(w, 0.04), h, Math.max(d, 0.04), 0, 1.2, 0, mats.frame); box(g, w > d ? w - 0.06 : 0.05, h - 0.06, w > d ? 0.05 : d - 0.06, 0, 1.23, 0, colorMat(o.color || 0x6b6a60, 0.9)); },
  pendant(g, w, d, h, o) { const y = o.hang || 2.2; box(g, w, h, d, 0, y, 0, mats.lamp); cyl(g, 0.005, 1.0, -w / 3, y + h, 0, mats.metal, 6); cyl(g, 0.005, 1.0, w / 3, y + h, 0, mats.metal, 6); },
  floorLamp(g, w, d, h) { cyl(g, 0.15, 0.02, 0, 0, 0, mats.metal); cyl(g, 0.012, h - 0.3, 0, 0, 0, mats.metal, 8); cyl(g, 0.18, 0.3, 0, h - 0.3, 0, mats.lamp, 16, 0.14); },
  plant(g, w, d, h) { cyl(g, w * 0.3, h * 0.3, 0, 0, 0, mats.pot, 12, w * 0.35); for (let i = 0; i < 6; i++) { const s = sphere(g, w * 0.3, Math.cos(i) * w * 0.25, h * 0.3 + h * 0.35 + Math.sin(i * 2) * h * 0.15, Math.sin(i) * w * 0.25, mats.leaf, 8); s.scale.y = 1.5; } },
  shrub(g, w, d, h) { sphere(g, w / 2, 0, h / 2, 0, mats.hedge, 10); sphere(g, w / 3, w / 4, h * 0.6, 0, mats.hedge, 8); },
  planterPot(g, w, d, h) { cyl(g, w / 2, h * 0.5, 0, 0, 0, mats.pot, 14, w / 2.4); B.plant(g, w * 1.3, d, h, {}); },
  planter(g, w, d, h) { box(g, w, 0.15, d, 0, 0, 0, mats.planter); for (let i = 0; i < w / 0.4; i++) sphere(g, 0.18, -w / 2 + 0.2 + i * 0.4, 0.3, 0, mats.leaf, 7); },
  hedge(g, w, d, h) { box(g, w, h, d, 0, 0, 0, mats.hedge); },
  tree(g, w, d, h) { cyl(g, 0.18, h * 0.45, 0, 0, 0, mats.trunk, 10, 0.12); sphere(g, h * 0.3, 0, h * 0.7, 0, mats.leaf, 12); sphere(g, h * 0.22, h * 0.2, h * 0.6, 0.3, mats.leaf, 10); sphere(g, h * 0.22, -h * 0.18, h * 0.65, -0.3, mats.leaf, 10); },
  palm(g, w, d, h) { cyl(g, 0.16, h * 0.9, 0, 0, 0, mats.trunk, 10, 0.1); for (let i = 0; i < 9; i++) { const leaf = box(g, 2.6, 0.04, 0.5, 0, h * 0.9, 0, mats.leaf); leaf.geometry.translate(1.3, 0, 0); leaf.rotation.set(0, i * 40 * deg, -0.5 - (i % 2) * 0.3); } },
  umbrella(g, w, d, h) { cyl(g, 0.03, h, 0, 0, 0, mats.metal, 8); cyl(g, w / 2, 0.35, 0, h - 0.35, 0, mats.pillow, 8, 0.05); },
  dome(g, w, d, h) { const m = new THREE.Mesh(new THREE.SphereGeometry(w / 2, 10, 6, 0, Math.PI * 2, 0, Math.PI / 2), mats.rail.clone()); m.material.alphaMap = null; m.material.alphaTest = 0; m.material.wireframe = true; m.position.y = 0; g.add(m); },
  gymBar(g, w, d, h) { for (const sx of [-1, 1]) cyl(g, 0.04, h, sx * (w / 2 - 0.05), 0, 0, mats.metal, 8); const b = cyl(g, 0.02, w, 0, h - 0.02, 0, mats.metal, 8); b.rotation.z = Math.PI / 2; const s = box(g, 0.6, 0.05, 2.0, -w / 4, h / 2, d / 2 + 0.8, mats.ceramic); s.rotation.x = -0.6; },
  pergola(g, w, d, h) { for (const sx of [-1, 1]) for (const sz of [-1, 1]) box(g, 0.12, h, 0.12, sx * (w / 2 - 0.06), 0, sz * (d / 2 - 0.06), mats.dark); for (let x = -w / 2; x <= w / 2; x += 0.4) box(g, 0.06, 0.15, d, x, h - 0.15, 0, mats.dark); },
  pole(g, w, d, h) { cyl(g, 0.08, h, 0, 0, 0, mats.dark, 8, 0.05); box(g, 0.5, 0.12, 0.2, 0.25, h - 0.1, 0, mats.dark); box(g, 0.3, 0.06, 0.16, 0.4, h - 0.16, 0, mats.lamp); },
};

/** Construye todos los muebles de una lista; añade colisionadores para los voluminosos. */
export function buildFurniture(list, colliders) {
  const root = new THREE.Group();
  for (const it of list) {
    const fn = B[it.type]; if (!fn) { console.warn('mueble desconocido', it.type); continue; }
    const g = new THREE.Group();
    fn(g, it.w, it.d, it.h, it);
    g.position.set(it.x, it.z, -it.y); g.rotation.y = it.rot * deg;
    g.name = it.type; root.add(g);
    if (!NO_COLLIDE.has(it.type) && colliders && it.h > 0.3) {
      const slim = it.type === 'tree' || it.type === 'palm' || it.type === 'pole';
      colliders.push({ cx: it.x, cy: it.y, hl: slim ? 0.25 : it.w / 2, ht: slim ? 0.25 : it.d / 2, ang: it.rot * deg, z0: it.z, z1: it.z + Math.min(it.h, 2.5) });
    }
  }
  return root;
}
