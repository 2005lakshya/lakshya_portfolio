import { useEffect, useId, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { Volume2, VolumeX } from "lucide-react";
import "./recordCrate.css";
import { CRATE_RECORDS, type CrateRecord } from "./crateData";
import { LabelIcon } from "./LabelIcons";
import { RecordScene } from "./RecordScenes";
import {
  getSoundState,
  installUnlock,
  playArmLift,
  playFlick,
  playFlip,
  playNeedleDrop,
  playSlide,
  playTheme,
  playWindDown,
  setSoundEnabled,
  startCrackle,
  stopCrackle,
  subscribeSound,
} from "./crateSounds";

/**
 * The Projects section as a record crate: dig through the crate, pull a record
 * out and it lands on the turntable; its cover stands beside the deck and turns
 * over on hover to show a small scene of what the project is about.
 *
 * Desktop draws the whole scene on a fixed 1280x730 stage and scales it to fit
 * the column. Phones get the same pieces stacked, with a swipeable shelf in
 * place of the crate, since there is no hover to dig with.
 */

const STAGE_W = 1280;
const STAGE_H = 730;
const DESKTOP_QUERY = "(min-width: 900px)";
const HOVER_QUERY = "(hover: hover)";
const EASE = "cubic-bezier(0.16,1,0.3,1)";
const IMPACT = "Impact, Anton, 'Bebas Neue', sans-serif";
const GROOVES = "repeating-radial-gradient(circle at 50% 50%, #0B0B0B 0 2px, #1D1D1D 2px 4px)";
const FINE_GROOVES = "repeating-radial-gradient(circle at 50% 50%, #090909 0 1.5px, #171717 1.5px 3px)";
/** Where the tonearm rests on the record, in degrees from pointing straight down. */
const ARM_PLAY = 35.7;

/** The "now playing" dot is red, except on a red sleeve where it would vanish. */
const playingDot = (r: CrateRecord) => (r.color.toUpperCase() === "#FA1A1D" ? "#FFFFFF" : "#FA1A1D");

/* ------------------------------------------------------------------ hooks */

function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(() => window.matchMedia(query).matches);
  useEffect(() => {
    const mq = window.matchMedia(query);
    const onChange = () => setMatches(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, [query]);
  return matches;
}

function useWidth<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [width, setWidth] = useState(0);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => setWidth(entry.contentRect.width));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  return [ref, width] as const;
}

function useSound() {
  const [state, setState] = useState(getSoundState);
  useEffect(() => subscribeSound(setState), []);
  return state;
}

/** A fixed-size drawing scaled down to fit the width it is given. */
function ScaledBox({ w, h, children }: { w: number; h: number; children: ReactNode }) {
  const [ref, width] = useWidth<HTMLDivElement>();
  const scale = width ? Math.min(1, width / w) : 1;
  return (
    <div ref={ref} className="w-full">
      <div className="relative mx-auto" style={{ width: w * scale, height: h * scale }}>
        <div className="absolute left-0 top-0" style={{ width: w, height: h, transform: `scale(${scale})`, transformOrigin: "top left" }}>
          {children}
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ crate */

type CrateProps = {
  records: CrateRecord[];
  dig: number;
  playing: number;
  onDig: (i: number) => void;
  onPlay: (i: number) => void;
};

function Crate({ records, dig, playing, onDig, onPlay }: CrateProps) {
  const n = records.length;
  // Hit areas sit on each sleeve's resting strip and never move, so hovering never jitters.
  const tops = records.map((_, i) => Math.round(240 - 32.8 * i));

  return (
    <div
      onMouseLeave={() => onDig(-1)}
      className="absolute"
      style={{ left: 0, top: 80, width: 480, height: 640, zIndex: 10, animation: `rc-crate-in 900ms ${EASE} 100ms backwards` }}
    >
      <div className="absolute left-0 top-0" style={{ width: 480, height: 640, background: "#0F0F0F", clipPath: "polygon(48px 600px, 432px 600px, 404px 322px, 76px 322px)" }} />
      <div className="absolute" style={{ left: 76, top: 252, width: 328, height: 70, borderRadius: "8px 8px 0 0", background: "#151515", boxShadow: "inset 0 2px 0 rgba(255,255,255,0.06)" }} />

      {records.map((r, i) => {
        const scale = 1 - 0.035 * i;
        const lift = -44 * i;
        const picked = dig === i;
        let transform = `translateY(${lift}px) scale(${scale}) perspective(900px) rotateX(6deg)`;
        let filter = `brightness(${(1 - i * 0.07).toFixed(2)})`;
        if (dig > i) {
          // Every record in front of the one being dug for tips forward.
          transform = `translateY(${lift}px) scale(${scale}) perspective(900px) rotateX(-70deg)`;
          filter = "brightness(0.5)";
        } else if (picked) {
          transform = `translateY(${lift - 70}px) scale(${scale}) perspective(900px) rotateX(0deg)`;
          filter = "brightness(1.08)";
        }
        return (
          <div
            key={r.name}
            className="absolute"
            style={{ left: 80, top: 240, width: 320, height: 320, zIndex: 10 - i, animation: `rc-drop-in 900ms cubic-bezier(0.22,1,0.36,1) ${200 + (n - 1 - i) * 110}ms backwards` }}
          >
            <div
              className="relative"
              style={{ width: 320, height: 320, transformOrigin: "50% 100%", transform, filter, transition: `transform 550ms ${EASE}, filter 400ms ease-out` }}
            >
              <div
                className="absolute flex items-center justify-center"
                style={{
                  left: 14, top: 14, width: 292, height: 292, zIndex: 0, borderRadius: "50%", background: GROOVES,
                  boxShadow: "0 10px 30px -8px rgba(0,0,0,0.9)",
                  transform: `translateX(${picked ? 190 : 0}px) rotate(${picked ? 360 : 0}deg)`,
                  transition: `transform 800ms ${EASE}`,
                }}
              >
                <div className="flex flex-col items-center justify-center" style={{ width: 104, height: 104, gap: 6, borderRadius: "50%", boxShadow: "0 0 0 3px #000", background: r.color, color: r.ink }}>
                  <span style={{ fontFamily: IMPACT, fontSize: 14, lineHeight: 1 }}>{r.upper}</span>
                  <span style={{ width: 8, height: 8, borderRadius: 4, background: "#000" }} />
                </div>
              </div>
              <div className="absolute inset-0" style={{ zIndex: 1, borderRadius: 6, background: r.color, boxShadow: "inset 0 2px 0 rgba(255,255,255,0.3), 0 18px 40px -16px rgba(0,0,0,0.9)" }} />
              <div className="absolute inset-0 flex flex-col" style={{ zIndex: 2, padding: "9px 16px 16px", gap: 10, color: r.ink }}>
                <div className="flex items-center justify-between" style={{ height: 26 }}>
                  <div className="flex items-center" style={{ gap: 10 }}>
                    <span style={{ fontFamily: IMPACT, fontSize: 25, lineHeight: 1 }}>{r.upper}</span>
                    {i === playing && <span className="rc-pulse-dot" style={{ width: 10, height: 10, borderRadius: 5, background: playingDot(r) }} />}
                  </div>
                  <Asterisk size={18} />
                </div>
                <img src={r.image} alt="" draggable={false} style={{ display: "block", width: 288, height: 246, objectFit: "cover", borderRadius: 4 }} />
              </div>
            </div>
          </div>
        );
      })}

      <div
        className="absolute flex flex-col items-center justify-center"
        style={{ left: 40, top: 470, width: 400, height: 150, zIndex: 40, gap: 16, borderRadius: 14, background: "#151515", border: "2px solid #2E2E2E", boxShadow: "0 -18px 30px -10px rgba(0,0,0,0.9)" }}
      >
        <div style={{ width: 120, height: 24, borderRadius: 12, background: "#000", boxShadow: "inset 0 2px 6px rgba(255,255,255,0.08)" }} />
        <span style={{ fontFamily: IMPACT, fontSize: 22, letterSpacing: 3, color: "#3C3C3C" }}>VOL. 1</span>
      </div>

      {records.map((r, i) => {
        const last = i === n - 1;
        const top = i === 0 ? 240 : tops[i] - (last ? 20 : 0);
        const height = i === 0 ? 230 : tops[i - 1] - tops[i] + (last ? 20 : 0);
        return (
          <button
            key={r.name}
            type="button"
            aria-label={`Play ${r.name}`}
            aria-pressed={i === playing}
            onMouseEnter={() => onDig(i)}
            onFocus={() => onDig(i)}
            onClick={() => onPlay(i)}
            className="absolute cursor-pointer border-none bg-transparent p-0"
            style={{ left: 80, top, width: 320, height, zIndex: 50 }}
          />
        );
      })}
    </div>
  );
}

function Asterisk({ size }: { size: number }) {
  return (
    <svg viewBox="0 0 40.2117 44.5" width={size} height={size * (44.5 / 40.2117)} fill="none" aria-hidden="true">
      <path
        d="M20.325 19V0M23.825 21L38.825 11M23.825 24.5L38.825 33.5M20.325 26.5V44.5M17.325 24.5L1.325 33.5M17.325 21L1.325 11"
        stroke="currentColor"
        strokeWidth={5}
      />
    </svg>
  );
}

/* -------------------------------------------------------------- turntable */

type DeckProps = { now: CrateRecord; turn: number; first: boolean; stopped: boolean; onToggle: () => void; style?: CSSProperties };

function Turntable({ now, turn, first, stopped, onToggle, style }: DeckProps) {
  const ringId = `rc-ring-${useId().replace(/:/g, "")}`;
  const spin = `rc-spin-record${stopped ? " rc-paused" : ""}`;
  const ring = now.ink === "#FFFFFF" ? "rgba(255,255,255,0.45)" : "rgba(11,21,80,0.35)";
  // Short names go round the label twice so the ring is full.
  const labelText = now.upper.length > 8 ? `${now.upper} • 33⅓ RPM • SIDE A • ` : `${now.upper} • 33⅓ RPM • ${now.upper} • 33⅓ RPM • `;

  return (
    <div className="absolute" style={{ width: 500, height: 420, ...style }}>
      <div
        className="absolute inset-0"
        style={{ borderRadius: 28, background: "#141414", border: "1px solid #262626", boxShadow: "inset 0 1px 0 rgba(255,255,255,0.05), 0 40px 80px -30px rgba(0,0,0,0.9)", animation: `rc-deck-in 1000ms ${EASE} 250ms backwards` }}
      />

      <div
        className="absolute"
        style={{ left: 50, top: 40, width: 340, height: 340, borderRadius: "50%", background: "#0B0B0B", border: "2px solid #2B2B2B", boxShadow: "0 0 0 8px #1B1B1B", animation: `rc-deck-in 1000ms ${EASE} 350ms backwards` }}
      >
        <div
          className={spin}
          style={{
            position: "absolute", left: 0, top: 0, width: 336, height: 336, borderRadius: "50%",
            background: "repeating-conic-gradient(#3A3A3A 0 2deg, transparent 2deg 10deg)",
            WebkitMaskImage: "radial-gradient(circle, transparent 0 161px, #000 162px 168px)",
            maskImage: "radial-gradient(circle, transparent 0 161px, #000 162px 168px)",
          }}
        />
      </div>

      <div key={`rec-${turn}`} className="absolute" style={{ left: 60, top: 50, width: 320, height: 320, animation: `rc-rec-in 1000ms ${EASE} ${first ? 900 : 0}ms backwards` }}>
        <div className={`${spin} relative flex items-center justify-center`} style={{ width: 320, height: 320, borderRadius: "50%", background: FINE_GROOVES }}>
          <div className="relative overflow-hidden" style={{ width: 120, height: 120, borderRadius: "50%", boxShadow: "0 0 0 3px #000" }}>
            <svg width={120} height={120} viewBox="0 0 120 120" aria-hidden="true" style={{ display: "block" }}>
              <defs>
                <path id={ringId} d="M60,60 m-47,0 a47,47 0 1,1 94,0 a47,47 0 1,1 -94,0" />
              </defs>
              <circle cx={60} cy={60} r={60} fill={now.color} />
              <circle cx={60} cy={60} r={37} fill="none" stroke={ring} strokeWidth={1.5} />
              <text fontFamily="Inter, sans-serif" fontSize={8} fontWeight={800} letterSpacing={1.3} fill={now.ink}>
                <textPath href={`#${ringId}`}>{labelText}</textPath>
              </text>
            </svg>
            <div className="absolute" style={{ left: 41, top: 19 }}>
              <LabelIcon kind={now.icon} size={38} />
            </div>
            <span className="absolute text-center" style={{ left: 40, top: 76, width: 40, fontFamily: IMPACT, fontSize: 11, lineHeight: 1, color: now.ink }}>33⅓</span>
          </div>
        </div>
        <div
          className="pointer-events-none absolute left-0 top-0"
          style={{
            width: 320, height: 320, borderRadius: "50%",
            background: "conic-gradient(from 25deg, rgba(255,255,255,0) 0deg, rgba(255,255,255,0.09) 30deg, rgba(255,255,255,0) 62deg, rgba(255,255,255,0) 185deg, rgba(255,255,255,0.07) 212deg, rgba(255,255,255,0) 242deg)",
          }}
        />
        <div className="absolute" style={{ left: 154, top: 154, width: 12, height: 12, borderRadius: 6, background: "#CFCFCF" }} />
      </div>

      <div className="absolute" style={{ left: 449, top: 206, width: 22, height: 22, borderRadius: 11, background: "#242424", boxShadow: "inset 0 2px 0 rgba(255,255,255,0.06)" }} />

      <div
        key={`arm-${turn}`}
        className="absolute"
        style={{
          left: 456, top: 40, width: 8, height: 173, zIndex: 3, transformOrigin: "4px 0",
          transform: `rotate(${stopped ? 0 : ARM_PLAY}deg)`,
          transition: "transform 900ms cubic-bezier(0.65,0,0.35,1)",
          animation: `rc-arm-cue 1800ms ease-in-out ${first ? 700 : 0}ms`,
        }}
      >
        <div className="absolute" style={{ left: -11, top: -44, width: 30, height: 36, borderRadius: 6, background: "#3A3A3A" }} />
        <div className="absolute left-0 top-0" style={{ width: 8, height: 173, borderRadius: 4, background: "#CFCFCF" }} />
        <div className="absolute" style={{ left: -10, top: 158, width: 28, height: 40, borderRadius: 4, background: "#E6E6E6", transform: "rotate(18deg)" }}>
          <div className="absolute" style={{ left: 9, top: 27, width: 10, height: 12, borderRadius: 2, background: "#FA1A1D" }} />
        </div>
      </div>
      <div className="absolute flex items-center justify-center" style={{ left: 430, top: 10, width: 60, height: 60, zIndex: 4, borderRadius: 30, background: "#232323", border: "2px solid #333" }}>
        <div style={{ width: 24, height: 24, borderRadius: 12, background: "#3C3C3C" }} />
      </div>

      <button
        type="button"
        onClick={onToggle}
        aria-pressed={stopped}
        className="rc-stop absolute cursor-pointer border-none text-[13px] font-bold text-[#F4F4F4]"
        style={{ left: 16, top: 362, zIndex: 5, minWidth: 76, height: 44, padding: "0 14px", borderRadius: 10, background: "#222" }}
      >
        {stopped ? "Play" : "Stop"}
      </button>
    </div>
  );
}

/* ------------------------------------------------------------ cover stand */

type StandProps = {
  now: CrateRecord;
  turn: number;
  first: boolean;
  flipped: boolean;
  canHover: boolean;
  onFlip: (on: boolean) => void;
  style?: CSSProperties;
};

function Stand({ now, turn, first, flipped, canHover, onFlip, style }: StandProps) {
  const coverSize = now.upper.length > 9 ? 30 : 44;
  return (
    <div
      className="absolute"
      onMouseEnter={canHover ? () => onFlip(true) : undefined}
      onMouseLeave={canHover ? () => onFlip(false) : undefined}
      style={{ width: 234, height: 440, animation: `rc-stand-in 1000ms ${EASE} 450ms backwards`, ...style }}
    >
      <div key={`disc-${turn}`} className="absolute" style={{ left: 17, top: 0, width: 200, height: 200, animation: `rc-disc-in 900ms ${EASE} ${first ? 1500 : 550}ms backwards` }}>
        <div className="rc-spin-disc flex items-center justify-center" style={{ width: 200, height: 200, borderRadius: "50%", background: FINE_GROOVES, boxShadow: "0 -6px 20px -6px rgba(0,0,0,0.9)" }}>
          <div className="flex items-center justify-center" style={{ width: 72, height: 72, borderRadius: "50%", background: now.color, boxShadow: "0 0 0 2px #000" }}>
            <span style={{ width: 7, height: 7, borderRadius: 4, background: "#000" }} />
          </div>
        </div>
      </div>

      <button
        key={`cover-${turn}`}
        type="button"
        onClick={() => onFlip(!flipped)}
        aria-pressed={flipped}
        aria-label={`Flip the ${now.name} cover`}
        className="rc-stand absolute cursor-pointer border-none bg-transparent p-0"
        style={{ left: 9, top: 94, width: 216, height: 216, perspective: 900, animation: `rc-cover-in 900ms ${EASE} ${first ? 1200 : 250}ms backwards` }}
      >
        <div className="rc-flip relative" style={{ width: 216, height: 216, transform: `rotateY(${flipped ? 180 : 0}deg)` }}>
          <div className="rc-face" style={{ background: now.color, color: now.ink, boxShadow: "0 26px 44px -16px rgba(0,0,0,0.95)" }}>
            <img
              src={now.image}
              alt={`${now.name} album cover`}
              draggable={false}
              className="absolute"
              style={{ left: 14, top: 16, width: 188, height: 122, objectFit: "cover", border: `3px solid ${now.ink}`, transform: "rotate(-2.5deg)", boxShadow: "0 8px 16px -6px rgba(0,0,0,0.6)" }}
            />
            <span className="absolute text-left" style={{ left: 14, bottom: 12, fontFamily: IMPACT, fontSize: coverSize, lineHeight: 0.9 }}>
              {now.upper}
            </span>
            <div className="rc-sheen pointer-events-none absolute inset-0" />
          </div>
          <div className="rc-face" style={{ transform: "rotateY(180deg)", background: now.color, boxShadow: "0 26px 44px -16px rgba(0,0,0,0.95)" }}>
            <div style={{ width: 288, height: 246, transformOrigin: "0 0", transform: "translateX(-18.4px) scale(0.878)" }}>
              <RecordScene kind={now.scene} />
            </div>
          </div>
        </div>
      </button>

      <div className="absolute" style={{ left: 3, top: 312, width: 228, height: 10, borderRadius: 3, background: "#2A2A2A" }} />
      <div className="absolute" style={{ left: 30, top: 320, width: 6, height: 92, borderRadius: 3, background: "#242424", transformOrigin: "top", transform: "rotate(10deg)" }} />
      <div className="absolute" style={{ left: 198, top: 320, width: 6, height: 92, borderRadius: 3, background: "#242424", transformOrigin: "top", transform: "rotate(-10deg)" }} />
    </div>
  );
}

/* ------------------------------------------------------------ now playing */

function NowPlayingHead({ now, stopped, turn, first, size }: { now: CrateRecord; stopped: boolean; turn: number; first: boolean; size: number }) {
  const at = (step: number) => `rc-info-in 600ms ${EASE} ${(first ? 1100 : 250) + step * 70}ms backwards`;
  return (
    <div key={`head-${turn}`} className="flex flex-col" style={{ gap: 10 }}>
      <div className="flex items-end" style={{ gap: 10, height: 18, animation: at(0) }}>
        <div className={`flex items-end${stopped ? " rc-paused" : ""}`} style={{ gap: 3, height: 16 }}>
          {[0, 1, 2, 3].map((b) => (
            <span key={b} className="rc-eq-bar" style={{ width: 4, height: 16, background: now.textColor }} />
          ))}
        </div>
        <span className="text-[14px] font-semibold text-[#9A9A9A]">{stopped ? "Paused" : "Now playing"}</span>
      </div>
      <div style={{ fontFamily: IMPACT, fontSize: size, lineHeight: 1, color: now.textColor, animation: at(1) }}>{now.upper}</div>
      <div className="flex flex-wrap" style={{ gap: 10, marginTop: 6, animation: at(2) }}>
        {now.links.map((l) => (
          <a
            key={l.href}
            href={l.href}
            target="_blank"
            rel="noreferrer"
            className="rc-pill flex items-center text-[14px] font-semibold text-[#F4F4F4] no-underline"
            style={{ height: 44, padding: "0 18px", borderRadius: 22, border: "1.5px solid #F4F4F4" }}
          >
            {l.label}
          </a>
        ))}
      </div>
    </div>
  );
}

function Description({ now, turn, first }: { now: CrateRecord; turn: number; first: boolean }) {
  return (
    <p
      key={`desc-${turn}`}
      className="m-0 text-[15.5px] leading-[1.6] text-[#D9D9D9]"
      style={{ animation: `rc-info-in 700ms ${EASE} ${first ? 1340 : 460}ms backwards` }}
    >
      {now.description}
    </p>
  );
}

/* -------------------------------------------------------------- the section */

export default function RecordCrate() {
  const records = CRATE_RECORDS;
  const isDesktop = useMediaQuery(DESKTOP_QUERY);
  const canHover = useMediaQuery(HOVER_QUERY);
  const sound = useSound();

  const [dig, setDig] = useState(-1);
  const [playing, setPlaying] = useState(0);
  const [turn, setTurn] = useState(0);
  const [stopped, setStopped] = useState(false);
  const [cueing, setCueing] = useState(false);
  const [flipped, setFlipped] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const [inView, setInView] = useState(false);

  const rootRef = useRef<HTMLDivElement>(null);
  const digRef = useRef(-1);
  const flippedRef = useRef(false);
  const cueTimers = useRef<number[]>([]);
  const themeTimer = useRef<number>();

  const now = records[playing];
  const first = turn === 0;

  useEffect(() => installUnlock(), []);

  // Entrances play when the section is reached; the crackle only runs while it is on screen.
  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const reveal = new IntersectionObserver(([e]) => e.isIntersecting && setRevealed(true), { rootMargin: "0px 0px -15% 0px" });
    const visible = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold: 0.2 });
    reveal.observe(el);
    visible.observe(el);
    return () => {
      reveal.disconnect();
      visible.disconnect();
    };
  }, []);

  useEffect(() => {
    if (inView && revealed && !stopped && !cueing && sound.enabled && sound.unlocked) startCrackle();
    else stopCrackle();
  }, [inView, revealed, stopped, cueing, sound.enabled, sound.unlocked]);

  useEffect(
    () => () => {
      stopCrackle();
      cueTimers.current.forEach(clearTimeout);
      window.clearTimeout(themeTimer.current);
    },
    [],
  );

  const cue = (fn: () => void, ms: number) => {
    cueTimers.current.push(window.setTimeout(fn, ms));
  };
  const clearCue = () => {
    cueTimers.current.forEach(clearTimeout);
    cueTimers.current = [];
  };

  const digTo = (i: number) => {
    if (digRef.current === i) return;
    digRef.current = i;
    setDig(i);
    if (i >= 0) playFlick();
  };

  const flipTo = (on: boolean) => {
    if (flippedRef.current === on) return;
    flippedRef.current = on;
    setFlipped(on);
    window.clearTimeout(themeTimer.current);
    if (on) {
      playFlip();
      const scene = records[playing].scene;
      themeTimer.current = window.setTimeout(() => playTheme(scene), 380);
    }
  };

  const play = (i: number) => {
    if (i === playing) return;
    setPlaying(i);
    setTurn((t) => t + 1);
    setStopped(false);
    flippedRef.current = false;
    setFlipped(false);
    // The tonearm lifts, the record lands, and the needle drops back on at the end of the cue.
    clearCue();
    setCueing(true);
    playSlide();
    cue(playNeedleDrop, 1750);
    cue(() => setCueing(false), 1800);
  };

  const toggleStop = () => {
    clearCue();
    if (!stopped) {
      setStopped(true);
      setCueing(false);
      playArmLift();
      playWindDown();
    } else {
      setStopped(false);
      setCueing(true);
      cue(playNeedleDrop, 850);
      cue(() => setCueing(false), 900);
    }
  };

  return (
    <div ref={rootRef} className="rc-root relative pb-24 text-white">
      <div className="mb-10 flex flex-wrap items-center justify-center gap-3 px-6 text-center" style={{ animation: `rc-fade-up 700ms ${EASE} backwards` }}>
        <button
          type="button"
          onClick={() => setSoundEnabled(!sound.enabled)}
          aria-pressed={sound.enabled}
          className="rc-sound inline-flex h-11 cursor-pointer items-center gap-2 rounded-full border border-[#333] bg-transparent px-4 text-[13px] font-semibold text-[#9A9A9A]"
        >
          {sound.enabled ? <Volume2 size={16} aria-hidden="true" /> : <VolumeX size={16} aria-hidden="true" />}
          {sound.enabled ? "Sound on" : "Sound off"}
        </button>
      </div>

      {isDesktop ? (
        <div className="px-6 lg:px-10">
          <ScaledBox w={STAGE_W} h={STAGE_H}>
            {revealed && (
              <>
                <Crate records={records} dig={dig} playing={playing} onDig={digTo} onPlay={play} />
                <Turntable now={now} turn={turn} first={first} stopped={stopped} onToggle={toggleStop} style={{ left: 520, top: 46 }} />
                <Stand now={now} turn={turn} first={first} flipped={flipped} canHover={canHover} onFlip={flipTo} style={{ left: 1048, top: 10 }} />
                <div className="absolute" style={{ left: 520, top: 496, width: 280 }}>
                  <NowPlayingHead now={now} stopped={stopped} turn={turn} first={first} size={now.upper.length > 10 ? 40 : 52} />
                </div>
                <div className="absolute" style={{ left: 816, top: 502, width: 1, height: 220, background: "#262626" }} />
                <div className="absolute" style={{ left: 840, top: 498, width: 440 }}>
                  <Description now={now} turn={turn} first={first} />
                </div>
              </>
            )}
          </ScaledBox>
        </div>
      ) : (
        <div className="mx-auto flex max-w-xl flex-col gap-10 px-5">
          <div className="-mx-5 flex snap-x gap-3 overflow-x-auto px-5 pb-2">
            {records.map((r, i) => (
              <button
                key={r.name}
                type="button"
                onClick={() => play(i)}
                aria-pressed={i === playing}
                aria-label={`Play ${r.name}`}
                className="rc-shelf-item relative shrink-0 snap-start cursor-pointer overflow-hidden border-none p-0"
                style={{ width: 132, height: 132, borderRadius: 6, background: r.color, color: r.ink, outline: i === playing ? "3px solid #F4F4F4" : "none", outlineOffset: 3 }}
              >
                <span className="absolute left-2 top-1.5 text-left" style={{ fontFamily: IMPACT, fontSize: 16, lineHeight: 1 }}>{r.upper}</span>
                {i === playing && <span className="rc-pulse-dot absolute right-2 top-2" style={{ width: 9, height: 9, borderRadius: 5, background: playingDot(r) }} />}
                <img src={r.image} alt="" draggable={false} className="absolute" style={{ left: 8, top: 28, width: 116, height: 96, objectFit: "cover", borderRadius: 3 }} />
              </button>
            ))}
          </div>

          <ScaledBox w={500} h={420}>
            <Turntable now={now} turn={turn} first={first} stopped={stopped} onToggle={toggleStop} style={{ left: 0, top: 0 }} />
          </ScaledBox>

          <div className="flex flex-col gap-5">
            <NowPlayingHead now={now} stopped={stopped} turn={turn} first={first} size={now.upper.length > 10 ? 36 : 44} />
            <Description now={now} turn={turn} first={first} />
          </div>

          <div className="relative mx-auto" style={{ width: 234, height: 440 }}>
            <Stand now={now} turn={turn} first={first} flipped={flipped} canHover={canHover} onFlip={flipTo} style={{ left: 0, top: 0 }} />
          </div>
        </div>
      )}
    </div>
  );
}
