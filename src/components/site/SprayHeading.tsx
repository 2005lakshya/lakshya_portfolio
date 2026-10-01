import { useLayoutEffect, useRef, type CSSProperties } from "react";
import "./site.css";
import { gsap, reducedMotion, reveal } from "./motion";

/** A paint drip hanging off a letter. Positions and length are in em, so they follow the heading's size. */
export type Drip = { x: number; y: number; h: number; w?: number };

type Props = {
  text: string;
  /** Any CSS length; the drips scale with it. */
  size: string;
  drips?: Drip[];
  /** Spray paint on the wall, or black marker on paper. */
  ink?: "spray" | "marker";
  tilt?: number;
  className?: string;
  style?: CSSProperties;
  id?: string;
};

/**
 * A section heading sprayed onto the wall. It pulls into focus the first time
 * it comes on screen, the way VinHack's copy arrives, and then its drips run.
 */
export default function SprayHeading({ text, size, drips = [], ink = "spray", tilt = -3, className, style, id }: Props) {
  const root = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const el = root.current;
    if (!el) return;
    const ctx = gsap.context(() => {
      const word = el.querySelector("h2")!;
      reveal(word, { trigger: el, duration: 0.8, start: "top 85%" });
      const runs = el.querySelectorAll(".st-drip");
      if (runs.length && !reducedMotion()) {
        gsap.from(runs, {
          scaleY: 0,
          duration: 1.2,
          stagger: 0.22,
          delay: 0.55,
          ease: "power2.in",
          scrollTrigger: { trigger: el, start: "top 85%", toggleActions: "play none none reset" },
        });
      }
    }, el);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={root} className={`st-heading relative inline-block ${className ?? ""}`} style={{ fontSize: size, ...style }}>
      <h2 id={id} className={`${ink === "spray" ? "st-spray" : "st-marker"} m-0 whitespace-nowrap`} style={{ fontSize: "1em", lineHeight: 1.1, transform: `rotate(${tilt}deg)` }}>
        {text}
      </h2>
      {drips.map((d, i) => (
        <span
          key={i}
          aria-hidden
          className="st-drip absolute block"
          style={{
            left: `${d.x}em`,
            top: `${d.y}em`,
            width: `${d.w ?? 0.05}em`,
            height: `${d.h}em`,
            borderRadius: "0 0 3px 3px",
            background: ink === "spray" ? "#EDEDED" : "#111111",
          }}
        />
      ))}
    </div>
  );
}
