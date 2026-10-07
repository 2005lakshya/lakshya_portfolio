import { useEffect, useState, type CSSProperties, type RefObject } from "react";
import { ArrowRight, ArrowUpRight, ChevronsRight, Github, Linkedin } from "lucide-react";
import { profileData } from "@/data/portfolio";
import "./landing.css";
import type { LandMode } from "./landCam";
import { MENU, STEPS, WHERE, type Section } from "./menu";

const GITHUB = `https://github.com/${profileData.github}`;
const LINKEDIN = `https://www.linkedin.com/in/${profileData.linkedin}`;
const RESUME = "/Lakshya_Gupta_Resume.pdf";
// (the shortcut stickers are the menu's; Projects a shade deeper, so white on it reads small)
const CHIP_BG: Partial<Record<Section, string>> = { projects: "#E3171C" };

type Props = {
  mode: LandMode;
  squat: boolean;
  ready: boolean;
  walking: boolean;
  settled: boolean;
  cue: boolean;
  /** a section asked for while it was still loading (opened as soon as it's ready) */
  queued: Section | "";
  step: number;
  rootRef: RefObject<HTMLDivElement>;
  progRef: RefObject<HTMLDivElement>;
  barRef: RefObject<HTMLDivElement>;
  pctRef: RefObject<HTMLSpanElement>;
  pctInkRef: RefObject<HTMLSpanElement>;
  walkRef: RefObject<HTMLButtonElement>;
  doorRef: (el: HTMLDivElement | null) => void;
  onEnter: () => void;
  onSkip: () => void;
  onJump: (id: Section) => void;
  onCue: (on: boolean) => void;
};

/**
 * The way in, over the house on its lawn: who lives here (a poster in the zine's own style: a sticker, his name in
 * tall type with the surname sprayed over it, what he does), the way in (the loading bar, then COME ON IN in its
 * place, and a KNOCK KNOCK! sticker on the real door), shortcuts straight to a section, and his links. The same
 * DOM while it loads and when it's ready, so nothing moves at ready. Clicks pass through everywhere else to the 3D
 * door. Fades away as the walk in starts.
 */
export default function Landing(p: Props) {
  const { mode, squat, ready, walking, settled, cue, queued, step } = p;
  // the bar stays a moment after ready, fading under COME ON IN as it stamps in
  const [lingering, setLingering] = useState(true);
  useEffect(() => {
    if (!ready) return;
    const t = window.setTimeout(() => setLingering(false), 400);
    return () => window.clearTimeout(t);
  }, [ready]);
  // while walking in, the poster is gone for pointers, keyboards and screen readers alike
  useEffect(() => { p.rootRef.current?.toggleAttribute("inert", walking); }, [walking, p.rootRef]);

  const queuedLabel = queued ? MENU.find(([id]) => id === queued)?.[1] : "";
  const label = queuedLabel ? `Opening ${queuedLabel.toLowerCase()}…` : STEPS[Math.max(0, Math.min(STEPS.length - 1, step))];
  const chip = ([id, text, bg, ink, tilt]: (typeof MENU)[number]) => (
    <button
      key={id}
      type="button"
      onClick={() => p.onJump(id)}
      aria-pressed={ready ? undefined : queued === id}
      title={`${text.charAt(0)}${text.slice(1).toLowerCase()}: ${WHERE[id]}`}
      className="land-chip land-marker land-focus"
      style={{ background: CHIP_BG[id] ?? bg, color: ink, "--rot": `${tilt}deg` } as CSSProperties}
    >
      {text}
    </button>
  );

  const who = (
    <>
      <h1 className="land-h1">
        <span className="land-hi land-marker land-in">Hi, I'm</span>{" "}
        <span className="land-first land-anton land-in">Lakshya</span>{" "}
        <span className="land-last land-marker land-in">
          Gupta
          <span aria-hidden="true" className="land-drip land-in" style={{ "--x": ".98em", "--y": ".9em", "--h": ".2em", "--w": ".055em" } as CSSProperties} />
          <span aria-hidden="true" className="land-drip land-in" style={{ "--x": "3.02em", "--y": ".84em", "--h": ".22em", "--w": ".045em" } as CSSProperties} />
        </span>
      </h1>
      <p className="land-role land-anton land-in">Developer <i>/</i> Data Scientist</p>
      <p className="land-stand land-in">I build apps, websites and AI experiments. This is my house: come on in and have a look around.</p>
      <ul className="land-credits land-mono land-in">
        <li>B.Tech CSE (Data Science) · VIT Vellore</li>
        <li>Ex summer intern @ NTT DATA</li>
        <li>Based in Gurgaon, India</li>
      </ul>
    </>
  );

  const actions = (
    <>
      <div className="land-cta land-in">
        {(!ready || lingering) && (
          <div ref={p.progRef} role="progressbar" aria-label="Building the house" aria-valuemin={0} aria-valuemax={100} aria-valuenow={0} className="land-prog">
            <div ref={p.barRef} className="land-prog-fill" style={{ transform: "scaleX(0.04)" }} />
            <div className="land-prog-label land-marker">
              <span className="land-prog-step">{label}</span>
              <span ref={p.pctRef} className="land-prog-pct land-mono">0%</span>
            </div>
            {/* the same words in ink, showing only over the yellow, so they read on both */}
            <div className="land-prog-label ink land-marker" aria-hidden="true">
              <span className="land-prog-step">{label}</span>
              <span ref={p.pctInkRef} className="land-prog-pct land-mono">0%</span>
            </div>
          </div>
        )}
        {ready && (
          <>
            <span className="land-knock">
              <button
                type="button"
                onClick={p.onEnter}
                onPointerEnter={() => p.onCue(true)}
                onPointerLeave={() => p.onCue(false)}
                onFocus={() => p.onCue(true)}
                onBlur={() => p.onCue(false)}
                aria-describedby="land-go-desc"
                className="land-go land-marker land-focus"
              >
                Come on in <ArrowRight size={22} strokeWidth={3} aria-hidden="true" />
              </button>
            </span>
            <button type="button" onClick={p.onSkip} aria-label="Skip the walk" className="land-skip land-marker land-focus">
              <span className="l">Skip the walk</span>
              <span className="s">Skip</span>
            </button>
            <span id="land-go-desc" hidden>Walks you up the garden path and in through the front door.</span>
          </>
        )}
      </div>
      <nav className="land-jump land-in" aria-label="Jump straight to a section">
        <p className="land-jump-label land-mono" aria-hidden="true">{ready ? "Or jump straight to" : "In a hurry? Go straight to"}</p>
        <div className="land-rows">
          <div>{MENU.slice(0, 3).map(chip)}</div>
          <div>{MENU.slice(3).map(chip)}</div>
        </div>
      </nav>
    </>
  );

  return (
    <>
      <div
        ref={p.rootRef}
        className="land-root"
        data-mode={mode}
        data-squat={squat ? "1" : undefined}
        data-ready={ready ? "1" : undefined}
        data-walking={walking ? "1" : undefined}
        data-settled={settled ? "1" : undefined}
        data-cue={cue ? "1" : undefined}
        aria-hidden={walking || undefined}
      >
        <div className="land-tr" aria-hidden="true" />
        {mode === "tall" ? (
          <>
            <div className="land-top">
              <div data-land="top" className="land-fade">{who}</div>
            </div>
            <div className="land-bot">
              <div data-land="bottom" className="land-fade">{actions}</div>
            </div>
          </>
        ) : (
          <div className="land-col">
            <div data-land="col" className="land-fade">
              <div>{who}</div>
              <div>{actions}</div>
            </div>
          </div>
        )}
        <div className="land-util land-in">
          {mode === "wide" ? (
            <>
              <a href={GITHUB} target="_blank" rel="noopener noreferrer" aria-label="GitHub (opens in a new tab)" className="land-pill land-mono land-focus">
                GitHub <ArrowUpRight size={15} aria-hidden="true" />
              </a>
              <a href={LINKEDIN} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn (opens in a new tab)" className="land-pill land-mono land-focus">
                LinkedIn <ArrowUpRight size={15} aria-hidden="true" />
              </a>
            </>
          ) : (
            <span>
              <a href={GITHUB} target="_blank" rel="noopener noreferrer" aria-label="GitHub (opens in a new tab)" className="land-round land-focus">
                <Github size={mode === "short" ? 18 : 20} aria-hidden="true" />
              </a>
              <a href={LINKEDIN} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn (opens in a new tab)" className="land-round land-focus">
                <Linkedin size={mode === "short" ? 18 : 20} aria-hidden="true" />
              </a>
            </span>
          )}
          <a href={RESUME} target="_blank" rel="noopener noreferrer" aria-label="Résumé, PDF (opens in a new tab)" className="land-resume land-marker land-focus">
            Resume <ArrowUpRight size={mode === "wide" ? 16 : 14} strokeWidth={2.5} aria-hidden="true" />
          </a>
        </div>
        {/* KNOCK KNOCK! on the real front door: the scene keeps it pinned there. It does what COME ON IN does. */}
        {ready && (
          <div ref={p.doorRef} className="land-door" aria-hidden="true">
            <div className="land-door-in" onClick={p.onEnter}>
              <span className="land-door-tag land-marker">Knock knock!</span>
              <svg viewBox="0 0 34 30"><path d="M2 4C16 2 28 10 30 26M23 21l7 6 3-8" /></svg>
            </div>
          </div>
        )}
        <p role="status" className="sr-only">{ready ? "The house is ready. Come on in, skip the walk, or jump straight to a section." : ""}</p>
      </div>
      {walking && (
        <button ref={p.walkRef} type="button" onClick={p.onSkip} aria-label="Skip the walk" className="land-walkskip land-marker land-focus">
          Skip <ChevronsRight size={18} aria-hidden="true" />
        </button>
      )}
    </>
  );
}
