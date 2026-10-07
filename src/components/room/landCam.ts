// Where you stand on the lawn before going in, and where the house lands on screen from there. Shared by the scene
// (its camera) and the loading screen (the blueprint of the house is drawn exactly where the 3D house will appear),
// so the two always agree. Plain maths, no three.js: the scene's camera does the same projection.

export type V3 = [number, number, number];
export type LandMode = "wide" | "tall" | "short";
/** The free part of the screen the house should sit in (px, section coordinates): left, right, top, bottom. */
export type LandBand = { mode: LandMode; l: number; r: number; t: number; b: number };

// Across the pavement at a slight three-quarter angle on a wide screen; on a screen held upright, almost square on
// (it sees less across). Both stay close to the line of the walk in.
export const LAND: Record<"wide" | "tall", { pos: V3; look: V3 }> = {
  wide: { pos: [-5.6, 1.75, 28.0], look: [-0.4, 4.3, 6] },
  tall: { pos: [-1.4, 1.7, 27.5], look: [-0.2, 4.0, 6] },
};
export const landCam = (m: LandMode) => (m === "tall" ? LAND.tall : LAND.wide);

/** The lawn's field of view (vertical, degrees): wide enough across for the house on any shape of screen. */
export const lawnFov = (W: number, H: number) => Math.min(80, Math.max(40, (2 * Math.atan(0.7 / (W / H)) * 180) / Math.PI));

// The house's outline (corners of the walls, the roof and the chimney, the steps), in metres.
const HOUSE_BOX: V3[] = [[-8, -0.37, 6.35], [8, -0.37, 6.35], [-8.6, 7.8, 6.9], [8.6, 7.8, 6.9], [-8.6, 10.7, 1.5], [8.6, 10.7, 1.5], [4.47, 12.06, 3.12], [5.53, 12.06, 3.12], [-7.8, -0.37, 7.7], [7.8, -0.37, 7.7]];

const sub = (a: V3, b: V3): V3 => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
const dot = (a: V3, b: V3) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const cross = (a: V3, b: V3): V3 => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const norm = (a: V3): V3 => { const l = Math.hypot(a[0], a[1], a[2]); return [a[0] / l, a[1] / l, a[2] / l]; };

/** World point → screen px, for the lawn camera at rest (no pointer parallax, no view offset): what three.js gives. */
export function projector(W: number, H: number, m: LandMode) {
  const c = landCam(m);
  const f = norm(sub(c.look, c.pos)), r = norm(cross(f, [0, 1, 0])), u = cross(r, f);
  const tanV = Math.tan((lawnFov(W, H) * Math.PI) / 360), tanH = (tanV * W) / H;
  return (p: V3): [number, number] => {
    const d = sub(p, c.pos), z = dot(d, f);
    return [W / 2 + (dot(d, r) / z / tanH) * (W / 2), H / 2 - (dot(d, u) / z / tanV) * (H / 2)];
  };
}

/**
 * How far to slide the view (px, as camera.setViewOffset takes it) so the house sits in the middle of the free band,
 * and where its box then is on screen.
 */
export function landShift(W: number, H: number, b: LandBand) {
  const P = projector(W, H, b.mode);
  let x0 = 1e9, x1 = -1e9, y0 = 1e9, y1 = -1e9;
  for (const p of HOUSE_BOX) { const [x, y] = P(p); x0 = Math.min(x0, x); x1 = Math.max(x1, x); y0 = Math.min(y0, y); y1 = Math.max(y1, y); }
  const ox = Math.max(-0.3 * W, Math.min(0.3 * W, (x0 + x1) / 2 - (b.l + b.r) / 2));
  const oy = Math.max(-0.25 * H, Math.min(0.25 * H, (y0 + y1) / 2 - (b.t + b.b) / 2));
  return { ox, oy, box: { x: x0 - ox, y: y0 - oy, w: x1 - x0, h: y1 - y0 } };
}

// The house as an architect would draw its front: polylines in world metres.
const rect = (x0: number, y0: number, x1: number, y1: number, z: number): V3[] => [[x0, y0, z], [x1, y0, z], [x1, y1, z], [x0, y1, z], [x0, y0, z]];
function plan() {
  const L: V3[][] = [];
  L.push([[-11, -0.37, 7.9], [11, -0.37, 7.9]]); // the ground
  L.push(rect(-8, 0, 8, 4.4, 6.35), rect(-8, 4.4, 8, 7.8, 6.3)); // the two floors
  L.push([[-8.6, 7.8, 6.9], [8.6, 7.8, 6.9], [8.6, 10.7, 1.5], [-8.6, 10.7, 1.5], [-8.6, 7.8, 6.9]]); // the roof
  L.push([[4.55, 9.87, 3.05], [4.55, 11.94, 3.05], [5.45, 11.94, 3.05], [5.45, 9.87, 3.05]], rect(4.475, 11.94, 5.525, 12.06, 3.12)); // the chimney
  const win = (x: number, y: number, w: number, h: number, bars: number) => {
    L.push(rect(x - w / 2, y - h / 2, x + w / 2, y + h / 2, 6.38));
    for (let i = 1; i <= bars; i++) { const xb = x - w / 2 + (w * i) / (bars + 1); L.push([[xb, y - h / 2, 6.38], [xb, y + h / 2, 6.38]]); }
    L.push([[x - w / 2 - 0.15, y - h / 2 - 0.12, 6.45], [x + w / 2 + 0.15, y - h / 2 - 0.12, 6.45]]); // the sill
  };
  win(-4.2, 2.1, 2.8, 2.0, 2); win(4.2, 2.1, 2.8, 2.0, 2); win(-7.0, 2.3, 0.9, 1.5, 0); win(7.0, 2.3, 0.9, 1.5, 0);
  win(-5.0, 6.1, 1.6, 1.6, 1); win(5.0, 6.1, 1.6, 1.6, 1); win(0, 6.0, 1.4, 2.2, 1);
  L.push(rect(-1.7, 4.4, 1.7, 7.8, 6.34)); // the cladding over the porch
  L.push(rect(-0.71, 0, 0.71, 2.88, 6.38), rect(-0.55, 2.3, 0.55, 2.8, 6.38)); // the door frame and transom
  L.push(rect(-1.78, 0, -1.52, 4.2, 7.8), rect(1.52, 0, 1.78, 4.2, 7.8)); // the porch columns
  L.push(rect(-1.9, 4.23, 1.9, 4.48, 8.0), rect(-1.9, 4.48, 1.9, 5.5, 7.98)); // the balcony slab and rail
  L.push([[-1.7, 0, 8.2], [1.7, 0, 8.2]], [[-1.5, -0.17, 8.65], [1.5, -0.17, 8.65]]); // the steps
  for (const [x0, x1] of [[-7.8, -1.3], [1.3, 7.8]]) { // the hedges, scalloped
    const pts: V3[] = [[x0, -0.37, 7.55]];
    const n = Math.round((x1 - x0) / 0.65), w = (x1 - x0) / n;
    for (let i = 0; i < n; i++) for (let k = 0; k <= 8; k++) pts.push([x0 + i * w + (k * w) / 8, 0.15 + 0.4 * Math.sin((Math.PI * k) / 8), 7.55]);
    pts.push([x1, -0.37, 7.55]);
    L.push(pts);
  }
  return { lines: L, door: rect(-0.55, 0, 0.55, 2.2, 6.25) };
}

/** The blueprint's paths (SVG `d`, section px), drawn where the 3D house will be; and the house's box on screen. */
export function blueprintPaths(W: number, H: number, b: LandBand) {
  const P = projector(W, H, b.mode), s = landShift(W, H, b);
  const d = (pl: V3[]) => pl.map((p, i) => { const [x, y] = P(p); return `${i ? "L" : "M"}${(x - s.ox).toFixed(1)} ${(y - s.oy).toFixed(1)}`; }).join("");
  const { lines, door } = plan();
  return { lines: lines.map(d).join(""), door: `${d(door)}Z`, box: s.box };
}
