import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties, type FormEvent } from "react";
import "./contact/contact.css";
import SprayHeading from "@/components/site/SprayHeading";
import { useInView, useWidth } from "@/components/site/hooks";
import { playChirp, playRun, playSlap, playTear, playTick } from "@/components/site/sfx";
import { gsap, reveal, settle } from "@/components/site/motion";
import { contactData } from "@/data/portfolio";

/**
 * Contact, on the same black wall:
 *  - a flyer with tear-off tabs (a tab copies its detail and grows back),
 *  - The Daily Lakshya's crossword, where every answer is a way to reach me,
 *  - a message box whose typed message is sprayed on the wall, sent by
 *    clipping the coupon (it really sends, through Web3Forms),
 *  - and the curb along the bottom as the footer.
 */

const EMAIL = contactData.email;
const PHONE = contactData.phone;
const LINKEDIN = `linkedin.com/in/${contactData.linkedin}`;
const GITHUB = `github.com/${contactData.github}`;

const TABS = [
  { label: EMAIL, copy: EMAIL },
  { label: "+91 85290 75860", copy: PHONE },
  { label: `in/${contactData.linkedin}`, copy: LINKEDIN },
  { label: GITHUB, copy: GITHUB },
  // Already torn off, like on any flyer that has been up for a week.
  { label: EMAIL, copy: EMAIL, gone: true },
  { label: "Resume (PDF)", copy: `${window.location.origin}/Lakshya_Gupta_Resume.pdf` },
];

const WORDS = [
  { w: "EMAIL", r: 0, c: 0, dir: "down", n: 1, clue: "Where to write to me", value: EMAIL, href: `mailto:${EMAIL}` },
  { w: "GITHUB", r: 3, c: 6, dir: "down", n: 2, clue: "Where my code lives", value: GITHUB, href: `https://${GITHUB}` },
  { w: "LINKEDIN", r: 4, c: 0, dir: "across", n: 3, clue: "Where to network with me", value: LINKEDIN, href: `https://${LINKEDIN}` },
  { w: "PHONE", r: 5, c: 10, dir: "down", n: 4, clue: "Ring me on it", value: "+91 85290 75860", href: "tel:+918529075860" },
  { w: "GURGAON", r: 7, c: 5, dir: "across", n: 5, clue: "My home city", value: contactData.location, href: "" },
] as const;
const FILL_ORDER = ["EMAIL", "LINKEDIN", "GITHUB", "GURGAON", "PHONE"];

type Cell = { r: number; c: number; ch: string; num: number | ""; words: { w: string; i: number }[] };
const CELLS: Cell[] = (() => {
  const map = new Map<string, Cell>();
  WORDS.forEach((word) => {
    [...word.w].forEach((ch, i) => {
      const r = word.dir === "down" ? word.r + i : word.r;
      const c = word.dir === "down" ? word.c : word.c + i;
      const key = `${r},${c}`;
      const cell = map.get(key) ?? { r, c, ch, num: "" as const, words: [] };
      cell.words.push({ w: word.w, i });
      if (i === 0) cell.num = word.n;
      map.set(key, cell);
    });
  });
  return [...map.values()];
})();

/* ------------------------------------------------------------ the flyer */

function Flyer() {
  const [torn, setTorn] = useState<Record<number, "falling" | "back">>({});
  const [toast, setToast] = useState<{ text: string; n: number } | null>(null);
  const timers = useRef<number[]>([]);
  useEffect(() => () => timers.current.forEach((t) => window.clearTimeout(t)), []);

  const tear = (i: number) => {
    if (torn[i] === "falling") return;
    const t = TABS[i];
    navigator.clipboard?.writeText(t.copy).catch(() => {
      // The clipboard can be blocked; the tab still comes off.
    });
    playTear();
    setTorn((s) => ({ ...s, [i]: "falling" }));
    setToast((p) => ({ text: t.copy, n: (p?.n ?? 0) + 1 }));
    timers.current.push(window.setTimeout(() => setTorn((s) => ({ ...s, [i]: "back" })), 4200));
    timers.current.push(window.setTimeout(() => setToast((p) => (p && p.text === t.copy ? null : p)), 2400));
  };

  return (
    <div className="ct-flyer relative">
      <div className="relative box-border px-6 py-6 sm:px-7" style={{ background: "#F4F0E6", boxShadow: "0 10px 22px rgba(0,0,0,0.5)" }}>
        <div style={{ fontFamily: "Anton, Impact, sans-serif", fontSize: "clamp(40px, 11vw, 52px)", lineHeight: 0.95 }}>
          NEED A<br />
          DEVELOPER?
        </div>
        <div className="mt-2.5" style={{ fontSize: 18, letterSpacing: 1 }}>apps · websites · AI</div>
        <div className="mt-3 flex items-center gap-3">
          <svg width="58" height="34" viewBox="0 0 70 40" aria-hidden>
            <path d="M4 30 C 20 6, 44 4, 62 18 M50 8 L63 18 L50 28" fill="none" stroke="#FA1A1D" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span style={{ fontFamily: "'Permanent Marker', cursive", fontSize: 30, color: "#FA1A1D" }}>Lakshya Gupta</span>
        </div>
        <div className="mt-2" style={{ fontSize: 15, lineHeight: 1.5 }}>
          Looking for summer internships.
          <br />
          Based in {contactData.location}.
        </div>
        <div aria-hidden className="absolute" style={{ left: 44, top: -12, width: 80, height: 24, background: "rgba(230,230,220,0.55)", transform: "rotate(-5deg)" }} />
        <div aria-hidden className="absolute" style={{ right: 44, top: -12, width: 80, height: 24, background: "rgba(230,230,220,0.55)", transform: "rotate(4deg)" }} />
      </div>
      <div className="ct-tabs">
        {TABS.map((t, i) => (
          <button
            key={i}
            type="button"
            className={`ct-tab ${torn[i] === "falling" ? "is-falling" : torn[i] === "back" ? "is-back" : ""}`}
            onClick={() => tear(i)}
            aria-label={`Tear off and copy: ${t.label}`}
            aria-hidden={t.gone}
            tabIndex={t.gone ? -1 : 0}
            style={{ visibility: t.gone ? "hidden" : "visible" }}
          >
            <span>{t.label}</span>
          </button>
        ))}
      </div>
      {toast && (
        <div key={toast.n} role="status" className="ct-toast absolute left-1/2 top-[70%] -translate-x-1/2 whitespace-nowrap border-[3px] border-[#111111] bg-[#FFD23F] px-3.5 py-2" style={{ fontFamily: "Anton, Impact, sans-serif", fontSize: 18, letterSpacing: 1, maxWidth: "95%", overflow: "hidden", textOverflow: "ellipsis" }}>
          COPIED: {toast.text}
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------- the crossword */

function Crossword({ active }: { active: boolean }) {
  const [solved, setSolved] = useState<Record<string, boolean>>({});
  const [last, setLast] = useState("");
  const [touched, setTouched] = useState(false);
  const [boxRef, boxW] = useWidth<HTMLDivElement>();
  const cell = Math.max(22, Math.min(30, Math.floor((boxW || 436) / 12)));

  // Somebody is filling the puzzle in, one answer at a time, until a reader takes the pen.
  useEffect(() => {
    if (!active || touched) return;
    const id = window.setInterval(() => {
      setSolved((s) => {
        const next = FILL_ORDER.find((w) => !s[w]);
        if (!next) {
          window.clearInterval(id);
          return s;
        }
        setLast(next);
        return { ...s, [next]: true };
      });
    }, 2600);
    return () => window.clearInterval(id);
  }, [active, touched]);

  // Only an answer the visitor asked for is pencilled in with sound, a tick a letter.
  const pencil = (w: string) => {
    const n = WORDS.find((x) => x.w === w)?.w.length ?? 0;
    for (let i = 0; i < n; i++) window.setTimeout(playTick, i * 90);
  };

  const solve = (w: string) => {
    pencil(w);
    setTouched(true);
    setSolved((s) => ({ ...s, [w]: true }));
    setLast(w);
  };

  const clueList = (dir: "across" | "down") =>
    WORDS.filter((w) => w.dir === dir).map((word) => (
      <div key={word.w} style={{ borderBottom: "1px dotted rgba(21,21,21,0.5)" }}>
        <button type="button" className="ct-clue" onClick={() => solve(word.w)}>
          <b>{word.n}.</b> {word.clue} ({word.w.length})
        </button>
        {solved[word.w] &&
          (word.href ? (
            <a className="ct-ans" href={word.href} target={word.href.startsWith("http") ? "_blank" : undefined} rel="noreferrer">
              {word.value} ↗
            </a>
          ) : (
            <span className="ct-ans">{word.value}</span>
          ))}
      </div>
    ));

  return (
    <div className="ct-page relative">
      <div className="ct-news ct-page-paper box-border px-4 pb-10 pt-5 sm:px-[22px]">
        <div className="flex items-baseline justify-between gap-2">
          <span style={{ fontFamily: "UnifrakturMaguntia, serif", fontSize: "clamp(22px, 6vw, 30px)", lineHeight: 1 }}>The Daily Lakshya</span>
          <span className="mr-5" style={{ fontFamily: "'Old Standard TT', Georgia, serif", fontSize: 11, fontWeight: 700, letterSpacing: 2 }}>PUZZLES · PAGE 6</span>
        </div>
        <div className="mt-2 h-1" style={{ borderTop: "3px solid #151515", borderBottom: "1px solid #151515" }} />
        <div className="mt-2.5" style={{ fontFamily: "Anton, Impact, sans-serif", fontSize: "clamp(22px, 6.4vw, 30px)", lineHeight: 1, letterSpacing: 0.5 }}>EVERY ANSWER REACHES LAKSHYA</div>
        <div ref={boxRef} className="mt-3.5 w-full">
          <div className="relative mx-auto" style={{ width: cell * 12, height: cell * 10 }} aria-label="Crossword grid" role="img">
            {CELLS.map((c) => {
              const hit = c.words.find((x) => solved[x.w]);
              const fresh = c.words.find((x) => x.w === last);
              return (
                <div key={`${c.r},${c.c}`} className="ct-cell" style={{ left: c.c * cell, top: c.r * cell, width: cell, height: cell, background: fresh && hit ? "#FFF4C2" : "#FFFFFF", "--ct-delay": `${1600 + (c.r + c.c) * 30}ms` } as CSSProperties}>
                  <span className="absolute left-0.5 top-0" style={{ fontFamily: "'Old Standard TT', Georgia, serif", fontSize: 8, fontWeight: 700 }}>{c.num}</span>
                  {hit && (
                    <span key={fresh ? `f-${last}` : "s"} className="ct-letter absolute left-0 w-full text-center" style={{ top: cell * 0.12, fontFamily: "Anton, Impact, sans-serif", fontSize: cell * 0.6, lineHeight: 1, color: fresh ? "#D8161A" : "#151515", "--ct-delay": `${fresh ? fresh.i * 90 : 0}ms` } as CSSProperties}>
                      {c.ch}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
        <div className="mt-3.5 grid grid-cols-1 gap-4 min-[420px]:grid-cols-2">
          <div>
            <div style={{ fontFamily: "Anton, Impact, sans-serif", fontSize: 16, letterSpacing: 1, paddingBottom: 3, borderBottom: "2px solid #151515" }}>ACROSS</div>
            {clueList("across")}
          </div>
          <div>
            <div style={{ fontFamily: "Anton, Impact, sans-serif", fontSize: 16, letterSpacing: 1, paddingBottom: 3, borderBottom: "2px solid #151515" }}>DOWN</div>
            {clueList("down")}
          </div>
        </div>
      </div>
      <div className="ct-corner" aria-hidden />
    </div>
  );
}

/* ---------------------------------------------- message box and coupon */

type Status = "idle" | "cutting" | "sent" | "failed";

function useSend() {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);
  const [round, setRound] = useState(0);
  const timers = useRef<number[]>([]);
  useEffect(() => () => timers.current.forEach((t) => window.clearTimeout(t)), []);

  const send = async (message: string, email: string) => {
    if (status === "cutting") return;
    setError(null);
    setStatus("cutting");
    setRound((r) => r + 1);
    playRun(12, 1.6);
    timers.current.push(window.setTimeout(() => playSlap(), 2300));
    const started = Date.now();

    let ok = false;
    const key = import.meta.env.VITE_WEB3FORMS_ACCESS_KEY || "";
    if (!key) {
      setError(`Messages can't be sent from here right now. Write to ${EMAIL} instead.`);
    } else {
      try {
        const res = await fetch("https://api.web3forms.com/submit", {
          method: "POST",
          headers: { "Content-Type": "application/json", Accept: "application/json" },
          body: JSON.stringify({ access_key: key, subject: "New message from the portfolio wall", from_name: "Portfolio contact", email, message }),
        });
        const data = await res.json();
        ok = !!data.success;
        if (!ok) setError(data.message || `That didn't go through. Write to ${EMAIL} instead.`);
      } catch {
        setError(`Network trouble. Write to ${EMAIL} instead.`);
      }
    }

    // Let the scissors finish going round before the result is sprayed up.
    const wait = Math.max(0, 1900 - (Date.now() - started));
    timers.current.push(
      window.setTimeout(() => {
        setStatus(ok ? "sent" : "failed");
        if (ok) playChirp();
        else playSlap();
      }, wait),
    );
    timers.current.push(window.setTimeout(() => setStatus("idle"), wait + 3800));
  };

  return { status, error, round, send };
}

function Coupon({ status, round }: { status: Status; round: number }) {
  const [ref, w] = useWidth<HTMLDivElement>();
  const width = w || 350;
  const dropping = status !== "idle";
  return (
    <div ref={ref} className="relative mt-8 h-[250px] w-full">
      <div key={round} className={`ct-coupon absolute inset-0 ${dropping ? "is-dropping" : round ? "is-back" : ""}`}>
        <div className="ct-news absolute inset-0 box-border px-[22px] py-[18px]" style={{ border: "3px dashed #151515" }}>
          <div style={{ fontFamily: "'Old Standard TT', Georgia, serif", fontSize: 11, fontWeight: 700, letterSpacing: 3 }}>CLIP AND SEND</div>
          <div className="mt-1" style={{ fontFamily: "Anton, Impact, sans-serif", fontSize: 40, lineHeight: 0.95 }}>COUPON</div>
          <div className="mt-2" style={{ fontFamily: "'Old Standard TT', Georgia, serif", fontSize: 15, lineHeight: 1.4 }}>
            <b>Good for:</b> one project collab, one internship chat, or one very long code review.
          </div>
          <div className="mt-1" style={{ fontFamily: "'Old Standard TT', Georgia, serif", fontSize: 13, fontStyle: "italic" }}>No expiry. Coffee not included.</div>
          <div className="absolute bottom-4 right-5">
            <button type="submit" form="ct-form" className="ct-clip" disabled={status === "cutting"}>
              <span style={{ fontFamily: "Anton, Impact, sans-serif", fontSize: 19, letterSpacing: 1, color: "#EAE5D9" }}>CLIP &amp; SEND</span>
            </button>
          </div>
        </div>
        <div className={`ct-snip ${status === "cutting" ? "is-cutting" : ""}`} style={{ offsetPath: `path("M0 0 H${width} V250 H0 Z")` } as CSSProperties} aria-hidden>
          <svg width="44" height="30" viewBox="0 0 44 30">
            <circle cx="8" cy="7" r="6" fill="#FA1A1D" stroke="#151515" strokeWidth="3" />
            <circle cx="8" cy="23" r="6" fill="#FA1A1D" stroke="#151515" strokeWidth="3" />
            <path d="M13 10 L42 22 M13 20 L42 8" stroke="#151515" strokeWidth="3" strokeLinecap="round" />
          </svg>
        </div>
      </div>
      {(status === "sent" || status === "failed") && (
        <div className="absolute left-0 top-[60px] w-full text-center">
          <div className="ct-sprayed st-spray" style={{ fontSize: 60, lineHeight: 1, color: status === "sent" ? "#FFD23F" : "#FA1A1D", textShadow: status === "sent" ? "0 0 3px rgba(255,210,63,0.9), 0 0 18px rgba(255,210,63,0.45)" : "0 0 3px rgba(250,26,29,0.9), 0 0 18px rgba(250,26,29,0.45)", transform: "rotate(-6deg)" }}>
            {status === "sent" ? "SENT!" : "NOT SENT"}
          </div>
        </div>
      )}
    </div>
  );
}

/* --------------------------------------------------------------- the rest */

const SCRAPS = [
  { y: 150, w: 22, h: 16, c: "#EAE5D9", delay: 3 },
  { y: 520, w: 18, h: 14, c: "#FFD23F", delay: 3.4 },
];

const Contact = () => {
  const [ref, on] = useInView<HTMLElement>(0.15);

  // The pieces go up on the wall one after another: the flyer slapped on,
  // the newspaper page pasted up, then the message box pulls into focus.
  useLayoutEffect(() => {
    const root = ref.current;
    if (!root) return;
    const ctx = gsap.context(() => {
      settle(root.querySelector(".ct-flyer"), { y: -80, rotation: -8, opacity: 0 }, { trigger: root, start: "top 65%" });
      settle(root.querySelector(".ct-page"), { y: 120, rotation: 5, opacity: 0 }, { trigger: root, start: "top 65%", delay: 0.15 });
      reveal(root.querySelectorAll(".ct-side > *"), { trigger: root, start: "top 65%", delay: 0.3 });
    }, root);
    return () => ctx.revert();
  }, [ref]);
  const [tag, setTag] = useState("");
  const [sprayRound, setSprayRound] = useState(0);
  const { status, error, round, send } = useSend();
  const shown = tag.trim() || "HI LAKSHYA!";
  const tagSize = shown.length > 24 ? "clamp(28px, 3.5vw, 50px)" : shown.length > 14 ? "clamp(34px, 4.4vw, 64px)" : "clamp(42px, 5.8vw, 84px)";

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const message = String(data.get("message") ?? "").trim() || "HI LAKSHYA!";
    const email = String(data.get("email") ?? "").trim();
    send(message, email);
    // The tag gets a fresh coat as the coupon comes off.
    window.setTimeout(() => setSprayRound((n) => n + 1), 1900);
  };

  return (
    <section id="contact" ref={ref} aria-label="Contact" className={`ct-root ${on ? "is-on" : ""}`}>
      {SCRAPS.map((b) => (
        <div key={b.y} aria-hidden className="ct-scrap" style={{ top: b.y, width: b.w, height: b.h, background: b.c, animationDelay: `${b.delay}s` }} />
      ))}

      <div className="mx-auto flex max-w-[1440px] flex-col gap-4 px-5 pb-10 pt-14 md:px-[70px] lg:flex-row lg:items-center lg:justify-between">
        <SprayHeading text="CONTACT ME" size="clamp(48px, 7vw, 100px)" drips={[{ x: 1.16, y: 1.04, h: 0.38, w: 0.05 }]} />
        <div className="relative flex min-h-[110px] flex-1 items-center justify-center lg:max-w-[700px]" aria-live="polite">
          <div key={sprayRound} className={sprayRound ? "ct-tag ct-sprayed" : "ct-tag"} style={{ fontSize: tagSize, transform: "rotate(-4deg)" }}>
            {shown}
          </div>
          {sprayRound > 0 && <div key={`h${sprayRound}`} aria-hidden className="ct-hiss pointer-events-none absolute left-1/2 top-1/2 h-[260px] w-[360px] -translate-x-1/2 -translate-y-1/2 rounded-full" style={{ background: "radial-gradient(closest-side, rgba(255,210,63,0.35), transparent)" }} />}
        </div>
      </div>

      <div className="ct-row pb-24">
        <Flyer />
        <Crossword active={on} />
        <div className="ct-side">
          <form id="ct-form" onSubmit={onSubmit} className="flex flex-col gap-2.5">
            <label htmlFor="ct-tag" className="ct-label">LEAVE A TAG</label>
            <input id="ct-tag" name="message" className="ct-input" type="text" maxLength={140} placeholder="say hi, or pitch me a project" value={tag} onChange={(e) => setTag(e.target.value)} />
            <label htmlFor="ct-mail" className="ct-label mt-1.5">YOUR EMAIL</label>
            <input id="ct-mail" name="email" className="ct-input" type="email" required autoComplete="email" placeholder="so I can write back" />
          </form>
          <Coupon status={status} round={round} />
          {error && (
            <p role="alert" className="mt-4 text-[13px] leading-snug text-[#FFB4B4]" style={{ fontFamily: "'Space Mono', monospace" }}>
              {error}
            </p>
          )}
        </div>
      </div>

      <div aria-hidden className="pointer-events-none absolute bottom-[100px] left-[64px] hidden -rotate-2 md:block" style={{ fontFamily: "Anton, Impact, sans-serif", fontSize: 34, letterSpacing: 8, color: "rgba(244,244,244,0.16)" }}>
        STICK NO BILLS
      </div>

      <footer className="ct-curb flex flex-wrap items-center gap-x-8 gap-y-3 px-6 py-5 md:px-[60px]">
        <span style={{ fontFamily: "Anton, Impact, sans-serif", fontSize: 20, letterSpacing: 4 }}>© 2026 LAKSHYA GUPTA</span>
        <span style={{ fontSize: 15, color: "#CFCBC4" }}>Printed in Gurgaon, India. Compiled without warnings.</span>
        <nav aria-label="Elsewhere" className="flex flex-wrap gap-6 md:ml-auto" style={{ fontFamily: "Anton, Impact, sans-serif", fontSize: 18, letterSpacing: 3 }}>
          <a href="/Lakshya_Gupta_Resume.pdf" target="_blank" rel="noreferrer">RESUME</a>
          <a href={`https://${GITHUB}`} target="_blank" rel="noreferrer">GITHUB</a>
          <a href={`https://${LINKEDIN}`} target="_blank" rel="noreferrer">LINKEDIN</a>
          <a href={`mailto:${EMAIL}`}>EMAIL</a>
        </nav>
      </footer>
    </section>
  );
};

export default Contact;
