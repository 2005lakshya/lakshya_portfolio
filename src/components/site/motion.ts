import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export { gsap, ScrollTrigger };

/**
 * The motion vocabulary for the site, borrowed from VinHack's: a few
 * confident one-shot arrivals and scroll-linked drift, rather than long wipes.
 *
 *   reveal     copy pulling into focus: out of focus and dark, into focus and lit
 *   settle     easing out of a small offset into the place the layout puts it
 *   stampIn    a sticker or photo coming down like a rubber stamp: a fast drop,
 *              one frame of squash on impact, a short damped wobble
 *   handwrite  a pen line: a slanted clip that sweeps across, like a nib
 *   drift      travel tied straight to the scrollbar while an element crosses the screen
 *
 * Every entrance plays when its trigger comes on screen, and is rewound when
 * the section is scrolled back off below, so it plays again on the way back down. Visitors who ask for less motion get everything already in place.
 */

/** Nothing to animate: an empty selection (a phone layout without that piece), or motion turned down. */
const skip = (targets: gsap.TweenTarget) => reducedMotion() || !gsap.utils.toArray(targets).length;

export const reducedMotion = () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/** Plays on the way in; rewinds once the section is scrolled back off below, so it plays again next time. */
const once = (trigger: Element, start = "top 80%"): ScrollTrigger.Vars => ({ trigger, start, toggleActions: "play none none reset" });
export const REPLAY = "play none none reset";

export function reveal(targets: gsap.TweenTarget, { trigger, duration = 0.72, stagger = 0.16, delay = 0, start }: { trigger: Element; duration?: number; stagger?: number; delay?: number; start?: string }) {
  if (skip(targets)) return;
  return gsap.fromTo(
    targets,
    { opacity: 0, filter: "blur(12px)" },
    {
      opacity: 1,
      filter: "blur(0px)",
      duration,
      stagger,
      delay,
      ease: "power2.out",
      // A live filter keeps the element rasterised for the rest of the page's life.
      onComplete: () => gsap.set(targets, { clearProps: "filter" }),
      scrollTrigger: once(trigger, start),
    },
  );
}

export function settle(targets: gsap.TweenTarget, from: gsap.TweenVars, { trigger, duration = 0.8, delay = 0, stagger = 0, start }: { trigger: Element; duration?: number; delay?: number; stagger?: number; start?: string }) {
  if (skip(targets)) return;
  return gsap.from(targets, { ...from, duration, delay, stagger, ease: "power1.out", scrollTrigger: once(trigger, start) });
}

/** A stamp: accelerate all the way down and stop dead, squash, then a brief rubbery settle. */
export function stampIn(target: Element, { trigger, delay = 0, from = 2.6, tilt = -13, rest = 0, start = "top 70%", onHit }: { trigger: Element; delay?: number; from?: number; tilt?: number; rest?: number; start?: string; onHit?: () => void }) {
  if (reducedMotion()) return;
  const tl = gsap
    .timeline({ paused: true, delay })
    .fromTo(target, { scale: from, rotation: rest + tilt, opacity: 0 }, { scale: 1, rotation: rest, opacity: 1, duration: 0.26, ease: "power3.in" })
    .call(() => onHit?.())
    .to(target, { scale: 0.9, duration: 0.07, ease: "power2.out" })
    .to(target, { scale: 1, duration: 0.5, ease: "elastic.out(1, 0.4)" });
  gsap.set(target, { opacity: 0 });
  ScrollTrigger.create({ trigger, start, onEnter: () => tl.play(0), onLeaveBack: () => { tl.pause(0); gsap.set(target, { opacity: 0 }); } });
  return tl;
}

/**
 * Handwriting: each line is uncovered by a clip whose leading edge leans like a
 * nib, one line after another. Returns the timeline, paused, for the caller to
 * add its doodles to and to start when the page comes on screen.
 */
export function handwrite(lines: HTMLElement[], { perChar = 0.022, min = 0.35, overlap = 0.35 } = {}) {
  const tl = gsap.timeline({ paused: true });
  const lean = Math.tan((15 * Math.PI) / 180);
  lines.forEach((el) => {
    const r = el.getBoundingClientRect();
    const lead = r.width ? (r.height / r.width) * lean * 100 : 0;
    const cut = (p: number) => {
      const foot = -lead + p * (100 + lead);
      el.style.clipPath = `polygon(-5% -50%, ${(foot + lead).toFixed(2)}% -50%, ${foot.toFixed(2)}% 150%, -5% 150%)`;
    };
    cut(0);
    const pen = { p: 0 };
    const dur = Math.max(min, (el.textContent?.length ?? 20) * perChar);
    tl.to(pen, { p: 1, duration: dur, ease: "none", onUpdate: () => cut(pen.p), onComplete: () => { el.style.clipPath = ""; } }, tl.duration() ? `-=${dur * overlap}` : 0);
  });
  return tl;
}

/** Scroll-linked travel while `trigger` crosses from `start` to `end`. */
export function drift(target: Element, { trigger, y = 0, rotation = 0, start = "top top", end = "bottom top" }: { trigger: Element; y?: number; rotation?: number; start?: string; end?: string }) {
  if (reducedMotion() || (!y && !rotation)) return;
  return gsap.fromTo(
    target,
    { y: 0, rotation: 0 },
    { ...(y ? { y } : {}), ...(rotation ? { rotation } : {}), ease: "none", scrollTrigger: { trigger, start, end, scrub: true } },
  );
}
