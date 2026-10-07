import { useEffect, useRef, useState, type CSSProperties, type MouseEvent, type PointerEvent } from "react";
import "./skills/skills.css";
import SprayHeading from "@/components/site/SprayHeading";
import ScaledStage from "@/components/site/ScaledStage";
import { stagePoint, useMediaQuery } from "@/components/site/hooks";
import { playClick } from "@/components/site/sfx";

/**
 * Skills as tags sprayed on a black wall in UV paint: invisible until the
 * torch passes over them. The torch follows the mouse, and wanders by itself
 * when nobody is holding it. A red count marks how many projects used a skill.
 */

const W = 1440;
const H = 900;

/** Under UV every tag lights up in the colour of the project that uses it most. */
const NEON: Record<string, string> = { RoboWars: "#F3A8FF", HackXpertise: "#FF4D50", Verimind: "#8FA2FF", "Plant Care": "#7FE3FF", MessIT: "#FFFFFF", BunkBuddies: "#FFFFFF" };
const USED: Record<string, string[]> = {
  REACT: ["RoboWars", "HackXpertise", "BunkBuddies"],
  TYPESCRIPT: ["RoboWars", "BunkBuddies"],
  PYTHON: ["Verimind", "Plant Care"],
  TAILWIND: ["RoboWars", "BunkBuddies"],
  FIREBASE: ["MessIT", "BunkBuddies"],
  FLUTTER: ["MessIT"],
  "NODE.JS": ["HackXpertise"],
  MONGODB: ["HackXpertise"],
  TENSORFLOW: ["Plant Care"],
  FLASK: ["Plant Care"],
  "GEMINI AI": ["Plant Care"],
  ML: ["Verimind"],
};
/** [name, x, y, size, rotation] on the 1440 x 900 wall. */
const LAYOUT: [string, number, number, number, number][] = [
  ["REACT", 70, 180, 120, -6], ["JAVA", 508, 214, 52, 4], ["TYPESCRIPT", 679, 190, 80, -3], ["C++", 1253, 206, 52, 8],
  ["NEXT.JS", 70, 342, 46, 5], ["PYTHON", 319, 314, 104, 3], ["TAILWIND", 773, 322, 74, -5], ["FIGMA", 1205, 334, 48, -6],
  ["FIREBASE", 70, 452, 80, -2], ["FLUTTER", 535, 458, 64, 6], ["KOTLIN", 870, 472, 46, -4], ["NODE.JS", 1088, 454, 60, 3],
  ["MONGODB", 70, 580, 68, 4], ["EXPRESS", 424, 596, 44, -5], ["TENSORFLOW", 663, 578, 72, -3], ["GIT", 1183, 586, 56, 10],
  ["FASTAPI", 70, 708, 44, -4], ["FLASK", 309, 694, 74, 5], ["GEMINI AI", 591, 700, 66, -4], ["JAVASCRIPT", 1025, 714, 42, -6],
  ["POSTGRES", 90, 816, 44, 3], ["ML", 370, 798, 64, -8], ["MYSQL", 500, 820, 44, 6], ["C#", 690, 812, 48, -4],
];

const TAGS = LAYOUT.map(([name, x, y, size, r]) => {
  const list = USED[name] ?? [];
  return { name, x, y, size, r, count: list.length, neon: list.length ? NEON[list[0]] : "#FFD23F" };
});

type Tag = (typeof TAGS)[number];

function TagText({ t, lit, flow }: { t: Tag; lit: boolean; flow?: boolean }) {
  const size = flow ? Math.max(22, Math.round(t.size * 0.42)) : t.size;
  const style: CSSProperties = flow
    ? { fontSize: size, transform: `rotate(${t.r}deg)` }
    : { left: t.x, top: t.y, fontSize: size, transform: `rotate(${t.r}deg)` };
  if (!lit) return <span className="sk-tag" style={{ ...style, color: "rgba(255,255,255,0.08)" }}>{t.name}</span>;
  return (
    <span className="sk-tag" style={{ ...style, color: t.neon, textShadow: `0 0 6px ${t.neon}, 0 0 22px ${t.neon}` }}>
      {t.name}
      {t.count > 0 && <span className="sk-n">x{t.count}</span>}
    </span>
  );
}

function Torch({ scale = 1 }: { scale?: number }) {
  return (
    <>
      <div className="absolute rounded-full" style={{ left: -300 * scale, top: -300 * scale, width: 600 * scale, height: 600 * scale, background: "radial-gradient(closest-side, rgba(150,80,255,0.26), rgba(110,50,220,0.1) 60%, transparent)", mixBlendMode: "screen" }} />
      <svg width={130 * scale} height={60 * scale} viewBox="0 0 130 60" aria-hidden className="absolute" style={{ left: 170 * scale, top: 150 * scale, transform: "rotate(42deg)", transformOrigin: `0 ${30 * scale}px` }}>
        <rect x="0" y="16" width="30" height="28" rx="4" fill="#2B2B2B" stroke="#555555" strokeWidth="2" />
        <rect x="30" y="20" width="96" height="20" rx="6" fill="#1E1E1E" stroke="#555555" strokeWidth="2" />
        <rect x="4" y="20" width="4" height="20" fill="#B983FF" />
        <rect x="64" y="25" width="14" height="10" rx="2" fill="#7A3CFF" />
      </svg>
    </>
  );
}

/** Desktop: the wall exactly as drawn, scaled to fit. */
function Wall() {
  const [at, setAt] = useState<{ x: number; y: number } | null>(null);
  const [wide, setWide] = useState(false);
  const on = at !== null;
  const r = wide ? 320 : 210;

  const move = (e: MouseEvent<HTMLDivElement>) => {
    const p = stagePoint(e.currentTarget, e.clientX, e.clientY, W, H);
    setAt({ x: Math.round(p.x), y: Math.round(p.y) });
  };

  return (
    <ScaledStage w={W} h={H} grow={1.35}>
      <div className="relative h-full w-full" style={{ cursor: "none" }} onMouseMove={move} onMouseLeave={() => { setAt(null); setWide(false); }} onMouseDown={() => { setWide(true); playClick(); }} onMouseUp={() => setWide(false)}>
        <div aria-hidden className="absolute inset-0">
          {TAGS.map((t) => <TagText key={t.name} t={t} lit={false} />)}
        </div>
        <div
          aria-hidden
          className="sk-lit absolute inset-0 pointer-events-none"
          style={{
            // Holding the button down opens the beam up.
            clipPath: on ? `circle(${r}px at ${at.x}px ${at.y}px)` : undefined,
            transition: "clip-path 220ms cubic-bezier(0.34,1.56,0.64,1)",
            animation: on ? "none" : "sk-wander 18s ease-in-out 1.4s infinite",
          }}
        >
          <div className="absolute inset-0" style={{ background: "rgba(60,20,120,0.35)" }} />
          {TAGS.map((t) => <TagText key={t.name} t={t} lit />)}
          <span className="sk-tag" style={{ left: 1150, top: 830, fontSize: 30, transform: "rotate(-4deg)", color: "#B6FF3B", textShadow: "0 0 8px #B6FF3B" }}>LG WAS HERE</span>
        </div>
        <div className="sk-torch left-0 top-0" style={{ transform: on ? `translate(${at.x}px, ${at.y}px)` : undefined, animation: on ? "none" : "sk-wander-at 18s ease-in-out 1.4s infinite" }}>
          <Torch />
        </div>
        <div className="absolute" style={{ left: 70, top: 24, zIndex: 5 }}>
          <SprayHeading text="SKILLS" size="120px" />
        </div>
      </div>
    </ScaledStage>
  );
}

/** Phones: the tags in a loose pile; the torch wanders, and a tap points it. */
function Pile() {
  const box = useRef<HTMLDivElement>(null);
  const timer = useRef<number>();
  const [at, setAt] = useState<{ x: number; y: number } | null>(null);
  useEffect(() => () => window.clearTimeout(timer.current), []);

  const point = (e: PointerEvent<HTMLDivElement>) => {
    const r = box.current?.getBoundingClientRect();
    if (!r) return;
    setAt({ x: Math.round(e.clientX - r.left), y: Math.round(e.clientY - r.top) });
    playClick();
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setAt(null), 3500);
  };

  const on = at !== null;
  return (
    <div className="px-4 pb-16 pt-10">
      <SprayHeading text="SKILLS" size="clamp(56px, 16vw, 96px)" />
      <div ref={box} className="relative mt-6" onPointerDown={point}>
        <div aria-hidden className="sk-flow text-center">
          {TAGS.map((t) => <TagText key={t.name} t={t} lit={false} flow />)}
        </div>
        <div
          aria-hidden
          className="sk-lit sk-flow absolute inset-0 text-center pointer-events-none"
          style={{ clipPath: on ? `circle(120px at ${at.x}px ${at.y}px)` : undefined, animation: on ? "none" : "sk-wander-pct 14s ease-in-out infinite", background: "rgba(60,20,120,0.35)" }}
        >
          {TAGS.map((t) => <TagText key={t.name} t={t} lit flow />)}
        </div>
        <div className="sk-torch" style={on ? { left: at.x, top: at.y } : { animation: "sk-wander-pct-at 14s ease-in-out infinite" }}>
          <Torch scale={0.55} />
        </div>
      </div>
    </div>
  );
}

const Skills = () => {
  const desktop = useMediaQuery("(min-width: 900px)");
  return (
    <section id="skills" aria-label="Skills" className="sk-root">
      <p className="sr-only">
        Skills: {TAGS.map((t) => t.name).join(", ")}.
      </p>
      {desktop ? <Wall /> : <Pile />}
    </section>
  );
};

export default Skills;
