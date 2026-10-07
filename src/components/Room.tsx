import { useCallback, useEffect, useLayoutEffect, useRef, useState, type CSSProperties, type FormEvent } from "react";
import { FileText, Github, Linkedin, Mail, Phone } from "lucide-react";
import { CRATE_RECORDS } from "@/components/projects/crate/crateData";
import { getSoundState, installUnlock, setSoundEnabled, subscribeSound } from "@/components/projects/crate/crateSounds";
import NowPlaying from "@/components/room/NowPlaying";
import { useMediaQuery, usePrefersReducedMotion } from "@/components/site/hooks";
import { FLYERS } from "@/components/experience/flyers";
import { EMAIL, GITHUB, LINKEDIN, PHONE, sendMessage, TABS } from "@/components/contact/contactInfo";
import { CARDS } from "@/components/achievements/cards";
import Landing from "@/components/room/Landing";
import Blueprint from "@/components/room/Blueprint";
import type { LandBand, LandMode } from "@/components/room/landCam";
import { DOOR, MENU, PET, STEPS, type Focus, type Section } from "@/components/room/menu";

/**
 * Lakshya's room in 3D. The room is the menu: the notebook opens About, the
 * record player in the lounge Projects, the laptop (and the monitor, which plays the experience
 * film strip) Experience, the trophy shelf and the card wall above it
 * Achievements, and the poster wall by the bedroom window Contact. The site's
 * section designs are built into the room itself. Click the floor and he walks
 * there; click the chair and he sits back down.
 */

const marker: CSSProperties = { fontFamily: "'Permanent Marker', cursive" };
const anton: CSSProperties = { fontFamily: "Anton, Impact, sans-serif" };
const mono: CSSProperties = { fontFamily: "'JetBrains Mono', monospace" };
const btn = "room-btn rounded-[10px] px-[18px] pt-[11px] pb-[9px] text-[15px] md:text-[18px] leading-none whitespace-nowrap shadow-[0_8px_22px_rgba(0,0,0,0.45)] transition-transform hover:-translate-y-0.5";

// The phone bar's icons (night, day, sound on and off), drawn in the button's own colour.
const icon = { width: 20, height: 20, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round" as const, strokeLinejoin: "round" as const, "aria-hidden": true };
const MoonIcon = () => <svg {...icon}><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" /></svg>;
const SunIcon = () => (
  <svg {...icon}>
    <circle cx="12" cy="12" r="4.5" />
    <path d="M12 1.5v2.5M12 20v2.5M4.6 4.6l1.8 1.8M17.6 17.6l1.8 1.8M1.5 12H4M20 12h2.5M4.6 19.4l1.8-1.8M17.6 6.4l1.8-1.8" />
  </svg>
);
const SpeakerIcon = ({ on }: { on: boolean }) => (
  <svg {...icon}>
    <path d="M11 5 6 9H2v6h4l5 4V5z" />
    {on ? <path d="M15.5 8.5a5 5 0 0 1 0 7M19 5a10 10 0 0 1 0 14" /> : <path d="m23 9-6 6M17 9l6 6" />}
  </svg>
);

// On a phone the flyer's tear-off tabs are too small to read, so the page lists them too: each tears off its tab.
const CHIPS: [string, number][] = [["EMAIL", 0], ["PHONE", 1], ["LINKEDIN", 2], ["GITHUB", 3], ["RESUME", 5]];
// On a wider screen the same, as real links with what they say written out: the wall's own lettering is too small to read.
const LINKS: [string, typeof Mail, string, string][] = [
  ["Email", Mail, EMAIL, `mailto:${EMAIL}`],
  ["Phone", Phone, "+91 85290 75860", `tel:${PHONE.replace(/\s/g, "")}`],
  ["LinkedIn", Linkedin, LINKEDIN.replace("linkedin.com/", ""), `https://${LINKEDIN}`],
  ["GitHub", Github, GITHUB.replace("github.com/", ""), `https://${GITHUB}`],
  ["Résumé", FileText, "Resume", "/Lakshya_Gupta_Resume.pdf"],
];
const pad2 = (n: number) => String(n).padStart(2, "0");
// An element's place in the section, from the layout (offsets leave out the transforms of things sliding in).
const offTop = (el: HTMLElement, root: HTMLElement) => { let v = 0; for (let e: HTMLElement | null = el; e && e !== root; e = e.offsetParent as HTMLElement | null) v += e.offsetTop; return v; };
const offLeft = (el: HTMLElement, root: HTMLElement) => { let v = 0; for (let e: HTMLElement | null = el; e && e !== root; e = e.offsetParent as HTMLElement | null) v += e.offsetLeft; return v; };

const Room = () => {
  const hostRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const [focus, setFocus] = useState<Focus>("");
  // What's on the record player (the scene tells us when it changes), and whether sound is on.
  const [proj, setProj] = useState(0);
  const [recStopped, setRecStopped] = useState(false);
  const [sound, setSound] = useState(getSoundState);
  const [entered, setEntered] = useState(false);
  const [night, setNight] = useState(false);
  const [hover, setHover] = useState<Section | "cat" | "door" | null>(null);
  const labelRef = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);
  const barRef = useRef<HTMLDivElement>(null);
  const pctRef = useRef<HTMLSpanElement>(null);
  // Inside the 3D sections: which piece the camera is on (phones step through them), the scene on the reel,
  // a "copied" note for the contact tabs, and the message form for the contact wall.
  const upright = useMediaQuery("(max-aspect-ratio: 9/10)");
  // Phones (upright, or turned on their side where there's little height) get a slim bar instead of a row of stickers.
  const compact = useMediaQuery("(max-width: 767px), (max-height: 559px)");
  const [menuOpen, setMenuOpen] = useState(false);
  // On a touch screen nothing lights up under a pointer, so say once what can be tapped.
  const touch = useMediaQuery("(hover: none) and (pointer: coarse)");
  const [hint, setHint] = useState(false);
  const hinted = useRef(false);
  const [stop, setStop] = useState(0);
  const [stops, setStops] = useState(1);
  const [reel, setReel] = useState(0);
  const [toast, setToast] = useState<{ text: string; n: number } | null>(null);
  const [tag, setTag] = useState("");
  const [sending, setSending] = useState(false);
  const [formError, setFormError] = useState("");
  const formRef = useRef<HTMLFormElement>(null);
  const tagRef = useRef<HTMLInputElement>(null);
  const reduced = usePrefersReducedMotion();
  // The way in: the landing's layout (a phone held upright, one on its side, or wide), the walk in, a section asked
  // for while it was still loading, the loading bar's words, the door's cue, and where the house should stand.
  const portraitQ = useMediaQuery("(orientation: portrait)");
  const shortQ = useMediaQuery("(orientation: landscape) and (max-height: 559px)");
  const squatQ = useMediaQuery("(max-height: 699px)");
  const mode: LandMode = portraitQ ? "tall" : shortQ ? "short" : "wide";
  const squat = mode === "tall" && squatQ;
  const [walking, setWalking] = useState(false);
  const [queued, setQueued] = useState<Section | "">("");
  const [step, setStep] = useState(0);
  const [cue, setCue] = useState(false);
  const [settled, setSettled] = useState(false);
  const [land, setLand] = useState<{ W: number; H: number; band: LandBand } | null>(null);
  const [bpGone, setBpGone] = useState(false);
  const landRef = useRef<HTMLDivElement>(null);
  const progRef = useRef<HTMLDivElement>(null);
  const pctInkRef = useRef<HTMLSpanElement>(null);
  const walkRef = useRef<HTMLButtonElement>(null);
  // (whether the visitor went in by keyboard, so focus follows them inside)
  const hadFocus = useRef(false);
  // The scene reads and calls these; kept in one mutable object so it never needs re-creating.
  const api = useRef<any>({});


  useEffect(() => {
    const self = api.current;
    if (import.meta.env.DEV) (window as any).__room = self;
    Object.assign(self, {
      _p: 0,
      _focus: "",
      setOverlay: () => {},
      onEntered: () => setEntered(true),
      onReady: () => setReady(true),
      // Written straight to the DOM: it changes many times a second while loading, no need to re-render React for it.
      onProgress: (p: number) => {
        const v = Math.max(self._shownP || 0, p);
        self._shownP = v;
        if (barRef.current) barRef.current.style.transform = `scaleX(${0.04 + v * 0.96})`;
        if (pctRef.current) pctRef.current.textContent = `${Math.round(v * 100)}%`;
        // the blueprint draws itself up to here, and the bar's words turn to ink over the yellow
        sectionRef.current?.style.setProperty("--p", String(0.04 + v * 0.96));
        if (pctInkRef.current) pctInkRef.current.textContent = `${Math.round(v * 100)}%`;
        const i = Math.min(STEPS.length - 1, Math.floor(v * (STEPS.length - 1)));
        if (i !== self._step) { self._step = i; setStep(i); }
        progRef.current?.setAttribute("aria-valuenow", String(Math.round(v * 100)));
        progRef.current?.setAttribute("aria-valuetext", `${STEPS[i]} ${Math.round(v * 100)}%`);
      },
      onWalk: () => setWalking(true),
      onHover: (name: Section | "cat" | "door" | null) => setHover(name),
      onReel: (i: number) => setReel(i),
      onToast: (text: string) => setToast((t) => ({ text, n: (t?.n ?? 0) + 1 })),
      onCoupon: () => formRef.current?.requestSubmit(),
      onTagClick: () => tagRef.current?.focus(),
      onStop: (i: number) => setStop(i),
      onRecord: ({ i, stopped }: { i: number; stopped: boolean }) => { setProj(i); setRecStopped(stopped); },
      go: (name: Focus) => {
        self._focus = name; setFocus(name);
        self._stop = 0; setStop(0);
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
      const FONTS = ['80px "Permanent Marker"', "80px Anton", "600 38px Caveat", "700 32px Caveat", '32px "Special Elite"', '700 32px "Space Mono"', '32px "Old Standard TT"', '700 32px "Old Standard TT"', 'italic 32px "Old Standard TT"', "32px UnifrakturMaguntia", "32px Rotonto"];
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
  }, []);

  // Browsers keep sound locked until the first click or key press; this opens it then (the room's sounds, the
  // record player's crackle and needle drops). The choice to switch it off is remembered.
  useEffect(() => installUnlock(), []);
  useEffect(() => subscribeSound(setSound), []);

  // How many pieces the open section has to step through (more than one only on a phone held upright).
  useEffect(() => {
    setStops(focus ? api.current.stopCount?.(focus) ?? 1 : 1);
  }, [focus, upright]);
  const moveStop = (d: number) => {
    const n = api.current.stopCount?.(focus) ?? 1;
    const i = (stop + d + n) % n;
    api.current._stop = i; setStop(i); api.current.sfx?.tick();
  };

  // On a screen held upright the camera frames each piece in the part of the screen the page's bars leave free, so
  // tell it where they are: how far down the top bar reaches and how far up the bottom panel comes, in px. Taken
  // from the layout (not the panels' slide-in), and again whenever one of them changes size.
  useLayoutEffect(() => {
    const sec = sectionRef.current;
    if (!sec || !focus || !upright) { api.current._safe = null; return; }
    const y = (el: HTMLElement) => offTop(el, sec);
    const measure = () => {
      let top = 0, bottom = 0;
      sec.querySelectorAll<HTMLElement>("[data-safe]").forEach((el) => {
        if (!el.offsetHeight) return;
        if (el.dataset.safe === "top") top = Math.max(top, y(el) + el.offsetHeight);
        else bottom = Math.max(bottom, sec.clientHeight - y(el));
      });
      api.current._safe = { top: top + 10, bottom: bottom + 10 };
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(sec);
    sec.querySelectorAll<HTMLElement>("[data-safe]").forEach((el) => ro.observe(el));
    return () => ro.disconnect();
  }, [focus, upright, compact, stop, stops, entered]);

  // ---- the way in
  useEffect(() => { api.current._reduced = reduced; }, [reduced]);
  // Where the house should stand on the lawn: in the free part of the screen beside the words (wide, or a phone on its
  // side) or between them (a phone held upright). The scene slides its view to put it there, and the blueprint is drawn
  // there. Taken from the layout, and again when the words or the screen change size.
  useLayoutEffect(() => {
    const sec = sectionRef.current;
    if (!sec || entered) { api.current._land = null; return; }
    const measure = () => {
      const W = sec.clientWidth, H = sec.clientHeight;
      let band: LandBand | null = null;
      if (mode === "tall") {
        const t = sec.querySelector<HTMLElement>('[data-land="top"]'), b = sec.querySelector<HTMLElement>('[data-land="bottom"]');
        if (t && b) band = { mode, l: 0, r: W, t: Math.round(offTop(t, sec) + t.offsetHeight + 8), b: Math.round(offTop(b, sec) - 8) };
      } else {
        const c = sec.querySelector<HTMLElement>('[data-land="col"]');
        if (c) band = { mode, l: Math.round(offLeft(c, sec) + c.offsetWidth + (mode === "short" ? 40 : 48)), r: W - (mode === "short" ? 16 : 24), t: mode === "short" ? 56 : 64, b: H - (mode === "short" ? 12 : 16) };
      }
      if (!band || !W || !H) return;
      const was = api.current._land as LandBand | null;
      if (was && api.current._landWH === `${W}x${H}` && (Object.keys(band) as (keyof LandBand)[]).every((k) => was[k] === band![k])) return;
      api.current._land = band;
      api.current._landWH = `${W}x${H}`;
      setLand({ W, H, band });
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(sec);
    sec.querySelectorAll<HTMLElement>("[data-land]").forEach((el) => ro.observe(el));
    return () => ro.disconnect();
  }, [entered, mode, squat]);

  // In by the path (the walk), straight in (skip), or straight to a section (a shortcut: in, then open it at once).
  const owns = () => {
    const a = document.activeElement as HTMLElement | null;
    return !!a && (!!landRef.current?.contains(a) || a === walkRef.current) && a.matches(":focus-visible");
  };
  const onEnter = () => { hadFocus.current = owns(); api.current.enterHouse?.(); };
  const onSkip = () => { hadFocus.current = hadFocus.current || owns(); api.current._entered = true; setEntered(true); };
  const jumpIn = (id: Section) => { onSkip(); api.current.go?.(id); };
  // (tapped while it's still loading: remembered, and opened the moment it's ready; tapped again, forgotten)
  const onJump = (id: Section) => { if (ready) jumpIn(id); else setQueued((q) => (q === id ? "" : id)); };
  const onCue = (on: boolean) => { api.current._doorCue = on; setCue(on); };
  const doorRef = useCallback((el: HTMLDivElement | null) => { api.current._doorEl = el; }, []);
  useEffect(() => {
    if (!ready) return;
    sectionRef.current?.style.setProperty("--p", "1");
    if (queued) { jumpIn(queued); setQueued(""); }
    // the blueprint has dissolved into the house by now
    const t = window.setTimeout(() => setBpGone(true), reduced ? 300 : 1100);
    return () => window.clearTimeout(t);
  }, [ready]); // eslint-disable-line react-hooks/exhaustive-deps
  // (the entrances play once, the last ending at about 1.9 s: after this, turning a phone round doesn't play them again)
  useEffect(() => { const t = window.setTimeout(() => setSettled(true), 2100); return () => window.clearTimeout(t); }, []);
  // (a phone turned while it loads lays the poster out afresh: put the bar back where it had got to)
  useLayoutEffect(() => { if (!ready) api.current.onProgress?.(api.current._shownP || 0); }, [mode]); // eslint-disable-line react-hooks/exhaustive-deps
  // While walking in: a skip button (and Escape) in case it's taking too long; focus goes to it if they came by keyboard.
  useEffect(() => {
    if (!walking || entered) return;
    if (hadFocus.current) requestAnimationFrame(() => walkRef.current?.focus({ preventScroll: true }));
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onSkip(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [walking, entered]); // eslint-disable-line react-hooks/exhaustive-deps
  // Inside: the landing goes, and keyboard focus lands on the room's menu.
  useEffect(() => {
    if (!entered) return;
    setWalking(false);
    api.current._doorCue = false;
    setHover((h) => (h === "door" ? null : h));
    if (!hadFocus.current) return;
    hadFocus.current = false;
    requestAnimationFrame(() => sectionRef.current?.querySelector<HTMLElement>('nav[aria-label="Room"] button')?.focus({ preventScroll: true }));
  }, [entered]);

  useEffect(() => {
    if (!entered || !touch) return;
    const show = window.setTimeout(() => { if (!hinted.current) setHint(true); }, 1200), hide = window.setTimeout(() => setHint(false), 8000);
    return () => { window.clearTimeout(show); window.clearTimeout(hide); };
  }, [entered, touch]);
  // (once you've opened something you know what to do, so it doesn't come back)
  useEffect(() => { if (focus || menuOpen) { hinted.current = true; setHint(false); } }, [focus, menuOpen]);

  // Escape closes the phone menu, or goes back to the room; the arrow keys step through pieces, or scenes on the reel.
  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setMenuOpen(false); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menuOpen]);
  useEffect(() => {
    if (!focus || menuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if ((e.target as HTMLElement)?.tagName === "INPUT") return;
      if (e.key === "Escape") { api.current._focus = ""; setFocus(""); api.current.sfx?.whoosh(); }
      else if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
        const d = e.key === "ArrowLeft" ? -1 : 1;
        if (focus === "experience") api.current.reelStep?.(d);
        else if (focus === "projects") api.current.record?.step(d);
        else if (stops > 1) moveStop(d);
        else return;
        e.preventDefault();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  useEffect(() => {
    if (!toast) return;
    const id = window.setTimeout(() => setToast(null), 2400);
    return () => window.clearTimeout(id);
  }, [toast]);

  // The message from the contact wall: the coupon in the room is cut out and sprayed SENT! while it goes.
  const onSend = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (sending) return;
    const data = new FormData(e.currentTarget);
    const email = String(data.get("email") ?? "").trim();
    const message = tag.trim() || "HI LAKSHYA!";
    setFormError("");
    setSending(true);
    const result = sendMessage(message, email);
    api.current.walls?.contact.send(result.then((r) => r.ok));
    result.then((r) => { if (!r.ok) setFormError(r.error); });
    window.setTimeout(() => setSending(false), 6000);
  };

  const go = (f: Focus) => { setMenuOpen(false); api.current.go?.(f); };
  const back = () => { setMenuOpen(false); api.current._focus = ""; setFocus(""); api.current.sfx?.whoosh(); api.current.wave?.(); };
  const toggleNight = () => { const n = !night; setNight(n); api.current._night = n; api.current.sfx?.tick(); };
  const here = MENU.find(([id]) => id === focus);
  const flyer = FLYERS[reel];
  // On a phone held upright the message form waits at the coupon (the last piece), so the flyer and the page get the room.
  const contactForm = focus === "contact" && (!upright || stop === stops - 1);
  const tearTab = (i: number) => {
    if (api.current.walls?.contact.tear(i)) return;
    // (that tab is still growing back: copy it all the same)
    navigator.clipboard?.writeText(TABS[i].copy).catch(() => {});
    setToast((t) => ({ text: TABS[i].copy, n: (t?.n ?? 0) + 1 }));
  };
  const arrow = "room-btn grid h-11 w-11 place-items-center rounded-full bg-[#111111]/85 text-[20px] text-[#F4F4F4] shadow-[0_8px_22px_rgba(0,0,0,0.45)] transition-transform hover:-translate-y-0.5";
  const round = "grid h-11 w-11 place-items-center rounded-full bg-[#111111]/85 text-[#F4F4F4] shadow-[0_8px_22px_rgba(0,0,0,0.45)]";
  // (the small round buttons on a card, as on the record player's)
  const chip = "grid h-9 w-9 shrink-0 place-items-center rounded-full border border-[#333] bg-[#161616] text-[18px] text-[#F4F4F4] transition-colors hover:border-[#F4F4F4]";
  const record = CRATE_RECORDS[proj];
  // the achievement card the camera is in close on (a wide screen starts on the whole row)
  const card = focus === "achievements" ? CARDS[upright ? stop : stop - 1] : undefined;
  // what it says, in type big enough to read whatever the screen (the receipt in the room is only a picture of it)
  const cardNote = card && (
            <div aria-live="polite" className="w-full max-w-[520px] rounded-[16px] border border-[#262626] bg-[#0b0b0c]/90 p-4 text-white shadow-[0_24px_60px_rgba(0,0,0,0.55)] backdrop-blur-sm">
              <div className="flex items-center gap-2.5">
                <span aria-hidden="true" className="h-3.5 w-3.5 shrink-0 rounded-[3px]" style={{ background: card.bg }} />
                <span className="text-[24px] leading-none text-[#F4F4F4]" style={anton}>{card.name.toUpperCase()}</span>
              </div>
              <div className="mt-2 text-[11px] font-bold tracking-[2px] text-[#BDB3A6]" style={mono}>{card.where.toUpperCase()} · {card.when}</div>
              <p className="m-0 mt-2.5 text-[15px] leading-[1.5] text-[#ffe45c]">{card.body}</p>
            </div>
  );

  return (
    <section ref={sectionRef} id="room" aria-label="Lakshya's room" className="relative h-[100svh] min-h-[300px] overflow-hidden bg-black" onPointerMove={(e) => { const r = e.currentTarget.getBoundingClientRect(); if (labelRef.current) labelRef.current.style.transform = `translate(${e.clientX - r.left + 18}px, ${e.clientY - r.top + 14}px)`; }}>
      <div ref={hostRef} className="absolute inset-0" />
      {/* The way in: while it loads, a blueprint of the house drawing itself where the house will stand; over the house,
          who lives here, the way in, and shortcuts. Both go once you're inside. */}
      {!entered && !bpGone && <Blueprint W={land?.W ?? 0} H={land?.H ?? 0} band={land?.band ?? null} mode={mode} ready={ready} />}
      {!entered && (
        <Landing
          mode={mode} squat={squat} ready={ready} walking={walking} settled={settled} cue={cue} queued={queued} step={step}
          rootRef={landRef} progRef={progRef} barRef={barRef} pctRef={pctRef} pctInkRef={pctInkRef} walkRef={walkRef} doorRef={doorRef}
          onEnter={onEnter} onSkip={onSkip} onJump={onJump} onCue={onCue}
        />
      )}
      {entered && <h1 className="sr-only">Lakshya Gupta, developer and data scientist</h1>}
      <style>{`@keyframes roomPanelIn{from{transform:translateX(40px);opacity:0}to{transform:none;opacity:1}} .room-panel-in{animation:roomPanelIn .55s cubic-bezier(.2,.8,.2,1)} @keyframes roomUp{from{transform:translateY(24px);opacity:0}to{transform:none;opacity:1}} .room-up{animation:roomUp .5s cubic-bezier(.2,.8,.2,1) .6s both} @keyframes roomToast{0%{opacity:0;transform:translateX(-50%) scale(1.6) rotate(-12deg)}15%{opacity:1;transform:translateX(-50%) scale(.95) rotate(-4deg)}85%{opacity:1;transform:translateX(-50%) rotate(-4deg)}100%{opacity:0;transform:translateX(-50%) rotate(-4deg) translateY(-10px)}} .room-toast{animation:roomToast 2.4s ease-out both} #room .room-btn{font-family:'Permanent Marker',cursive !important} #room .room-input{height:44px;width:100%;box-sizing:border-box;padding:0 14px;border:2px solid rgba(244,244,244,.4);border-radius:8px;background:rgba(255,255,255,.06);color:#f4f4f4;outline:none;font-size:18px} #room .room-input:focus{border-color:#ffd23f} #room .room-input::placeholder{color:rgba(244,244,244,.45)} @keyframes roomMenuIn{from{transform:translateY(-8px);opacity:0}to{transform:none;opacity:1}} .room-menu-in{animation:roomMenuIn .22s cubic-bezier(.2,.8,.2,1)} @media (prefers-reduced-motion: reduce){.room-panel-in,.room-up,.room-toast,.room-menu-in{animation:none}}`}</style>

      {hover && !focus && !walking && (() => { const m = hover === "cat" ? PET : hover === "door" ? DOOR : MENU.find(([id]) => id === hover); return m ? (
        <div ref={labelRef} className={`pointer-events-none absolute left-0 top-0 ${entered ? "z-30" : "z-[46]"}`} style={{ transform: labelRef.current?.style.transform }}>
          <div className="rounded-full px-3.5 pt-[7px] pb-[5px] text-[14px] leading-none shadow-[0_6px_18px_rgba(0,0,0,0.35)]" style={{ ...marker, background: m[2], color: m[3] }}>{m[1]}</div>
        </div>
      ) : null; })()}
      {!hover && <div ref={labelRef} className="hidden" />}

      {/* Phones: one slim bar (back, the menu, night and sound), the sections in a menu that drops down from it. */}
      {entered && compact && (
        <nav aria-label="Room" className="absolute inset-x-3 top-3 z-30">
          <div data-safe="top" className="flex items-center gap-2">
            {focus && (
              <button onClick={back} aria-label="Back to the room" className={`${btn} !px-3.5`} style={{ ...marker, background: "#111111", color: "#F4F4F4", boxShadow: "inset 0 0 0 2px #F4F4F4, 0 8px 22px rgba(0,0,0,0.45)" }}>
                ← BACK
              </button>
            )}
            <button
              onClick={() => { setMenuOpen((o) => !o); api.current.sfx?.tick(); }}
              aria-expanded={menuOpen}
              aria-controls="room-menu"
              aria-label={here ? `${here[1]}, sections menu` : undefined}
              className={btn}
              style={{ ...marker, background: here ? here[2] : "#F4F4F4", color: here ? here[3] : "#111111", transform: reduced ? undefined : "rotate(-1.5deg)" }}
            >
              {here ? here[1] : "MENU"} <span aria-hidden="true" className={`inline-block transition-transform ${menuOpen ? "rotate-180" : ""}`}>▾</span>
            </button>
            <div className="ml-auto flex items-center gap-2">
              <button onClick={toggleNight} aria-pressed={night} aria-label={night ? "Switch to day" : "Switch to night"} className={round}>
                {night ? <SunIcon /> : <MoonIcon />}
              </button>
              <button onClick={() => setSoundEnabled(!sound.enabled)} aria-pressed={sound.enabled} aria-label={sound.enabled ? "Turn sound off" : "Turn sound on"} className={round}>
                <SpeakerIcon on={sound.enabled} />
              </button>
            </div>
          </div>
          {menuOpen && (
            <div id="room-menu" className="room-menu-in mt-3 flex w-max flex-col items-start gap-2.5">
              {MENU.map(([id, label, bg, ink, rot]) => (
                <button key={id} onClick={() => go(id)} aria-current={focus === id ? "page" : undefined} className={btn} style={{ ...marker, background: bg, color: ink, fontSize: 17, transform: reduced ? undefined : `rotate(${rot}deg)`, outline: focus === id ? "3px solid #F4F4F4" : undefined, outlineOffset: 3 }}>
                  {label}
                </button>
              ))}
            </div>
          )}
        </nav>
      )}
      {hint && !focus && (
        <div role="status" className="room-up pointer-events-none absolute inset-x-0 bottom-6 z-30 flex justify-center px-4">
          <div className="max-w-[340px] rounded-2xl bg-[#111111]/85 px-4 py-2.5 text-center text-[14px] leading-snug text-[#F4F4F4] shadow-[0_8px_22px_rgba(0,0,0,0.45)]" style={marker}>
            TAP THE DESK, THE TURNTABLE OR THE WALLS TO LOOK CLOSER, OR OPEN THE MENU
          </div>
        </div>
      )}
      {/* (tapping anywhere else closes the menu) */}
      {entered && compact && menuOpen && <div className="absolute inset-0 z-20 bg-black/35" onClick={() => setMenuOpen(false)} aria-hidden="true" />}

      {entered && !compact && <nav data-safe="top" aria-label="Room" className="absolute left-4 right-4 md:left-9 top-6 z-30 flex flex-wrap items-center gap-2.5 md:gap-3">
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
            style={{ ...marker, background: bg, color: ink, transform: reduced ? undefined : `rotate(${rot}deg)`, outline: focus === id ? "3px solid #F4F4F4" : undefined, outlineOffset: 3 }}
          >
            {label}
          </button>
        ))}
        <button
          onClick={toggleNight}
          aria-pressed={night}
          aria-label={night ? "Switch to day" : "Switch to night"}
          className={btn}
          style={{ ...marker, background: night ? "#F4F4F4" : "#1d2c44", color: night ? "#111111" : "#F4F4F4" }}
        >
          {night ? "DAY" : "NIGHT"}
        </button>
        <button
          onClick={() => setSoundEnabled(!sound.enabled)}
          aria-pressed={sound.enabled}
          aria-label={sound.enabled ? "Turn sound off" : "Turn sound on"}
          className={btn}
          style={{ ...marker, background: "#1F1F1F", color: sound.enabled ? "#F4F4F4" : "#8A8A8A" }}
        >
          {sound.enabled ? "SOUND ON" : "SOUND OFF"}
        </button>
      </nav>}

      {/* The record player: what's on, its links, and the deck's controls. */}
      {focus === "projects" && record && (
        <NowPlaying
          record={record}
          index={proj}
          count={CRATE_RECORDS.length}
          stopped={recStopped}
          onPrev={() => api.current.record?.step(-1)}
          onNext={() => api.current.record?.step(1)}
          onToggle={() => api.current.record?.toggle()}
          views={stops > 1 ? { labels: ["Deck", "Crate"], at: stop, go: (i) => moveStop(i - stop) } : undefined}
        />
      )}

      {/* Stepping through the pieces of a section on a phone held upright (and the contact wall's on a wide screen). */}
      {focus && focus !== "projects" && stops > 1 && (
        <div data-safe="bottom" className={`room-up absolute inset-x-0 z-30 flex flex-col items-center gap-3 px-4 ${contactForm ? (upright ? "bottom-[128px]" : "bottom-[184px] short:bottom-[136px]") : "bottom-6"}`}>
          {focus === "contact" && upright && stop === 0 && (
            <div role="group" aria-label="Copy from the flyer" className="flex max-w-[360px] flex-wrap justify-center gap-2">
              {CHIPS.map(([label, i]) => (
                <button key={label} onClick={() => tearTab(i)} className="h-9 rounded-full border-[1.5px] border-[#F4F4F4] bg-[#111111]/85 px-3.5 text-[12px] font-bold tracking-[1.5px] text-[#F4F4F4] shadow-[0_8px_22px_rgba(0,0,0,0.45)]" style={mono}>
                  {label}
                </button>
              ))}
            </div>
          )}
          {focus === "achievements" && upright && cardNote}
          {focus === "achievements" && !upright && !card && (
            <span className="rounded-full bg-[#111111]/85 px-4 py-2 text-[13px] font-semibold text-[#F4F4F4]">Click a card, or use the arrows, to read it</span>
          )}
          <div className="flex items-center justify-center gap-4">
            <button onClick={() => moveStop(-1)} aria-label="Previous" className={arrow}>‹</button>
            <span className="rounded-full bg-[#111111]/85 px-3.5 py-1.5 text-[13px] font-bold tracking-[2px] text-[#F4F4F4]" style={mono}>{stop + 1} / {stops}</span>
            <button onClick={() => moveStop(1)} aria-label="Next" className={arrow}>›</button>
          </div>
        </div>
      )}

      {focus === "achievements" && !upright && cardNote && (
        <div className="absolute right-5 top-1/2 z-30 w-[min(340px,34vw)] -translate-y-1/2"><div className="room-up">{cardNote}</div></div>
      )}

      {/* The reel on the monitor. On a phone held upright the camera is in close on the flyer in the gate, so the
          scene's role and what it was are on a card under it (the same height for every scene, so the camera stays
          put); elsewhere the monitor shows them itself and there are just the scene buttons. */}
      {focus === "experience" && upright && flyer && (
        <div data-safe="bottom" className="room-up absolute inset-x-3 bottom-3 z-30 mx-auto flex h-[34svh] min-h-[210px] max-w-[560px] flex-col rounded-[18px] border border-[#262626] bg-[#0b0b0c]/90 p-4 pb-0 text-white shadow-[0_24px_60px_rgba(0,0,0,0.55)] backdrop-blur-sm">
          <div className="flex items-center justify-between gap-3">
            <span className="text-[12px] font-bold tracking-[2px] text-[#9A9A9A]" style={mono}>SCENE {pad2(reel + 1)} / {pad2(FLYERS.length)}</span>
            <div className="flex items-center gap-2">
              <button onClick={() => api.current.reelStep?.(-1)} aria-label="Previous scene" className={chip}>‹</button>
              <button onClick={() => api.current.reelStep?.(1)} aria-label="Next scene" className={chip}>›</button>
            </div>
          </div>
          <div className="flex min-h-0 flex-1 flex-col" aria-live="polite">
            <div className="mt-2 flex items-center gap-2.5">
              <span aria-hidden="true" className="h-3.5 w-3.5 shrink-0 rounded-[3px]" style={{ background: flyer.bg }} />
              <span className="text-[26px] leading-none text-[#F4F4F4]" style={anton}>{flyer.org.toUpperCase()}</span>
            </div>
            <div className="mt-1.5 text-[11px] font-bold tracking-[2px] text-[#BDB3A6]" style={mono}>{flyer.role.toUpperCase()} · {flyer.when}</div>
            <p className="m-0 mt-2.5 min-h-0 flex-1 overflow-y-auto pb-4 text-[14.5px] font-bold leading-[1.5] text-[#ffe45c] [mask-image:linear-gradient(to_bottom,#000_calc(100%-18px),transparent)]" style={{ fontFamily: "Arial, Helvetica, sans-serif" }}>{flyer.text}</p>
          </div>
        </div>
      )}
      {focus === "experience" && !(upright && flyer) && (
        <div data-safe="bottom" className="room-up absolute inset-x-4 bottom-5 z-30 flex items-center justify-center gap-4">
          <button onClick={() => api.current.reelStep?.(-1)} aria-label="Previous scene" className={arrow}>‹</button>
          <span className="rounded-full bg-[#111111]/85 px-3.5 py-1.5 text-[13px] font-bold tracking-[2px] text-[#F4F4F4]" style={mono}>SCENE {pad2(reel + 1)} / {pad2(FLYERS.length)}</span>
          <button onClick={() => api.current.reelStep?.(1)} aria-label="Next scene" className={arrow}>›</button>
        </div>
      )}

      {/* The contact wall's message: typed here, sprayed on the wall as you go, sent by clipping the coupon. */}
      {contactForm && (
        <div data-safe="bottom" className="room-up absolute inset-x-3 bottom-3 z-30 mx-auto max-w-[960px] rounded-2xl bg-[#0b0b0c]/85 p-2.5 shadow-[0_18px_50px_rgba(0,0,0,0.5)] backdrop-blur-sm md:p-4 short:bottom-2 short:p-2.5">
          {!upright && (
            <nav aria-label="Ways to reach me" className="mb-3 flex flex-wrap justify-center gap-2 border-b border-white/10 pb-3 short:mb-2 short:pb-2">
                {LINKS.map(([label, Icon, text, href]) => (
                  <a key={label} href={href} title={label} target={href.startsWith("http") || href.endsWith(".pdf") ? "_blank" : undefined} rel="noopener noreferrer" className="flex h-9 items-center gap-1.5 rounded-full border-[1.5px] border-[#F4F4F4]/60 bg-[#111111] px-3 text-[13.5px] short:w-9 short:justify-center short:px-0 font-semibold text-[#F4F4F4] transition-colors hover:border-[#FFD23F] hover:text-[#FFD23F]">
                    <Icon size={15} className="shrink-0 text-[#BFEA88]" aria-hidden="true" />
                    <span className="sr-only">{label}: </span><span className="short:sr-only">{text}</span>
                  </a>
                ))}
              </nav>
          )}
        <form ref={formRef} onSubmit={onSend} className="relative grid grid-cols-[1fr_auto] gap-2 md:flex md:items-end md:gap-3">
          <label className="col-span-2 flex min-w-0 flex-1 flex-col gap-1">
            <span className="sr-only text-[15px] tracking-[2px] text-[#f4f4f4] md:not-sr-only short:sr-only" style={anton}>LEAVE A TAG</span>
            <input ref={tagRef} name="message" className="room-input" style={marker} type="text" maxLength={140} placeholder="leave a tag: say hi" value={tag} onChange={(e) => { setTag(e.target.value); api.current.walls?.contact.setTag(e.target.value); }} />
          </label>
          <label className="flex min-w-0 flex-1 flex-col gap-1">
            <span className="sr-only text-[15px] tracking-[2px] text-[#f4f4f4] md:not-sr-only short:sr-only" style={anton}>YOUR EMAIL</span>
            <input name="email" className="room-input" style={{ fontFamily: "'Special Elite', monospace" }} type="email" required autoComplete="email" placeholder="your email" />
          </label>
          <button type="submit" disabled={sending} className="h-11 shrink-0 border-[3px] border-[#151515] bg-[#EAE5D9] px-4 text-[18px] tracking-[1px] text-[#151515] transition-transform hover:-rotate-2 disabled:cursor-wait disabled:opacity-60 md:px-5" style={anton}>
            <span className="md:hidden">SEND</span><span className="hidden md:inline">CLIP &amp; SEND</span>
          </button>
          {formError && <p role="alert" className="col-span-2 m-0 text-[13px] leading-snug text-[#FFB4B4] md:absolute md:-top-8 md:left-4" style={{ fontFamily: "'Space Mono', monospace" }}>{formError}</p>}
        </form>
        </div>
      )}
      {toast && (
        <div key={toast.n} role="status" className="room-toast pointer-events-none absolute left-1/2 top-[38%] z-40 max-w-[92%] overflow-hidden text-ellipsis whitespace-nowrap border-[3px] border-[#111111] bg-[#FFD23F] px-3.5 py-2 text-[18px] tracking-[1px] text-[#111111]" style={anton}>
          COPIED: {toast.text}
        </div>
      )}
    </section>
  );
};

export default Room;
