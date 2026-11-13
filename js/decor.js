// Decoración e iluminación ESTÉTICAS del salón (no son Revit; ver bim/AUDITORIA.md): plantas, objetos sobre mesas, lámparas de pie,
// aros de downlights y líneas LED. Generadas en Blender (scripts/blender_decor.py) en las mismas posiciones usadas para hornear la luz.
// Iluminación: sin luces en tiempo real (ya están en el lightmap); difusa + especular de la sonda local del salón (IBL). Emisivos = MeshBasic.
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';
import { finishMaterial, boxUV, patchDetail } from './bim_materials.js';

// pantalla de lino iluminada desde dentro: exterior translúcido con degradé (más claro abajo, donde sale la luz), interior muy brillante
function shadeMaterial(y0 = 2.665, y1 = 3.005) {
  const m = new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.DoubleSide });
  m.onBeforeCompile = sh => {
    sh.vertexShader = 'varying float vWY;\n' + sh.vertexShader.replace('#include <project_vertex>', '#include <project_vertex>\nvWY = (modelMatrix * vec4(transformed, 1.0)).y;');
    sh.fragmentShader = 'varying float vWY;\n' + sh.fragmentShader.replace('vec4 diffuseColor = vec4( diffuse, opacity );',
      `float t = clamp((vWY - ${y0.toFixed(3)}) / ${(y1 - y0).toFixed(3)}, 0.0, 1.0);
       vec3 outer = mix(vec3(1.30, 0.98, 0.66), vec3(0.78, 0.60, 0.42), smoothstep(0.0, 1.0, t));
       vec3 inner = mix(vec3(3.2, 2.35, 1.45), vec3(2.0, 1.45, 0.90), t);
       float weave = 0.96 + 0.04 * sin(vWY * 900.0);
       vec4 diffuseColor = vec4((gl_FrontFacing ? outer * weave : inner), opacity);`);
  };
  m.customProgramCacheKey = () => 'pantalla-v1'; return m;
}
export async function loadDecor({ levels, colliders, env, zone = 'salon', name = 'decor' }) {
  const base = `./assets/bim/${zone}`;
  const info = await fetch(`${base}_${name}.json`).then(r => r.ok ? r.json() : null).catch(() => null);
  if (!info) return { zone, decor: 0 };
  const gl = new GLTFLoader().setDRACOLoader(new DRACOLoader().setDecoderPath('./vendor/three/jsm/libs/draco/'));
  const g = await gl.loadAsync(`${base}_${name}.glb`);
  const grp = new THREE.Group(); grp.name = name === 'decor' ? 'decoracion' : name; levels[1].group.add(grp);
  const cache = new Map(); let n = 0, emit = 0;
  const conv = m => {
    if (cache.has(m)) return cache.get(m);
    let out;
    if ((m.name || '').startsWith('emit')) {   // fuente de luz visible: cálida, algo por encima del blanco para que lea como encendida
      if (m.name.includes('pantalla')) out = shadeMaterial();
      else out = new THREE.MeshBasicMaterial({ color: new THREE.Color(1.0, 0.78, 0.52).multiplyScalar(3.0), side: THREE.DoubleSide });
      emit++;
    } else {
      const role = (m.name || '').includes('§') ? m.name.split('§')[0] : null;   // cojines: acabado BIM (tela) + IBL
      out = role ? finishMaterial(m, role).clone() : m; const det = out.userData.detail ?? 1; const spec = role ? (out.envMapIntensity ?? 1) : 1;
      out.envMap = env; out.envMapIntensity = 1.0; if (role) out.userData.needsUV = true;
      out.onBeforeCompile = sh => { if (det < 1) patchDetail(sh, det); sh.fragmentShader = sh.fragmentShader
        .replace('#include <lights_fragment_maps>', `irradiance = vec3(0.0);\n#include <lights_fragment_maps>\niblIrradiance *= vec3(1.06, 1.0, 0.90); radiance *= ${spec.toFixed(3)};`)
        .replace('#include <lights_fragment_end>', 'reflectedLight.directDiffuse = vec3(0.0); reflectedLight.directSpecular = vec3(0.0);\n#include <lights_fragment_end>'); };
      out.customProgramCacheKey = () => 'decor-ibl|' + det + '|' + spec;
      if (out.alphaTest === 0 && out.transparent && out.map) { out.alphaTest = 0.5; out.transparent = false; }   // hojas: recorte, sin ordenar
    }
    cache.set(m, out); return out;
  };
  g.scene.updateMatrixWorld(true);
  const list = []; g.scene.traverse(o => { if (o.isMesh) list.push(o); });
  for (const o of list) {
    o.material = Array.isArray(o.material) ? o.material.map(conv) : conv(o.material);
    if ((Array.isArray(o.material) ? o.material : [o.material]).some(m => m.userData.needsUV)) boxUV(o.geometry);
    const mw = o.matrixWorld.clone(); grp.add(o); o.matrixAutoUpdate = false; o.matrix.copy(mw); o.matrixWorld.copy(mw);
    o.castShadow = false; o.receiveShadow = false; o.userData = { decor: true, node: o.name }; n++;
  }
  for (const c of info.colliders || []) colliders.push({ ...c, generico: true });
  return { zone, decor: n, emissive: emit, colliders: (info.colliders || []).length };
}
