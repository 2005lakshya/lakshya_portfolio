// @ts-nocheck
import { FLYERS } from '@/components/experience/flyers';
import { playFilm } from '@/components/site/sfx';
import { clamp01, easeInOut, makeCanvas, spaced, spray, wrap } from './canvasKit';

/**
 * The site's Experience film strip, playing on the desk monitor. The strip winds on to each role in turn, the flyer
 * in the gate flaps, the clapperboard snaps with the scene and take, and the role plays as a subtitle. Pointing at
 * the screen doesn't stop it (it rolls on by itself); clicking a flyer, or either side of the screen, changes scene.
 */

const SW = 1440, SH = 855; // the stage in site px: the site's 1440 x 900 layout, cropped to the monitor's shape
const CW = 1600, CH = Math.round((CW * SH) / SW);
const FRAME = 380, FW = 330, FH = 262, M = 26; // frame pitch, flyer size, and the margin baked around a flyer for its shadow
const X = (i) => 60 + i * FRAME;
const STRIP_Y = 160, STRIP_H = 360;
const LEADERS = [{ i: -2, t: '3' }, { i: -1, t: '2' }, { i: FLYERS.length, t: 'END' }, { i: FLYERS.length + 1, t: '' }];
const FLAP = [0, -28, 10, -12, 4, 0]; // the flap of the flyer in the gate, degrees, over 1.4 s
const CLAP = [[0, -26], [0.4, 0], [0.55, -5], [0.7, 0], [1, 0]]; // the clapper's arm, over 0.7 s
const SUB = { x: 400, y: 560, w: 980, h: 260 };
const HOLD = 5.6; // seconds on each scene
const SCREEN = { x: 1.1, y: 1.75, z: -2.405, w: 1.28, h: 0.76 }; // the monitor's screen in the room, metres
const PX = SCREEN.w / SW; // metres per site px on it
const pad = (n) => `0${n}`;

const keyframes = (frames, k) => {
  for (let i = 1; i < frames.length; i++) {
    const [t1, v1] = frames[i], [t0, v0] = frames[i - 1];
    if (k <= t1) return v0 + (v1 - v0) * ((k - t0) / (t1 - t0 || 1));
  }
  return frames[frames.length - 1][1];
};

const roundRect = (g, x, y, w, h, r) => {
  g.beginPath();
  if (g.roundRect) g.roundRect(x, y, w, h, r);
  else g.rect(x, y, w, h);
};

/** A flyer as the site draws it, on its own canvas with its drop shadow; plus a faded copy for the frames not in the gate. */
function drawFlyer(f, i, logo) {
  const k = 2, cv = makeCanvas((FW + M * 2) * k, (FH + M * 2) * k), g = cv.getContext('2d');
  g.scale(k, k);
  g.translate(M, M);
  g.shadowColor = 'rgba(0,0,0,0.5)';
  g.shadowBlur = 18;
  g.shadowOffsetY = 10;
  g.fillStyle = f.bg;
  g.fillRect(0, 0, FW, FH);
  g.shadowColor = 'transparent';
  g.fillStyle = f.ink;
  g.textBaseline = 'alphabetic';
  let tx = 20;
  if (f.logo) {
    g.fillStyle = '#fff';
    roundRect(g, 20, 18, 48, 48, 8);
    g.fill();
    if (logo) {
      const s = Math.min(42 / logo.width, 42 / logo.height);
      g.drawImage(logo, 44 - (logo.width * s) / 2, 42 - (logo.height * s) / 2, logo.width * s, logo.height * s);
    }
    tx = 80;
  }
  g.fillStyle = f.ink;
  g.font = '20px Anton, Impact, sans-serif';
  spaced(g, f.org.toUpperCase(), tx, f.logo ? 40 : 38, 2);
  g.font = '13px "Special Elite", monospace';
  spaced(g, f.when, tx, f.logo ? 60 : 58, 1.5);
  g.font = `${f.roleSize}px Anton, Impact, sans-serif`;
  g.fillStyle = f.accent;
  const lh = f.roleSize * 0.95;
  const roleTop = 18 + 49 + 12;
  const lines = wrap(g, f.role.toUpperCase(), FW - 40);
  lines.forEach((l, j) => g.fillText(l, 20, roleTop + lh * (j + 0.86)));
  if (f.stats) {
    let sx = 20;
    const sy = roleTop + lh * lines.length + 10;
    f.stats.forEach((s) => {
      g.fillStyle = f.ink;
      g.font = '28px Anton, Impact, sans-serif';
      g.fillText(s.big, sx, sy + 26);
      const w1 = g.measureText(s.big).width;
      g.font = '10px "Special Elite", monospace';
      const w2 = spaced(g, s.small, sx, sy + 40, 1);
      sx += Math.max(w1, w2) + 14;
    });
  }
  g.fillStyle = f.ink;
  g.font = '12px "Special Elite", monospace';
  spaced(g, `SCENE ${pad(i + 1)}`, 20, FH - 14, 1);
  // staples
  g.fillStyle = '#9a9a9a';
  [22, FW - 40].forEach((x) => g.fillRect(x, 8, 18, 5));
  // The frames not in the gate are faded the way the site fades them (mostly grey, half as bright).
  const dim = makeCanvas(cv.width, cv.height), dg = dim.getContext('2d');
  dg.drawImage(cv, 0, 0);
  const img = dg.getImageData(0, 0, dim.width, dim.height), d = img.data;
  for (let p = 0; p < d.length; p += 4) {
    const grey = 0.299 * d[p] + 0.587 * d[p + 1] + 0.114 * d[p + 2];
    for (let c = 0; c < 3; c++) d[p + c] = (d[p + c] * 0.3 + grey * 0.7) * 0.5;
  }
  dg.putImageData(img, 0, 0);
  return { on: cv, off: dim };
}

/**
 * The parts that never move: the black, the heading, and the hint. On a phone held upright only the middle of the
 * screen is in view (the flyer in the gate, close enough to read), so there the heading is smaller, over the middle,
 * and the hint (which is for a pointer) is left out.
 */
function drawBackdrop(portrait) {
  const cv = makeCanvas(CW, CH), g = cv.getContext('2d');
  g.fillStyle = '#0b0b0c';
  g.fillRect(0, 0, CW, CH);
  const v = g.createRadialGradient(CW / 2, CH * 0.45, CH * 0.2, CW / 2, CH / 2, CW * 0.7);
  v.addColorStop(0, 'rgba(255,255,255,0.03)');
  v.addColorStop(1, 'rgba(0,0,0,0.35)');
  g.fillStyle = v;
  g.fillRect(0, 0, CW, CH);
  g.scale(CW / SW, CW / SW);
  const drips = [{ x: 0.833, y: 1.0, h: 0.52, w: 0.052 }, { x: 3.458, y: 0.85, h: 0.4, w: 0.042 }];
  if (portrait) {
    g.font = '58px "Permanent Marker", cursive';
    spray(g, 'EXPERIENCE', SW / 2 - g.measureText('EXPERIENCE').width / 2, 66, 58, { drips });
    return cv;
  }
  spray(g, 'EXPERIENCE', 70, 34, 88, { drips });
  g.fillStyle = '#5c5c5c';
  g.font = '700 13px "Space Mono", monospace';
  spaced(g, 'CLICK A FLYER, OR EITHER SIDE', SW - 60, SH - 26, 3, 'right');
  return cv;
}

export function buildExperienceReel(THREE, { screen, codeTex, maxAniso, onChange }) {
  const canvas = makeCanvas(CW, CH), g = canvas.getContext('2d');
  const tex = new THREE.CanvasTexture(canvas);
  tex.encoding = THREE.sRGBEncoding;
  tex.anisotropy = maxAniso;
  screen.userData.spot = 'experience';
  screen.userData.item = 'screen';

  let portrait = false, dirty = true;
  let backdrop = drawBackdrop(portrait);
  const logos = {};
  let flyers = FLYERS.map((f, i) => drawFlyer(f, i, null));
  // Logos arrive after the first draw; repaint those flyers once they do.
  FLYERS.forEach((f, i) => {
    if (!f.logo) return;
    const im = new Image();
    im.onload = () => { logos[i] = im; flyers[i] = drawFlyer(f, i, im); dirty = true; };
    im.src = f.logo;
  });
  // Fonts can finish loading after the first paint, so paint the fixed parts once more a moment later.
  setTimeout(() => { backdrop = drawBackdrop(portrait); flyers = FLYERS.map((f, i) => drawFlyer(f, i, logos[i] || null)); dirty = true; }, 1500);

  let cur = 0, turnAt = -10, shiftFrom = 0, shiftAt = -10, held = false, wait = 0, t = 0, acc = 1, active = false;
  const shiftOf = (i) => SW / 2 - (X(i) + FW / 2);
  let shiftTo = shiftOf(0);
  shiftFrom = shiftTo;

  const go = (i, sound) => {
    i = ((i % FLYERS.length) + FLYERS.length) % FLYERS.length;
    if (i === cur) return;
    shiftFrom = shiftNow();
    shiftTo = shiftOf(i);
    shiftAt = t;
    cur = i;
    turnAt = t;
    wait = 0;
    if (sound) playFilm();
    onChange && onChange(cur);
  };
  const shiftNow = () => shiftFrom + (shiftTo - shiftFrom) * easeInOut(clamp01((t - shiftAt) / 1.0));

  function draw() {
    g.setTransform(1, 0, 0, 1, 0, 0);
    g.drawImage(backdrop, 0, 0);
    const k = CW / SW;
    g.setTransform(k, 0, 0, k, 0, 0);
    const shift = shiftNow();
    // the strip, a degree off level
    g.save();
    g.translate(SW / 2, STRIP_Y + STRIP_H / 2);
    g.rotate((-1 * Math.PI) / 180);
    g.translate(-SW / 2, -STRIP_H / 2);
    g.fillStyle = '#171717';
    g.fillRect(-120, 0, SW + 240, STRIP_H);
    g.fillStyle = '#2E2E2E';
    g.fillRect(-120, 0, SW + 240, 1);
    g.fillRect(-120, STRIP_H - 1, SW + 240, 1);
    g.fillStyle = '#000';
    const off = ((shift % 40) + 40) % 40;
    for (let x = -160 + off; x < SW + 160; x += 40) {
      g.fillRect(x + 10, 10, 20, 18);
      g.fillRect(x + 10, STRIP_H - 28, 20, 18);
    }
    LEADERS.forEach((l) => {
      const x = X(l.i) + shift;
      if (x > SW + 40 || x + FW < -40) return;
      g.fillStyle = '#1E1B18';
      g.fillRect(x, 44, FW, FH);
      g.fillStyle = '#3A352E';
      g.font = '90px "Permanent Marker", cursive';
      g.textAlign = 'center';
      g.textBaseline = 'middle';
      g.fillText(l.t, x + FW / 2, 44 + FH / 2);
      g.textAlign = 'left';
      g.textBaseline = 'alphabetic';
    });
    FLYERS.forEach((f, i) => {
      const x = X(i) + shift;
      if (x > SW + 40 || x + FW < -40) return;
      const on = i === cur;
      g.save();
      g.translate(x + FW / 2, 44);
      g.rotate((f.tilt * Math.PI) / 180);
      if (on) {
        // The flap: the sheet swings on its staples, drawn as the top-hinged squash it makes on screen.
        const a = keyframes(FLAP.map((v, j) => [j / (FLAP.length - 1), v]), clamp01((t - turnAt) / 1.4));
        g.scale(1, Math.cos((a * Math.PI) / 180));
      }
      const pic = on ? flyers[i].on : flyers[i].off;
      g.drawImage(pic, -FW / 2 - M, -M, FW + M * 2, FH + M * 2);
      g.restore();
    });
    g.restore();
    // (on a phone held upright the clapperboard and the subtitle are out of view; the page shows the role instead)
    if (portrait) {
      tex.needsUpdate = true;
      return;
    }

    // the clapperboard
    const f = FLYERS[cur];
    g.save();
    g.translate(60, 560);
    g.strokeStyle = '#F4F4F4';
    g.lineWidth = 4;
    g.lineJoin = 'round';
    g.shadowColor = 'rgba(255,255,255,0.45)';
    g.shadowBlur = 6;
    roundRect(g, 20, 84, 260, 150, 6);
    g.stroke();
    g.beginPath();
    g.moveTo(20, 124);
    g.lineTo(280, 124);
    g.moveTo(150, 124);
    g.lineTo(150, 234);
    g.stroke();
    g.save();
    g.translate(24, 84);
    g.rotate((keyframes(CLAP, clamp01((t - turnAt) / 0.7)) * Math.PI) / 180);
    g.translate(-24, -84);
    roundRect(g, 20, 50, 260, 34, 4);
    g.stroke();
    g.beginPath();
    [44, 94, 144, 194, 244].forEach((x) => {
      g.moveTo(x, 50);
      g.lineTo(x + 18, 84);
    });
    g.stroke();
    g.restore();
    g.shadowColor = 'transparent';
    g.textBaseline = 'top';
    g.fillStyle = '#F4F4F4';
    g.font = '24px "Permanent Marker", cursive';
    g.fillText('SCENE', 32, 136);
    g.fillText('TAKE', 162, 136);
    g.fillStyle = '#FFD23F';
    g.font = '40px "Permanent Marker", cursive';
    g.fillText(pad(cur + 1), 40, 174);
    g.fillText(f.take, 166, 174);
    g.restore();

    // the subtitle: who and what, then the role typed out from the left
    g.font = '700 25px Arial, Helvetica, sans-serif';
    const lines = wrap(g, f.text, SUB.w - 40);
    const lh = 25 * 1.45;
    const total = 20 + 14 + lines.length * lh;
    let y = SUB.y + (SUB.h - total) / 2;
    g.textAlign = 'center';
    g.textBaseline = 'top';
    g.fillStyle = '#BDB3A6';
    g.font = '700 13px "Space Mono", monospace';
    spaced(g, `${f.org.toUpperCase()} · ${f.role.toUpperCase()}`, SUB.x + SUB.w / 2, y, 4, 'center');
    y += 34;
    g.save();
    const reveal = Math.floor(clamp01((t - turnAt - 0.3) / 1.8) * 40) / 40;
    g.beginPath();
    g.rect(SUB.x, y - 6, SUB.w * reveal, lines.length * lh + 12);
    g.clip();
    g.font = '700 25px Arial, Helvetica, sans-serif';
    g.lineJoin = 'round';
    g.lineWidth = 5;
    g.strokeStyle = '#000';
    g.fillStyle = '#ffe45c';
    lines.forEach((l, j) => {
      g.strokeText(l, SUB.x + SUB.w / 2, y + j * lh);
      g.fillText(l, SUB.x + SUB.w / 2, y + j * lh);
    });
    g.restore();
    g.textAlign = 'left';
    tex.needsUpdate = true;
  }

  return {
    get index() { return cur; },
    /** The whole screen; on a phone held upright, the middle of it: the heading and the flyer in the gate. */
    stops: (upright) => (upright
      ? { c: new THREE.Vector3(SCREEN.x, SCREEN.y + SCREEN.h / 2 - 296 * PX, SCREEN.z), n: new THREE.Vector3(0, 0, 1), w: 450 * PX, h: 500 * PX }
      : { c: new THREE.Vector3(SCREEN.x, SCREEN.y, SCREEN.z), n: new THREE.Vector3(0, 0, 1), w: 1.3, h: 0.78 }),
    stopCount: () => 1,
    /** The strip keeps rolling by itself, pointer or not (a click still picks a scene). */
    hover(hit) {
      return !!hit;
    },
    click(hit) {
      if (!hit || !hit.uv) return;
      const sx = hit.uv.x * SW, sy = (1 - hit.uv.y) * SH;
      if (sy > STRIP_Y && sy < STRIP_Y + STRIP_H) {
        const shift = shiftNow();
        const i = FLYERS.findIndex((_, j) => sx >= X(j) + shift && sx <= X(j) + shift + FW);
        if (i >= 0) return go(i, true);
      }
      go(cur + (sx < SW / 2 ? -1 : 1), true);
    },
    step: (d) => go(cur + d, true),
    update(dt, { focused, portrait: upright }) {
      t += dt;
      if (focused && !active) { turnAt = t; wait = 0; acc = 1; }
      active = focused;
      if (!!upright !== portrait) { portrait = !!upright; backdrop = drawBackdrop(portrait); dirty = true; }
      screen.material.map = focused ? tex : codeTex;
      if (!focused) { held = false; return; }
      if (!held) {
        wait += dt;
        // Winding on by itself stays quiet; only a scene the visitor picked makes a sound.
        if (wait >= HOLD) go(cur + 1, false);
      }
      acc += dt;
      // Drawn (and sent to the GPU) only while something on it moves: the strip winding on, the flyer's flap, the
      // clapper and the subtitle typing out, all within a couple of seconds of a scene change; then once more at rest.
      // In between, the same frame would be drawn and uploaded thirty times a second for nothing.
      const busy = t - turnAt < 2.4;
      if (acc >= 1 / 30 && (busy || dirty)) { acc = 0; dirty = busy; draw(); }
    },
  };
}
