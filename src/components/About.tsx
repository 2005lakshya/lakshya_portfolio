import { useLayoutEffect, useRef, type ReactNode } from "react";
import "./about/about.css";
import SprayHeading from "@/components/site/SprayHeading";
import { gsap, reducedMotion, ScrollTrigger, stampIn } from "@/components/site/motion";
import { playSlap } from "@/components/site/sfx";

/**
 * About me as a page of a spiral notebook.
 *
 * The page is laid down over the bottom of the hero as it scrolls in: it comes
 * up slightly turned and straightens out, like a sheet dropped on a desk. Once
 * it is on screen it writes itself, line by line, with a pen that leans like a
 * nib, and the doodles are drawn in between the lines. The polaroid comes down
 * like a stamp and gets taped.
 */

type Line = { body: ReactNode; className?: string };

const Star = () => (
  <svg width="34" height="34" viewBox="0 0 34 34" aria-hidden style={{ verticalAlign: -6, display: "inline" }}>
    <path data-doodle="star" className="ab-draw" d="M17 3 L21 13 L32 13 L23 20 L26 31 L17 24 L8 31 L11 20 L2 13 L13 13 Z" pathLength={1} fill="none" stroke="#FA1A1D" strokeWidth="2.5" strokeLinejoin="round" />
  </svg>
);

const Cup = () => (
  <svg width="40" height="36" viewBox="0 0 40 36" aria-hidden style={{ verticalAlign: -6, display: "inline" }}>
    <path data-doodle="cup" className="ab-draw" d="M6 12 H28 V24 A8 8 0 0 1 20 32 H14 A8 8 0 0 1 6 24 Z M28 15 H32 A4 4 0 0 1 32 23 H28 M12 8 C10 5 14 4 12 1 M19 8 C17 5 21 4 19 1" pathLength={1} fill="none" stroke="#1B2F8F" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const LINES: Line[] = [
  { body: <>Dear diary, <Star /></> },
  {
    body: (
      <>
        I'm Lakshya, a{" "}
        <span style={{ textDecoration: "underline wavy #FA1A1D", textDecorationThickness: 2, textUnderlineOffset: 7 }}>developer and data scientist</span>.
      </>
    ),
  },
  { body: "B.Tech CSE (Data Science) at VIT Vellore." },
  { body: "I build apps, websites and AI experiments." },
  {
    body: (
      <>
        Status: <span className="ab-struck" data-strike>unemployed (but I make it sound cool)</span>.
      </>
    ),
  },
  { body: "→ update: summer intern @ NTT DATA", className: "text-[#FA1A1D] font-bold" },
  { body: <>Superpower: turning coffee into code <Cup /></> },
  { body: "and bugs into features." },
  { body: "Home base: Gurgaon, India." },
];

/** Which doodle gets drawn once which line is written. */
const AFTER_LINE: Record<number, string[]> = { 0: ["star"], 1: ["arrow"], 6: ["cup"], 8: ["rocket"] };

const Ring = () => (
  <svg viewBox="0 0 90 50" aria-hidden>
    <circle cx="70" cy="25" r="8" fill="#000000" />
    <path d="M70 20 C 52 4, 20 5, 12 26" fill="none" stroke="#8C8C8C" strokeWidth="6" strokeLinecap="round" />
    <path d="M68 18 C 52 6, 24 7, 15 22" fill="none" stroke="#E4E4E4" strokeWidth="1.8" strokeLinecap="round" />
  </svg>
);

const About = () => {
  const ref = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const root = ref.current;
    if (!root) return;
    const ctx = gsap.context(() => {
      if (reducedMotion()) return;
      const q = (sel: string) => Array.from(root.querySelectorAll<SVGPathElement>(sel));

      // Laid down over the hero: up from a slight turn while its top edge crosses the screen.
      gsap.fromTo(root, { rotation: -1.6, y: 60 }, { rotation: 0, y: 0, ease: "none", scrollTrigger: { trigger: root, start: "top bottom", end: "top 25%", scrub: true } });

      // The writing, as one paused timeline started when the page is well on screen.
      const drawn = q("[data-doodle]");
      gsap.set(drawn, { strokeDashoffset: 1 });
      const strike = root.querySelector<HTMLElement>("[data-strike]");
      if (strike) gsap.set(strike, { textDecorationColor: "rgba(250,26,29,0)" });
      const lines = Array.from(root.querySelectorAll<HTMLElement>(".ab-line"));
      const lean = Math.tan((15 * Math.PI) / 180);
      const tl = gsap.timeline({ paused: true });
      const cuts: ((p: number) => void)[] = [];
      tl.to(q("[data-doodle=underline]"), { strokeDashoffset: 0, duration: 0.45, ease: "power2.out" });
      lines.forEach((el, i) => {
        const r = el.getBoundingClientRect();
        const lead = r.width ? (r.height / r.width) * lean * 100 : 0;
        const cut = (p: number) => {
          const foot = -lead + p * (100 + lead);
          el.style.clipPath = `polygon(-5% -50%, ${(foot + lead).toFixed(2)}% -50%, ${foot.toFixed(2)}% 150%, -5% 150%)`;
        };
        cut(0);
        cuts.push(cut);
        const pen = { p: 0 };
        const dur = Math.max(0.35, (el.textContent?.length ?? 20) * 0.02);
        tl.to(pen, { p: 1, duration: dur, ease: "none", onUpdate: () => cut(pen.p), onComplete: () => { el.style.clipPath = ""; } }, i === 0 ? ">-0.1" : `>-${(dur * 0.3).toFixed(2)}`);
        if (i === 4 && strike) tl.to(strike, { textDecorationColor: "rgba(250,26,29,1)", duration: 0.3 }, ">");
        (AFTER_LINE[i] ?? []).forEach((name) => tl.to(q(`[data-doodle=${name}]`), { strokeDashoffset: 0, duration: name === "rocket" ? 1 : 0.45, ease: "power1.inOut" }, "<0.1"));
      });
      ScrollTrigger.create({ trigger: root, start: "top 55%", onEnter: () => tl.restart(), onLeaveBack: () => {
          // Rewound for next time: every line blank again, every doodle undrawn.
          tl.pause(0);
          cuts.forEach((c) => c(0));
          gsap.set(drawn, { strokeDashoffset: 1 });
          if (strike) gsap.set(strike, { textDecorationColor: "rgba(250,26,29,0)" });
        } });

      // The polaroid, stamped down, then taped.
      const photo = root.querySelector(".ab-polaroid");
      if (photo) {
        stampIn(photo, { trigger: root, start: "top 45%", delay: 0.2, rest: 3, onHit: playSlap });
        gsap.from(root.querySelectorAll(".ab-tape"), { opacity: 0, scale: 1.6, duration: 0.25, stagger: 0.12, delay: 0.85, ease: "power2.out", scrollTrigger: { trigger: root, start: "top 45%", toggleActions: "play none none reset" } });
      }
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section id="about" ref={ref} aria-label="About me" className="ab-root">
      <div className="ab-rings" aria-hidden>
        {Array.from({ length: 40 }, (_, i) => (
          <Ring key={i} />
        ))}
      </div>
      <div className="ab-margin" aria-hidden />

      <div className="ab-inner">
        <SprayHeading text="ABOUT ME" ink="marker" tilt={-2} size="clamp(42px, 8.2vw, 118px)" />
        <svg className="ab-underline" viewBox="0 0 640 40" preserveAspectRatio="none" aria-hidden>
          <path data-doodle="underline" className="ab-draw" d="M4 22 C 120 10, 260 30, 380 18 S 560 8, 634 20" pathLength={1} fill="none" stroke="#FA1A1D" strokeWidth="7" strokeLinecap="round" />
        </svg>

        <div className="ab-lines">
          {LINES.map((l, i) => (
            <span key={i} className={`ab-line ${l.className ?? ""}`}>
              {l.body}
            </span>
          ))}
        </div>

        <svg className="ab-arrow" width="160" height="90" viewBox="0 0 160 90" aria-hidden>
          <path data-doodle="arrow" className="ab-draw" d="M6 70 C 50 80, 110 60, 146 22" pathLength={1} fill="none" stroke="#FA1A1D" strokeWidth="3" strokeLinecap="round" />
          <path data-doodle="arrow" className="ab-draw" d="M128 22 L148 18 L146 40" pathLength={1} fill="none" stroke="#FA1A1D" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        </svg>

        <div className="ab-polaroid">
          <div className="ab-photo absolute inset-0">
            <div className="absolute inset-0 bg-white" style={{ boxShadow: "0 14px 30px rgba(0,0,0,0.18), 0 2px 4px rgba(0,0,0,0.12)" }} />
            <div className="absolute overflow-hidden" style={{ left: "5.5%", top: "4.1%", width: "89%", height: "79.5%", background: "#CFE9F4" }}>
              <img src="/Lakshya.png" alt="Lakshya Gupta" className="absolute" style={{ left: "6.8%", top: "6.9%", width: "86.4%", height: "96.6%", objectFit: "cover" }} />
            </div>
            <span className="absolute left-0 w-full text-center font-bold" style={{ top: "85.5%", fontSize: "clamp(24px, 2.2vw, 32px)", color: "#1B2F8F" }}>
              me, probably debugging
            </span>
          </div>
          <div className="ab-tape" style={{ left: -30, background: "rgba(250,26,29,0.55)", transform: "rotate(-32deg)" }} />
          <div className="ab-tape" style={{ right: -30, background: "rgba(116,212,240,0.75)", transform: "rotate(30deg)" }} />
        </div>
        <svg className="ab-rocket" viewBox="0 0 170 170" aria-hidden>
          <g className="ab-rocket-bob" style={{ transformOrigin: "85px 85px" }}>
            <path data-doodle="rocket" className="ab-draw" d="M85 14 C 110 36, 116 74, 104 108 H66 C 54 74, 60 36, 85 14 Z M85 50 A10 10 0 1 1 84.9 50 M66 96 L48 118 L66 112 M104 96 L122 118 L104 112 M76 116 L72 146 M85 116 V156 M94 116 L98 146" pathLength={1} fill="none" stroke="#1B2F8F" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          </g>
        </svg>
      </div>

      <span className="ab-page">p. 01</span>
      <div className="ab-ear" aria-hidden />
      <div className="ab-tear" aria-hidden>
        <div className="ab-tear-shadow" />
        <div className="ab-tear-black" />
      </div>
    </section>
  );
};

export default About;
