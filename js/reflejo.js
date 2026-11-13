// Reflejo plano del porcelanato pulido del salón (Rev_Piso_Alto tráfico 120x120): espejo a media resolución, desenfocado y con
// Fresnel, mezclado sobre el piso horneado. Sólo escritorio y vista en primera persona (?reflejo=off lo desactiva).
import * as THREE from 'three';
import { Reflector } from 'three/addons/objects/Reflector.js';
const Shader = {
  name: 'PisoPulido',
  uniforms: { color: { value: null }, tDiffuse: { value: null }, textureMatrix: { value: null }, strength: { value: 0.42 }, texel: { value: new THREE.Vector2(1 / 960, 1 / 540) } },
  vertexShader: `uniform mat4 textureMatrix; varying vec4 vUv; varying vec3 vWorld;
    #include <common>
    #include <logdepthbuf_pars_vertex>
    void main() { vUv = textureMatrix * vec4(position, 1.0); vWorld = (modelMatrix * vec4(position, 1.0)).xyz;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      #include <logdepthbuf_vertex>
    }`,
  fragmentShader: `uniform sampler2D tDiffuse; uniform float strength; uniform vec2 texel; varying vec4 vUv; varying vec3 vWorld;
    #include <logdepthbuf_pars_fragment>
    void main() {
      #include <logdepthbuf_fragment>
      vec2 uv = vUv.xy / vUv.w; vec3 c = vec3(0.0); float ws = 0.0;
      for (int i = -2; i <= 2; i++) for (int j = -2; j <= 2; j++) { float w = exp(-float(i * i + j * j) / 4.0); c += texture2D(tDiffuse, uv + vec2(float(i), float(j)) * texel * 1.8).rgb * w; ws += w; }
      c /= ws;
      vec3 V = normalize(cameraPosition - vWorld); float f = pow(1.0 - clamp(V.y, 0.0, 1.0), 5.0);
      gl_FragColor = vec4(c, clamp(strength * (0.45 + 2.2 * f), 0.0, 0.7));
      #include <tonemapping_fragment>
      #include <colorspace_fragment>
    }`,
};
export function addFloorReflection({ levels, renderer, isMobile, rect = [4.7, 22.9, 9.7, 17.0], y = 1.4165 }) {
  if (isMobile) return null;
  const [x0, x1, p0, p1] = rect; const s = renderer.getPixelRatio();
  const W = Math.round(window.innerWidth * s * 0.5), H = Math.round(window.innerHeight * s * 0.5);
  const r = new Reflector(new THREE.PlaneGeometry(x1 - x0, p1 - p0), { shader: Shader, textureWidth: W, textureHeight: H, clipBias: 0.003, multisample: 0 });
  r.material.transparent = true; r.material.depthWrite = false; r.material.polygonOffset = true; r.material.polygonOffsetFactor = -2; r.material.polygonOffsetUnits = -4; r.material.uniforms.texel.value.set(1 / W, 1 / H);
  r.rotation.x = -Math.PI / 2; r.position.set((x0 + x1) / 2, y, -(p0 + p1) / 2); r.renderOrder = 1; r.name = 'reflejo_piso';
  levels[1].group.add(r);
  return { w: W, h: H };
}
