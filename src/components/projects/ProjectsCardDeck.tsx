import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ArrowUpRight } from "lucide-react";
import { projectsData } from "@/data/portfolio";

/**
 * The projects as a deck of cards dealt by the page's own scroll — ported from
 * the VinHack 26 tracks deck.
 *
 * Desktop: a pile waiting top right, a pile of dealt cards bottom left, and one
 * card thrown across the black between them, stopping square in the middle
 * long enough to be read. The throw arcs, is flicked out and settles in, and
 * smears into red/cyan plates at the fastest point of its flight.
 *
 * Phone: the same deck dealt straight down one column — a stack above, the
 * card being read in the middle, a stack below — with no lean or skew, since a
 * diagonal on a 390px screen puts the stacks half off the edge.
 *
 * Nothing intercepts scrolling. The wrapper is drawn far taller than the
 * screen and a sticky stage holds the deck still while it travels past; how
 * far through that travel the page is decides which card is in the middle.
 */

const PROJECTS = projectsData;
const COUNT = PROJECTS.length;
const DESKTOP = "(min-width: 1024px)";

/* ------------------------------------------------------------------ colour */

const DECK_COLORS = {
  grey: "#D9D9D9",
  pink: "#E2B5F0",
  red: "#FA1A1D",
  darkBlue: "#2849CB",
  lightBlue: "#74D4F0",
  white: "#FFFFFF",
} as const;

/** Grey -> Pink -> Red -> Dark Blue -> Light Blue -> White, as the deck deals. */
const COLOR_CYCLE = [
  DECK_COLORS.grey,
  DECK_COLORS.pink,
  DECK_COLORS.red,
  DECK_COLORS.darkBlue,
  DECK_COLORS.lightBlue,
  DECK_COLORS.white,
] as const;

/** The two ghost plates that ride under a card in flight. */
const SEP_INKS = [DECK_COLORS.red, DECK_COLORS.lightBlue] as const;

function colorFor(slot: number): string {
  // Slots run negative, so the cycle is taken the long way round.
  const n = COLOR_CYCLE.length;
  return COLOR_CYCLE[((slot % n) + n) % n];
}

/** Light ink on the two dark cards, near-black navy on the rest. */
function deckInk(color: string): { ink: string; rule: string } {
  return color === DECK_COLORS.red || color === DECK_COLORS.darkBlue
    ? { ink: "#FFFFFF", rule: "rgba(255,255,255,0.4)" }
    : { ink: "#0B1550", rule: "rgba(11,21,80,0.4)" };
}

/* ---------------------------------------------------------- desktop layout */

/** The card's drawn size. Everything on the face is laid out against these and
 *  the whole card is scaled as one piece to fit the window. */
const CARD_WIDTH = 800;
const CARD_HEIGHT = 520;

/** Blank cards under the last project, and dealt into the far pile before the
 *  deck starts, so both corners are piles from the first frame. */
const BACKING = 6;
const SEED = 6;
/** Past this depth a card stops receding and hides behind the one in front. */
const PILE_DEPTH = 6;

/** Air at the top and bottom of the window, and how close a pile's outermost
 *  drawn pixel may come to the window's edge. */
const BAND_PAD = 28;
const EDGE_MARGIN = 24;

/** How much of the band, and of the window's width, the focused card fills. */
const BAND_FILL = 0.86;
const WIDTH_FILL = 0.54;
const MIN_FOCUS_SCALE = 0.3;
/** A card in a corner pile, next to the one being read. */
const CORNER_RATIO = 0.4;

/** One card further back in a pile. Both piles recede up and to the right. */
const STEP_X = 0.038 * CARD_WIDTH;
const STEP_Y = -0.026 * CARD_HEIGHT;

/** The isometric lean a card holds in either pile: the skew shears the card's
 *  vertical edges back by the angle the rotation turned them through. */
const LEAN_ROTATE = 15;
const LEAN_SKEW = 15;
const LEAN_SQUASH = 0.97;

/** The pause, as a fraction of one card's flight. During a hold the deck
 *  position sits on an exact integer and not a single card moves. */
const HOLD = 1.25;
/** Scroll distance per card, flight and hold together. */
const TRAVEL_PER_CARD = 650;

/** The sweep gets the front of a stretch and the throw the back, so the table
 *  is cleared before the next card lands. */
const SWEEP_END = 0.55;
const THROW_START = 0.38;

/** How far the ghost plates pull apart mid-flight, and how much of that is
 *  vertical. */
const SEPARATION = 6;
const SEP_TILT = 0.34;

/* ------------------------------------------------------------ phone layout */

const M_CARD_WIDTH = 300;
const M_CARD_HEIGHT = 230;
/** Where a stack's front card sits from the middle, and how big it is there. */
const M_PILE_SCALE = 0.58;
const M_PILE_OFFSET = 155;
const M_STEP_Y = 8;
const M_STEP_SHRINK = 0.04;
/** A small sway on the stacked cards, so the piles read as touched by the
 *  scroll even while the card in the middle is held. */
const M_DRIFT_X = 7;
const M_DRIFT_CYCLES = 2.25;
const M_PILE_DEPTH = 3;
const M_SEED = 4;
const M_BACKING = 4;
/** Tall enough to hold both stacks at their deepest and the tick strip. */
const M_STAGE_HEIGHT = 520;
const M_HOLD = 1.4;
/** A last touch of settle at either end of a card's travel. */
const M_DWELL = 0.08;
const M_TRAVEL_PER_CARD = 420;

/** Every card in the deck, named by the deck position it is face-on at. Real
 *  projects are 0 to COUNT-1; seeded blanks run below -1, so they are already
 *  dealt when the deck opens at `p === -1`. -1 itself is skipped: a card there
 *  would greet the reader as a blank. */
function slotsFor(seed: number, backing: number): number[] {
  return [
    ...Array.from({ length: seed }, (_, s) => -2 - s),
    ...Array.from({ length: COUNT + backing }, (_, i) => i),
  ];
}

const DESKTOP_SLOTS = slotsFor(SEED, BACKING);
const MOBILE_SLOTS = slotsFor(M_SEED, M_BACKING);

/* ------------------------------------------------------------------- maths */

function clamp(min: number, max: number, v: number): number {
  return v < min ? min : v > max ? max : v;
}

function mix(from: number, to: number, t: number): number {
  return from + (to - from) * t;
}

/** Settling: the card arrives and comes to rest. */
function easeOut(t: number): number {
  const c = 1 - t;
  return 1 - c * c;
}

/** Zero at both ends of a flight and 1 at its middle. */
function arc(t: number): number {
  return 4 * t * (1 - t);
}

/** Zero velocity at both ends. */
function smooth(t: number): number {
  const c = clamp(0, 1, t);
  return c * c * (3 - 2 * c);
}

/** Critically damped spring: continuous velocity, no overshoot, and
 *  frame-rate independent. */
function smoothDamp(
  current: number,
  target: number,
  velocity: { value: number },
  smoothTime: number,
  deltaTime: number,
): number {
  const omega = 2 / Math.max(0.0001, smoothTime);
  const x = omega * deltaTime;
  const exp = 1 / (1 + x + 0.48 * x * x + 0.235 * x * x * x);
  const change = current - target;
  const temp = (velocity.value + omega * change) * deltaTime;
  velocity.value = (velocity.value - omega * temp) * exp;
  let output = target + (change + temp) * exp;
  if (target - current > 0 === output > target) {
    output = target;
    velocity.value = 0;
  }
  return output;
}

/** Half the width and height a card covers once turned, sheared and scaled.
 *  The piles are placed from this, so neither is cut off by an edge. */
function poseExtent(rotate: number, skew: number, sx: number, sy: number) {
  const r = (rotate * Math.PI) / 180;
  const k = Math.tan((skew * Math.PI) / 180);
  const cos = Math.cos(r);
  const sin = Math.sin(r);
  const a = cos * sx;
  const c = (cos * k - sin) * sy;
  const b = sin * sx;
  const d = (sin * k + cos) * sy;
  const hw = CARD_WIDTH / 2;
  const hh = CARD_HEIGHT / 2;
  let mx = 0;
  let my = 0;
  for (const [px, py] of [
    [hw, hh],
    [hw, -hh],
    [-hw, hh],
    [-hw, -hh],
  ] as const) {
    mx = Math.max(mx, Math.abs(a * px + c * py));
    my = Math.max(my, Math.abs(b * px + d * py));
  }
  return { hw: mx, hh: my };
}

/** Scroll progress to deck position: a staircase of flights and holds. */
function deckPosition(q: number, hold: number, eased: boolean): number {
  const unit = 1 + hold;
  const u = clamp(0, 1, q) * COUNT * unit;
  const k = Math.min(COUNT - 1, Math.floor(u / unit));
  const flight = Math.min(1, u - k * unit);
  // The first card flies in from the pile, so the run starts one back.
  return k - 1 + (eased ? smooth(flight) : flight);
}

function pad(n: number): string {
  return String(n).padStart(2, "0");
}

/* ------------------------------------------------------------- the pieces */

function Asterisk({ size }: { size: number }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 40.2117 44.5"
      width={size}
      height={size * (44.5 / 40.2117)}
      fill="none"
      className="block shrink-0"
    >
      <path
        d="M20.325 19V0M23.825 21L38.825 11M23.825 24.5L38.825 33.5M20.325 26.5V44.5M17.325 24.5L1.325 33.5M17.325 21L1.325 11"
        stroke="currentColor"
        strokeWidth={5}
      />
    </svg>
  );
}

function DeckCard({
  color,
  isFront,
  radius,
  width,
  height,
  children,
}: {
  color: string;
  isFront: boolean;
  radius: number;
  width: number;
  height: number;
  children?: React.ReactNode;
}) {
  return (
    <div
      className="absolute inset-0 select-none overflow-hidden"
      style={{
        backgroundColor: color,
        width,
        height,
        borderRadius: radius,
        boxShadow: isFront
          ? "0 36px 80px -20px rgba(0,0,0,0.45), 0 0 0 2px rgba(0,0,0,0.06)"
          : "0 20px 50px -16px rgba(0,0,0,0.35), 0 0 0 2px rgba(0,0,0,0.04)",
      }}
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[2px] bg-white/25" aria-hidden />
      {children}
    </div>
  );
}

type Project = (typeof PROJECTS)[number];

function ProjectLinks({ project, size }: { project: Project; size: "lg" | "sm" }) {
  const cls =
    size === "lg"
      ? "inline-flex items-center gap-1.5 text-[14px] uppercase tracking-[0.3em] hover:opacity-60 transition-opacity"
      : "inline-flex items-center gap-0.5 text-[8.5px] uppercase tracking-[0.2em]";
  const icon = size === "lg" ? 16 : 10;
  return (
    <span className={`flex shrink-0 items-center ${size === "lg" ? "gap-6" : "gap-3"}`}>
      {project.github && (
        <a href={project.github} target="_blank" rel="noreferrer" className={cls}>
          GitHub <ArrowUpRight size={icon} />
        </a>
      )}
      {project.href && (
        <a href={project.href} target="_blank" rel="noreferrer" className={cls}>
          Live <ArrowUpRight size={icon} />
        </a>
      )}
    </span>
  );
}

function DesktopFace({ project, slot, rule }: { project: Project; slot: number; rule: string }) {
  const long = project.name.length > 12;
  return (
    <>
      <div className="flex items-start justify-between">
        <span className="text-[30px] leading-none tracking-[0.2em] tabular-nums" style={{ fontFamily: "'Bebas Neue'" }}>
          {pad(slot + 1)}
          <span className="opacity-50">{` / ${pad(COUNT)}`}</span>
        </span>
        <Asterisk size={30} />
      </div>

      <div className="flex items-start gap-[36px]">
        <div className="min-w-0 flex-1">
          <h3
            className={`uppercase leading-[0.92] ${long ? "text-[52px]" : "text-[68px]"}`}
            style={{ fontFamily: "'Bebas Neue'", letterSpacing: "0.01em" }}
          >
            {project.name}
          </h3>
          <div className="my-[16px] h-[2px] w-full" style={{ background: rule }} />
          <p
            className={`line-clamp-[9] font-medium leading-[1.5] opacity-90 ${
              project.description.length > 300 ? "text-[15px]" : "text-[16.5px]"
            }`}
          >
            {project.description}
          </p>
        </div>
        <div
          className="h-[300px] w-[290px] shrink-0 overflow-hidden rounded-[20px]"
          style={{ boxShadow: `0 0 0 2px ${rule}` }}
        >
          <img src={project.image} alt="" draggable={false} className="h-full w-full object-cover" />
        </div>
      </div>

      <div className="flex items-end justify-between gap-6 font-mono">
        <span className="max-w-[58%] truncate text-[12px] uppercase tracking-[0.3em] opacity-60">
          {project.techStack.join(" · ")}
        </span>
        <span className="mb-[6px] h-[2px] flex-1" style={{ background: rule }} />
        <ProjectLinks project={project} size="lg" />
      </div>
    </>
  );
}

function MobileFace({ project, slot, rule }: { project: Project; slot: number; rule: string }) {
  return (
    <>
      <div className="flex items-center justify-between">
        <span className="font-mono text-[8px] uppercase tracking-[0.3em]">
          Project {pad(slot + 1)} / {pad(COUNT)}
        </span>
        <Asterisk size={11} />
      </div>
      <div className="flex items-start gap-3">
        <div className="min-w-0 flex-1">
          <div className="mb-1.5 h-px w-full" style={{ background: rule }} />
          <h3
            className={`uppercase leading-[0.95] ${project.name.length > 12 ? "text-[21px]" : "text-[25px]"}`}
            style={{ fontFamily: "'Bebas Neue'", letterSpacing: "0.01em" }}
          >
            {project.name}
          </h3>
          <p className="mt-1.5 line-clamp-6 text-[9.5px] font-medium leading-[1.42] opacity-85">
            {project.description}
          </p>
        </div>
        <div className="mt-[14px] h-[112px] w-[84px] shrink-0 overflow-hidden rounded-[8px]" style={{ boxShadow: `0 0 0 1px ${rule}` }}>
          <img src={project.image} alt="" draggable={false} className="h-full w-full object-cover" />
        </div>
      </div>
      <div className="flex items-center justify-between gap-2 font-mono">
        <span className="truncate text-[7.5px] uppercase tracking-[0.2em] opacity-60">
          {project.techStack.join(" · ")}
        </span>
        <ProjectLinks project={project} size="sm" />
      </div>
    </>
  );
}

/* -------------------------------------------------------------------- deck */

function useIsDesktop(): boolean {
  const [desktop, setDesktop] = useState(() =>
    typeof window === "undefined" ? true : window.matchMedia(DESKTOP).matches,
  );
  useEffect(() => {
    const mq = window.matchMedia(DESKTOP);
    const onChange = () => setDesktop(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);
  return desktop;
}

export default function ProjectsCardDeck() {
  const desktop = useIsDesktop();
  const slots = desktop ? DESKTOP_SLOTS : MOBILE_SLOTS;

  const wrapRef = useRef<HTMLDivElement>(null);
  const railRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLDivElement>(null);
  const ticksRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<Map<number, HTMLDivElement>>(new Map());
  const contentRefs = useRef<Map<number, HTMLDivElement>>(new Map());
  const ghostRefs = useRef<Map<number, HTMLDivElement[]>>(new Map());

  useEffect(() => {
    const wrap = wrapRef.current;
    const rail = railRef.current;
    const counter = counterRef.current;
    const ticks = ticksRef.current;
    if (!wrap || !rail || !counter || !ticks) return;

    const calm = window.matchMedia("(prefers-reduced-motion: reduce)");

    let focusScale = 1;
    let cornerScale = 1;
    let pileX = 0;
    let pileY = 0;
    let doneX = 0;
    let doneY = 0;
    let fit = 1;
    let lit = -2;

    const measure = () => {
      const vw = window.innerWidth;
      const vh = window.innerHeight;

      if (!desktop) {
        fit = clamp(0.8, 1.35, Math.min((vw - 32) / M_CARD_WIDTH, (vh - 24) / M_STAGE_HEIGHT));
        rail.style.top = `${(vh / 2).toFixed(1)}px`;
        ticks.style.top = `${(vh / 2 + (M_STAGE_HEIGHT / 2) * fit - 10).toFixed(1)}px`;
        return;
      }

      const bandTop = BAND_PAD;
      const bandBottom = vh - BAND_PAD;
      const bandHeight = Math.max(160, bandBottom - bandTop);
      const bandCenter = (bandTop + bandBottom) / 2;

      focusScale = Math.max(
        MIN_FOCUS_SCALE,
        Math.min((bandHeight * BAND_FILL) / CARD_HEIGHT, (vw * WIDTH_FILL) / CARD_WIDTH),
      );
      cornerScale = focusScale * CORNER_RATIO;

      const { hw, hh } = poseExtent(LEAN_ROTATE, LEAN_SKEW, cornerScale, cornerScale * LEAN_SQUASH);
      const deepX = PILE_DEPTH * STEP_X * cornerScale;
      const deepY = PILE_DEPTH * -STEP_Y * cornerScale;

      // Waiting pile tucked into the top-right corner, dealt pile into the
      // bottom-left, both measured from the focused card's centre.
      pileX = vw - EDGE_MARGIN - hw - deepX - vw / 2;
      pileY = bandTop + EDGE_MARGIN + hh + deepY - bandCenter;
      doneX = EDGE_MARGIN + hw - vw / 2;
      doneY = bandBottom - EDGE_MARGIN - hh - bandCenter;

      rail.style.top = `${bandCenter.toFixed(1)}px`;
    };

    const renderDesktop = (p: number) => {
      const reduced = calm.matches;

      for (const slot of slots) {
        const el = cardRefs.current.get(slot);
        if (!el) continue;

        const raw = p - slot;
        const absRaw = Math.abs(raw);
        const inbound = raw <= 0;
        const stretch = inbound ? clamp(0, 1, raw + 1) : clamp(0, 1, raw);
        const own = inbound
          ? clamp(0, 1, (stretch - THROW_START) / (1 - THROW_START))
          : clamp(0, 1, stretch / SWEEP_END);
        // 0 sitting in a pile, 1 face on in the middle
        const e = reduced ? (absRaw < 0.5 ? 1 : 0) : inbound ? easeOut(own) : 1 - own * own;
        // 0 in both piles, 1 at the fastest point of the flight
        const air = reduced ? 0 : arc(own);

        const depth = Math.min(PILE_DEPTH, Math.max(0, absRaw - 1));
        const restX = (inbound ? pileX : doneX) + depth * STEP_X * cornerScale;
        const restY = (inbound ? pileY : doneY) + depth * STEP_Y * cornerScale;

        let x = mix(restX, 0, e);
        let y = mix(restY, 0, e);

        // A gentle bow off the straight line between the piles.
        if (air > 0) {
          if (inbound) {
            x -= 28 * air * (1 - e);
            y = Math.min(0, y - 14 * air * (1 - e));
          } else {
            x -= 28 * air * e;
            y = Math.max(0, y + 14 * air * e);
          }
        }

        const scale = mix(cornerScale, focusScale, e);
        const rotate = mix(LEAN_ROTATE, 0, e);
        const skew = mix(LEAN_SKEW, 0, e);
        const squash = mix(LEAN_SQUASH, 1, e);

        el.style.transform =
          `translate3d(${x.toFixed(2)}px, ${y.toFixed(2)}px, 0) ` +
          `rotate(${rotate.toFixed(2)}deg) skewX(${skew.toFixed(2)}deg) ` +
          `scale(${scale.toFixed(4)}, ${(scale * squash).toFixed(4)})`;

        // Active card on top, waiting pile under it, dealt pile under that.
        const layer = absRaw < 0.5 ? "500" : inbound ? String(300 - slot) : String(100 + slot);
        if (el.style.zIndex !== layer) el.style.zIndex = layer;
        const hit = absRaw < 0.3 ? "auto" : "none";
        if (el.style.pointerEvents !== hit) el.style.pointerEvents = hit;

        // The smear: two plates pulling apart mid-flight.
        const ghosts = ghostRefs.current.get(slot);
        if (ghosts) {
          const sep = SEPARATION * air;
          ghosts.forEach((ghost, g) => {
            const dir = g === 0 ? -1 : 1;
            ghost.style.transform = `translate3d(${(sep * dir).toFixed(1)}px, ${(sep * SEP_TILT * dir).toFixed(1)}px, 0)`;
          });
        }

        // The face prints when the card is close to the reader.
        const content = contentRefs.current.get(slot);
        if (content) {
          const shown = reduced ? (absRaw < 0.5 ? 1 : 0) : 1 - smooth((absRaw - 0.28) / 0.28);
          content.style.opacity = shown.toFixed(3);
        }
      }
    };

    const renderMobile = (p: number, progress: number) => {
      const reduced = calm.matches;

      for (const slot of slots) {
        const el = cardRefs.current.get(slot);
        if (!el) continue;

        const raw = p - slot;
        const absRaw = Math.abs(raw);
        const waiting = raw <= 0;
        const depth = Math.min(M_PILE_DEPTH, Math.max(0, absRaw - 1));

        // 1 square to the reader, 0 fully back in a stack.
        const away = Math.max(0, (Math.min(1, absRaw) - M_DWELL) / (1 - M_DWELL));
        const t = reduced ? (absRaw < 0.5 ? 1 : 0) : smooth(1 - away);

        // Waiting stack above, receding upward; dealt stack below, downward.
        const side = waiting ? -1 : 1;
        const restY = side * (M_PILE_OFFSET + depth * M_STEP_Y);
        const restScale = M_PILE_SCALE * (1 - depth * M_STEP_SHRINK);

        const phase = depth * 0.85 + (waiting ? 0 : Math.PI / 2) + slot * 0.35;
        const sway = reduced
          ? 0
          : Math.sin(progress * Math.PI * 2 * M_DRIFT_CYCLES + phase) * M_DRIFT_X * (1 - t);

        const y = mix(restY, 0, t);
        const scale = mix(restScale, 1, t);
        el.style.transform = `translate3d(${(sway * fit).toFixed(2)}px, ${(y * fit).toFixed(2)}px, 0) scale(${(scale * fit).toFixed(4)})`;

        const layer = String(Math.round(1000 - absRaw * 10));
        if (el.style.zIndex !== layer) el.style.zIndex = layer;
        const hit = absRaw < 0.3 ? "auto" : "none";
        if (el.style.pointerEvents !== hit) el.style.pointerEvents = hit;

        const content = contentRefs.current.get(slot);
        if (content) content.style.opacity = smooth(1 - Math.min(1, away * 1.9)).toFixed(3);
      }
    };

    const renderCounter = (p: number) => {
      const active = clamp(0, COUNT - 1, Math.round(p));
      if (active === lit) return;
      lit = active;
      const target = desktop ? counter : ticks;
      target.querySelectorAll<HTMLElement>("[data-tick]").forEach((tick, i) => {
        tick.style.opacity = (desktop ? i <= active : i === active) ? "1" : "0.25";
      });
      const label = counter.querySelector<HTMLElement>("[data-tick-label]");
      if (label) label.textContent = pad(active + 1);
    };

    const progress = () => {
      const rect = wrap.getBoundingClientRect();
      const travel = Math.max(1, rect.height - window.innerHeight);
      return clamp(0, 1, -rect.top / travel);
    };

    const target = (q: number) => (desktop ? deckPosition(q, HOLD, false) : deckPosition(q, M_HOLD, true));

    let q = progress();
    let currentP = target(q);
    const pVel = { value: 0 };
    let drawnP = Number.NaN;
    let drawnQ = Number.NaN;
    let lastTime = performance.now();

    const draw = () => {
      if (desktop) renderDesktop(currentP);
      else renderMobile(currentP, q);
      renderCounter(currentP);
      drawnP = currentP;
      drawnQ = q;
    };

    const update = (dt: number) => {
      q = progress();
      const goal = target(q);
      if (calm.matches) {
        currentP = goal;
        pVel.value = 0;
      } else {
        currentP = smoothDamp(currentP, goal, pVel, 0.13, dt);
        if (Math.abs(currentP - goal) < 0.0001 && Math.abs(pVel.value) < 0.0001) {
          currentP = goal;
          pVel.value = 0;
        }
      }
      const moved = Math.abs(currentP - drawnP) > 0.0004 || (!desktop && Math.abs(q - drawnQ) > 0.0002);
      if (Number.isNaN(drawnP) || moved) draw();
    };

    // The loop only runs while the deck is anywhere near the screen.
    let rafId = 0;
    const tick = () => {
      const now = performance.now();
      const dt = Math.min(0.064, Math.max(0.001, (now - lastTime) / 1000));
      lastTime = now;
      update(dt);
      rafId = requestAnimationFrame(tick);
    };
    const start = () => {
      if (rafId) return;
      lastTime = performance.now();
      rafId = requestAnimationFrame(tick);
    };
    const stop = () => {
      cancelAnimationFrame(rafId);
      rafId = 0;
    };

    const near = new IntersectionObserver(
      ([entry]) => (entry.isIntersecting ? start() : stop()),
      { rootMargin: "50% 0px" },
    );
    near.observe(wrap);

    // Phone: the stack is dealt into its resting layout once, the first time
    // the deck nears the screen, rather than simply being present.
    let dealt = desktop || calm.matches;
    const deal = new IntersectionObserver(
      ([entry]) => {
        if (dealt || !entry.isIntersecting) return;
        dealt = true;
        const faces = slots
          .map((s) => cardRefs.current.get(s)?.firstElementChild)
          .filter((node): node is Element => !!node);
        gsap.from(faces, { opacity: 0, scale: 0, duration: 0.6, ease: "back.out(1.6)", stagger: 0.035 });
      },
      { rootMargin: "0px 0px -12% 0px" },
    );
    deal.observe(wrap);

    const onLayout = () => {
      measure();
      lit = -2;
      q = progress();
      currentP = target(q);
      pVel.value = 0;
      draw();
    };

    onLayout();
    window.addEventListener("resize", onLayout);
    calm.addEventListener("change", onLayout);

    return () => {
      stop();
      near.disconnect();
      deal.disconnect();
      window.removeEventListener("resize", onLayout);
      calm.removeEventListener("change", onLayout);
    };
  }, [desktop, slots]);

  const cardW = desktop ? CARD_WIDTH : M_CARD_WIDTH;
  const cardH = desktop ? CARD_HEIGHT : M_CARD_HEIGHT;
  const travel = desktop ? TRAVEL_PER_CARD : M_TRAVEL_PER_CARD;

  return (
    <div
      ref={wrapRef}
      className="relative"
      style={{ height: `calc(${COUNT * travel}px + 100vh)`, overflowX: "clip", overflowAnchor: "none" }}
    >
      {/* Only one card is readable at a time, so the projects are given plainly
          here and the deck itself is hidden from assistive tech. */}
      <ul className="sr-only">
        {PROJECTS.map((project) => (
          <li key={project.name}>
            <h3>{project.name}</h3>
            <p>{project.description}</p>
            {project.github && <a href={project.github}>GitHub</a>}
            {project.href && <a href={project.href}>Live</a>}
          </li>
        ))}
      </ul>

      <div className="pointer-events-none sticky top-0 h-screen" style={{ isolation: "isolate" }}>
        {/* Which project is in the middle. */}
        <div
          ref={counterRef}
          aria-hidden
          className={`absolute left-0 flex items-center gap-[9px] pl-[26px] font-mono text-[#fa1a1d] ${desktop ? "" : "hidden"}`}
          style={{ top: BAND_PAD, zIndex: 600 }}
        >
          <span className="text-[11px] uppercase tracking-[0.42em]">Projects</span>
          <span className="flex items-center gap-[5px]">
            {PROJECTS.map((project, i) => (
              <span
                key={project.name}
                data-tick
                className="block h-[2px] w-[18px] bg-current"
                style={{ opacity: i === 0 ? 1 : 0.25 }}
              />
            ))}
          </span>
          <span className="text-[11px] tracking-[0.2em] tabular-nums">
            <span data-tick-label>01</span>
            <span className="opacity-50">{` / ${pad(COUNT)}`}</span>
          </span>
        </div>

        <div
          ref={ticksRef}
          aria-hidden
          className={`absolute left-0 w-full justify-center gap-2 ${desktop ? "hidden" : "flex"}`}
          style={{ zIndex: 1200 }}
        >
          {PROJECTS.map((project) => (
            <span key={project.name} data-tick className="h-px w-6 bg-[#fa1a1d]" />
          ))}
        </div>

        {/* Origin at the focused card's centre; every card is written as an
            offset from it. */}
        <div ref={railRef} className="absolute left-1/2 top-1/2">
          {slots.map((slot) => {
            const color = colorFor(slot);
            const { ink, rule } = deckInk(color);
            const project = slot >= 0 && slot < COUNT ? PROJECTS[slot] : null;

            return (
              <div
                key={`${desktop ? "d" : "m"}${slot}`}
                ref={(node) => {
                  if (node) cardRefs.current.set(slot, node);
                  else cardRefs.current.delete(slot);
                }}
                className="absolute left-0 top-0 will-change-transform"
                style={{
                  width: cardW,
                  height: cardH,
                  marginLeft: -cardW / 2,
                  marginTop: -cardH / 2,
                  transformOrigin: "center center",
                  pointerEvents: "none",
                }}
              >
                <div className="absolute inset-0">
                  {project && desktop
                    ? SEP_INKS.map((sepInk, g) => (
                        <div
                          key={sepInk}
                          ref={(node) => {
                            const list = ghostRefs.current.get(slot) ?? [];
                            if (node) list[g] = node;
                            ghostRefs.current.set(slot, list);
                          }}
                          className="absolute inset-0 rounded-[32px]"
                          style={{ background: sepInk }}
                        />
                      ))
                    : null}

                  <DeckCard
                    color={color}
                    isFront={project !== null}
                    radius={desktop ? 32 : 14}
                    width={cardW}
                    height={cardH}
                  >
                    {project ? (
                      <div
                        ref={(node) => {
                          if (node) contentRefs.current.set(slot, node);
                          else contentRefs.current.delete(slot);
                        }}
                        className={`absolute inset-0 flex flex-col justify-between opacity-0 ${
                          desktop ? "px-[44px] py-[38px]" : "p-4"
                        }`}
                        style={{ color: ink }}
                      >
                        {desktop ? (
                          <DesktopFace project={project} slot={slot} rule={rule} />
                        ) : (
                          <MobileFace project={project} slot={slot} rule={rule} />
                        )}
                      </div>
                    ) : null}
                  </DeckCard>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
