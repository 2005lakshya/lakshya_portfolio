import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties, type PointerEvent, type ReactNode } from "react";
import { playPeel, playSlap, playWhoosh } from "@/components/site/sfx";
import { drift as driftOnScroll, gsap, reducedMotion } from "@/components/site/motion";
import "./heroStickers.css";

/**
 * A hero sticker you can pick up, move and throw, ported from the VinHack
 * timeline stickers.
 *
 * Inside the graph paper a sticker goes where it is put. Past the paper's edge
 * it keeps coming, but at RUBBER of the pull; let go after a flick outwards
 * (faster than THROW_SPEED px/ms over the last SAMPLE_MS) or a long haul
 * (THROW_SLACK px past the edge) and it flies off, then gets slapped back on
 * its old spot a few seconds later.
 */

const RUBBER = 0.42;
const THROW_SPEED = 0.9;
const THROW_SLACK = 120;
const SAMPLE_MS = 90;
const RETURN_MS = 6500;

let topZ = 40;

type Grab = {
  id: number;
  sx: number;
  sy: number;
  x0: number;
  y0: number;
  dx: number;
  dy: number;
  lim: { minX: number; maxX: number; minY: number; maxY: number };
  trail: { x: number; y: number; t: number }[];
};

const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));
const rubber = (v: number, lo: number, hi: number) => (v > hi ? hi + (v - hi) * RUBBER : v < lo ? lo + (v - lo) * RUBBER : v);

type Props = {
  label: string;
  rotation: number;
  /** When it is thrown onto the paper as the page opens, in seconds. */
  dealAt?: number;
  /** How far it travels up (negative) or down as the hero scrolls away, in px. */
  drift?: number;
  className?: string;
  style?: CSSProperties;
  children: ReactNode;
};

export default function DraggableSticker({ label, rotation, dealAt = 0.3, drift = 0, className, style, children }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const driftRef = useRef<HTMLDivElement>(null);
  const dealRef = useRef<HTMLDivElement>(null);
  const grab = useRef<Grab | null>(null);
  const timer = useRef<number>();
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [spin, setSpin] = useState(0);
  const [held, setHeld] = useState(false);
  const [gone, setGone] = useState(false);
  const [returns, setReturns] = useState(0);
  const [z, setZ] = useState<number | undefined>(undefined);
  const [transition, setTransition] = useState<string | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  // Dealt onto the paper once, thrown in from whichever edge it sits nearest,
  // then carried off the top at its own speed as the hero scrolls away.
  useLayoutEffect(() => {
    const el = ref.current;
    const deal = dealRef.current;
    const lift = driftRef.current;
    if (!el || !deal || !lift) return;
    const ctx = gsap.context(() => {
      const hero = el.closest("#hero-section") ?? el.parentElement!;
      if (!reducedMotion()) {
        const r = el.getBoundingClientRect();
        const h = hero.getBoundingClientRect();
        const fromLeft = r.left + r.width / 2 < h.left + h.width / 2;
        gsap.from(deal, {
          x: fromLeft ? -420 : 420,
          y: (Math.random() - 0.5) * 160,
          rotation: fromLeft ? -16 : 16,
          scale: 0.8,
          opacity: 0,
          duration: 0.7,
          delay: dealAt,
          ease: "power3.out",
        });
      }
      driftOnScroll(lift, { trigger: hero, y: drift, rotation: drift ? drift / 18 : 0 });
    });
    return () => ctx.revert();
  }, [dealAt, drift]);

  const onPointerDown = (e: PointerEvent<HTMLDivElement>) => {
    if (gone || (e.pointerType === "mouse" && e.button !== 0)) return;
    const el = ref.current;
    if (!el) return;
    const paper = (el.closest("[data-hero-paper]") as HTMLElement | null) ?? el.parentElement;
    if (!paper) return;
    const b = paper.getBoundingClientRect();
    const r = el.getBoundingClientRect();
    el.setPointerCapture(e.pointerId);
    e.preventDefault();
    grab.current = {
      id: e.pointerId,
      sx: e.clientX,
      sy: e.clientY,
      x0: pos.x,
      y0: pos.y,
      dx: 0,
      dy: 0,
      lim: { minX: b.left - r.left, maxX: b.right - r.right, minY: b.top - r.top, maxY: b.bottom - r.bottom },
      trail: [{ x: e.clientX, y: e.clientY, t: e.timeStamp }],
    };
    topZ += 1;
    setZ(topZ);
    setHeld(true);
    setTransition("transform 90ms ease-out");
    playPeel();
  };

  const onPointerMove = (e: PointerEvent<HTMLDivElement>) => {
    const g = grab.current;
    if (!g || e.pointerId !== g.id) return;
    g.dx = e.clientX - g.sx;
    g.dy = e.clientY - g.sy;
    g.trail.push({ x: e.clientX, y: e.clientY, t: e.timeStamp });
    while (g.trail.length > 2 && e.timeStamp - g.trail[0].t > SAMPLE_MS) g.trail.shift();
    setPos({ x: g.x0 + rubber(g.dx, g.lim.minX, g.lim.maxX), y: g.y0 + rubber(g.dy, g.lim.minY, g.lim.maxY) });
  };

  const onPointerUp = (e: PointerEvent<HTMLDivElement>) => {
    const g = grab.current;
    if (!g || e.pointerId !== g.id) return;
    grab.current = null;
    setHeld(false);
    const first = g.trail[0];
    const span = Math.max(1, e.timeStamp - first.t);
    const vx = (e.clientX - first.x) / span;
    const vy = (e.clientY - first.y) / span;
    const { minX, maxX, minY, maxY } = g.lim;
    const slack = Math.max(minX - g.dx, g.dx - maxX, minY - g.dy, g.dy - maxY, 0);
    const outward = (g.dx > maxX && vx > 0) || (g.dx < minX && vx < 0) || (g.dy > maxY && vy > 0) || (g.dy < minY && vy < 0);

    if ((slack > 0 && outward && Math.hypot(vx, vy) > THROW_SPEED) || slack > THROW_SLACK) {
      // Thrown: it carries on the way the hand was going, spinning, and off the paper.
      const fast = Math.hypot(vx, vy) > 0.05;
      const ux = fast ? vx : g.dx;
      const uy = fast ? vy : g.dy;
      const len = Math.hypot(ux, uy) || 1;
      setTransition("transform 750ms cubic-bezier(0.2,0.7,0.3,1), opacity 700ms ease-out");
      setPos({ x: g.x0 + g.dx + (ux / len) * 900, y: g.y0 + g.dy + (uy / len) * 900 });
      setSpin(ux > 0 ? 40 : -40);
      setGone(true);
      playWhoosh();
      timer.current = window.setTimeout(() => {
        setTransition("none");
        setPos({ x: 0, y: 0 });
        setSpin(0);
        setGone(false);
        setReturns((n) => n + 1);
        playSlap();
      }, RETURN_MS);
      return;
    }

    setTransition("transform 320ms cubic-bezier(0.2,0.8,0.3,1)");
    setPos({ x: g.x0 + clamp(g.dx, minX, maxX), y: g.y0 + clamp(g.dy, minY, maxY) });
    playSlap();
  };

  return (
    <div
      ref={ref}
      role="img"
      aria-label={label}
      className={`hs-sticker ${held ? "is-held" : ""} ${className ?? ""}`}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      style={{
        ...style,
        zIndex: z ?? style?.zIndex,
        transform: `translate(${pos.x}px, ${pos.y}px) rotate(${rotation + spin}deg) scale(${held ? 1.08 : 1})`,
        transition,
        opacity: gone ? 0 : 1,
        pointerEvents: gone ? "none" : "auto",
      }}
    >
      <div ref={driftRef}>
        <div ref={dealRef}>
          <div key={returns} className={returns ? "hs-stamp" : undefined}>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
