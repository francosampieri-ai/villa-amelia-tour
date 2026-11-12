// Villa Amelia — Tour 3D · arranque: escena, niveles, controles, UI y hook de pruebas (window.__tour)
import * as THREE from 'three';
import { initMaterials, setPalette, mats } from './materials.js';
import { buildLevel, buildTerrain, buildPool, Batch, toWorld } from './builder.js';
import { buildFurniture } from './furniture.js';
import { Daylight } from './lights.js';
import { FirstPerson } from './controls.js';
import { Dollhouse } from './dollhouse.js';
import { GuidedTour } from './tour.js';
import { showWelcome } from './welcome.js';
import { level0 } from './data/level0.js';
import { level1 } from './data/level1.js';
import { level2 } from './data/level2.js';
import { level3 } from './data/level3.js';
import { site, TERRAIN, POOL } from './data/site.js';

const isTouch = ('ontouchstart' in window) || navigator.maxTouchPoints > 0;
const isMobile = isTouch && Math.min(window.innerWidth, window.innerHeight) < 900;
if (isTouch) document.body.classList.add('touch');

// ---------------------------------------------------------------- Renderer y escena
const canvas = document.getElementById('c');
const renderer = new THREE.WebGLRenderer({ canvas, antialias: !isMobile, powerPreference: 'high-performance' });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1.5 : 2));
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = isMobile ? THREE.PCFShadowMap : THREE.PCFSoftShadowMap;
renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = 1.0;
renderer.outputColorSpace = THREE.SRGBColorSpace;

const scene = new THREE.Scene();
scene.background = new THREE.Color(0xdfe6ea);
initMaterials(isMobile);
const daylight = new Daylight(scene, { isMobile });

// ---------------------------------------------------------------- Construcción
const LEVELS = [level0, level1, level2, level3];
const colliders = [];
const levels = LEVELS.map(d => {
  const r = buildLevel(d, buildFurniture);
  colliders.push(...r.colliders); scene.add(r.group);
  return { ...r, data: d };
});
const roofBuilt = buildLevel({ name: 'roof', ...level3.roof }, null);
const roof = roofBuilt.group; scene.add(roof);
const siteBuilt = buildLevel({ name: 'site', ...site }, buildFurniture);
colliders.push(...siteBuilt.colliders); scene.add(siteBuilt.group);
buildTerrain(TERRAIN, siteBuilt.group);
{ const b = new Batch(); buildPool(POOL, b, siteBuilt.group); b.flush(siteBuilt.group); }
// Vaso de la piscina: colisión para no caminar sobre el agua
colliders.push({ cx: (POOL.water[0] + POOL.water[1]) / 2, cy: (POOL.water[2] + POOL.water[3]) / 2, hl: (POOL.water[1] - POOL.water[0]) / 2, ht: (POOL.water[3] - POOL.water[2]) / 2, ang: 0, z0: 0, z1: 2.0 });

// Objetivos del raycast de piso: mallas fusionadas de losas/escaleras/muros (no mobiliario, vidrio ni agua)
const floorTargets = [];
for (const g of [...levels.map(l => l.group), roof, siteBuilt.group]) {
  g.traverse(o => { if (o.isMesh && o.name.startsWith('batch:') && o.userData.matKey !== 'vid' && o.userData.matKey !== 'frame' && o.userData.matKey !== 'lamas' && o.userData.matKey !== 'celosia' && o.userData.matKey !== 'rail') floorTargets.push(o); });
}
floorTargets.push(siteBuilt.group.getObjectByName('terrain'));
const visibleTargets = () => floorTargets.filter(m => m.parent && m.parent.visible);

const rooms = LEVELS.flatMap(d => d.rooms || []);
function roomAt(x, y, z) {
  let best = null;
  for (const r of rooms) {
    const [x0, x1, y0, y1] = r.box;
    if (x >= x0 && x <= x1 && y >= y0 && y <= y1 && Math.abs(r.z - z) < 1.2) {
      const size = (x1 - x0) * (y1 - y0); if (!best || size < best.size) best = { ...r, size };
    }
  }
  return best;
}

// ---------------------------------------------------------------- Cámaras y controles
const aspect = window.innerWidth / window.innerHeight;
const fpCamera = new THREE.PerspectiveCamera(isMobile ? 70 : 65, aspect, 0.05, 500);
const fp = new FirstPerson(fpCamera, canvas, { colliders, raycastTargets: visibleTargets, isMobile });
const dollhouse = new Dollhouse(canvas, levels, roof, aspect);
const tour = new GuidedTour(fp);

let view = 'fp', currentLevel = 1;
const label = document.getElementById('roomlabel');
let lastRoom = '';
fp.onMove = p => {
  const r = roomAt(p.x, p.y, p.z);
  const txt = r ? `<b>${r.name}</b>${r.area ? ` · ${r.area} m²` : ''}` : '';
  if (txt !== lastRoom) { lastRoom = txt; label.innerHTML = txt; label.classList.toggle('show', !!txt); }
};

function setView(v) {
  view = v;
  document.body.classList.toggle('dollhouse', v === 'dollhouse');
  document.getElementById('btn-fp').classList.toggle('active', v === 'fp');
  document.getElementById('btn-dh').classList.toggle('active', v === 'dollhouse');
  if (v === 'dollhouse') { fp.enabled = false; dollhouse.enable(); dollhouse.applyLevel(currentLevel); label.classList.remove('show'); }
  else { dollhouse.disable(); fp.enabled = true; fp.snapFloor(true); }
}
function setLevel(l) {
  currentLevel = l === 'all' ? 'all' : Number(l);
  document.querySelectorAll('.btn.lvl').forEach(b => b.classList.toggle('active', b.dataset.level === String(l)));
  if (view === 'dollhouse') dollhouse.applyLevel(currentLevel);
  else if (currentLevel !== 'all') { const d = LEVELS[currentLevel]; fp.setPose(d.spawn.x, d.spawn.y, d.z, d.spawn.yaw); fp.aimOpen(); }
}
/** Hook de pruebas y de pasos siguientes. */
function goto(level, x, y, yaw = 90) {
  const d = LEVELS[level] || LEVELS[1];
  if (view !== 'fp') setView('fp');
  currentLevel = d.id;
  document.querySelectorAll('.btn.lvl').forEach(b => b.classList.toggle('active', b.dataset.level === String(d.id)));
  fp.setPose(x, y, d.z, yaw); fp.update(0);
}

document.getElementById('btn-fp').addEventListener('click', () => setView('fp'));
document.getElementById('btn-dh').addEventListener('click', () => setView('dollhouse'));
document.querySelectorAll('.btn.lvl').forEach(b => b.addEventListener('click', () => setLevel(b.dataset.level)));
window.addEventListener('keydown', e => {
  if (e.code === 'KeyV') setView(view === 'fp' ? 'dollhouse' : 'fp');
  if (/^Digit[0-3]$/.test(e.code)) setLevel(Number(e.code.slice(5)));
});
window.addEventListener('resize', () => {
  const a = window.innerWidth / window.innerHeight;
  renderer.setSize(window.innerWidth, window.innerHeight);
  fpCamera.aspect = a; fpCamera.updateProjectionMatrix(); dollhouse.setAspect(a);
});

// ---------------------------------------------------------------- Arranque
fp.setPose(level1.spawn.x, level1.spawn.y, level1.z, level1.spawn.yaw); fp.aimOpen();
setView('fp'); setLevel(1);

let frames = 0;
window.__tour = {
  goto, setView, setLevel, setPalette, setHour: h => daylight.setHour(h), topView: h => dollhouse.topView(h),
  tour, fp, dollhouse, scene, renderer, levels, colliders,
  get frames() { return frames; }, get view() { return view; }, get level() { return currentLevel; },
  ready: new Promise(res => requestAnimationFrame(() => requestAnimationFrame(() => res(true)))),
  stats: () => renderer.info.render,
};

const clock = new THREE.Clock();
function animate() {
  const dt = Math.min(clock.getDelta(), 0.05);
  if (view === 'fp') fp.update(dt); else dollhouse.update();
  renderer.render(scene, view === 'fp' ? fpCamera : dollhouse.camera);
  frames++;
  requestAnimationFrame(animate);
}
showWelcome();
animate();
