// @ts-nocheck
import { contactData } from '@/data/portfolio';
import { CELLS, FILL_ORDER, TABS, WORDS } from '@/components/contact/contactInfo';
import { playChirp, playRun, playSlap, playTear, playTick } from '@/components/site/sfx';
import { blackPaint, clamp01, makeCanvas, newsprint, shadowCanvasOnce, spaced, spacedWidth, spray, wrap } from './canvasKit';

/**
 * The site's Contact wall, pasted up on the back wall of the room between the quote and the bedroom window:
 *  - the "NEED A DEVELOPER?" flyer, whose tear-off tabs copy a way to reach me and grow back,
 *  - The Daily Lakshya's crossword, where every answer is a way to reach me (click a clue, then the answer),
 *  - the coupon to clip and send, and the visitor's tag sprayed on the wall as they type it.
 * The typing itself happens in a small bar the page shows; everything else is here, in the room.
 * Sizes are the site's, at 1 px = 1 mm.
 */

const Z = -2.785; // just off the back wall
const S = 2; // canvas pixels per site pixel
const FLYER = { x: 2.71, top: 2.865, w: 0.42 };
const PAGE = { x: 3.24, top: 2.885, w: 0.48 };
const COUPON = { x: 3.735, y: 2.64, w: 0.35, h: 0.25 };
const TAG = { x: 3.765, y: 3.0, w: 0.5, h: 0.24 };
const HEAD = { x: 3.15, y: 3.06, w: 0.66 };

const roundRect = (g, x, y, w, h, r) => {
  g.beginPath();
  if (g.roundRect) g.roundRect(x, y, w, h, r);
  else g.rect(x, y, w, h);
};

/** The flyer, without its tabs: tape at the top, the pitch, my name in red marker, where I am. */
function drawFlyer() {
  const W = 420, H = 300, TOP = 12; // TOP: room above the paper for the tape
  const cv = makeCanvas(W * S, (H + TOP) * S), g = cv.getContext('2d');
  g.scale(S, S);
  g.fillStyle = '#F4F0E6';
  g.fillRect(0, TOP, W, H);
  g.fillStyle = '#111';
  g.textBaseline = 'alphabetic';
  let y = TOP + 24;
  g.font = '52px Anton, Impact, sans-serif';
  g.fillText('NEED A', 26, y + 46);
  g.fillText('DEVELOPER?', 26, y + 46 + 49);
  y += 99 + 10;
  g.font = '18px "Special Elite", monospace';
  spaced(g, 'apps · websites · AI', 26, y + 18, 1);
  y += 27 + 12;
  g.save();
  g.translate(26, y);
  g.scale(58 / 70, 34 / 40);
  g.strokeStyle = '#FA1A1D';
  g.lineWidth = 3.5;
  g.lineCap = 'round';
  g.lineJoin = 'round';
  g.stroke(new Path2D('M4 30 C 20 6, 44 4, 62 18 M50 8 L63 18 L50 28'));
  g.restore();
  g.fillStyle = '#FA1A1D';
  g.font = '30px "Permanent Marker", cursive';
  g.fillText('Lakshya Gupta', 26 + 58 + 12, y + 29);
  y += 42 + 8;
  g.fillStyle = '#111';
  g.font = '15px "Special Elite", monospace';
  g.fillText('Looking for summer internships.', 26, y + 16);
  g.fillText(`Based in ${contactData.location}.`, 26, y + 16 + 22.5);
  // two strips of tape
  g.fillStyle = 'rgba(230,230,220,0.6)';
  [[84, -5], [W - 84, 4]].forEach(([cx, deg]) => {
    g.save();
    g.translate(cx, TOP);
    g.rotate((deg * Math.PI) / 180);
    g.fillRect(-40, -12, 80, 24);
    g.restore();
  });
  return { canvas: cv, w: W / 1000, h: (H + TOP) / 1000, paperTop: TOP / 1000 };
}

/** One tear-off tab, its text running up the strip. */
function drawTab(label, first) {
  const W = 70, H = 196;
  const cv = makeCanvas(W * S, H * S), g = cv.getContext('2d');
  g.scale(S, S);
  g.fillStyle = '#f4f0e6';
  g.fillRect(0, 0, W, H);
  if (!first) {
    g.strokeStyle = 'rgba(0,0,0,0.35)';
    g.lineWidth = 2;
    g.setLineDash([5, 4]);
    g.beginPath();
    g.moveTo(1, 0);
    g.lineTo(1, H);
    g.stroke();
  }
  g.save();
  g.translate(W / 2, H - 14);
  g.rotate(-Math.PI / 2);
  g.fillStyle = '#111';
  let size = 14;
  g.font = `${size}px "Special Elite", monospace`;
  while (g.measureText(label).width > H - 24 && size > 9) g.font = `${--size}px "Special Elite", monospace`;
  g.textBaseline = 'middle';
  g.fillText(label, 0, 0);
  g.restore();
  return cv;
}

/** The coupon: dashed edge, what it's good for, and the CLIP & SEND button. */
function drawCoupon() {
  const W = 350, H = 250;
  const cv = makeCanvas(W * S, H * S), g = cv.getContext('2d');
  g.scale(S, S);
  newsprint(g, W, H);
  g.strokeStyle = '#151515';
  g.lineWidth = 3;
  g.setLineDash([9, 6]);
  g.strokeRect(1.5, 1.5, W - 3, H - 3);
  g.setLineDash([]);
  g.fillStyle = '#151515';
  g.textBaseline = 'alphabetic';
  g.font = '700 11px "Old Standard TT", Georgia, serif';
  spaced(g, 'CLIP AND SEND', 22, 18 + 12, 3);
  g.font = '40px Anton, Impact, sans-serif';
  g.fillText('COUPON', 22, 18 + 16 + 4 + 36);
  g.font = '15px "Old Standard TT", Georgia, serif';
  const words = 'one project collab, one internship chat, or one very long code review.';
  g.font = '700 15px "Old Standard TT", Georgia, serif';
  const lead = 'Good for: ';
  const leadW = g.measureText(lead).width;
  g.font = '15px "Old Standard TT", Georgia, serif';
  const lines = wrap(g, words, W - 44 - leadW);
  let y = 18 + 16 + 4 + 38 + 8 + 15;
  g.font = '700 15px "Old Standard TT", Georgia, serif';
  g.fillText(lead, 22, y);
  g.font = '15px "Old Standard TT", Georgia, serif';
  g.fillText(lines[0], 22 + leadW, y);
  const rest = wrap(g, lines.slice(1).join(' '), W - 44);
  rest.forEach((l, i) => g.fillText(l, 22, y + 21 * (i + 1)));
  y += 21 * rest.length + 4 + 15;
  g.font = 'italic 13px "Old Standard TT", Georgia, serif';
  g.fillText('No expiry. Coffee not included.', 22, y);
  // the button
  g.font = '19px Anton, Impact, sans-serif';
  const label = 'CLIP & SEND';
  const bw = spacedWidth(g, label, 1) + 46; // 20 px padding and a 3 px border each side
  g.fillStyle = '#151515';
  g.fillRect(W - 20 - bw, H - 16 - 46, bw, 46);
  g.fillStyle = '#EAE5D9';
  spaced(g, label, W - 20 - bw / 2, H - 16 - 15, 1, 'center');
  return cv;
}

/** The scissors that cut the coupon out. */
function drawScissors() {
  const cv = makeCanvas(44 * S, 30 * S), g = cv.getContext('2d');
  g.scale(S, S);
  g.lineWidth = 3;
  g.strokeStyle = '#151515';
  g.fillStyle = '#FA1A1D';
  [[8, 7], [8, 23]].forEach(([x, y]) => {
    g.beginPath();
    g.arc(x, y, 6, 0, Math.PI * 2);
    g.fill();
    g.stroke();
  });
  g.lineCap = 'round';
  g.beginPath();
  g.moveTo(13, 10);
  g.lineTo(42, 22);
  g.moveTo(13, 20);
  g.lineTo(42, 8);
  g.stroke();
  return cv;
}

/**
 * The crossword page. Returns the canvas and the places you can click on it (clues, and the answers once solved),
 * in canvas pixels.
 */
function drawPage(cv, state, big = false) {
  const W = 480, H = cv.height / S;
  const g = cv.getContext('2d');
  g.setTransform(1, 0, 0, 1, 0, 0);
  g.clearRect(0, 0, cv.width, cv.height);
  g.scale(S, S);
  // torn bottom edge and a dog-eared corner, as on the site
  const edge = [[0, 0], [W - 30, 0], [W, 30], [W, H * 0.97], [W * 0.94, H * 0.99], [W * 0.86, H * 0.975], [W * 0.77, H], [W * 0.66, H * 0.98], [W * 0.55, H * 0.995], [W * 0.44, H * 0.975], [W * 0.33, H * 0.995], [W * 0.21, H * 0.98], [W * 0.1, H], [0, H * 0.98]];
  g.save();
  g.beginPath();
  edge.forEach(([x, y], i) => (i ? g.lineTo(x, y) : g.moveTo(x, y)));
  g.closePath();
  g.clip();
  newsprint(g, W, H);
  g.restore();
  g.fillStyle = '#cfc8b6';
  g.beginPath();
  g.moveTo(W - 30, 0);
  g.lineTo(W - 30, 30);
  g.lineTo(W, 30);
  g.closePath();
  g.fill();

  const hits = [];
  const ink = '#151515';
  g.fillStyle = ink;
  g.textBaseline = 'alphabetic';
  g.font = '30px UnifrakturMaguntia, serif';
  g.fillText('The Daily Lakshya', 22, 20 + 26);
  g.font = '700 11px "Old Standard TT", Georgia, serif';
  spaced(g, 'PUZZLES · PAGE 6', W - 22 - 20, 20 + 24, 2, 'right');
  g.fillRect(22, 58, W - 44, 3);
  g.fillRect(22, 62, W - 44, 1);
  g.font = '30px Anton, Impact, sans-serif';
  spaced(g, 'EVERY ANSWER REACHES LAKSHYA', 22, 72 + 27, 0.5);

  // the grid
  const cell = 30, gx = (W - cell * 12) / 2, gy = 116;
  CELLS.forEach((c) => {
    const hit = c.words.find((x) => state.solved[x.w]);
    const fresh = c.words.find((x) => x.w === state.last);
    const x = gx + c.c * cell, y = gy + c.r * cell;
    g.fillStyle = fresh && hit ? '#FFF4C2' : '#FFFFFF';
    g.fillRect(x, y, cell, cell);
    g.strokeStyle = ink;
    g.lineWidth = 1.5;
    g.strokeRect(x + 0.75, y + 0.75, cell - 1.5, cell - 1.5);
    if (c.num !== '') {
      g.fillStyle = ink;
      g.font = '700 8px "Old Standard TT", Georgia, serif';
      g.fillText(String(c.num), x + 2.5, y + 8);
    }
    if (hit) {
      // letters pop in one after another, the newest answer in red
      const wordAt = state.at[hit.w] ?? -10;
      const k = fresh ? clamp01((state.t - wordAt - fresh.i * 0.09) / 0.3) : 1;
      if (k <= 0) return;
      g.save();
      g.globalAlpha = k;
      g.translate(x + cell / 2, y + cell * 0.12 + (1 - k) * -12);
      g.scale(1 + (1 - k) * 0.4, 1 + (1 - k) * 0.4);
      g.fillStyle = fresh ? '#D8161A' : ink;
      g.font = `${cell * 0.6}px Anton, Impact, sans-serif`;
      g.textAlign = 'center';
      g.textBaseline = 'top';
      g.fillText(c.ch, 0, 0);
      g.restore();
    }
  });

  // the clues
  // The clues: in two columns; or, on a phone held upright (`big`), in one column in type big enough to read there.
  const T = big ? { head: 21, clue: 19, lh: 24.5, ans: 14.5, alh: 19.5 } : { head: 16, clue: 14, lh: 18.2, ans: 11, alh: 14.85 };
  const colW = big ? W - 44 : (W - 44 - 16) / 2;
  let below = gy + cell * 10 + 14;
  [['across', 22], ['down', big ? 22 : 22 + colW + 16]].forEach(([dir, cx]) => {
    let y = big ? below : gy + cell * 10 + 14;
    g.fillStyle = ink;
    g.font = `${T.head}px Anton, Impact, sans-serif`;
    spaced(g, dir.toUpperCase(), cx, y + T.head + 1, 1);
    y += T.head + 8;
    g.fillRect(cx, y, colW, 2);
    y += 2;
    WORDS.filter((w) => w.dir === dir).forEach((word) => {
      const top = y;
      const text = `${word.clue} (${word.w.length})`;
      g.font = `700 ${T.clue}px "Old Standard TT", Georgia, serif`;
      const numW = g.measureText(`${word.n}. `).width;
      g.font = `${T.clue}px "Old Standard TT", Georgia, serif`;
      const lines = wrap(g, text, colW - 12 - numW);
      const hovered = state.hover && state.hover.kind === 'clue' && state.hover.w === word.w;
      const answerLines = state.solved[word.w] ? (() => { g.font = `${T.ans}px "Space Mono", monospace`; return wrap(g, word.value.replace(/@/g, '@​'), colW - 12); })() : [];
      const clueH = 10 + lines.length * T.lh;
      const h = clueH + (answerLines.length ? answerLines.length * T.alh + 5 : 0);
      if (hovered) {
        g.fillStyle = 'rgba(216,22,26,0.12)';
        g.fillRect(cx, top, colW, clueH);
      }
      g.fillStyle = ink;
      g.font = `700 ${T.clue}px "Old Standard TT", Georgia, serif`;
      g.fillText(`${word.n}.`, cx + 6, top + 5 + T.clue);
      g.font = `${T.clue}px "Old Standard TT", Georgia, serif`;
      lines.forEach((l, i) => g.fillText(l, cx + 6 + numW, top + 5 + T.clue + i * T.lh));
      hits.push({ kind: 'clue', w: word.w, x: cx, y: top, wd: colW, h: clueH });
      if (answerLines.length) {
        const ay = top + clueH;
        const linkHover = state.hover && state.hover.kind === 'answer' && state.hover.w === word.w;
        g.fillStyle = '#d8161a';
        g.font = `${T.ans}px "Space Mono", monospace`;
        answerLines.forEach((l, i) => {
          const s = i === answerLines.length - 1 && word.href ? `${l} ↗` : l;
          g.fillText(s, cx + 6, ay + T.ans + i * T.alh);
          if (linkHover) g.fillRect(cx + 6, ay + T.ans + 2 + i * T.alh, g.measureText(s).width, 1);
        });
        if (word.href) hits.push({ kind: 'answer', w: word.w, href: word.href, x: cx, y: ay, wd: colW, h: answerLines.length * T.alh + 5 });
      }
      y = top + h;
      g.strokeStyle = 'rgba(21,21,21,0.5)';
      g.lineWidth = 1;
      g.setLineDash([1, 2]);
      g.beginPath();
      g.moveTo(cx, y + 0.5);
      g.lineTo(cx + colW, y + 0.5);
      g.stroke();
      g.setLineDash([]);
    });
    below = y + 22;
  });
  return hits;
}

/** The tag sprayed on the wall: yellow marker with a glow, fitted to the space, on up to three lines. */
function drawTag(cv, text, reveal) {
  const g = cv.getContext('2d');
  g.setTransform(1, 0, 0, 1, 0, 0);
  g.clearRect(0, 0, cv.width, cv.height);
  const W = cv.width, H = cv.height, maxW = W * 0.86;
  let size = 150, lines = [text];
  for (; size > 40; size -= 6) {
    g.font = `${size}px "Permanent Marker", cursive`;
    lines = wrap(g, text, maxW);
    if (lines.length <= 3 && lines.every((l) => g.measureText(l).width <= maxW) && lines.length * size * 1.05 <= H * 0.86) break;
  }
  g.save();
  if (reveal < 1) {
    g.beginPath();
    g.rect(0, 0, W * reveal, H);
    g.clip();
  }
  g.translate(W / 2, H / 2);
  g.rotate((-4 * Math.PI) / 180);
  g.textAlign = 'center';
  g.textBaseline = 'middle';
  g.fillStyle = '#ffd23f';
  const y0 = (-(lines.length - 1) * size * 1.05) / 2;
  [[18, 'rgba(255,210,63,0.45)'], [3, 'rgba(255,210,63,0.9)']].forEach(([blur, color]) => {
    g.shadowBlur = blur * (size / 84);
    g.shadowColor = color;
    lines.forEach((l, i) => g.fillText(l, 0, y0 + i * size * 1.05));
  });
  g.restore();
}

export function buildContactWall(THREE, { parent, maxAniso, onToast, onCoupon, onTagClick }) {
  const group = new THREE.Group();
  group.position.z = Z;
  group.userData.keep = true;
  parent.add(group);
  const tex = (cv) => {
    const t = new THREE.CanvasTexture(cv);
    t.encoding = THREE.sRGBEncoding;
    t.anisotropy = maxAniso;
    return t;
  };
  // True colours for the paper (see the achievement wall): dims with the room at night, full when you look at it.
  const mats = [];
  const paper = (t, extra = {}) => {
    const m = new THREE.MeshBasicMaterial(Object.assign({ map: t, toneMapped: false }, extra));
    mats.push(m);
    return m;
  };
  const shadowMat = new THREE.MeshBasicMaterial({ map: tex(shadowCanvasOnce()), transparent: true, opacity: 0.3, depthWrite: false });
  const pickables = [];
  const tag = (m, item) => {
    m.userData.spot = 'contact';
    if (item) m.userData.item = item;
    pickables.push(m);
    return m;
  };
  const sheet = (w, h, mat, x, y, z, item) => {
    const m = tag(new THREE.Mesh(new THREE.PlaneGeometry(w, h), mat), item);
    m.position.set(x, y, z);
    return m;
  };
  const shadow = (w, h, x, y, rot = 0) => {
    const m = new THREE.Mesh(new THREE.PlaneGeometry(w * 1.45, h * 1.35), shadowMat);
    m.position.set(x + 0.006, y - 0.012, 0.0005);
    m.rotation.z = rot;
    group.add(m);
    return m;
  };

  // A stretch of wall painted black for the posters, like the site's contact wall.
  {
    const w = 1.62, h = 1.24;
    const board = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshStandardMaterial({ map: tex(blackPaint(1620, 1240, 7)), transparent: true, roughness: 1, metalness: 0, envMapIntensity: 0.1 }));
    board.position.set(3.23, 2.68, -0.002);
    group.add(board);
  }

  // The heading, sprayed, and the "STICK NO BILLS" stencil, faint, under the coupon.
  {
    const cv = makeCanvas(1150, 300), g = cv.getContext('2d');
    spray(g, 'CONTACT ME', 30, 50, 150, { drips: [{ x: 1.16, y: 1.04, h: 0.38, w: 0.05 }] });
    const h = (HEAD.w * cv.height) / cv.width;
    group.add(sheet(HEAD.w, h, paper(tex(cv), { transparent: true, depthWrite: false }), HEAD.x, HEAD.y, 0.002));
    const st = makeCanvas(760, 90), sg = st.getContext('2d');
    sg.fillStyle = 'rgba(244,244,244,0.16)';
    sg.font = '62px Anton, Impact, sans-serif';
    spaced(sg, 'STICK NO BILLS', 380, 72, 14, 'center');
    const stencil = new THREE.Mesh(new THREE.PlaneGeometry(0.34, 0.04), new THREE.MeshBasicMaterial({ map: tex(st), transparent: true, depthWrite: false, toneMapped: false }));
    stencil.position.set(COUPON.x, COUPON.y - COUPON.h / 2 - 0.09, 0.001);
    stencil.rotation.z = (2 * Math.PI) / 180;
    group.add(stencil);
  }

  // The flyer and its tabs, a degree and a half off straight like on the site.
  const flyerGroup = new THREE.Group();
  flyerGroup.rotation.z = (1.5 * Math.PI) / 180;
  const fl = drawFlyer();
  flyerGroup.position.set(FLYER.x, FLYER.top - fl.h, 0.004); // the group's origin is the flyer's bottom edge
  group.add(flyerGroup);
  {
    const m = sheet(fl.w, fl.h, paper(tex(fl.canvas), { transparent: true, alphaTest: 0.02 }), 0, fl.h / 2, 0, 'flyer');
    flyerGroup.add(m);
    const sh = new THREE.Mesh(new THREE.PlaneGeometry(fl.w * 1.35, (fl.h + 0.2) * 1.2), shadowMat);
    sh.position.set(0.006, fl.h / 2 - 0.1 - 0.012, -0.003);
    flyerGroup.add(sh);
  }
  const tabW = fl.w / TABS.length, tabH = 0.196;
  const tabs = TABS.map((tb, i) => {
    if (tb.gone) return null;
    const geo = new THREE.PlaneGeometry(tabW, tabH);
    geo.translate(0, -tabH / 2, 0); // hangs from the flyer
    const mat = paper(tex(drawTab(tb.label, i === 0)), { transparent: true });
    const m = tag(new THREE.Mesh(geo, mat), `tab${i}`);
    m.position.set(-fl.w / 2 + tabW * (i + 0.5), 0.001, 0.001);
    flyerGroup.add(m);
    return { m, mat, i, copy: tb.copy, mode: 'on', at: 0, hover: 0 };
  });

  // The crossword page.
  const state = { solved: {}, last: '', at: {}, t: 0, hover: null, touched: false, dirty: true, nextFill: 0 };
  // The page's height with every answer filled in, so it doesn't grow on the wall: for the usual two columns of clues,
  // and for the one column of big type it's set in on a phone held upright.
  const heightFor = (big) => {
    const probe = makeCanvas(480 * S, 1400 * S);
    const all = { ...state, solved: Object.fromEntries(WORDS.map((w) => [w.w, true])) };
    const hits = drawPage(probe, all, big);
    return Math.ceil(Math.max(...hits.map((h) => h.y + h.h)) + 40);
  };
  const PAGE_H = [heightFor(false), heightFor(true)];
  let big = false, pageH = PAGE_H[0], pageWH = pageH / 1000;
  const pageCanvas = makeCanvas(480 * S, pageH * S);
  const pageTex = tex(pageCanvas);
  let pageHits = drawPage(pageCanvas, state, big);
  const pageW = PAGE.w;
  const page = sheet(pageW, pageWH, paper(pageTex, { transparent: true, alphaTest: 0.02 }), PAGE.x, PAGE.top - pageWH / 2, 0.006, 'page');
  page.rotation.z = (-1 * Math.PI) / 180;
  group.add(page);
  const pageShadow = shadow(pageW, pageWH, PAGE.x, PAGE.top - pageWH / 2, page.rotation.z);
  // Set again for the other layout: longer (or back), still hanging from the same top edge.
  const setBig = (b) => {
    if (b === big) return;
    big = b;
    pageH = PAGE_H[b ? 1 : 0];
    pageWH = pageH / 1000;
    pageCanvas.height = pageH * S;
    const k = pageH / PAGE_H[0];
    page.scale.y = k;
    page.position.y = PAGE.top - pageWH / 2;
    pageShadow.scale.y = k;
    pageShadow.position.y = PAGE.top - pageWH / 2 - 0.012;
    state.dirty = true;
  };

  // The coupon, the scissors, and what gets sprayed when it's sent.
  const couponGroup = new THREE.Group();
  couponGroup.position.set(COUPON.x, COUPON.y, 0.004);
  couponGroup.rotation.z = (1 * Math.PI) / 180;
  group.add(couponGroup);
  const couponMat = paper(tex(drawCoupon()), { transparent: true });
  const coupon = tag(new THREE.Mesh(new THREE.PlaneGeometry(COUPON.w, COUPON.h), couponMat), 'coupon');
  couponGroup.add(coupon);
  shadow(COUPON.w, COUPON.h, COUPON.x, COUPON.y);
  const scissors = new THREE.Mesh(new THREE.PlaneGeometry(0.044, 0.03), new THREE.MeshBasicMaterial({ map: tex(drawScissors()), transparent: true, depthWrite: false }));
  scissors.visible = false;
  couponGroup.add(scissors);
  const resultCanvas = makeCanvas(800, 260);
  const resultTex = tex(resultCanvas);
  const result = new THREE.Mesh(new THREE.PlaneGeometry(0.4, 0.13), new THREE.MeshBasicMaterial({ map: resultTex, transparent: true, depthWrite: false, toneMapped: false }));
  result.position.set(COUPON.x, COUPON.y, 0.012);
  result.visible = false;
  group.add(result);
  const paintResult = (ok, reveal) => {
    const g = resultCanvas.getContext('2d');
    g.setTransform(1, 0, 0, 1, 0, 0);
    g.clearRect(0, 0, resultCanvas.width, resultCanvas.height);
    g.save();
    g.beginPath();
    g.rect(0, 0, resultCanvas.width * reveal, resultCanvas.height);
    g.clip();
    g.translate(resultCanvas.width / 2, resultCanvas.height / 2);
    g.rotate((-6 * Math.PI) / 180);
    g.font = '130px "Permanent Marker", cursive';
    g.textAlign = 'center';
    g.textBaseline = 'middle';
    const rgb = ok ? '255,210,63' : '250,26,29';
    g.fillStyle = ok ? '#FFD23F' : '#FA1A1D';
    [[30, 0.45], [5, 0.9]].forEach(([b, a]) => {
      g.shadowBlur = b;
      g.shadowColor = `rgba(${rgb},${a})`;
      g.fillText(ok ? 'SENT!' : 'NOT SENT', 0, 0);
    });
    g.restore();
    resultTex.needsUpdate = true;
  };

  // The tag.
  const tagCanvas = makeCanvas(TAG.w * 2000, TAG.h * 2000);
  const tagTex = tex(tagCanvas);
  let tagText = 'HI LAKSHYA!';
  drawTag(tagCanvas, tagText, 1);
  const tagMesh = sheet(TAG.w, TAG.h, new THREE.MeshBasicMaterial({ map: tagTex, transparent: true, depthWrite: false, toneMapped: false }), TAG.x, TAG.y, 0.002, 'tag');
  group.add(tagMesh);

  // Fonts can arrive after the first paint; paint the paper once more a moment later.
  setTimeout(paperRepaint, 1500);
  function paperRepaint() {
    const f2 = drawFlyer();
    flyerGroup.children[0].material.map.image = f2.canvas;
    flyerGroup.children[0].material.map.needsUpdate = true;
    tabs.forEach((tb) => {
      if (!tb) return;
      tb.mat.map.image = drawTab(TABS[tb.i].label, tb.i === 0);
      tb.mat.map.needsUpdate = true;
    });
    couponMat.map.image = drawCoupon();
    couponMat.map.needsUpdate = true;
    drawTag(tagCanvas, tagText, 1);
    tagTex.needsUpdate = true;
    state.dirty = true;
  }

  let focused = false, glow = 0.9, t = 0, hoverTab = -1;
  let send = null; // { at, ok, done } while a message is going out
  let sprayAt = -10;
  const damp = (rate, dt) => 1 - Math.exp(-rate * dt);

  const solve = (w, sound) => {
    if (state.solved[w]) return;
    state.solved = { ...state.solved, [w]: true };
    state.last = w;
    state.at[w] = state.t;
    state.dirty = true;
    if (sound) {
      // pencilled in, a tick a letter
      const n = w.length;
      for (let i = 0; i < n; i++) setTimeout(playTick, i * 90);
    }
  };
  const pageHit = (uv) => {
    if (!uv) return null;
    const x = uv.x * 480, y = (1 - uv.y) * pageH;
    return pageHits.find((h) => x >= h.x && x <= h.x + h.wd && y >= h.y && y <= h.y + h.h) || null;
  };

  // A tab torn off: what's on it is copied (and shown in a toast), it falls, and a new one grows back after a while.
  const tearTab = (i) => {
    const tb = tabs[i];
    if (!tb || tb.mode !== 'on') return false;
    navigator.clipboard?.writeText(tb.copy).catch(() => {});
    playTear();
    tb.mode = 'falling';
    tb.at = t;
    onToast && onToast(tb.copy);
    return true;
  };

  return {
    pickables,
    /** The whole wall, then each piece close enough to read and use (a phone held upright skips the whole wall). */
    stops(portrait, sel) {
      const n = new THREE.Vector3(0, 0, 1);
      // (a phone's are tight round each piece: the flyer with its tabs, the page, the coupon with the tag above it)
      const list = [
        { c: new THREE.Vector3(3.23, 2.69, Z), n, w: 1.62, h: 1.22 },
        { c: new THREE.Vector3(FLYER.x, FLYER.top - (fl.h + tabH) / 2, Z), n, w: fl.w + 0.04, h: fl.h + tabH + 0.04 },
        { c: new THREE.Vector3(PAGE.x, PAGE.top - pageWH / 2, Z), n, w: PAGE.w + 0.03, h: pageWH + 0.04 },
        { c: new THREE.Vector3(COUPON.x + 0.02, 2.8, Z), n, w: 0.56, h: 0.6 },
      ];
      const usable = portrait ? list.slice(1) : list;
      return usable[Math.max(0, Math.min(usable.length - 1, sel))];
    },
    stopCount: (portrait) => (portrait ? 3 : 4),
    hover(hit) {
      const item = hit ? hit.item : '';
      hoverTab = item && item.startsWith('tab') ? Number(item.slice(3)) : -1;
      const h = item === 'page' ? pageHit(hit.uv) : null;
      if ((h && h.kind + h.w) !== (state.hover && state.hover.kind + state.hover.w)) state.dirty = true;
      state.hover = h;
      return hoverTab >= 0 || !!h || item === 'coupon' || item === 'tag';
    },
    /** Returns `{ stop }` when the click should take the camera closer (the crossword or the flyer, from the whole wall). */
    click(hit, sel, portrait) {
      const item = hit.item || '';
      if (!portrait && sel === 0 && (item === 'page' || item === 'flyer')) return { stop: item === 'page' ? 2 : 1 };
      if (item.startsWith('tab')) {
        tearTab(Number(item.slice(3)));
        return;
      }
      if (item === 'page') {
        const h = pageHit(hit.uv);
        if (!h) return;
        state.touched = true;
        if (h.kind === 'clue') solve(h.w, true);
        else if (h.href) {
          if (h.href.startsWith('http')) window.open(h.href, '_blank', 'noopener');
          else window.location.href = h.href;
        }
        return;
      }
      if (item === 'coupon') return onCoupon && onCoupon();
      if (item === 'tag') return onTagClick && onTagClick();
    },
    /** Tears off tab `i`, as a click on it does: for the page's own contact buttons on a phone. */
    tear: tearTab,
    /** The visitor's tag, as they type it. */
    setTag(text) {
      const next = (text || '').trim() || 'HI LAKSHYA!';
      if (next === tagText) return;
      tagText = next;
      drawTag(tagCanvas, tagText, 1);
      tagTex.needsUpdate = true;
    },
    /** Clip and send: scissors round the coupon, it drops, then the result is sprayed where it was. `outcome` resolves to true when it went. */
    send(outcome) {
      if (send) return;
      send = { at: t, ok: null };
      playRun(12, 1.6);
      setTimeout(() => playSlap(), 2300);
      Promise.resolve(outcome).then((ok) => { send.ok = !!ok; }, () => { send.ok = false; });
    },
    update(dt, { focused: on, spot, nk }) {
      t += dt;
      state.t = t;
      // (the clues in one column of big type everywhere: two columns of small clues couldn't be read from the room)
      setBig(true);
      if (on && !focused) state.nextFill = t + 1.2;
      focused = on;
      const want = on || spot ? 1 : 0.9 - nk * 0.48;
      glow += (want - glow) * damp(6, dt);
      mats.forEach((m) => m.color.setScalar(glow));

      // Somebody is filling the puzzle in, one answer at a time, until a visitor takes the pen.
      if (on && !state.touched && t >= state.nextFill) {
        const next = FILL_ORDER.find((w) => !state.solved[w]);
        if (next) solve(next, false);
        state.nextFill = t + 2.6;
      }
      const animating = state.last && t - (state.at[state.last] ?? -10) < 1.2;
      if (state.dirty || animating) {
        state.dirty = false;
        pageHits = drawPage(pageCanvas, state, big);
        pageTex.needsUpdate = true;
      }

      // tabs: lean when pointed at, tear off and fall, grow back
      tabs.forEach((tb) => {
        if (!tb) return;
        const k = t - tb.at;
        tb.hover += ((on && hoverTab === tb.i && tb.mode === 'on' ? 1 : 0) - tb.hover) * damp(14, dt);
        let x = 0, y = 0, r = 0, o = 1;
        if (tb.mode === 'falling') {
          const f = clamp01(k / 0.9);
          const ease = f * f;
          x = 0.06 * ease;
          y = -0.64 * ease - Math.min(f, 0.2) * 0.12;
          r = (-120 * ease * Math.PI) / 180;
          o = 1 - f;
          if (f >= 1) { tb.mode = 'gone'; }
        } else if (tb.mode === 'gone') {
          o = 0;
          if (k > 4.2) { tb.mode = 'back'; tb.at = t; }
        } else if (tb.mode === 'back') {
          const f = clamp01((t - tb.at) / 0.6);
          y = 0.01 * (1 - f);
          o = f;
          if (f >= 1) tb.mode = 'on';
        }
        y -= tb.hover * 0.008;
        r += (tb.hover * -3 * Math.PI) / 180;
        tb.m.position.x = -fl.w / 2 + tabW * (tb.i + 0.5) + x;
        tb.m.position.y = 0.001 + y;
        tb.m.position.z = 0.001 + (tb.mode === 'falling' ? 0.03 : 0);
        tb.m.rotation.z = r;
        tb.mat.opacity = o;
        tb.m.visible = o > 0.01;
      });

      // sending
      if (send) {
        const k = t - send.at;
        // scissors round the edge in 1.6 s
        const per = 2 * (COUPON.w + COUPON.h), d = clamp01(k / 1.6) * per;
        scissors.visible = k < 1.6;
        const hw = COUPON.w / 2, hh = COUPON.h / 2;
        let sx, sy, rot;
        if (d < COUPON.w) { sx = -hw + d; sy = hh; rot = 0; } else if (d < COUPON.w + COUPON.h) { sx = hw; sy = hh - (d - COUPON.w); rot = -Math.PI / 2; } else if (d < 2 * COUPON.w + COUPON.h) { sx = hw - (d - COUPON.w - COUPON.h); sy = -hh; rot = Math.PI; } else { sx = -hw; sy = -hh + (d - 2 * COUPON.w - COUPON.h); rot = Math.PI / 2; }
        scissors.position.set(sx, sy, 0.004);
        scissors.rotation.z = rot;
        // then the coupon drops away
        const drop = clamp01((k - 1.65) / 0.7);
        couponGroup.position.set(COUPON.x + 0.04 * drop * drop, COUPON.y - 0.62 * drop * drop, 0.004 + drop * 0.05);
        couponGroup.rotation.z = (1 * Math.PI) / 180 + (24 * Math.PI) / 180 * drop * drop;
        couponMat.opacity = 1 - drop;
        // and once the message has gone (or not), the result is sprayed on, and the tag gets a fresh coat
        if (send.ok !== null && k >= 1.9) {
          if (!send.shownAt) {
            send.shownAt = t;
            sprayAt = t;
            if (send.ok) playChirp();
            else playSlap();
          }
          const r2 = clamp01((t - send.shownAt) / 0.7);
          result.visible = true;
          paintResult(send.ok, Math.ceil(r2 * 8) / 8);
          if (t - send.shownAt > 3.8) {
            send = null;
            result.visible = false;
            couponGroup.position.set(COUPON.x, COUPON.y, 0.004);
            couponGroup.rotation.z = (1 * Math.PI) / 180;
            couponMat.opacity = 1;
          }
        }
      }
      const sk = t - sprayAt;
      if (sk >= 0 && sk < 0.8) {
        drawTag(tagCanvas, tagText, Math.ceil(clamp01(sk / 0.7) * 8) / 8);
        tagTex.needsUpdate = true;
      }
    },
  };
}
