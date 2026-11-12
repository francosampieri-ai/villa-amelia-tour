// Constructor de geometría: muros con huecos, losas, escaleras, rampas, columnas, lamas, terreno, piscina.
// Coordenadas del plano (x, y, z=cota) → Three.js (x, z, -y). UVs en metros (mundo) para texturas a escala.
import * as THREE from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import { mats } from './materials.js';

export const toWorld = (x, y, z) => new THREE.Vector3(x, z, -y);

/** Lote de geometrías por material; al final se fusionan en una malla por material. */
export class Batch {
  constructor() { this.lists = new Map(); }
  add(geom, matKey) {
    if (!this.lists.has(matKey)) this.lists.set(matKey, []);
    this.lists.get(matKey).push(geom);
  }
  flush(group, { shadows = true } = {}) {
    for (const [key, list] of this.lists) {
      if (!list.length) continue;
      const merged = list.length === 1 ? list[0] : mergeGeometries(list, false);
      const mat = mats[key] || mats.int;
      const mesh = new THREE.Mesh(merged, mat);
      const transparent = mat.transparent || mat.alphaTest > 0;
      mesh.castShadow = shadows && !mat.transparent;
      mesh.receiveShadow = shadows;
      mesh.name = 'batch:' + key;
      mesh.userData.matKey = key;
      if (transparent && mat.transparent) mesh.renderOrder = 2;
      group.add(mesh);
    }
    this.lists.clear();
  }
}

/** Reescribe las UVs de una geometría ya transformada a mundo: planos según la normal, en metros. */
export function uvWorld(geom, tangent = null) {
  const pos = geom.attributes.position, nor = geom.attributes.normal, uv = geom.attributes.uv;
  const tx = tangent ? tangent.x : 1, tz = tangent ? tangent.z : 0;
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i), y = pos.getY(i), z = pos.getZ(i);
    const nx = Math.abs(nor.getX(i)), ny = Math.abs(nor.getY(i));
    if (ny > 0.5) uv.setXY(i, x, z);
    else if (tangent) uv.setXY(i, x * tx + z * tz, y);
    else if (nx > 0.5) uv.setXY(i, z, y);
    else uv.setXY(i, x, y);
  }
  uv.needsUpdate = true;
  return geom;
}

/** Caja alineada a ejes en coordenadas de plano: x0..x1 × y0..y1 × z0..z1. */
export function boxGeom(x0, x1, y0, y1, z0, z1) {
  const g = new THREE.BoxGeometry(Math.max(x1 - x0, 0.001), Math.max(z1 - z0, 0.001), Math.max(y1 - y0, 0.001));
  g.translate((x0 + x1) / 2, (z0 + z1) / 2, -(y0 + y1) / 2);
  return uvWorld(g);
}

/** Caja orientada: centro (cx,cy) en planta, largo l a lo largo del ángulo ang (rad, antihorario en el plano x,y), ancho t, z0..z1. */
export function orientedBox(cx, cy, l, t, z0, z1, ang) {
  const g = new THREE.BoxGeometry(Math.max(l, 0.001), Math.max(z1 - z0, 0.001), Math.max(t, 0.001));
  // En Three.js una rotación +ang sobre Y lleva el eje x a (cos ang, 0, -sin ang) = dirección (cos ang, sin ang) del plano
  const m = new THREE.Matrix4().makeRotationY(ang);
  g.applyMatrix4(m);
  g.translate(cx, (z0 + z1) / 2, -cy);
  return uvWorld(g, new THREE.Vector3(Math.cos(ang), 0, -Math.sin(ang)));
}

// ---------------------------------------------------------------- Muros

export class WallFrame {
  constructor(w) {
    const dx = w.b[0] - w.a[0], dy = w.b[1] - w.a[1];
    this.L = Math.hypot(dx, dy); this.ux = dx / this.L; this.uy = dy / this.L;
    this.ang = Math.atan2(this.uy, this.ux);           // ángulo en planta (antihorario, plano x,y)
    this.axis = Math.abs(dx) >= Math.abs(dy) ? 0 : 1;   // eje dominante para cotas absolutas
    this.w = w;
  }
  /** Distancia a lo largo del muro para una cota absoluta sobre el eje dominante. */
  s(coord) { const u = this.axis === 0 ? this.ux : this.uy; return (coord - this.w.a[this.axis]) / u; }
  /** Punto en planta a distancia s del inicio, desplazado n en normal. */
  pt(s, n = 0) { return [this.w.a[0] + this.ux * s - this.uy * n, this.w.a[1] + this.uy * s + this.ux * n]; }
  box(s0, s1, z0, z1, t = this.w.t, n = 0) {
    const [cx, cy] = this.pt((s0 + s1) / 2, n);
    return orientedBox(cx, cy, s1 - s0, t, z0, z1, this.ang);
  }
}

/** Construye un muro con sus huecos. Devuelve la lista de sólidos para colisión. */
export function buildWall(w, batch, colliders) {
  const f = new WallFrame(w);
  const isGlass = w.mat === 'vid';
  const ops = (w.openings || []).map(o => {
    let s0 = f.s(o.a), s1 = f.s(o.b); if (s0 > s1) [s0, s1] = [s1, s0];
    return { ...o, s0: Math.max(0, s0), s1: Math.min(f.L, s1) };
  }).filter(o => o.s1 > o.s0).sort((a, b) => a.s0 - b.s0);

  const solid = (s0, s1, z0, z1) => {
    if (s1 - s0 < 0.005 || z1 - z0 < 0.005) return;
    batch.add(f.box(s0, s1, z0, z1), w.mat);
    const [cx, cy] = f.pt((s0 + s1) / 2);
    colliders.push({ cx, cy, hl: (s1 - s0) / 2, ht: w.t / 2, ang: f.ang, z0, z1 });
  };
  let cursor = 0;
  for (const o of ops) {
    solid(cursor, o.s0, w.z0, w.z1);
    if (o.z0 > w.z0 + 0.005) solid(o.s0, o.s1, w.z0, o.z0);          // antepecho
    if (o.z1 < w.z1 - 0.005) solid(o.s0, o.s1, o.z1, w.z1);          // dintel
    if (o.kind === 'window') {
      batch.add(f.box(o.s0, o.s1, o.z0, o.z1, 0.02), 'vid');
      frame(f, o.s0, o.s1, o.z0, o.z1, w.t, batch, true);
      const [cx, cy] = f.pt((o.s0 + o.s1) / 2);
      colliders.push({ cx, cy, hl: (o.s1 - o.s0) / 2, ht: w.t / 2, ang: f.ang, z0: o.z0, z1: o.z1 });
    } else if (o.kind === 'door' || o.kind === 'glassdoor') {
      frame(f, o.s0, o.s1, o.z0, o.z1, w.t, batch, false);
      if (o.kind === 'door' && o.leaf !== false) doorLeaf(f, o, w.t, batch);
    }
    cursor = o.s1;
  }
  solid(cursor, f.L, w.z0, w.z1);

  if (isGlass) glassFrames(f, w, ops, batch);
  return colliders;
}

function frame(f, s0, s1, z0, z1, t, batch, head) {
  const d = 0.06, tt = t + 0.02;
  batch.add(f.box(s0 - d, s0, z0, z1 + (head ? d : 0), tt), 'frame');
  batch.add(f.box(s1, s1 + d, z0, z1 + (head ? d : 0), tt), 'frame');
  batch.add(f.box(s0 - d, s1 + d, z1, z1 + d, tt), 'frame');
  if (head) batch.add(f.box(s0 - d, s1 + d, z0 - d, z0, tt), 'frame');
}

function doorLeaf(f, o, t, batch) {
  // Hoja abierta ~80°. o.swing: +1 hacia el lado +n (izquierda del sentido a→b), -1 hacia -n. o.hinge: 'a' (s0) | 'b' (s1).
  const w = o.s1 - o.s0, h = o.z1 - o.z0 - 0.02, sw = o.swing || 1, hingeB = o.hinge === 'b';
  const [hx, hy] = f.pt(hingeB ? o.s1 - 0.02 : o.s0 + 0.02, sw * t / 2);
  const ang = (hingeB ? f.ang + Math.PI : f.ang) + (hingeB ? -1 : 1) * sw * Math.PI / 2 * 0.9;
  const cx = hx + Math.cos(ang) * w / 2, cy = hy + Math.sin(ang) * w / 2;
  batch.add(orientedBox(cx, cy, w, 0.04, o.z0 + 0.01, o.z0 + 0.01 + h, ang), 'wood');
}

function glassFrames(f, w, ops, batch) {
  const tt = w.t + 0.03, bar = 0.06;
  // rieles superior e inferior
  batch.add(f.box(0, f.L, w.z0, w.z0 + 0.05, tt), 'frame');
  batch.add(f.box(0, f.L, w.z1 - 0.05, w.z1, tt), 'frame');
  batch.add(f.box(0, bar, w.z0, w.z1, tt), 'frame');
  batch.add(f.box(f.L - bar, f.L, w.z0, w.z1, tt), 'frame');
  for (const c of (w.mullions || [])) {
    const s = f.s(c); if (s <= 0 || s >= f.L) continue;
    batch.add(f.box(s - bar / 2, s + bar / 2, w.z0, w.z1, tt), 'frame');
  }
  for (const z of (w.transoms || [])) {
    if (z <= w.z0 || z >= w.z1) continue;
    let cursor = 0;
    for (const o of ops) { if (o.z1 > z && o.z0 < z) { batch.add(f.box(cursor, o.s0, z - 0.03, z + 0.03, tt), 'frame'); cursor = o.s1; } }
    batch.add(f.box(cursor, f.L, z - 0.03, z + 0.03, tt), 'frame');
  }
}

// ---------------------------------------------------------------- Losas, escaleras, rampas, columnas

/** Losa: cuerpo con material inferior y capa de acabado superior. Devuelve nada; los pisos se detectan por raycast. */
export function buildSlab(s, batch, floors) {
  const [x0, x1, y0, y1] = s.box;
  if (s.top === 'glassRoof') { batch.add(boxGeom(x0, x1, y0, y1, s.z0, s.z1), 'vid'); return; }
  batch.add(boxGeom(x0, x1, y0, y1, s.z0, s.z1), s.bottom || 'ceiling');
  const g = new THREE.PlaneGeometry(x1 - x0, y1 - y0);
  g.rotateX(-Math.PI / 2);
  g.translate((x0 + x1) / 2, s.z1 + 0.004, -(y0 + y1) / 2);
  uvWorld(g);
  batch.add(g, s.top || 'conc');
  if (floors) floors.push({ box: s.box, z: s.z1 });
}

export function buildFloorOverlay(f, batch) {
  const [x0, x1, y0, y1] = f.box;
  const g = new THREE.PlaneGeometry(x1 - x0, y1 - y0);
  g.rotateX(-Math.PI / 2); g.translate((x0 + x1) / 2, f.z, -(y0 + y1) / 2);
  batch.add(uvWorld(g), f.mat);
}

export function buildStair(st, batch, colliders) {
  const [x0, x1, y0, y1] = st.box, n = st.steps, rise = (st.z1 - st.z0) / n;
  const alongX = st.dir === '+x' || st.dir === '-x';
  const L = alongX ? x1 - x0 : y1 - y0, run = L / n;
  for (let i = 0; i < n; i++) {
    const zTop = st.z0 + rise * (i + 1), s0 = i * run, s1 = (i + 1) * run;
    let bx0, bx1, by0, by1;
    if (st.dir === '+x') { bx0 = x0 + s0; bx1 = x0 + s1; by0 = y0; by1 = y1; }
    else if (st.dir === '-x') { bx0 = x1 - s1; bx1 = x1 - s0; by0 = y0; by1 = y1; }
    else if (st.dir === '+y') { bx0 = x0; bx1 = x1; by0 = y0 + s0; by1 = y0 + s1; }
    else { bx0 = x0; bx1 = x1; by0 = y1 - s1; by1 = y1 - s0; }
    batch.add(boxGeom(bx0, bx1, by0, by1, st.z0 - 0.02, zTop), st.mat || 'stair');
  }
  if (st.rail) {
    // Baranda: pasamanos inclinado + postes, en el lado indicado ('+y' | '-y' | '+x' | '-x')
    const side = st.rail, h = 1.0, hyp = Math.hypot(L, st.z1 - st.z0), slope = Math.atan2(st.z1 - st.z0, L);
    const cx = (x0 + x1) / 2, cy = (y0 + y1) / 2, zc = (st.z0 + st.z1) / 2 + h;
    const px = side === '+x' ? x1 : side === '-x' ? x0 : cx, py = side === '+y' ? y1 : side === '-y' ? y0 : cy;
    const g = new THREE.BoxGeometry(alongX ? hyp : 0.05, 0.05, alongX ? 0.05 : hyp);
    if (alongX) g.rotateZ((st.dir === '+x' ? 1 : -1) * slope); else g.rotateX((st.dir === '+y' ? -1 : 1) * slope);
    g.translate(px, zc, -py);
    batch.add(uvWorld(g), 'frame');
    for (let i = 0; i <= n; i += 3) {
      const s = i * run, z = st.z0 + rise * i;
      const sx = alongX ? (st.dir === '+x' ? x0 + s : x1 - s) : px, sy = alongX ? py : (st.dir === '+y' ? y0 + s : y1 - s);
      batch.add(boxGeom(sx - 0.025, sx + 0.025, sy - 0.025, sy + 0.025, z, z + h), 'frame');
    }
    const gl = new THREE.BoxGeometry(alongX ? hyp : 0.02, 0.9, alongX ? 0.02 : hyp);
    if (alongX) gl.rotateZ((st.dir === '+x' ? 1 : -1) * slope); else gl.rotateX((st.dir === '+y' ? -1 : 1) * slope);
    gl.translate(px, zc - 0.5, -py); batch.add(uvWorld(gl), 'vid');
    colliders.push({ cx: px, cy: py, hl: L / 2, ht: 0.05, ang: alongX ? 0 : Math.PI / 2, z0: st.z0, z1: st.z1 + h });
  }
}

export function buildRamp(r, batch) {
  const [x0, x1, y0, y1] = r.box, L = y1 - y0, dz = r.zEnd - r.zStart;
  const g = new THREE.BoxGeometry(x1 - x0, 0.2, Math.hypot(L, dz));
  g.rotateX((r.dir === '+y' ? 1 : -1) * Math.atan2(dz, L));
  g.translate((x0 + x1) / 2, (r.zStart + r.zEnd) / 2 - 0.1, -(y0 + y1) / 2);
  batch.add(uvWorld(g), r.mat || 'conc');
}

export function buildColumn(c, batch, colliders) {
  const h = c.s / 2;
  batch.add(boxGeom(c.x - h, c.x + h, c.y - h, c.y + h, c.z0, c.z1), 'column');
  colliders.push({ cx: c.x, cy: c.y, hl: h, ht: h, ang: 0, z0: c.z0, z1: c.z1 });
}

export function buildLouvers(lv, batch) {
  const f = new WallFrame({ a: lv.a, b: lv.b, t: lv.w });
  for (let z = lv.z0 + lv.h / 2; z < lv.z1; z += lv.step) batch.add(f.box(0, f.L, z, z + lv.w, lv.h), lv.mat || 'dark');
}

// ---------------------------------------------------------------- Terreno y piscina

export function buildTerrain(t, group) {
  const shape = new THREE.Shape(t.polygon.map(([x, y]) => new THREE.Vector2(x, y)));
  for (const hole of (t.holes || [])) shape.holes.push(new THREE.Path(hole.map(([x, y]) => new THREE.Vector2(x, y))));
  const g = new THREE.ShapeGeometry(shape);
  g.rotateX(-Math.PI / 2); g.translate(0, t.z, 0);
  const mesh = new THREE.Mesh(uvWorld(g), mats[t.mat]);
  mesh.receiveShadow = true; mesh.name = 'terrain';
  group.add(mesh);
}

export function buildPool(p, batch, group) {
  const [x0, x1, y0, y1] = p.rim, [wx0, wx1, wy0, wy1] = p.water;
  batch.add(boxGeom(x0, x1, y0, y1, p.zBottom - 0.2, p.zBottom), 'poolTile');
  batch.add(boxGeom(x0, wx0, y0, y1, p.zBottom, p.zRim), 'poolTile');
  batch.add(boxGeom(wx1, x1, y0, y1, p.zBottom, p.zRim), 'poolTile');
  batch.add(boxGeom(wx0, wx1, y0, wy0, p.zBottom, p.zRim), 'poolTile');
  batch.add(boxGeom(wx0, wx1, wy1, y1, p.zBottom, p.zRim), 'poolTile');
  // Escalera de obra en el extremo este
  for (let i = 0; i < 4; i++) batch.add(boxGeom(wx1 - 0.35 * (i + 1), wx1 - 0.35 * i, wy0, wy1, p.zBottom, p.zRim - 0.3 * (i + 1)), 'poolTile');
  const w = new THREE.PlaneGeometry(wx1 - wx0, wy1 - wy0);
  w.rotateX(-Math.PI / 2); w.translate((wx0 + wx1) / 2, p.zWater, -(wy0 + wy1) / 2);
  const water = new THREE.Mesh(uvWorld(w), mats.water);
  water.name = 'water'; water.renderOrder = 3; group.add(water);
}

// ---------------------------------------------------------------- Nivel completo

/** Construye un nivel (o el sitio/techo) en un Group. Devuelve { group, colliders, floors }. */
export function buildLevel(data, furnitureBuilder, opts = {}) {
  const group = new THREE.Group(); group.name = data.name || 'level';
  const batch = new Batch(), colliders = [], floors = [];
  for (const w of (data.walls || [])) buildWall(w, batch, colliders);
  for (const c of (data.columns || [])) buildColumn(c, batch, colliders);
  for (const s of (data.slabs || [])) buildSlab(s, batch, floors);
  for (const f of (data.floors || [])) buildFloorOverlay(f, batch);
  for (const st of (data.stairs || [])) buildStair(st, batch, colliders);
  for (const r of (data.ramps || [])) buildRamp(r, batch);
  for (const lv of (data.louvers || [])) buildLouvers(lv, batch);
  batch.flush(group, { shadows: opts.shadows !== false });
  if (furnitureBuilder && data.furniture) {
    const fg = furnitureBuilder(data.furniture, colliders);
    fg.name = 'furniture'; group.add(fg);
  }
  return { group, colliders, floors };
}
