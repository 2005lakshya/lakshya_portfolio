import { useMemo, type CSSProperties } from "react";
import { blueprintPaths, type LandBand, type LandMode } from "./landCam";

type Props = { W: number; H: number; band: LandBand | null; mode: LandMode; ready: boolean };

/**
 * While the house loads: an architect's drawing of it on the front door's navy, drawn from the ground up as the files
 * arrive (the section's --p), exactly where the 3D house will stand; at ready it dissolves into the real one.
 * Decoration only: the progress bar says the same thing in words.
 */
export default function Blueprint({ W, H, band, mode, ready }: Props) {
  const bp = useMemo(() => (band && W > 0 && H > 0 ? blueprintPaths(W, H, band) : null), [W, H, band]);
  const vars = bp
    ? ({
        "--bp-left": `${bp.box.x}px`,
        "--bp-top": `${bp.box.y}px`,
        "--bp-w": `${bp.box.w}px`,
        "--bp-h": `${bp.box.h}px`,
        "--bp-cx": `${bp.box.x + bp.box.w / 2}px`,
        "--bp-cy": `${bp.box.y + bp.box.h / 2}px`,
      } as CSSProperties)
    : undefined;
  const lines = { fill: "none", stroke: "#F4F4F4", strokeWidth: 1.5, strokeLinejoin: "round" as const, strokeLinecap: "round" as const };
  return (
    <div className="land-bp" data-mode={mode} data-ready={ready ? "1" : undefined} style={vars} aria-hidden="true">
      <div className="land-bp-bg" />
      {bp && (
        <>
          {/* all of it faintly, then the part that's built so far */}
          <svg className="land-bp-ghost" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none">
            <path d={bp.lines} {...lines} />
            <path d={bp.door} fill="#FFD23F" />
          </svg>
          <svg className="land-bp-lit" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none">
            <path d={bp.lines} {...lines} />
            <path d={bp.door} fill="#FFD23F" stroke="#F4F4F4" strokeWidth={1.5} />
          </svg>
          <div className="land-bp-plot" />
        </>
      )}
      {mode === "wide" && H >= 820 && (
        <div className="land-bp-title land-mono">
          <span>Project</span><span>Lakshya's house</span>
          <span>Site</span><span>Gurgaon, India</span>
          <span>Drawn by</span><span>L. Gupta</span>
          <span>Client</span><span>You</span>
        </div>
      )}
    </div>
  );
}
