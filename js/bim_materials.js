// Acabados PBR sobre la geometría BIM. Regla: el COLOR es siempre el del material Revit; la textura (CC0, Poly Haven o generada)
// sólo aporta el detalle (veta, junta, rugosidad, relieve). El rol sale del nombre de tipo Revit (scripts/bim_roles.py).
import * as THREE from 'three';
const TL = new THREE.TextureLoader();
//            textura                modo     tamaño(m) rugosidad metal  relieve
const R = {
  porcelain:   { tex: 'porcelanato_120', mode: 'gray', size: 1.2, rough: 1, nScale: 1, env: 0.5 },
  woodFloor:   { tex: 'oak_veneer_01', mode: 'gray', size: 1.5, rough: 0.7, nScale: 0.5 },
  concrete:    { tex: 'concrete_floor_02', mode: 'gray', size: 2.0, rough: 1, nScale: 0.6, env: 0.3 },
  grass:       { tex: 'leafy_grass', mode: 'gray', size: 2.0, rough: 1, nScale: 1, color: 0x6f8f4a },  // Revit trae un placeholder casi blanco
  stoneCounter:{ tex: 'marble_01', mode: 'gray', size: 1.5, rough: 0.35, nScale: 0.2, roughFixed: true },
  plaster:     { tex: 'plastered_wall_02', mode: 'gray', size: 2.0, rough: 1, nScale: 0.25, detail: 0.6, env: 0.2 },
  dektonTrevi: { tex: 'marble_01', mode: 'gray', size: 2.4, rough: 0.4, nScale: 0.2, roughFixed: true },
  dektonKadum: { tex: 'concrete_floor_02', mode: 'gray', size: 2.0, rough: 0.7, nScale: 0.4, roughFixed: true },
  stoneRustic: { tex: 'castle_wall_slates', mode: 'gray', size: 1.6, rough: 1, nScale: 1.0, env: 0.4 },
  lacquer:     { rough: 0.55, env: 0.45 },
  woodStair:   { tex: 'oak_veneer_01', mode: 'gray', size: 1.2, rough: 0.6, nScale: 0.4, detail: 0.6, env: 0.35, roughFixed: true },
  woodSlat:    { tex: 'natural_walnut_veneer', mode: 'gray', size: 1.0, rough: 0.6, nScale: 0.4 },
  woodCeil:    { tex: 'listones_cielo', mode: 'gray', size: 1.2, rough: 1, nScale: 0.8, env: 0.25 },   // cielo de listones (aprobado por Franco 13-nov)
  woodDoor:    { tex: 'oak_veneer_01', mode: 'gray', size: 1.2, rough: 0.6, nScale: 0.3 },
  furnWood:    { tex: 'oak_veneer_01', mode: 'gray', size: 0.8, rough: 0.62, nScale: 0.3, detail: 0.55, env: 0.3, whiteDetail: 0.2, roughFixed: true },
  metal:       { rough: 0.38, metal: 0.65 },
  fabric:      { tex: 'wool_boucle', mode: 'gray', size: 0.35, rough: 1, nScale: 0.9, detail: 0.5, env: 0.15 },
  // 'Sofá Clausi Beige': el color render de Revit es camel (195,162,134); el tipo dice Beige -> beige Clausi (ajuste estético, ver AUDITORIA)
  fabricBeige: { tex: 'wool_boucle', mode: 'gray', size: 0.35, rough: 1, nScale: 0.9, detail: 0.45, env: 0.15, recolor: 0xd8cbb8 },
  leather:     { tex: 'brown_leather', mode: 'gray', size: 0.5, rough: 0.6, nScale: 0.6, roughFixed: true, env: 0.5 },
  rug:         { tex: 'poly_wool_herringbone', mode: 'gray', size: 0.5, rough: 1, nScale: 1, detail: 0.8, env: 0.1 },
  appliance:   { rough: 0.25, metal: 0.4 },
  car:         { rough: 0.25, metal: 0.5 },
  planting:    { rough: 0.8, color: 0x5d7a43 },  // Revit trae la vegetación en blanco (placeholder RPC)
  water:       { rough: 0.05 },
  default:     { rough: 0.7, env: 0.5 },
};
const texCache = {}; const pending = [];
export const texturesReady = () => Promise.all(pending);
function tex(name, kind, res, color, size = 1) {
  const k = `${name}/${kind}_${res}@${size}`;
  if (!texCache[k]) {
    let ok; pending.push(new Promise(r => ok = r)); const t = TL.load(`./assets/tex/${name}/${kind}_${res}.jpg`, ok, undefined, ok); t.repeat.set(1 / size, 1 / size); t.wrapS = t.wrapT = THREE.RepeatWrapping; t.anisotropy = 8;
    if (color) t.colorSpace = THREE.SRGBColorSpace; texCache[k] = t;
  }
  return texCache[k];
}
// UV por proyección de caja en coordenadas de mundo (1 unidad = 1 m); la escala de cada acabado va en material (repeat por textura no se comparte)
export function patchDetail(sh, d) {
  sh.fragmentShader = sh.fragmentShader.replace('#include <map_fragment>',
    `#ifdef USE_MAP\n vec4 sampledDiffuseColor = texture2D( map, vMapUv );\n sampledDiffuseColor.rgb = mix(vec3(0.5), sampledDiffuseColor.rgb, ${d.toFixed(3)});\n diffuseColor *= sampledDiffuseColor;\n#endif`);
}
export function boxUV(geo) {
  const p = geo.attributes.position, n = geo.attributes.normal; if (!p || !n) return;
  const uv = new Float32Array(p.count * 2);
  for (let i = 0; i < p.count; i++) {
    const ax = Math.abs(n.getX(i)), ay = Math.abs(n.getY(i)), az = Math.abs(n.getZ(i));
    let u, v; if (ay >= ax && ay >= az) { u = p.getX(i); v = p.getZ(i); } else if (ax >= az) { u = p.getZ(i); v = p.getY(i); } else { u = p.getX(i); v = p.getY(i); }
    uv[2 * i] = u; uv[2 * i + 1] = v;
  }
  geo.setAttribute('uv', new THREE.BufferAttribute(uv, 2));
}
const matCache = new Map();
export function finishMaterial(orig, role, { res = '1k' } = {}) {
  const r = R[role] || R.default;
  if (orig.transparent && orig.opacity < 0.9) {   // vidrio / agua: transparente, reflejo nítido
    const k = 'glass|' + orig.color.getHexString() + '|' + role;
    if (!matCache.has(k)) matCache.set(k, new THREE.MeshStandardMaterial({ color: orig.color.clone().lerp(new THREE.Color(1, 1, 1), 0.5), transparent: true,
      opacity: role === 'water' ? 0.75 : 0.14, roughness: 0.03, metalness: 0, depthWrite: false, envMapIntensity: 1.2, side: THREE.DoubleSide }));
    return matCache.get(k);
  }
  const k = role + '|' + orig.color.getHexString() + '|' + res;
  if (matCache.has(k)) return matCache.get(k);
  const m = new THREE.MeshStandardMaterial({ roughness: r.rough, metalness: r.metal || 0, side: orig.side });
  const oc = orig.color, ph = Math.max(oc.r, oc.g, oc.b) - Math.min(oc.r, oc.g, oc.b) < 0.1 && (oc.r + oc.g + oc.b) / 3 > 0.45;  // color placeholder (blanco/gris)
  const base = r.color !== undefined && ph ? new THREE.Color(r.color) : orig.color.clone();
  if (r.tex) {
    m.map = tex(r.tex, r.mode === 'gray' ? 'gray' : 'diff', res, true, r.size);
    m.normalMap = tex(r.tex, 'nor', res, false, r.size); m.normalScale.set(r.nScale, r.nScale);
    if (!r.roughFixed) m.roughnessMap = tex(r.tex, 'rough', res, false, r.size);
    m.color = r.mode === 'gray' ? base.multiplyScalar(2) : new THREE.Color(1, 1, 1);
  } else m.color = base;
  if (r.recolor !== undefined && (oc.r + oc.g + oc.b) / 3 > 0.2) m.color = new THREE.Color(r.recolor).multiplyScalar(r.tex ? 2 : 1);
  // intensidad del detalle de la textura (0 = color liso Revit, 1 = textura completa); en blancos de madera, casi liso (laca)
  const white = (oc.r + oc.g + oc.b) / 3 > 0.6 && Math.max(oc.r, oc.g, oc.b) - Math.min(oc.r, oc.g, oc.b) < 0.08;
  m.userData.detail = r.tex ? (white && r.whiteDetail !== undefined ? r.whiteDetail : (r.detail ?? 1)) : 1;
  m.envMapIntensity = r.env ?? 1.0;
  if (m.userData.detail < 1) { m.onBeforeCompile = sh => patchDetail(sh, m.userData.detail); m.customProgramCacheKey = () => 'det' + m.userData.detail; }
  m.userData.role = role; matCache.set(k, m); return m;
}

// Variante horneada: la luz difusa (directa + rebotes) sale del lightmap (UV1); se anulan sol/hemisferio/ambiente y la difusa del HDRI
// para no contar la luz dos veces. Se conserva el reflejo especular (sonda local del salón cuando existe).
const bakedCache = new Map();
export function bakedMaterial(base, lm, intensity, envMap) {
  const k = base.uuid + '|' + lm.uuid;
  if (bakedCache.has(k)) return bakedCache.get(k);
  const m = base.clone(); m.lightMap = lm; m.lightMapIntensity = intensity;
  if (envMap) { m.envMap = envMap; }
  m.envMapIntensity = base.envMapIntensity ?? 1.0; const det = base.userData.detail ?? 1; m.userData = { ...base.userData };
  m.onBeforeCompile = sh => {
    if (det < 1) patchDetail(sh, det);
    sh.fragmentShader = sh.fragmentShader
      .replace('#include <lights_fragment_maps>', 'irradiance = vec3(0.0);\n#include <lights_fragment_maps>\niblIrradiance = vec3(0.0);')
      .replace('#include <lights_fragment_end>', 'reflectedLight.directDiffuse = vec3(0.0); reflectedLight.directSpecular = vec3(0.0);\n#include <lights_fragment_end>');
  };
  m.customProgramCacheKey = () => 'baked-v2|' + det;
  m.userData.baked = true; bakedCache.set(k, m); return m;
}
export const allBakedMaterials = () => [...bakedCache.values()];
