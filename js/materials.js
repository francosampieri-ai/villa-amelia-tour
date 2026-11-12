// Materiales por rol + paletas conmutables (Moderno / Escandinavo / Lujo cálido, PLAN §7).
// Las UVs de muros y losas están en metros (builder.js), así que las texturas se repiten a escala real.
import * as THREE from 'three';
import * as TX from './textures.js';

export const PALETTES = {
  moderno: {
    label: 'Moderno',
    floorSocial: () => TX.tiles(0xd6d3cc, 1.2, 0xb3b0a9, 5, 10), floorBed: () => TX.plaster(0xb9b7b2, 3, 12, 8),
    wood: () => TX.wood(0x6b4a30, 0x3e2a18, 0.14, 7), metal: 0x1a1a1a, fabric: 0x9a9690, leather: 0x2a2a2c, accent: 0x3b3f44,
    counter: 0xf2f2ee, lightK: 4000,
  },
  escandinavo: {
    label: 'Escandinavo',
    floorSocial: () => TX.wood(0xd9bf96, 0xb99a6f, 0.2, 9), floorBed: () => TX.wood(0xd9bf96, 0xb99a6f, 0.2, 9),
    wood: () => TX.wood(0xd7c3a0, 0xb79a73, 0.14, 7), metal: 0xb8bcc0, fabric: 0xe4ded2, leather: 0xcdbfa9, accent: 0xdfd6c6,
    counter: 0xf4f3ef, lightK: 3000,
  },
  lujo: {
    label: 'Lujo cálido',
    floorSocial: () => TX.tiles(0xe3d6c0, 1.2, 0xc4b59b, 6, 18), floorBed: () => TX.wood(0x7a5a3c, 0x4a3320, 0.18, 10),
    wood: () => TX.wood(0x6e4a2e, 0x452b17, 0.14, 7), metal: 0xa8793d, fabric: 0x5c6b4a, leather: 0x8a5a3c, accent: 0xb9a48a,
    counter: 0xefe9dc, lightK: 2700,
  },
};

const M = {};  // registro de materiales por rol
export const mats = M;

function std(opts) { return new THREE.MeshStandardMaterial(opts); }

export function initMaterials(isMobile = false) {
  const aniso = isMobile ? 2 : 4;
  // Muros
  M.ext = std({ map: TX.plaster(0xf1eee7, 2, 8, 3), roughness: 0.9 });
  M.int = std({ map: TX.plaster(0xf5f3ee, 2, 6, 4), roughness: 0.92 });
  M.ant = M.ext;
  M.conc = std({ map: TX.plaster(0xa9a7a2, 2, 16, 5), roughness: 0.95 });
  M.earth = std({ map: TX.plaster(0x7d6b5a, 2, 18, 6), roughness: 1 });
  M.dark = std({ color: 0x2b2b2d, roughness: 0.6, metalness: 0.3 });
  M.planter = std({ map: TX.plaster(0xc9c4ba, 2, 12, 7), roughness: 0.95 });
  M.wood = std({ map: TX.wood(0x6b4a30, 0x3e2a18, 0.14, 7), roughness: 0.6 });
  M.woodSlats = std({ map: TX.wood(0x8a6240, 0x5a3c22, 0.08, 12), roughness: 0.65 });
  M.lamas = std({ color: 0x2a2a2a, roughness: 0.6, metalness: 0.3, alphaMap: TX.stripesAlpha(0.12, 0.07, true), alphaTest: 0.5, side: THREE.DoubleSide });
  M.celosia = std({ map: TX.wood(0x7a5533, 0x4a3320, 0.06, 15), roughness: 0.7, alphaMap: TX.latticeAlpha(0.58, 0.55, 0.07), alphaTest: 0.5, side: THREE.DoubleSide });
  M.rail = std({ color: 0x3a3a3a, roughness: 0.5, metalness: 0.6, alphaMap: TX.stripesAlpha(0.5, 0.04, true), alphaTest: 0.5, side: THREE.DoubleSide });
  M.vid = new THREE.MeshPhysicalMaterial({ color: 0xdfeef2, transparent: true, opacity: 0.22, roughness: 0.05, metalness: 0, transmission: 0, side: THREE.DoubleSide, depthWrite: false });
  M.glassRoof = M.vid;
  M.frame = std({ color: 0x1e1e20, roughness: 0.5, metalness: 0.5 });
  M.column = std({ map: TX.plaster(0xe8e5de, 2, 10, 9), roughness: 0.9 });
  // Pisos y techos
  M.garage = std({ map: TX.tiles(0x5e5f62, 0.6, 0x3c3d40, 21, 12), roughness: 0.7 });
  M.tileGrey = std({ map: TX.tiles(0xb9b8b4, 0.6, 0x8d8c88, 22, 10), roughness: 0.8 });
  M.concPolished = std({ map: TX.plaster(0xa3a19c, 3, 10, 23), roughness: 0.55 });
  M.grass = std({ map: TX.grass(0x5f8a3c, 13), roughness: 1 });
  M.grassDry = std({ map: TX.grass(0x7f9452, 14), roughness: 1 });
  M.gravel = std({ map: TX.plaster(0x8f8a80, 1, 40, 24), roughness: 1 });
  M.pavers = std({ map: TX.herringbone(0xc9c3b8, 0x8e8a82, 11), roughness: 0.85 });
  M.deckWood = std({ map: TX.wood(0x8e8a84, 0x5f5b56, 0.14, 16), roughness: 0.8 });
  M.sidewalk = std({ map: TX.tiles(0xbdbab2, 0.4, 0x8f8c85, 25, 8), roughness: 0.9 });
  M.asphalt = std({ map: TX.plaster(0x4a4b4e, 4, 14, 26), roughness: 1 });
  M.roof = std({ map: TX.plaster(0xd8d6d0, 3, 14, 27), roughness: 0.95 });
  M.ceiling = std({ color: 0xf7f6f2, roughness: 0.95 });
  M.stair = std({ map: TX.plaster(0xd3d0c8, 2, 10, 28), roughness: 0.8 });
  M.floorSocial = std({ map: PALETTES.moderno.floorSocial(), roughness: 0.35 });
  M.floorBed = std({ map: PALETTES.moderno.floorBed(), roughness: 0.6 });
  // Agua
  M.water = new THREE.MeshPhysicalMaterial({ color: 0x3fa9b8, transparent: true, opacity: 0.78, roughness: 0.08, metalness: 0.05, bumpMap: TX.waterBump(), bumpScale: 0.02, side: THREE.DoubleSide });
  M.poolTile = std({ map: TX.tiles(0x7fc7d0, 0.3, 0x5a9ea8, 31, 10), roughness: 0.5 });
  // Mobiliario (roles de paleta)
  M.fabric = std({ color: 0x9a9690, roughness: 0.95 });
  M.leather = std({ color: 0x2a2a2c, roughness: 0.6 });
  M.accent = std({ color: 0x3b3f44, roughness: 0.9 });
  M.metal = std({ color: 0x1a1a1a, roughness: 0.4, metalness: 0.8 });
  M.counter = std({ color: 0xf2f2ee, roughness: 0.3 });
  M.white = std({ color: 0xfafafa, roughness: 0.5 });
  M.ceramic = std({ color: 0xf4f4f2, roughness: 0.2 });
  M.chrome = std({ color: 0xcfd3d6, roughness: 0.25, metalness: 0.9 });
  M.screen = std({ color: 0x0a0a0c, roughness: 0.2, metalness: 0.4 });
  M.leaf = std({ color: 0x3f7a35, roughness: 0.9, side: THREE.DoubleSide });
  M.trunk = std({ color: 0x5a4532, roughness: 1 });
  M.hedge = std({ map: TX.grass(0x3e6b2c, 17, 1.5), roughness: 1 });
  M.pot = std({ color: 0x8c8780, roughness: 0.9 });
  M.mattress = std({ color: 0xf3f1ec, roughness: 0.95 });
  M.pillow = std({ color: 0xdcd6ca, roughness: 1 });
  M.carPaint = std({ color: 0x2b2f38, roughness: 0.3, metalness: 0.6 });
  M.tire = std({ color: 0x141414, roughness: 0.95 });
  M.lamp = new THREE.MeshStandardMaterial({ color: 0xfff4e0, emissive: 0xffe0b0, emissiveIntensity: 0.6, roughness: 0.6 });
  for (const m of Object.values(M)) if (m.map) m.map.anisotropy = aniso;
  return M;
}

/** Cambia la paleta interior en caliente (gancho para el prompt 4/7). */
export function setPalette(name) {
  const p = PALETTES[name]; if (!p) return;
  M.floorSocial.map = p.floorSocial(); M.floorSocial.needsUpdate = true;
  M.floorBed.map = p.floorBed(); M.floorBed.needsUpdate = true;
  M.wood.map = p.wood(); M.wood.needsUpdate = true;
  M.metal.color.setHex(p.metal); M.fabric.color.setHex(p.fabric); M.leather.color.setHex(p.leather);
  M.accent.color.setHex(p.accent); M.counter.color.setHex(p.counter);
  return p;
}

export function colorMat(color, roughness = 0.8) {
  return std({ color, roughness });
}
