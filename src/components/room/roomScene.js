// @ts-nocheck
// Generated from the design canvas scene (scratchpad g3d/common.js + g3d/room3.js). The room at night,
// with Lakshya as a 3D figure; the notebook, the record player, the card wall, the monitor and the poster wall open the sections.
import * as T from 'three';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { MeshoptDecoder } from 'three/examples/jsm/libs/meshopt_decoder.module.js';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';
import { BufferGeometryUtils } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { landCam, landShift, lawnFov } from './landCam';
import { live, output } from '@/components/projects/crate/crateSounds';
import { buildAchievementsWall } from './achievementsWall';
import { buildExperienceReel } from './experienceReel';
import { buildContactWall } from './contactWall';
import { buildRecordPlayer } from './recordPlayer';

/** Builds the scene into `host`. `self` carries the section's state and callbacks; returns nothing, call self._cleanup() to stop. */
export function startRoom(host, self) {
  const THREE = { ...T, RoundedBoxGeometry, GLTFLoader, EffectComposer, RenderPass, UnrealBloomPass, ShaderPass };
// ---- shared 3D scaffolding (runs inside start(THREE)) ----
let W = host.clientWidth || 1440, H = host.clientHeight || 900;
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: 'high-performance' });
// Phones and 4K screens don't need every pixel; the loop lowers this further if frames run long.
const MAX_PR = Math.min(window.devicePixelRatio || 1, W < 768 ? 1.5 : 1.25);
renderer.setPixelRatio(MAX_PR);
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
renderer.domElement.style.touchAction = 'pan-y';
host.appendChild(renderer.domElement);
// A soft vignette and a still film grain over the canvas (an animated, blended grain costs a full-screen composite every frame).
{ const fx = document.createElement('div'); fx.style.cssText = 'position:absolute;inset:0;pointer-events:none;z-index:1;background:radial-gradient(ellipse at 50% 45%, rgba(0,0,0,0) 55%, rgba(0,0,0,0.45) 100%)';
  const gr = document.createElement('div'); gr.style.cssText = 'position:absolute;inset:0;pointer-events:none;z-index:1;opacity:0.05;background-image:url("data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 width=%27200%27 height=%27200%27%3E%3Cfilter id=%27n%27%3E%3CfeTurbulence type=%27fractalNoise%27 baseFrequency=%270.9%27 numOctaves=%272%27/%3E%3C/filter%3E%3Crect width=%27100%25%27 height=%27100%25%27 filter=%27url(%23n)%27/%3E%3C/svg%3E")';
  if (getComputedStyle(host).position === 'static') host.style.position = 'relative';
  host.style.overflow = 'hidden'; host.appendChild(fx); host.appendChild(gr); }
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x000000);
const camera = new THREE.PerspectiveCamera(35, W / H, 0.05, 300);
// Follow the section's size. The resize itself waits for the next frame (resizing clears the canvas, so it must happen right before a draw).
let needResize = false;
const doResize = () => { needResize = false; W = host.clientWidth || W; H = host.clientHeight || H; renderer.setSize(W, H, false); camera.aspect = W / H; camera.updateProjectionMatrix(); self._onResize && self._onResize(W, H); };
const ro = new ResizeObserver(() => { needResize = true; });
ro.observe(host);
self._cleanup = () => { ro.disconnect(); renderer.dispose(); renderer.domElement.remove(); };
self._camera = camera;
if (import.meta.env && import.meta.env.DEV) self._three = { renderer, scene, camera, THREE };
// The light the room's surfaces pick up from all around them (image-based lighting): a little room of its own, lit the
// way this one is, with its windows where the real ones are (sun through the left one, sky through the right), honey
// floorboards bouncing warmth back up and a pale ceiling. Much warmer and more directional than a generic grey studio,
// and a night version (moonlit windows, lamplight low down) that's swapped in after dark.
const envs = {};
{
  const pmrem = new THREE.PMREMGenerator(renderer);
  const box = new THREE.BoxGeometry(1, 1, 1);
  const paint = (hex, k, side = THREE.FrontSide) => new THREE.MeshBasicMaterial({ color: new THREE.Color(hex).convertSRGBToLinear().multiplyScalar(k), side });
  const build = (night) => {
    const env = new THREE.Scene(), k = night ? 0.2 : 1;
    // the walls, in a box's face order: +x (the bed's side), -x (the bookshelf's), ceiling, floor, behind you, the sage wall
    const shell = new THREE.Mesh(box, [0xbdb4a6, 0xcbc3b6, 0xd9d2c6, 0x7a5434, 0xb2aa9c, 0x71826f].map((c, i) => paint(c, [0.68, 0.6, 0.55, 0.6, 0.62, 0.5][i] * k, THREE.BackSide)));
    shell.scale.set(11, 5, 9); shell.position.y = 1.4; env.add(shell);
    const panel = (hex, k2, x, y, z, w, h, ry = 0) => { const m = new THREE.Mesh(box, paint(hex, k2)); m.position.set(x, y, z); m.scale.set(w, h, 0.05); m.rotation.y = ry; env.add(m); };
    if (!night) { panel(0xffe2b8, 14, -3.4, 1.1, -4.3, 1.8, 1.6); panel(0xd8e6ff, 5, 3.4, 1.2, -4.3, 2.0, 2.0); }
    else { panel(0x8ea6e6, 2.2, -3.4, 1.1, -4.3, 1.8, 1.6); panel(0x8ea6e6, 1.2, 3.4, 1.2, -4.3, 2.0, 2.0); panel(0xffb066, 6, -1.0, 0.3, -4.3, 0.7, 0.7); panel(0xffc27a, 5, -5.2, 0.1, 1.0, 0.8, 0.8, Math.PI / 2); panel(0xffc27a, 4, 5.2, -0.2, 0.0, 1.2, 0.6, -Math.PI / 2); }
    const t = pmrem.fromScene(env, 0.04).texture;
    env.traverse((o) => { if (o.material) [].concat(o.material).forEach((m) => m.dispose()); });
    return t;
  };
  envs.day = build(false); envs.night = build(true);
  box.dispose(); pmrem.dispose();
  scene.environment = envs.day;
}
/** A standard material with a little of the environment in it. Plain ones are shared, so the static batcher can merge everything that looks alike;
 *  pass `extra` (even {}) for a material of its own that you mean to change later. */
const matCache = new Map();
const mat = (color, rough = 0.7, metal = 0, env = 0.35, extra) => {
  if (extra) return new THREE.MeshStandardMaterial(Object.assign({ color, roughness: rough, metalness: metal, envMapIntensity: env }, extra));
  const k = (color && color.isColor ? color.getHexString() : color) + '|' + rough + '|' + metal + '|' + env;
  if (!matCache.has(k)) matCache.set(k, new THREE.MeshStandardMaterial({ color, roughness: rough, metalness: metal, envMapIntensity: env }));
  return matCache.get(k);
};
/** A box with rounded edges (falls back to a plain box), casting and receiving shadows. Only as many segments as the
 *  rounding can show: a 1 cm edge needs one bevel, not the 972 triangles a 4-segment box costs. */
const rbox = (w, h, d, r, material) => {
  const rr = Math.min(r, w / 2, h / 2, d / 2), seg = rr < 0.016 ? 1 : rr < 0.045 ? 2 : 3;
  const geo = THREE.RoundedBoxGeometry ? new THREE.RoundedBoxGeometry(w, h, d, seg, rr) : new THREE.BoxGeometry(w, h, d);
  const m = new THREE.Mesh(geo, material); m.castShadow = true; m.receiveShadow = true; return m;
};
/** A soft additive glow, for bulbs and neon. */
let glowTex = null;
const glowTexture = () => glowTex || (glowTex = canvasTex(128, 128, (g, w, h) => { const gr = g.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, w / 2); gr.addColorStop(0, 'rgba(255,255,255,1)'); gr.addColorStop(0.25, 'rgba(255,255,255,0.45)'); gr.addColorStop(1, 'rgba(255,255,255,0)'); g.fillStyle = gr; g.fillRect(0, 0, w, h); }));
// A glow seen from up close washes out the whole frame, so each one fades out as the camera comes near it (by its size).
const _gp = new T.Vector3();
const glow = (color, size, opacity = 0.9) => {
  const sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowTexture(), color, transparent: true, opacity, blending: THREE.AdditiveBlending, depthWrite: false, toneMapped: false }));
  sp.scale.set(size, size, 1);
  sp.onBeforeRender = (r, sc, cam) => {
    const m = sp.material, s = sp.scale.x; m.userData.o = m.opacity;
    m.opacity *= Math.min(1, Math.max(0, (cam.position.distanceTo(sp.getWorldPosition(_gp)) - s * 0.6) / (s * 1.2)));
  };
  sp.onAfterRender = () => { sp.material.opacity = sp.material.userData.o; };
  return sp;
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
  const lines = ['Dear diary,', "I'm Lakshya, a developer and data scientist.", 'B.Tech CSE (Data Science) at VIT Vellore.', 'I build apps, websites and AI experiments.', 'Status: unemployed (but I make it sound cool).', '→ update: ex summer intern @ NTT DATA', 'Superpower: turning coffee into code', 'and bugs into features.', 'Home base: Gurgaon, India.'];
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
const onMove = (e) => {
  const r = host.getBoundingClientRect();
  const nx = (e.clientX - r.left) / r.width * 2 - 1, ny = (e.clientY - r.top) / r.height * 2 - 1;
  if (mouse.down) mouse.dx += (nx - mouse.x);
  mouse.x = nx; mouse.y = ny; mouse.moved = true;
  mouse.touch = e.pointerType === 'touch';
};
const onDown = (e) => { mouse.down = true; onMove(e); };
const onUp = () => { mouse.down = false; };
host.addEventListener('pointermove', onMove);
host.addEventListener('pointerdown', onDown);
window.addEventListener('pointerup', onUp);
{ const prev = self._cleanup; self._cleanup = () => { host.removeEventListener('pointermove', onMove); host.removeEventListener('pointerdown', onDown); window.removeEventListener('pointerup', onUp); prev && prev(); }; }

const GRADE = {
  uniforms: { tDiffuse: { value: null } },
  vertexShader: 'varying vec2 vUv; void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }',
  fragmentShader: [
    'uniform sampler2D tDiffuse; varying vec2 vUv;',
    'void main() {',
    '  vec4 c = LinearTosRGB(texture2D(tDiffuse, vUv));',
    '  vec3 col = c.rgb;',
    '  float l = dot(col, vec3(0.2126, 0.7152, 0.0722));',
    '  col = mix(vec3(l), col, 1.1);',
    '  col = col + (col - 0.5) * col * (1.0 - col) * 0.35;',
    '  col += vec3(0.018, 0.006, -0.012) * smoothstep(0.35, 1.0, l) + vec3(-0.008, 0.0, 0.014) * (1.0 - smoothstep(0.0, 0.4, l));',
    '  gl_FragColor = vec4(clamp(col, 0.0, 1.0), c.a);',
    '}',
  ].join('\n'),
};
const runLoop = (update) => {
  // Post-processing: render into a multisampled target (so edges stay smooth), a gentle glow on the brightest lights (bloom),
  // then the usual sRGB output. Falls back to a plain render if WebGL2 isn't there.
  let fx, bloom = null;
  const makeFx = () => {
    if (!THREE.EffectComposer || self._noFx || !renderer.capabilities.isWebGL2) return null;
    const pr = renderer.getPixelRatio();
    const rt = new THREE.WebGLMultisampleRenderTarget(W * pr, H * pr, { minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter, format: THREE.RGBAFormat });
    rt.samples = 4;
    const c = new THREE.EffectComposer(renderer, rt); c.setPixelRatio(pr); c.setSize(W, H);
    c.addPass(new THREE.RenderPass(scene, camera));
    // Bloom works at a reduced size internally; half the canvas is plenty for a soft glow. It's a dozen passes, so a phone
    // (where the lamps' and the neon's own glows read just as well on a small screen) goes without.
    if (W >= 768) { bloom = self._bloom = new THREE.UnrealBloomPass(new THREE.Vector2(W / 2, H / 2), 0.32, 0.55, 0.9); c.addPass(bloom); }
    // The output pass: to sRGB (as the plain gamma pass did), then a light grade, a touch more contrast and colour, warm
    // highlights and cool shadows, for the price of the pass that was there anyway.
    c.addPass(new THREE.ShaderPass(GRADE));
    self._onResize = (w, h) => { c.setSize(w, h); if (bloom) bloom.setSize(w / 2, h / 2); };
    return c;
  };
  // Dynamic resolution: if frames keep running long, render fewer pixels; if there's headroom again, go back up.
  let pr = renderer.getPixelRatio(), avg = 16.7, lastNow = 0, lastChange = 0;
  const setPR = (v) => { pr = v; renderer.setPixelRatio(pr); renderer.setSize(W, H, false); if (fx) { fx.setPixelRatio(pr); fx.setSize(W, H); } };
  // Only draw while the room is on screen and the tab is visible.
  let onScreen = true;
  if (window.IntersectionObserver) { const io = new IntersectionObserver((es) => { onScreen = es[0].isIntersecting; }); io.observe(host); const prev = self._cleanup; self._cleanup = () => { io.disconnect(); prev && prev(); }; }
  let frame = 0;
  const tick = (now) => {
    if (self._dead) return;
    self._raf3 = requestAnimationFrame(tick);
    if (!onScreen || document.hidden) { lastNow = 0; return; }
    const dt = lastNow ? Math.min(0.1, (now - lastNow) / 1000) : 1 / 60;
    lastNow = now;
    // Frame time, smoothed; ignore the first second while shaders and textures warm up. Resizing clears the canvas,
    // so it happens here, right before this frame draws, never between a draw and the screen showing it.
    if (frame > 60 && self._shown) {
      avg += (dt * 1000 - avg) * 0.05;
      if (now - lastChange > 2000) {
        if (avg > 24 && pr > 0.6) { setPR(Math.max(0.6, pr - 0.2)); lastChange = now; avg = 16.7; if (pr <= 0.85) self._noBloom = true; }
        else if (avg < 14 && pr < MAX_PR) { setPR(Math.min(MAX_PR, pr + 0.1)); lastChange = now; }
      }
    }
    if (needResize) doResize();
    if (fx === undefined) fx = makeFx();
    update(self._p || 0, dt);
    // Nothing to draw until it has all loaded (the loading screen covers it), which leaves the CPU free for decoding.
    if (self._hold) return;
    if (fx) fx.render(); else renderer.render(scene, camera);
    frame++;
  };
  self._raf3 = requestAnimationFrame(tick);
};
const fontsReady = Promise.all(['118px "Permanent Marker"', '600 38px Caveat', '700 32px Caveat'].map((f) => document.fonts ? document.fonts.load(f) : null)).catch(() => null);

// ---- The Room, live ----
// The same room, but Lakshya is a 3D figure sat in the chair (glasses, checked
// shirt, waves hello and follows you with his eyes), and the room is the menu:
// the notebook on the desk is About me, the record player in the lounge is
// Projects (each sleeve in the crate is one project), the card wall over the
// bookshelf and the trophy shelf are Achievements, the monitor is Experience and
// the poster wall is Contact. Hover one and it lights up; click it and the camera
// flies over to it.
const C = (hex) => new THREE.Color(hex).convertSRGBToLinear();
Promise.all([loadImg(PHOTO), Promise.all(STK.map(loadImg)), fontsReady, document.fonts ? document.fonts.load('100px Anton').catch(() => null) : null]).then(([photo, stickers]) => {
  scene.background = new THREE.Color(0xa9c4e0);

  // ---- light. The sun through the left window is the key (it lays the window's shadow across the floor); the floorboards and
  // the sky fill in (the room's own environment, above, and a low hemisphere light); the lamps, the neon and, after dark,
  // the moon do the rest. Few lights on purpose: every one is paid for by every pixel.
  const amb = new THREE.AmbientLight(0xfff1e2, 0.06); scene.add(amb);
  const hemi = new THREE.HemisphereLight(0xfff0dc, 0x6a4a30, 0.22); scene.add(hemi);
  const lamp = new THREE.PointLight(0xffb566, 2.4, 7.5, 2); scene.add(lamp);
  const moon = new THREE.SpotLight(0xffd29a, 9, 24, 0.55, 0.35, 1); moon.position.set(-2.8, 4.8, -7.5); moon.castShadow = true; moon.shadow.autoUpdate = false; moon.shadow.bias = -0.0005; moon.shadow.normalBias = 0.02; moon.shadow.mapSize.setScalar(W < 768 ? 1024 : 2048); scene.add(moon); scene.add(moon.target); moon.target.position.set(0.6, 0, 1.0);
  const neonLight = new THREE.PointLight(0xfff0c8, 0.9, 5, 2); neonLight.position.set(0.85, 3.2, -2.3); scene.add(neonLight);

  // Inside and outside are separate groups, so only the one you can see gets drawn.
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
  // (the box's faces run +x, -x, +y, -y, +z, -z: the top is the boards, the rest is the slab's edge, so three draws, not six)
  const floorGeo = new THREE.BoxGeometry(11.4, 0.35, 9.2); floorGeo.clearGroups(); floorGeo.addGroup(0, 12, 0); floorGeo.addGroup(12, 6, 1); floorGeo.addGroup(18, 18, 0);
  const floor = new THREE.Mesh(floorGeo, [slabSide, floorTop]); floor.receiveShadow = true; add(floor, 2.0, -0.175, 1.5);
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
  const house = new THREE.Group(); scene.add(house);
  const AS = '/assets/room/';
  // Everything that loads goes through one manager, so the loading screen can show real progress and the room
  // only appears once it's all there (no furniture popping in).
  const manager = new THREE.LoadingManager();
  manager.onProgress = (url, done, total) => self.onProgress && self.onProgress(done / Math.max(1, total));
  const imgL = new THREE.ImageLoader(manager);
  const images = new Map();
  const image = (url) => { if (!images.has(url)) images.set(url, new Promise((res) => imgL.load(url, res, undefined, () => res(null)))); return images.get(url); };
  const maxAniso = Math.min(8, renderer.capabilities.getMaxAnisotropy());
  const texCache = new Map();
  /** A repeating texture; each image is downloaded and decoded once, however many surfaces use it. */
  const tex = (url, rx, ry, srgb) => {
    const k = url + '|' + rx.toFixed(3) + '|' + ry.toFixed(3);
    if (texCache.has(k)) return texCache.get(k);
    const t = new THREE.Texture(); t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(rx, ry); t.anisotropy = maxAniso; if (srgb) t.encoding = THREE.sRGBEncoding;
    image(url).then((img) => { if (img) { t.image = img; t.needsUpdate = true; } });
    texCache.set(k, t); return t;
  };
  const houseMats = [];
  const pbrCache = new Map();
  const pbr = (name, rx, ry, extra = {}) => {
    const k = name + '|' + rx.toFixed(3) + '|' + ry.toFixed(3) + '|' + JSON.stringify(extra);
    if (pbrCache.has(k)) return pbrCache.get(k);
    const ld = (suf, srgb) => tex(AS + 'tex/' + name + '_' + suf + '.webp', rx, ry, srgb);
    const m = new THREE.MeshStandardMaterial(Object.assign({ map: ld('Diffuse', true), normalMap: ld('nor_gl'), roughnessMap: ld('Rough'), envMapIntensity: 0.6 }, extra));
    houseMats.push(m); pbrCache.set(k, m); return m;
  };
  // glTF furniture and plants (CC0, Poly Haven), meshopt-compressed; each file is fetched once and cloned where it's used.
  const gltfL = new THREE.GLTFLoader(manager); gltfL.setMeshoptDecoder(MeshoptDecoder);
  const models = new Map();
  const model = (name) => { if (!models.has(name)) models.set(name, new Promise((res) => gltfL.load(AS + 'models/' + name + '.glb', (g) => res(g.scene), undefined, () => res(null)))); return models.get(name).then((o) => o && o.clone(true)); };
  const prepModel = (o) => o.traverse((m) => { if (m.isMesh) { m.castShadow = true; m.receiveShadow = true; m.userData.keep = true; if (m.material && !houseMats.includes(m.material)) houseMats.push(m.material); } });
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
  // (the glass mirrors the sky over sheer white curtains, a warm room glowing through where they don't quite meet)
  const interior = canvasTex(256, 256, (g, w, h) => {
    const gr = g.createLinearGradient(0, 0, 0, h); gr.addColorStop(0, '#f4ece0'); gr.addColorStop(1, '#cbbba4'); g.fillStyle = gr; g.fillRect(0, 0, w, h);
    for (let x = 0; x < w; x += 4) { g.fillStyle = 'rgba(110,90,70,' + (0.06 + 0.06 * Math.sin(x * 0.4)) + ')'; g.fillRect(x, 0, 2, h); }
    const gap = g.createLinearGradient(w * 0.4, 0, w * 0.6, 0); gap.addColorStop(0, 'rgba(255,190,120,0)'); gap.addColorStop(0.5, 'rgba(255,186,112,0.6)'); gap.addColorStop(1, 'rgba(255,190,120,0)'); g.fillStyle = gap; g.fillRect(0, 0, w, h);
  });
  const hGlassM = new THREE.MeshStandardMaterial({ color: 0x1a1f26, roughness: 0.05, metalness: 0.55, envMapIntensity: 1.0, emissive: 0xffffff, emissiveMap: interior, emissiveIntensity: 0.42 }); houseMats.push(hGlassM);
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
  // porch: a balcony on two columns over the door, with a glass rail; steps; wall lamps
  box(3.8, 0.25, 1.8, hStoneM, 0, G1 - 0.05, HZ + 0.9);
  [-1.65, 1.65].forEach((x) => { const c = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.14, G1 - 0.2, 24), hFrameM); c.position.set(x, (G1 - 0.2) / 2, HZ + 1.6); c.castShadow = true; house.add(c); });
  const railG = new THREE.MeshStandardMaterial({ color: 0xbfd6e0, roughness: 0.05, metalness: 0.2, transparent: true, opacity: 0.25, envMapIntensity: 1.5 }); houseMats.push(railG);
  box(3.8, 1.0, 0.03, railG, 0, G1 + 0.6, HZ + 1.78, false); box(3.84, 0.05, 0.06, mat(0x222222, 0.3, 0.8), 0, G1 + 1.1, HZ + 1.78, false);
  const stepM = pbr('cobblestone_floor_08', 1, 0.4);
  box(3.4, 0.17, 1.9, mat(0x9a958c, 0.85), 0, -0.085 + 0.0, HZ + 1.05); box(3.0, 0.17, 0.5, mat(0x8f8a82, 0.85), 0, -0.26, HZ + 2.2);
  [-1, 1].forEach((sd) => { house.add(at(rbox(0.16, 0.3, 0.14, 0.02, mat(0x1a1a1a, 0.4, 0.6)), sd * 1.0, 2.35, HZ + 0.22)); house.add(at(new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.2, 0.08), new THREE.MeshBasicMaterial({ color: 0xfff0d0, toneMapped: false })), sd * 1.0, 2.33, HZ + 0.28)); });
  // garden: lawn, a cobblestone path to the door, a pavement along the front
  const lawn = new THREE.Mesh(new THREE.PlaneGeometry(260, 260), pbr('leafy_grass', 98, 98, { color: 0x86b25a })); lawn.rotation.x = -Math.PI / 2; lawn.receiveShadow = true; lawn.position.set(0, -0.37, HZ); house.add(lawn);
  scene.fog = new THREE.Fog(0xc9d6e2, 45, 150);
  const pathM = pbr('cobblestone_floor_08', 1, 7); const path = new THREE.Mesh(new THREE.PlaneGeometry(1.8, 14), pathM); path.rotation.x = -Math.PI / 2; path.receiveShadow = true; path.position.set(0, -0.345, HZ + 9.3); house.add(path);
  const paveM = pbr('cobblestone_floor_08', 20, 1.2); const pave = new THREE.Mesh(new THREE.PlaneGeometry(80, 2.4), paveM); pave.rotation.x = -Math.PI / 2; pave.receiveShadow = true; pave.position.set(0, -0.34, HZ + 17); house.add(pave);
  // real shrubs and potted plants (glTF), placed when they arrive
  {
    const place = (name, spots) => spots.forEach(([x, z, sc, ry]) => model(name).then((o) => { if (!o) return; prepModel(o); o.position.set(x, -0.36, z); o.scale.setScalar(sc); o.rotation.y = ry; house.add(o); applyEnv(); }));
    { const hedgeM = pbr('leafy_grass', 1.4, 1.4, { color: 0x557f3a });
      const clumps = [];
      [[-7.8, -1.3], [1.3, 7.8]].forEach(([x0, x1]) => {
        // (seeded, so the hedge grows the same every visit: clumps of different sizes, some set back, overlapping)
        seed = 23;
        for (let x = x0 + 0.3; x <= x1 - 0.25; x += 0.34 + rnd() * 0.18) {
          const sc = 0.78 + rnd() * 0.38, back = (rnd() - 0.5) * 0.22, ph = rnd() * 6;
          const g = new THREE.SphereGeometry(0.5, 18, 12), pa = g.attributes.position;
          for (let i = 0; i < pa.count; i++) { const vx = pa.getX(i), vy = pa.getY(i), vz = pa.getZ(i), n = 1 + 0.08 * Math.sin(vx * 13 + ph) * Math.cos(vy * 11 + ph) + 0.06 * Math.sin(vz * 17 + vy * 7 + ph); pa.setXYZ(i, vx * n * sc, Math.max(vy * n * 0.86 * sc, -0.42 * sc), vz * n * 0.8 * sc); }
          g.computeVertexNormals(); g.translate(x, -0.36 + 0.42 * sc, HZ + 0.85 + back); clumps.push(g);
        }
      });
      const hedge = new THREE.Mesh(BufferGeometryUtils.mergeBufferGeometries(clumps), hedgeM); hedge.castShadow = hedge.receiveShadow = true; house.add(hedge); }
    place('shrub_04', [[-4.2, HZ + 1.3, 3.5, 0.5], [4.2, HZ + 1.3, 3.5, 2.5], [-1.5, HZ + 3.6, 2.6, 1], [1.5, HZ + 3.6, 2.6, 2], [-1.5, HZ + 7, 2.6, 3], [1.5, HZ + 7, 2.6, 4]]);
    place('potted_plant_02', [[-0.95, HZ + 0.55, 1.6, 0], [0.95, HZ + 0.55, 1.6, 1.4]]);
  }
  // ---- the garden round it: trees either side and behind (and a line of them far off, so the land doesn't just stop), a
  // white picket fence with its gate standing open, a mailbox, flowers in front of the hedges and along the path. Seeded,
  // so it grows the same every visit, and merged into a handful of draws.
  {
    const merged = (geos, m, cast = true) => { const mesh = new THREE.Mesh(BufferGeometryUtils.mergeBufferGeometries(geos), m); mesh.castShadow = cast; mesh.receiveShadow = true; house.add(mesh); return mesh; };
    seed = 57;
    const barkTex = canvasTex(64, 256, (g, w, h) => { g.fillStyle = '#5b4332'; g.fillRect(0, 0, w, h); for (let i = 0; i < 180; i++) { g.fillStyle = 'rgba(' + (rnd() < 0.5 ? '28,18,10' : '150,120,92') + ',' + (0.15 + rnd() * 0.3) + ')'; g.fillRect(rnd() * w, rnd() * h, 1 + rnd() * 3, 10 + rnd() * 40); } });
    barkTex.wrapS = barkTex.wrapT = THREE.RepeatWrapping; barkTex.repeat.set(2, 3);
    // a lumpy clump of leaves
    // (each darker underneath, where the clumps above shade it, so a crown has depth)
    const lumpy = (r, ph) => {
      const g = new THREE.SphereGeometry(r, 14, 10), pa = g.attributes.position, col = new Float32Array(pa.count * 3);
      for (let i = 0; i < pa.count; i++) { const vx = pa.getX(i), vy = pa.getY(i), vz = pa.getZ(i), n = 1 + 0.12 * Math.sin((vx * 5) / r + ph) * Math.cos((vy * 4) / r + ph) + 0.08 * Math.sin((vz * 7) / r + (vy * 3) / r + ph); pa.setXYZ(i, vx * n, vy * n * 0.85, vz * n); col.fill(0.5 + 0.5 * Math.pow((vy / r + 1) / 2, 0.8), i * 3, i * 3 + 3); }
      g.setAttribute('color', new THREE.BufferAttribute(col, 3)); g.computeVertexNormals(); return g;
    };
    const trunks = [], leavesA = [], leavesB = [];
    const tree = (x, z, h, r) => {
      const y0 = -0.37, th = h * 0.5;
      const trunk = new THREE.CylinderGeometry(h * 0.022, h * 0.042, th, 9); trunk.translate(x, y0 + th / 2, z); trunks.push(trunk);
      [[0.6, 0.3], [-0.5, -0.45]].forEach(([dx, dz]) => { const l = new THREE.CylinderGeometry(h * 0.011, h * 0.02, h * 0.3, 7); l.rotateZ(-dx * 0.75); l.rotateX(dz * 0.75); l.translate(x + dx * h * 0.07, y0 + th + h * 0.09, z + dz * h * 0.07); trunks.push(l); });
      const n = 10 + Math.floor(rnd() * 4);
      for (let i = 0; i < n; i++) {
        const a = rnd() * Math.PI * 2, d = rnd() * r * 0.6, g = lumpy(r * (0.36 + rnd() * 0.22), rnd() * 6);
        g.translate(x + Math.cos(a) * d, y0 + th + r * 0.55 + (rnd() - 0.3) * r * 0.6, z + Math.sin(a) * d);
        (rnd() < 0.5 ? leavesA : leavesB).push(g);
      }
    };
    tree(-13.5, 4.5, 9.5, 3.4); tree(13.2, 1.5, 10, 3.6); tree(-19, 13, 7, 2.6); tree(18.5, 11.5, 7.5, 2.8); tree(-10, -5.5, 8.5, 3.1); tree(9.5, -7, 8.5, 3.2); tree(0.5, -9.5, 9.5, 3.5);
    merged(trunks, mat(0xffffff, 0.95, 0, 0.3, { map: barkTex }));
    merged(leavesA, pbr('leafy_grass', 2.2, 2.2, { color: 0x6b9a44, vertexColors: true })); merged(leavesB, pbr('leafy_grass', 2.2, 2.2, { color: 0x4c7c35, vertexColors: true }));
    // far off, all the way round: low trees the haze softens
    const far = [];
    for (let i = 0; i < 150; i++) {
      const a = (i / 150) * Math.PI * 2 + rnd() * 0.03, d = (i % 2 ? 78 : 92) + rnd() * 10, x = Math.sin(a) * d, z = HZ + Math.cos(a) * d, sz = 2.6 + rnd() * 2.8;
      const g = new THREE.IcosahedronGeometry(sz, 1); g.scale(1, 0.9 + rnd() * 0.6, 1); g.translate(x, sz * 0.7, z); far.push(g);
    }
    // (unlit: that far off they're a silhouette the haze tints, not something the sun models)
    merged(far, new THREE.MeshBasicMaterial({ color: new THREE.Color(0x3a5640).convertSRGBToLinear() }), false);
    // the fence: pickets with pointed tops on two rails, posts every few metres, and the gate open onto the path
    const FZ2 = HZ + 10.8, white = mat(0xf3efe6, 0.7, 0, 0.35);
    const pk = new THREE.Shape(); pk.moveTo(-0.045, 0); pk.lineTo(0.045, 0); pk.lineTo(0.045, 0.78); pk.lineTo(0, 0.87); pk.lineTo(-0.045, 0.78); pk.closePath();
    const picket = new THREE.ExtrudeGeometry(pk, { depth: 0.022, bevelEnabled: false });
    const fence = [];
    const flat = (g) => (g.index ? g.toNonIndexed() : g);
    const run = (x0, x1, z, ry = 0, ox = 0, oz = 0) => {
      // a straight run of fence from x0 to x1 along local x, turned by ry about (ox, oz) (the gate's hinges)
      const put = (g) => { g.rotateY(ry); g.translate(ox, 0, oz); fence.push(flat(g)); };
      for (let x = x0; x <= x1 + 0.001; x += 0.16) { const g = picket.clone(); g.translate(x, -0.37, z); put(g); }
      [0.22, 0.6].forEach((y) => { const r = new THREE.BoxGeometry(x1 - x0 + 0.1, 0.07, 0.03); r.translate((x0 + x1) / 2, -0.37 + y, z - 0.026); put(r); });
    };
    run(-16, -1.12, FZ2); run(1.12, 16, FZ2);
    for (const x of [-16, -13.6, -11.2, -8.8, -6.4, -4, -1.05, 1.05, 4, 6.4, 8.8, 11.2, 13.6, 16]) { const g = new THREE.BoxGeometry(0.11, Math.abs(x) < 1.1 ? 1.12 : 0.98, 0.11); g.translate(x, -0.37 + (Math.abs(x) < 1.1 ? 0.56 : 0.49), FZ2 - 0.02); fence.push(flat(g)); }
    run(0.06, 0.86, 0, 1.3, -1.05, FZ2); run(-0.86, -0.06, 0, -1.3, 1.05, FZ2);
    merged(fence, white);
    // the mailbox, by the gate
    const mb = new THREE.Group(); mb.position.set(1.65, -0.37, FZ2 + 0.35); house.add(mb);
    mb.add(at(new THREE.Mesh(new THREE.BoxGeometry(0.07, 1.0, 0.07), white), 0, 0.5, 0));
    const boxM = mat(0xb3261e, 0.45, 0.1, 0.6);
    mb.add(at(rbox(0.22, 0.2, 0.42, 0.03, boxM), 0, 1.08, 0));
    const roof = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.11, 0.42, 20, 1, false, 0, Math.PI), boxM); roof.rotation.x = Math.PI / 2; roof.rotation.z = -Math.PI / 2; roof.position.set(0, 1.18, 0); mb.add(roof);
    const flag = rbox(0.015, 0.16, 0.05, 0.005, mat(0xffd23f, 0.5)); flag.position.set(-0.12, 1.2, 0.1); mb.add(flag);
    const nameTag = new THREE.Mesh(new THREE.PlaneGeometry(0.36, 0.09), new THREE.MeshBasicMaterial({ map: canvasTex(360, 90, (g, w, h) => { g.fillStyle = '#b3261e'; g.fillRect(0, 0, w, h); g.fillStyle = '#fff6e6'; g.font = '700 62px Anton, Impact, sans-serif'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText('LAKSHYA', w / 2, h / 2 + 3); }) }));
    nameTag.rotation.y = -Math.PI / 2; nameTag.position.set(-0.112, 1.07, 0); mb.add(nameTag);
    // flowers: in front of the hedges, and edging the path
    const spots2 = [];
    [[-7.6, -1.6], [1.6, 7.6]].forEach(([x0, x1]) => { for (let x = x0; x < x1; x += 0.1) spots2.push([x + rnd() * 0.08, HZ + 1.45 + rnd() * 0.32]); });
    for (let z = HZ + 2.7; z < HZ + 10.4; z += 0.14) [-1.18, 1.18].forEach((x) => { if (rnd() < 0.85) spots2.push([x + (rnd() - 0.5) * 0.14, z]); });
    const petals = [0xf25f7a, 0xffffff, 0xffd23f, 0xe94b3c, 0xb98cff, 0xff9f5a].map((c) => new THREE.Color(c).convertSRGBToLinear());
    const blooms = new THREE.InstancedMesh(new THREE.IcosahedronGeometry(0.045, 0), new THREE.MeshStandardMaterial({ roughness: 0.6, envMapIntensity: 0.7 }), spots2.length);
    const leaves = new THREE.InstancedMesh(new THREE.IcosahedronGeometry(0.07, 0), new THREE.MeshStandardMaterial({ color: 0x3f6f2e, roughness: 0.8, envMapIntensity: 0.5 }), spots2.length);
    const m4 = new THREE.Matrix4(), q4 = new THREE.Quaternion(), s4 = new THREE.Vector3(), p4 = new THREE.Vector3(), up = new THREE.Vector3(0, 1, 0);
    spots2.forEach(([x, z], i) => {
      blooms.setMatrixAt(i, m4.compose(p4.set(x, -0.37 + 0.13 + rnd() * 0.15, z), q4.setFromAxisAngle(up, rnd() * 6), s4.set(1, 0.75, 1)));
      blooms.setColorAt(i, petals[Math.floor(rnd() * petals.length)]);
      leaves.setMatrixAt(i, m4.compose(p4.set(x + (rnd() - 0.5) * 0.05, -0.37 + 0.05, z), q4.setFromAxisAngle(up, rnd() * 6), s4.set(1.2, 0.6, 1.2)));
    });
    [blooms, leaves].forEach((m) => { m.frustumCulled = false; m.userData.keep = true; house.add(m); });
  }
  // sunlight, sky light, and the photographed sky itself
  const sun = new THREE.DirectionalLight(0xffdcb4, 2.6); sun.position.set(-22, 12, 24); sun.target.position.set(0, 2, 4); sun.castShadow = true; sun.shadow.mapSize.setScalar(W < 768 ? 1024 : 2048); Object.assign(sun.shadow.camera, { left: -26, right: 26, top: 24, bottom: -12, near: 1, far: 100 }); sun.shadow.bias = -0.0004; sun.shadow.autoUpdate = false; sun.shadow.camera.updateProjectionMatrix(); scene.add(sun); scene.add(sun.target);
  // (outside, the hemisphere light is the open sky over the lawn)
  const skyCol = new THREE.Color(0xcfe3ff), lawnCol = new THREE.Color(0x5a6b3a);
  let hdrEnv = null, skyMesh = null;
  // The photographed sky is what things outside reflect; inside, everything takes the room's own light (scene.environment).
  const applyEnv = () => {
    if (!hdrEnv) return;
    const set = (o) => { if (o.isMesh) [].concat(o.material).forEach((m) => { if (m && 'envMap' in m && !m.envMap) { m.envMap = hdrEnv; m.needsUpdate = true; } }); };
    house.traverse(set);
    room.children.forEach((c) => { if (c.userData.outdoor) c.traverse(set); });
  };
  scene.background = new THREE.Color(0xa9c4e0);
  // The photographed sky (a light WebP instead of the 5 MB HDR): the backdrop, and the reflections on everything.
  image(AS + 'sky.webp').then((img) => {
    if (!img) return;
    const tx = new THREE.Texture(img); tx.encoding = THREE.sRGBEncoding; tx.mapping = THREE.EquirectangularReflectionMapping; tx.needsUpdate = true;
    const pm = new THREE.PMREMGenerator(renderer); hdrEnv = pm.fromEquirectangular(tx).texture; pm.dispose(); applyEnv();
    const sky = new THREE.Mesh(new THREE.SphereGeometry(150, 48, 24), new THREE.MeshBasicMaterial({ map: tx, color: 0xfff1e4, side: THREE.BackSide, depthWrite: false, toneMapped: false, fog: false })); sky.rotation.y = -0.9; sky.userData.keep = true; scene.add(sky); skyMesh = sky;
  });
  door.userData.spot = 'door'; knob.userData.spot = 'door'; plate.userData.spot = 'door'; doorGlass.userData.spot = 'door';
  // (more than the door itself answers a finger: an invisible patch round it, about 52 x 71 px on a phone)
  const doorHit = new THREE.Mesh(new THREE.PlaneGeometry(2.2, 3.0), new THREE.MeshBasicMaterial({ visible: false })); doorHit.position.set(0, 1.2, HZ + 0.45); doorHit.userData.spot = 'door'; doorHit.userData.keep = true; house.add(doorHit);
  add(shut(rbox(11.6, 0.2, 9.2, 0.03, mat(0xf2efe8, 0.95, 0, 0.2))), 2.0, 4.05, 1.5);
  // timber beams across the ceiling, so the loft has some structure overhead
  { const beamM = pbr('oak_veneer_01', 8, 0.4, { color: 0xa98466 }); [-0.6, 1.8, 4.2].forEach((z) => add(shut(rbox(11.15, 0.22, 0.17, 0.02, beamM)), 2.0, 3.84, z)); }
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
  const curtainMat = mat(0xe3dccd, 1, 0, 0.1, { side: THREE.DoubleSide });
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
  // (a little left of the desk's centre, clear of the contact wall)
  add(neonGlow, 0.85, 3.25, -2.77);
  const neon = new THREE.Mesh(new THREE.PlaneGeometry(3.2, 0.75), new THREE.MeshBasicMaterial({ map: neonTex, transparent: true, toneMapped: false }));
  add(neon, 0.85, 3.25, -2.76);

  // ---- the quote, framed in gold
  const quote = new THREE.Mesh(new THREE.BoxGeometry(1.05, 1.05, 0.05), [0, 0, 0, 0, 1, 0].map((f) => f ? mat(0xffffff, 0.6, 0, 0.2, { map: canvasTex(600, 600, (g, w, h) => { g.fillStyle = '#0b0b0b'; g.fillRect(0, 0, w, h); g.textAlign = 'center'; g.font = '700 84px "Times New Roman", serif'; [['Code and', '#fff'], ['Grind,', '#fff'], ['Lead', '#B99314'], ['the Mind', '#B99314']].forEach(([t, c], i) => { g.fillStyle = c; g.fillText(t, w / 2, 150 + i * 105); }); }) }) : mat(0xb99314, 0.25, 0.9, 1)));
  // (on the right wall, by the bed: the back wall beside the window is the contact wall)
  quote.castShadow = true; add(quote, 7.475, 2.42, -1.55); quote.rotation.y = -Math.PI / 2;

  // ---- fairy lights along the top of the back wall
  const fairy = [];
  const fairyCols = [0xffd27a, 0xfff0c8, 0xffb566].map((c) => new THREE.Color(c));
  const bulbMats = fairyCols.map((c) => new THREE.MeshBasicMaterial({ color: c, toneMapped: false }));
  const bulbGeo = new THREE.SphereGeometry(0.025, 10, 8);
  const fp = [];
  for (let i = 0; i <= 26; i++) {
    const t = i / 26; const x = lerp(-3.4, 3.4, t); const y = 3.78 - Math.sin(t * Math.PI * 3) ** 2 * 0.18;
    add(new THREE.Mesh(bulbGeo, bulbMats[i % 3]), x, y, -2.72);
    fp.push(x, y, -2.7); fairy.push({ c: fairyCols[i % 3], ph: Math.random() * 6 });
  }
  const fairyGeo = new THREE.BufferGeometry(); fairyGeo.setAttribute('position', new THREE.Float32BufferAttribute(fp, 3)); fairyGeo.setAttribute('color', new THREE.Float32BufferAttribute(new Float32Array(fp.length), 3));
  const fairyGlow = new THREE.Points(fairyGeo, new THREE.PointsMaterial({ size: 0.32, map: glowTexture(), vertexColors: true, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, toneMapped: false }));
  room.add(fairyGlow);
  const wire = new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(Array.from({ length: 40 }, (_, i) => { const t = i / 39; return new THREE.Vector3(lerp(-3.4, 3.4, t), 3.8 - Math.sin(t * Math.PI * 3) ** 2 * 0.18, -2.73); })), 120, 0.006, 5), mat(0x0a0a0a, 0.5)); room.add(wire);

  // ---- the desk
  const wood = mat(0x6e4a2e, 0.45, 0, 0.5, {});
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
    return { x: lastX + 6, y: lastY - 26 };
  };
  const caret = drawCode(false);
  add(rbox(1.36, 0.82, 0.06, 0.03, mat(0x121214, 0.3, 0.4, 0.8)), 1.1, 1.75, -2.44);
  const screen = new THREE.Mesh(new THREE.PlaneGeometry(1.28, 0.76), new THREE.MeshBasicMaterial({ map: codeTex, toneMapped: false })); add(screen, 1.1, 1.75, -2.405);
  // (the drawing is 1280 x 760 on a 1.28 x 0.76 m screen: a pixel is a millimetre)
  const cursor = new THREE.Mesh(new THREE.PlaneGeometry(0.016, 0.032), new THREE.MeshBasicMaterial({ color: 0xe6e6e6, toneMapped: false }));
  cursor.position.set(caret.x / 1000 - 0.64 + 0.008, 0.38 - caret.y / 1000 - 0.016, 0.001); screen.add(cursor);
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
      row(80, 'NTT DATA', 'Summer Intern · 2026', '#c2643f'); row(165, 'IEEE-TEMS', 'Secretary · Jan 2026 – Present', '#7c8f78'); row(250, 'VinnovateIT', 'Project Manager', '#9bbf6a'); row(335, 'Havells India Limited', 'Summer Intern · May – Jul 2025', '#e2b04a');
    }) })); scr.position.set(0, 0.27, 0.011); lid.add(scr); }
  // Desk lamp.
  const lampMat = mat(0x1c1c1e, 0.45, 0.5, 0.6, {});
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
  const shelfMat = mat(0x3b2a1e, 0.6, 0, 0.4, {});
  const shelf = new THREE.Group(); add(shelf, -3.25, 0, -0.6);
  [[-0.9], [0.9]].forEach(([z]) => shelf.add(at(rbox(0.42, 2.7, 0.05, 0.02, shelfMat), 0, 1.35, z)));
  [0.05, 0.72, 1.4, 2.05, 2.68].forEach((y) => shelf.add(at(rbox(0.42, 0.04, 1.84, 0.015, shelfMat), 0, y, 0)));
  const bookCols = [0x8c3b2f, 0x2f4f6f, 0xc9b38a, 0x3e5c45, 0x6b4f3a, 0xd8d0c0, 0x1f2a36, 0x9a6b3c, 0x7a7f86];
  // spines: a band top and bottom and a paler label with its title, so they read as books rather than blocks
  const spine = canvasTex(64, 256, (g, w, h) => {
    g.fillStyle = '#ffffff'; g.fillRect(0, 0, w, h);
    g.fillStyle = 'rgba(0,0,0,0.3)'; g.fillRect(0, 16, w, 8); g.fillRect(0, h - 24, w, 8);
    g.fillStyle = 'rgba(255,246,226,0.6)'; g.fillRect(9, 64, w - 18, 70);
    g.fillStyle = 'rgba(0,0,0,0.4)'; for (let i = 0; i < 4; i++) g.fillRect(16, 76 + i * 13, w - 32 - (i % 2) * 10, 4);
  });
  const bookMats = bookCols.map((c) => new THREE.MeshStandardMaterial({ color: c, map: spine, roughness: 0.6, envMapIntensity: 0.3 }));
  // books on three boards (the records live in the crate by the sofa now)
  [0.07, 0.74, 1.42].forEach((y, row) => { let z = -0.85; let k = row * 5; while (z < 0.8) { const bw = 0.05 + Math.random() * 0.05, bh = 0.4 + Math.random() * 0.2; const b = rbox(0.3, bh, bw, 0.01, bookMats[k++ % bookMats.length]); b.position.set(0, y + bh / 2, z + bw / 2); if (Math.random() < 0.12) b.rotation.x = 0.25; shelf.add(b); z += bw + 0.008; if (row === 1 && z > 0.1) break; } });
  // The 1st-prize trophy.
  const gold = mat(0xd4af37, 0.18, 1, 1.2);
  const cup = new THREE.Mesh(new THREE.LatheGeometry([[0, 0], [0.12, 0], [0.12, 0.03], [0.04, 0.05], [0.03, 0.16], [0.1, 0.22], [0.14, 0.38], [0.13, 0.4]].map(([x, y]) => new THREE.Vector2(x, y)), 32), gold);
  cup.castShadow = true; cup.position.set(0, 0.76, 0.55); shelf.add(cup);
  // Next to the trophy: a certificate and a medal.
  const cert = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.24, 0.19), [mat(0xffffff, 0.7, 0, 0.2, { map: canvasTex(240, 300, (g, w, h) => { g.fillStyle = '#F6EFDD'; g.fillRect(0, 0, w, h); g.strokeStyle = '#B99314'; g.lineWidth = 10; g.strokeRect(12, 12, w - 24, h - 24); g.fillStyle = '#111'; g.textAlign = 'center'; g.font = '700 30px "Times New Roman", serif'; g.fillText('CERTIFICATE', w / 2, 90); g.font = '22px "Times New Roman", serif'; g.fillText('of achievement', w / 2, 124); g.fillStyle = '#FA1A1D'; g.beginPath(); g.arc(w / 2, 210, 30, 0, Math.PI * 2); g.fill(); }) }), mat(0x111111, 0.5), mat(0x111111, 0.5), mat(0x111111, 0.5), mat(0x111111, 0.5), mat(0x111111, 0.5)]);
  cert.position.set(-0.05, 0.86, 0.27); cert.rotation.z = 0.12; cert.castShadow = true; shelf.add(cert);
  const medal = new THREE.Group(); medal.position.set(0.02, 0.83, 0.8); medal.rotation.set(0, Math.PI / 2, 0); shelf.add(medal);
  const mDisc = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.012, 32), gold); mDisc.rotation.x = Math.PI / 2; mDisc.castShadow = true; medal.add(mDisc);
  [-0.025, 0.025].forEach((x, k) => { const rb = new THREE.Mesh(new THREE.BoxGeometry(0.035, 0.16, 0.004), mat(C(k ? 0x2849cb : 0xfa1a1d), 0.6)); rb.position.set(x, 0.1, -0.004); rb.rotation.z = k ? -0.25 : 0.25; medal.add(rb); });
  // A plant on top.
  const pot = new THREE.Mesh(new THREE.CylinderGeometry(0.13, 0.1, 0.22, 24), mat(0xe8e2d5, 0.6)); pot.position.set(0, 2.81, 0.4); pot.castShadow = true; shelf.add(pot);
  const potLeaves = [];
  for (let i = 0; i < 9; i++) { const leaf = new THREE.Mesh(new THREE.SphereGeometry(0.1, 12, 8), mat(0x2e7d32, 0.6)); leaf.scale.set(0.35, 1.3, 0.12); const a = i / 9 * Math.PI * 2; leaf.position.set(Math.cos(a) * 0.08, 3.05 + (i % 3) * 0.05, 0.4 + Math.sin(a) * 0.08); leaf.rotation.set(Math.sin(a) * 0.6, 0, -Math.cos(a) * 0.6); leaf.castShadow = true; shelf.add(leaf); potLeaves.push(leaf); }

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
  // He's the one you look at first: a little more of the room's light on him than on the furniture, and a touch of warmth
  // in his skin, so he reads clearly whether he's lit by the window, the desk lamp or nothing much at night.
  skin.envMapIntensity = 1.1; skin.emissive.copy(skin.color).multiplyScalar(0.2);
  [hairM, shirt, pants, shoeM].forEach((m) => { m.envMapIntensity = 1.0; });
  shirt.emissive.setRGB(0.05, 0.06, 0.08);

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
  // (an oiled, satin finish: the scan's own roughness reads as a wet gloss under a low sun)
  floorTop.roughnessMap = null; floorTop.roughness = 0.62; floorTop.envMapIntensity = 0.45;
  reskin(wallMat, pbr('painted_plaster_wall', 4, 2), 0xf4efe6); wallMat.map = null; wallMat.needsUpdate = true;
  reskin(wood, pbr('oak_veneer_01', 2, 1), 0xffffff);
  reskin(shelfMat, pbr('walnut_veneer', 1, 2), 0xffffff);
  rug.geometry.dispose(); rug.geometry = new THREE.BoxGeometry(3.0, 0.02, 2.1); rug.material = pbr('wool_boucle', 1.4, 1, { color: 0xcdbfa6 }); rug.position.set(-0.4, 0.01, 1.0);
  bean.visible = false; dent.visible = false; poster.visible = false; bigPot.visible = false; pot.visible = false; potLeaves.forEach((l) => { l.visible = false; });
  room.children.forEach((c) => { if (c.position.x === 3.485 && c.position.y === 2.3) c.visible = false; });
  // Loads a model and sizes it to a height, standing on (or hanging from) a point.
  const putModel = (name, h, x, y, z, ry = 0, hang = false) => model(name).then((o) => {
    if (!o) return; prepModel(o);
    o.rotation.y = ry; let b = new THREE.Box3().setFromObject(o); o.scale.setScalar(h / Math.max(0.001, b.max.y - b.min.y));
    b = new THREE.Box3().setFromObject(o); const c = b.getCenter(new THREE.Vector3());
    o.position.set(x - c.x, hang ? y - b.max.y : y - b.min.y, z - c.z); room.add(o); applyEnv(); shadowDirty = true;
    return o;
  });
  putModel('mid_century_lounge_chair', 0.85, -1.0, 0.02, 1.15, 0.55);
  putModel('Ottoman_01', 0.42, -0.1, 0.02, 1.75, 0.3);
  putModel('throw_pillows_01', 0.3, -1.05, 0.42, 1.12, 0.55);
  putModel('side_table_01', 0.55, -1.95, 0.0, 1.6, 0);
  putModel('potted_plant_04', 0.35, -1.95, 0.55, 1.6, 0);
  // the tall plant stands in the front corner, out of the way of the contact wall; the top of the bookshelf stays clear under the achievement cards
  putModel('potted_plant_01', 1.5, -3.05, 0.0, 3.1, 0);
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
  const backLawn = new THREE.Mesh(new THREE.PlaneGeometry(60, 40), pbr('leafy_grass', 22, 15, { color: 0x86b25a })); backLawn.rotation.x = -Math.PI / 2; backLawn.position.set(0, -0.36, -23); backLawn.userData.outdoor = true; room.add(backLawn);
  [[-2.6, -6.5, 5.5], [-0.6, -8.5, 6.5], [-4.6, -9.5, 7], [1.8, -10, 6]].forEach(([x, z, sc]) => putModel('shrub_01', sc * 0.35, x, -0.36, z, x).then((o) => { if (!o) return; o.traverse((m) => { m.castShadow = false; }); o.userData.outdoor = true; applyEnv(); }));

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
  // Fabrics, drawn: a quilted linen duvet (soft diamond stitching), a chunky knit throw, a bouclé headboard.
  const cloth = (base, draw, rep) => { seed = 31; const t2 = canvasTex(256, 256, (g, w, h) => { g.fillStyle = base; g.fillRect(0, 0, w, h); for (let i = 0; i < 2500; i++) { g.fillStyle = 'rgba(' + (rnd() < 0.5 ? '0,0,0' : '255,255,255') + ',' + (0.02 + rnd() * 0.04) + ')'; g.fillRect(rnd() * w, rnd() * h, 1 + rnd() * 2, 1); } draw(g, w, h); }); t2.wrapS = t2.wrapT = THREE.RepeatWrapping; t2.repeat.set(rep, rep); return t2; };
  const quilt = cloth('#f3eee5', (g, w, h) => { g.strokeStyle = 'rgba(120,100,80,0.22)'; g.lineWidth = 2; for (let k = -w; k < w * 2; k += 64) { g.beginPath(); g.moveTo(k, 0); g.lineTo(k + h, h); g.stroke(); g.beginPath(); g.moveTo(k + h, 0); g.lineTo(k, h); g.stroke(); } }, 3);
  const knit = cloth('#c98f3a', (g, w, h) => { for (let y = 0; y < h; y += 16) for (let x = 0; x < w; x += 16) { g.strokeStyle = 'rgba(70,40,10,0.35)'; g.lineWidth = 3; g.beginPath(); g.moveTo(x + 2, y + 2); g.lineTo(x + 8, y + 14); g.lineTo(x + 14, y + 2); g.stroke(); } }, 4);
  const boucle = cloth('#8c7b66', (g, w, h) => { for (let i = 0; i < 1800; i++) { g.fillStyle = 'rgba(255,240,220,' + (0.04 + rnd() * 0.06) + ')'; g.beginPath(); g.arc(rnd() * w, rnd() * h, 1.5 + rnd() * 2, 0, 7); g.fill(); } }, 2);
  const walnutM = pbr('walnut_veneer', 1, 1), linenM = mat(0xffffff, 0.95, 0, 0.25, { map: quilt, bumpMap: quilt, bumpScale: 0.004 }), headM = mat(0xffffff, 0.95, 0, 0.2, { map: boucle, bumpMap: boucle, bumpScale: 0.006 });
  const bedP = (m) => { m.castShadow = true; m.receiveShadow = true; room.add(m); return m; };
  bedP(at(rbox(2.85, 0.36, 2.35, 0.03, walnutM), 6.15, 0.2, 0));
  bedP(at(rbox(0.16, 1.55, 2.6, 0.06, headM), 7.48, 0.95, 0));
  bedP(at(rbox(2.7, 0.3, 2.2, 0.1, mat(0xf7f5f0, 0.9)), 6.12, 0.53, 0));
  bedP(at(rbox(2.2, 0.17, 2.36, 0.08, linenM), 5.62, 0.72, 0));
  bedP(at(rbox(0.12, 0.3, 2.36, 0.05, linenM), 4.56, 0.6, 0));
  bedP(at(rbox(0.55, 0.05, 2.42, 0.02, mat(0xffffff, 0.95, 0, 0.2, { map: knit, bumpMap: knit, bumpScale: 0.01 })), 5.0, 0.82, 0));
  bedP(at(rbox(0.06, 0.34, 2.42, 0.02, mat(0xffffff, 0.95, 0, 0.2, { map: knit, bumpMap: knit, bumpScale: 0.01 })), 4.71, 0.66, 0));
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
    // (the table is the record player's: the turntable and the cover on its stand)
    putModel('potted_plant_02', 1.1, 5.4, 0, 5.3, 0.4); }

  // ---- soft contact shadows: a blurred dark oval under each piece of furniture, and shade along the foot of every wall and
  // up under the ceiling, where light doesn't reach. They're what make things sit on the floor instead of hovering over
  // it, the look of baked lighting for two draws in all.
  {
    const blob = canvasTex(128, 128, (g, w, h) => { const gr = g.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, w / 2); gr.addColorStop(0, 'rgba(0,0,0,0.6)'); gr.addColorStop(0.45, 'rgba(0,0,0,0.38)'); gr.addColorStop(1, 'rgba(0,0,0,0)'); g.fillStyle = gr; g.fillRect(0, 0, w, h); });
    const blobMat = new THREE.MeshBasicMaterial({ map: blob, transparent: true, depthWrite: false, toneMapped: false, polygonOffset: true, polygonOffsetFactor: -4 });
    // (on the rugs a little higher than on the bare boards)
    const under = (x, z, w, d, ry = 0, y = 0.026) => { const m = new THREE.Mesh(new THREE.PlaneGeometry(w, d), blobMat); m.rotation.set(-Math.PI / 2, 0, ry); m.position.set(x, y, z); room.add(m); };
    under(2.3, 2.2, 1.35, 2.7); under(3.75, 2.2, 1.15, 1.95); under(3.86, 3.22, 0.62, 0.55); // sofa, coffee table, record crate
    under(-1.0, 1.15, 1.05, 1.05, 0.55); under(-0.1, 1.75, 0.75, 0.65, 0.3); under(-1.95, 1.6, 0.62, 0.62); under(-2.6, 1.9, 0.55, 0.55); // lounge chair, ottoman, side table, floor lamp
    under(1.15, -0.85, 0.95, 0.95, 0, 0.004); under(1.05, -2.12, 3.3, 1.5, 0, 0.004); under(-3.2, -0.6, 0.75, 2.2, 0, 0.004); // desk chair, desk, bookshelf
    under(6.15, 0, 3.4, 2.9, 0, 0.004); under(7.15, 1.75, 0.75, 0.75, 0, 0.004); under(7.15, -1.75, 0.75, 0.75, 0, 0.004); under(7.15, 3.9, 1.1, 3.4, 0, 0.004); // bed, nightstands, wardrobe
    under(-3.05, 3.1, 0.75, 0.75, 0, 0.004); under(5.4, 5.3, 0.8, 0.8, 0, 0.004); // the tall plants
    const fade = canvasTex(8, 128, (g, w, h) => { const gr = g.createLinearGradient(0, 0, 0, h); gr.addColorStop(0, 'rgba(0,0,0,0)'); gr.addColorStop(1, 'rgba(0,0,0,0.4)'); g.fillStyle = gr; g.fillRect(0, 0, w, h); });
    const fadeMat = new THREE.MeshBasicMaterial({ map: fade, transparent: true, depthWrite: false, toneMapped: false, polygonOffset: true, polygonOffsetFactor: -4 });
    // A strip up the foot of a wall and across the floor in front of it (dark into the corner), and one down from the ceiling.
    // `ry` turns a strip to face into the room from its wall: 0 for the back wall, π/2 the left, -π/2 the right, π the front.
    const flipV = (g) => { const uv = g.attributes.uv; for (let i = 0; i < uv.count; i++) uv.setY(i, 1 - uv.getY(i)); return g; };
    const wallFoot = (x, z, len, ry) => {
      const nx = Math.sin(ry), nz = Math.cos(ry);
      const up = new THREE.Mesh(new THREE.PlaneGeometry(len, 0.42), fadeMat); up.rotation.y = ry; up.position.set(x, 0.21, z); room.add(up);
      const top = new THREE.Mesh(flipV(new THREE.PlaneGeometry(len, 0.3)), fadeMat); top.rotation.y = ry; top.position.set(x, 3.8, z); room.add(top);
      const fl = new THREE.Mesh(flipV(new THREE.PlaneGeometry(len, 0.55)), fadeMat); fl.rotation.order = 'YXZ'; fl.rotation.set(-Math.PI / 2, ry, 0); fl.position.set(x + nx * 0.275, 0.004, z + nz * 0.275); room.add(fl);
    };
    wallFoot(2.0, -2.75, 11.0, 0); wallFoot(-3.45, 1.55, 8.7, Math.PI / 2); wallFoot(7.45, 1.55, 8.7, -Math.PI / 2);
    wallFoot(-2.02, 5.89, 2.95, Math.PI); wallFoot(4.02, 5.89, 6.95, Math.PI); // (either side of the front door)
  }

  // ---- a ginger cat asleep on the sofa: curled up nose to tail, breathing, an ear flicking now and then, dreaming in Zs.
  // Point at it and it lifts its head and opens its eyes; click and it purrs.
  // (lying across the seat, its face turned towards the room)
  const cat = new THREE.Group(); cat.position.set(2.36, 0.43, 2.62); cat.rotation.y = -0.3; cat.scale.setScalar(1.15); cat.userData.keep = true; room.add(cat);
  seed = 91;
  const catFurTex = canvasTex(256, 128, (g, w, h) => {
    g.fillStyle = '#e39a4a'; g.fillRect(0, 0, w, h);
    for (let x = 6; x < w; x += 18 + rnd() * 8) { g.fillStyle = 'rgba(160,78,24,0.55)'; g.beginPath(); g.ellipse(x, h * 0.45, 4 + rnd() * 3, h * 0.36, (rnd() - 0.5) * 0.3, 0, 7); g.fill(); }
    g.fillStyle = 'rgba(255,236,206,0.55)'; g.fillRect(0, h * 0.82, w, h * 0.18);
    for (let i = 0; i < 2500; i++) { g.fillStyle = 'rgba(' + (rnd() < 0.5 ? '255,226,186' : '110,52,16') + ',0.08)'; g.fillRect(rnd() * w, rnd() * h, 1, 3); }
  });
  const catFur = mat(0xffffff, 0.92, 0, 0.6, { map: catFurTex }), catCream = mat(0xf6e7d2, 0.9, 0, 0.5, {}), catPink = mat(0xe89aa0, 0.6, 0, 0.4, {}), catInk = mat(0x1a1410, 0.4, 0, 0.5, {});
  const catBody = new THREE.Mesh(new THREE.SphereGeometry(1, 24, 16), catFur); catBody.scale.set(0.2, 0.1, 0.15); catBody.position.y = 0.095; cat.add(catBody);
  const catHead = new THREE.Group(); catHead.position.set(0.17, 0.1, 0.045); catHead.scale.setScalar(1.18); cat.add(catHead);
  const catSkull = new THREE.Mesh(new THREE.SphereGeometry(0.072, 22, 16), catFur); catSkull.scale.set(1, 0.9, 1.06); catHead.add(catSkull);
  const catMuzzle = new THREE.Mesh(new THREE.SphereGeometry(0.034, 14, 10), catCream); catMuzzle.position.set(0.055, -0.02, 0); catMuzzle.scale.set(0.75, 0.7, 1.2); catHead.add(catMuzzle);
  const catNose = new THREE.Mesh(new THREE.SphereGeometry(0.009, 10, 8), catPink); catNose.position.set(0.081, -0.006, 0); catHead.add(catNose);
  const catEars = [-1, 1].map((sd) => {
    const e = new THREE.Group(); e.position.set(-0.005, 0.05, sd * 0.04); e.rotation.x = sd * -0.35; catHead.add(e);
    const outer = new THREE.Mesh(new THREE.ConeGeometry(0.03, 0.068, 4), catFur); outer.position.y = 0.028; outer.rotation.y = Math.PI / 4; e.add(outer);
    const inner = new THREE.Mesh(new THREE.ConeGeometry(0.018, 0.05, 4), catPink); inner.position.set(0.009, 0.022, 0); inner.rotation.y = Math.PI / 4; e.add(inner);
    return e;
  });
  // eyes: shut in contented arcs while it sleeps, open (green, slit pupils) when it wakes
  const catShut = [-1, 1].map((sd) => { const a = new THREE.Mesh(new THREE.TorusGeometry(0.014, 0.0032, 6, 12, Math.PI), catInk); a.position.set(0.064, 0.014, sd * 0.027); a.rotation.set(0, Math.PI / 2, Math.PI); catHead.add(a); return a; });
  const catOpen = [-1, 1].map((sd) => {
    const e = new THREE.Group(); e.position.set(0.062, 0.012, sd * 0.026); e.visible = false; catHead.add(e);
    const iris = new THREE.Mesh(new THREE.SphereGeometry(0.012, 12, 10), mat(0x8fbf3a, 0.2, 0, 0.8, {})); iris.scale.x = 0.5; e.add(iris);
    const pupil = new THREE.Mesh(new THREE.SphereGeometry(0.0125, 10, 8), catInk); pupil.scale.set(0.55, 1, 0.3); pupil.position.x = 0.003; e.add(pupil);
    return e;
  });
  // front paws tucked under the chin, the tail wrapped round
  [-1, 1].forEach((sd) => { const paw = new THREE.Mesh(new THREE.SphereGeometry(0.026, 12, 8), catCream); paw.scale.set(1.5, 0.7, 1); paw.position.set(0.2, 0.02, sd * 0.035 + 0.04); cat.add(paw); });
  cat.add(new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3([new THREE.Vector3(-0.19, 0.05, 0), new THREE.Vector3(-0.17, 0.035, 0.12), new THREE.Vector3(-0.02, 0.03, 0.17), new THREE.Vector3(0.12, 0.03, 0.15), new THREE.Vector3(0.2, 0.035, 0.1)]), 24, 0.024, 8), catFur));
  // Zs while it sleeps, a heart when it's petted
  const zTex = canvasTex(64, 64, (g, w, h) => { g.fillStyle = '#fff6e6'; g.font = '700 50px Anton, Impact, sans-serif'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText('z', w / 2, h / 2); });
  const catZs = [0, 1, 2].map((i) => { const sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: zTex, transparent: true, depthWrite: false, opacity: 0 })); cat.add(sp); return { sp, ph: i / 3 }; });
  const catHeart = new THREE.Sprite(new THREE.SpriteMaterial({ map: canvasTex(64, 64, (g, w, h) => { g.fillStyle = '#ff5a7a'; g.beginPath(); g.moveTo(w / 2, h * 0.85); g.bezierCurveTo(w * 0.05, h * 0.55, w * 0.15, h * 0.12, w / 2, h * 0.32); g.bezierCurveTo(w * 0.85, h * 0.12, w * 0.95, h * 0.55, w / 2, h * 0.85); g.fill(); }), transparent: true, depthWrite: false, opacity: 0 }));
  catHeart.scale.setScalar(0.08); cat.add(catHeart);
  cat.traverse((o) => { if (o.isMesh) { o.castShadow = true; o.userData.spot = 'cat'; } });
  let catAwake = 0, catPetAt = -10, catEarAt = 3, catEarSide = 0, catEarFlick = -10;

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
  // a purr: low rumbling noise pulsing about 24 times a second, swelling and fading over a couple of seconds
  const purr = () => {
    AC = live(); const out = output(); if (!AC || !out || AC.state !== 'running') return;
    const dur = 2.4, n = Math.floor(AC.sampleRate * dur), buf = AC.createBuffer(1, n, AC.sampleRate), d = buf.getChannelData(0);
    for (let i = 0; i < n; i++) { const tt = i / AC.sampleRate; d[i] = (Math.random() * 2 - 1) * (0.5 + 0.5 * Math.sin(tt * Math.PI * 2 * 24)) * Math.min(1, tt / 0.35) * Math.min(1, (dur - tt) / 0.7); }
    const src = AC.createBufferSource(); src.buffer = buf;
    const lp = AC.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 300;
    const gn = AC.createGain(); gn.gain.value = 1.4;
    src.connect(lp); lp.connect(gn); gn.connect(out); src.start();
  };
  self.sfx = { tick: () => noise(0.05, 2600, 2200, 4, 0.35), whoosh: () => { wake(); noise(0.5, 350, 2600, 0.9, 0.5); }, knock: () => { noise(0.07, 380, 160, 1.4, 0.9); setTimeout(() => noise(0.07, 360, 150, 1.4, 0.9), 170); }, purr };

  // ---- the site's own sections, built into the room: the achievement cards on the wall above the bookshelf, the
  // experience film strip on the monitor, and the contact wall (flyer, crossword, coupon) beside the bedroom window.
  const walls = {
    achievements: buildAchievementsWall(THREE, { parent: room, maxAniso }),
    experience: buildExperienceReel(THREE, { screen, codeTex, maxAniso, onChange: (i) => self.onReel && self.onReel(i) }),
    contact: buildContactWall(THREE, { parent: room, maxAniso, onToast: (s) => self.onToast && self.onToast(s), onCoupon: () => self.onCoupon && self.onCoupon(), onTagClick: () => self.onTagClick && self.onTagClick() }),
    // and the record player in the lounge: the crate on the rug, the turntable and the cover on the coffee table
    projects: buildRecordPlayer(THREE, {
      parent: room, maxAniso,
      onChange: (s) => self.onRecord && self.onRecord(s),
      // a record picked from the crate on a phone: the camera follows it back to the turntable
      onFollow: (i) => { self._stop = i; self.onStop && self.onStop(i); },
    }),
  };
  self.walls = walls;
  const wallList = Object.entries(walls);
  self.reelStep = (d) => walls.experience.step(d);
  // (changing records from the crate's own view on a phone, the camera follows the record over to the turntable)
  const fromCrate = () => W / H < 0.9 && (self._stop || 0) === 1;
  self.record = { step: (d) => walls.projects.step(d, fromCrate()), play: (i) => walls.projects.play(i, fromCrate()), toggle: () => walls.projects.toggle() };

  // ---- the hot spots: hover one and it glows warm (the label follows the cursor, drawn by the page)
  const SPOTS = {
    about: { anchor: new THREE.Vector3(0.15, 1.42, -1.75), meshes: [nb, pen] },
    projects: { anchor: new THREE.Vector3(3.78, 0.6, 2.3), meshes: walls.projects.glowMeshes },
    achievements: { anchor: new THREE.Vector3(-3.2, 3.2, -0.6), meshes: [cup, cert, ...medal.children] },
    experience: { anchor: new THREE.Vector3(1.1, 1.75, -2.3), meshes: [] },
    contact: { anchor: new THREE.Vector3(3.24, 2.6, -2.7), meshes: [] },
  };
  laptop.traverse((o) => { if (o.isMesh) SPOTS.experience.meshes.push(o); });
  const spotList = Object.entries(SPOTS);
  // Each spot gets its own copies of its materials, so its glow doesn't light up anything else that shares them.
  const GLOW = new THREE.Color(0xffc56b);
  Object.entries(SPOTS).forEach(([name, s]) => {
    const copies = new Map();
    const own = (m) => { if (!copies.has(m)) { const c = m.clone(); c.userData = {}; copies.set(m, c); } return copies.get(m); };
    s.meshes.forEach((m) => { m.userData.spot = name; if (m !== nb) m.material = Array.isArray(m.material) ? m.material.map(own) : own(m.material); });
    s.mats = [...copies.values(), ...(name === 'about' ? [nb.material] : [])].filter((m) => m.emissive);
    s.base = s.mats.map((m) => m.emissive.clone());
    s.h = 0;
  });
  meParts.forEach((m) => { m.userData.spot = 'me'; });
  chair.traverse((o) => { if (o.isMesh) o.userData.spot = 'chair'; });
  floor.userData.spot = 'floor'; rug.userData.spot = 'floor';
  [door, knob, plate, doorGlass].forEach((m) => { m.userData.keep = true; });
  // Things that move or change on their own stay separate meshes; everything else gets merged (see batch()).
  [me, doorPivot, cup, pen, glass, glass2, nb, nbFlat, screen, neon, neonGlow, bulb, mugG, clock].forEach((o) => { o.userData.keep = true; });
  // What the pointer can hit: rebuilt after the static meshes are merged.
  let pickables = [];
  const collectPickables = () => { pickables = []; scene.traverse((o) => { if (o.isMesh && o.userData.spot && o.visible) pickables.push(o); }); };
  // Where he walks to, marked with a ring on the floor.
  const ring = new THREE.Mesh(new THREE.RingGeometry(0.16, 0.2, 40), new THREE.MeshBasicMaterial({ color: 0xffd23f, transparent: true, opacity: 0, toneMapped: false, depthWrite: false }));
  // (sits a little above the lounge rug, so the two don't fight over the same depth)
  ring.rotation.x = -Math.PI / 2; ring.position.y = 0.03; ring.userData.keep = true; room.add(ring);
  // Furniture he can't walk through (x0, z0, x1, z1): bed, nightstands, wardrobe, sofa, coffee table, lounge chair, desk, shelf, record crate.
  const BLOCKS = [[-3.6, 2.6, -2.5, 3.6], [4.6, -2.2, 7.6, 2.2], [6.6, 2.3, 7.6, 5.5], [1.8, 1.1, 2.8, 3.3], [3.15, 1.7, 4.35, 2.7], [-1.5, 0.65, -0.45, 1.65], [-0.45, -2.9, 2.6, -1.5], [-3.6, -1.5, -2.9, 0.3], [3.6, 3.0, 4.1, 3.45]];
  const inBlock = (v) => BLOCKS.some(([a, b, c, d]) => v.x > a - 0.25 && v.x < c + 0.25 && v.z > b - 0.25 && v.z < d + 0.25);
  // A goal he can actually stand on: if it's inside furniture, stop where he is (keys) or at the nearest free edge (clicks).
  const freeSpot = (g, from) => { if (!inBlock(g)) return g; if (from) return inBlock(from) ? g : from.clone(); for (let r = 0.2; r < 3; r += 0.2) for (let a = 0; a < 6.28; a += 0.5) { const q = g.clone().add(new THREE.Vector3(Math.cos(a) * r, 0, Math.sin(a) * r)); if (!inBlock(q)) return q; } return g; };
  const seatAt = new THREE.Vector3(1.15, 0, -0.85), seatYaw = Math.PI + 0.5;
  const walker = { pos: seatAt.clone(), yaw: seatYaw, goal: null, sitK: 1, wantSit: true, phase: 0, speed: 0, sitting: true, hurry: false };
  // When you come to watch the reel on the monitor he gets up out of the way (quickly: the camera comes to where his head
  // is when he stands), and sits back down after.
  const asideSpot = new THREE.Vector3(2.75, 0, -0.95);
  let steppedAside = false;
  let hitPoint = null;

  // ---- where the camera goes for each
  const nbCenter = new THREE.Vector3(0.15, 1.098, -1.9);
  // The About page, open on the desk, looked at from straight above. On a wide screen the whole page; on a phone held
  // upright it's too wide to read whole, so first its words (big enough to read), then the photo. A point on the page
  // is given as fractions of its 1440 x 900 drawing, across and down.
  const onPage = (fx, fy) => new THREE.Vector3(nbCenter.x - NB_W / 2 + fx * NB_W, nbCenter.y, nbCenter.z - NB_H / 2 + fy * NB_H);
  const aboutPage = {
    stops(portrait, sel) {
      if (!portrait) return { c: onPage(0.5, 0.39), n: Y, w: NB_W * 1.02, h: NB_H * 1.32 };
      return [{ c: onPage(0.41, 0.39), n: Y, w: NB_W * 0.64, h: NB_H * 0.74 }, { c: onPage(0.816, 0.41), n: Y, w: NB_W * 0.34, h: NB_H * 0.62 }][Math.max(0, Math.min(1, sel))];
    },
    stopCount: (portrait) => (portrait ? 2 : 1),
    hover: () => false,
    click: () => {},
    update: () => {},
  };
  const VIEWS = {
    about: { wall: aboutPage, pos: new THREE.Vector3(), look: new THREE.Vector3(), up: new THREE.Vector3(0, 0, -1), off: 'world', fit: [1, 1.04], lift: [0, 0] },
    // These four are things in the room: the camera stands square in front of them, far enough back to take in the
    // whole thing (or, on a phone held upright, one piece at a time). Their position is worked out every frame.
    // `fit` is the breathing room around it and `lift` how far up the frame it sits (to clear the page's controls at
    // the bottom), each [wide screen, phone held upright]. (On a phone the page says where its bars are, `_safe`, and
    // that places it instead of `lift`; the pieces' own sizes there already have a little air round them.)
    projects: { wall: walls.projects, pos: new THREE.Vector3(), look: new THREE.Vector3(), up: Y, off: 'world', fit: [1.12, 1.06], lift: [0.09, 0.075] },
    achievements: { wall: walls.achievements, pos: new THREE.Vector3(), look: new THREE.Vector3(), up: Y, off: 'world', fit: [1.06, 1.04], lift: [0, -0.05] },
    experience: { wall: walls.experience, pos: new THREE.Vector3(), look: new THREE.Vector3(), up: Y, off: 'world', fit: [1.3, 1.03], lift: [0, 0.08] },
    contact: { wall: walls.contact, pos: new THREE.Vector3(), look: new THREE.Vector3(), up: Y, off: 'world', fit: [1.36, 1.04], lift: [0.15, 0.02] },
  };
  /** How many stops a section has right now (React shows arrows when there's more than one). */
  self.stopCount = (name) => (VIEWS[name] && VIEWS[name].wall ? VIEWS[name].wall.stopCount(W / H < 0.9) : 1);

  const ray = new THREE.Raycaster(); const ndc = new THREE.Vector2();
  let hovered = null, lastHover = null;
  // What the pointer is on inside an open section (a card, a tab, a clue, the reel), and where on it.
  let inner = null;
  // Arrow keys (or WASD) walk him around the room.
  const keys = {};
  const keyMap = { ArrowUp: 'u', KeyW: 'u', ArrowDown: 'd', KeyS: 'd', ArrowLeft: 'l', KeyA: 'l', ArrowRight: 'r', KeyD: 'r' };
  const onKey = (down) => (e) => { const k = keyMap[e.code]; if (!k || !self._entered || self._focus) return; const r = host.getBoundingClientRect(); if (r.bottom < 0 || r.top > innerHeight) return; keys[k] = down; e.preventDefault(); };
  const kd = onKey(true), ku = onKey(false); window.addEventListener('keydown', kd); window.addEventListener('keyup', ku);
  const prevCleanup = self._cleanup; self._cleanup = () => { window.removeEventListener('keydown', kd); window.removeEventListener('keyup', ku); prevCleanup && prevCleanup(); };
  let enterAt = -1;
  self._entered = !!self._skipIntro;
  // In by the front door: a knock, the door opens, the walk up the path (the page clears its poster as it starts).
  // With reduced motion there's no walk: straight inside, as a skip is.
  self.enterHouse = () => {
    if (enterAt >= 0 || self._entered || !self._shown) return;
    wake();
    if (self._reduced) { self._entered = true; self.onEntered && self.onEntered(); return; }
    enterAt = clockT; self.sfx && self.sfx.whoosh && self.sfx.whoosh(); self.sfx && self.sfx.knock && self.sfx.knock(); self.onWalk && self.onWalk();
  };
  /**
   * What's under the pointer: sets `hovered` (a hot spot), `hitPoint`, and `inner` (the thing inside an
   * open section). Runs every frame the pointer or camera moves, and again on every click, so a quick click or a tap
   * on a phone (which comes with no hover before it) lands on what's under the finger now, not what was there before.
   * Returns true when the thing inside a section is clickable.
   */
  function pick() {
    const focus = self._focus || '';
    const V = VIEWS[focus];
    ndc.set(mouse.x, -mouse.y); ray.setFromCamera(ndc, camera);
    const hit = ray.intersectObjects(pickables, false)[0];
    hovered = hit ? hit.object.userData.spot : null; hitPoint = hit ? hit.point : null;
    if (hovered && !(hovered === 'door' ? house.visible : room.visible)) hovered = null;
    if (!self._entered ? hovered !== 'door' : hovered === 'door') hovered = null;
    if (focus && (hovered === 'floor' || hovered === 'chair')) hovered = null;
    // Inside an open section, its things answer the pointer themselves: cards flip, tabs lean, the reel holds.
    const ud = hit ? hit.object.userData : null;
    inner = V && V.wall && ud && ud.spot === focus && ud.item !== undefined ? { item: ud.item, uv: hit.uv } : null;
    let live = false;
    wallList.forEach(([name, w]) => { const r = w.hover(name === focus ? inner : null); if (name === focus) live = r; });
    if (hovered === focus) hovered = null;
    return live;
  }

  host.addEventListener('click', (e) => {
    wake();
    // (nothing to click until the house is shown: the loading screen above lets clicks through)
    if (!self._shown) return;
    if (e && e.clientX !== undefined) {
      const r = host.getBoundingClientRect();
      mouse.x = (e.clientX - r.left) / r.width * 2 - 1; mouse.y = (e.clientY - r.top) / r.height * 2 - 1;
    }
    pick();
    if (!self._entered) { if (hovered === 'door') self.enterHouse(); return; }
    const open = self._focus && VIEWS[self._focus] && VIEWS[self._focus].wall;
    if (open && inner) {
      const r = open.click(inner, self._stop || 0, W / H < 0.9);
      if (r && r.stop !== undefined) { self._stop = r.stop; self.onStop && self.onStop(r.stop); self.sfx.whoosh(); }
      return;
    }
    if (hovered === 'me') { waveUntil = clockT + 2.4; self.sfx.tick(); return; }
    if (hovered === 'cat') { catPetAt = clockT; self.sfx.purr(); return; }
    if (hovered === 'floor' && hitPoint) {
      walker.goal = freeSpot(new THREE.Vector3(Math.max(-3.1, Math.min(7.0, hitPoint.x)), 0, Math.max(-1.35, Math.min(5.2, hitPoint.z))));
      walker.wantSit = false; walker.hurry = false; ring.position.set(walker.goal.x, 0.012, walker.goal.z); ring.material.opacity = 0.9; self.sfx.tick(); return;
    }
    if (hovered === 'chair') { walker.goal = seatAt.clone().add(new THREE.Vector3(Math.sin(seatYaw) * -0.55, 0, Math.cos(seatYaw) * -0.55)); walker.wantSit = true; walker.hurry = false; self.sfx.tick(); return; }
    if (hovered) self.go(hovered);
  });

  // ---- static batching: the hundreds of small still meshes (walls, trims, books, shelves, the chair...) become one mesh
  // per material, so the GPU gets a few dozen draw calls instead of a thousand. Moving or glowing things are left alone.
  // `shallow` merges only root's own mesh children, in its local space (for jointed things like the figure).
  const batch = (root, shallow = false) => {
    root.updateMatrixWorld(true);
    const inv = new THREE.Matrix4().copy(root.matrixWorld).invert();
    const groups = new Map();
    const walk = (o) => {
      if (o.userData.keep || !o.visible) return;
      if (o.isMesh && !Array.isArray(o.material) && !o.children.length && !o.customDepthMaterial && !o.geometry.morphAttributes.position) {
        const m = new THREE.Matrix4().multiplyMatrices(inv, o.matrixWorld);
        if (m.determinant() > 0) {
          const g = o.geometry;
          const k = [o.material.uuid, o.userData.spot || '', o.castShadow, o.receiveShadow, o.renderOrder, Object.keys(g.attributes).sort().join(','), !!g.index].join('|');
          if (!groups.has(k)) groups.set(k, []);
          groups.get(k).push({ o, m });
          return;
        }
      }
      if (!shallow) o.children.slice().forEach(walk);
    };
    root.children.slice().forEach(walk);
    groups.forEach((items) => {
      if (items.length < 2) return;
      const merged = BufferGeometryUtils.mergeBufferGeometries(items.map(({ o, m }) => { const g = o.geometry.clone(); g.clearGroups(); g.applyMatrix4(m); return g; }));
      if (!merged) return;
      const { o } = items[0];
      const mesh = new THREE.Mesh(merged, o.material);
      mesh.castShadow = o.castShadow; mesh.receiveShadow = o.receiveShadow; mesh.renderOrder = o.renderOrder;
      if (o.userData.spot) mesh.userData.spot = o.userData.spot;
      root.add(mesh);
      items.forEach(({ o: x }) => x.parent.remove(x));
    });
  };
  // Tiny things (buttons, pins, wheels, bulbs) don't cast a shadow you'd notice; skipping them keeps the shadow pass light.
  [room, house].forEach((g) => g.traverse((o) => {
    if (!o.isMesh || !o.castShadow || o.userData.keep) return;
    if (!o.geometry.boundingSphere) o.geometry.computeBoundingSphere();
    const sc = o.getWorldScale(new THREE.Vector3());
    if (o.geometry.boundingSphere.radius * Math.max(sc.x, sc.y, sc.z) < 0.05) o.castShadow = false;
  }));
  batch(room); batch(house);
  // The figure: every joint is its own group, so merge within each one (eyes blink and the chest breathes, so they stay apart).
  eyes.forEach(([e]) => { e.userData.keep = true; }); torso.userData.keep = true;
  { const joints = []; me.traverse((o) => { if (!o.isMesh) joints.push(o); }); joints.forEach((j) => batch(j, true)); }
  collectPickables();

  // ---- loading: nothing shows until every model and texture is in, then one warm-up frame with everything visible
  // uploads all textures and compiles every shader, so walking in later doesn't stutter.
  let loaded = false, warm = 0, shadowDirty = true, roomWasVisible = false;
  manager.onLoad = () => { loaded = true; };
  const giveUp = setTimeout(() => { loaded = true; }, 25000);
  { const prev = self._cleanup; self._cleanup = () => { clearTimeout(giveUp); prev && prev(); }; }
  const culled = [];

  // ---- the loop
  const target = new THREE.Vector3(-0.1, 1.35, -0.6);
  // Where you stand in the room: the front corner by the bed, looking across the lounge (the sofa facing you, the record
  // player on the table) to the desk, the neon and the shelves. On a phone held upright, closer in and a little higher.
  const IDLE = { wide: { pos: new THREE.Vector3(4.95, 1.95, 5.15), look: new THREE.Vector3(0.45, 1.2, -1.6) }, phone: { pos: new THREE.Vector3(4.4, 2.15, 5.4), look: new THREE.Vector3(1.3, 1.05, -1.2) } };
  const idleRight = new THREE.Vector3();
  // The way in: through the garden gate, up the path, through the front door, and round to that corner (the last point
  // follows the idle view).
  const introPath = new THREE.CatmullRomCurve3([new THREE.Vector3(), new THREE.Vector3(-0.3, 1.68, 18.6), new THREE.Vector3(0, 1.65, 13), new THREE.Vector3(0, 1.7, 8.2), new THREE.Vector3(0, 1.8, 5.9), new THREE.Vector3(1.1, 1.9, 5.15), new THREE.Vector3()]);
  const camPos = new THREE.Vector3(), camLook = new THREE.Vector3(), camUp = new THREE.Vector3(0, 1, 0);
  let nightK = 0;
  let first = true, offK = 0, offPx = 0, offUp = 0.2, aboutK = 0, closeK = 0, lastBlink = 0, blinkOn = true, waveUntil = 2.8, waveW = 0, clockT = 0, nextBlink = 2, t = 0, wasEntered = false;
  // the lawn view's slide (so the house stands clear of the words), and the KNOCK KNOCK! sticker's place on the door
  let landK = 1, landOX = 0, landOY = 0, landTX = 0, landTY = 0, landKey = '';
  const doorV = new THREE.Vector3(); let doorSX = -1e4, doorSY = -1e4, doorEl = null;
  self.wave = () => { waveUntil = clockT + 2.4; };
  // What casts a shadow and can move: him (where he is, sitting or standing, his head and his waving arm), the front
  // door, the record player's tonearm. Small drifts add up until they're worth a new shadow.
  const shadowNow = new Float32Array(12), shadowWas = new Float32Array(12).fill(1e9);
  const shadowMotion = () => {
    const n = shadowNow;
    n[0] = me.position.x; n[1] = me.position.z; n[2] = me.rotation.y; n[3] = walker.sitK; n[4] = waveW; n[5] = head.rotation.x;
    n[6] = head.rotation.y; n[7] = body.rotation.y; n[8] = elbowR.rotation.z; n[9] = shoulderR.rotation.z; n[10] = doorPivot.rotation.y; n[11] = walls.projects.motion;
    let moved = false;
    for (let i = 0; i < n.length; i++) if (Math.abs(n[i] - shadowWas[i]) > 0.003) { moved = true; shadowWas[i] = n[i]; }
    return moved;
  };
  // Jump the camera straight to where it's heading (handy for testing and debugging).
  self.snap = () => { first = true; };
  // Smoothing that feels the same at 30, 60 or 144 frames a second: `rate` is how fast it closes the gap, per second.
  let dt = 1 / 60;
  const damp = (rate) => 1 - Math.exp(-rate * dt);
  const v1 = new THREE.Vector3(), v2 = new THREE.Vector3(), v3 = new THREE.Vector3(), wantPosV = new THREE.Vector3(), wantLookV = new THREE.Vector3(), wantUpV = new THREE.Vector3();
  const headOff = new THREE.Vector3();
  const fairyCol = fairyGeo.attributes.color;
  runLoop((p, step) => {
    dt = step; t += step;
    clockT = t;
    const focus = self._focus || '';
    // ---- what's drawn: the house from outside, the room from inside, both while walking through the door.
    // Until everything has loaded, both (with nothing culled) so the warm-up frame uploads every texture and shader.
    if (!self._shown) {
      self._hold = !loaded;
      if (!loaded) { warm = 0; }
      else if (warm === 0) { scene.traverse((o) => { if (o.frustumCulled) { o.frustumCulled = false; culled.push(o); } }); room.visible = house.visible = true; sun.shadow.needsUpdate = moon.shadow.needsUpdate = true; warm = 1; }
      else if (warm++ >= 2) { culled.forEach((o) => { o.frustumCulled = true; }); culled.length = 0; collectPickables(); self._shown = true; self.onReady && self.onReady(); }
    }
    if (self._shown) {
      const walkingIn = !self._entered && enterAt >= 0;
      room.visible = self._entered || walkingIn;
      house.visible = !self._entered;
      // Shadows are drawn again only when something that casts one has moved (the camera moving doesn't change them),
      // and only for the light of the view you're in: a still room costs no shadow pass at all.
      if (room.visible !== roomWasVisible) { roomWasVisible = room.visible; shadowDirty = true; }
      if (shadowMotion() || shadowDirty) { sun.shadow.needsUpdate = house.visible; moon.shadow.needsUpdate = room.visible; shadowDirty = false; }
      // Skipped the walk-in? Cut straight inside instead of flying through the wall.
      if (self._entered && !wasEntered && enterAt < 0) first = true;
      wasEntered = self._entered;
    }
    // Life: the neon flickers now and then, the fairy lights twinkle, steam rises, the cursor blinks, dust drifts.
    const flick = Math.random() < dt * 0.36 ? 0.35 : 1;
    neon.material.opacity = flick; neonGlow.material.opacity = (self._bloom && !self._noBloom ? 0.85 : 1.35) * flick + Math.sin(t * 9) * 0.03; neonLight.intensity = 0.9 * flick;
    fairy.forEach((f, i) => { const a = (0.55 + Math.sin(t * 2.2 + f.ph) * 0.35) * 0.85; fairyCol.setXYZ(i, f.c.r * a, f.c.g * a, f.c.b * a); }); fairyCol.needsUpdate = true;
    steam.forEach((st) => { const k = (t * 0.35 + st.ph) % 1; st.s.position.set(Math.sin(k * 6 + st.ph * 9) * 0.03, 0.2 + k * 0.45, 0); st.s.material.opacity = Math.sin(k * Math.PI) * 0.35; st.s.scale.setScalar(0.08 + k * 0.18); });
    if (t - lastBlink > 0.55) { lastBlink = t; blinkOn = !blinkOn; }
    cursor.visible = blinkOn && focus !== 'experience';
    if (room.visible) { const pos = dustGeo.attributes.position; for (let i = 0; i < pos.count; i++) { let y = pos.getY(i) + (0.0015 + Math.sin(t + i) * 0.0006) * dt * 60; if (y > 3.2) y = 0.9; pos.setY(i, y); } pos.needsUpdate = true; }
    if (skyMesh) skyMesh.rotation.y += dt * 0.004; // the clouds drift
    // ---- day / night
    nightK += ((self._night ? 1 : 0) - nightK) * damp(3.1);
    const nk = nightK;
    amb.intensity = lerp(0.06, 0.035, nk); amb.color.setRGB(lerp(1, 0.55, nk), lerp(0.95, 0.62, nk), lerp(0.89, 0.9, nk));
    hemi.intensity = lerp(0.22, 0.07, nk); hemi.color.setRGB(lerp(1, 0.45, nk), lerp(0.94, 0.52, nk), lerp(0.86, 0.8, nk)); hemi.groundColor.setRGB(lerp(0.42, 0.2, nk), lerp(0.29, 0.15, nk), lerp(0.19, 0.12, nk));
    // the window's light: golden afternoon sun by day, cool moonlight at night
    moon.intensity = lerp(9, 1.6, nk); moon.color.setRGB(lerp(1, 0.5, nk), lerp(0.82, 0.6, nk), lerp(0.6, 0.95, nk));
    const wantEnv = nk > 0.5 ? envs.night : envs.day; if (scene.environment !== wantEnv) scene.environment = wantEnv;
    // reflections/ambient from the environment maps fade too (that's most of the daylight indoors)
    if (Math.abs(nk - (self._lastNk == null ? -1 : self._lastNk)) > 0.004) {
      self._lastNk = nk; const f = lerp(1, 0.6, nk);
      scene.traverse((o) => { if (!o.isMesh || !o.material) return; (Array.isArray(o.material) ? o.material : [o.material]).forEach((m) => { if (m.envMapIntensity === undefined) return; if (m.userData.baseEnv === undefined) m.userData.baseEnv = m.envMapIntensity; m.envMapIntensity = m.userData.baseEnv * f; }); });
    }
    sun.intensity = lerp(2.6, 0.12, nk); renderer.toneMappingExposure = lerp(1.0, 1.1, nk);
    if (self._beamMat) { self._beamMat.opacity = lerp(0.16, 0.07, nk); self._beamMat.color.setRGB(lerp(1, 0.6, nk), lerp(1, 0.7, nk), 1); }
    lampLight.intensity = lerp(0.9, 2.0, nk); (self._bedLamps || []).forEach((l) => { l.intensity = lerp(0.7, 1.6, nk); });
    const wantNightGlass = nk > 0.5; if (glass.userData.night !== wantNightGlass) { glass.userData.night = wantNightGlass; glass.material = wantNightGlass ? nightGlass : dayGlass; glass2.material = glass.material; }
    lamp.intensity = (2.4 + Math.sin(t * 1.3) * 0.08) * lerp(1, 1.5, nk);
    if (self._motes && room.visible) { const pa = self._motes.geo.attributes.position, b = self._motes.base; for (let i = 0; i < pa.count; i++) pa.setXYZ(i, b[i * 3] + Math.sin(t * 0.3 + i) * 0.05, b[i * 3 + 1] + Math.sin(t * 0.2 + i * 1.7) * 0.06, b[i * 3 + 2] + Math.cos(t * 0.25 + i) * 0.05); pa.needsUpdate = true; }
    const now = new Date(); const sec = now.getSeconds() + now.getMilliseconds() / 1000, min = now.getMinutes() + sec / 60, hr = (now.getHours() % 12) + min / 60;
    secH.rotation.z = -sec / 60 * Math.PI * 2; minH.rotation.z = -min / 60 * Math.PI * 2; hourH.rotation.z = -hr / 12 * Math.PI * 2;

    // ---- camera: the scroll path (wide shot down onto the notebook), or the spot that was clicked
    mouse.sx += (mouse.x - mouse.sx) * damp(3.7); mouse.sy += (mouse.y - mouse.sy) * damp(3.7);
    const portrait = W / H < 1;
    // The idle view: a slow breathing drift, and a gentle parallax with the pointer (across and up the view).
    const idle = portrait ? IDLE.phone : IDLE.wide;
    idleRight.subVectors(idle.look, idle.pos).cross(Y).normalize();
    const orbit = v1.copy(idle.pos).addScaledVector(idleRight, mouse.sx * 0.35 + Math.sin(t * 0.31) * 0.03); orbit.y += -mouse.sy * 0.15 + Math.sin(t * 0.47) * 0.02;
    target.copy(idle.look).addScaledVector(idleRight, mouse.sx * 1.0); target.y -= mouse.sy * 0.3;
    const q = band(p, 0, 1);
    const mid = v2.copy(nbCenter).add(v3.set(1.4, 3.2, 3.2));
    const end = VIEWS.about.pos;
    let wantPos = wantPosV.copy(orbit).lerp(mid, q).lerp(v3.copy(mid).lerp(end, q), q), wantLook = wantLookV.copy(target).lerp(nbCenter, band(p, 0, 0.75)), wantUp = wantUpV.copy(Y).lerp(VIEWS.about.up, band(p, 0.55, 1)), wantOff = 0;
    const V = VIEWS[focus];
    if (V && V.wall) {
      // Square on to the thing, just far enough back for all of it (with some air). On a phone held upright it fits in
      // the part of the screen the page's bars leave free (`_safe`: the px they cover at the top and the bottom), and
      // sits in the middle of that (see `lift` below), so none of it is under the menu or the controls.
      const upright = W / H < 0.9;
      const st = V.wall.stops(upright, self._stop || 0);
      const safe = upright && self._safe;
      const free = safe ? Math.max(0.3, (H - safe.top - safe.bottom) / H) : 1;
      const tanV = Math.tan((35 / 2) * Math.PI / 180), tanH = tanV * (W / H);
      const dist = Math.max(st.h / 2 / (tanV * free), st.w / 2 / tanH) * V.fit[upright ? 1 : 0];
      V.look.copy(st.c);
      V.pos.copy(st.n).multiplyScalar(dist).add(st.c);
    }
    if (V) { wantPos = V.pos; wantLook = V.look; wantUp = V.up; wantOff = V.off; }
    // ---- the way in: stand on the lawn, the door opens, walk through it
    let intro = 0, landWant = 0;
    if (!self._entered) {
      const u = enterAt < 0 ? 0 : Math.min(1, (t - enterAt) / 4.4);
      const doorU = enterAt < 0 ? 0 : ease(clamp((t - enterAt - 1.6) / 1.2));
      doorPivot.rotation.y = doorU * 1.75;
      // the door breathes a warm glow while it waits (brighter when it, or COME ON IN, is pointed at)
      doorHalo.material.opacity = enterAt < 0 ? (hovered === 'door' || self._doorCue ? 0.55 : self._reduced ? 0.18 : 0.13 + 0.12 * (0.5 + 0.5 * Math.sin(t * 2.4))) : 0.4 * doorU;
      // Where you stand on the lawn: the same place the loading screen's drawing of the house is made from (landCam). A hand
      // on a mouse moves it a little; a finger, or reduced motion, doesn't.
      const L = landCam(self._land ? self._land.mode : portrait ? 'tall' : 'wide');
      const par = self._reduced || mouse.touch ? 0 : 1, sway = self._reduced ? 0 : Math.sin(t * 0.3) * 0.08;
      introPath.points[0].set(L.pos[0] + mouse.sx * 0.6 * par + sway, L.pos[1] - mouse.sy * 0.15 * par, L.pos[2]);
      introPath.points[introPath.points.length - 1].copy(orbit); introPath.updateArcLengths();
      const walk = ease(clamp((u - 0.18) / 0.82));
      wantPos = introPath.getPointAt(walk, wantPosV);
      wantLook = wantLookV.set(L.look[0] * (1 - walk) + mouse.sx * 0.75 * par, lerp(L.look[1], 1.6, ease(clamp(walk * 1.6))) - mouse.sy * 0.25 * par, L.look[2]).lerp(target, ease(clamp((walk - 0.55) / 0.45)));
      wantUp = Y; wantOff = 0; intro = 1;
      // (the house slides back to the middle as the walk starts, well before the door opens)
      landWant = enterAt < 0 ? 1 : 1 - ease(clamp((t - enterAt) / 1.4));
      sun.intensity = 2.6 * (1 - walk);
      const o = 1 - walk; hemi.intensity = lerp(hemi.intensity, 0.6, o); hemi.color.lerp(skyCol, o); hemi.groundColor.lerp(lawnCol, o);
      if (u >= 1) { self._entered = true; self.onEntered && self.onEntered(); }
    } else { doorPivot.rotation.y = 0; doorHalo.material.opacity = 0; sun.intensity = 0; }
    const snap = first, k = first ? 1 : damp(intro ? 13.4 : V ? 3.7 : 9); first = false;
    // On the lawn the view slides so the house stands in the free part of the screen, beside (or between) the page's
    // words (`_land`, measured by the page). Refitted gently when the screen changes; gone once you're in (at once, for
    // a skip).
    const B = self._land, lk = B ? `${W}x${H}:${B.mode}:${B.l}:${B.r}:${B.t}:${B.b}` : `${W}x${H}`;
    if (lk !== landKey) { landKey = lk; const sh = B ? landShift(W, H, B) : null; landTX = sh ? sh.ox : 0; landTY = sh ? sh.oy : 0; }
    const lr = snap || !self._shown ? 1 : damp(6); landOX += (landTX - landOX) * lr; landOY += (landTY - landOY) * lr;
    landK = snap ? landWant : landK + (landWant - landK) * damp(10);
    camPos.lerp(wantPos, k); camLook.lerp(wantLook, k); camUp.lerp(wantUp, k).normalize();
    // Make room for an open panel: on wide screens the view slides left of it, on phones it lifts above the bottom panel.
    // Things in the room ('world') have no panel; they sit where their `lift` says, clear of the menu and controls.
    if (wantOff) {
      offPx += ((wantOff === 'world' || W < 768 ? 0 : wantOff * Math.min(1, W / 1440)) - offPx) * (offK < 0.01 ? 1 : damp(5));
      const safe = W / H < 0.9 && self._safe;
      const up = wantOff === 'world' ? (safe ? (safe.bottom - safe.top) / 2 / H : V.lift[W / H < 0.9 ? 1 : 0]) : W < 768 ? 0.2 : 0;
      offUp += (up - offUp) * (offK < 0.01 ? 1 : damp(5));
    }
    offK += ((wantOff ? 1 : 0) - offK) * (snap ? 1 : damp(5));
    camera.position.copy(camPos); camera.up.copy(camUp); camera.lookAt(camLook);
    // Wide, like standing in the doorway; narrows when it flies in close to something.
    const wantFov = V ? 35 : !self._entered && enterAt < 0 ? lawnFov(W, H) : Math.min(78, Math.max(40, 2 * Math.atan(0.746 / (W / H)) * 180 / Math.PI));
    if (Math.abs(camera.fov - wantFov) > 0.05) { camera.fov += (wantFov - camera.fov) * (snap ? 1 : damp(5)); camera.updateProjectionMatrix(); }
    // (inside, the panel's offset; outside, the lawn's: never both at once)
    const vox = offPx * offK + landOX * landK, voy = H * offUp * offK + landOY * landK;
    if (Math.abs(vox) > 0.5 || Math.abs(voy) > 0.5) camera.setViewOffset(W, H, vox, voy, W, H); else camera.clearViewOffset();
    // KNOCK KNOCK! stays pinned to the real front door: its anchor goes where the top of the door is on screen
    // (written only when that moves).
    if (self._doorEl !== doorEl) { doorEl = self._doorEl; doorSX = doorSY = -1e4; }
    if (doorEl && self._shown && !self._entered && enterAt < 0) {
      camera.updateMatrixWorld(); doorV.set(0, DH, HZ).project(camera);
      const sx = (doorV.x + 1) / 2 * W, sy = (1 - doorV.y) / 2 * H;
      if (Math.abs(sx - doorSX) + Math.abs(sy - doorSY) > 0.5) { doorSX = sx; doorSY = sy; doorEl.style.transform = `translate3d(${sx.toFixed(1)}px,${sy.toFixed(1)}px,0)`; doorEl.dataset.on = '1'; }
    }

    // The lamp gets out of the way as the camera comes down over the notebook.
    // (the desk lamp also bows out in front of the monitor when the experience reel is on)
    aboutK += ((focus === 'about' || focus === 'experience' ? 1 : 0) - aboutK) * damp(3.7);
    const down = Math.max(band(p, 0.72, 0.92), clamp((aboutK - 0.35) / 0.5));
    // Close up to paper or a screen, the glow would only smear the type, so it fades out.
    closeK += ((focus && focus !== 'projects' ? 1 : 0) - closeK) * damp(3.7);
    if (self._bloom) { self._bloom.strength = 0.32 * (1 - clamp(closeK * 1.6)); self._bloom.enabled = !self._noBloom && self._bloom.strength > 0.01; }
    // (only see-through while it's fading, so it doesn't sort against everything else the rest of the time)
    [lampMat, shade.material, bulb.material].forEach((m) => { const fade = down > 0.001; if (m.transparent !== fade) { m.transparent = fade; m.needsUpdate = true; } m.opacity = 1 - down; });
    bulbGlow.material.opacity = 0.9 * (1 - down);
    pen.visible = down < 0.5;
    nbFlat.material.opacity = focus === 'contact' ? 0 : Math.max(band(p, 0.8, 1), clamp((aboutK - 0.75) / 0.25));

    // ---- hover. A finger doesn't hover: once a tap has done its work nothing stays pointed at where it was (or the card
    // a phone steps on to would turn over by itself, and the reel would stay held).
    if (mouse.touch) {
      if (hovered || inner || lastHover) {
        hovered = null; inner = null; lastHover = null;
        wallList.forEach(([, w]) => w.hover(null));
        self.onHover && self.onHover(null);
        host.style.cursor = 'default';
      }
    } else if (self._shown && !mouse.down && (mouse.moved || camPos.distanceToSquared(wantPos) > 0.0004)) {
      mouse.moved = false;
      const live = pick();
      if (hovered !== lastHover) { if (hovered) self.sfx.tick(); lastHover = hovered; self.onHover && self.onHover(!focus && hovered && (SPOTS[hovered] || hovered === 'cat' || hovered === 'door') ? hovered : null); }
      host.style.cursor = live ? 'pointer' : hovered === 'floor' ? 'crosshair' : hovered ? 'pointer' : 'default';
    }
    wallList.forEach(([name, w]) => w.update(dt, { focused: focus === name, spot: hovered === name && !focus, nk, portrait: W / H < 0.9 }));
    // The hovered thing glows warm, with a slow pulse.
    spotList.forEach(([name, s]) => {
      const want = hovered === name && !focus ? 1 : 0;
      if (want === 0 && s.h < 0.002) { if (s.h) { s.h = 0; s.mats.forEach((m, i) => m.emissive.copy(s.base[i])); } return; }
      s.h += (want - s.h) * damp(9.8);
      const g = s.h * (0.32 + Math.sin(t * 4) * 0.08);
      s.mats.forEach((m, i) => m.emissive.copy(s.base[i]).lerp(GLOW, g));
    });

    // The cat: breathes, flicks an ear now and then, dreams in Zs; wakes while you point at it, purrs (and shivers) when petted.
    { const petted = clockT - catPetAt < 3, want = hovered === 'cat' || petted ? 1 : 0;
      catAwake += (want - catAwake) * damp(want ? 6 : 1.4);
      const br = Math.sin(clockT * (want ? 2.6 : 1.6));
      catBody.scale.set(0.2, 0.1 * (1 + br * 0.045), 0.15 * (1 + br * 0.02));
      catBody.position.y = 0.095 + (petted ? Math.sin(clockT * 150) * 0.0007 : 0);
      catHead.position.y = 0.09 + catAwake * 0.055; catHead.rotation.z = catAwake * 0.32; catHead.rotation.y = catAwake * 0.2 * Math.sin(clockT * 0.8);
      catShut.forEach((e) => { e.visible = catAwake < 0.5; }); catOpen.forEach((e) => { e.visible = catAwake >= 0.5; });
      if (clockT > catEarAt) { catEarAt = clockT + 3 + Math.random() * 5; catEarSide = Math.random() < 0.5 ? 0 : 1; catEarFlick = clockT; }
      catEars.forEach((e, i) => { const f = i === catEarSide ? clamp(1 - (clockT - catEarFlick) / 0.3) : 0; e.rotation.z = Math.sin(f * Math.PI) * 0.5; });
      catZs.forEach((z) => { const k = (clockT * 0.22 + z.ph) % 1; z.sp.position.set(0.17 + k * 0.06, 0.2 + k * 0.24, 0.05 + Math.sin(k * 6) * 0.02); z.sp.material.opacity = (1 - catAwake) * Math.sin(k * Math.PI) * 0.75; z.sp.scale.setScalar(0.035 + k * 0.05); });
      const hk = clamp((clockT - catPetAt) / 1.4); catHeart.material.opacity = hk < 1 ? Math.sin(hk * Math.PI) : 0; catHeart.position.set(0.2, 0.22 + hk * 0.2, 0.05); }

    // The trophy turns when you look at it.
    cup.rotation.y += ((focus === 'achievements' || hovered === 'achievements') ? 1.2 : 0.12) * dt;

    if (focus === 'experience' && walker.sitting && !walker.goal && !steppedAside) {
      walker.goal = asideSpot.clone(); walker.wantSit = false; walker.sitting = false; walker.hurry = true; steppedAside = true;
    } else if (focus !== 'experience' && steppedAside) {
      steppedAside = false;
      // (back to the chair, whether he got there or you left before he did)
      if (walker.goal ? walker.goal.distanceTo(asideSpot) < 0.01 : walker.pos.distanceTo(asideSpot) < 0.2) { walker.goal = seatAt.clone().add(new THREE.Vector3(Math.sin(seatYaw) * -0.55, 0, Math.cos(seatYaw) * -0.55)); walker.wantSit = true; walker.hurry = false; }
    }
    // ---- Lakshya: breathes, blinks, waves, and looks at what you point at (else at you)
    const lookAt = hovered && SPOTS[hovered] ? SPOTS[hovered].anchor : V && focus !== 'about' ? V.look : camera.position;
    ring.material.opacity *= Math.exp(-1.8 * dt);
    { const kx = (keys.r ? 1 : 0) - (keys.l ? 1 : 0), kz = (keys.d ? 1 : 0) - (keys.u ? 1 : 0);
      if (kx || kz) { const d = new THREE.Vector3(kx, 0, kz).normalize(); walker.goal = freeSpot(new THREE.Vector3(Math.max(-3.1, Math.min(7.0, walker.pos.x + d.x * 0.35)), 0, Math.max(-1.35, Math.min(5.2, walker.pos.z + d.z * 0.35))), walker.pos); walker.wantSit = false; walker.sitting = false; walker.hurry = false; } }
    if (walker.goal) {
      // Stand up first, then walk; turn to face the way he's going.
      if (walker.sitK > 0.02) walker.sitK = Math.max(0, walker.sitK - dt * (walker.hurry ? 5 : 2.2));
      else {
        const d = walker.goal.clone().sub(walker.pos); d.y = 0; const dist = d.length();
        if (dist < 0.05) {
          walker.goal = null; walker.speed = 0; walker.hurry = false;
          if (walker.wantSit) walker.sitting = true;
        } else {
          walker.speed = walker.hurry ? Math.min(2.4, walker.speed + dt * 10) : Math.min(1.3, walker.speed + dt * 4);
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
    const lp = me.worldToLocal(v1.copy(lookAt)).sub(headOff.set(0, hipY + 0.75, 0.06));
    const yaw = Math.max(-1.1, Math.min(1.1, Math.atan2(-lp.x, -lp.z)));
    const pitch = Math.max(-0.45, Math.min(0.45, Math.atan2(lp.y, Math.hypot(lp.x, lp.z))));
    body.rotation.y += (yaw * 0.3 - body.rotation.y) * damp(3.7);
    head.rotation.y += (yaw * 0.7 - head.rotation.y) * damp(5);
    head.rotation.x += (pitch - head.rotation.x) * damp(5);
    head.rotation.z = Math.sin(t * 0.9) * 0.03;
    torso.scale.y = 1 + Math.sin(t * 2.1) * 0.012;
    if (t > nextBlink) { eyes.forEach(([e]) => e.scale.set(1, 0.12, 1)); if (t > nextBlink + 0.12) { eyes.forEach(([e]) => e.scale.set(1, 1, 1)); nextBlink = t + 2.4 + Math.random() * 2.5; } }
    if (hovered === 'me' && t > waveUntil - 1) waveUntil = t + 1.2;
    waveW += ((t < waveUntil ? 1 : 0) - waveW) * damp(6.3);
    shoulderR.rotation.set(lerp(lerp(stride * 0.5 * amp, 0.4, sk), 0.15, waveW), 0, lerp(0.12, 2.55, waveW));
    elbowR.rotation.set(lerp(lerp(0.25, 1.15, sk), 0, waveW), 0, waveW * (0.35 + Math.sin(t * 11) * 0.5));
    self.setOverlay(0);
  });
});

}
