// Vegetación: los 'Planting' Revit son marcadores Enscape (manchas verdes). Se sustituyen en la MISMA posición y altura por modelos
// CC0 (Poly Haven) instanciados; los árboles grandes quedan como en Revit. Datos: scripts/blender_plantas.py -> plantas.json/glb.
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';
export async function loadPlantas({ scene }) {
  const info = await fetch('./assets/bim/plantas.json').then(r => r.ok ? r.json() : null).catch(() => null);
  if (!info) return { plantas: 0 };
  const gl = new GLTFLoader().setDRACOLoader(new DRACOLoader().setDecoderPath('./vendor/three/jsm/libs/draco/'));
  const g = await gl.loadAsync('./assets/bim/plantas.glb'); g.scene.updateMatrixWorld(true);
  const hide = new Set(info.instances.flatMap(i => i.nodes).map(n => n.replace(/[\[\]\.:\/]/g, '').replace(/\s/g, '_')));
  let hidden = 0;
  scene.traverse(o => { if (o.isMesh && hide.has(o.userData.node)) { o.visible = false; o.castShadow = false; hidden++; } });
  const byK = {}; for (const i of info.instances) (byK[i.k] ??= []).push(i);
  const grp = new THREE.Group(); grp.name = 'vegetacion'; scene.add(grp);
  const M = new THREE.Matrix4(), Q = new THREE.Quaternion(), S = new THREE.Vector3(), P = new THREE.Vector3(), Y = new THREE.Vector3(0, 1, 0);
  let n = 0;
  for (const [k, list] of Object.entries(byK)) {
    const root = g.scene.getObjectByName(`PLANTA|${k}`); if (!root) continue;
    const meshes = []; root.traverse(o => { if (o.isMesh) meshes.push(o); });
    for (const src of meshes) {
      const local = new THREE.Matrix4().copy(root.matrixWorld).invert().multiply(src.matrixWorld);
      const mats = (Array.isArray(src.material) ? src.material : [src.material]);
      mats.forEach(m => { if (m.transparent && m.map) { m.alphaTest = 0.5; m.transparent = false; } m.side = THREE.DoubleSide; m.envMapIntensity = 0.6; });
      const im = new THREE.InstancedMesh(src.geometry, src.material, list.length);
      list.forEach((it, j) => { P.set(it.x, it.z, -it.y); Q.setFromAxisAngle(Y, it.yaw); S.setScalar(it.s); M.compose(P, Q, S).multiply(local); im.setMatrixAt(j, M); });
      im.instanceMatrix.needsUpdate = true; im.castShadow = true; im.receiveShadow = true; im.computeBoundingSphere(); grp.add(im); n++;
    }
  }
  const arb = await addArboles(scene, info);
  return { plantas: info.instances.length, mallas: n, ocultas: hidden, revit: info.revit_kept.length, arboles: arb };
}
// Árboles grandes (16 Revit, ~MB de malla cada uno): dos planos cruzados con un render ortográfico de un árbol CC0, misma posición y
// altura que el Revit. Ver AUDITORIA.md (agregado estético). ?arboles=revit los deja como estaban.
async function addArboles(scene, info) {
  if (!info.arboles || new URLSearchParams(location.search).get('arboles') === 'revit') return 0;
  const hide = new Set(info.arboles.flatMap(a => a.nodes).map(n => n.replace(/[\[\]\.:\/]/g, '').replace(/\s/g, '_')));
  scene.traverse(o => { if (o.isMesh && hide.has(o.userData.node)) { o.visible = false; o.castShadow = false; } });
  const tl = new THREE.TextureLoader(); const ai = info.arbol_img;
  const M = new THREE.Matrix4(), Q = new THREE.Quaternion(), S = new THREE.Vector3(), P = new THREE.Vector3(), Y = new THREE.Vector3(0, 1, 0);
  const grp = new THREE.Group(); grp.name = 'arboles'; scene.add(grp);
  await Promise.all(ai.views.map(async (v, k) => {
    const t = await tl.loadAsync(`./assets/arbol_${k}.webp`); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4;
    const hp = 1 / (v.top_v - v.base_v), wp = hp * ai.aspect; // planta de altura unitaria
    const geo = new THREE.PlaneGeometry(wp, hp).translate((0.5 - v.base_u) * wp, (0.5 - v.base_v) * hp, 0);
    const mat = new THREE.MeshBasicMaterial({ map: t, alphaTest: 0.5, side: THREE.DoubleSide, color: 0xf2f2ea });
    const im = new THREE.InstancedMesh(geo, mat, info.arboles.length);
    info.arboles.forEach((a, j) => { P.set(a.x, a.z, -a.y); Q.setFromAxisAngle(Y, a.yaw + k * Math.PI / 2); S.setScalar(a.h); M.compose(P, Q, S); im.setMatrixAt(j, M); });
    im.castShadow = true; im.computeBoundingSphere(); grp.add(im);
  }));
  return info.arboles.length;
}
