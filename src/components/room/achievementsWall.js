// @ts-nocheck
import { CARDS } from '@/components/achievements/cards';
import { CARD_ICONS, CARD_SHAPES } from '@/components/achievements/cardArt';
import { playPaper } from '@/components/site/sfx';
import { blackPaint, clamp01, makeCanvas, shadowCanvasOnce, spacedWidth, spaced, spray, wrap } from './canvasKit';

/**
 * The site's achievement cards, pinned in a row on the wall above the bookshelf, each with its receipt hanging
 * underneath. Point at a card and it flips over to its second colour and shape (tap it on a phone); the receipts
 * print out when the camera comes over. Sizes are the site's, at 1 px = 1 mm, so a card reads like it does on the page.
 */

const CW = 0.246, CH = 0.33, GAP = 0.064; // a card and the space between cards, metres
const S = 2; // canvas pixels per site pixel
const RW = 234; // receipt width in site px: the card less 6 px each side
const STUB = 0.12; // how much of a receipt shows before it prints
const WALL = { x: -3.47, y: 3.3, z: -0.6 }; // the centre of the first card row, just off the left wall
const step = CW + GAP;

/** One side of a card: its colour, icon and label; the hot side adds the second colour and its shape. */
function drawFace(c, hot) {
  const W = 246 * S, H = 330 * S;
  const cv = makeCanvas(W, H), g = cv.getContext('2d');
  g.fillStyle = hot ? c.alt : c.bg;
  g.fillRect(0, 0, W, H);
  if (hot) {
    const shape = CARD_SHAPES[c.shape];
    const [, , vw, vh] = shape.vb.split(' ').map(Number);
    const bx = W * 0.057, by = H * 0.055, bw = W * 0.886, bh = H * 0.89, k = Math.min(bw / vw, bh / vh);
    g.save();
    g.translate(bx + (bw - vw * k) / 2, by + (bh - vh * k) / 2);
    g.scale(k, k);
    g.fillStyle = c.bg;
    g.fill(new Path2D(shape.d));
    g.restore();
  }
  const ink = hot ? c.altText : c.text;
  // White lettering on the second colour gets a thin black edge, like the VinHack cards.
  const edge = hot && c.altText === '#FFFFFF';
  const icon = CARD_ICONS[c.icon];
  const iconS = 70 * S, labelS = 28 * S, gap = 12 * S;
  const top = (H - (iconS + gap + labelS)) / 2;
  g.save();
  g.translate((W - iconS) / 2, top);
  g.scale(iconS / 64, iconS / 64);
  const p = new Path2D(icon.d);
  g.fillStyle = ink;
  g.fill(p, icon.rule === 'evenodd' ? 'evenodd' : 'nonzero');
  if (edge) {
    g.lineWidth = 1.5;
    g.strokeStyle = '#000';
    g.stroke(p);
  }
  g.restore();
  g.font = `${labelS}px Rotonto, sans-serif`;
  g.textAlign = 'center';
  g.textBaseline = 'top';
  if (edge) {
    g.lineWidth = 2 * S;
    g.lineJoin = 'round';
    g.strokeStyle = '#000';
    g.strokeText(c.face, W / 2, top + iconS + gap);
  }
  g.fillStyle = ink;
  g.fillText(c.face, W / 2, top + iconS + gap);
  return cv;
}

/** The receipt: name and date, where, what; a dashed tear line on top and a perforated edge at the bottom. */
function drawReceipt(c) {
  const W = RW * S, padX = 12 * S, padT = 11 * S, padB = 13 * S, inner = W - padX * 2;
  const m = makeCanvas(4, 4).getContext('2d');
  const whenFont = `700 ${10.5 * S}px "Space Mono", monospace`, whenSp = 0.08 * 10.5 * S;
  m.font = whenFont;
  const whenW = spacedWidth(m, c.when, whenSp);
  const nameFont = `${16 * S}px Rotonto, sans-serif`, nameLH = 16 * 1.1 * S;
  m.font = nameFont;
  const nameLines = wrap(m, c.name, inner - whenW - 8 * S);
  const whereFont = `${13.5 * S}px Rotonto, sans-serif`, whereLH = 13.5 * 1.3 * S;
  m.font = whereFont;
  const whereLines = wrap(m, c.where, inner);
  const bodyFont = `${13 * S}px Rotonto, sans-serif`, bodyLH = 13 * 1.45 * S;
  m.font = bodyFont;
  const bodyLines = wrap(m, c.body, inner);
  const contentH = Math.ceil(padT + nameLines.length * nameLH + 7 * S + whereLines.length * whereLH + 5 * S + bodyLines.length * bodyLH + padB);
  const teeth = 7 * S;
  const cv = makeCanvas(W, contentH + teeth), g = cv.getContext('2d');
  g.fillStyle = '#fcfcfc';
  g.fillRect(0, 0, W, contentH);
  g.fillStyle = '#000';
  g.fillRect(0, 0, S, contentH);
  g.fillRect(W - S, 0, S, contentH);
  g.fillRect(0, contentH - S, W, S);
  g.fillStyle = '#fcfcfc';
  for (let x = 0; x < W; x += 8 * S) g.fillRect(x, contentH - S, 4 * S, teeth + S);
  g.strokeStyle = 'rgba(0,0,0,0.25)';
  g.lineWidth = S;
  g.setLineDash([3 * S, 3 * S]);
  g.beginPath();
  g.moveTo(8 * S, S / 2);
  g.lineTo(W - 8 * S, S / 2);
  g.stroke();
  g.setLineDash([]);
  g.textBaseline = 'alphabetic';
  let y = padT;
  g.font = nameFont;
  g.fillStyle = '#000';
  nameLines.forEach((l, i) => g.fillText(l, padX, y + nameLH * (i + 0.82)));
  g.font = whenFont;
  g.fillStyle = c.ink;
  spaced(g, c.when, W - padX, y + nameLH * 0.82, whenSp, 'right');
  y += nameLines.length * nameLH + 7 * S;
  g.font = whereFont;
  g.fillStyle = '#FA1A1D';
  whereLines.forEach((l, i) => g.fillText(l, padX, y + whereLH * (i + 0.78)));
  y += whereLines.length * whereLH + 5 * S;
  g.font = bodyFont;
  g.fillStyle = 'rgba(0,0,0,0.86)';
  bodyLines.forEach((l, i) => g.fillText(l, padX, y + bodyLH * (i + 0.7)));
  return { canvas: cv, h: (contentH + teeth) / S / 1000 };
}

export function buildAchievementsWall(THREE, { parent, maxAniso }) {
  const group = new THREE.Group();
  group.position.set(WALL.x, WALL.y, WALL.z);
  group.rotation.y = Math.PI / 2; // faces into the room; the row runs along the wall
  group.userData.keep = true;
  parent.add(group);
  const tex = (cv) => {
    const t = new THREE.CanvasTexture(cv);
    t.encoding = THREE.sRGBEncoding;
    t.anisotropy = maxAniso;
    return t;
  };
  // The paper shows its true colours (the room's film-like tone mapping would wash them out); it dims with the room
  // at night and comes up to full when you come to look at it.
  const mats = [];
  const paper = (t, extra = {}) => {
    const m = new THREE.MeshBasicMaterial(Object.assign({ map: t, toneMapped: false }, extra));
    mats.push(m);
    return m;
  };
  const shadowMat = new THREE.MeshBasicMaterial({ map: tex(shadowCanvasOnce()), transparent: true, opacity: 0.32, depthWrite: false });
  // What the pointer finds is a card-sized patch of wall that stays put, not the card itself: a card turning over goes
  // edge-on halfway round, so the pointer would lose it there and send it back (then catch it again, and again).
  const hitMat = new THREE.MeshBasicMaterial({ visible: false });
  const pickables = [];
  const tag = (m, item) => {
    m.userData.spot = 'achievements';
    if (item !== undefined) m.userData.item = item;
    pickables.push(m);
    return m;
  };

  // The wall behind is painted black for them, like the black wall the section sits on on the site.
  {
    const w = 1.78, h = 0.98;
    const board = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshStandardMaterial({ map: tex(blackPaint(1780, 980, 3)), transparent: true, roughness: 1, metalness: 0, envMapIntensity: 0.1 }));
    board.position.set(0, 0.03, -0.02);
    group.add(board);
  }

  // The heading, sprayed on the wall above the row, the way the section's heading is sprayed on the site.
  {
    const size = 150, cv = makeCanvas(1500, 290), g = cv.getContext('2d');
    spray(g, 'ACHIEVEMENTS', 40, 70, size, { drips: [{ x: 1.625, y: 0.9375, h: 0.375, w: 0.052 }, { x: 5.771, y: 0.79, h: 0.25, w: 0.042 }] });
    const w = 1.25, h = (w * cv.height) / cv.width;
    const heading = new THREE.Mesh(new THREE.PlaneGeometry(w, h), paper(tex(cv), { transparent: true, depthWrite: false }));
    heading.position.set(-2 * step - CW / 2 + w / 2 - 0.02, CH / 2 + 0.05 + h / 2, -0.01);
    group.add(tag(heading));
  }

  const cards = CARDS.map((c, i) => {
    const holder = new THREE.Group();
    holder.position.set((i - 2) * step, 0, 0);
    group.add(holder);
    const tilt = new THREE.Group();
    tilt.rotation.z = (-c.tilt * Math.PI) / 180;
    holder.add(tilt);
    const shadow = new THREE.Mesh(new THREE.PlaneGeometry(CW * 1.5, CH * 1.45), shadowMat);
    shadow.position.set(0.006, -0.01, -0.012);
    tilt.add(shadow);
    const flip = new THREE.Group();
    tilt.add(flip);
    const front = new THREE.Mesh(new THREE.PlaneGeometry(CW, CH), paper(tex(drawFace(c, false))));
    front.position.z = 0.0015;
    const back = new THREE.Mesh(new THREE.PlaneGeometry(CW, CH), paper(tex(drawFace(c, true))));
    back.rotation.y = Math.PI;
    back.position.z = -0.0015;
    flip.add(front, back);
    const hit = tag(new THREE.Mesh(new THREE.PlaneGeometry(CW + 0.02, CH + 0.02), hitMat), i);
    hit.position.z = 0.002;
    tilt.add(hit);
    const r = drawReceipt(c);
    const rtex = tex(r.canvas);
    const rgeo = new THREE.PlaneGeometry(RW / 1000, r.h);
    rgeo.translate(0, -r.h / 2, 0); // hangs from its top edge, so printing grows it downwards
    const receipt = tag(new THREE.Mesh(rgeo, paper(rtex, { transparent: true, alphaTest: 0.5 })), i);
    receipt.position.set(0, -CH / 2 + 0.002, -0.004);
    tilt.add(receipt);
    return { flip, receipt, rtex, h: r.h, z: WALL.z - (i - 2) * step, hot: 0, sticky: false, print: STUB, printAt: 0 };
  });

  let hover = -1, focused = false, glow = 0.9, t = 0;
  const damp = (rate, dt) => 1 - Math.exp(-rate * dt);

  return {
    pickables,
    /**
     * Where the camera stands. On a wide screen the whole row first, then (a card clicked, or the arrows) one card at a
     * time; on a phone held upright, only one card at a time. Close up, a card's receipt is printed out in full and near
     * enough to read easily.
     */
    stops(portrait, sel) {
      if (!portrait && sel <= 0) return { c: new THREE.Vector3(WALL.x, WALL.y + 0.04, WALL.z), n: new THREE.Vector3(1, 0, 0), w: 1.6, h: 0.98 };
      const k = cards[Math.max(0, Math.min(cards.length - 1, portrait ? sel : sel - 1))];
      const top = CH / 2 + 0.012, bottom = -CH / 2 - k.h - 0.02;
      // (a wide screen keeps a band clear at the top and bottom for its row of stickers and the arrows; a phone says
      // where its bars are itself)
      return { c: new THREE.Vector3(WALL.x, WALL.y + (top + bottom) / 2, k.z), n: new THREE.Vector3(1, 0, 0), w: CW + 0.03, h: (top - bottom) * (portrait ? 1 : 1.22) };
    },
    stopCount: (portrait) => (portrait ? cards.length : cards.length + 1),
    hover(hit) {
      hover = hit ? hit.item : -1;
      return hover >= 0;
    },
    click(hit, sel, portrait) {
      const k = cards[hit.item];
      if (!k) return;
      // (from the whole row on a wide screen, a click goes in close to that card)
      if (!portrait && !sel) return { stop: hit.item + 1 };
      // Touch screens have no hover, so a tap turns the card over (and back).
      k.sticky = !k.sticky;
      playPaper();
    },
    /** `spot`: the pointer is on the wall from across the room. `nk`: how far into night it is. */
    update(dt, { focused: on, spot, nk }) {
      t += dt;
      if (on && !focused) cards.forEach((k, i) => { k.printAt = t + 0.5 + i * 0.18; });
      if (!on) cards.forEach((k) => { k.sticky = false; });
      focused = on;
      const want = on || spot ? 1 : 0.9 - nk * 0.48;
      glow += (want - glow) * damp(6, dt);
      mats.forEach((m) => m.color.setScalar(glow));
      cards.forEach((k, i) => {
        // Flip over (lifting off the wall on the way round) while pointed at.
        const want = on && (hover === i || k.sticky) ? 1 : 0;
        k.hot += (want - k.hot) * damp(9, dt);
        const lift = Math.sin(k.hot * Math.PI);
        k.flip.rotation.y = k.hot * Math.PI;
        k.flip.position.z = lift * 0.05;
        k.flip.scale.setScalar(1 + lift * 0.05);
        // The receipt prints out in ten jerky steps, like the site's, and is pulled a little further out by a flipped card.
        const p = on ? STUB + (1 - STUB) * Math.floor(clamp01((t - k.printAt) / 1.0) * 10) / 10 : k.print + (STUB - k.print) * damp(5, dt);
        k.print = p;
        k.receipt.scale.y = p;
        k.rtex.repeat.y = p;
        k.rtex.offset.y = 1 - p;
        k.receipt.position.y = -CH / 2 + 0.002 - k.hot * 0.008;
      });
    },
  };
}
