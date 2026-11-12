// Texturas procedurales con canvas (sin archivos externos).
import * as THREE from 'three';

const cache = new Map();

function canvas(size) {
  const c = document.createElement('canvas');
  c.width = c.height = size;
  return [c, c.getContext('2d')];
}
function rnd(seed) {
  let s = seed >>> 0;
  return () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; };
}
function hex(c) { return '#' + c.toString(16).padStart(6, '0'); }
function mix(a, b, t) {
  const ar = a >> 16, ag = (a >> 8) & 255, ab = a & 255, br = b >> 16, bg = (b >> 8) & 255, bb = b & 255;
  return ((ar + (br - ar) * t) << 16) | ((ag + (bg - ag) * t) << 8) | (ab + (bb - ab) * t);
}
function noise(ctx, size, amount, seed = 1) {
  const r = rnd(seed), img = ctx.getImageData(0, 0, size, size), d = img.data;
  for (let i = 0; i < d.length; i += 4) {
    const n = (r() - 0.5) * amount;
    d[i] += n; d[i + 1] += n; d[i + 2] += n;
  }
  ctx.putImageData(img, 0, 0);
}
function finish(c, repeat, opts = {}) {
  const t = new THREE.CanvasTexture(c);
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.repeat.set(1 / repeat, 1 / repeat); // 1 textura = `repeat` metros
  t.anisotropy = 4;
  if (!opts.linear) t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

/** Color plano con ruido fino (yeso, concreto). */
export function plaster(color = 0xf2efe8, metersPerTile = 2, amount = 10, seed = 3) {
  const key = `plaster${color}-${amount}-${seed}`;
  if (cache.has(key)) return cache.get(key);
  const [c, ctx] = canvas(256);
  ctx.fillStyle = hex(color); ctx.fillRect(0, 0, 256, 256);
  noise(ctx, 256, amount, seed);
  const t = finish(c, metersPerTile); cache.set(key, t); return t;
}

/** Baldosas (porcelanato / mármol) con juntas. tile = lado de baldosa en m. */
export function tiles(base = 0xd9d6cf, tile = 0.6, joint = 0x9a978f, seed = 5, variation = 14) {
  const key = `tiles${base}-${tile}-${seed}`;
  if (cache.has(key)) return cache.get(key);
  const size = 512, n = Math.max(1, Math.round(2.4 / tile)), cell = size / n, r = rnd(seed);
  const [c, ctx] = canvas(size);
  ctx.fillStyle = hex(joint); ctx.fillRect(0, 0, size, size);
  for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) {
    const v = (r() - 0.5) * variation;
    ctx.fillStyle = hex(mix(base, v > 0 ? 0xffffff : 0x000000, Math.abs(v) / 255));
    ctx.fillRect(i * cell + 1.5, j * cell + 1.5, cell - 3, cell - 3);
  }
  noise(ctx, size, 8, seed + 1);
  const t = finish(c, n * tile); cache.set(key, t); return t;
}

/** Tablas de madera (planks a lo largo de x). */
export function wood(base = 0xb48a5a, dark = 0x7a5533, plankW = 0.18, seed = 7, meters = 2.4) {
  const key = `wood${base}-${dark}-${plankW}-${seed}`;
  if (cache.has(key)) return cache.get(key);
  const size = 512, r = rnd(seed), rows = Math.round(meters / plankW), rowH = size / rows;
  const [c, ctx] = canvas(size);
  for (let i = 0; i < rows; i++) {
    const col = mix(base, dark, r() * 0.7);
    ctx.fillStyle = hex(col); ctx.fillRect(0, i * rowH, size, rowH);
    // vetas
    ctx.strokeStyle = 'rgba(0,0,0,0.12)'; ctx.lineWidth = 1;
    for (let k = 0; k < 6; k++) {
      ctx.beginPath(); const y = i * rowH + r() * rowH; ctx.moveTo(0, y);
      for (let x = 0; x <= size; x += 64) ctx.lineTo(x, y + (r() - 0.5) * 3);
      ctx.stroke();
    }
    ctx.fillStyle = 'rgba(0,0,0,0.35)'; ctx.fillRect(0, i * rowH, size, 1.5);
    const cut = r() * size; ctx.fillRect(cut, i * rowH, 1.5, rowH);
  }
  noise(ctx, size, 10, seed + 2);
  const t = finish(c, meters); cache.set(key, t); return t;
}

/** Adoquín en espina de pez. */
export function herringbone(base = 0xc9c3b8, joint = 0x8e8a82, seed = 11) {
  const key = `herring${base}-${seed}`;
  if (cache.has(key)) return cache.get(key);
  const size = 512, r = rnd(seed), unit = 32; // bloque 0.1 × 0.2 m → textura de 1.6 m
  const [c, ctx] = canvas(size);
  ctx.fillStyle = hex(joint); ctx.fillRect(0, 0, size, size);
  for (let gy = -2; gy < size / unit + 2; gy++) for (let gx = -2; gx < size / unit + 2; gx++) {
    const v = (r() - 0.5) * 24;
    ctx.fillStyle = hex(mix(base, v > 0 ? 0xffffff : 0x000000, Math.abs(v) / 255));
    const x = gx * unit, y = gy * unit;
    if ((gx + gy) % 2 === 0) ctx.fillRect(x + 1, y + 1, unit * 2 - 2, unit - 2);
    else ctx.fillRect(x + 1, y + 1, unit - 2, unit * 2 - 2);
  }
  noise(ctx, size, 10, seed + 1);
  const t = finish(c, 1.6); cache.set(key, t); return t;
}

/** Césped. */
export function grass(base = 0x5f8a3c, seed = 13, meters = 3) {
  const key = `grass${base}-${seed}`;
  if (cache.has(key)) return cache.get(key);
  const size = 512, r = rnd(seed);
  const [c, ctx] = canvas(size);
  ctx.fillStyle = hex(base); ctx.fillRect(0, 0, size, size);
  for (let i = 0; i < 9000; i++) {
    ctx.fillStyle = hex(mix(base, r() > 0.5 ? 0xa8c86a : 0x2f4f1a, r() * 0.6));
    ctx.fillRect(r() * size, r() * size, 2, 3 + r() * 4);
  }
  noise(ctx, size, 14, seed + 1);
  const t = finish(c, meters); cache.set(key, t); return t;
}

/** Franjas (lamas / celosía): devuelve alphaMap con barras opacas cada `period` m de ancho `bar` m, verticales. */
export function stripesAlpha(period = 0.12, bar = 0.07, vertical = true, meters = 1.2) {
  const key = `stripes${period}-${bar}-${vertical}`;
  if (cache.has(key)) return cache.get(key);
  const size = 512, [c, ctx] = canvas(size), px = size / meters;
  ctx.fillStyle = '#000'; ctx.fillRect(0, 0, size, size);
  ctx.fillStyle = '#fff';
  for (let p = 0; p < meters; p += period) {
    if (vertical) ctx.fillRect(p * px, 0, bar * px, size); else ctx.fillRect(0, p * px, size, bar * px);
  }
  const t = finish(c, meters, { linear: true }); cache.set(key, t); return t;
}

/** Celosía de módulos (rejilla) como alphaMap: módulo mx × my m, listón de `bar` m. */
export function latticeAlpha(mx = 0.58, my = 0.55, bar = 0.06) {
  const key = `lattice${mx}-${my}-${bar}`;
  if (cache.has(key)) return cache.get(key);
  const size = 512, meters = 2.32, [c, ctx] = canvas(size), px = size / meters;
  ctx.fillStyle = '#000'; ctx.fillRect(0, 0, size, size);
  ctx.fillStyle = '#fff';
  for (let x = 0; x < meters; x += mx) ctx.fillRect(x * px, 0, bar * px, size);
  for (let y = 0; y < meters; y += my) ctx.fillRect(0, y * px, size, bar * px);
  const t = finish(c, meters, { linear: true }); cache.set(key, t); return t;
}

/** Cielo: gradiente vertical (horizonte → cénit). */
export function skyGradient(top = 0x6fa6d9, horizon = 0xe9eef2, bottom = 0xb9c2c6) {
  const [c, ctx] = canvas(256);
  const g = ctx.createLinearGradient(0, 0, 0, 256);
  g.addColorStop(0, hex(top)); g.addColorStop(0.5, hex(horizon)); g.addColorStop(1, hex(bottom));
  ctx.fillStyle = g; ctx.fillRect(0, 0, 256, 256);
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t;
}

/** Agua: ruido suave azul-verde (normal/bump). */
export function waterBump(seed = 21) {
  const key = 'water'; if (cache.has(key)) return cache.get(key);
  const size = 256, r = rnd(seed), [c, ctx] = canvas(size);
  ctx.fillStyle = '#808080'; ctx.fillRect(0, 0, size, size);
  for (let i = 0; i < 400; i++) {
    const x = r() * size, y = r() * size, rad = 10 + r() * 30;
    const g = ctx.createRadialGradient(x, y, 0, x, y, rad);
    g.addColorStop(0, `rgba(${r() > 0.5 ? 255 : 0},${r() > 0.5 ? 255 : 0},${r() > 0.5 ? 255 : 0},0.08)`); g.addColorStop(1, 'rgba(128,128,128,0)');
    ctx.fillStyle = g; ctx.fillRect(x - rad, y - rad, rad * 2, rad * 2);
  }
  const t = finish(c, 3, { linear: true }); cache.set(key, t); return t;
}
