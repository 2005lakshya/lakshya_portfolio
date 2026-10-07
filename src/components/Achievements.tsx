import { useLayoutEffect, useRef, useState, type CSSProperties } from "react";
import "./achievements/achievements.css";
import SprayHeading from "@/components/site/SprayHeading";
import { playPaper } from "@/components/site/sfx";
import { gsap, reducedMotion, ScrollTrigger } from "@/components/site/motion";
import { CARD_ICONS, CARD_SHAPES } from "./achievements/cardArt";
import { CARDS, type Card } from "./achievements/cards";

/**
 * Achievements as VinHack-style colour cards. Each card prints its receipt
 * when the section comes on screen; pointing at a card (or tapping it on a
 * phone) swaps in its second colour and shape and pulls the receipt out a
 * little further.
 */


function Face({ c, hot }: { c: Card; hot: boolean }) {
  const icon = CARD_ICONS[c.icon];
  // White lettering on the second colour gets a thin black edge, like the VinHack cards.
  const edge = hot && c.altText === "#FFFFFF";
  return (
    <div className={`ac-face ${hot ? "ac-face-hot" : "ac-face-rest"}`} aria-hidden={hot} style={{ color: hot ? c.altText : c.text }}>
      <svg viewBox="0 0 64 64" width="70" height="70" aria-hidden>
        <path d={icon.d} fill="currentColor" fillRule={icon.rule as "evenodd" | "nonzero"} stroke={edge ? "#000000" : "none"} strokeWidth="1.5" />
      </svg>
      <span className="ac-label" style={{ WebkitTextStroke: edge ? "1px #000000" : undefined }}>{c.face}</span>
    </div>
  );
}

function AchievementCard({ c, i }: { c: Card; i: number }) {
  const [hot, setHot] = useState(false);
  const shape = CARD_SHAPES[c.shape];
  return (
    <div
      className={`ac-item ${hot ? "is-hot" : ""}`}
      tabIndex={0}
      aria-label={`${c.name}, ${c.when}. ${c.body}`}
      onClick={(e) => {
        // Touch screens have no hover, so a tap toggles the card instead.
        if ((e.nativeEvent as PointerEvent).pointerType !== "mouse") {
          setHot((h) => !h);
          playPaper();
        }
      }}
      style={{ "--ac-delay": `${300 + i * 140}ms`, "--ac-print": `${1100 + i * 180}ms` } as CSSProperties}
    >
      <div style={{ transform: `rotate(${c.tilt}deg)` }}>
        <div className="ac-card" style={{ background: c.bg }}>
          <span className="ac-alt" style={{ background: c.alt }} />
          <svg className="ac-shape" viewBox={shape.vb} preserveAspectRatio="xMidYMid meet" aria-hidden>
            <path d={shape.d} fill={c.bg} />
          </svg>
          <Face c={c} hot={false} />
          <Face c={c} hot />
        </div>
        <div className="ac-receipt">
          <div className="ac-print">
            <div className="ac-slip">
              <div className="flex items-baseline justify-between gap-2">
                <span style={{ fontSize: 14.5, lineHeight: 1.1, letterSpacing: "-0.01em" }}>{c.name}</span>
                <span className="flex-none" style={{ fontFamily: "'Space Mono', monospace", fontSize: 10.5, fontWeight: 700, lineHeight: 1.2, letterSpacing: "0.08em", color: c.ink }}>
                  {c.when}
                </span>
              </div>
              <p className="m-0 mt-[7px]" style={{ fontSize: 12, lineHeight: 1.35, color: "#FA1A1D" }}>{c.where}</p>
              <p className="m-0 mt-[5px]" style={{ fontSize: 11.5, lineHeight: 1.6, color: "rgba(0,0,0,0.72)" }}>{c.body}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const Achievements = () => {
  const ref = useRef<HTMLElement>(null);
  // Dealt onto the table like VinHack's stickers: each card thrown in from the
  // side it lands on, turned and a little small, a beat after the one before.
  useLayoutEffect(() => {
    const root = ref.current;
    if (!root) return;
    // The receipts print (in CSS) while this class is on; it comes off when the section is scrolled back off below.
    const printer = ScrollTrigger.create({ trigger: root, start: "top 70%", onEnter: () => root.classList.add("is-on"), onLeaveBack: () => root.classList.remove("is-on") });
    if (reducedMotion()) return () => printer.kill();
    const ctx = gsap.context(() => {
      const cards = gsap.utils.toArray<HTMLElement>(".ac-item", root);
      const mid = root.getBoundingClientRect().left + root.getBoundingClientRect().width / 2;
      cards.forEach((card, i) => {
        const r = card.getBoundingClientRect();
        const left = r.left + r.width / 2 < mid;
        gsap.from(card, {
          x: left ? -420 : 420,
          y: i % 2 ? 160 : -120,
          rotation: left ? -14 : 14,
          scale: 0.8,
          opacity: 0,
          duration: 0.7,
          delay: i * 0.09,
          ease: "power3.out",
          scrollTrigger: { trigger: root, start: "top 70%", toggleActions: "play none none reset" },
        });
      });
    }, root);
    return () => {
      ctx.revert();
      printer.kill();
    };
  }, []);

  return (
    <section id="achievements" ref={ref} aria-label="Achievements" className="ac-root pb-28 pt-12">
      <div className="mx-auto mb-10 max-w-[1440px] px-5 md:mb-14 md:px-[70px]">
        <SprayHeading
          text="ACHIEVEMENTS"
          size="clamp(34px, 6.7vw, 96px)"
          drips={[
            { x: 1.625, y: 0.9375, h: 0.375, w: 0.052 },
            { x: 5.771, y: 0.79, h: 0.25, w: 0.042 },
          ]}
        />
      </div>
      <div className="ac-grid">
        {CARDS.map((c, i) => (
          <AchievementCard key={c.face} c={c} i={i} />
        ))}
      </div>
    </section>
  );
};

export default Achievements;
