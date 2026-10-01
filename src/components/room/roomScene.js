// @ts-nocheck
// Generated from the design canvas scene (scratchpad g3d/common.js + g3d/room3.js). The room at night,
// with Lakshya as a 3D figure; the notebook, crate, trophies, laptop and corkboard open the sections.
import * as T from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { SSAOPass } from 'three/examples/jsm/postprocessing/SSAOPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';
import { OutlinePass } from 'three/examples/jsm/postprocessing/OutlinePass.js';
import { GammaCorrectionShader } from 'three/examples/jsm/shaders/GammaCorrectionShader.js';
import { live, output } from '@/components/projects/crate/crateSounds';

/** Builds the scene into `host`. `self` carries the section's state and callbacks; returns nothing, call self._cleanup() to stop. */
export function startRoom(host, self) {
  const THREE = { ...T, RoomEnvironment, RoundedBoxGeometry, GLTFLoader, RGBELoader, EffectComposer, RenderPass, SSAOPass, UnrealBloomPass, ShaderPass, GammaCorrectionShader, OutlinePass };
// ---- shared 3D scaffolding (runs inside start(THREE)) ----
let W = host.clientWidth || 1440, H = host.clientHeight || 900;
const renderer = new THREE.WebGLRenderer({ antialias: (window.devicePixelRatio || 1) < 1.5, alpha: false, powerPreference: 'high-performance' });
renderer.setPixelRatio(Math.min(1.25, window.devicePixelRatio || 1));
renderer.setSize(W, H);
renderer.outputEncoding = THREE.sRGBEncoding;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
// Film-like tone mapping, and a soft studio environment for reflections on glossy things.
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 0.92;
renderer.physicallyCorrectLights = false;
renderer.domElement.style.width = '100%';
renderer.domElement.style.height = '100%';
renderer.domElement.style.display = 'block';
host.appendChild(renderer.domElement);
{ const fx = document.createElement('div'); fx.style.cssText = 'position:absolute;inset:0;pointer-events:none;z-index:1;background:radial-gradient(ellipse at 50% 45%, rgba(0,0,0,0) 55%, rgba(0,0,0,0.45) 100%)';
  const gr = document.createElement('div'); gr.style.cssText = 'position:absolute;inset:-50%;pointer-events:none;z-index:1;opacity:0.07;mix-blend-mode:overlay;background-image:url("data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 width=%27200%27 height=%27200%27%3E%3Cfilter id=%27n%27%3E%3CfeTurbulence type=%27fractalNoise%27 baseFrequency=%270.9%27 numOctaves=%272%27/%3E%3C/filter%3E%3Crect width=%27100%25%27 height=%27100%25%27 filter=%27url(%23n)%27/%3E%3C/svg%3E");animation:roomGrain 0.6s steps(4) infinite';
  if (!document.getElementById('roomGrainKf')) { const st = document.createElement('style'); st.id = 'roomGrainKf'; st.textContent = '@keyframes roomGrain{0%{transform:translate(0,0)}25%{transform:translate(-3%,2%)}50%{transform:translate(2%,-3%)}75%{transform:translate(-2%,-1%)}}'; document.head.appendChild(st); }
  if (getComputedStyle(host).position === 'static') host.style.position = 'relative';
  host.style.overflow = 'hidden'; host.appendChild(fx); host.appendChild(gr); }
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x000000);
const camera = new THREE.PerspectiveCamera(35, W / H, 0.05, 300);
// Follow the section's size.
const ro = new ResizeObserver(() => { W = host.clientWidth || W; H = host.clientHeight || H; renderer.setSize(W, H, false); camera.aspect = W / H; camera.updateProjectionMatrix(); self._onResize && self._onResize(W, H); });
ro.observe(host);
self._cleanup = () => { ro.disconnect(); renderer.dispose(); renderer.domElement.remove(); };
self._camera = camera;
if (THREE.RoomEnvironment) {
  const pmrem = new THREE.PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(new THREE.RoomEnvironment(), 0.04).texture;
}
/** A standard material with a little of the environment in it. */
const mat = (color, rough = 0.7, metal = 0, env = 0.35, extra = {}) => new THREE.MeshStandardMaterial(Object.assign({ color, roughness: rough, metalness: metal, envMapIntensity: env }, extra));
/** A box with rounded edges (falls back to a plain box), casting and receiving shadows. */
const rbox = (w, h, d, r, material) => {
  const geo = THREE.RoundedBoxGeometry ? new THREE.RoundedBoxGeometry(w, h, d, 4, Math.min(r, w / 2, h / 2, d / 2)) : new THREE.BoxGeometry(w, h, d);
  const m = new THREE.Mesh(geo, material); m.castShadow = true; m.receiveShadow = true; return m;
};
/** A soft additive glow, for bulbs and neon. */
let glowTex = null;
const glow = (color, size, opacity = 0.9) => {
  if (!glowTex) glowTex = canvasTex(128, 128, (g, w, h) => { const gr = g.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, w / 2); gr.addColorStop(0, 'rgba(255,255,255,1)'); gr.addColorStop(0.25, 'rgba(255,255,255,0.45)'); gr.addColorStop(1, 'rgba(255,255,255,0)'); g.fillStyle = gr; g.fillRect(0, 0, w, h); });
  const sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowTex, color, transparent: true, opacity, blending: THREE.AdditiveBlending, depthWrite: false, toneMapped: false }));
  sp.scale.set(size, size, 1); return sp;
};

const PHOTO = '/Lakshya.png';
const STK = [
  '/stickers/code.png', '/stickers/ihate.png',
  '/stickers/eatsleep.png', '/stickers/404error.png',
  '/stickers/fullstack.png', '/stickers/coffee.png',
  '/stickers/justcodeit.png', '/stickers/codeon.png',
];
const clamp = (v) => Math.max(0, Math.min(1, v));
const lerp = (a, b, t) => a + (b - a) * t;
const ease = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const band = (p, a, b) => ease(clamp((p - a) / (b - a)));

const loadImg = (src) => new Promise((res) => { const i = new Image(); i.onload = () => res(i); i.onerror = () => res(null); i.src = src; });
const imgTex = (img) => { const t = new THREE.Texture(img); t.needsUpdate = true; t.encoding = THREE.sRGBEncoding; t.anisotropy = 8; return t; };
const canvasTex = (w, h, draw) => {
  const c = document.createElement('canvas'); c.width = w; c.height = h;
  draw(c.getContext('2d'), w, h);
  const t = new THREE.CanvasTexture(c); t.encoding = THREE.sRGBEncoding; t.anisotropy = 8; return t;
};
const gridPaper = (g, w, h, step, alpha, bg) => {
  g.fillStyle = bg; g.fillRect(0, 0, w, h);
  g.strokeStyle = 'rgba(0,0,0,' + alpha + ')'; g.lineWidth = Math.max(1, step / 40);
  for (let x = 0; x <= w; x += step) { g.beginPath(); g.moveTo(x, 0); g.lineTo(x, h); g.stroke(); }
  for (let y = 0; y <= h; y += step) { g.beginPath(); g.moveTo(0, y); g.lineTo(w, y); g.stroke(); }
};

/** The About page as a notebook sheet, drawn at any width with a 1440 x 900 layout. */
const drawNotebook = (g, w, h, photo) => {
  const s = w / 1440;
  gridPaper(g, w, h, 50 * s, 0.16, '#F4F4F4');
  g.fillStyle = 'rgba(250,26,29,0.55)'; g.fillRect(150 * s, 0, 2 * s, h);
  for (let i = 0; i < 18; i++) {
    const y = (i * 50 + 25) * s;
    g.fillStyle = '#000'; g.beginPath(); g.arc(70 * s, y, 8 * s, 0, Math.PI * 2); g.fill();
    g.strokeStyle = '#8C8C8C'; g.lineWidth = 6 * s; g.lineCap = 'round';
    g.beginPath(); g.moveTo(70 * s, y - 5 * s); g.bezierCurveTo(52 * s, y - 21 * s, 20 * s, y - 20 * s, 12 * s, y + 1 * s); g.stroke();
  }
  g.save(); g.translate(186 * s, 135 * s); g.rotate(-2 * Math.PI / 180);
  g.fillStyle = '#111'; g.font = (118 * s) + 'px "Permanent Marker", cursive'; g.fillText('ABOUT ME', 0, 0); g.restore();
  g.strokeStyle = '#FA1A1D'; g.lineWidth = 7 * s; g.lineCap = 'round';
  g.beginPath(); g.moveTo(190 * s, 182 * s); g.bezierCurveTo(306 * s, 170 * s, 446 * s, 190 * s, 566 * s, 178 * s); g.bezierCurveTo(686 * s, 166 * s, 746 * s, 170 * s, 820 * s, 180 * s); g.stroke();
  const lines = ['Dear diary,', "I'm Lakshya, a developer and data scientist.", 'B.Tech CSE (Data Science) at VIT Vellore.', 'I build apps, websites and AI experiments.', 'Status: unemployed (but I make it sound cool).', '→ update: summer intern @ NTT DATA', 'Superpower: turning coffee into code', 'and bugs into features.', 'Home base: Gurgaon, India.'];
  g.font = '600 ' + (38 * s) + 'px Caveat, cursive';
  lines.forEach((l, i) => { g.fillStyle = i === 5 ? '#FA1A1D' : '#1B2F8F'; g.fillText(l, 190 * s, (250 + i * 50) * s); });
  if (photo) {
    g.save(); g.translate(1175 * s, 370 * s); g.rotate(3 * Math.PI / 180);
    g.shadowColor = 'rgba(0,0,0,0.2)'; g.shadowBlur = 24 * s; g.shadowOffsetY = 10 * s;
    g.fillStyle = '#fff'; g.fillRect(-165 * s, -220 * s, 330 * s, 440 * s); g.shadowColor = 'transparent';
    g.fillStyle = '#CFE9F4'; g.fillRect(-147 * s, -202 * s, 294 * s, 350 * s);
    g.drawImage(photo, -127 * s, -178 * s, 254 * s, 326 * s);
    g.fillStyle = '#1B2F8F'; g.font = '700 ' + (32 * s) + 'px Caveat, cursive'; g.textAlign = 'center'; g.fillText('me, probably debugging', 0, 196 * s); g.textAlign = 'left';
    g.restore();
  }
};

/** The hero, flattened into a picture (for covers and screens). */
const drawHero = (g, w, h, photo, stickers) => {
  const s = w / 1440;
  g.fillStyle = '#000'; g.fillRect(0, 0, w, h);
  g.save(); g.beginPath();
  g.moveTo(0, 252 * s); g.lineTo(926 * s, 252 * s); g.arc(926 * s, 576 * s, 324 * s, -Math.PI / 2, Math.PI / 2); g.lineTo(0, 900 * s); g.closePath(); g.clip();
  gridPaper(g, w, h, 50 * s, 0.45, '#F4F4F4'); g.restore();
  g.fillStyle = '#F4F4F4'; g.font = (180 * s) + 'px Impact, Anton, sans-serif'; g.fillText('LAKSHYA', 50 * s, 190 * s);
  g.textAlign = 'right'; g.font = '700 ' + (88 * s) + 'px "Times New Roman", serif';
  [['Code and', '#fff'], ['Grind,', '#fff'], ['Lead', '#B99314'], ['the Mind', '#B99314']].forEach(([t, c], i) => { g.fillStyle = c; g.fillText(t, 1385 * s, (245 + i * 96) * s); });
  g.textAlign = 'left';
  const spots = [[38, 52, 14], [475, 32, 8], [875, 117, 0], [125, 227, 12], [600, 272, 8], [975, 311, -8], [725, 376, -8], [50, 466, -18]];
  (stickers || []).forEach((im, i) => {
    if (!im) return; const [x, y, r] = spots[i]; const sw = 160 * s, sh = sw * im.height / im.width;
    g.save(); g.translate((x + 80) * s, (252 + y) * s + sh / 2); g.rotate(r * Math.PI / 180); g.drawImage(im, -sw / 2, -sh / 2, sw, sh); g.restore();
  });
  if (photo) g.drawImage(photo, 310 * s, 554 * s, 260 * s, 346 * s);
};

/** A flat picture laid on a sphere of radius r, centred on direction `dir`, `size` wide. */
const decalOnSphere = (tex, aspect, r, dir, size, spin, mat) => {
  const geo = new THREE.PlaneGeometry(size, size / aspect, 20, 20);
  const n = dir.clone().normalize();
  const up0 = Math.abs(n.y) > 0.95 ? new THREE.Vector3(1, 0, 0) : new THREE.Vector3(0, 1, 0);
  let u = new THREE.Vector3().crossVectors(up0, n).normalize();
  let v = new THREE.Vector3().crossVectors(n, u).normalize();
  const c = Math.cos(spin), sn = Math.sin(spin);
  const u2 = u.clone().multiplyScalar(c).add(v.clone().multiplyScalar(sn));
  const v2 = v.clone().multiplyScalar(c).sub(u.clone().multiplyScalar(sn));
  const pos = geo.attributes.position;
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i), y = pos.getY(i);
    const p = n.clone().multiplyScalar(r).add(u2.clone().multiplyScalar(x)).add(v2.clone().multiplyScalar(y)).normalize().multiplyScalar(r);
    pos.setXYZ(i, p.x, p.y, p.z);
  }
  geo.computeVertexNormals();
  return new THREE.Mesh(geo, mat || new THREE.MeshStandardMaterial({ map: tex, transparent: true, alphaTest: 0.4, roughness: 0.55, side: THREE.DoubleSide }));
};

/** A cut-out on a card: its outline casts a proper shadow. */
const cutout = (img, height) => {
  const tex = imgTex(img);
  const aspect = img.width / img.height;
  const m = new THREE.Mesh(new THREE.PlaneGeometry(height * aspect, height), new THREE.MeshStandardMaterial({ map: tex, transparent: true, alphaTest: 0.45, roughness: 0.7, side: THREE.DoubleSide }));
  m.customDepthMaterial = new THREE.MeshDepthMaterial({ depthPacking: THREE.RGBADepthPacking, map: tex, alphaTest: 0.45 });
  m.castShadow = true;
  return m;
};

const mouse = { x: 0, y: 0, sx: 0, sy: 0, down: false, dx: 0 };
host.addEventListener('pointermove', (e) => {
  const r = host.getBoundingClientRect();
  const nx = (e.clientX - r.left) / r.width * 2 - 1, ny = (e.clientY - r.top) / r.height * 2 - 1;
  if (mouse.down) mouse.dx += (nx - mouse.x);
  mouse.x = nx; mouse.y = ny; mouse.moved = true;
});
host.addEventListener('pointerdown', () => { mouse.down = true; });
window.addEventListener('pointerup', () => { mouse.down = false; });

const runLoop = (update) => {
  const clock = new THREE.Clock();
  // Post-processing: soft contact shadows in corners and under things (SSAO, desktop only), a gentle glow on
  // the brightest lights (bloom), then the usual sRGB output. Falls back to a plain render if unavailable.
  let fx;
  const makeFx = () => {
    if (!THREE.EffectComposer || self._noFx) return null;
    const c = new THREE.EffectComposer(renderer); c.setPixelRatio(renderer.getPixelRatio()); c.setSize(W, H);
    let ao = null;
    if (W >= 768) {
      ao = new THREE.SSAOPass(scene, camera, W, H); ao.kernelRadius = 0.45; ao.minDistance = 0.00002; ao.maxDistance = 0.003;
      // Tags, glows, dust and glass stay out of the depth/normal pass, so they don't cast dark halos.
      let skip = [], age = 999;
      const base = ao.renderOverride.bind(ao);
      ao.renderOverride = (r, m, rt, cc, ca) => {
        if (age++ > 90) { skip = []; age = 0; scene.traverse((o) => { if (o.isSprite || o.isPoints || (o.isMesh && o.material && !Array.isArray(o.material) && (o.material.transparent || o.material.visible === false))) skip.push(o); }); }
        const was = skip.map((o) => o.visible); skip.forEach((o) => { o.visible = false; });
        base(r, m, rt, cc, ca);
        skip.forEach((o, i) => { o.visible = was[i]; });
      };
      c.addPass(ao);
    } else c.addPass(new THREE.RenderPass(scene, camera));
    // A soft warm outline around whatever you hover (it replaces the floating tags).
    if (THREE.OutlinePass) { const ol = self._outline = new THREE.OutlinePass(new THREE.Vector2(W, H), scene, camera); ol.edgeStrength = 9; ol.edgeGlow = 1.2; ol.edgeThickness = 2.6; ol.pulsePeriod = 2.2; ol.visibleEdgeColor.set('#ffe9a8'); ol.hiddenEdgeColor.set('#5a4520'); c.addPass(ol); }
    const bloom = self._bloom = new THREE.UnrealBloomPass(new THREE.Vector2(W, H), 0.32, 0.55, 0.9); c.addPass(bloom);
    c.addPass(new THREE.ShaderPass(THREE.GammaCorrectionShader));
    self._onResize = (w, h) => { c.setSize(w, h); if (ao) ao.setSize(w, h); if (self._outline) self._outline.setSize(w, h); };
    return c;
  };
  let frame = 0, lastNow = 0, slow = 0, pr = renderer.getPixelRatio();
  renderer.shadowMap.autoUpdate = false;
  // Only draw while the board is on screen.
  let onScreen = true;
  if (window.IntersectionObserver) new IntersectionObserver((es) => { onScreen = es[0].isIntersecting; }).observe(host);
  const tick = () => {
    if (self._dead) return;
    if (!onScreen) { self._raf3 = requestAnimationFrame(tick); return; }
    const t = clock.getElapsedTime();
    mouse.sx += (mouse.x - mouse.sx) * 0.06; mouse.sy += (mouse.y - mouse.sy) * 0.06;
    update(self._p || 0, t);
    frame++;
    renderer.shadowMap.needsUpdate = frame % 2 === 0;
    const now = performance.now(), dt = now - (lastNow || now); lastNow = now;
    slow = dt > 34 ? slow + 1 : Math.max(0, slow - 1);
    if (slow > 45 && pr > 0.75) { pr = Math.max(0.75, pr - 0.25); renderer.setPixelRatio(pr); if (fx) fx.setPixelRatio(pr); slow = 0; }
    if (fx === undefined) fx = makeFx();
    if (fx) fx.render(); else renderer.render(scene, camera);
    if (frame === 3 && self.onReady) self.onReady();
    self._raf3 = requestAnimationFrame(tick);
  };
  tick();
};
const fontsReady = Promise.all(['118px "Permanent Marker"', '600 38px Caveat', '700 32px Caveat'].map((f) => document.fonts ? document.fonts.load(f) : null)).catch(() => null);

// ---- The Room, live ----
// The same room, but Lakshya is a 3D figure sat in the chair (glasses, checked
// shirt, waves hello and follows you with his eyes), and the room is the menu:
// the notebook on the desk is About me, the record crate on the shelf is
// Projects (each sleeve is one project), the trophy shelf is Achievements.
// Hover one and it lights up; click it and the camera flies over to it.
const C = (hex) => new THREE.Color(hex).convertSRGBToLinear();
Promise.all([loadImg(PHOTO), Promise.all(STK.map(loadImg)), fontsReady, document.fonts ? document.fonts.load('100px Anton').catch(() => null) : null]).then(([photo, stickers]) => {
  scene.background = new THREE.Color(0xa9c4e0);

  // ---- light
  const amb = new THREE.AmbientLight(0xfff4e8, 0.16); scene.add(amb);
  const hemi = new THREE.HemisphereLight(0xe6eeff, 0x8a6a4a, 0.38); scene.add(hemi);
  const lamp = new THREE.PointLight(0xffb566, 2.4, 7.5, 2); lamp.castShadow = false; lamp.shadow.mapSize.set(512, 512); lamp.shadow.bias = -0.002; lamp.shadow.radius = 4; scene.add(lamp);
  const moon = new THREE.SpotLight(0xffe9c4, 5.5, 22, 0.42, 0.45, 1); moon.position.set(-2.8, 4.8, -7.5); moon.castShadow = true; moon.shadow.bias = -0.0006; moon.shadow.mapSize.set(1024, 1024); scene.add(moon); scene.add(moon.target); moon.target.position.set(0.6, 0, 1.0); moon.angle = 0.55;
  const neonLight = new THREE.PointLight(0xfff0c8, 0.9, 5, 2); neonLight.position.set(1.1, 3.2, -2.3); scene.add(neonLight);
  const screenLight = new THREE.PointLight(0x5a8cff, 0.7, 3, 2); screenLight.position.set(1.1, 1.75, -1.9); scene.add(screenLight);
  const key = new THREE.DirectionalLight(0xffffff, 0.35); key.position.set(6, 9, 7); key.castShadow = true; key.shadow.mapSize.set(1024, 1024); Object.assign(key.shadow.camera, { left: -6, right: 6, top: 6, bottom: -6 }); key.shadow.camera.updateProjectionMatrix(); scene.add(key);

  const room = new THREE.Group(); scene.add(room);
  const add = (m, x, y, z, parent = room) => { m.position.set(x, y, z); parent.add(m); return m; };
  const at = (m, x, y, z) => { m.position.set(x, y, z); return m; };

  // ---- the shell: wooden floor slab and two walls
  // Seeded random, so the room looks the same every visit.
  let seed = 7; const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
  const drawPlanks = (g, w, h, bump) => {
    const rows = 12, rh = h / rows;
    for (let r = 0; r < rows; r++) {
      let x = -Math.floor(rnd() * 500);
      while (x < w) {
        const len = 380 + rnd() * 420, tone = rnd();
        const base = bump ? [128, 128, 128] : [Math.round(96 + tone * 38), Math.round(60 + tone * 24), Math.round(34 + tone * 14)];
        g.fillStyle = 'rgb(' + base.join(',') + ')'; g.fillRect(x, r * rh, len, rh);
        // grain: long wavy lines along the plank
        for (let k = 0; k < 12; k++) {
          const y0 = r * rh + rnd() * rh, amp = 1 + rnd() * 3, ph = rnd() * 6, a = 0.04 + rnd() * 0.1;
          g.strokeStyle = bump ? 'rgba(60,60,60,' + a * 2 + ')' : 'rgba(55,30,12,' + a + ')'; g.lineWidth = 0.6 + rnd() * 1.4;
          g.beginPath(); for (let t = 0; t <= len; t += 24) g.lineTo(x + t, y0 + Math.sin(t / 60 + ph) * amp); g.stroke();
        }
        if (rnd() < 0.25) { const kx = x + rnd() * len, ky = r * rh + rnd() * rh; for (let q = 6; q > 0; q--) { g.strokeStyle = bump ? 'rgba(40,40,40,0.4)' : 'rgba(70,38,14,0.35)'; g.beginPath(); g.ellipse(kx, ky, q * 5, q * 2.2, 0, 0, 7); g.stroke(); } }
        // dark seam around each plank
        g.fillStyle = bump ? '#202020' : 'rgba(25,12,4,0.85)'; g.fillRect(x, r * rh, 3, rh); g.fillRect(x, r * rh, len, 2.5);
        x += len;
      }
    }
  };
  seed = 7; const planks = canvasTex(1024, 1024, (g, w, h) => { g.scale(0.5, 0.5); drawPlanks(g, 2048, 2048, false); });
  seed = 7; const planksBump = canvasTex(1024, 1024, (g, w, h) => { g.scale(0.5, 0.5); drawPlanks(g, 2048, 2048, true); });
  [planks, planksBump].forEach((t) => { t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(1.6, 2); });
  const floorTop = mat(0xffffff, 0.5, 0, 0.35, { map: planks, bumpMap: planksBump, bumpScale: 0.012, roughnessMap: planksBump });
  const slabSide = mat(0x2a1b10, 0.8);
  const floor = new THREE.Mesh(new THREE.BoxGeometry(11.4, 0.35, 9.2), [slabSide, slabSide, floorTop, slabSide, slabSide, slabSide]); floor.receiveShadow = true; add(floor, 2.0, -0.175, 1.5);
  const plaster = (g, w, h, bump) => {
    g.fillStyle = bump ? '#808080' : '#2a2a31'; g.fillRect(0, 0, w, h);
    for (let i = 0; i < 3000; i++) { const v = rnd(); g.fillStyle = bump ? 'rgba(' + (v < 0.5 ? '0,0,0' : '255,255,255') + ',' + (0.05 + rnd() * 0.1) + ')' : 'rgba(255,255,255,' + rnd() * 0.025 + ')'; const r = 1 + rnd() * 3; g.beginPath(); g.arc(rnd() * w, rnd() * h, r, 0, 7); g.fill(); }
    // roller marks
    for (let i = 0; i < 25; i++) { const gx = rnd() * w, gy = rnd() * h, gr = g.createRadialGradient(gx, gy, 0, gx, gy, 120 + rnd() * 200); gr.addColorStop(0, bump ? 'rgba(255,255,255,0.03)' : 'rgba(255,255,255,0.012)'); gr.addColorStop(1, 'rgba(255,255,255,0)'); g.fillStyle = gr; g.fillRect(0, 0, w, h); }
  };
  seed = 11; const wallTex = canvasTex(512, 512, (g, w, h) => plaster(g, w, h, false));
  seed = 11; const wallBump = canvasTex(512, 512, (g, w, h) => plaster(g, w, h, true));
  [wallTex, wallBump].forEach((t) => { t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(2, 1.2); });
  const wallMat = mat(0xffffff, 0.9, 0, 0.25, { map: wallTex, bumpMap: wallBump, bumpScale: 0.004 });
  add(rbox(0.6, 4, 0.2, 0.01, wallMat), -3.2, 2, -2.9);
  add(rbox(5.8, 4, 0.2, 0.01, wallMat), 1.7, 2, -2.9);
  add(rbox(2.0, 1.3, 0.2, 0.01, wallMat), 5.6, 0.65, -2.9);
  add(rbox(2.0, 0.7, 0.2, 0.01, wallMat), 5.6, 3.65, -2.9);
  add(rbox(1.1, 4, 0.2, 0.01, wallMat), 7.15, 2, -2.9);
  add(rbox(1.7, 1.55, 0.2, 0.01, wallMat), -2.05, 0.775, -2.9);
  add(rbox(1.7, 0.95, 0.2, 0.01, wallMat), -2.05, 3.525, -2.9);
  add(rbox(0.2, 4.2, 9.2, 0.03, wallMat), -3.6, 2, 1.5);
  const shut = (m) => { m.castShadow = false; return m; };
  add(rbox(0.2, 4.2, 9.2, 0.03, wallMat), 7.6, 2, 1.5);
  // front wall with a doorway (1.1 wide, 2.2 tall) in the middle
  const DW = 1.1, DH = 2.2, FZ = 6.0;
  add(shut(rbox(3.8 - DW / 2, 4.2, 0.2, 0.01, wallMat)), -(3.8 + DW / 2) / 2, 2, FZ);
  add(shut(rbox(7.8 - DW / 2, 4.2, 0.2, 0.01, wallMat)), (7.8 + DW / 2) / 2, 2, FZ);
  add(shut(rbox(DW, 4.2 - DH, 0.2, 0.01, wallMat)), 0, DH + (4.2 - DH) / 2, FZ);

  // ---- outside: a big two-storey house on a sunny day, built from photo-scanned CC0 materials (Poly Haven)
  const house = new THREE.Group(); room.add(house);
  const AS = '/assets/ph/';
  const texL = new THREE.TextureLoader();
  const houseMats = [];
  const pbr = (name, rx, ry, extra = {}) => {
    const ld = (suf, srgb) => { const t = texL.load(AS + 'tex/' + name + '_' + suf + '.jpg'); t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(rx, ry); t.anisotropy = 8; if (srgb) t.encoding = THREE.sRGBEncoding; return t; };
    const m = new THREE.MeshStandardMaterial(Object.assign({ map: ld('Diffuse', true), normalMap: ld('nor_gl'), roughnessMap: ld('Rough'), envMapIntensity: 0.6 }, extra));
    houseMats.push(m); return m;
  };
  const HW = 16, HZ = 6.2, G1 = 4.4, G2 = 3.4;
  const box = (w, h, d, m, x, y, z, cast = true) => { const b = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), m); b.position.set(x, y, z); b.castShadow = cast; b.receiveShadow = true; house.add(b); return b; };
  // ground floor in brick, with the doorway left open
  const sideW = (HW - DW) / 2;
  box(sideW, G1, 0.3, pbr('brick_wall_10', sideW / 2.2, G1 / 2.2), -(DW + sideW) / 2, G1 / 2, HZ);
  box(sideW, G1, 0.3, pbr('brick_wall_10', sideW / 2.2, G1 / 2.2), (DW + sideW) / 2, G1 / 2, HZ);
  box(DW, G1 - DH, 0.3, pbr('brick_wall_10', DW / 2.2, (G1 - DH) / 2.2), 0, DH + (G1 - DH) / 2, HZ);
  // upper floor in white render, wood cladding in the middle
  const render = pbr('plastered_wall_04', HW / 3, G2 / 3, { color: 0xf2efe8 });
  box(HW, G2, 0.3, render, 0, G1 + G2 / 2, HZ - 0.1);
  box(3.4, G2, 0.08, pbr('brown_planks_05', 1.2, 1.6), 0, G1 + G2 / 2, HZ + 0.1);
  // the sides, so it has depth when the camera drifts
  [-1, 1].forEach((sd) => { box(0.3, G1, 9.4, pbr('brick_wall_10', 4, 2), sd * HW / 2, G1 / 2, HZ - 4.7); box(0.3, G2, 9.4, render, sd * HW / 2, G1 + G2 / 2, HZ - 4.8); });
  // stone band between the floors, and a plinth
  const hStoneM = mat(0xd8d2c4, 0.8, 0, 0.4);
  box(HW + 0.3, 0.22, 0.5, hStoneM, 0, G1, HZ + 0.05);
  box(HW + 0.3, 0.35, 0.4, mat(0x6e6a64, 0.9), 0, 0.0, HZ + 0.05);
  // slate roof: a long gable with deep eaves, gutter, and a brick chimney
  const ridgeY = G1 + G2 + 2.9, eaveZ = HZ + 0.7, ridgeZ = HZ - 4.7;
  const rl = Math.hypot(ridgeY - (G1 + G2), eaveZ - ridgeZ) + 0.2, ra = Math.atan2(ridgeY - (G1 + G2), eaveZ - ridgeZ);
  const roofM = pbr('roof_slates_02', 7, 3, { color: 0x5d626c });
  const roofF = box(HW + 1.2, 0.18, rl, roofM, 0, (ridgeY + G1 + G2) / 2, (eaveZ + ridgeZ) / 2); roofF.rotation.x = ra;
  const roofB = box(HW + 1.2, 0.18, rl, roofM, 0, (ridgeY + G1 + G2) / 2, ridgeZ - (eaveZ - ridgeZ) / 2); roofB.rotation.x = -ra;
  const gutter = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.07, HW + 1.2, 12), mat(0x3a3a3a, 0.4, 0.6)); gutter.rotation.z = Math.PI / 2; gutter.position.set(0, G1 + G2 - 0.05, eaveZ + 0.05); house.add(gutter);
  box(0.9, 3.2, 0.9, pbr('brick_wall_10', 0.5, 1.5), 5, ridgeY - 0.3, HZ - 3.6);
  box(1.05, 0.12, 1.05, hStoneM, 5, ridgeY + 1.3, HZ - 3.6);
  // the gable ends (triangles) on both sides
  const tri = new THREE.Shape(); tri.moveTo(-(eaveZ - ridgeZ) - 0.1, 0); tri.lineTo(0.1, 0); tri.lineTo(0, 0); tri.moveTo(0, 0);
  [-1, 1].forEach((sd) => { const sh = new THREE.Shape(); sh.moveTo(HZ + 0.15, 0); sh.lineTo(ridgeZ, ridgeY - G1 - G2); sh.lineTo(ridgeZ - (HZ + 0.15 - ridgeZ), 0); sh.lineTo(HZ + 0.15, 0); const g = new THREE.Mesh(new THREE.ShapeGeometry(sh), render); g.rotation.y = -Math.PI / 2 * sd; g.position.set(sd * (HW / 2 + 0.01), G1 + G2, 0); house.add(g); g.material.side = THREE.DoubleSide; });
  // windows: real glass that mirrors the sky, white frames, stone sills
  const hGlassM = new THREE.MeshStandardMaterial({ color: 0x1b2430, roughness: 0.05, metalness: 0.9, envMapIntensity: 1.4 }); houseMats.push(hGlassM);
  const hFrameM = mat(0xf5f3ee, 0.5, 0, 0.5);
  const win = (x, y, w, h, bars = 1) => {
    box(w, h, 0.05, hGlassM, x, y, HZ + 0.14, false);
    [[0, h / 2, w + 0.12, 0.08], [0, -h / 2, w + 0.12, 0.08], [-w / 2, 0, 0.08, h], [w / 2, 0, 0.08, h]].forEach(([dx, dy, ww, hh]) => box(ww, hh, 0.12, hFrameM, x + dx, y + dy, HZ + 0.18, false));
    for (let i = 1; i <= bars; i++) box(0.05, h, 0.08, hFrameM, x - w / 2 + w * i / (bars + 1), y, HZ + 0.18, false);
    box(w + 0.3, 0.08, 0.26, hStoneM, x, y - h / 2 - 0.08, HZ + 0.25);
  };
  win(-4.2, 2.1, 2.8, 2.0, 2); win(4.2, 2.1, 2.8, 2.0, 2); win(-7.0, 2.3, 0.9, 1.5, 0); win(7.0, 2.3, 0.9, 1.5, 0);
  win(-5.0, G1 + 1.7, 1.6, 1.6, 1); win(5.0, G1 + 1.7, 1.6, 1.6, 1); win(0, G1 + 1.6, 1.4, 2.2, 1);
  // the door: deep navy, brass knob, a transom of glass above
  doorTransom: { box(DW, 0.5, 0.05, hGlassM, 0, DH + 0.35, HZ + 0.14, false); }
  [[-DW / 2 - 0.08, (DH + 0.6) / 2, 0.16, DH + 0.6], [DW / 2 + 0.08, (DH + 0.6) / 2, 0.16, DH + 0.6], [0, DH + 0.68, DW + 0.32, 0.16], [0, DH + 0.06, DW, 0.08]].forEach(([x, y, w, h]) => box(w, h, 0.36, hFrameM, x, y, HZ));
  const doorPivot = new THREE.Group(); doorPivot.position.set(-DW / 2, 0, HZ - 0.02); house.add(doorPivot);
  seed = 41; const doorTex = canvasTex(256, 512, (g, w, h) => { g.fillStyle = '#1d2c44'; g.fillRect(0, 0, w, h); g.strokeStyle = 'rgba(0,0,0,0.35)'; g.lineWidth = 8; [[30, 40, 150], [30, 210, 120], [30, 350, 130]].forEach(([x, y, hh]) => g.strokeRect(x, y, w - 60, hh)); g.strokeStyle = 'rgba(255,255,255,0.09)'; g.lineWidth = 3; [[36, 46, 138], [36, 216, 108], [36, 356, 118]].forEach(([x, y, hh]) => g.strokeRect(x, y, w - 72, hh)); });
  const door = new THREE.Mesh(new THREE.BoxGeometry(DW, DH, 0.07), mat(0xffffff, 0.35, 0, 0.8, { map: doorTex })); door.position.set(DW / 2, DH / 2, 0); door.castShadow = true; doorPivot.add(door);
  const doorGlass = new THREE.Mesh(new THREE.PlaneGeometry(0.01, 0.01), new THREE.MeshBasicMaterial({ visible: false })); doorPivot.add(doorGlass);
  const brass = mat(0xd4a24a, 0.25, 0.9, 1);
  const knob = new THREE.Mesh(new THREE.SphereGeometry(0.045, 20, 16), brass); knob.position.set(DW - 0.12, 1.0, 0.08); doorPivot.add(knob);
  const plate = new THREE.Mesh(new THREE.PlaneGeometry(0.42, 0.12), new THREE.MeshBasicMaterial({ map: canvasTex(400, 112, (g, w, h) => { g.fillStyle = '#c9a050'; g.fillRect(0, 0, w, h); g.fillStyle = '#2a1a08'; g.font = '700 54px Anton, Impact, sans-serif'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText('LAKSHYA', w / 2, h / 2 + 3); }) }));
  plate.position.set(DW / 2, 1.5, 0.04); doorPivot.add(plate);
  const doorHalo = glow(0xfff1c8, 2.4, 0); house.add(at(doorHalo, 0, 1.2, HZ + 0.3));
  const spill = new THREE.PointLight(0xffd59a, 0, 9, 2); spill.position.set(0, 1.6, HZ - 0.6); scene.add(spill);
  // porch: a balcony on two columns over the door, with a glass rail; steps; wall lamps
  box(3.8, 0.25, 1.8, hStoneM, 0, G1 - 0.05, HZ + 0.9);
  [-1.65, 1.65].forEach((x) => { const c = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.14, G1 - 0.2, 24), hFrameM); c.position.set(x, (G1 - 0.2) / 2, HZ + 1.6); c.castShadow = true; house.add(c); });
  const railG = new THREE.MeshStandardMaterial({ color: 0xbfd6e0, roughness: 0.05, metalness: 0.2, transparent: true, opacity: 0.25, envMapIntensity: 1.5 }); houseMats.push(railG);
  box(3.8, 1.0, 0.03, railG, 0, G1 + 0.6, HZ + 1.78, false); box(3.84, 0.05, 0.06, mat(0x222222, 0.3, 0.8), 0, G1 + 1.1, HZ + 1.78, false);
  const stepM = pbr('cobblestone_floor_08', 1, 0.4);
  box(3.4, 0.17, 1.9, mat(0x9a958c, 0.85), 0, -0.085 + 0.0, HZ + 1.05); box(3.0, 0.17, 0.5, mat(0x8f8a82, 0.85), 0, -0.26, HZ + 2.2);
  [-1, 1].forEach((sd) => { house.add(at(rbox(0.16, 0.3, 0.14, 0.02, mat(0x1a1a1a, 0.4, 0.6)), sd * 1.0, 2.35, HZ + 0.22)); house.add(at(new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.2, 0.08), new THREE.MeshBasicMaterial({ color: 0xfff0d0, toneMapped: false })), sd * 1.0, 2.33, HZ + 0.28)); });
  // garden: lawn, a cobblestone path to the door, a pavement along the front
  const lawn = new THREE.Mesh(new THREE.PlaneGeometry(80, 50), pbr('leafy_grass', 30, 20, { color: 0x86b25a })); lawn.rotation.x = -Math.PI / 2; lawn.receiveShadow = true; lawn.position.set(0, -0.36, HZ + 22); house.add(lawn);
  const pathM = pbr('cobblestone_floor_08', 1, 7); const path = new THREE.Mesh(new THREE.PlaneGeometry(1.8, 14), pathM); path.rotation.x = -Math.PI / 2; path.receiveShadow = true; path.position.set(0, -0.345, HZ + 9.3); house.add(path);
  const paveM = pbr('cobblestone_floor_08', 20, 1.2); const pave = new THREE.Mesh(new THREE.PlaneGeometry(80, 2.4), paveM); pave.rotation.x = -Math.PI / 2; pave.receiveShadow = true; pave.position.set(0, -0.34, HZ + 17); house.add(pave);
  // real shrubs and potted plants (glTF), placed when they arrive
  if (THREE.GLTFLoader) {
    const gl = new THREE.GLTFLoader();
    const place = (name, spots) => gl.load(AS + 'models/' + name + '/' + name + '.gltf', (g) => spots.forEach(([x, z, sc, ry]) => { const o = g.scene.clone(true); o.traverse((m) => { if (m.isMesh) { m.castShadow = true; m.receiveShadow = true; if (m.material) houseMats.push(m.material); } }); o.position.set(x, -0.36, z); o.scale.setScalar(sc); o.rotation.y = ry; house.add(o); applyEnv(); }));
    { const hedgeM = pbr('leafy_grass', 3, 0.6, { color: 0x3f6b2e });
      [[-7.8, -1.3], [1.3, 7.8]].forEach(([x0, x1]) => { const hg = new THREE.Mesh(new THREE.BoxGeometry(x1 - x0, 0.8, 0.7, Math.round((x1 - x0) * 4), 4, 4), hedgeM); const pa = hg.geometry.attributes.position; for (let i = 0; i < pa.count; i++) pa.setZ(i, pa.getZ(i) * (1 + Math.cos(pa.getX(i) * 9) * 0.05)); hg.geometry.computeVertexNormals(); hg.position.set((x0 + x1) / 2, -0.36 + 0.4, HZ + 0.85); hg.castShadow = hg.receiveShadow = true; house.add(hg); }); }
    place('shrub_04', [[-4.2, HZ + 1.3, 3.5, 0.5], [4.2, HZ + 1.3, 3.5, 2.5], [-1.5, HZ + 3.6, 2.6, 1], [1.5, HZ + 3.6, 2.6, 2], [-1.5, HZ + 7, 2.6, 3], [1.5, HZ + 7, 2.6, 4]]);
    place('potted_plant_02', [[-0.95, HZ + 0.55, 1.6, 0], [0.95, HZ + 0.55, 1.6, 1.4]]);
  }
  // sunlight, sky light, and the photographed sky itself
  const sun = new THREE.DirectionalLight(0xfff1dc, 2.2); sun.position.set(14, 20, 26); sun.target.position.set(0, 2, 4); sun.castShadow = true; sun.shadow.mapSize.set(1024, 1024); Object.assign(sun.shadow.camera, { left: -14, right: 14, top: 14, bottom: -6, near: 1, far: 70 }); sun.shadow.bias = -0.0004; sun.shadow.camera.updateProjectionMatrix(); scene.add(sun); scene.add(sun.target);
  const skyFill = new THREE.HemisphereLight(0xcfe3ff, 0x5a6b3a, 0.6); scene.add(skyFill);
  let hdrEnv = null;
  const applyEnv = () => { if (hdrEnv) houseMats.forEach((m) => { if (!m.envMap) { m.envMap = hdrEnv; m.needsUpdate = true; } }); };
  scene.background = new THREE.Color(0xa9c4e0);
  if (THREE.RGBELoader) new THREE.RGBELoader().setDataType(THREE.HalfFloatType).load(AS + 'sky.hdr', (tx) => {
    const pm = new THREE.PMREMGenerator(renderer); hdrEnv = pm.fromEquirectangular(tx).texture; applyEnv();
    const sky = new THREE.Mesh(new THREE.SphereGeometry(150, 48, 24), new THREE.MeshBasicMaterial({ map: tx, side: THREE.BackSide, depthWrite: false })); sky.rotation.y = -0.9; scene.add(sky);
  });
  door.userData.spot = 'door'; knob.userData.spot = 'door'; plate.userData.spot = 'door'; doorGlass.userData.spot = 'door';
  add(shut(rbox(11.6, 0.2, 9.2, 0.03, mat(0xf2efe8, 0.95, 0, 0.2))), 2.0, 4.05, 1.5);
  add(shut(rbox(0.05, 0.12, 9.2, 0.01, mat(0xf2efe8, 0.5))), 7.48, 0.06, 1.5);
  const trim = mat(0xf2efe8, 0.5);
  add(rbox(11.1, 0.12, 0.05, 0.01, trim), 2.0, 0.06, -2.78);
  add(rbox(0.05, 0.12, 9.2, 0.01, trim), -3.48, 0.06, 1.5);

  // ---- the rug: graph paper, like the hero
  const rug = new THREE.Mesh(new THREE.CylinderGeometry(1.5, 1.52, 0.02, 64), (() => { const weave = (g, w, h, bump) => {
      g.fillStyle = bump ? '#808080' : '#e6dfd0'; g.fillRect(0, 0, w, h);
      for (let y = 0; y < h; y += 4) for (let x = (y / 4) % 2 ? 0 : 4; x < w; x += 8) { g.fillStyle = bump ? 'rgba(255,255,255,0.35)' : 'rgba(255,255,255,' + (0.1 + rnd() * 0.15) + ')'; g.fillRect(x, y, 5, 3); }
      for (let i = 0; i < 3000; i++) { g.fillStyle = bump ? 'rgba(0,0,0,0.2)' : 'rgba(120,100,80,' + rnd() * 0.12 + ')'; g.fillRect(rnd() * w, rnd() * h, 1 + rnd() * 6, 1); }
      g.lineWidth = 34; g.strokeStyle = bump ? '#606060' : '#c8262a'; g.beginPath(); g.arc(w / 2, h / 2, w / 2 - 30, 0, 7); g.stroke();
      g.lineWidth = 6; g.strokeStyle = bump ? '#606060' : '#c8262a'; g.beginPath(); g.arc(w / 2, h / 2, w / 2 - 70, 0, 7); g.stroke();
    }; seed = 5; const m = canvasTex(1024, 1024, (g, w, h) => weave(g, w, h, false)); seed = 5; const b = canvasTex(1024, 1024, (g, w, h) => weave(g, w, h, true));
    return mat(0xffffff, 1, 0, 0.1, { map: m, bumpMap: b, bumpScale: 0.006 }); })());
  rug.receiveShadow = true; add(rug, -0.3, 0.01, 0.9);

  // ---- window onto the city
  const cityTex = canvasTex(1024, 900, (g, w, h) => {
    const sky = g.createLinearGradient(0, 0, 0, h); sky.addColorStop(0, '#0a1030'); sky.addColorStop(0.6, '#2a1f5e'); sky.addColorStop(1, '#6b3a6e'); g.fillStyle = sky; g.fillRect(0, 0, w, h);
    for (let i = 0; i < 120; i++) { g.fillStyle = 'rgba(255,255,255,' + Math.random() + ')'; g.fillRect(Math.random() * w, Math.random() * h * 0.5, 2, 2); }
    g.fillStyle = '#FFF3C4'; g.beginPath(); g.arc(780, 170, 70, 0, Math.PI * 2); g.fill();
    for (let b = 0; b < 16; b++) { const bw = 50 + Math.random() * 90, bh = 200 + Math.random() * 420, bx = b * 66 - 30; g.fillStyle = '#0b0b16'; g.fillRect(bx, h - bh, bw, bh); for (let wy = h - bh + 14; wy < h - 10; wy += 22) for (let wx = bx + 8; wx < bx + bw - 10; wx += 16) if (Math.random() < 0.35) { g.fillStyle = Math.random() < 0.8 ? '#FFD27A' : '#74D4F0'; g.fillRect(wx, wy, 7, 10); } }
  });
  const glass = new THREE.Mesh(new THREE.PlaneGeometry(1.7, 1.5), new THREE.MeshStandardMaterial({ color: 0xdcecf5, transparent: true, opacity: 0.1, roughness: 0.05, depthWrite: false })); add(glass, -2.05, 2.3, -2.79);
  const dayGlass = glass.material; const nightGlass = new THREE.MeshBasicMaterial({ map: cityTex, toneMapped: false });
  const frameMat = mat(0xf5f3ee, 0.5, 0, 0.4);
  [[0, 0.78, 1.84, 0.08], [0, -0.78, 1.84, 0.08], [-0.9, 0, 0.08, 1.64], [0.9, 0, 0.08, 1.64], [0, 0, 0.05, 1.5], [0, 0, 1.7, 0.05]].forEach(([x, y, w, h]) => add(rbox(w, h, 0.08, 0.01, frameMat), -2.05 + x, 2.3 + y, -2.75));
  add(rbox(2.0, 0.06, 0.26, 0.02, frameMat), -2.05, 1.5, -2.66);
  // curtains on a rod either side of the window
  add(new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 2.6, 8), mat(0x1a1a1a, 0.4, 0.6)), -2.05, 3.15, -2.7).rotation.z = Math.PI / 2;
  const curtainMat = mat(0xe3dccd, 1, 0, 0.1, { side: THREE.DoubleSide, transparent: true, opacity: 0.92 });
  [-1, 1].forEach((sd) => { const cg = new THREE.PlaneGeometry(0.5, 1.75, 40, 1); const pa = cg.attributes.position; for (let i = 0; i < pa.count; i++) { const x = pa.getX(i), y = pa.getY(i); pa.setZ(i, Math.sin(x * 38) * 0.035 * (0.7 + (1.75 / 2 - y) * 0.25)); } cg.computeVertexNormals(); const c = new THREE.Mesh(cg, curtainMat); c.castShadow = c.receiveShadow = true; add(c, -2.05 + sd * 1.07, 2.25, -2.68); });
  // right wall: a framed poster and a small floating shelf with books
  const posterTex = canvasTex(600, 840, (g, w, h) => { g.fillStyle = '#efe9dc'; g.fillRect(0, 0, w, h); g.fillStyle = '#c8262a'; g.beginPath(); g.arc(w / 2, 330, 190, 0, 7); g.fill(); g.fillStyle = '#111'; g.font = '700 74px Anton, Impact, sans-serif'; g.textAlign = 'center'; g.fillText('SHIP IT.', w / 2, 650); g.font = '28px "Space Mono", monospace'; g.fillText('build \u00b7 break \u00b7 learn', w / 2, 710); g.fillStyle = 'rgba(0,0,0,0.05)'; for (let i = 0; i < 2000; i++) g.fillRect(Math.random() * w, Math.random() * h, 2, 2); });
  const poster = new THREE.Mesh(new THREE.PlaneGeometry(0.9, 1.26), mat(0xffffff, 0.8, 0, 0.1, { map: posterTex })); poster.rotation.y = -Math.PI / 2; add(poster, 3.44, 2.3, 0.4);
  add(rbox(0.04, 1.34, 0.98, 0.01, mat(0x161616, 0.4, 0.3)), 3.485, 2.3, 0.4);

  [].forEach((c, i) => { const b = rbox(0.18, 0.24 + (i % 3) * 0.03, 0.05, 0.005, mat(c, 0.75)); b.rotation.x = i === 4 ? 0.35 : 0; add(b, 3.37, 1.6 + (i % 3) * 0.015, 1.65 + i * 0.07); });
  // a tall plant in a pot in the corner
  const bigPot = add(new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.17, 0.42, 32), mat(0xd9d3c7, 0.7)), 2.95, 0.21, -1.0); bigPot.castShadow = bigPot.receiveShadow = true;
  const leafMat = mat(0x2f6b3a, 0.6, 0, 0.3, { side: THREE.DoubleSide });
  for (let i = 0; i < 0; i++) { const lg = new THREE.PlaneGeometry(0.16, 0.7, 1, 6); const pa = lg.attributes.position; for (let k = 0; k < pa.count; k++) { const y = pa.getY(k) + 0.35; pa.setX(k, pa.getX(k) * Math.sin(Math.PI * y / 0.7)); pa.setZ(k, -y * y * 0.6); } lg.computeVertexNormals(); const lf = new THREE.Mesh(lg, leafMat); lf.castShadow = true; const a = i * 2.4; lf.position.set(2.95, 0.42 + 0.35 + (i % 4) * 0.08, -1.0); lf.rotation.set(-0.3 - (i % 3) * 0.15, a, 0); lf.translateY(0); room.add(lf); }
  // cables hanging from the desk to the floor socket
  [[0.25, 0x111111], [0.32, 0x222222]].forEach(([dx, c]) => { const cv = new THREE.CatmullRomCurve3([new THREE.Vector3(1.1 + dx, 0.74, -2.55), new THREE.Vector3(1.15 + dx, 0.3, -2.62), new THREE.Vector3(1.3 + dx, 0.02, -2.6), new THREE.Vector3(2.2, 0.02, -2.74), new THREE.Vector3(2.4, 0.18, -2.78)]); const cb = new THREE.Mesh(new THREE.TubeGeometry(cv, 40, 0.008, 6), mat(c, 0.5)); room.add(cb); });
  add(rbox(0.1, 0.12, 0.02, 0.01, mat(0xeeeeee, 0.5)), 2.4, 0.2, -2.79);

  // ---- corkboard with stickers
  const cork = rbox(1.2, 0.9, 0.04, 0.02, mat(0xffffff, 1, 0, 0.1, { map: canvasTex(512, 384, (g, w, h) => { g.fillStyle = '#9c7449'; g.fillRect(0, 0, w, h); for (let i = 0; i < 3000; i++) { g.fillStyle = 'rgba(' + (60 + Math.random() * 80) + ',' + (40 + Math.random() * 50) + ',20,0.4)'; g.fillRect(Math.random() * w, Math.random() * h, 2, 2); } }) }));
  add(cork, -0.2, 2.35, -2.77);
  add(rbox(1.26, 0.96, 0.03, 0.02, mat(0x1a1a1a, 0.5)), -0.2, 2.35, -2.785);
  [[0, -0.33, 0.2, -0.15], [3, 0.05, 0.22, 0.12], [4, 0.35, 0.12, -0.08], [1, -0.28, -0.18, 0.1], [2, 0.12, -0.16, -0.1]].forEach(([i, x, y, r]) => { const im = stickers[i]; if (!im) return; const s = cutout(im, 0.26); s.rotation.z = r; add(s, -0.2 + x, 2.35 + y, -2.745); const pin = new THREE.Mesh(new THREE.SphereGeometry(0.018, 12, 8), mat([0xfa1a1d, 0xffd23f, 0x2849cb][i % 3], 0.3)); add(pin, -0.2 + x, 2.35 + y + 0.1, -2.73); });

  // ---- neon LAKSHYA
  const neonTex = canvasTex(2048, 480, (g, w, h) => { g.font = '330px Impact, Anton, sans-serif'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.lineJoin = 'round'; g.strokeStyle = '#FFF6DA'; g.lineWidth = 16; g.strokeText('LAKSHYA', w / 2, h / 2 + 16); g.fillStyle = 'rgba(255,246,218,0.15)'; g.fillText('LAKSHYA', w / 2, h / 2 + 16); });
  const neonGlowTex = canvasTex(1024, 300, (g, w, h) => { g.filter = 'blur(22px)'; g.font = '160px Impact, Anton, sans-serif'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillStyle = '#FFD27A'; g.fillText('LAKSHYA', w / 2, h / 2 + 8); });
  const neonGlow = new THREE.Mesh(new THREE.PlaneGeometry(4.2, 1.25), new THREE.MeshBasicMaterial({ map: neonGlowTex, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, toneMapped: false, opacity: 0.9 }));
  add(neonGlow, 1.15, 3.25, -2.77);
  const neon = new THREE.Mesh(new THREE.PlaneGeometry(3.2, 0.75), new THREE.MeshBasicMaterial({ map: neonTex, transparent: true, toneMapped: false }));
  add(neon, 1.15, 3.25, -2.76);

  // ---- the quote, framed in gold
  const quote = new THREE.Mesh(new THREE.BoxGeometry(1.05, 1.05, 0.05), [0, 0, 0, 0, 1, 0].map((f) => f ? mat(0xffffff, 0.6, 0, 0.2, { map: canvasTex(600, 600, (g, w, h) => { g.fillStyle = '#0b0b0b'; g.fillRect(0, 0, w, h); g.textAlign = 'center'; g.font = '700 84px "Times New Roman", serif'; [['Code and', '#fff'], ['Grind,', '#fff'], ['Lead', '#B99314'], ['the Mind', '#B99314']].forEach(([t, c], i) => { g.fillStyle = c; g.fillText(t, w / 2, 150 + i * 105); }); }) }) : mat(0xb99314, 0.25, 0.9, 1)));
  quote.castShadow = true; add(quote, 2.85, 2.3, -2.76);

  // ---- fairy lights along the top of the back wall
  const fairy = [];
  for (let i = 0; i <= 26; i++) {
    const t = i / 26; const x = lerp(-3.4, 3.4, t); const y = 3.78 - Math.sin(t * Math.PI * 3) ** 2 * 0.18;
    const col = [0xffd27a, 0xfff0c8, 0xffb566][i % 3];
    const b = new THREE.Mesh(new THREE.SphereGeometry(0.025, 10, 8), new THREE.MeshBasicMaterial({ color: col, toneMapped: false })); add(b, x, y, -2.72);
    const gl = glow(col, 0.32, 0.85); add(gl, x, y, -2.7); fairy.push({ gl, ph: Math.random() * 6 });
  }
  const wire = new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(Array.from({ length: 40 }, (_, i) => { const t = i / 39; return new THREE.Vector3(lerp(-3.4, 3.4, t), 3.8 - Math.sin(t * Math.PI * 3) ** 2 * 0.18, -2.73); })), 120, 0.006, 5), mat(0x0a0a0a, 0.5)); room.add(wire);

  // ---- the desk
  const wood = mat(0x6e4a2e, 0.45, 0, 0.5);
  const metal = mat(0x1b1b1e, 0.35, 0.6, 0.6);
  add(rbox(2.9, 0.07, 1.15, 0.03, wood), 1.05, 1.06, -2.12);
  [[-0.35, -2.58], [2.45, -2.58], [-0.35, -1.62], [2.45, -1.62]].forEach(([x, z]) => add(rbox(0.06, 1.03, 0.06, 0.02, metal), x, 0.515, z));
  add(rbox(2.8, 0.05, 0.05, 0.02, metal), 1.05, 0.25, -2.58);

  // Monitor with code on it.
  const codeCanvas = document.createElement('canvas'); codeCanvas.width = 1280; codeCanvas.height = 760;
  const codeTex = new THREE.CanvasTexture(codeCanvas); codeTex.encoding = THREE.sRGBEncoding;
  const code = [
    [['import', '#FF79C6'], [' { useState } ', '#E6E6E6'], ['from', '#FF79C6'], [" 'react'", '#F1FA8C']],
    [],
    [['export default function', '#FF79C6'], [' Lakshya', '#50FA7B'], ['() {', '#E6E6E6']],
    [['  const', '#FF79C6'], [' [coffee, setCoffee] = ', '#E6E6E6'], ['useState', '#8BE9FD'], ['(', '#E6E6E6'], ['Infinity', '#BD93F9'], [');', '#E6E6E6']],
    [['  const', '#FF79C6'], [' skills = [', '#E6E6E6'], ["'React'", '#F1FA8C'], [', ', '#E6E6E6'], ["'Flutter'", '#F1FA8C'], [', ', '#E6E6E6'], ["'ML'", '#F1FA8C'], ['];', '#E6E6E6']],
    [],
    [['  return', '#FF79C6'], [' (', '#E6E6E6']],
    [['    <', '#E6E6E6'], ['Hero', '#8BE9FD'], [' name', '#50FA7B'], ['=', '#E6E6E6'], ['"LAKSHYA"', '#F1FA8C'], [' />', '#E6E6E6']],
    [['    <', '#E6E6E6'], ['About', '#8BE9FD'], [' motto', '#50FA7B'], ['=', '#E6E6E6'], ['"Code and grind, lead the mind"', '#F1FA8C'], [' />', '#E6E6E6']],
    [['  );', '#E6E6E6']],
    [['}', '#E6E6E6']],
  ];
  const drawCode = (blink) => {
    const g = codeCanvas.getContext('2d');
    g.fillStyle = '#0d1117'; g.fillRect(0, 0, 1280, 760);
    g.fillStyle = '#161b22'; g.fillRect(0, 0, 1280, 56);
    ['#FF5F56', '#FFBD2E', '#27C93F'].forEach((c, i) => { g.fillStyle = c; g.beginPath(); g.arc(34 + i * 30, 28, 9, 0, Math.PI * 2); g.fill(); });
    g.fillStyle = '#E6E6E6'; g.font = '26px monospace'; g.fillText('Lakshya.tsx', 140, 37);
    g.font = '30px monospace';
    let lastX = 0, lastY = 0;
    code.forEach((line, i) => { const y = 120 + i * 54; g.fillStyle = '#4b5563'; g.fillText(String(i + 1).padStart(2, ' '), 24, y); let x = 90; line.forEach(([t, c]) => { g.fillStyle = c; g.fillText(t, x, y); x += g.measureText(t).width; }); lastX = x; lastY = y; });
    if (blink) { g.fillStyle = '#E6E6E6'; g.fillRect(lastX + 6, lastY - 26, 16, 32); }
    codeTex.needsUpdate = true;
  };
  drawCode(true);
  add(rbox(1.36, 0.82, 0.06, 0.03, mat(0x121214, 0.3, 0.4, 0.8)), 1.1, 1.75, -2.44);
  const screen = new THREE.Mesh(new THREE.PlaneGeometry(1.28, 0.76), new THREE.MeshBasicMaterial({ map: codeTex, toneMapped: false })); add(screen, 1.1, 1.75, -2.405);
  add(rbox(0.08, 0.36, 0.08, 0.03, metal), 1.1, 1.26, -2.5);
  add(rbox(0.46, 0.03, 0.3, 0.015, metal), 1.1, 1.105, -2.48);
  const screenGlow = glow(0x5a8cff, 2.4, 0.18); add(screenGlow, 1.1, 1.75, -2.3);

  // Keyboard and mouse, on a felt desk mat.
  { const felt = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.006, 0.52), mat(0x3b3d40, 0.95, 0, 0.1)); felt.position.set(1.4, 1.098, -1.8); felt.receiveShadow = true; room.add(felt); }
  add(rbox(0.95, 0.035, 0.32, 0.015, mat(0xffffff, 0.6, 0, 0.3, { map: canvasTex(512, 180, (g, w, h) => { g.fillStyle = '#1a1a1e'; g.fillRect(0, 0, w, h); for (let r = 0; r < 5; r++) for (let c = 0; c < 15; c++) { g.fillStyle = (r + c) % 11 === 0 ? '#45454c' : '#2e2e34'; g.fillRect(8 + c * 33, 8 + r * 34, 28, 28); } }) })), 1.25, 1.112, -1.8);
  add(rbox(0.1, 0.035, 0.16, 0.04, mat(0x2e2e34, 0.4)), 1.95, 1.112, -1.78);

  // Laptop, lid turned to show its stickers.
  const laptop = new THREE.Group(); add(laptop, 2.12, 1.097, -2.12); laptop.rotation.y = -0.55; laptop.scale.setScalar(0.72); // open, its screen angled towards the chair
  const alu = mat(0xb8b8bc, 0.3, 0.8, 0.9);
  laptop.add(rbox(0.8, 0.03, 0.55, 0.015, alu));
  const lid = new THREE.Group(); lid.position.set(0, 0.015, -0.27); lid.rotation.x = -0.28; laptop.add(lid);
  const lidMesh = rbox(0.8, 0.52, 0.02, 0.015, alu); lidMesh.position.y = 0.26; lid.add(lidMesh);
  [[6, -0.2, 0.33, 0.25], [7, 0.18, 0.36, -0.2], [2, -0.05, 0.15, 0.1], [5, 0.24, 0.12, 0.3]].forEach(([i, x, y, r]) => { const im = stickers[i]; if (!im) return; const s = cutout(im, 0.18); s.position.set(x, y, -0.012); s.rotation.set(0, Math.PI, r); lid.add(s); });

  // The laptop's screen: his experience, like a profile page.
  { const scr = new THREE.Mesh(new THREE.PlaneGeometry(0.74, 0.46), new THREE.MeshBasicMaterial({ toneMapped: false, map: canvasTex(740, 460, (g, w, h) => {
      g.fillStyle = '#f4f2ee'; g.fillRect(0, 0, w, h); g.fillStyle = '#1d2c44'; g.fillRect(0, 0, w, 64);
      g.fillStyle = '#fff'; g.font = '700 30px Anton, Impact, sans-serif'; g.fillText('EXPERIENCE', 28, 44);
      const row = (y, title, sub, col) => { g.fillStyle = col; g.fillRect(28, y, 10, 70); g.fillStyle = '#111'; g.font = '700 28px "General Sans", Arial, sans-serif'; g.fillText(title, 56, y + 28); g.fillStyle = '#555'; g.font = '22px "General Sans", Arial, sans-serif'; g.fillText(sub, 56, y + 60); };
      row(100, 'NTT DATA', 'Upcoming Summer Intern · May 2026', '#c2643f'); row(200, 'IEEE-TEMS', 'Secretary · Jan 2026 – Present', '#7c8f78'); row(300, 'Havells India Limited', 'Summer Intern · May – Jul 2025', '#e2b04a');
    }) })); scr.position.set(0, 0.27, 0.011); lid.add(scr); }
  // Desk lamp.
  const lampMat = mat(0x1c1c1e, 0.45, 0.5, 0.6);
  add(new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.16, 0.04, 32), lampMat), -0.05, 1.115, -2.35).castShadow = true;
  const arm1 = add(rbox(0.035, 0.6, 0.035, 0.015, lampMat), 0.02, 1.4, -2.35); arm1.rotation.z = -0.25;
  const arm2 = add(rbox(0.035, 0.46, 0.035, 0.015, lampMat), 0.27, 1.81, -2.32); arm2.rotation.z = -0.94;
  const shade = add(new THREE.Mesh(new THREE.ConeGeometry(0.15, 0.24, 32, 1, true), mat(0x1c1c1e, 0.45, 0.5, 0.5, { side: THREE.DoubleSide })), 0.48, 1.92, -2.2); shade.rotation.z = 2.3;
  const bulb = add(new THREE.Mesh(new THREE.SphereGeometry(0.05, 16, 12), new THREE.MeshBasicMaterial({ color: 0xfff1d0, toneMapped: false })), 0.52, 1.86, -2.19);
  lamp.position.set(0.55, 1.8, -2.15);
  const bulbGlow = glow(0xffb566, 1.1, 0.9); add(bulbGlow, 0.52, 1.86, -2.17);

  // Mug of chai, steaming.
  const mugG = new THREE.Group(); add(mugG, 2.32, 1.1, -1.66);
  const mugMat = mat(0xece5d8, 0.25, 0, 0.6);
  const mugBody = new THREE.Mesh(new THREE.CylinderGeometry(0.075, 0.068, 0.17, 32), mugMat); mugBody.position.y = 0.085; mugBody.castShadow = true; mugG.add(mugBody);
  const handle = new THREE.Mesh(new THREE.TorusGeometry(0.045, 0.012, 10, 24), mugMat); handle.position.set(0.08, 0.09, 0); mugG.add(handle);
  const chai = new THREE.Mesh(new THREE.CircleGeometry(0.066, 24), mat(0xc58a4e, 0.3)); chai.rotation.x = -Math.PI / 2; chai.position.y = 0.16; mugG.add(chai);
  const steam = [];
  for (let i = 0; i < 6; i++) { const s = glow(0xffffff, 0.12, 0.0); s.material.blending = THREE.NormalBlending; mugG.add(s); steam.push({ s, ph: i / 6 }); }

  // The notebook, open on the desk: this becomes the About page.
  const NB_W = 0.86, NB_H = 0.54;
  const nb = new THREE.Mesh(new THREE.PlaneGeometry(NB_W, NB_H), mat(0xffffff, 0.85, 0, 0.1, { map: canvasTex(2880, 1800, (g, w, h) => drawNotebook(g, w, h, photo)) }));
  nb.rotation.x = -Math.PI / 2; nb.receiveShadow = true; add(nb, 0.15, 1.098, -1.9);
  add(rbox(NB_W + 0.05, 0.018, NB_H + 0.05, 0.006, mat(0x3a2a20, 0.6)), 0.15, 1.088, -1.9);
  // An evenly lit copy of the page that fades in as the camera lands, so the About page ends up looking like itself, not lamp-lit.
  const nbFlat = new THREE.Mesh(new THREE.PlaneGeometry(NB_W, NB_H), new THREE.MeshBasicMaterial({ map: nb.material.map, transparent: true, opacity: 0, toneMapped: false }));
  nbFlat.rotation.x = -Math.PI / 2; add(nbFlat, 0.15, 1.1, -1.9);
  const pen = add(rbox(0.012, 0.012, 0.3, 0.006, mat(0x1b2f8f, 0.3, 0.2)), 0.66, 1.105, -1.9); pen.rotation.y = 0.35;

  // ---- office chair
  const chair = new THREE.Group(); add(chair, 1.15, 0, -0.85); chair.rotation.y = Math.PI + 0.5; // swivelled round to face you
  const seatMat = mat(0x18181c, 0.55, 0, 0.3);
  chair.add(at(rbox(0.62, 0.1, 0.6, 0.05, seatMat), 0, 0.58, 0));
  const back = rbox(0.58, 0.72, 0.08, 0.05, seatMat); back.position.set(0, 1.02, 0.3); back.rotation.x = 0.12; chair.add(back);
  const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.46, 16), metal); pole.position.y = 0.3; pole.castShadow = true; chair.add(pole);
  for (let i = 0; i < 5; i++) { const a = i / 5 * Math.PI * 2; const leg = rbox(0.34, 0.04, 0.05, 0.02, metal); leg.position.set(Math.cos(a) * 0.17, 0.07, Math.sin(a) * 0.17); leg.rotation.y = -a; chair.add(leg); const wheel = new THREE.Mesh(new THREE.SphereGeometry(0.035, 12, 8), metal); wheel.position.set(Math.cos(a) * 0.33, 0.035, Math.sin(a) * 0.33); chair.add(wheel); }

  // ---- bookshelf on the left wall
  const shelfMat = mat(0x3b2a1e, 0.6, 0, 0.4);
  const shelf = new THREE.Group(); add(shelf, -3.25, 0, -0.6);
  [[-0.9], [0.9]].forEach(([z]) => shelf.add(at(rbox(0.42, 2.7, 0.05, 0.02, shelfMat), 0, 1.35, z)));
  [0.05, 0.72, 1.4, 2.05, 2.68].forEach((y) => shelf.add(at(rbox(0.42, 0.04, 1.84, 0.015, shelfMat), 0, y, 0)));
  const bookCols = [0x8c3b2f, 0x2f4f6f, 0xc9b38a, 0x3e5c45, 0x6b4f3a, 0xd8d0c0, 0x1f2a36, 0x9a6b3c, 0x7a7f86];
  [0.07, 0.74].forEach((y, row) => { let z = -0.85; let k = row * 5; while (z < 0.8) { const bw = 0.05 + Math.random() * 0.05, bh = 0.4 + Math.random() * 0.2; const b = rbox(0.3, bh, bw, 0.01, mat(bookCols[k++ % bookCols.length], 0.6, 0, 0.3)); b.position.set(0, y + bh / 2, z + bw / 2); if (Math.random() < 0.12) b.rotation.x = 0.25; shelf.add(b); z += bw + 0.008; if (row === 1 && z > 0.1) break; } });
  // The 1st-prize trophy.
  const gold = mat(0xd4af37, 0.18, 1, 1.2);
  const cup = new THREE.Mesh(new THREE.LatheGeometry([[0, 0], [0.12, 0], [0.12, 0.03], [0.04, 0.05], [0.03, 0.16], [0.1, 0.22], [0.14, 0.38], [0.13, 0.4]].map(([x, y]) => new THREE.Vector2(x, y)), 32), gold);
  cup.castShadow = true; cup.position.set(0, 0.76, 0.55); shelf.add(cup);
  // The record crate: one sleeve per project, each with a record inside.
  const crate = at(rbox(0.36, 0.26, 0.56, 0.02, mat(0xf4f4f4, 0.5)), 0, 1.55, -0.45); shelf.add(crate);
  const PROJ = self.projects();
  const sleeves = PROJ.map((pr, i) => {
    const cover = canvasTex(512, 512, (g, w, h) => {
      g.fillStyle = pr.color; g.fillRect(0, 0, w, h);
      g.fillStyle = pr.ink; g.globalAlpha = 0.14; g.beginPath(); g.arc(w * 0.72, h * 0.3, 190, 0, Math.PI * 2); g.fill(); g.globalAlpha = 1;
      g.font = '46px "Space Mono", monospace'; g.fillText(String(i + 1).padStart(2, '0'), 34, 72);
      let fs = 120; g.font = fs + 'px Anton, Impact, sans-serif'; while (g.measureText(pr.name.toUpperCase()).width > w - 60) { fs -= 6; g.font = fs + 'px Anton, Impact, sans-serif'; }
      g.fillText(pr.name.toUpperCase(), 30, h - 44);
    });
    const plain = mat(C(pr.color), 0.55, 0, 0.3);
    const face = mat(0xffffff, 0.5, 0, 0.3, { map: cover });
    const sl = new THREE.Group(); sl.position.set(0, 1.64, -0.66 + i * 0.075); sl.rotation.x = 0.1; shelf.add(sl);
    const box = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.3, 0.012), [plain, plain, plain, plain, face, plain]); box.castShadow = true; sl.add(box);
    const disc = new THREE.Group(); sl.add(disc);
    const vinyl = new THREE.Mesh(new THREE.CylinderGeometry(0.135, 0.135, 0.004, 48), mat(0x0c0c0c, 0.25, 0.3, 0.9)); vinyl.rotation.x = Math.PI / 2; disc.add(vinyl);
    const label = new THREE.Mesh(new THREE.CircleGeometry(0.045, 32), mat(C(pr.color), 0.5)); label.position.z = 0.0025; disc.add(label);
    disc.position.z = -0.009;
    return { sl, box, disc, base: sl.position.clone(), lift: 0 };
  });
  // Next to the trophy: a certificate and a medal.
  const cert = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.24, 0.19), [mat(0xffffff, 0.7, 0, 0.2, { map: canvasTex(240, 300, (g, w, h) => { g.fillStyle = '#F6EFDD'; g.fillRect(0, 0, w, h); g.strokeStyle = '#B99314'; g.lineWidth = 10; g.strokeRect(12, 12, w - 24, h - 24); g.fillStyle = '#111'; g.textAlign = 'center'; g.font = '700 30px "Times New Roman", serif'; g.fillText('CERTIFICATE', w / 2, 90); g.font = '22px "Times New Roman", serif'; g.fillText('of achievement', w / 2, 124); g.fillStyle = '#FA1A1D'; g.beginPath(); g.arc(w / 2, 210, 30, 0, Math.PI * 2); g.fill(); }) }), mat(0x111111, 0.5), mat(0x111111, 0.5), mat(0x111111, 0.5), mat(0x111111, 0.5), mat(0x111111, 0.5)]);
  cert.position.set(-0.05, 0.86, 0.27); cert.rotation.z = 0.12; cert.castShadow = true; shelf.add(cert);
  const medal = new THREE.Group(); medal.position.set(0.02, 0.83, 0.8); medal.rotation.set(0, Math.PI / 2, 0); shelf.add(medal);
  const mDisc = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.012, 32), gold); mDisc.rotation.x = Math.PI / 2; mDisc.castShadow = true; medal.add(mDisc);
  [-0.025, 0.025].forEach((x, k) => { const rb = new THREE.Mesh(new THREE.BoxGeometry(0.035, 0.16, 0.004), mat(C(k ? 0x2849cb : 0xfa1a1d), 0.6)); rb.position.set(x, 0.1, -0.004); rb.rotation.z = k ? -0.25 : 0.25; medal.add(rb); });
  // A plant on top.
  const pot = new THREE.Mesh(new THREE.CylinderGeometry(0.13, 0.1, 0.22, 24), mat(0xe8e2d5, 0.6)); pot.position.set(0, 2.81, 0.4); pot.castShadow = true; shelf.add(pot);
  for (let i = 0; i < 9; i++) { const leaf = new THREE.Mesh(new THREE.SphereGeometry(0.1, 12, 8), mat(0x2e7d32, 0.6)); leaf.scale.set(0.35, 1.3, 0.12); const a = i / 9 * Math.PI * 2; leaf.position.set(Math.cos(a) * 0.08, 3.05 + (i % 3) * 0.05, 0.4 + Math.sin(a) * 0.08); leaf.rotation.set(Math.sin(a) * 0.6, 0, -Math.cos(a) * 0.6); leaf.castShadow = true; shelf.add(leaf); }

  // ---- Lakshya, as a little 3D figure sat in the chair (he faces the chair's -z).
  const skin = mat(C(0xc2845a), 0.62, 0, 0.35);
  const hairM = mat(C(0x17110d), 0.55, 0, 0.3);
  const shirtTex = canvasTex(256, 256, (g, w, h) => {
    g.fillStyle = '#C9DDF2'; g.fillRect(0, 0, w, h);
    for (let i = 0; i < w; i += 16) { g.fillStyle = 'rgba(52,92,160,0.55)'; g.fillRect(i, 0, 3, h); g.fillRect(0, i, w, 3); g.fillStyle = 'rgba(255,255,255,0.5)'; g.fillRect(i + 8, 0, 2, h); }
  });
  shirtTex.wrapS = shirtTex.wrapT = THREE.RepeatWrapping; shirtTex.repeat.set(5, 2);
  const shirt = mat(0xffffff, 0.75, 0, 0.3, { map: shirtTex });
  const pants = mat(C(0x273047), 0.8, 0, 0.3);
  const shoeM = mat(C(0x151515), 0.45, 0, 0.4);
  const frameM = mat(C(0x151515), 0.3, 0.5, 0.8);
  const Y = new THREE.Vector3(0, 1, 0);
  // A rounded limb from a to b (a cylinder with a ball at each end).
  const limb = (parent, r, a, b, m) => {
    const A = new THREE.Vector3(...a), B = new THREE.Vector3(...b), d = B.clone().sub(A);
    const cyl = new THREE.Mesh(new THREE.CylinderGeometry(r, r, d.length(), 20), m);
    cyl.position.copy(A).addScaledVector(d, 0.5); cyl.quaternion.setFromUnitVectors(Y, d.clone().normalize());
    [A, B].forEach((p) => { const s = new THREE.Mesh(new THREE.SphereGeometry(r, 20, 14), m); s.position.copy(p); s.castShadow = true; parent.add(s); });
    cyl.castShadow = true; parent.add(cyl); return cyl;
  };
  const me = new THREE.Group(); room.add(me);
  // Legs on hip and knee joints, so he can sit, stand and walk.
  const pelvis = new THREE.Mesh(new THREE.SphereGeometry(0.17, 24, 16), pants); pelvis.scale.set(1.15, 0.62, 0.95); pelvis.castShadow = true; me.add(pelvis);
  const legs = [-1, 1].map((s) => {
    const hip = new THREE.Group(); me.add(hip);
    limb(hip, 0.082, [0, 0, 0], [0, -0.38, 0], pants);
    const knee = new THREE.Group(); knee.position.y = -0.38; hip.add(knee);
    limb(knee, 0.068, [0, 0, 0], [0, -0.56, 0], pants);
    const shoe = rbox(0.13, 0.09, 0.26, 0.04, shoeM); shoe.position.set(0, -0.6, -0.06); knee.add(shoe);
    return { s, hip, knee };
  });
  // Body (twists a little towards whatever he looks at).
  const body = new THREE.Group(); body.position.set(0, 0.74, 0.06); me.add(body);
  const torso = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.185, 0.46, 32), shirt); torso.scale.z = 0.72; torso.position.y = 0.25; torso.castShadow = true; body.add(torso);
  const shoulders = new THREE.Mesh(new THREE.SphereGeometry(0.2, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2), shirt); shoulders.scale.set(1, 0.42, 0.72); shoulders.position.y = 0.48; shoulders.castShadow = true; body.add(shoulders);
  const belt = new THREE.Mesh(new THREE.CylinderGeometry(0.19, 0.19, 0.05, 32), mat(C(0x5a3a22), 0.5)); belt.scale.z = 0.74; belt.position.y = 0.04; body.add(belt);
  const buckle = rbox(0.05, 0.04, 0.012, 0.005, gold); buckle.position.set(0, 0.04, -0.142); body.add(buckle);
  for (let i = 0; i < 4; i++) { const bt = new THREE.Mesh(new THREE.SphereGeometry(0.009, 8, 6), mat(0xffffff, 0.4)); bt.position.set(0, 0.13 + i * 0.1, -0.141); body.add(bt); }
  const collar = new THREE.Mesh(new THREE.CylinderGeometry(0.075, 0.085, 0.05, 20), shirt); collar.position.y = 0.55; body.add(collar);
  [-1, 1].forEach((s) => { const flap = new THREE.Mesh(new THREE.BoxGeometry(0.075, 0.012, 0.06), mat(0xffffff, 0.7, 0, 0.3, { map: shirtTex })); flap.position.set(s * 0.045, 0.545, -0.085); flap.rotation.set(-0.5, s * 0.5, s * -0.35); body.add(flap); });
  const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.055, 0.06, 0.1, 16), skin); neck.position.y = 0.6; body.add(neck);
  // Arms: the left one rests on his knee, the right one waves.
  const shoulderL = new THREE.Group(); shoulderL.position.set(-0.215, 0.44, 0); body.add(shoulderL);
  limb(shoulderL, 0.058, [0, 0, 0], [0, -0.25, 0], shirt);
  const elbowL = new THREE.Group(); elbowL.position.set(0, -0.25, 0); shoulderL.add(elbowL);
  limb(elbowL, 0.05, [0, 0, 0], [0, -0.22, 0], shirt);
  const lHand = new THREE.Mesh(new THREE.SphereGeometry(0.052, 16, 12), skin); lHand.position.set(0, -0.27, 0); lHand.castShadow = true; elbowL.add(lHand);
  const shoulderR = new THREE.Group(); shoulderR.position.set(0.215, 0.44, 0); body.add(shoulderR);
  limb(shoulderR, 0.058, [0, 0, 0], [0, -0.25, 0], shirt);
  const elbowR = new THREE.Group(); elbowR.position.set(0, -0.25, 0); shoulderR.add(elbowR);
  limb(elbowR, 0.05, [0, 0, 0], [0, -0.22, 0], shirt);
  const rHand = new THREE.Mesh(new THREE.SphereGeometry(0.052, 16, 12), skin); rHand.position.set(0, -0.27, 0); rHand.castShadow = true; elbowR.add(rHand);
  // Head: big and friendly, with his glasses and side-swept hair.
  const head = new THREE.Group(); head.position.set(0, 0.73, 0); body.add(head);
  const skull = new THREE.Mesh(new THREE.SphereGeometry(0.2, 40, 30), skin); skull.scale.set(0.93, 1.04, 0.95); skull.castShadow = true; head.add(skull);
  const hairTop = new THREE.Mesh(new THREE.SphereGeometry(0.212, 40, 20, 0, Math.PI * 2, 0, 1.25), hairM); hairTop.scale.set(0.97, 1.04, 1.0); hairTop.position.set(0, 0.03, 0.02); hairTop.rotation.x = 0.28; hairTop.castShadow = true; head.add(hairTop);
  const hairBack = new THREE.Mesh(new THREE.SphereGeometry(0.207, 40, 20, 0, Math.PI, 0, 2.0), hairM); hairBack.scale.set(0.96, 1.04, 0.98); head.add(hairBack);
  [[-0.1, 0.16, -0.12, 0.09], [-0.02, 0.18, -0.13, 0.1], [0.07, 0.17, -0.12, 0.09], [0.13, 0.14, -0.08, 0.07], [-0.15, 0.12, -0.07, 0.07]].forEach(([x, y, z, r]) => { const puff = new THREE.Mesh(new THREE.SphereGeometry(r, 20, 14), hairM); puff.scale.set(1.3, 0.62, 1); puff.position.set(x, y, z); puff.rotation.z = -0.35; puff.castShadow = true; head.add(puff); });
  [-1, 1].forEach((s) => { const ear = new THREE.Mesh(new THREE.SphereGeometry(0.045, 16, 12), skin); ear.scale.set(0.5, 1, 0.8); ear.position.set(s * 0.188, -0.01, 0.01); head.add(ear); });
  const eyes = [-1, 1].map((s) => { const e = new THREE.Mesh(new THREE.SphereGeometry(0.022, 16, 12), mat(0x0a0a0a, 0.2, 0, 0.8)); e.position.set(s * 0.07, 0.005, -0.178); head.add(e); const hl = new THREE.Mesh(new THREE.SphereGeometry(0.006, 8, 6), new THREE.MeshBasicMaterial({ color: 0xffffff })); hl.position.set(s * 0.07 + 0.008, 0.013, -0.197); head.add(hl); return [e, hl]; });
  [-1, 1].forEach((s) => {
    const ring = new THREE.Mesh(new THREE.TorusGeometry(0.058, 0.008, 10, 40), frameM); ring.position.set(s * 0.073, 0.005, -0.197); head.add(ring);
    const lens = new THREE.Mesh(new THREE.CircleGeometry(0.056, 32), new THREE.MeshStandardMaterial({ color: 0xffffff, transparent: true, opacity: 0.12, roughness: 0.05, metalness: 0.2, envMapIntensity: 1.5 })); lens.position.set(s * 0.073, 0.005, -0.199); lens.rotation.y = Math.PI; head.add(lens);
    limb(head, 0.005, [s * 0.13, 0.01, -0.19], [s * 0.185, 0.01, -0.02], frameM);
    const brow = rbox(0.07, 0.014, 0.014, 0.006, hairM); brow.position.set(s * 0.073, 0.085, -0.182); brow.rotation.z = s * -0.12; head.add(brow);
  });
  limb(head, 0.006, [-0.016, 0.012, -0.2], [0.016, 0.012, -0.2], frameM);
  const nose = new THREE.Mesh(new THREE.SphereGeometry(0.024, 12, 10), mat(C(0xb3764f), 0.6)); nose.scale.set(0.9, 1, 1); nose.position.set(0, -0.04, -0.192); head.add(nose);
  const smile = new THREE.Mesh(new THREE.TorusGeometry(0.048, 0.009, 8, 24, Math.PI), mat(C(0x4a1f16), 0.5)); smile.rotation.z = Math.PI; smile.position.set(0, -0.078, -0.178); smile.rotation.x = 0.35; head.add(smile);
  const meParts = []; me.traverse((o) => { if (o.isMesh) meParts.push(o); });

  // ---- a beanbag on the rug
  const beanGeo = new THREE.SphereGeometry(0.55, 64, 48); { const pa = beanGeo.attributes.position; for (let i = 0; i < pa.count; i++) { const x = pa.getX(i), y = pa.getY(i), z = pa.getZ(i); const k = 1 + Math.sin(x * 9 + z * 4) * 0.025 + Math.sin(z * 11 - y * 6) * 0.02 - (y > 0.35 ? (y - 0.35) * 0.5 : 0); pa.setXYZ(i, x * k, y * k, z * k); } beanGeo.computeVertexNormals(); }
  seed = 3; const fabric = canvasTex(512, 512, (g, w, h) => { g.fillStyle = '#808080'; g.fillRect(0, 0, w, h); for (let y = 0; y < h; y += 3) { g.fillStyle = 'rgba(255,255,255,0.12)'; g.fillRect(0, y, w, 1); } for (let x = 0; x < w; x += 3) { g.fillStyle = 'rgba(0,0,0,0.1)'; g.fillRect(x, 0, 1, h); } });
  fabric.wrapS = fabric.wrapT = THREE.RepeatWrapping; fabric.repeat.set(6, 6);
  const bean = new THREE.Mesh(beanGeo, mat(0xe8b530, 1, 0, 0.15, { bumpMap: fabric, bumpScale: 0.004 })); bean.scale.set(1, 0.62, 1); bean.castShadow = bean.receiveShadow = true; add(bean, -0.9, 0.3, 1.0);
  const dent = new THREE.Mesh(new THREE.SphereGeometry(0.3, 24, 16), mat(0xe6bd2c, 0.9)); dent.scale.set(1, 0.35, 1); add(dent, -0.85, 0.6, 1.05);

  // ---- left wall: a VIT pennant and a clock that keeps real time
  const pennant = new THREE.Mesh(new THREE.ShapeGeometry(new THREE.Shape([new THREE.Vector2(0, 0.28), new THREE.Vector2(1.3, 0), new THREE.Vector2(0, -0.28)])), mat(0x2849cb, 0.7, 0, 0.3, { side: THREE.DoubleSide }));
  pennant.rotation.y = Math.PI / 2; add(pennant, -3.48, 2.9, 1.9);
  const pText = new THREE.Mesh(new THREE.PlaneGeometry(0.9, 0.22), new THREE.MeshBasicMaterial({ transparent: true, map: canvasTex(512, 128, (g, w, h) => { g.font = '90px Impact, Anton, sans-serif'; g.fillStyle = '#fff'; g.textBaseline = 'middle'; g.fillText('VIT VELLORE', 10, h / 2 + 4); }) }));
  pText.rotation.y = Math.PI / 2; add(pText, -3.47, 2.9, 1.5);
  add(rbox(0.05, 0.62, 0.05, 0.02, wood), -3.47, 2.9, 1.92);
  const clock = new THREE.Group(); add(clock, -3.46, 2.0, 1.75); clock.rotation.y = Math.PI / 2;
  const face = new THREE.Mesh(new THREE.CylinderGeometry(0.34, 0.34, 0.05, 48), [mat(0x111111, 0.4), mat(0xffffff, 0.6, 0, 0.2, { map: canvasTex(256, 256, (g, w, h) => { g.fillStyle = '#F4F4F4'; g.fillRect(0, 0, w, h); g.fillStyle = '#111'; for (let i = 0; i < 12; i++) { const a = i / 12 * Math.PI * 2; g.fillRect(w / 2 + Math.sin(a) * 104 - 3, h / 2 - Math.cos(a) * 104 - 10, 6, 20); } }) }), mat(0x111111, 0.4)]);
  face.rotation.x = Math.PI / 2; face.castShadow = true; clock.add(face);
  const hand = (len, wdt, col) => { const h = new THREE.Group(); const m = new THREE.Mesh(new THREE.BoxGeometry(wdt, len, 0.01), mat(col, 0.4)); m.position.y = len / 2; h.add(m); h.position.z = 0.03; clock.add(h); return h; };
  const hourH = hand(0.17, 0.025, 0x111111), minH = hand(0.26, 0.016, 0x111111), secH = hand(0.28, 0.008, 0xfa1a1d);

  // ---- furnishing: real materials and real furniture (CC0, Poly Haven)
  const reskin = (m, n, color) => { m.map = n.map; m.normalMap = n.normalMap; m.roughnessMap = n.roughnessMap; m.bumpMap = null; m.color.set(color); m.roughness = 1; m.needsUpdate = true; houseMats.push(m); };
  reskin(floorTop, pbr('herringbone_parquet', 6, 5), 0xffffff);
  reskin(wallMat, pbr('painted_plaster_wall', 4, 2), 0xf4efe6); wallMat.map = null; wallMat.needsUpdate = true;
  reskin(wood, pbr('oak_veneer_01', 2, 1), 0xffffff);
  reskin(shelfMat, pbr('walnut_veneer', 1, 2), 0xffffff);
  rug.geometry.dispose(); rug.geometry = new THREE.BoxGeometry(3.0, 0.02, 2.1); rug.material = pbr('wool_boucle', 1.4, 1, { color: 0xcdbfa6 }); rug.position.set(-0.4, 0.01, 1.0);
  bean.visible = false; dent.visible = false; poster.visible = false; bigPot.visible = false; pot.visible = false;
  room.children.forEach((c) => { if (c.position.x === 3.485 && c.position.y === 2.3) c.visible = false; });
  const inLoader = THREE.GLTFLoader ? new THREE.GLTFLoader() : null;
  // Loads a model and sizes it to a height, standing on (or hanging from) a point.
  const putModel = (name, h, x, y, z, ry = 0, hang = false) => inLoader && inLoader.load(AS + 'models/' + name + '/' + name + '.gltf', (g) => {
    const o = g.scene; o.traverse((m) => { if (m.isMesh) { m.castShadow = true; m.receiveShadow = true; if (m.material) houseMats.push(m.material); } });
    o.rotation.y = ry; let b = new THREE.Box3().setFromObject(o); o.scale.setScalar(h / Math.max(0.001, b.max.y - b.min.y));
    b = new THREE.Box3().setFromObject(o); const c = b.getCenter(new THREE.Vector3());
    o.position.set(x - c.x, hang ? y - b.max.y : y - b.min.y, z - c.z); room.add(o); applyEnv();
  });
  putModel('mid_century_lounge_chair', 0.85, -1.0, 0.02, 1.15, 0.55);
  putModel('Ottoman_01', 0.42, -0.1, 0.02, 1.75, 0.3);
  putModel('throw_pillows_01', 0.3, -1.05, 0.42, 1.12, 0.55);
  putModel('side_table_01', 0.55, -1.95, 0.0, 1.6, 0);
  putModel('potted_plant_04', 0.35, -1.95, 0.55, 1.6, 0);
  putModel('potted_plant_01', 1.5, 2.95, 0.0, -1.0, 0);
  putModel('potted_plant_04', 0.3, -3.25, 2.70, -0.2, 0.8);
  putModel('modern_ceiling_lamp_01', 0.55, -0.4, 3.95, 1.0, 0, true);
  // sage-green feature wall behind the desk (the neon reads beautifully on it)
  const sage = new THREE.MeshStandardMaterial({ color: 0x34473a, roughness: 0.92, normalMap: wallMat.normalMap, envMapIntensity: 0.3 }); houseMats.push(sage);
  room.children.forEach((c) => { if (c.isMesh && c.material === wallMat && Math.abs(c.position.z + 2.9) < 0.01) c.material = sage; });
  // a framed mid-century print on the right wall: arches and a sun in terracotta, mustard and sage on cream paper
  const print = canvasTex(700, 940, (g, w, h) => {
    g.fillStyle = '#efe6d6'; g.fillRect(0, 0, w, h);
    const arch = (x, y, r, col) => { g.fillStyle = col; g.beginPath(); g.arc(x, y, r, Math.PI, 0); g.lineTo(x + r, h * 0.86); g.lineTo(x - r, h * 0.86); g.closePath(); g.fill(); };
    arch(w * 0.36, h * 0.55, 170, '#c2643f'); arch(w * 0.62, h * 0.66, 130, '#7c8f78'); arch(w * 0.42, h * 0.74, 90, '#e2b04a');
    g.fillStyle = '#2f3a4a'; g.beginPath(); g.arc(w * 0.7, h * 0.27, 70, 0, 7); g.fill();
    g.fillStyle = '#c2643f'; g.fillRect(w * 0.12, h * 0.86, w * 0.76, 6);
    g.fillStyle = '#3a3a3a'; g.font = '22px "Space Mono", monospace'; g.textAlign = 'center'; g.fillText('L. GUPTA  ·  BUILD SLOW, SHIP OFTEN', w / 2, h * 0.94);
    for (let i = 0; i < 6000; i++) { g.fillStyle = 'rgba(80,60,40,' + Math.random() * 0.05 + ')'; g.fillRect(Math.random() * w, Math.random() * h, 1.5, 1.5); }
  });
  const art = new THREE.Mesh(new THREE.PlaneGeometry(1.05, 1.41), new THREE.MeshStandardMaterial({ map: print, roughness: 0.85 })); art.rotation.y = -Math.PI / 2; art.position.set(7.475, 2.55, 0); room.add(art);
  const oak = pbr('oak_veneer_01', 0.3, 1);
  [[0, 0.75, 1.25, 0.05], [0, -0.75, 1.25, 0.05], [-0.6, 0, 0.05, 1.55], [0.6, 0, 0.05, 1.55]].forEach(([dz, dy, w, h]) => { const f = new THREE.Mesh(new THREE.BoxGeometry(0.05, h, w), oak); f.position.set(7.48, 2.55 + dy, -dz); f.castShadow = true; room.add(f); });
  // arc floor lamp leaning over the lounge chair, with a warm bulb
  const steel = mat(0x2a2a2a, 0.3, 0.8, 0.8);
  const lampBase = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.22, 0.05, 32), mat(0xe8e4dc, 0.3, 0, 0.6)); lampBase.position.set(-2.6, 0.03, 1.9); lampBase.castShadow = true; room.add(lampBase);
  const arcC = new THREE.CatmullRomCurve3([new THREE.Vector3(-2.6, 0.05, 1.9), new THREE.Vector3(-2.6, 1.3, 1.9), new THREE.Vector3(-2.35, 1.8, 1.75), new THREE.Vector3(-1.85, 1.75, 1.55), new THREE.Vector3(-1.65, 1.6, 1.45)]);
  const arcM = new THREE.Mesh(new THREE.TubeGeometry(arcC, 60, 0.014, 8), steel); arcM.castShadow = true; room.add(arcM);
  const shadeL = new THREE.Mesh(new THREE.SphereGeometry(0.2, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2), mat(0x1f1f1f, 0.4, 0.5, 0.6, { side: THREE.DoubleSide })); shadeL.position.set(-1.65, 1.58, 1.45); room.add(shadeL);
  const bulbL = new THREE.Mesh(new THREE.SphereGeometry(0.05, 16, 12), new THREE.MeshBasicMaterial({ color: 0xfff0d0, toneMapped: false })); bulbL.position.set(-1.65, 1.5, 1.45); room.add(bulbL);
  const lampLight = new THREE.PointLight(0xffd59a, 0.9, 4.5, 2); lampLight.position.set(-1.65, 1.42, 1.45); scene.add(lampLight);
  room.add(at(glow(0xffd59a, 0.9, 0.5), -1.65, 1.48, 1.45));
  putModel('standing_picture_frame_01', 0.22, 2.25, 1.095, -2.45, -0.4);
  // the garden behind the window: lawn and shrubs under the real sky
  const backLawn = new THREE.Mesh(new THREE.PlaneGeometry(60, 40), pbr('leafy_grass', 22, 15, { color: 0x86b25a })); backLawn.rotation.x = -Math.PI / 2; backLawn.position.set(0, -0.36, -23); room.add(backLawn);
  [[-2.6, -6.5, 5.5], [-0.6, -8.5, 6.5], [-4.6, -9.5, 7], [1.8, -10, 6]].forEach(([x, z, sc]) => putModel('shrub_01', sc * 0.35, x, -0.36, z, x));

  // ---- a sunbeam through the window: a soft additive shaft along the sun's direction, with dust drifting in it
  { const beamTex = canvasTex(64, 256, (g, w, h) => { const gr = g.createLinearGradient(0, 0, 0, h); gr.addColorStop(0, 'rgba(255,240,210,0.0)'); gr.addColorStop(0.15, 'rgba(255,240,210,0.9)'); gr.addColorStop(1, 'rgba(255,240,210,0.0)'); g.fillStyle = gr; g.fillRect(0, 0, w, h); const sx = g.createLinearGradient(0, 0, w, 0); sx.addColorStop(0, 'rgba(0,0,0,1)'); sx.addColorStop(0.5, 'rgba(0,0,0,0)'); sx.addColorStop(1, 'rgba(0,0,0,1)'); g.globalCompositeOperation = 'destination-out'; g.fillStyle = sx; g.fillRect(0, 0, w, h); });
    const from = new THREE.Vector3(-2.05, 2.3, -2.8), to = new THREE.Vector3(-1.0, 0.0, 0.9), len = from.distanceTo(to);
    const beamMat = self._beamMat = new THREE.MeshBasicMaterial({ map: beamTex, transparent: true, opacity: 0.16, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide, toneMapped: false });
    [0, Math.PI / 2].forEach((r) => { const b = new THREE.Mesh(new THREE.PlaneGeometry(1.5, len), beamMat); b.position.copy(from).lerp(to, 0.5); b.lookAt(to); b.rotateX(Math.PI / 2); b.rotateY(r); room.add(b); });
    const motes = new THREE.BufferGeometry(); const mp = []; for (let i = 0; i < 90; i++) { const k = Math.random(); const pt = from.clone().lerp(to, k); mp.push(pt.x + (Math.random() - 0.5) * 1.1, pt.y + (Math.random() - 0.5) * 0.9, pt.z + (Math.random() - 0.5) * 0.9); }
    motes.setAttribute('position', new THREE.Float32BufferAttribute(mp, 3));
    const moteP = new THREE.Points(motes, new THREE.PointsMaterial({ color: 0xfff2d8, size: 0.012, transparent: true, opacity: 0.8, depthWrite: false, blending: THREE.AdditiveBlending })); room.add(moteP);
    self._motes = { geo: motes, base: mp.slice() };
  }
  // ---- the bedroom half of the loft: second window, an upholstered bed, nightstands with lamps, a wardrobe
  const glass2 = new THREE.Mesh(new THREE.PlaneGeometry(2.0, 2.0), dayGlass); glass2.position.set(5.6, 2.3, -2.79); room.add(glass2);
  [[0, 1.04, 2.14, 0.08], [0, -1.04, 2.14, 0.08], [-1.04, 0, 0.08, 2.0], [1.04, 0, 0.08, 2.0], [0, 0, 0.05, 2.0], [0, 0.25, 2.0, 0.05]].forEach(([x, y, w, h]) => room.add(at(rbox(w, h, 0.08, 0.01, frameMat), 5.6 + x, 2.3 + y, -2.75)));
  room.add(at(rbox(2.3, 0.06, 0.26, 0.02, frameMat), 5.6, 1.25, -2.66));
  [-1, 1].forEach((sd) => { const cg = new THREE.PlaneGeometry(0.55, 2.3, 40, 1); const pa = cg.attributes.position; for (let i = 0; i < pa.count; i++) pa.setZ(i, Math.sin(pa.getX(i) * 38) * 0.035); cg.computeVertexNormals(); const c = new THREE.Mesh(cg, curtainMat); c.castShadow = true; room.add(at(c, 5.6 + sd * 1.32, 2.2, -2.68)); });
  add(new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 3.2, 8), mat(0x1a1a1a, 0.4, 0.6)), 5.6, 3.42, -2.7).rotation.z = Math.PI / 2;
  // the bed: headboard against the right wall
  const walnutM = pbr('walnut_veneer', 1, 1), linenM = mat(0xf1ece2, 0.95, 0, 0.2), headM = mat(0x8c7b66, 0.95, 0, 0.2);
  const bedP = (m) => { m.castShadow = true; m.receiveShadow = true; room.add(m); return m; };
  bedP(at(rbox(2.85, 0.36, 2.35, 0.03, walnutM), 6.15, 0.2, 0));
  bedP(at(rbox(0.16, 1.55, 2.6, 0.06, headM), 7.48, 0.95, 0));
  bedP(at(rbox(2.7, 0.3, 2.2, 0.1, mat(0xf7f5f0, 0.9)), 6.12, 0.53, 0));
  bedP(at(rbox(1.95, 0.1, 2.28, 0.05, linenM), 5.55, 0.72, 0));
  bedP(at(rbox(0.5, 0.035, 2.3, 0.015, mat(0xc98f3a, 0.95)), 5.0, 0.785, 0));
  [-0.52, 0.52].forEach((z) => bedP(at(rbox(0.5, 0.2, 0.85, 0.09, mat(0xffffff, 0.9)), 7.05, 0.78, z)));
  bedP(at(rbox(0.32, 0.26, 0.6, 0.1, mat(0x5f7563, 0.95)), 6.8, 0.82, 0.1)).rotation.z = 0.25;
  // nightstands with ceramic lamps
  [-1.75, 1.75].forEach((z) => {
    putModel('ClassicNightstand_01', 0.75, 7.15, 0, z, -Math.PI / 2);
    const base = bedP(at(new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.12, 0.32, 24), mat(0xd8cfc0, 0.35, 0, 0.6)), 7.15, 0.92, z));
    const shadeN = new THREE.Mesh(new THREE.CylinderGeometry(0.17, 0.22, 0.28, 32, 1, true), mat(0xf3ead8, 0.9, 0, 0.2, { side: THREE.DoubleSide, emissive: 0xffd9a0, emissiveIntensity: 0.25 })); room.add(at(shadeN, 7.15, 1.22, z));
  });
  { const nl = new THREE.PointLight(0xffd8a0, 0.9, 4.5, 2); nl.position.set(6.9, 1.3, 0); scene.add(nl); self._bedLamps = [nl]; }
  // a tall oak wardrobe at the front of the right wall
  { const wd = pbr('oak_veneer_01', 1, 2); bedP(at(rbox(0.75, 3.1, 3.0, 0.02, wd), 7.2, 1.55, 3.9));
    [3.15, 3.9, 4.65].forEach((z) => room.add(at(new THREE.Mesh(new THREE.BoxGeometry(0.01, 3.0, 0.012), mat(0x3a2a1e, 0.6)), 6.82, 1.55, z)));
    [3.6, 4.2].forEach((z) => room.add(at(rbox(0.03, 0.5, 0.03, 0.01, mat(0x1c1c1c, 0.3, 0.8)), 6.8, 1.5, z))); }
  // the lounge in the middle: a sofa side-on, coffee table, rug, plant
  { const rug2 = new THREE.Mesh(new THREE.BoxGeometry(3.4, 0.02, 2.6), pbr('wool_boucle', 1.6, 1.2, { color: 0xb9a990 })); rug2.position.set(3.35, 0.012, 2.2); rug2.receiveShadow = true; room.add(rug2); rug2.userData.spot = 'floor'; self._rug2 = rug2;
    putModel('sofa_03', 0.85, 2.3, 0, 2.2, Math.PI / 2);
    putModel('throw_pillows_01', 0.3, 2.4, 0.42, 1.9, Math.PI / 2);
    putModel('modern_coffee_table_01', 0.42, 3.75, 0, 2.2, 0);
    putModel('ceramic_vase_03', 0.28, 3.75, 0.42, 2.2, 0);
    putModel('potted_plant_02', 1.1, 5.4, 0, 5.3, 0.4); }

  // ---- lived-in desk: headphones by the monitor, a small plant, a stack of books
  { const hp = new THREE.Group(); hp.position.set(0.62, 1.1, -2.42); hp.rotation.set(0, 0.5, 0); room.add(hp);
    const band = new THREE.Mesh(new THREE.TorusGeometry(0.13, 0.014, 10, 32, Math.PI), mat(0x1b1b1d, 0.5)); band.rotation.x = -Math.PI / 2; band.position.y = 0.03; hp.add(band);
    [-1, 1].forEach((sd) => { const cup = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.07, 0.05, 24), mat(0x222224, 0.6)); cup.position.set(sd * 0.13, 0.025, 0); cup.castShadow = true; hp.add(cup); const pad = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.02, 24), mat(0x7a6a5a, 0.9)); pad.position.set(sd * 0.13, 0.055, 0); hp.add(pad); });
    putModel('potted_plant_04', 0.22, 2.42, 1.097, -2.56, 0.6);
    [[0x2f4f6f, 0.04, 0.0], [0xc9b38a, 0.035, 0.12], [0x8c3b2f, 0.03, -0.08]].forEach(([c, h, r], i) => { const b = rbox(0.34, h, 0.24, 0.006, mat(c, 0.7)); b.position.set(-0.22, 1.097 + h / 2 + i * 0.04, -2.5); b.rotation.y = r; room.add(b); });
  }

  // ---- dust in the lamp light
  const dustGeo = new THREE.BufferGeometry(); const dp = [];
  for (let i = 0; i < 120; i++) dp.push(-0.5 + Math.random() * 2.4, 0.9 + Math.random() * 2.2, -2.5 + Math.random() * 2.2);
  dustGeo.setAttribute('position', new THREE.Float32BufferAttribute(dp, 3));
  const dust = new THREE.Points(dustGeo, new THREE.PointsMaterial({ color: 0xffd9a0, size: 0.012, transparent: true, opacity: 0.7, blending: THREE.AdditiveBlending, depthWrite: false })); room.add(dust);

  // ---- sound: a soft tick on hover, a whoosh when the camera flies (only after a click has woken audio up)
  let AC = null;
  const wake = () => { AC = live(); };
  const noise = (dur, f0, f1, q, vol) => {
    AC = live(); const out = output(); if (!AC || !out || AC.state !== 'running') return;
    const n = Math.floor(AC.sampleRate * dur), buf = AC.createBuffer(1, n, AC.sampleRate), d = buf.getChannelData(0);
    for (let i = 0; i < n; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / n, 2);
    const src = AC.createBufferSource(); src.buffer = buf;
    const bp = AC.createBiquadFilter(); bp.type = 'bandpass'; bp.Q.value = q; bp.frequency.setValueAtTime(f0, AC.currentTime); bp.frequency.exponentialRampToValueAtTime(f1, AC.currentTime + dur);
    const gn = AC.createGain(); gn.gain.value = vol;
    src.connect(bp); bp.connect(gn); gn.connect(out); src.start();
  };
  self.sfx = { tick: () => noise(0.05, 2600, 2200, 4, 0.35), whoosh: () => { wake(); noise(0.5, 350, 2600, 0.9, 0.5); } };

  // ---- the three hot spots, each with a paper tag floating over it
  const tagTex = (text, bg, ink) => canvasTex(640, 190, (g, w, h) => {
    g.save(); g.translate(w / 2, 82); g.rotate(-0.035);
    g.shadowColor = 'rgba(0,0,0,0.45)'; g.shadowBlur = 16; g.shadowOffsetY = 6;
    g.fillStyle = bg; g.beginPath(); g.roundRect ? g.roundRect(-290, -62, 580, 124, 14) : g.rect(-290, -62, 580, 124); g.fill();
    g.shadowColor = 'transparent';
    g.beginPath(); g.moveTo(-18, 60); g.lineTo(0, 92); g.lineTo(18, 60); g.fill();
    g.fillStyle = ink; let fs = 76; g.font = fs + 'px "Permanent Marker", cursive'; while (g.measureText(text).width > 520) { fs -= 4; g.font = fs + 'px "Permanent Marker", cursive'; } g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(text, 0, 6);
    g.fillStyle = 'rgba(255,255,255,0.55)'; g.save(); g.translate(-250, -58); g.rotate(-0.5); g.fillRect(-40, -14, 80, 28); g.restore();
    g.restore();
  });
  const SPOTS = {
    about: { tag: tagTex('ABOUT ME', '#F4F4F4', '#111111'), anchor: new THREE.Vector3(0.15, 1.42, -1.75), meshes: [nb, pen] },
    projects: { tag: tagTex('PROJECTS', '#FA1A1D', '#FFFFFF'), anchor: new THREE.Vector3(-3.0, 1.98, -1.05), meshes: [crate, ...sleeves.map((s) => s.box)] },
    achievements: { tag: tagTex('ACHIEVEMENTS', '#FFD23F', '#111111'), anchor: new THREE.Vector3(-2.95, 1.25, 0.2), meshes: [cup, cert, ...medal.children] },
    experience: { tag: tagTex('EXPERIENCE', '#74D4F0', '#111111'), anchor: new THREE.Vector3(2.3, 1.72, -1.95), meshes: [] },
    contact: { tag: tagTex('CONTACT', '#BFEA88', '#111111'), anchor: new THREE.Vector3(-0.2, 2.9, -2.6), meshes: [cork] },
  };
  laptop.traverse((o) => { if (o.isMesh) SPOTS.experience.meshes.push(o); });
  Object.entries(SPOTS).forEach(([name, s]) => {
    s.sprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: s.tag, transparent: true, depthTest: false, depthWrite: false, sizeAttenuation: false, toneMapped: false }));
    s.sprite.center.set(0.5, 0.02); s.sprite.renderOrder = 10; s.sprite.position.copy(s.anchor); scene.add(s.sprite);
    s.sprite.userData.spot = name; s.meshes.forEach((m) => { m.userData.spot = name; });
    s.halo = glow(0xffd27a, 1.4, 0); s.halo.position.copy(s.anchor).add(new THREE.Vector3(0, -0.25, 0)); scene.add(s.halo);
    s.h = 0;
  });
  sleeves.forEach((s, i) => { s.box.userData.proj = i; });
  meParts.forEach((m) => { m.userData.spot = 'me'; });
  const chairParts = []; chair.traverse((o) => { if (o.isMesh) { o.userData.spot = 'chair'; chairParts.push(o); } });
  floor.userData.spot = 'floor'; rug.userData.spot = 'floor';
  const pickables = [door, knob, plate, doorGlass, ...Object.values(SPOTS).flatMap((s) => [s.sprite, ...s.meshes]), ...meParts, ...chairParts, floor, rug];
  // Where he walks to, marked with a ring on the floor.
  const ring = new THREE.Mesh(new THREE.RingGeometry(0.16, 0.2, 40), new THREE.MeshBasicMaterial({ color: 0xffd23f, transparent: true, opacity: 0, toneMapped: false, depthWrite: false }));
  ring.rotation.x = -Math.PI / 2; ring.position.y = 0.012; room.add(ring);
  // Furniture he can't walk through (x0, z0, x1, z1): bed, nightstands, wardrobe, sofa, coffee table, lounge chair, desk, shelf.
  const BLOCKS = [[4.6, -2.2, 7.6, 2.2], [6.6, 2.3, 7.6, 5.5], [1.8, 1.1, 2.8, 3.3], [3.15, 1.7, 4.35, 2.7], [-1.5, 0.65, -0.45, 1.65], [-0.45, -2.9, 2.6, -1.5], [-3.6, -1.5, -2.9, 0.3]];
  const inBlock = (v) => BLOCKS.some(([a, b, c, d]) => v.x > a - 0.25 && v.x < c + 0.25 && v.z > b - 0.25 && v.z < d + 0.25);
  // A goal he can actually stand on: if it's inside furniture, stop where he is (keys) or at the nearest free edge (clicks).
  const freeSpot = (g, from) => { if (!inBlock(g)) return g; if (from) return inBlock(from) ? g : from.clone(); for (let r = 0.2; r < 3; r += 0.2) for (let a = 0; a < 6.28; a += 0.5) { const q = g.clone().add(new THREE.Vector3(Math.cos(a) * r, 0, Math.sin(a) * r)); if (!inBlock(q)) return q; } return g; };
  const seatAt = new THREE.Vector3(1.15, 0, -0.85), seatYaw = Math.PI + 0.5;
  const walker = { pos: seatAt.clone(), yaw: seatYaw, goal: null, sitK: 1, wantSit: true, phase: 0, speed: 0, sitting: true };
  let hitPoint = null;

  // ---- where the camera goes for each
  const nbCenter = new THREE.Vector3(0.15, 1.098, -1.9);
  const VIEWS = {
    about: { pos: nbCenter.clone().add(new THREE.Vector3(0, NB_H / 0.63 * 1.32, -0.06)), look: nbCenter.clone().add(new THREE.Vector3(0, 0, -0.06)), up: new THREE.Vector3(0, 0, -1), off: 0 },
    projects: { pos: new THREE.Vector3(-1.45, 2.15, 0.35), look: new THREE.Vector3(-3.05, 1.68, -1.0), up: Y, off: 330 },
    achievements: { pos: new THREE.Vector3(-1.2, 1.55, 1.75), look: new THREE.Vector3(-3.1, 0.95, 0.3), up: Y, off: 330 },
    experience: { pos: new THREE.Vector3(2.75, 1.95, -0.35), look: new THREE.Vector3(1.9, 1.3, -2.05), up: Y, off: 330 },
    contact: { pos: new THREE.Vector3(0.1, 2.75, -0.75), look: new THREE.Vector3(-0.4, 2.4, -2.77), up: Y, off: 330 },
  };

  const ray = new THREE.Raycaster(); const ndc = new THREE.Vector2();
  let hovered = null, hoveredProj = -1, lastHover = null;
  // Arrow keys (or WASD) walk him around the room.
  const keys = {};
  const keyMap = { ArrowUp: 'u', KeyW: 'u', ArrowDown: 'd', KeyS: 'd', ArrowLeft: 'l', KeyA: 'l', ArrowRight: 'r', KeyD: 'r' };
  const onKey = (down) => (e) => { const k = keyMap[e.code]; if (!k || !self._entered || self._focus) return; const r = host.getBoundingClientRect(); if (r.bottom < 0 || r.top > innerHeight) return; keys[k] = down; e.preventDefault(); };
  const kd = onKey(true), ku = onKey(false); window.addEventListener('keydown', kd); window.addEventListener('keyup', ku);
  const prevCleanup = self._cleanup; self._cleanup = () => { window.removeEventListener('keydown', kd); window.removeEventListener('keyup', ku); prevCleanup && prevCleanup(); };
  let enterAt = -1;
  self._entered = !!self._skipIntro;
  self.enterHouse = () => { if (enterAt < 0 && !self._entered) { enterAt = clockT; wake(); self.sfx && self.sfx.whoosh && self.sfx.whoosh(); } };
  host.addEventListener('click', () => {
    wake();
    if (!self._entered) { if (hovered === 'door') self.enterHouse(); return; }
    if (hovered === 'me') { waveUntil = clockT + 2.4; self.sfx.tick(); return; }
    if (hovered === 'floor' && hitPoint) {
      walker.goal = freeSpot(new THREE.Vector3(Math.max(-3.1, Math.min(7.0, hitPoint.x)), 0, Math.max(-1.35, Math.min(5.2, hitPoint.z))));
      walker.wantSit = false; ring.position.set(walker.goal.x, 0.012, walker.goal.z); ring.material.opacity = 0.9; self.sfx.tick(); return;
    }
    if (hovered === 'chair') { walker.goal = seatAt.clone().add(new THREE.Vector3(Math.sin(seatYaw) * -0.55, 0, Math.cos(seatYaw) * -0.55)); walker.wantSit = true; self.sfx.tick(); return; }
    if (hovered) self.go(hovered, hovered === 'projects' && hoveredProj >= 0 ? hoveredProj : undefined);
  });

  // ---- the loop
  const target = new THREE.Vector3(-0.1, 1.35, -0.6);
  const camPos = new THREE.Vector3(), camLook = new THREE.Vector3(), camUp = new THREE.Vector3(0, 1, 0);
  let nightK = 0;
  let first = true, offX = 0, aboutK = 0, lastBlink = 0, blinkOn = true, waveUntil = 2.8, waveW = 0, clockT = 0, nextBlink = 2;
  self.wave = () => { waveUntil = clockT + 2.4; };
  runLoop((p, t) => {
    clockT = t;
    const focus = self._focus || '';
    // Life: the neon flickers now and then, the fairy lights twinkle, steam rises, the cursor blinks, dust drifts.
    const flick = Math.random() < 0.006 ? 0.35 : 1;
    neon.material.opacity = flick; neonGlow.material.opacity = 0.85 * flick + Math.sin(t * 9) * 0.03; neonLight.intensity = 0.9 * flick;
    fairy.forEach((f) => { f.gl.material.opacity = 0.55 + Math.sin(t * 2.2 + f.ph) * 0.35; });
    steam.forEach((st) => { const k = (t * 0.35 + st.ph) % 1; st.s.position.set(Math.sin(k * 6 + st.ph * 9) * 0.03, 0.2 + k * 0.45, 0); st.s.material.opacity = Math.sin(k * Math.PI) * 0.35; st.s.scale.setScalar(0.08 + k * 0.18); });
    if (t - lastBlink > 0.55) { lastBlink = t; blinkOn = !blinkOn; drawCode(blinkOn); }
    const pos = dustGeo.attributes.position; for (let i = 0; i < pos.count; i++) { let y = pos.getY(i) + 0.0015 + Math.sin(t + i) * 0.0006; if (y > 3.2) y = 0.9; pos.setY(i, y); } pos.needsUpdate = true;
    // ---- day / night
    nightK += ((self._night ? 1 : 0) - nightK) * 0.05;
    const nk = nightK;
    amb.intensity = lerp(0.16, 0.05, nk); amb.color.setRGB(lerp(1, 0.45, nk), lerp(0.96, 0.5, nk), lerp(0.91, 0.75, nk));
    hemi.intensity = lerp(0.38, 0.1, nk);
    moon.intensity = lerp(5.5, 1.1, nk); moon.color.setRGB(lerp(1, 0.45, nk), lerp(0.91, 0.58, nk), lerp(0.77, 1, nk));
    key.intensity = lerp(0.35, 0.06, nk);
    // reflections/ambient from the environment maps fade too (that's most of the daylight indoors)
    if (Math.abs(nk - (self._lastNk == null ? -1 : self._lastNk)) > 0.004) {
      self._lastNk = nk; const f = lerp(1, 0.12, nk);
      scene.traverse((o) => { if (!o.isMesh || !o.material) return; (Array.isArray(o.material) ? o.material : [o.material]).forEach((m) => { if (m.envMapIntensity === undefined) return; if (m.userData.baseEnv === undefined) m.userData.baseEnv = m.envMapIntensity; m.envMapIntensity = m.userData.baseEnv * f; }); });
    }
    sun.intensity = lerp(2.2, 0.12, nk); skyFill.intensity = lerp(0.6, 0.04, nk); renderer.toneMappingExposure = lerp(0.92, 1.05, nk);
    if (self._beamMat) { self._beamMat.opacity = lerp(0.16, 0.07, nk); self._beamMat.color.setRGB(lerp(1, 0.6, nk), lerp(1, 0.7, nk), 1); }
    lampLight.intensity = lerp(0.9, 2.0, nk); (self._bedLamps || []).forEach((l) => { l.intensity = lerp(0.7, 1.6, nk); });
    const wantNightGlass = nk > 0.5; if (glass.userData.night !== wantNightGlass) { glass.userData.night = wantNightGlass; glass.material = wantNightGlass ? nightGlass : dayGlass; glass2.material = glass.material; }
    lamp.intensity = (2.4 + Math.sin(t * 1.3) * 0.08) * lerp(1, 1.5, nk);
    if (self._motes) { const pa = self._motes.geo.attributes.position, b = self._motes.base; for (let i = 0; i < pa.count; i++) pa.setXYZ(i, b[i * 3] + Math.sin(t * 0.3 + i) * 0.05, b[i * 3 + 1] + Math.sin(t * 0.2 + i * 1.7) * 0.06, b[i * 3 + 2] + Math.cos(t * 0.25 + i) * 0.05); pa.needsUpdate = true; }
    const now = new Date(); const sec = now.getSeconds() + now.getMilliseconds() / 1000, min = now.getMinutes() + sec / 60, hr = (now.getHours() % 12) + min / 60;
    secH.rotation.z = -sec / 60 * Math.PI * 2; minH.rotation.z = -min / 60 * Math.PI * 2; hourH.rotation.z = -hr / 12 * Math.PI * 2;

    // ---- camera: the scroll path (wide shot down onto the notebook), or the spot that was clicked
    const az = (38 + mouse.sx * 12) * Math.PI / 180, el = (24 - mouse.sy * 6) * Math.PI / 180, R = W / H >= 1 ? 8.6 : 9.5;
    void az; void el; void R;
    const portrait = W / H < 1;
    const orbit = new THREE.Vector3(portrait ? 1.2 : 2.0, 2.05, 5.6).add(new THREE.Vector3(mouse.sx * 0.35 + Math.sin(t * 0.31) * 0.03, -mouse.sy * 0.15 + Math.sin(t * 0.47) * 0.02, Math.sin(t * 0.23) * 0.04));
    target.set((portrait ? 1.2 : 2.0) + mouse.sx * 1.2, 1.5 - mouse.sy * 0.35, -2.8);
    const q = band(p, 0, 1);
    const mid = nbCenter.clone().add(new THREE.Vector3(1.4, 3.2, 3.2));
    const end = VIEWS.about.pos;
    const a = orbit.clone().lerp(mid, q), b2 = mid.clone().lerp(end, q);
    let wantPos = a.lerp(b2, q), wantLook = target.clone().lerp(nbCenter, band(p, 0, 0.75)), wantUp = Y.clone().lerp(VIEWS.about.up, band(p, 0.55, 1)), wantOff = 0;
    const V = VIEWS[focus];
    if (V) { wantPos = V.pos; wantLook = V.look; wantUp = V.up; wantOff = V.off; }
    // ---- the way in: stand on the lawn, the door opens, walk through it
    let intro = 0;
    if (!self._entered) {
      const u = enterAt < 0 ? 0 : Math.min(1, (t - enterAt) / 4.4);
      const doorU = enterAt < 0 ? 0 : ease(clamp((t - enterAt - 1.6) / 1.2));
      doorPivot.rotation.y = doorU * 1.75;
      spill.intensity = doorU * 3.5;
      doorHalo.material.opacity = enterAt < 0 ? (hovered === 'door' ? 0.5 : 0) : 0.4 * doorU;
      const out = new THREE.Vector3(mouse.sx * 1.2 + Math.sin(t * 0.3) * 0.08, 1.8 - mouse.sy * 0.3, portrait ? 30 : 22);
      const walk = ease(clamp((u - 0.18) / 0.82));
      const path = new THREE.CatmullRomCurve3([out, new THREE.Vector3(0, 1.65, 13), new THREE.Vector3(0, 1.7, 8.2), new THREE.Vector3(0, 1.8, 5.9), new THREE.Vector3(portrait ? 0.9 : 0, 2.0, 5.4)]);
      wantPos = path.getPoint(walk);
      const doorLook = new THREE.Vector3(mouse.sx * 1.5, lerp(4.6, 1.6, ease(clamp(walk * 1.6))) - mouse.sy * 0.5, 6);
      wantLook = doorLook.lerp(target, ease(clamp((walk - 0.55) / 0.45)));
      wantUp = Y; wantOff = 0; intro = 1;
      sun.intensity = 2.2 * (1 - walk); skyFill.intensity = 0.6 * (1 - walk);
      if (u >= 1) { self._entered = true; self.onEntered && self.onEntered(); }
    } else { doorPivot.rotation.y = 0; spill.intensity = 0; doorHalo.material.opacity = 0; sun.intensity = 0; skyFill.intensity = 0; }
    const k = first ? 1 : intro ? 0.2 : V ? 0.06 : 0.14; first = false;
    camPos.lerp(wantPos, k); camLook.lerp(wantLook, k); camUp.lerp(wantUp, k).normalize(); offX += (wantOff - offX) * 0.08;
    camera.position.copy(camPos); camera.up.copy(camUp); camera.lookAt(camLook);
    // Wide, like standing in the doorway; narrows when it flies in close to something.
    const wantFov = V ? 35 : !self._entered && enterAt < 0 ? Math.min(80, Math.max(40, 2 * Math.atan(Math.tan((portrait ? 15 : 25) * Math.PI / 180) / (W / H)) * 180 / Math.PI)) : Math.min(95, Math.max(45, 2 * Math.atan(Math.tan(44 * Math.PI / 180) / (W / H)) * 180 / Math.PI));
    if (Math.abs(camera.fov - wantFov) > 0.05) { camera.fov += (wantFov - camera.fov) * (first ? 1 : 0.08); camera.updateProjectionMatrix(); }
    if (offX > 0.5) camera.setViewOffset(W, H, offX * Math.min(1, W / 1440) * (W < 768 ? 0 : 1), 0, W, H); else camera.clearViewOffset();

    // The lamp gets out of the way as the camera comes down over the notebook.
    aboutK += ((focus === 'about' || focus === 'contact' ? 1 : 0) - aboutK) * 0.06;
    const down = Math.max(band(p, 0.72, 0.92), clamp((aboutK - 0.35) / 0.5));
    if (self._bloom) { self._bloom.strength = 0.32 * (1 - clamp(aboutK * 1.6)); self._bloom.enabled = self._bloom.strength > 0.01; }
    [lampMat, shade.material, bulb.material].forEach((m) => { m.transparent = true; m.opacity = 1 - down; });
    bulbGlow.material.opacity = 0.9 * (1 - down);
    pen.visible = down < 0.5;
    nbFlat.material.opacity = focus === 'contact' ? 0 : Math.max(band(p, 0.8, 1), clamp((aboutK - 0.75) / 0.25));

    // ---- hover
    if (!mouse.down && (mouse.moved || camPos.distanceToSquared(wantPos) > 0.0004)) {
      mouse.moved = false;
      ndc.set(mouse.x, -mouse.y); ray.setFromCamera(ndc, camera);
      const hit = ray.intersectObjects(pickables, false)[0];
      hovered = hit ? hit.object.userData.spot : null; hitPoint = hit ? hit.point : null;
      if (!self._entered ? hovered !== 'door' : hovered === 'door') hovered = null;
      if (focus && (hovered === 'floor' || hovered === 'chair')) hovered = null;
      hoveredProj = hit && hit.object.userData.proj !== undefined ? hit.object.userData.proj : -1;
      if (hovered === focus && hovered !== 'projects') hovered = null;
      if (hovered !== lastHover) { if (hovered) self.sfx.tick(); lastHover = hovered; self.onHover && self.onHover(hovered && SPOTS[hovered] && !focus ? hovered : null); if (self._outline) self._outline.selectedObjects = hovered && SPOTS[hovered] && !focus ? SPOTS[hovered].meshes.filter((m) => m.isMesh) : []; }
      host.style.cursor = hovered === 'floor' ? 'crosshair' : hovered ? 'pointer' : 'default';
    }
    const tagsOn = 0;
    Object.entries(SPOTS).forEach(([name, s]) => {
      s.h += ((hovered === name ? 1 : 0) - s.h) * 0.15;
      s.sprite.material.opacity += (tagsOn - s.sprite.material.opacity) * 0.12;
      s.sprite.visible = s.sprite.material.opacity > 0.02;
      const sc = 0.04 * Math.tan(camera.fov * Math.PI / 360) / Math.tan(35 * Math.PI / 360) * Math.max(0.55, Math.min(1, W / 1100)) * (1 + s.h * 0.18); s.sprite.scale.set(sc * 640 / 190, sc, 1);
      s.sprite.position.copy(s.anchor).add(new THREE.Vector3(0, Math.sin(t * 2 + name.length) * 0.02 + s.h * 0.05, 0));
      s.halo.material.opacity = 0;
    });

    // ---- records: the chosen one slides out of the crate and turns to you, its record peeking out
    const sel = focus === 'projects' ? (self._proj || 0) : -1;
    sleeves.forEach((s, i) => {
      const want = i === sel ? 1 : (hoveredProj === i ? 0.3 : (hovered === 'projects' && sel < 0 ? 0.08 : 0));
      s.lift += (want - s.lift) * 0.1;
      s.sl.position.set(s.base.x + s.lift * 0.38, s.base.y + s.lift * 0.1, s.base.z);
      s.sl.rotation.set(0.1 * (1 - s.lift), s.lift * 0.85, 0);
      s.disc.position.x = s.lift * 0.11; s.disc.rotation.z += 0.04 * s.lift;
    });
    // The trophy turns when you look at it.
    cup.rotation.y += (focus === 'achievements' || hovered === 'achievements') ? 0.02 : 0.002;

    // ---- Lakshya: breathes, blinks, waves, and looks at what you point at (else at you)
    const lookAt = hovered && SPOTS[hovered] ? SPOTS[hovered].anchor : V && focus !== 'about' ? V.look : camera.position;
    const dt = Math.min(0.05, t - (self._lastT || t)); self._lastT = t;
    ring.material.opacity *= 0.97;
    { const kx = (keys.r ? 1 : 0) - (keys.l ? 1 : 0), kz = (keys.d ? 1 : 0) - (keys.u ? 1 : 0);
      if (kx || kz) { const d = new THREE.Vector3(kx, 0, kz).normalize(); walker.goal = freeSpot(new THREE.Vector3(Math.max(-3.1, Math.min(7.0, walker.pos.x + d.x * 0.35)), 0, Math.max(-1.35, Math.min(5.2, walker.pos.z + d.z * 0.35))), walker.pos); walker.wantSit = false; walker.sitting = false; } }
    if (walker.goal) {
      // Stand up first, then walk; turn to face the way he's going.
      if (walker.sitK > 0.02) walker.sitK = Math.max(0, walker.sitK - dt * 2.2);
      else {
        const d = walker.goal.clone().sub(walker.pos); d.y = 0; const dist = d.length();
        if (dist < 0.05) {
          walker.goal = null; walker.speed = 0;
          if (walker.wantSit) walker.sitting = true;
        } else {
          walker.speed = Math.min(1.3, walker.speed + dt * 4);
          walker.pos.addScaledVector(d.normalize(), Math.min(dist, walker.speed * dt));
          const want = Math.atan2(-d.x, -d.z); let dy = want - walker.yaw; dy = Math.atan2(Math.sin(dy), Math.cos(dy)); walker.yaw += dy * Math.min(1, dt * 10);
          walker.phase += dt * walker.speed * 7.5;
        }
      }
    } else {
      walker.speed = 0;
      if (walker.sitting) {
        // Back into the chair: slide onto the seat, turn round and sit.
        walker.pos.lerp(seatAt, Math.min(1, dt * 6)); let dy = seatYaw - walker.yaw; dy = Math.atan2(Math.sin(dy), Math.cos(dy)); walker.yaw += dy * Math.min(1, dt * 6);
        walker.sitK = Math.min(1, walker.sitK + dt * 2);
      }
    }
    if (walker.goal) walker.sitting = false;
    const sk = ease(walker.sitK), stride = walker.speed > 0.05 ? Math.sin(walker.phase) : 0, amp = Math.min(1, walker.speed);
    const hipY = lerp(1.04, 0.72, sk) + (walker.speed > 0.05 ? Math.abs(Math.cos(walker.phase)) * 0.03 : 0);
    me.position.copy(walker.pos); me.rotation.y = walker.yaw;
    pelvis.position.set(0, hipY, lerp(0, 0.04, sk)); body.position.set(0, hipY + 0.02, lerp(0.02, 0.06, sk));
    legs.forEach((L) => {
      L.hip.position.set(L.s * 0.1, hipY - 0.01, lerp(0.02, 0.02, sk));
      const sw = stride * L.s * 0.55 * amp;
      L.hip.rotation.x = lerp(sw, Math.PI / 2, sk);
      L.knee.rotation.x = lerp(-Math.max(0, -Math.sin(walker.phase + (L.s > 0 ? 0 : Math.PI))) * 0.8 * amp, -Math.PI / 2, sk);
    });
    shoulderL.rotation.set(lerp(-stride * 0.5 * amp, 0.4, sk), 0, lerp(-0.12, -0.12, sk));
    elbowL.rotation.set(lerp(0.25, 1.15, sk), 0, 0);
    const lp = me.worldToLocal(lookAt.clone()).sub(new THREE.Vector3(0, hipY + 0.75, 0.06));
    const yaw = Math.max(-1.1, Math.min(1.1, Math.atan2(-lp.x, -lp.z)));
    const pitch = Math.max(-0.45, Math.min(0.45, Math.atan2(lp.y, Math.hypot(lp.x, lp.z))));
    body.rotation.y += (yaw * 0.3 - body.rotation.y) * 0.06;
    head.rotation.y += (yaw * 0.7 - head.rotation.y) * 0.08;
    head.rotation.x += (pitch - head.rotation.x) * 0.08;
    head.rotation.z = Math.sin(t * 0.9) * 0.03;
    torso.scale.y = 1 + Math.sin(t * 2.1) * 0.012;
    if (t > nextBlink) { eyes.forEach(([e]) => e.scale.set(1, 0.12, 1)); if (t > nextBlink + 0.12) { eyes.forEach(([e]) => e.scale.set(1, 1, 1)); nextBlink = t + 2.4 + Math.random() * 2.5; } }
    if (hovered === 'me' && t > waveUntil - 1) waveUntil = t + 1.2;
    waveW += ((t < waveUntil ? 1 : 0) - waveW) * 0.1;
    shoulderR.rotation.set(lerp(lerp(stride * 0.5 * amp, 0.4, sk), 0.15, waveW), 0, lerp(0.12, 2.55, waveW));
    elbowR.rotation.set(lerp(lerp(0.25, 1.15, sk), 0, waveW), 0, waveW * (0.35 + Math.sin(t * 11) * 0.5));
    self.setOverlay(0);
  });
});

}
