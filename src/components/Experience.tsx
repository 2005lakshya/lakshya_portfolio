import { useEffect, useLayoutEffect, useState } from "react";
import "./experience/experience.css";
import SprayHeading from "@/components/site/SprayHeading";
import ScaledStage from "@/components/site/ScaledStage";
import { useInView, useMediaQuery, useOnScreen, useWidth } from "@/components/site/hooks";
import { playFilm } from "@/components/site/sfx";
import { gsap, settle } from "@/components/site/motion";
import { FLYERS, type Flyer } from "./experience/flyers";

/**
 * Experience as flyers pasted into the frames of a long film strip. The strip
 * winds on to each role in turn; the flyer in the gate flaps, the clapperboard
 * snaps with the scene and take, and the role's description plays as a
 * subtitle. Pointing at the strip holds it; clicking a flyer jumps to it.
 */


const FRAME = 380;
const X = (i: number) => 60 + i * FRAME;
const pad = (n: number) => `0${n}`;
const LEADERS = [{ i: -2, t: "3" }, { i: -1, t: "2" }, { i: 5, t: "END" }, { i: 6, t: "" }];

/** Runs the strip: which frame is in the gate, and a counter that restarts the one-shot animations. */
function useReel(active: boolean) {
  const [cur, setCur] = useState(0);
  const [turn, setTurn] = useState(0);
  const [held, setHeld] = useState(false);
  useEffect(() => {
    if (!active || held) return;
    const id = window.setInterval(() => {
      setCur((c) => (c + 1) % FLYERS.length);
      setTurn((t) => t + 1);
    }, 5600);
    return () => window.clearInterval(id);
  }, [active, held]);
  // Only a frame the visitor picked makes a sound; the strip winding on by itself stays quiet.
  const pick = (i: number) => {
    setHeld(true);
    if (i !== cur) {
      playFilm();
      setCur(i);
      setTurn((t) => t + 1);
    }
  };
  return { cur, turn, setHeld, pick };
}

type Reel = ReturnType<typeof useReel>;

function FlyerCard({ f, i, cur, turn, onPick }: { f: Flyer; i: number; cur: number; turn: number; onPick: (i: number) => void }) {
  const on = i === cur;
  return (
    <button
      type="button"
      className="ex-flyer"
      onClick={() => onPick(i)}
      aria-label={`${f.org}, ${f.role}`}
      aria-pressed={on}
      style={{ left: X(i), transform: `rotate(${f.tilt}deg)`, filter: on ? "none" : "grayscale(0.7) brightness(0.5)" }}
    >
      <span key={on ? `on-${turn}` : "idle"} className={`ex-sheet ${on ? "is-cur" : "is-idle"}`} style={{ background: f.bg, color: f.ink, animationDuration: on ? undefined : `${(5 + i * 0.6).toFixed(1)}s` }}>
        <span className="flex items-center gap-3">
          {f.logo && <img src={f.logo} alt="" className="h-12 w-12 rounded-lg bg-white object-contain p-[3px]" />}
          <span>
            <span className="block" style={{ fontFamily: "Anton, Impact, sans-serif", fontSize: 20, letterSpacing: 2 }}>{f.org.toUpperCase()}</span>
            <span className="block" style={{ fontSize: 13, letterSpacing: 1.5 }}>{f.when}</span>
          </span>
        </span>
        <span className="mt-3 block" style={{ fontFamily: "Anton, Impact, sans-serif", fontSize: f.roleSize, lineHeight: 0.95, color: f.accent }}>{f.role.toUpperCase()}</span>
        {f.stats && (
          <span className="mt-2.5 flex gap-3.5">
            {f.stats.map((s) => (
              <span key={s.small}>
                <span className="block" style={{ fontFamily: "Anton, Impact, sans-serif", fontSize: 28, lineHeight: 1 }}>{s.big}</span>
                <span className="block" style={{ fontSize: 10, letterSpacing: 1 }}>{s.small}</span>
              </span>
            ))}
          </span>
        )}
        <span className="absolute bottom-3.5 left-5" style={{ fontSize: 12, letterSpacing: 1 }}>SCENE {pad(i + 1)}</span>
      </span>
      <span className="ex-staple" style={{ left: 22 }} />
      <span className="ex-staple" style={{ right: 22, animationDelay: "1.3s" }} />
    </button>
  );
}

/** The strip itself, drawn at full size inside a box `width` px wide. */
function Strip({ reel, width }: { reel: Reel; width: number }) {
  const shift = width / 2 - (X(reel.cur) + 165);
  return (
    <div className="ex-strip absolute left-0 top-0 h-[360px] overflow-hidden" style={{ width, transform: "rotate(-1deg)" }} onMouseEnter={() => reel.setHeld(true)} onMouseLeave={() => reel.setHeld(false)}>
      <div data-ex-pull className="absolute left-0 top-0 h-[360px]" style={{ width }}>
      <div className="absolute left-0 top-0 h-[360px]" style={{ width, transform: `translateX(${shift}px)`, transition: "transform 1000ms cubic-bezier(0.65,0,0.35,1)" }}>
        <div className="absolute top-0 h-[360px]" style={{ left: -2400, width: 7200, background: "#171717", boxShadow: "inset 0 1px 0 #2E2E2E, inset 0 -1px 0 #2E2E2E" }} />
        <div className="ex-holes absolute top-[10px] h-[18px]" style={{ left: -2400, width: 7200 }} />
        <div className="ex-holes absolute bottom-[10px] h-[18px]" style={{ left: -2400, width: 7200 }} />
        {LEADERS.map((l) => (
          <div key={l.i} className="absolute top-[44px] flex h-[262px] w-[330px] items-center justify-center" style={{ left: X(l.i), background: "#1E1B18", fontFamily: "'Permanent Marker', cursive", fontSize: 90, color: "#3A352E" }}>
            {l.t}
          </div>
        ))}
        {FLYERS.map((f, i) => (
          <FlyerCard key={f.org} f={f} i={i} cur={reel.cur} turn={reel.turn} onPick={reel.pick} />
        ))}
      </div>
      </div>
    </div>
  );
}

function Clapper({ reel, scale = 1 }: { reel: Reel; scale?: number }) {
  const f = FLYERS[reel.cur];
  return (
    <div className="relative" style={{ width: 300 * scale, height: 250 * scale }}>
      <svg width={300 * scale} height={250 * scale} viewBox="0 0 300 250" aria-hidden className="absolute left-0 top-0">
        <g fill="none" stroke="#F4F4F4" strokeWidth="4" strokeLinejoin="round" style={{ filter: "drop-shadow(0 0 6px rgba(255,255,255,0.45))" }}>
          <rect x="20" y="84" width="260" height="150" rx="6" />
          <path d="M20 124 H280 M150 124 V234" />
          <g key={reel.turn} className="ex-clap">
            <rect x="20" y="50" width="260" height="34" rx="4" />
            <path d="M44 50 L62 84 M94 50 L112 84 M144 50 L162 84 M194 50 L212 84 M244 50 L262 84" />
          </g>
        </g>
      </svg>
      <div className="absolute left-0 top-0 origin-top-left" style={{ width: 300, height: 250, transform: `scale(${scale})`, fontFamily: "'Permanent Marker', cursive", color: "#F4F4F4" }}>
        <span className="absolute left-[32px] top-[136px] text-[24px]">SCENE</span>
        <span className="absolute left-[162px] top-[136px] text-[24px]">TAKE</span>
        <span className="absolute left-[40px] top-[174px] text-[40px] leading-none text-[#FFD23F]">{pad(reel.cur + 1)}</span>
        <span className="absolute left-[166px] top-[174px] text-[40px] leading-none text-[#FFD23F]">{f.take}</span>
      </div>
    </div>
  );
}

function Subtitle({ reel, size }: { reel: Reel; size: number }) {
  const f = FLYERS[reel.cur];
  return (
    <div className="text-center" aria-live="polite">
      <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 13, fontWeight: 700, letterSpacing: 4, color: "#BDB3A6" }}>
        {f.org.toUpperCase()} · {f.role.toUpperCase()}
      </div>
      <p key={reel.turn} className="ex-sub m-0 mt-3" style={{ fontSize: size, lineHeight: 1.45 }}>
        {f.text}
      </p>
    </div>
  );
}

const SCRAPS = [
  { y: 180, w: 24, h: 16, c: "#ECE4D2", delay: 2 },
  { y: 580, w: 18, h: 14, c: "#FFD23F", delay: 2.3 },
  { y: 860, w: 22, h: 16, c: "#E2B5F0", delay: 2.15 },
];

const DRIPS = [
  { x: 0.833, y: 1.0, h: 0.52, w: 0.052 },
  { x: 3.458, y: 0.85, h: 0.4, w: 0.042 },
];

const Experience = () => {
  const desktop = useMediaQuery("(min-width: 900px)");
  const [ref, on] = useInView<HTMLElement>(0.2);
  const [screenRef, onScreen] = useOnScreen<HTMLDivElement>();
  const reel = useReel(on && onScreen);
  const [boxRef, boxW] = useWidth<HTMLDivElement>();

  // The strip is pulled in from the right like film off a reel, and the clapperboard settles in after it.
  useLayoutEffect(() => {
    const root = ref.current;
    if (!root) return;
    const ctx = gsap.context(() => {
      settle(root.querySelectorAll("[data-ex-pull]"), { x: 900 }, { trigger: root, start: "top 70%", duration: 1.1 });
      settle(root.querySelectorAll("[data-ex-clapper]"), { y: 60, rotation: -8, opacity: 0 }, { trigger: root, start: "top 55%", delay: 0.5 });
    }, root);
    return () => ctx.revert();
  }, [ref, desktop]);

  return (
    <section id="experience" ref={ref} aria-label="Experience" className={`ex-root ${on ? "is-on" : ""}`}>
      <div ref={screenRef}>
        {desktop ? (
          <ScaledStage w={1440} h={900}>
            <div className="absolute" style={{ left: 70, top: 22 }}>
              <SprayHeading text="EXPERIENCE" size="96px" drips={DRIPS} />
            </div>
            <div className="absolute left-0" style={{ top: 196, width: 1440, height: 360 }}>
              <Strip reel={reel} width={1440} />
            </div>
            <div data-ex-clapper className="absolute" style={{ left: 60, top: 606 }}>
              <Clapper reel={reel} />
            </div>
            <div className="absolute flex items-center justify-center" style={{ left: 400, top: 600, width: 980, height: 250 }}>
              <Subtitle reel={reel} size={23} />
            </div>
            {SCRAPS.map((b) => (
              <div key={b.y} className="ex-scrap" style={{ top: b.y, width: b.w, height: b.h, background: b.c, animationDelay: `${b.delay}s` }} />
            ))}
          </ScaledStage>
        ) : (
          <div className="pb-16 pt-12">
            <div className="px-5">
              <SprayHeading text="EXPERIENCE" size="clamp(48px, 13vw, 80px)" drips={DRIPS} />
            </div>
            <div ref={boxRef} className="relative mt-8 w-full overflow-hidden" style={{ height: 360 * 0.72 }}>
              {boxW > 0 && (
                <div className="absolute left-0 top-0 origin-top-left" style={{ width: boxW / 0.72, height: 360, transform: "scale(0.72)" }}>
                  <Strip reel={reel} width={boxW / 0.72} />
                </div>
              )}
            </div>
            <div className="mt-6 flex flex-col items-center gap-6 px-5">
              <Clapper reel={reel} scale={0.6} />
              <Subtitle reel={reel} size={18} />
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default Experience;
