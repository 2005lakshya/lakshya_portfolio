import type { ReactNode } from "react";
import { useWidth } from "./hooks";

/**
 * A drawing laid out on a fixed w x h stage, scaled down to the width it is
 * given (and, if `grow` allows, up to fill wide screens). Used for the desktop layouts, which are drawn at 1440px.
 */
export default function ScaledStage({ w, h, children, className, grow = 1 }: { w: number; h: number; children: ReactNode; className?: string; /** How far it may scale up past its drawn size on wide screens. */ grow?: number }) {
  const [ref, width] = useWidth<HTMLDivElement>();
  const scale = width ? Math.min(grow, width / w) : 1;
  return (
    <div ref={ref} className={`w-full ${className ?? ""}`}>
      <div className="relative mx-auto" style={{ width: w * scale, height: h * scale }}>
        <div className="absolute left-0 top-0" style={{ width: w, height: h, transform: `scale(${scale})`, transformOrigin: "top left" }}>
          {children}
        </div>
      </div>
    </div>
  );
}

