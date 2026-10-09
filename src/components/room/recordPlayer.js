// @ts-nocheck
import { CRATE_RECORDS } from '@/components/projects/crate/crateData';
import { projectsData } from '@/data/portfolio';
// The record player is silent: no crate, needle or crackle sounds.
const quiet = () => {};
const [playArmLift, playFlick, playFlip, playNeedleDrop, playSlide, playTheme, playWindDown, startCrackle, stopCrackle] = Array(9).fill(quiet);
import { clamp01, easeInOut, makeCanvas, wrap } from './canvasKit';
import { labelIconImage, sceneImage } from './recordArt';

/**
 * The site's Projects record player, set up in the lounge: the crate of sleeves on the rug, and on the coffee table
 * the turntable and the cover on its stand. Point along the crate to dig through it and click a sleeve: its record
 * slides out, flies over and lands on the platter, the tonearm swings in and the needle drops. Point at the cover and
 * it turns over to show a little scene of the project. The button on the deck (or the deck itself) stops and starts
 * it. Sizes are real ones: an LP is about 31 cm across.
 */

const IMPACT = 'Impact, Anton, "Bebas Neue", sans-serif';
const TABLE_Y = 0.42; // the coffee table top
const DECK = { x: 3.75, z: 2.22 };
const STAND = { x: 3.8, z: 1.76 };
const CRATE = { x: 3.86, z: 3.22 };
const RPM = ((100 / 3) / 60) * Math.PI * 2; // 33⅓ turns a minute, in radians a second
const ARM_PLAY = -0.586; // how far the tonearm swings in to sit on the outer groove
const SLEEVE = 0.31, LP = 0.146, LABEL = 0.055;
const STEP = 0.034; // each sleeve stands a little higher than the one in front of it, as in the site's crate, so every name shows
const TIPPED = 1.31; // how far the ones in front lean forward (75°) while you dig behind them
const CUE = { land: 1.25, drop: 1.75 }; // when a picked record lands, and when the needle drops
const records = CRATE_RECORDS;

const loadImage = (src) => new Promise((res) => {
  if (!src) return res(null);
  const im = new Image();
  im.onload = () => res(im);
  im.onerror = () => res(null);
  im.src = src;
});

/**
 * The site's drawings (label pictures, cover scenes) copied onto a canvas, or null in a browser that won't let a drawn
 * SVG be read back: a texture painted with one there couldn't be uploaded, so those go without the picture.
 */
function readable(img, w, h) {
  if (!img) return null;
  const cv = makeCanvas(w, h), g = cv.getContext('2d');
  try {
    g.drawImage(img, 0, 0, w, h);
    g.getImageData(0, 0, 1, 1);
    return cv;
  } catch {
    return null;
  }
}

/** `img` filling the box like CSS object-fit: cover, with rounded corners. */
function coverImage(g, img, x, y, w, h, r = 0) {
  g.save();
  g.beginPath();
  if (g.roundRect) g.roundRect(x, y, w, h, r);
  else g.rect(x, y, w, h);
  g.clip();
  if (img) {
    const s = Math.max(w / img.width, h / img.height);
    g.drawImage(img, x + (w - img.width * s) / 2, y + (h - img.height * s) / 2, img.width * s, img.height * s);
  } else {
    g.fillStyle = 'rgba(0,0,0,0.12)';
    g.fillRect(x, y, w, h);
  }
  g.restore();
}

/** Fine grooves, as on the site's records, filling a circle of radius `R` at the centre. */
function grooves(g, size, R) {
  const c = size / 2;
  g.save();
  g.beginPath();
  g.arc(c, c, R, 0, Math.PI * 2);
  g.clip();
  g.fillStyle = '#090909';
  g.fillRect(0, 0, size, size);
  const period = R / 48;
  g.strokeStyle = '#171717';
  g.lineWidth = period / 2;
  for (let r = R - period / 4; r > R * 0.3; r -= period) {
    g.beginPath();
    g.arc(c, c, r, 0, Math.PI * 2);
    g.stroke();
  }
  // the quiet gaps between tracks
  g.strokeStyle = '#050505';
  g.lineWidth = period * 0.9;
  [0.88, 0.74, 0.61, 0.5].forEach((k) => {
    g.beginPath();
    g.arc(c, c, R * k, 0, Math.PI * 2);
    g.stroke();
  });
  g.restore();
}

const ASTERISK = 'M20.325 19V0M23.825 21L38.825 11M23.825 24.5L38.825 33.5M20.325 26.5V44.5M17.325 24.5L1.325 33.5M17.325 21L1.325 11';

/** A sleeve's front, as in the site's crate: its colour, the name and an asterisk, and the project's picture. */
function drawSleeve(r, img) {
  const S = 2, cv = makeCanvas(320 * S, 320 * S), g = cv.getContext('2d');
  g.scale(S, S);
  g.fillStyle = r.color;
  g.fillRect(0, 0, 320, 320);
  g.fillStyle = 'rgba(255,255,255,0.3)';
  g.fillRect(0, 0, 320, 2);
  g.fillStyle = r.ink;
  g.font = `25px ${IMPACT}`;
  g.textBaseline = 'middle';
  g.fillText(r.upper, 16, 9 + 14);
  g.save();
  g.translate(320 - 16 - 18, 12);
  g.scale(18 / 40.2117, 18 / 40.2117);
  g.strokeStyle = r.ink;
  g.lineWidth = 5;
  g.stroke(new Path2D(ASTERISK));
  g.restore();
  coverImage(g, img, 16, 45, 288, 246, 4);
  return cv;
}

/** A sleeve's back, seen when it's tipped forward: the name, the tech it's made with as the track list, a barcode. */
function drawBack(r, tracks) {
  const S = 1.6, cv = makeCanvas(320 * S, 320 * S), g = cv.getContext('2d');
  g.scale(S, S);
  g.fillStyle = r.color;
  g.fillRect(0, 0, 320, 320);
  g.fillStyle = r.ink;
  g.strokeStyle = r.ink;
  g.font = `25px ${IMPACT}`;
  g.textBaseline = 'middle';
  g.fillText(r.upper, 16, 23);
  g.globalAlpha = 0.5;
  g.fillRect(16, 44, 288, 1.5);
  g.globalAlpha = 1;
  const half = Math.ceil(tracks.length / 2);
  let y = 72;
  [['SIDE A', tracks.slice(0, half), 'A'], ['SIDE B', tracks.slice(half), 'B']].forEach(([side, list, k]) => {
    if (!list.length) return;
    g.font = '700 11px "Space Mono", monospace';
    g.fillText(side, 16, y);
    y += 24;
    list.forEach((name, n) => {
      g.font = '700 12px "Space Mono", monospace';
      g.fillText(`${k}${n + 1}`, 16, y);
      g.font = '600 17px Inter, sans-serif';
      g.fillText(name, 48, y);
      y += 26;
    });
    y += 10;
  });
  g.globalAlpha = 0.5;
  g.fillRect(16, 268, 288, 1.5);
  g.globalAlpha = 1;
  g.font = '700 10px "Space Mono", monospace';
  g.fillText('VOL. 1 · 33⅓ RPM · STEREO', 16, 292);
  g.fillStyle = '#fff';
  g.fillRect(232, 279, 72, 28);
  g.fillStyle = '#000';
  for (let x = 236, n = 0; x < 300; n++) {
    const w = [1, 2, 1, 3, 1, 1, 2][(n * 5 + r.upper.length) % 7];
    g.fillRect(x, 282, w, 22);
    x += w + 2;
  }
  return cv;
}

/** The record inside a sleeve: grooves and a small label with the name, as it slides out on the site. */
function drawSleeveDisc(r) {
  const N = 512, k = N / 292, c = N / 2, cv = makeCanvas(N, N), g = cv.getContext('2d');
  grooves(g, N, N / 2);
  g.fillStyle = '#000';
  g.beginPath();
  g.arc(c, c, 55 * k, 0, Math.PI * 2);
  g.fill();
  g.fillStyle = r.color;
  g.beginPath();
  g.arc(c, c, 52 * k, 0, Math.PI * 2);
  g.fill();
  g.fillStyle = r.ink;
  g.textAlign = 'center';
  g.textBaseline = 'middle';
  let size = 14 * k;
  g.font = `${size}px ${IMPACT}`;
  while (g.measureText(r.upper).width > 88 * k && size > 8) g.font = `${(size -= 1)}px ${IMPACT}`;
  g.fillText(r.upper, c, c - 6 * k);
  g.fillStyle = '#000';
  g.beginPath();
  g.arc(c, c + 10 * k, 4 * k, 0, Math.PI * 2);
  g.fill();
  return cv;
}

/** The label on the record on the turntable: its colour, the name running round, the project's picture, 33⅓. */
function drawLabel(r, icon) {
  const N = 512, k = N / 120, c = N / 2, cv = makeCanvas(N, N), g = cv.getContext('2d');
  g.fillStyle = r.color;
  g.beginPath();
  g.arc(c, c, 60 * k, 0, Math.PI * 2);
  g.fill();
  g.strokeStyle = r.ink === '#FFFFFF' ? 'rgba(255,255,255,0.45)' : 'rgba(11,21,80,0.35)';
  g.lineWidth = 1.5 * k;
  g.beginPath();
  g.arc(c, c, 37 * k, 0, Math.PI * 2);
  g.stroke();
  // the name round the edge, from the left over the top (short names go round twice so the ring is full)
  const text = r.upper.length > 8 ? `${r.upper} • 33⅓ RPM • SIDE A • ` : `${r.upper} • 33⅓ RPM • ${r.upper} • 33⅓ RPM • `;
  g.font = `800 ${8 * k}px Inter, sans-serif`;
  g.fillStyle = r.ink;
  g.textAlign = 'center';
  g.textBaseline = 'alphabetic';
  const R = 47 * k;
  let a = Math.PI;
  for (const ch of text) {
    const w = g.measureText(ch).width + 1.3 * k;
    const at = a + w / 2 / R;
    g.save();
    g.translate(c + R * Math.cos(at), c + R * Math.sin(at));
    g.rotate(at + Math.PI / 2);
    g.fillText(ch, 0, 0);
    g.restore();
    a += w / R;
    if (a > Math.PI * 3) break;
  }
  if (icon) g.drawImage(icon, 41 * k, 19 * k, 38 * k, 38 * k);
  g.font = `${11 * k}px ${IMPACT}`;
  g.textBaseline = 'top';
  g.fillText('33⅓', c, 76 * k);
  return cv;
}

/** The cover's front: the picture a little crooked in a frame of the ink colour, the name across the bottom. */
function drawCoverFront(r, img) {
  const S = 2.5, cv = makeCanvas(216 * S, 216 * S), g = cv.getContext('2d');
  g.scale(S, S);
  g.fillStyle = r.color;
  g.fillRect(0, 0, 216, 216);
  g.save();
  g.translate(14 + 97, 16 + 64);
  g.rotate((-2.5 * Math.PI) / 180);
  g.shadowColor = 'rgba(0,0,0,0.6)';
  g.shadowBlur = 16;
  g.shadowOffsetY = 8;
  g.fillStyle = r.ink;
  g.fillRect(-97, -64, 194, 128);
  g.shadowColor = 'transparent';
  coverImage(g, img, -94, -61, 188, 122, 0);
  g.restore();
  const size = r.upper.length > 9 ? 30 : 44;
  g.font = `${size}px ${IMPACT}`;
  g.fillStyle = r.ink;
  g.textBaseline = 'alphabetic';
  const lines = wrap(g, r.upper, 188);
  lines.forEach((l, i) => g.fillText(l, 14, 216 - 12 - (lines.length - 1 - i) * size * 0.9 - size * 0.08));
  const sheen = g.createLinearGradient(0, 0, 216, 120);
  sheen.addColorStop(0.35, 'rgba(255,255,255,0)');
  sheen.addColorStop(0.48, 'rgba(255,255,255,0.18)');
  sheen.addColorStop(0.6, 'rgba(255,255,255,0)');
  g.fillStyle = sheen;
  g.fillRect(0, 0, 216, 216);
  return cv;
}

/** The cover's back: the project's little scene, from the site. */
function drawCoverBack(r, scene) {
  const S = 2.5, cv = makeCanvas(216 * S, 216 * S), g = cv.getContext('2d');
  g.scale(S, S);
  g.fillStyle = r.color;
  g.fillRect(0, 0, 216, 216);
  if (scene) g.drawImage(scene, -18.4, 0, 288 * 0.878, 246 * 0.878);
  return cv;
}

/** The crate's front: the "VOL. 1" plate with a handle slot, as on the site. */
function drawPlate() {
  const cv = makeCanvas(720, 220), g = cv.getContext('2d');
  g.fillStyle = '#0F0F0F';
  g.fillRect(0, 0, 720, 220);
  g.fillStyle = '#151515';
  g.strokeStyle = '#2E2E2E';
  g.lineWidth = 4;
  g.beginPath();
  if (g.roundRect) g.roundRect(20, 14, 680, 192, 22);
  else g.rect(20, 14, 680, 192);
  g.fill();
  g.stroke();
  g.fillStyle = '#000';
  g.beginPath();
  if (g.roundRect) g.roundRect(360 - 110, 46, 220, 44, 22);
  else g.rect(250, 46, 220, 44);
  g.fill();
  g.fillStyle = '#3C3C3C';
  g.font = `44px ${IMPACT}`;
  g.textAlign = 'center';
  g.textBaseline = 'middle';
  const text = 'VOL. 1';
  let w = 0;
  for (const ch of text) w += g.measureText(ch).width + 6;
  let x = 360 - w / 2;
  g.textAlign = 'left';
  for (const ch of text) {
    g.fillText(ch, x, 150);
    x += g.measureText(ch).width + 6;
  }
  return cv;
}

/** The platter: black, with the strobe dots round the rim. */
function drawPlatter() {
  const N = 512, c = N / 2, cv = makeCanvas(N, N), g = cv.getContext('2d');
  g.fillStyle = '#0B0B0B';
  g.fillRect(0, 0, N, N);
  g.fillStyle = '#3A3A3A';
  for (let a = 0; a < 360; a += 10) {
    g.save();
    g.translate(c, c);
    g.rotate((a * Math.PI) / 180);
    g.fillRect(c * 0.955, -c * 0.017, c * 0.04, c * 0.035);
    g.restore();
  }
  return cv;
}

function drawButton(text) {
  const cv = makeCanvas(256, 128), g = cv.getContext('2d');
  g.fillStyle = '#222';
  g.fillRect(0, 0, 256, 128);
  g.fillStyle = '#F4F4F4';
  g.font = '700 56px Inter, sans-serif';
  g.textAlign = 'center';
  g.textBaseline = 'middle';
  g.fillText(text, 128, 68);
  return cv;
}

const measure = makeCanvas(8, 8).getContext('2d');
/** Where the "playing" dot goes on a sleeve's front (in the 320px drawing): just after the name, as on the site. */
function dotAt(r) {
  measure.font = `25px ${IMPACT}`;
  return { x: 16 + measure.measureText(r.upper).width + 10 + 5, y: 22 };
}

export function buildRecordPlayer(THREE, { parent, maxAniso, onChange, onFollow }) {
  const tex = (cv) => {
    const t = new THREE.CanvasTexture(cv);
    t.encoding = THREE.sRGBEncoding;
    t.anisotropy = maxAniso;
    return t;
  };
  // Printed things keep their true colours and dim with the room at night, like the other walls.
  const papers = [];
  const paper = (t, extra = {}) => {
    const m = new THREE.MeshBasicMaterial(Object.assign({ map: t, toneMapped: false }, extra));
    papers.push(m);
    return m;
  };
  const std = (color, rough, metal = 0, extra = {}) => new THREE.MeshStandardMaterial(Object.assign({ color, roughness: rough, metalness: metal, envMapIntensity: 0.6 }, extra));
  const black = (color, rough) => std(color, rough, 0, { envMapIntensity: 0.22 }); // the site's near-black deck and crate
  const rbox = (w, h, d, r, m) => {
    const mesh = new THREE.Mesh(new THREE.RoundedBoxGeometry(w, h, d, 3, Math.min(r, w / 2, h / 2, d / 2)), m);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    return mesh;
  };
  const pickables = [], glowMeshes = [];
  const tag = (m, item) => {
    m.userData.spot = 'projects';
    if (item !== undefined) m.userData.item = item;
    pickables.push(m);
    return m;
  };
  // Everything faces the camera's side of the table (+x); in these groups +z is towards it and +x is to its right.
  const place = (x, y, z) => {
    const g = new THREE.Group();
    g.position.set(x, y, z);
    g.rotation.y = Math.PI / 2;
    g.userData.keep = true;
    parent.add(g);
    return g;
  };

  const grooveTex = tex((() => { const cv = makeCanvas(1024, 1024); grooves(cv.getContext('2d'), 1024, 512); return cv; })());
  const vinyl = std(0xffffff, 0.38, 0.15, { map: grooveTex, envMapIntensity: 1 });
  const vinylEdge = std(0x0a0a0a, 0.5, 0.1);
  const metal = std(0xcfcfcf, 0.28, 0.85);
  const dark = black(0x141414, 0.5);

  // ---------------------------------------------------------------- the turntable
  const deck = place(DECK.x, TABLE_Y, DECK.z);
  const plinth = tag(rbox(0.48, 0.065, 0.36, 0.012, dark), 'deck');
  plinth.position.y = 0.0325;
  deck.add(plinth);
  glowMeshes.push(plinth);
  const spin = new THREE.Group(); // platter, record and label, turning together
  spin.position.set(-0.045, 0.065, -0.005);
  deck.add(spin);
  const platter = new THREE.Mesh(new THREE.CylinderGeometry(0.152, 0.152, 0.012, 72), [std(0x1b1b1b, 0.4, 0.3), new THREE.MeshStandardMaterial({ map: tex(drawPlatter()), roughness: 0.6 }), dark]);
  platter.position.y = 0.006;
  platter.receiveShadow = true;
  spin.add(platter);
  const record = new THREE.Group();
  record.position.y = 0.012;
  spin.add(record);
  const disc = tag(new THREE.Mesh(new THREE.CylinderGeometry(LP, LP, 0.0025, 96), [vinylEdge, vinyl, vinyl]), 'deck');
  disc.position.y = 0.00125;
  record.add(disc);
  const labelTex = records.map((r) => tex(drawLabel(r, null)));
  const labelMat = paper(labelTex[0]);
  const label = tag(new THREE.Mesh(new THREE.CircleGeometry(LABEL, 48), labelMat), 'deck');
  label.rotation.x = -Math.PI / 2;
  label.position.y = 0.0027;
  record.add(label);
  const spindle = new THREE.Mesh(new THREE.CylinderGeometry(0.004, 0.004, 0.012, 16), metal);
  spindle.position.y = 0.006;
  record.add(spindle);
  // the tonearm: a pivot at the back right, the arm, its counterweight, and the white headshell with the red cartridge
  const pivotBase = new THREE.Mesh(new THREE.CylinderGeometry(0.022, 0.026, 0.03, 32), std(0x232323, 0.4, 0.4));
  pivotBase.position.set(0.175, 0.08, -0.11);
  pivotBase.castShadow = true;
  deck.add(pivotBase);
  const armYaw = new THREE.Group();
  armYaw.position.set(0.175, 0.098, -0.11);
  deck.add(armYaw);
  const armPitch = new THREE.Group();
  armYaw.add(armPitch);
  const tube = new THREE.Mesh(new THREE.CylinderGeometry(0.0035, 0.0035, 0.21, 12), metal);
  tube.rotation.x = Math.PI / 2;
  tube.position.z = 0.105;
  tube.castShadow = true;
  armPitch.add(tube);
  const weight = new THREE.Mesh(new THREE.CylinderGeometry(0.014, 0.014, 0.035, 24), std(0x3a3a3a, 0.4, 0.5));
  weight.rotation.x = Math.PI / 2;
  weight.position.z = -0.03;
  armPitch.add(weight);
  const head = new THREE.Group();
  head.position.z = 0.21;
  head.rotation.y = (-18 * Math.PI) / 180;
  armPitch.add(head);
  const shell = new THREE.Mesh(new THREE.BoxGeometry(0.024, 0.006, 0.04), std(0xe6e6e6, 0.4));
  shell.position.z = 0.016;
  shell.castShadow = true;
  head.add(shell);
  const cart = new THREE.Mesh(new THREE.BoxGeometry(0.012, 0.012, 0.014), std(0xfa1a1d, 0.4));
  cart.position.set(0, -0.008, 0.026);
  head.add(cart);
  const rest = new THREE.Mesh(new THREE.CylinderGeometry(0.004, 0.004, 0.03, 12), std(0x2a2a2a, 0.4, 0.4));
  rest.position.set(0.175, 0.08, 0.14);
  deck.add(rest);
  // the start/stop button, front left
  const btnTex = { stop: tex(drawButton('STOP')), play: tex(drawButton('PLAY')) };
  const button = tag(rbox(0.07, 0.012, 0.035, 0.004, std(0x222222, 0.5)), 'button');
  button.position.set(-0.185, 0.069, 0.138);
  deck.add(button);
  const btnFace = tag(new THREE.Mesh(new THREE.PlaneGeometry(0.06, 0.03), paper(btnTex.stop)), 'button');
  btnFace.rotation.x = -Math.PI / 2;
  btnFace.position.set(-0.185, 0.0757, 0.138);
  deck.add(btnFace);

  // ---------------------------------------------------------------- the cover on its stand
  const stand = place(STAND.x, TABLE_Y, STAND.z);
  const standMat = std(0x2a2a2a, 0.5, 0.3);
  const bar = rbox(0.23, 0.012, 0.07, 0.004, standMat);
  bar.position.y = 0.006;
  stand.add(bar);
  glowMeshes.push(bar);
  [-0.09, 0.09].forEach((x) => {
    const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.003, 0.003, 0.2, 8), std(0x242424, 0.5, 0.4));
    leg.position.set(x, 0.1, -0.06);
    leg.rotation.x = -0.32;
    stand.add(leg);
  });
  const lean = new THREE.Group();
  lean.position.y = 0.012;
  lean.rotation.x = -0.21; // leaning back on the stand
  stand.add(lean);
  const standDiscMats = records.map((r) => tex(drawSleeveDisc(r)));
  const standDiscMat = paper(standDiscMats[0], { transparent: true });
  const standDisc = new THREE.Mesh(new THREE.CircleGeometry(0.1, 48), standDiscMat);
  standDisc.position.set(0, 0.108 + 0.1, -0.02);
  lean.add(standDisc);
  const flip = new THREE.Group();
  flip.position.y = 0.108;
  lean.add(flip);
  const coverFront = records.map((r) => tex(drawCoverFront(r, null)));
  const coverBack = records.map((r) => tex(drawCoverBack(r, null)));
  const frontMat = paper(coverFront[0]), backMat = paper(coverBack[0]);
  const front = tag(new THREE.Mesh(new THREE.PlaneGeometry(0.216, 0.216), frontMat), 'cover');
  front.position.z = 0.001;
  const back = tag(new THREE.Mesh(new THREE.PlaneGeometry(0.216, 0.216), backMat), 'cover');
  back.rotation.y = Math.PI;
  back.position.z = -0.001;
  flip.add(front, back);

  // ---------------------------------------------------------------- the crate, on the rug
  const crate = place(CRATE.x, 0, CRATE.z);
  const crateMat = black(0x0f0f0f, 0.85);
  const bottom = rbox(0.38, 0.012, 0.31, 0.004, crateMat);
  bottom.position.y = 0.006;
  crate.add(bottom);
  const backWall = tag(rbox(0.38, 0.22, 0.012, 0.004, crateMat));
  backWall.position.set(0, 0.11, -0.15);
  crate.add(backWall);
  glowMeshes.push(backWall);
  const plateMat = new THREE.MeshStandardMaterial({ map: tex(drawPlate()), roughness: 0.8 });
  const frontWall = tag(new THREE.Mesh(new THREE.BoxGeometry(0.38, 0.11, 0.012), [crateMat, crateMat, crateMat, crateMat, plateMat, crateMat]));
  frontWall.position.set(0, 0.055, 0.15);
  frontWall.castShadow = true;
  crate.add(frontWall);
  [-1, 1].forEach((s) => {
    // sides sloping down from the tall back to the low front
    const geo = new THREE.BoxGeometry(0.012, 0.22, 0.31);
    const p = geo.attributes.position;
    for (let i = 0; i < p.count; i++) if (p.getY(i) > 0 && p.getZ(i) > 0) p.setY(i, 0);
    geo.computeVertexNormals();
    const side = tag(new THREE.Mesh(geo, crateMat));
    side.position.set(s * 0.196, 0.11, 0);
    side.castShadow = true;
    crate.add(side);
  });
  const sleeveFace = records.map((r) => tex(drawSleeve(r, null)));
  const sleeveBack = [];
  const hitMat = new THREE.MeshBasicMaterial({ visible: false });
  const sleeves = records.map((r, i) => {
    const pivot = new THREE.Group(); // at the sleeve's bottom edge, so it tips forward from there
    const z = 0.105 - i * 0.04, y = 0.012 + i * STEP;
    pivot.position.set(0, y, z);
    pivot.rotation.x = -0.14;
    crate.add(pivot);
    const lift = new THREE.Group();
    pivot.add(lift);
    // Shaded by hand below (they're further back, tipped, or dug out), so not in `papers`.
    const face = new THREE.MeshBasicMaterial({ map: sleeveFace[i], toneMapped: false });
    const backTex = tex(drawBack(r, (projectsData[i] && projectsData[i].techStack) || []));
    backTex.center.set(0.5, 0.5);
    backTex.rotation = Math.PI; // tipped towards you its top is nearest, so turn the print round to read the right way up
    sleeveBack.push(backTex);
    const back = new THREE.MeshBasicMaterial({ map: backTex, toneMapped: false });
    // Two draws a sleeve: the front with its thin edges (they take the sleeve's colour from the drawing's margin), and the back.
    // (a box's faces run +x, -x, +y, -y, +z, -z, four corners and six indices each)
    const geo = new THREE.BoxGeometry(SLEEVE, SLEEVE, 0.005);
    for (let v = 0; v < 16; v++) geo.attributes.uv.setXY(v, 0.02, 0.5);
    geo.clearGroups();
    geo.addGroup(0, 30, 0);
    geo.addGroup(30, 6, 1);
    const body = new THREE.Mesh(geo, [face, back]);
    body.position.y = SLEEVE / 2;
    lift.add(body);
    const inner = new THREE.Mesh(new THREE.CircleGeometry(0.14, 48), paper(tex(drawSleeveDisc(r)), { transparent: true }));
    inner.position.set(0, SLEEVE / 2, -0.004);
    lift.add(inner);
    // The pointer finds sleeves by where they rest, so digging never jitters as they tip and lift.
    const hit = tag(new THREE.Mesh(new THREE.PlaneGeometry(SLEEVE, SLEEVE), hitMat), `sleeve${i}`);
    hit.position.set(0, y + (SLEEVE / 2) * Math.cos(0.14), z + 0.004 - (SLEEVE / 2) * Math.sin(0.14));
    hit.rotation.x = -0.14;
    crate.add(hit);
    // Tipped forward it rests on the crate's front edge (the front ones are lifted onto it, not pushed through it).
    const rest = Math.max(0, 0.118 - (y + (0.15 - z) / Math.tan(TIPPED)));
    return { pivot, lift, inner, face, back, y, rest, tip: 0, up: 0, out: 0 };
  });

  // The playing record's sleeve has a pulsing dot after its name.
  const dot = new THREE.Group();
  const dotCore = new THREE.Mesh(new THREE.CircleGeometry(0.0049, 24), new THREE.MeshBasicMaterial({ toneMapped: false }));
  dotCore.position.z = 0.0002;
  const dotHalo = new THREE.Mesh(new THREE.CircleGeometry(1, 32), new THREE.MeshBasicMaterial({ color: new THREE.Color(0xfa1a1d).convertSRGBToLinear(), transparent: true, depthWrite: false, toneMapped: false }));
  dot.add(dotHalo, dotCore);
  const dotColor = new THREE.Color();
  const markPlaying = () => {
    const r = records[playing], at = dotAt(r);
    dot.position.set((at.x / 320 - 0.5) * SLEEVE, SLEEVE - (at.y / 320) * SLEEVE, 0.0027);
    dotColor.set(r.color.toUpperCase() === '#FA1A1D' ? 0xffffff : 0xfa1a1d).convertSRGBToLinear();
    sleeves[playing].lift.add(dot);
  };

  // The record in flight from the crate to the turntable.
  const flying = new THREE.Group();
  flying.visible = false;
  parent.add(flying);
  const flyDisc = new THREE.Mesh(new THREE.CylinderGeometry(LP, LP, 0.0025, 72), [vinylEdge, vinyl, vinyl]);
  flying.add(flyDisc);
  const flyLabelMat = paper(labelTex[0]);
  const flyLabel = new THREE.Mesh(new THREE.CircleGeometry(LABEL, 48), flyLabelMat);
  flyLabel.rotation.x = -Math.PI / 2;
  flyLabel.position.y = 0.0014;
  flying.add(flyLabel);

  // Pictures, label icons and the cover scenes arrive after the first paint; repaint as each one does.
  const repaint = (t2, cv) => { t2.image = cv; t2.needsUpdate = true; };
  records.forEach((r, i) => {
    loadImage(r.image).then((img) => {
      repaint(sleeveFace[i], drawSleeve(r, img));
      repaint(coverFront[i], drawCoverFront(r, img));
    });
    labelIconImage(r.icon).then((icon) => repaint(labelTex[i], drawLabel(r, readable(icon, 200, 200))));
    sceneImage(r.scene).then((scene) => repaint(coverBack[i], drawCoverBack(r, readable(scene, 632, 540))));
  });
  // Fonts can arrive after the first paint too; one more pass a moment later picks them up.
  setTimeout(() => {
    records.forEach((r, i) => {
      loadImage(r.image).then((img) => { repaint(sleeveFace[i], drawSleeve(r, img)); repaint(coverFront[i], drawCoverFront(r, img)); });
      labelIconImage(r.icon).then((icon) => repaint(labelTex[i], drawLabel(r, readable(icon, 200, 200))));
      repaint(standDiscMats[i], drawSleeveDisc(r));
      repaint(sleeveBack[i], drawBack(r, (projectsData[i] && projectsData[i].techStack) || []));
    });
    markPlaying();
  }, 1800);

  // ---------------------------------------------------------------- state
  let playing = 0, stopped = false, cue = null, dropAt = -1, dig = -1, hold = -1, follow = false, coverHover = false, coverSticky = false, coverHold = false, flipK = 0, wasFlipped = false;
  let speed = RPM, angle = 0, arm = ARM_PLAY, armLift = 0, t = 0, focused = false, glow = 0.9, themeTimer = 0;
  const damp = (rate, dt) => 1 - Math.exp(-rate * dt);
  const v = new THREE.Vector3(), q0 = new THREE.Quaternion(), q1 = new THREE.Quaternion(), from = new THREE.Vector3(), to = new THREE.Vector3();
  const tell = () => onChange && onChange({ i: playing, stopped });
  const showCover = (i) => {
    frontMat.map = coverFront[i];
    backMat.map = coverBack[i];
    standDiscMat.map = standDiscMats[i];
  };

  /** Puts record `i` on. `fromCrate`: picked in the crate's own view (a phone), so the camera follows it over. */
  const play = (i, fromCrate = false) => {
    i = ((i % records.length) + records.length) % records.length;
    if (cue) return;
    if (i === playing) {
      if (stopped) toggle();
      return;
    }
    follow = fromCrate;
    cue = { at: t, i, from: playing, coverSwapped: false };
    playing = i;
    stopped = false;
    dropAt = -1;
    coverSticky = false;
    markPlaying();
    playSlide();
    tell();
  };
  markPlaying();
  const toggle = () => {
    if (cue) return;
    stopped = !stopped;
    if (stopped) {
      dropAt = -1;
      playArmLift();
      playWindDown();
    } else dropAt = t + 0.85;
    tell();
  };

  return {
    pickables,
    glowMeshes,
    get playing() { return playing; },
    /** Changes whenever the tonearm (the only part that casts a shadow and moves) does. */
    get motion() { return arm + armLift; },
    get stopped() { return stopped; },
    play,
    step: (d, fromCrate) => play(playing + d, fromCrate),
    toggle,
    /** The whole set-up on wide screens; on a phone held upright, the turntable and the cover, then the crate. */
    stops(portrait, sel) {
      const n = new THREE.Vector3(0.79, 0.61, -0.04).normalize();
      if (!portrait) return { c: new THREE.Vector3(3.8, 0.36, 2.46), n, w: 1.95, h: 0.85 };
      return [
        { c: new THREE.Vector3(3.78, 0.5, 2.05), n, w: 0.86, h: 0.55 },
        { c: new THREE.Vector3(CRATE.x, 0.27, CRATE.z), n, w: 0.6, h: 0.62 },
      ][Math.max(0, Math.min(1, sel))];
    },
    stopCount: (portrait) => (portrait ? 2 : 1),
    hover(hit) {
      const item = hit ? String(hit.item) : '';
      const over = item.startsWith('sleeve') ? Number(item.slice(6)) : -1;
      // Once a record's picked the crate settles, until the pointer moves on to another sleeve (a tap leaves it there).
      if (over !== hold) hold = -1;
      const d = over === hold ? -1 : over;
      if (d !== dig) {
        dig = d;
        if (d >= 0) playFlick();
      }
      if (item !== 'cover') coverHold = false;
      coverHover = item === 'cover' && !coverHold;
      return over >= 0 || item === 'cover' || item === 'deck' || item === 'button';
    },
    click(hit, sel, portrait) {
      const item = String(hit.item || '');
      if (item.startsWith('sleeve')) {
        hold = Number(item.slice(6));
        dig = -1;
        play(hold, portrait && sel === 1);
      } else if (item === 'cover') {
        // A click or a tap turns it over, and back again.
        const was = coverHover || coverSticky;
        coverSticky = !was;
        coverHold = was;
        coverHover = false;
      } else if (item === 'deck' || item === 'button') toggle();
    },
    update(dt, { focused: on, spot, nk }) {
      t += dt;
      if (!on) { dig = -1; coverHover = false; coverSticky = false; }
      focused = on;
      const want = on || spot ? 1 : 0.9 - nk * 0.48;
      glow += (want - glow) * damp(6, dt);
      papers.forEach((m) => { if (m.map) m.color.setScalar(glow); });

      // the cue: the arm lifts off, the old record goes, the new one flies over and lands, the arm swings in, the needle drops
      let armWant = stopped ? 0 : ARM_PLAY, liftWant = 0, picked = -1, platterWant = stopped ? 0 : RPM;
      if (cue) {
        const k = t - cue.at;
        if (follow && k >= 0.3) {
          follow = false;
          if (onFollow) onFollow(0);
        }
        picked = k < CUE.land + 0.15 ? cue.i : -1;
        armWant = k < CUE.land ? 0 : ARM_PLAY;
        liftWant = k < CUE.drop - 0.05 ? 1 : 0;
        if (k < CUE.land) platterWant = 0;
        record.visible = k < 0.25 || k >= CUE.land;
        record.position.y = 0.012 + (k < 0.25 ? 0.03 * (k / 0.25) : 0);
        if (k >= CUE.land) labelMat.map = labelTex[cue.i];
        // the cover pops out and back in as the new one
        const s = clamp01((k - 0.3) / 0.6);
        const sc = s < 0.5 ? 1 - easeInOut(s * 2) : easeInOut((s - 0.5) * 2);
        flip.scale.setScalar(Math.max(0.001, sc));
        if (s >= 0.5 && !cue.coverSwapped) { cue.coverSwapped = true; showCover(cue.i); }
        // the flight
        const f = clamp01((k - 0.35) / (CUE.land - 0.35));
        flying.visible = k >= 0.35 && k < CUE.land;
        if (flying.visible) {
          const sl = sleeves[cue.i];
          sl.inner.getWorldPosition(from);
          sl.inner.getWorldQuaternion(q0).multiply(q1.setFromAxisAngle(v.set(1, 0, 0), Math.PI / 2));
          record.getWorldPosition(to);
          to.y = TABLE_Y + 0.065 + 0.012 + 0.00125;
          const e = easeInOut(f);
          flying.position.lerpVectors(from, to, e);
          flying.position.y += Math.sin(f * Math.PI) * 0.28;
          spin.getWorldQuaternion(q1);
          flying.quaternion.copy(q0).slerp(q1, e);
          flyLabelMat.map = labelTex[cue.i];
          flyDisc.rotation.y += dt * 9;
          flyLabel.rotation.z += dt * 9;
        }
        if (k >= CUE.drop) {
          playNeedleDrop();
          cue = null;
        }
      } else {
        record.visible = true;
        record.position.y = 0.012;
        flip.scale.setScalar(1);
        if (stopped) liftWant = 0;
      }
      if (dropAt > 0) {
        liftWant = t < dropAt - 0.05 ? 1 : 0;
        if (t >= dropAt) { playNeedleDrop(); dropAt = -1; }
      }
      arm += (armWant - arm) * damp(5, dt);
      armLift += (liftWant - armLift) * damp(10, dt);
      armYaw.rotation.y = arm;
      armPitch.rotation.x = -0.07 * armLift + (armWant === ARM_PLAY && liftWant === 0 ? 0.02 : 0);
      speed += (platterWant - speed) * damp(platterWant > speed ? 2.6 : 1.6, dt);
      angle -= speed * dt; // clockwise, seen from above
      spin.rotation.y = angle;
      btnFace.material.map = stopped ? btnTex.play : btnTex.stop;
      standDisc.rotation.z -= dt * ((Math.PI * 2) / 6);

      // the crate: digging tips the sleeves in front forward and lifts the one pointed at; a picked one's record slides out
      sleeves.forEach((s, i) => {
        const tipWant = on && !cue && dig > i ? 1 : 0;
        const upWant = (on && !cue && dig === i) || picked === i ? 1 : 0;
        const outWant = (on && !cue && dig === i) || picked === i ? 1 : 0;
        s.tip += (tipWant - s.tip) * damp(9, dt);
        s.up += (upWant - s.up) * damp(9, dt);
        s.out += (outWant - s.out) * damp(7, dt);
        s.pivot.rotation.x = -0.14 + s.tip * (TIPPED + 0.14);
        s.pivot.position.y = s.y + s.tip * s.rest;
        s.lift.position.y = s.up * 0.07;
        s.inner.position.x = s.out * 0.19;
        s.inner.rotation.z = -s.out * Math.PI * 2;
        // as on the site: each one further back a little darker, the ones tipped forward darker still, the one dug out bright
        const rest = 1 - i * 0.07;
        const shade = glow * (rest + (1.08 - rest) * s.up) * (1 - 0.5 * s.tip);
        s.face.color.setScalar(shade);
        s.back.color.setScalar(shade);
      });
      const beat = 0.5 - 0.5 * Math.cos((t / 1.6) * Math.PI * 2);
      dotHalo.scale.setScalar(0.0049 + 0.0068 * beat);
      dotHalo.material.opacity = 0.7 * (1 - beat) * glow;
      dotCore.material.color.copy(dotColor).multiplyScalar(glow);

      // the cover turns over while pointed at (or tapped), and its scene's sound plays as it comes round
      const flipped = on && (coverHover || coverSticky);
      if (flipped && !wasFlipped) {
        playFlip();
        clearTimeout(themeTimer);
        const scene = records[playing].scene;
        themeTimer = setTimeout(() => playTheme(scene), 380);
      }
      wasFlipped = flipped;
      flipK += ((flipped ? 1 : 0) - flipK) * damp(7, dt);
      flip.rotation.y = easeInOut(flipK) * Math.PI;

      // surface noise while a record plays and you're there to hear it
      if (on && !stopped && !cue && dropAt < 0) startCrackle();
      else stopCrackle();
    },
  };
}
