"use client";

import { useState, useEffect, useCallback } from "react";

import { keys, rows as ROWS, type KeyData } from "@/data/keycaps";

export default function TechKeyboard() {
  const [pressed, setPressed] = useState<Set<string>>(new Set());
  const [active, setActive] = useState<KeyData | null>(null);

  const pressKey = useCallback((key: KeyData) => {
    setPressed((prev) => {
      const next = new Set(prev);
      next.add(key.id);
      return next;
    });
    setActive(key);
  }, []);

  const releaseKey = useCallback((key: KeyData) => {
    setPressed((prev) => {
      const next = new Set(prev);
      next.delete(key.id);
      return next;
    });
  }, []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const found = keys.find((k) => k.keyboardKey === e.key.toLowerCase());
      if (found) pressKey(found);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [pressKey]);

  return (
    <section
      id="skills"
      className="relative xl:min-h-[70vh] flex flex-col items-center justify-start pt-0 xl:pt-32 pb-16 xl:pb-0 overflow-visible xl:overflow-hidden select-none bg-black [overflow-anchor:none]"
      style={{ backgroundColor: "#000000" }}
    >


      {/* Header */}
      <div className="relative z-10 mb-4 text-center xl:mb-14 mt-8 xl:mt-8">
        <h2 className="site-title tracking-[0.15em] uppercase">
          SKILLS
        </h2>
        <p className="text-xs text-blue-500 font-mono mt-3 opacity-60">
          (click a key or press keyboard shortcut)
        </p>
      </div>

      {/* Left angled text callout (desktop) */}
      <div className="hidden xl:block absolute left-[18%] xl:left-[24%] top-[28rem] z-10 -rotate-[32deg] origin-left pointer-events-none w-[320px] h-[160px] [contain:strict]">
        <h2
          className="text-4xl font-black tracking-tight leading-none min-h-[40px]"
          style={{
            fontFamily: "'Georgia'",
            color: "#fff",
            textShadow: "0 0 30px rgba(100,160,255,0.35), 3px 3px 0 #f05032",
          }}
        >
          {active?.label ?? "Git"}
        </h2>
        <p className="mt-2 text-white/85 font-mono text-2xl leading-none w-[320px] min-h-[80px]">
          {active ? active.description : "the code's personal bodyguard, no cap!"}
        </p>
      </div>

      <div
        className="group relative z-10 xl:ml-96 keyboard-scale"
        style={{
          perspective: "1000px",
          animation: typeof window !== 'undefined' && window.innerWidth < 1024 ? 'none' : "keyboardFloat 4.8s ease-in-out infinite",
        }}
      >
        <div
          className="transition-transform duration-500 ease-out"
          style={{
            transform: "rotateX(30deg) rotateY(-8deg) rotateZ(0deg)",
            transformStyle: "preserve-3d",
          }}
        >
          {/* Board body */}
          <div
            className="rounded-2xl p-5"
            style={{
              background: "linear-gradient(145deg, #1a1d28 0%, #0e1018 100%)",
              boxShadow: `
                0 40px 100px rgba(0,0,0,0.9),
                0 0 0 1px rgba(255,255,255,0.04),
                inset 0 1px 0 rgba(255,255,255,0.06),
                inset 0 -4px 0 rgba(0,0,0,0.5)
              `,
              transformStyle: "preserve-3d",
              animation: "boardPulse 4.8s ease-in-out infinite",
            }}
          >
            {/* Board depth bottom */}
            <div
              className="absolute bottom-0 left-2 right-2 rounded-b-2xl"
              style={{
                height: "12px",
                background: "#050608",
                transform: "translateY(10px) rotateX(-90deg)",
                transformOrigin: "top center",
              }}
            />

            <div className="flex flex-col gap-3">
              {ROWS.map((row, ri) => (
                <div key={ri} className="flex gap-3 justify-center">
                  {row.map((keyId) => {
                    const key = keys.find((k) => k.id === keyId)!;
                    const isPressed = pressed.has(key.id);
                    return (
                      <KeyCap
                        key={key.id}
                        data={key}
                        isPressed={isPressed}
                        onClick={() => pressKey(key)}
                        onMouseLeave={() => releaseKey(key)}
                      />
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile caption: show key label + description below the keyboard (non-tilted) */}
      <div className="block xl:hidden w-full px-6 text-center z-20 -mt-20 md:mt-8">
        <h3 className="text-2xl md:text-3xl font-black text-white tracking-tight">
          {active?.label ?? "Git"}
        </h3>
        <p className="mt-2 text-sm text-white/80 max-w-xl mx-auto">
          {active ? active.description : "the code's personal bodyguard, no cap!"}
        </p>
      </div>



      <style>{`
        @keyframes twinkle {
          0%, 100% { opacity: 0.2; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.4); }
        }
        @keyframes keyboardFloat {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        @keyframes boardPulse {
          0%, 100% { filter: drop-shadow(0 0 0 rgba(255, 255, 255, 0)); }
          50% { filter: drop-shadow(0 0 12px rgba(255, 255, 255, 0.05)); }
        }
      `}</style>
    </section>
  );
}

function KeyCap({
  data,
  isPressed,
  onClick,
  onMouseLeave,
}: {
  data: KeyData;
  isPressed: boolean;
  onClick: () => void;
  onMouseLeave: () => void;
}) {
  const depth = 6;

  return (
    <button
      onClick={onClick}
      onMouseEnter={onClick}
      onMouseLeave={onMouseLeave}
      className="relative focus:outline-none"
      style={{
        width: 68,
        height: 68,
        transformStyle: "preserve-3d",
        transform: isPressed
          ? `translateY(${depth}px)`
          : "translateY(0px)",
        transition: "transform 0.08s cubic-bezier(0.25,0.46,0.45,0.94)",
      }}
    >
      {/* Side faces for 3D depth */}
      {/* Bottom face */}
      <div
        className="absolute inset-x-0 bottom-0 rounded-b-lg"
        style={{
          height: depth,
          background: data.shadowColor,
          transform: `translateY(${depth}px) rotateX(-90deg)`,
          transformOrigin: "top center",
          backfaceVisibility: "hidden",
        }}
      />
      {/* Left side */}
      <div
        className="absolute top-0 bottom-0 left-0"
        style={{
          width: depth,
          background: `linear-gradient(to right, ${data.shadowColor}, ${data.sideColor})`,
          transform: `translateX(-${depth}px) rotateY(90deg)`,
          transformOrigin: "right center",
          backfaceVisibility: "hidden",
          borderRadius: "4px 0 0 4px",
        }}
      />
      {/* Right side */}
      <div
        className="absolute top-0 bottom-0 right-0"
        style={{
          width: depth,
          background: data.sideColor,
          transform: `translateX(${depth}px) rotateY(-90deg)`,
          transformOrigin: "left center",
          backfaceVisibility: "hidden",
          borderRadius: "0 4px 4px 0",
        }}
      />
      {/* Top face (main keycap surface) */}
      <div
        className="absolute inset-0 rounded-xl flex flex-col items-center justify-center gap-1"
        style={{
          background: `linear-gradient(145deg, ${lighten(data.color, 30)} 0%, ${data.color} 60%, ${darken(data.color, 10)} 100%)`,
          boxShadow: isPressed
            ? `inset 0 2px 6px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.05)`
            : `
              0 0 0 1px rgba(255,255,255,0.08),
              inset 0 1px 0 rgba(255,255,255,0.15),
              inset 0 -2px 0 rgba(0,0,0,0.3),
              0 0 20px rgba(0,0,0,0.4)
            `,
          transition: "box-shadow 0.08s",
        }}
      >
        {/* Keycap top sheen */}
        <div
          className="absolute inset-x-2 top-1.5 rounded-lg"
          style={{
            height: "30%",
            background: "linear-gradient(to bottom, rgba(255,255,255,0.12), transparent)",
            pointerEvents: "none",
          }}
        />
        {data.icon}
      </div>
    </button>
  );
}

function lighten(hex: string, amount: number): string {
  const num = parseInt(hex.replace("#", ""), 16);
  const r = Math.min(255, (num >> 16) + amount);
  const g = Math.min(255, ((num >> 8) & 0xff) + amount);
  const b = Math.min(255, (num & 0xff) + amount);
  return `rgb(${r},${g},${b})`;
}

function darken(hex: string, amount: number): string {
  const num = parseInt(hex.replace("#", ""), 16);
  const r = Math.max(0, (num >> 16) - amount);
  const g = Math.max(0, ((num >> 8) & 0xff) - amount);
  const b = Math.max(0, (num & 0xff) - amount);
  return `rgb(${r},${g},${b})`;
}