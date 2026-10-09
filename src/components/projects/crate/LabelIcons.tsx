import type { LabelIconKind } from "./crateData";

function IconArt({ kind }: { kind: LabelIconKind }) {
  switch (kind) {
    case "burger":
      return (
        <>
          <path d="M18 71 H82 Q82 84 66 84 H34 Q18 84 18 71 Z" fill="#E8943A"></path>
          <rect x="16" y="58" width="68" height="12" rx="6" fill="#6B3E26"></rect>
          <path d="M18 55 H82 L78 63 L66 58 L54 65 L44 58 L22 63 Z" fill="#FFD23F"></path>
          <path d="M16 49 L24 55 L32 49 L40 55 L48 49 L56 55 L64 49 L72 55 L84 49 L84 55 L16 55 Z" fill="#7CC45A"></path>
          <path d="M18 48 Q18 22 50 22 Q82 22 82 48 Z" fill="#F2A541"></path>
          <ellipse cx="36" cy="31" rx="3" ry="1.8" fill="#FFF4D6"></ellipse>
          <ellipse cx="52" cy="27" rx="3" ry="1.8" fill="#FFF4D6"></ellipse>
          <ellipse cx="66" cy="33" rx="3" ry="1.8" fill="#FFF4D6"></ellipse>
          <circle cx="42" cy="39" r="2.6" fill="#1E1E1E"></circle>
          <circle cx="58" cy="39" r="2.6" fill="#1E1E1E"></circle>
          <path d="M45 43 Q50 47 55 43" stroke="#1E1E1E" strokeWidth="2.2" fill="none" strokeLinecap="round"></path>
        </>
      );
    case "spinbot":
      return (
        <>
          <rect x="20" y="52" width="60" height="26" rx="6" fill="#2849CB"></rect>
          <circle cx="40" cy="65" r="4" fill="#FFFFFF"></circle>
          <circle cx="60" cy="65" r="4" fill="#FFFFFF"></circle>
          <circle cx="41" cy="66" r="1.8" fill="#1E1E1E"></circle>
          <circle cx="61" cy="66" r="1.8" fill="#1E1E1E"></circle>
          <circle cx="30" cy="80" r="9" fill="#1E1E1E"></circle>
          <circle cx="70" cy="80" r="9" fill="#1E1E1E"></circle>
          <g style={{ transformOrigin: "50px 40px", animation: "rc-spin 0.45s linear infinite" }}>
          <polygon points="50,18 54.1,24.5 61,20.9 61.3,28.7 69.1,29 65.5,35.9 72,40 65.5,44.1 69.1,51 61.3,51.3 61,59.1 54.1,55.5 50,62 45.9,55.5 39,59.1 38.7,51.3 30.9,51 34.5,44.1 28,40 34.5,35.9 30.9,29 38.7,28.7 39,20.9 45.9,24.5" fill="#D9D9D9"></polygon>
          <circle cx="50" cy="40" r="6" fill="#5A5A5A"></circle>
          </g>
        </>
      );
    case "laptop":
      return (
        <>
          <rect x="20" y="22" width="60" height="42" rx="4" fill="#1E1E1E" stroke="#D9D9D9" strokeWidth="4"></rect>
          <text x="50" y="49" textAnchor="middle" fontFamily="Archivo, sans-serif" fontWeight="700" fontSize="16" fill="#74D4F0">&lt;/&gt;</text>
          <path d="M10 66 H90 L84 78 H16 Z" fill="#BDBDBD"></path>
        </>
      );
    case "chip":
      return (
        <>
          <rect x="35" y="18" width="5" height="10" fill="#BDBDBD"></rect>
          <rect x="47" y="18" width="5" height="10" fill="#BDBDBD"></rect>
          <rect x="59" y="18" width="5" height="10" fill="#BDBDBD"></rect>
          <rect x="35" y="72" width="5" height="10" fill="#BDBDBD"></rect>
          <rect x="47" y="72" width="5" height="10" fill="#BDBDBD"></rect>
          <rect x="59" y="72" width="5" height="10" fill="#BDBDBD"></rect>
          <rect x="18" y="35" width="10" height="5" fill="#BDBDBD"></rect>
          <rect x="18" y="47" width="10" height="5" fill="#BDBDBD"></rect>
          <rect x="18" y="59" width="10" height="5" fill="#BDBDBD"></rect>
          <rect x="72" y="35" width="10" height="5" fill="#BDBDBD"></rect>
          <rect x="72" y="47" width="10" height="5" fill="#BDBDBD"></rect>
          <rect x="72" y="59" width="10" height="5" fill="#BDBDBD"></rect>
          <rect x="28" y="28" width="44" height="44" rx="5" fill="#2849CB"></rect>
          <text x="50" y="57" textAnchor="middle" fontFamily="Impact, Anton, sans-serif" fontSize="18" fill="#FFFFFF">AI</text>
        </>
      );
    case "plant":
      return (
        <>
          <ellipse cx="38" cy="36" rx="9" ry="18" fill="#7CC45A" transform="rotate(-30 38 36)"></ellipse>
          <ellipse cx="62" cy="36" rx="9" ry="18" fill="#7CC45A" transform="rotate(30 62 36)"></ellipse>
          <ellipse cx="50" cy="28" rx="8" ry="20" fill="#5FA83F"></ellipse>
          <path d="M30 58 H70 L64 86 H36 Z" fill="#E8943A"></path>
          <rect x="27" y="54" width="46" height="9" rx="3" fill="#D07A2A"></rect>
          <circle cx="43" cy="70" r="2.5" fill="#1E1E1E"></circle>
          <circle cx="57" cy="70" r="2.5" fill="#1E1E1E"></circle>
          <path d="M45 76 Q50 80 55 76" stroke="#1E1E1E" strokeWidth="2.2" fill="none" strokeLinecap="round"></path>
        </>
      );
    case "bunkbed":
      return (
        <>
          <rect x="16" y="14" width="7" height="74" rx="2" fill="#6B3E26"></rect>
          <rect x="77" y="14" width="7" height="74" rx="2" fill="#6B3E26"></rect>
          <rect x="23" y="36" width="54" height="9" rx="2" fill="#D9D9D9"></rect>
          <rect x="36" y="29" width="41" height="9" rx="3" fill="#FA1A1D"></rect>
          <rect x="25" y="28" width="11" height="8" rx="3" fill="#F4F4F4"></rect>
          <rect x="23" y="68" width="54" height="9" rx="2" fill="#D9D9D9"></rect>
          <rect x="36" y="61" width="41" height="9" rx="3" fill="#2849CB"></rect>
          <rect x="25" y="60" width="11" height="8" rx="3" fill="#F4F4F4"></rect>
          <g style={{ animation: "rc-zfloat 2s ease-in-out infinite" }}>
          <text x="58" y="22" fontFamily="Impact, Anton, sans-serif" fontSize="12" fill="#74D4F0">z</text>
          <text x="66" y="14" fontFamily="Impact, Anton, sans-serif" fontSize="9" fill="#74D4F0">z</text>
          </g>
        </>
      );
    default:
      return null;
  }
}

/** The small picture printed on a record's centre label. */
export function LabelIcon({ kind, size }: { kind: LabelIconKind; size: number }) {
  return (
    <svg viewBox="0 0 100 100" width={size} height={size} aria-hidden="true" style={{ display: "block", overflow: "visible" }}>
      <IconArt kind={kind} />
    </svg>
  );
}
