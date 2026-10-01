import { useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import { projectsData, experienceData, achievementsData, contactData } from "@/data/portfolio";
import { usePrefersReducedMotion } from "@/components/site/hooks";

/**
 * Lakshya's room in 3D, right under the hero. The room is the menu: the
 * notebook opens About, the record crate Projects, the laptop Experience, the
 * trophy shelf Achievements and the corkboard Contact. Click the floor and he
 * walks there; click the chair and he sits back down.
 */

type Focus = "" | "about" | "projects" | "experience" | "achievements" | "contact";

const PROJECT_COLORS: [string, string][] = [
  ["#FA1A1D", "#FFFFFF"], ["#2849CB", "#FFFFFF"], ["#FFD23F", "#111111"],
  ["#BFEA88", "#111111"], ["#FDBBFF", "#111111"], ["#74D4F0", "#111111"],
];
const CARD_COLORS: [string, string][] = [
  ["#FFD23F", "#111111"], ["#FA1A1D", "#FFFFFF"], ["#74D4F0", "#111111"], ["#BFEA88", "#111111"], ["#FDBBFF", "#111111"],
];
const MENU: [Exclude<Focus, "">, string, string, string, number][] = [
  ["about", "ABOUT ME", "#F4F4F4", "#111111", -2],
  ["projects", "PROJECTS", "#FA1A1D", "#FFFFFF", 1.5],
  ["experience", "EXPERIENCE", "#74D4F0", "#111111", -1.5],
  ["achievements", "ACHIEVEMENTS", "#FFD23F", "#111111", 1],
  ["contact", "CONTACT", "#BFEA88", "#111111", -1],
];

const marker: CSSProperties = { fontFamily: "'Permanent Marker', cursive" };
const anton: CSSProperties = { fontFamily: "Anton, Impact, sans-serif" };
const mono: CSSProperties = { fontFamily: "'JetBrains Mono', monospace" };
const body: CSSProperties = { fontFamily: "'General Sans', sans-serif" };
const btn = "room-btn rounded-[10px] px-[18px] pt-[11px] pb-[9px] text-[15px] md:text-[18px] leading-none whitespace-nowrap shadow-[0_8px_22px_rgba(0,0,0,0.45)] transition-transform hover:-translate-y-0.5";
const panel = "absolute z-20 left-4 right-4 bottom-4 md:left-auto md:bottom-auto md:right-10 md:top-24 md:w-[480px] max-h-[62svh] md:max-h-[calc(100%-8rem)] overflow-y-auto room-panel-in";

const Room = () => {
  const hostRef = useRef<HTMLDivElement>(null);
  const [focus, setFocus] = useState<Focus>("");
  const [proj, setProj] = useState(0);
  const [entered, setEntered] = useState(false);
  const [night, setNight] = useState(false);
  const [hover, setHover] = useState<Exclude<Focus, ""> | null>(null);
  const labelRef = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);
  const reduced = usePrefersReducedMotion();
  // The scene reads and calls these; kept in one mutable object so it never needs re-creating.
  const api = useRef<any>({});

  const projects = useMemo(() => projectsData.map((p, i) => ({ ...p, color: PROJECT_COLORS[i % 6][0], ink: PROJECT_COLORS[i % 6][1] })), []);

  useEffect(() => {
    const self = api.current;
    if (import.meta.env.DEV) (window as any).__room = self;
    Object.assign(self, {
      _p: 0,
      _focus: "",
      _proj: 0,
      setOverlay: () => {},
      onEntered: () => setEntered(true),
      onReady: () => setReady(true),
      onHover: (name: Exclude<Focus, ""> | null) => setHover(name),
      projects: () => projects,
      go: (name: Focus, i?: number) => {
        if (i !== undefined) { self._proj = i; setProj(i); }
        self._focus = name; setFocus(name);
        self.sfx?.whoosh();
      },
    });
    const host = hostRef.current;
    if (!host) return;
    // Build the scene only once the section gets near the screen.
    let started = false;
    const io = new IntersectionObserver((es) => {
      if (started || !es[0].isIntersecting) return;
      started = true;
      // three.js is loaded only now, so it doesn't slow the first paint.
      // The scene paints its tags and pages with these fonts, so they must be loaded first.
      const FONTS = ['80px "Permanent Marker"', "80px Anton", "600 38px Caveat", "700 32px Caveat"];
      const fontsReady = async () => {
        // The font stylesheet can arrive after this runs, so keep asking for up to 4s.
        for (let i = 0; i < 20; i++) {
          await Promise.all(FONTS.map((f) => document.fonts.load(f).catch(() => null)));
          if (FONTS.every((f) => document.fonts.check(f)) && (await document.fonts.load(FONTS[0])).length) return;
          await new Promise((r) => setTimeout(r, 200));
        }
      };
      Promise.all([import("@/components/room/roomScene"), fontsReady()]).then(([m]) => { if (!self._dead) m.startRoom(host, self); });
      io.disconnect();
    }, { rootMargin: "400px" });
    io.observe(host);
    return () => {
      io.disconnect();
      self._dead = true;
      cancelAnimationFrame(self._raf3);
      self._cleanup?.();
    };
  }, [projects]);

  const go = (f: Focus) => api.current.go?.(f);
  const back = () => { api.current._focus = ""; setFocus(""); api.current.sfx?.whoosh(); api.current.wave?.(); };
  const step = (d: number) => {
    const n = projects.length, i = (proj + d + n) % n;
    api.current._proj = i; setProj(i); api.current.sfx?.tick();
  };
  const pr = projects[proj];

  return (
    <section id="room" aria-label="Lakshya's room" className="relative h-[100svh] min-h-[620px] overflow-hidden bg-black" onPointerMove={(e) => { const r = e.currentTarget.getBoundingClientRect(); if (labelRef.current) labelRef.current.style.transform = `translate(${e.clientX - r.left + 18}px, ${e.clientY - r.top + 14}px)`; }}>
      <div ref={hostRef} className="absolute inset-0" />
      <div aria-hidden={ready} className={`absolute inset-0 z-40 flex flex-col items-center justify-center gap-5 bg-gradient-to-b from-[#9ec3ea] via-[#cfe2f3] to-[#9fbf78] transition-opacity duration-700 ${ready ? "opacity-0 pointer-events-none" : "opacity-100"}`}>
        <div className="text-[#1d2c44] text-[26px] md:text-[38px] text-center px-6" style={marker}>WALKING TO LAKSHYA'S HOUSE…</div>
        <div className="h-1.5 w-48 overflow-hidden rounded-full bg-[#1d2c44]/20"><div className="h-full w-1/3 rounded-full bg-[#1d2c44] room-load-bar" /></div>
        <style>{`@keyframes roomLoad{0%{transform:translateX(-100%)}100%{transform:translateX(300%)}} .room-load-bar{animation:roomLoad 1.1s ease-in-out infinite}`}</style>
      </div>
      <style>{`@keyframes roomPanelIn{from{transform:translateX(40px);opacity:0}to{transform:none;opacity:1}} .room-panel-in{animation:roomPanelIn .55s cubic-bezier(.2,.8,.2,1)} #room .room-btn{font-family:'Permanent Marker',cursive !important} @media (prefers-reduced-motion: reduce){.room-panel-in{animation:none}}`}</style>

      {hover && !focus && (() => { const m = MENU.find(([id]) => id === hover); return m ? (
        <div ref={labelRef} className="pointer-events-none absolute left-0 top-0 z-30" style={{ transform: labelRef.current?.style.transform }}>
          <div className="rounded-full px-3.5 pt-[7px] pb-[5px] text-[14px] leading-none shadow-[0_6px_18px_rgba(0,0,0,0.35)]" style={{ ...marker, background: m[2], color: m[3] }}>{m[1]}</div>
        </div>
      ) : null; })()}
      {!hover && <div ref={labelRef} className="hidden" />}
      {ready && !entered && (
        <div className="absolute inset-x-0 bottom-8 md:bottom-12 z-30 flex flex-col items-center gap-4 pointer-events-none">
          <div className="rounded-full bg-black/70 backdrop-blur px-6 py-2.5 text-[#F4F4F4] text-[20px] md:text-[28px] tracking-wide text-center animate-pulse" style={marker}>KNOCK KNOCK. CLICK THE DOOR.</div>
          <div className="flex gap-3 pointer-events-auto">
            <button onClick={() => api.current.enterHouse?.()} className={btn} style={{ ...marker, background: "#FFD23F", color: "#111111" }}>COME IN</button>
            <button onClick={() => { api.current._entered = true; setEntered(true); }} className={btn} style={{ ...marker, background: "#1F1F1F", color: "#F4F4F4" }}>SKIP</button>
          </div>
        </div>
      )}

      {entered && <nav aria-label="Room" className="absolute left-4 right-4 md:left-9 top-6 z-30 flex flex-wrap items-center gap-2.5 md:gap-3">
        {focus && (
          <button onClick={back} className={btn} style={{ ...marker, background: "#111111", color: "#F4F4F4", boxShadow: "inset 0 0 0 2px #F4F4F4, 0 8px 22px rgba(0,0,0,0.45)" }}>
            BACK TO THE ROOM
          </button>
        )}
        {MENU.map(([id, label, bg, ink, rot]) => (
          <button
            key={id}
            onClick={() => go(id)}
            aria-pressed={focus === id}
            className={btn}
            style={{ ...marker, background: bg, color: ink, transform: reduced ? undefined : `rotate(${rot}deg)`, outline: focus === id ? "3px solid #F4F4F4" : "none", outlineOffset: 3 }}
          >
            {label}
          </button>
        ))}
        <button
          onClick={() => { const n = !night; setNight(n); api.current._night = n; api.current.sfx?.tick(); }}
          aria-pressed={night}
          aria-label={night ? "Switch to day" : "Switch to night"}
          className={btn}
          style={{ ...marker, background: night ? "#F4F4F4" : "#1d2c44", color: night ? "#111111" : "#F4F4F4" }}
        >
          {night ? "DAY" : "NIGHT"}
        </button>
      </nav>}

      {focus === "projects" && pr && (
        <div key={proj} className={`${panel} rounded-[18px] bg-[#101010] shadow-[0_30px_80px_rgba(0,0,0,0.65)]`}>
          <div className="px-[30px] pt-6 pb-[22px]" style={{ background: pr.color, color: pr.ink }}>
            <div className="text-[13px] font-bold tracking-[2px]" style={mono}>
              RECORD {String(proj + 1).padStart(2, "0")} / {String(projects.length).padStart(2, "0")}
            </div>
            <div className="mt-2.5 text-[44px] md:text-[62px] leading-none" style={anton}>{pr.name.toUpperCase()}</div>
          </div>
          <div className="px-[30px] pt-[22px] pb-[26px]">
            <p className="m-0 text-[15px] md:text-[16px] leading-[1.6] text-[#D2D2D2]" style={body}>{pr.description}</p>
            <div className="mt-[18px] flex flex-wrap gap-2">
              {pr.techStack.map((t) => (
                <span key={t} className="rounded-full bg-[#1F1F1F] px-[11px] py-1.5 text-[12px] text-[#F4F4F4]" style={mono}>{t}</span>
              ))}
            </div>
            <div className="mt-[22px] flex flex-wrap items-center gap-2.5">
              {pr.href && (
                <a href={pr.href} target="_blank" rel="noopener noreferrer" className={btn} style={{ ...marker, background: "#F4F4F4", color: "#111111" }}>
                  {pr.href.includes("play.google") ? "GET THE APP" : "SEE IT LIVE"}
                </a>
              )}
              {pr.github && (
                <a href={pr.github} target="_blank" rel="noopener noreferrer" className={btn} style={{ ...marker, background: "#1F1F1F", color: "#F4F4F4" }}>CODE</a>
              )}
              <div className="flex-grow" />
              <button onClick={() => step(-1)} aria-label="Previous project" className={btn} style={{ ...marker, background: "#1F1F1F", color: "#F4F4F4" }}>PREV</button>
              <button onClick={() => step(1)} aria-label="Next project" className={btn} style={{ ...marker, background: "#FFD23F", color: "#111111" }}>NEXT</button>
            </div>
          </div>
        </div>
      )}

      {focus === "experience" && (
        <div className={`${panel} rounded-[18px] bg-[#0D1117] shadow-[0_30px_80px_rgba(0,0,0,0.65)]`}>
          <div className="flex h-11 items-center gap-2 bg-[#161B22] px-4">
            {["#FF5F56", "#FFBD2E", "#27C93F"].map((c) => <span key={c} className="h-3 w-3 rounded-full" style={{ background: c }} />)}
            <span className="ml-2.5 text-[13px] text-[#9BA3AF]" style={mono}>~/experience  git log</span>
          </div>
          <div className="px-[26px] pt-5 pb-6">
            <h2 className="m-0 text-[36px] md:text-[42px] leading-none text-[#F4F4F4]" style={marker}>EXPERIENCE</h2>
            {experienceData.map((x, i) => (
              <div key={x.hash} className="mt-[18px]">
                <div className="text-[12px] text-[#FFD23F]" style={mono}>commit {x.hash} · {x.date}</div>
                <div className="mt-1 text-[26px] leading-[1.1]" style={{ ...anton, color: ["#74D4F0", "#FFD23F", "#FA1A1D"][i % 3] }}>{x.title}</div>
                <div className="text-[15px] font-medium text-[#F4F4F4]" style={body}>{x.role}</div>
                {x.description && <p className="m-0 mt-1.5 text-[14px] leading-[1.5] text-[#C9CED6]" style={body}>{x.description}</p>}
              </div>
            ))}
          </div>
        </div>
      )}

      {focus === "achievements" && (
        <div className={panel}>
          <h2 className="m-0 text-[38px] md:text-[46px] leading-none text-[#F4F4F4] [text-shadow:0_6px_24px_rgba(0,0,0,0.8)]" style={marker}>ACHIEVEMENTS</h2>
          {achievementsData.map((a, i) => (
            <div
              key={a.title}
              className="mt-3 rounded-xl px-[18px] pt-3.5 pb-[15px] shadow-[0_12px_30px_rgba(0,0,0,0.45)]"
              style={{ background: CARD_COLORS[i % 5][0], color: CARD_COLORS[i % 5][1], transform: reduced ? undefined : `rotate(${[-1.2, 0.8, -0.6, 1, -0.8][i % 5]}deg)` }}
            >
              <div className="flex items-baseline gap-3">
                <div className="flex-grow text-[20px] md:text-[22px] leading-[1.1]" style={anton}>{a.title}</div>
                {a.date && <div className="whitespace-nowrap text-[12px] font-bold" style={mono}>{a.date}</div>}
              </div>
              <p className="m-0 mt-1.5 text-[14px] leading-[1.45]" style={body}>{a.description}</p>
            </div>
          ))}
        </div>
      )}

      {focus === "contact" && (
        <div className={`${panel} rounded-md bg-[#F4F1E6] px-[30px] pt-7 pb-[30px] text-[#111111] shadow-[0_30px_80px_rgba(0,0,0,0.65)] md:rotate-[1.5deg]`}>
          <h2 className="m-0 text-[48px] leading-none" style={marker}>SAY HI</h2>
          <p className="m-0 mt-1.5 text-[24px] font-bold text-[#1B2F8F]" style={{ fontFamily: "Caveat, cursive" }}>Open to internships, projects and a good chai.</p>
          <div className="mt-[18px] flex flex-col gap-2.5">
            {[
              ["EMAIL", contactData.email, `mailto:${contactData.email}`, "#FFD23F"],
              ["PHONE", contactData.phone, `tel:${contactData.phone.replace(/\s/g, "")}`, "#74D4F0"],
              ["GITHUB", contactData.github, `https://github.com/${contactData.github}`, "#BFEA88"],
              ["LINKEDIN", contactData.linkedin, `https://www.linkedin.com/in/${contactData.linkedin}`, "#FDBBFF"],
              ["BASED IN", contactData.location, `https://maps.google.com/?q=${encodeURIComponent(contactData.location)}`, "#FFFFFF"],
            ].map(([k, v, href, bg]) => (
              <a key={k} href={href} target="_blank" rel="noopener noreferrer" className="flex items-baseline justify-between gap-3 rounded-[10px] px-4 py-3 text-[#111111] no-underline" style={{ background: bg }}>
                <span className="text-[12px] font-bold tracking-[1px]" style={mono}>{k}</span>
                <span className="text-[15px] font-medium" style={body}>{v}</span>
              </a>
            ))}
          </div>
        </div>
      )}
    </section>
  );
};

export default Room;
