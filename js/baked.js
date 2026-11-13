// Luz horneada en Blender (Cycles) sobre la geometría Revit exacta: sustituye, nodo por nodo, las mallas BIM de la zona horneada
// por la misma malla con UV1 + lightmap (KTX2). No mueve ni agrega geometría: si un nodo no está en el horneado, queda como estaba.
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';
import { KTX2Loader } from 'three/addons/loaders/KTX2Loader.js';
import { boxUV, finishMaterial, bakedMaterial, allBakedMaterials, patchDetail } from './bim_materials.js';
const IBL_ROLES = new Set(['fabric', 'fabricBeige', 'leather', 'furnWood', 'woodStair']);
const iblCache = new Map();
function iblMaterial(base, env, floorY = 1.415) {
  if (iblCache.has(base)) return iblCache.get(base);
  const m = base.clone(); m.envMap = env; const spec = base.envMapIntensity ?? 1; m.envMapIntensity = 1.0; const det = base.userData.detail ?? 1;
  // telas: sombreado "suave" barato = menos luz hacia el piso (los laterales bajos reciben menos) + brillo de fibra en rasante (sheen)
  const soft = base.userData.role === 'fabric' || base.userData.role === 'fabricBeige';
  m.onBeforeCompile = sh => {
    if (det < 1) patchDetail(sh, det);
    if (soft) sh.vertexShader = 'varying float vWY;\n' + sh.vertexShader.replace('#include <project_vertex>', '#include <project_vertex>\nvWY = (modelMatrix * vec4(transformed, 1.0)).y;');
    const softGL = soft ? `float ndvS = clamp(dot(normal, geometryViewDir), 0.0, 1.0); float hS = smoothstep(${floorY.toFixed(3)}, ${(floorY + 0.5).toFixed(3)}, vWY);
      iblIrradiance *= mix(0.78, 1.0, hS) * (0.93 + 0.07 * ndvS) * (1.0 + 0.16 * pow(1.0 - ndvS, 3.0));` : '';
    sh.fragmentShader = (soft ? 'varying float vWY;\n' : '') + sh.fragmentShader
      .replace('#include <lights_fragment_maps>', `irradiance = vec3(0.0);\n#include <lights_fragment_maps>\nradiance *= ${spec.toFixed(3)}; iblIrradiance *= vec3(1.06, 1.0, 0.90);\n${softGL}`)
      .replace('#include <lights_fragment_end>', 'reflectedLight.directDiffuse = vec3(0.0); reflectedLight.directSpecular = vec3(0.0);\n#include <lights_fragment_end>');
  };
  m.customProgramCacheKey = () => 'ibl|' + det + '|' + spec + '|' + soft; iblCache.set(base, m); return m;
}

export async function loadBaked({ scene, renderer, levels, roof, floorTargets, zone = 'salon' }) {
  const base = `./assets/bim/${zone}`;
  const info = await fetch(`${base}_lm.json`).then(r => r.ok ? r.json() : null).catch(() => null);
  if (!info) return { zone, baked: 0 };
  const draco = new DRACOLoader().setDecoderPath('./vendor/three/jsm/libs/draco/');
  const ktx = new KTX2Loader().setTranscoderPath('./vendor/three/jsm/libs/basis/').detectSupport(renderer);
  const gl = new GLTFLoader().setDRACOLoader(draco);
  // preset atardecer: misma UV, lightmap aparte (cielo casi apagado + luminarias), con su propia escala
  const dusk = window.__hora === 'atardecer' ? await fetch('./assets/bim/dusk_lm.json').then(r => r.ok ? r.json() : null).catch(() => null) : null;
  if (dusk) info.scale = dusk.scale;
  const [g, lm, nodes] = await Promise.all([gl.loadAsync(`${base}_baked.glb`), ktx.loadAsync(dusk ? './assets/bim/dusk_lm.ktx2' : `${base}_lm.ktx2`), fetch(`${base}_nodes.json`).then(r => r.json())]);
  lm.channel = 1; lm.colorSpace = THREE.SRGBColorSpace; lm.flipY = false; lm.needsUpdate = true;
  const intensity = Math.PI * info.scale * (info.exposure ?? 1);
  // nombres de nodo tal como los deja GLTFLoader (sin '.'), para ocultar exactamente los originales horneados
  const want = new Set(nodes.map(n => n.replace(/[\[\]\.:\/]/g, '').replace(/\s/g, '_')));
  let hidden = 0;
  for (const grp of [...levels.map(l => l.group), roof]) grp.traverse(o => {
    if (o.isMesh && want.has(o.userData.node)) { o.visible = false; o.castShadow = false; hidden++; const i = floorTargets.indexOf(o); if (i >= 0) floorTargets.splice(i, 1); }
  });
  g.scene.updateMatrixWorld(true);
  const list = []; g.scene.traverse(o => { if (o.isMesh) list.push(o); });
  const baked = [];
  for (const m of list) {
    let p = m; while (p && !(p.name || '').includes('|')) p = p.parent;
    const [, L, tag] = (p ? p.name : 'BAKED|L1|X').split('|'); const li = Number(L.slice(1));
    const role = (m.material.name || '').split('§')[0] || 'default';
    m.geometry = m.geometry.clone(); m.geometry.applyMatrix4(m.matrixWorld);
    m.matrix.identity(); m.matrix.decompose(m.position, m.quaternion, m.scale); m.matrixAutoUpdate = true;
    boxUV(m.geometry); m.material = finishMaterial(m.material, role);
    (li >= 4 ? roof : levels[Math.min(li, 3)].group).add(m); m.updateMatrixWorld(true);
    m.userData = { node: p ? p.name : '', bim: { L: li, cat: 'baked', role }, baked: true }; m.castShadow = true; m.receiveShadow = false;
    if (tag === 'F') floorTargets.push(m);
    baked.push(m);
  }
  const n = baked.length, miss = nodes.length;
  // sonda de reflejo local (cubemap renderizado una vez en el centro del salón) para que el piso pulido refleje el interior y no el cielo
  let env = null;
  if (info.probe) {
    const rt = new THREE.WebGLCubeRenderTarget(256, { type: THREE.HalfFloatType });
    const cc = new THREE.CubeCamera(0.05, 300, rt); const [px, py, pz] = info.probe; cc.position.set(px, pz, -py); scene.add(cc);
    for (const m of baked) { m.userData.finish = m.material; m.material = bakedMaterial(m.material, lm, intensity, null); }
    cc.update(renderer, scene); const pm = new THREE.PMREMGenerator(renderer); env = pm.fromCubemap(rt.texture).texture; pm.dispose(); scene.remove(cc);
    for (const mt of allBakedMaterials()) { mt.envMap = env; mt.needsUpdate = true; }
    // muebles, cojines y peldaños: las familias Revit traen caras internas/duplicadas que manchan el lightmap a esta resolución.
    // Se iluminan con la sonda local (difusa + especular IBL de la escena YA horneada); su sombra de contacto sigue en el piso horneado.
    for (const m of baked) if (IBL_ROLES.has(m.userData.bim.role)) { m.material = iblMaterial(m.userData.finish, env); m.userData.ibl = true; }
    // (horneados v4+) los muebles quedan fuera del lightmap: las mallas BIM originales de esos roles dentro de la zona usan la misma IBL
    const [[x0, x1], [y0, y1], [z0, z1]] = info.box || [[-0.7, 23.5], [8.3, 18.3], [1.2, 7.9]]; const bb = new THREE.Box3();
    for (const grp of [...levels.map(l => l.group), roof]) grp.traverse(o => {
      if (!o.isMesh || o.userData.baked || !o.userData.bim || !IBL_ROLES.has(o.userData.bim.role)) return;
      bb.setFromObject(o); const c = bb.getCenter(new THREE.Vector3());
      if (c.x < x0 || c.x > x1 || -c.z < y0 || -c.z > y1 || c.y < z0 || c.y > z1) return;
      o.material = Array.isArray(o.material) ? o.material.map(mt => iblMaterial(mt, env)) : iblMaterial(o.material, env); o.userData.ibl = true;
    });
  } else for (const m of baked) m.material = bakedMaterial(m.material, lm, intensity, null);
  const res = { zone, meshes: n, nodes: miss, hidden, intensity: +intensity.toFixed(3) };
  Object.defineProperty(res, 'env', { value: env, enumerable: false }); Object.defineProperty(res, 'info', { value: info, enumerable: false });
  return res;
}
