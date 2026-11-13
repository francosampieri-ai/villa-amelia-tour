// Calidad realista (prototipo): PBR Poly Haven (CC0) + HDRI como luz ambiente + muebles GLB reales en el área social.
// Se aplica después de construir la escena; el recorrido y los colisionadores no cambian.
import * as THREE from 'three';
import { RGBELoader } from 'three/addons/loaders/RGBELoader.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { mats, setPalette } from './materials.js';

const TL = new THREE.TextureLoader();
function tex(path, color, size, aniso) {
  const t = TL.load(path); t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(1 / size, 1 / size);
  t.anisotropy = aniso; if (color) t.colorSpace = THREE.SRGBColorSpace; return t;
}
function pbr(m, name, res, size, { tint, rough = 1, nScale = 0.8, aniso = 8, noDiff = false } = {}) {
  if (!m) return; const d = `./assets/tex/${name}/`;
  m.map = noDiff ? null : tex(d + `diff_${res}.jpg`, true, size, aniso);
  m.normalMap = tex(d + `nor_${res}.jpg`, false, size, aniso); m.normalScale = new THREE.Vector2(nScale, nScale);
  m.roughnessMap = tex(d + (m.__arm ? `arm_${res}.jpg` : `rough_${res}.jpg`), false, size, aniso);
  m.roughness = rough; m.color = new THREE.Color(tint ?? 0xffffff); m.needsUpdate = true;
}
const SWAP = {};  // con el BIM, los muebles son los del modelo Revit

export async function applyHQ({ scene, renderer, daylight, levels, isMobile }) {
  const res = isMobile ? '1k' : '1k';  // 2k solo para el piso social en escritorio
  setPalette('lujo');
  const M = mats;
  pbr(M.floorSocial, 'marble_01', '2k', 2.4, { tint: 0xfff1dc, rough: 0.5, nScale: 0.3 });
  pbr(M.floorBed, 'oak_veneer_01', res, 1.5, { rough: 0.9 });
  pbr(M.wood, 'natural_walnut_veneer', '2k', 1.0, { rough: 0.9 });
  pbr(M.woodSlats, 'natural_walnut_veneer', '2k', 1.0, { rough: 0.9 });
  pbr(M.int, 'plastered_wall_02', res, 2.0, { tint: 0xfff6ea, nScale: 0.4 });
  pbr(M.column, 'plastered_wall_02', res, 2.0, { tint: 0xfff6ea, nScale: 0.4 });
  pbr(M.ext, 'plastered_wall_02', res, 2.0, { tint: 0xfffaf2, nScale: 0.4 });
  pbr(M.fabric, 'rough_linen', res, 0.5, { tint: 0xe9dcc6, noDiff: true });
  pbr(M.leather, 'brown_leather', res, 0.6);
  pbr(M.accent, 'velour_velvet', res, 0.5, { tint: 0xb4694c, noDiff: true });
  pbr(M.deckWood, 'wood_floor_deck', res, 2.0);
  pbr(M.pavers, 'floor_tiles_06', res, 2.0);
  pbr(M.conc, 'concrete_floor_02', res, 2.0);
  pbr(M.counter, 'marble_01', '2k', 1.5, { rough: 0.35, nScale: 0.2 });
  // cielo raso de madera cálida como el video de referencia
  pbr(M.ceiling, 'oak_veneer_01', res, 1.5, { tint: 0xf0d9bd, rough: 0.9 });
  if (M.metal) { M.metal.color.set(0x9a6b3a); M.metal.roughness = 0.35; M.metal.metalness = 1; }

  // HDRI como iluminación ambiente (reflejos e indirecta); se baja la luz plana de relleno
  const hdr = await new RGBELoader().loadAsync('./assets/sky_1k.hdr'); hdr.mapping = THREE.EquirectangularReflectionMapping;
  const pm = new THREE.PMREMGenerator(renderer); scene.environment = pm.fromEquirectangular(hdr).texture; hdr.dispose(); pm.dispose();
  scene.environmentIntensity = 0.55;
  // cielo de fondo: el mismo HDRI (LDR 2k, bajo el horizonte = neblina) girado para que su sol coincida con el sol de la web
  const bg = await new THREE.TextureLoader().loadAsync('./assets/sky_bg.jpg'); bg.mapping = THREE.EquirectangularReflectionMapping; bg.colorSpace = THREE.SRGBColorSpace;
  const sd = daylight.sun.position.clone().sub(daylight.sun.target.position); const phiW = Math.atan2(sd.z, sd.x), phiS = (0.5947 - 0.5) * 2 * Math.PI;
  scene.background = bg; scene.backgroundRotation.set(0, phiS - phiW, 0); scene.backgroundIntensity = 1.25;
  daylight.hemi.intensity = 0.35; daylight.ambient.intensity = 0.08;
  if (new URLSearchParams(location.search).get('hora') === 'atardecer') {   // preset opcional: sol rasante, cielo de crepúsculo, luminarias (lightmap dusk)
    daylight.setHour(17.85); daylight.hemi.intensity = 0.08; daylight.ambient.intensity = 0.02;
    const dk = await new THREE.TextureLoader().loadAsync('./assets/sky_dusk.jpg'); dk.mapping = THREE.EquirectangularReflectionMapping; dk.colorSpace = THREE.SRGBColorSpace;
    const sd2 = daylight.sun.position.clone().sub(daylight.sun.target.position);
    scene.background = dk; scene.backgroundRotation.set(0, phiS - Math.atan2(sd2.z, sd2.x), 0); scene.backgroundIntensity = 0.5; scene.environmentIntensity = 0.12;
    window.__hora = 'atardecer';
  }
  daylight.sun.shadow.radius = isMobile ? 2 : 5; daylight.sun.shadow.blurSamples = 16;
  if (!isMobile) daylight.sun.shadow.mapSize.set(4096, 4096);
  renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = 1.05;

  // Muebles GLB reales en el área social de N1 (los volúmenes originales se ocultan; los colisionadores siguen iguales)
  scene.updateMatrixWorld(true);
  const gl = new GLTFLoader(); const cache = {};
  const load = n => cache[n] ??= gl.loadAsync(`./assets/models/${n}/${n}.gltf`).then(g => g.scene);
  const jobs = [];
  levels[1].group.traverse(g => {
    if (!SWAP[g.name] || !g.isGroup) return;
    const p = g.position; if (p.x < 5 || p.x > 22 || -p.z < 9 || -p.z > 18.5) return;
    jobs.push(load(SWAP[g.name]).then(src => {
      const bb = new THREE.Box3().setFromObject(g, true); const sz = bb.getSize(new THREE.Vector3());
      const inv = g.matrixWorld.clone().invert(); const loc = bb.clone().applyMatrix4(inv); const lsz = loc.getSize(new THREE.Vector3());
      const m = src.clone(true); const mb = new THREE.Box3().setFromObject(m); const ms = mb.getSize(new THREE.Vector3());
      const s = Math.max(lsz.x, lsz.z) / Math.max(ms.x, ms.z);
      m.scale.setScalar(s); const c = mb.getCenter(new THREE.Vector3());
      m.position.set(-c.x * s, -mb.min.y * s + loc.min.y, -c.z * s);
      if (lsz.z > lsz.x * 1.2 !== ms.z > ms.x * 1.2) m.rotation.y = Math.PI / 2;
      m.traverse(o => { if (o.isMesh) { o.castShadow = true; o.receiveShadow = true; } });
      g.children.forEach(ch => ch.visible = false); g.add(m);
    }).catch(e => console.warn('GLB', g.name, e)));
  });
  await Promise.all(jobs);
  return { swapped: jobs.length };
}
