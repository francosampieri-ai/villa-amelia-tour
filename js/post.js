// Posproceso del recorrido en primera persona: GTAO (oclusión de contacto de muebles/decoración) + bloom suave en fuentes de luz
// (downlights, pantallas, cielo por las ventanas). Tone mapping y sRGB en OutputPass. Desactivable con ?post=off; en móvil sólo bloom.
import * as THREE from 'three';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { GTAOPass } from 'three/addons/postprocessing/GTAOPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';

export function createPost(renderer, scene, camera, { isMobile = false } = {}) {
  const w = window.innerWidth, h = window.innerHeight;
  const rt = new THREE.WebGLRenderTarget(w, h, { type: THREE.HalfFloatType, samples: isMobile ? 0 : 4 });
  const composer = new EffectComposer(renderer, rt);
  composer.addPass(new RenderPass(scene, camera));
  let gtao = null;
  if (!isMobile) {
    gtao = new GTAOPass(scene, camera, w, h);
    gtao.updateGtaoMaterial({ radius: 0.45, distanceExponent: 1.6, thickness: 1.2, scale: 1.0, samples: 16, distanceFallOff: 1.0, screenSpaceRadius: false });
    gtao.updatePdMaterial({ lumaPhi: 10, depthPhi: 2, normalPhi: 3, radius: 6, radiusExponent: 1, rings: 2, samples: 16 });
    gtao.blendIntensity = 0.85; composer.addPass(gtao);
  }
  const bloom = new UnrealBloomPass(new THREE.Vector2(w, h), 0.32, 0.55, 1.35); composer.addPass(bloom);
  composer.addPass(new OutputPass());
  return {
    composer, gtao, bloom,
    render(dt) { composer.render(dt); },
    setSize(W, H) { composer.setSize(W, H); },
  };
}
