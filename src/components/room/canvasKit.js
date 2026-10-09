// @ts-nocheck
// Drawing helpers for the paper things in the room (achievement cards and receipts, the contact posters, the
// experience reel). Each is painted on a 2D canvas in the site's own fonts and colours, then used as a texture.

export const makeCanvas = (w, h) => {
  const c = document.createElement('canvas');
  c.width = Math.max(1, Math.round(w));
  c.height = Math.max(1, Math.round(h));
  return c;
};

/** Splits `text` into lines no wider than `maxW` at the current font. */
export function wrap(g, text, maxW) {
  const lines = [];
  let line = '';
  for (const word of String(text).split(/\s+/)) {
    const next = line ? line + ' ' + word : word;
    if (line && g.measureText(next).width > maxW) {
      lines.push(line);
      line = word;
    } else line = next;
  }
  if (line) lines.push(line);
  return lines;
}

/** Width of `text` set with `spacing` px between letters. */
export const spacedWidth = (g, text, spacing) => [...text].reduce((w, c) => w + g.measureText(c).width, 0) + spacing * Math.max(0, [...text].length - 1);

/** Text with letter spacing, drawn a letter at a time (canvas letterSpacing isn't everywhere yet). */
export function spaced(g, text, x, y, spacing, align = 'left') {
  const total = spacedWidth(g, text, spacing);
  let cx = align === 'center' ? x - total / 2 : align === 'right' ? x - total : x;
  const was = g.textAlign;
  g.textAlign = 'left';
  for (const c of text) {
    g.fillText(c, cx, y);
    cx += g.measureText(c).width + spacing;
  }
  g.textAlign = was;
  return total;
}

/**
 * Spray paint, as on the site's headings: Permanent Marker with a soft glow, tilted, with paint drips.
 * `drips` are in em of the font size, measured from the text's top-left, like the site's SprayHeading.
 */
export function spray(g, text, x, y, size, { color = '#F4F4F4', glow = '255,255,255', tilt = -3, drips = [], dripColor = '#EDEDED' } = {}) {
  g.save();
  g.translate(x, y);
  g.font = `${size}px "Permanent Marker", cursive`;
  g.textBaseline = 'top';
  g.textAlign = 'left';
  g.fillStyle = dripColor;
  drips.forEach((d) => {
    const w = (d.w ?? 0.05) * size;
    g.beginPath();
    if (g.roundRect) g.roundRect(d.x * size, d.y * size, w, d.h * size, [0, 0, 3, 3]);
    else g.rect(d.x * size, d.y * size, w, d.h * size);
    g.fill();
  });
  g.rotate((tilt * Math.PI) / 180);
  g.fillStyle = color;
  [[34, 0.14], [14, 0.35], [2, 0.8]].forEach(([blur, a]) => {
    g.shadowColor = `rgba(${glow},${a})`;
    g.shadowBlur = blur * (size / 96);
    g.fillText(text, 0, 0);
  });
  g.shadowColor = 'transparent';
  g.fillText(text, 0, 0);
  g.restore();
}

/** A soft dark blot for under a sheet of paper: a cheap contact shadow on the wall. */
let shadowCanvas = null;
export function shadowCanvasOnce() {
  if (shadowCanvas) return shadowCanvas;
  shadowCanvas = makeCanvas(256, 256);
  const g = shadowCanvas.getContext('2d');
  g.shadowColor = 'rgba(0,0,0,0.85)';
  g.shadowBlur = 36;
  g.fillStyle = '#000';
  g.fillRect(52, 52, 152, 152);
  return shadowCanvas;
}

/** Paper colour with the faint folds and stains of the site's newsprint (.ct-news). */
export function newsprint(g, w, h) {
  g.fillStyle = '#eae5d9';
  g.fillRect(0, 0, w, h);
  const band = (angle, at, tone) => {
    g.save();
    g.translate(w / 2, h / 2);
    g.rotate(((angle - 90) * Math.PI) / 180);
    const L = Math.hypot(w, h);
    const gr = g.createLinearGradient(-L / 2, 0, L / 2, 0);
    gr.addColorStop(Math.max(0, at - 0.01), 'rgba(0,0,0,0)');
    gr.addColorStop(at, tone);
    gr.addColorStop(Math.min(1, at + 0.02), 'rgba(0,0,0,0)');
    g.fillStyle = gr;
    g.fillRect(-L / 2, -L / 2, L, L);
    g.restore();
  };
  band(97, 0.31, 'rgba(0,0,0,0.05)');
  band(176, 0.59, 'rgba(0,0,0,0.045)');
  band(84, 0.73, 'rgba(255,255,255,0.35)');
  const stain = (cx, cy, r, tone) => {
    const gr = g.createRadialGradient(cx, cy, 0, cx, cy, r);
    gr.addColorStop(0, tone);
    gr.addColorStop(1, 'rgba(0,0,0,0)');
    g.fillStyle = gr;
    g.fillRect(0, 0, w, h);
  };
  stain(w * 0.2, h * 0.1, Math.max(w, h) * 0.5, 'rgba(0,0,0,0.05)');
  stain(w * 0.9, h * 0.95, Math.max(w, h) * 0.55, 'rgba(120,90,40,0.1)');
}

/** Cubic ease in and out. */
export const easeInOut = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
export const clamp01 = (v) => Math.max(0, Math.min(1, v));

/**
 * A patch of wall painted black, like the black wall the site's sections sit on: a matte black with a faint roller
 * texture and ragged, brushed edges (the edges are in the alpha, so the wall shows through).
 */
export function blackPaint(w, h, seed = 1) {
  const cv = makeCanvas(w, h), g = cv.getContext('2d');
  let s = seed * 9301 + 49297;
  const rnd = () => ((s = (s * 9301 + 49297) % 233280) / 233280);
  const edge = Math.min(w, h) * 0.035;
  g.fillStyle = '#0d0d0e';
  g.beginPath();
  const pts = [];
  const N = 60;
  for (let i = 0; i <= N; i++) pts.push([(i / N) * w, edge * (0.3 + rnd() * 0.9)]);
  for (let i = 0; i <= N; i++) pts.push([w - edge * (0.3 + rnd() * 0.9), (i / N) * h]);
  for (let i = N; i >= 0; i--) pts.push([(i / N) * w, h - edge * (0.3 + rnd() * 0.9)]);
  for (let i = N; i >= 0; i--) pts.push([edge * (0.3 + rnd() * 0.9), (i / N) * h]);
  pts.forEach(([x, y], i) => (i ? g.lineTo(x, y) : g.moveTo(x, y)));
  g.closePath();
  g.fill();
  // roller marks and a few drips off the bottom edge
  g.save();
  g.clip();
  for (let i = 0; i < 40; i++) {
    g.fillStyle = `rgba(255,255,255,${0.008 + rnd() * 0.014})`;
    g.fillRect(rnd() * w, 0, 20 + rnd() * 60, h);
  }
  g.restore();
  g.fillStyle = '#0d0d0e';
  for (let i = 0; i < 9; i++) {
    const x = rnd() * w, len = edge * (1 + rnd() * 4), wd = 3 + rnd() * 5;
    g.fillRect(x, h - edge * 1.2, wd, len);
    g.beginPath();
    g.arc(x + wd / 2, h - edge * 1.2 + len, wd / 2, 0, Math.PI * 2);
    g.fill();
  }
  return cv;
}
