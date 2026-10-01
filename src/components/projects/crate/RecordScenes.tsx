import type { SceneKind } from "./crateData";

/**
 * The scene printed on the back of each album cover: a small, looping picture of
 * what the project is about. Drawn at 288x246 and scaled by whatever holds it.
 * The animations live in recordCrate.css under the rc- prefix.
 */
export function RecordScene({ kind }: { kind: SceneKind }) {
  switch (kind) {
    case "messit":
      return (
        <svg className="rc-scene-svg" width="288" height="246" viewBox="0 0 288 246" aria-hidden="true" style={{ display: "block" }}>
        <defs>
        <pattern id="scGingham" width="24" height="24" patternUnits="userSpaceOnUse"><rect width="24" height="24" fill="#FFFFFF"></rect><rect width="12" height="24" fill="#FA1A1D" fillOpacity="0.4"></rect><rect width="24" height="12" fill="#FA1A1D" fillOpacity="0.4"></rect></pattern>
        </defs>
        <rect width="288" height="246" fill="url(#scGingham)"></rect>
        <rect x="0" y="0" width="288" height="42" fill="#1F3A2E"></rect>
        <rect x="0" y="42" width="288" height="5" fill="#6B3E26"></rect>
        <text x="144" y="30" textAnchor="middle" fontFamily="Impact, Anton, sans-serif" fontSize="22" letterSpacing="1" fill="#F4F4F4">TODAY'S MENU</text>
        <polygon points="28,13 30.4,19.2 37,19.4 31.8,23.4 33.6,29.8 28,26 22.4,29.8 24.2,23.4 19,19.4 25.6,19.2" fill="#FFD23F" style={{ animation: "rc-twinkle 1.6s ease-in-out infinite" }}></polygon>
        <polygon points="260,13 262.4,19.2 269,19.4 263.8,23.4 265.6,29.8 260,26 254.4,29.8 256.2,23.4 251,19.4 257.6,19.2" fill="#FFD23F" style={{ animation: "rc-twinkle 1.6s ease-in-out 0.8s infinite" }}></polygon>
        <ellipse cx="150" cy="160" rx="84" ry="80" fill="#000000" fillOpacity="0.12"></ellipse>
        <circle cx="144" cy="152" r="82" fill="#C9C9C9"></circle>
        <circle cx="144" cy="152" r="70" fill="#E8E8E8"></circle>
        <path d="M86 118 Q104 90 138 84" stroke="#FFFFFF" strokeWidth="5" fill="none" strokeLinecap="round" opacity="0.85"></path>
        <g transform="translate(4 50) rotate(-20 50 50) scale(0.62)">
        <path d="M50 90 L20 26 L80 26 Z" fill="#FFD23F"></path>
        <path d="M17 24 Q50 9 83 24 L79 33 Q50 20 21 33 Z" fill="#E8943A"></path>
        <circle cx="48" cy="42" r="7" fill="#FA1A1D"></circle>
        <circle cx="60" cy="55" r="5.5" fill="#FA1A1D"></circle>
        <circle cx="45" cy="63" r="5" fill="#FA1A1D"></circle>
        </g>
        <g transform="translate(66 146) scale(0.56)">
        <g style={{ transformOrigin: "50px 85px", animation: "rc-wiggle 1.8s ease-in-out infinite" }}>
        <path d="M50 16 L85 78 Q87 85 80 85 L20 85 Q13 85 15 78 Z" fill="#E8A33D"></path>
        <path d="M50 16 L36 85 M50 16 L64 85" stroke="#C4801F" strokeWidth="2.5" fill="none"></path>
        <circle cx="40" cy="64" r="2.8" fill="#1E1E1E"></circle>
        <circle cx="60" cy="64" r="2.8" fill="#1E1E1E"></circle>
        <circle cx="33" cy="71" r="3.5" fill="#FA1A1D" fillOpacity="0.45"></circle>
        <circle cx="67" cy="71" r="3.5" fill="#FA1A1D" fillOpacity="0.45"></circle>
        <path d="M44 71 Q50 76 56 71" stroke="#1E1E1E" strokeWidth="2.4" fill="none" strokeLinecap="round"></path>
        </g>
        </g>
        <g transform="translate(106 94) scale(0.9)">
        <g style={{ transformOrigin: "50px 84px", animation: "rc-bob 2.2s ease-in-out infinite" }}>
        <path d="M18 71 H82 Q82 84 66 84 H34 Q18 84 18 71 Z" fill="#E8943A"></path>
        <rect x="16" y="58" width="68" height="12" rx="6" fill="#6B3E26"></rect>
        <path d="M18 55 H82 L78 63 L66 58 L54 65 L44 58 L22 63 Z" fill="#FFD23F"></path>
        <path d="M16 49 L24 55 L32 49 L40 55 L48 49 L56 55 L64 49 L72 55 L84 49 L84 55 L16 55 Z" fill="#7CC45A"></path>
        <path d="M18 48 Q18 22 50 22 Q82 22 82 48 Z" fill="#F2A541"></path>
        <ellipse cx="36" cy="31" rx="3" ry="1.8" fill="#FFF4D6"></ellipse>
        <ellipse cx="52" cy="27" rx="3" ry="1.8" fill="#FFF4D6"></ellipse>
        <ellipse cx="66" cy="33" rx="3" ry="1.8" fill="#FFF4D6"></ellipse>
        <g style={{ transformOrigin: "50px 39px", animation: "rc-blink 3.4s ease-in-out infinite" }}>
        <circle cx="42" cy="39" r="2.8" fill="#1E1E1E"></circle>
        <circle cx="58" cy="39" r="2.8" fill="#1E1E1E"></circle>
        </g>
        <path d="M45 43 Q50 47 55 43" stroke="#1E1E1E" strokeWidth="2.2" fill="none" strokeLinecap="round"></path>
        </g>
        </g>
        <g transform="translate(196 102) scale(0.8)">
        <path d="M40 22 Q36 16 40 10" stroke="#9A9A9A" strokeWidth="3" fill="none" strokeLinecap="round" style={{ animation: "rc-steam 2s ease-out infinite" }}></path>
        <path d="M50 22 Q46 15 50 8" stroke="#9A9A9A" strokeWidth="3" fill="none" strokeLinecap="round" style={{ animation: "rc-steam 2s ease-out 0.6s infinite" }}></path>
        <path d="M60 22 Q56 16 60 10" stroke="#9A9A9A" strokeWidth="3" fill="none" strokeLinecap="round" style={{ animation: "rc-steam 2s ease-out 1.2s infinite" }}></path>
        <path d="M31 30 L69 30 L63 86 L37 86 Z" fill="#EFE4CF"></path>
        <path d="M33 46 L67 46 L63 86 L37 86 Z" fill="#B8682A"></path>
        <path d="M33 46 L67 46" stroke="#E7C9A0" strokeWidth="3"></path>
        <text x="50" y="72" textAnchor="middle" fontFamily="Impact, Anton, sans-serif" fontSize="13" fill="#FFF4D6">CHAI</text>
        </g>
        </svg>
      );
    case "robowars":
      return (
        <svg className="rc-scene-svg" width="288" height="246" viewBox="0 0 288 246" aria-hidden="true" style={{ display: "block" }}>
        <defs>
        <pattern id="scHazard" width="20" height="20" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect width="20" height="20" fill="#1E1E1E"></rect><rect width="10" height="20" fill="#FFD23F"></rect></pattern>
        <pattern id="scGrid" width="24" height="24" patternUnits="userSpaceOnUse"><rect width="24" height="24" fill="#191919"></rect><path d="M24 0 H0 V24" stroke="#2B2B2B" strokeWidth="2" fill="none"></path></pattern>
        </defs>
        <rect width="288" height="246" fill="url(#scHazard)"></rect>
        <rect x="12" y="12" width="264" height="222" rx="6" fill="url(#scGrid)"></rect>
        <rect x="54" y="22" width="180" height="34" rx="6" fill="#FA1A1D"></rect>
        <text x="144" y="46" textAnchor="middle" fontFamily="Impact, Anton, sans-serif" fontSize="22" fill="#FFFFFF">ROUND 1: FIGHT!</text>
        <line x1="144" y1="66" x2="144" y2="226" stroke="#FA1A1D" strokeWidth="2" strokeDasharray="6 6" opacity="0.5"></line>
        <g transform="translate(24 118)">
        <g style={{ animation: "rc-chargeL 1.6s ease-in-out infinite" }}>
        <g transform="translate(100 0) scale(-1 1)">
        <polygon points="8,76 92,76 92,44 58,44" fill="#FA1A1D"></polygon>
        <rect x="60" y="33" width="27" height="13" rx="3" fill="#C41214"></rect>
        <polygon points="63,37 71,39 71,43 63,42" fill="#FFFFFF"></polygon>
        <polygon points="84,37 76,39 76,43 84,42" fill="#FFFFFF"></polygon>
        <line x1="84" y1="33" x2="88" y2="21" stroke="#D9D9D9" strokeWidth="2.5"></line>
        <circle cx="88" cy="20" r="3.5" fill="#FFD23F"></circle>
        <circle cx="30" cy="80" r="10" fill="#0A0A0A"></circle>
        <circle cx="30" cy="80" r="4" fill="#9A9A9A"></circle>
        <circle cx="72" cy="80" r="10" fill="#0A0A0A"></circle>
        <circle cx="72" cy="80" r="4" fill="#9A9A9A"></circle>
        </g>
        </g>
        </g>
        <g transform="translate(164 118)">
        <g style={{ animation: "rc-chargeR 1.6s ease-in-out infinite" }}>
        <rect x="20" y="52" width="60" height="26" rx="6" fill="#2849CB"></rect>
        <circle cx="40" cy="65" r="4" fill="#FFFFFF"></circle>
        <circle cx="60" cy="65" r="4" fill="#FFFFFF"></circle>
        <circle cx="39" cy="66" r="1.8" fill="#1E1E1E"></circle>
        <circle cx="59" cy="66" r="1.8" fill="#1E1E1E"></circle>
        <circle cx="30" cy="80" r="9" fill="#0A0A0A"></circle>
        <circle cx="70" cy="80" r="9" fill="#0A0A0A"></circle>
        <g style={{ transformOrigin: "50px 40px", animation: "rc-spin 0.4s linear infinite" }}>
        <polygon points="50,18 54.1,24.5 61,20.9 61.3,28.7 69.1,29 65.5,35.9 72,40 65.5,44.1 69.1,51 61.3,51.3 61,59.1 54.1,55.5 50,62 45.9,55.5 39,59.1 38.7,51.3 30.9,51 34.5,44.1 28,40 34.5,35.9 30.9,29 38.7,28.7 39,20.9 45.9,24.5" fill="#D9D9D9"></polygon>
        <circle cx="50" cy="40" r="6" fill="#5A5A5A"></circle>
        </g>
        </g>
        </g>
        <g style={{ animation: "rc-spark 1.6s linear infinite" }}>
        <path d="M146 150 L134 142 M170 150 L182 142 M146 166 L134 174 M170 166 L182 174 M158 140 V128" stroke="#FFD23F" strokeWidth="3" strokeLinecap="round"></path>
        </g>
        <g transform="translate(126 102)">
        <g style={{ transformOrigin: "32px 32px", animation: "rc-ko 1.6s ease-in-out infinite" }}>
        <g transform="scale(0.64)">
        <polygon points="50,2 59.9,13.3 74,8.5 76.9,23.2 91.6,26 86.7,40.2 98,50 86.7,59.9 91.6,74 76.9,76.9 74,91.6 59.9,86.7 50,98 40.2,86.7 26,91.6 23.2,76.9 8.5,74 13.3,59.9 2,50 13.3,40.2 8.5,26 23.2,23.2 26,8.5 40.2,13.3" fill="#FFD23F"></polygon>
        <text x="50" y="61" textAnchor="middle" fontFamily="Impact, Anton, sans-serif" fontSize="30" fill="#FA1A1D">KO!</text>
        </g>
        </g>
        </g>
        </svg>
      );
    case "hackx":
      return (
        <svg className="rc-scene-svg" width="288" height="246" viewBox="0 0 288 246" aria-hidden="true" style={{ display: "block" }}>
        <rect width="288" height="246" fill="#0B1550"></rect>
        <circle cx="130" cy="20" r="1.6" fill="#FFFFFF" style={{ animation: "rc-twinkle 2s ease-in-out infinite" }}></circle>
        <circle cx="160" cy="56" r="1.2" fill="#FFFFFF" style={{ animation: "rc-twinkle 2.4s ease-in-out 0.4s infinite" }}></circle>
        <circle cx="40" cy="92" r="1.4" fill="#FFFFFF" style={{ animation: "rc-twinkle 1.8s ease-in-out 0.8s infinite" }}></circle>
        <circle cx="214" cy="86" r="1.6" fill="#FFFFFF" style={{ animation: "rc-twinkle 2.2s ease-in-out 0.2s infinite" }}></circle>
        <circle cx="270" cy="112" r="1.2" fill="#FFFFFF" style={{ animation: "rc-twinkle 2s ease-in-out 1s infinite" }}></circle>
        <circle cx="102" cy="62" r="1.4" fill="#FFFFFF" style={{ animation: "rc-twinkle 2.6s ease-in-out 0.6s infinite" }}></circle>
        <circle cx="186" cy="30" r="1.2" fill="#FFFFFF" style={{ animation: "rc-twinkle 1.9s ease-in-out 1.2s infinite" }}></circle>
        <circle cx="22" cy="132" r="1.2" fill="#FFFFFF" style={{ animation: "rc-twinkle 2.3s ease-in-out 0.3s infinite" }}></circle>
        <circle cx="262" cy="156" r="1.4" fill="#FFFFFF" style={{ animation: "rc-twinkle 2.1s ease-in-out 0.9s infinite" }}></circle>
        <circle cx="246" cy="44" r="18" fill="#FFD23F"></circle>
        <circle cx="255" cy="37" r="16" fill="#0B1550"></circle>
        <rect x="16" y="16" width="100" height="38" rx="6" fill="#1E1E1E" stroke="#3A3A3A" strokeWidth="2"></rect>
        <text x="44" y="44" textAnchor="middle" fontFamily="Impact, Anton, sans-serif" fontSize="22" fill="#FA1A1D">03</text>
        <text x="59" y="43" textAnchor="middle" fontFamily="Impact, Anton, sans-serif" fontSize="22" fill="#FA1A1D" style={{ animation: "rc-cursor 1s steps(1) infinite" }}>:</text>
        <text x="74" y="44" textAnchor="middle" fontFamily="Impact, Anton, sans-serif" fontSize="22" fill="#FA1A1D">00</text>
        <text x="101" y="43" textAnchor="middle" fontFamily="Archivo, sans-serif" fontWeight="800" fontSize="10" fill="#FA1A1D">AM</text>
        <text x="144" y="84" textAnchor="middle" fontFamily="Impact, Anton, sans-serif" fontSize="22" letterSpacing="2" fill="#F4F4F4">HACK NIGHT</text>
        <rect x="0" y="198" width="288" height="48" fill="#6B3E26"></rect>
        <rect x="0" y="198" width="288" height="5" fill="#8A5433"></rect>
        <ellipse cx="144" cy="150" rx="92" ry="48" fill="#74D4F0" fillOpacity="0.12"></ellipse>
        <rect x="84" y="100" width="120" height="80" rx="6" fill="#1E1E1E" stroke="#D9D9D9" strokeWidth="4"></rect>
        <rect x="96" y="114" width="60" height="6" rx="3" fill="#74D4F0" style={{ transformOrigin: "96px 117px", animation: "rc-type 3.2s ease-out infinite" }}></rect>
        <rect x="104" y="128" width="78" height="6" rx="3" fill="#E2B5F0" style={{ transformOrigin: "104px 131px", animation: "rc-type 3.2s ease-out 0.4s infinite" }}></rect>
        <rect x="104" y="142" width="46" height="6" rx="3" fill="#BFEA88" style={{ transformOrigin: "104px 145px", animation: "rc-type 3.2s ease-out 0.8s infinite" }}></rect>
        <rect x="96" y="156" width="70" height="6" rx="3" fill="#74D4F0" style={{ transformOrigin: "96px 159px", animation: "rc-type 3.2s ease-out 1.2s infinite" }}></rect>
        <rect x="172" y="154" width="7" height="10" fill="#F4F4F4" style={{ animation: "rc-cursor 0.8s steps(1) infinite" }}></rect>
        <path d="M62 182 H226 L214 198 H74 Z" fill="#BDBDBD"></path>
        <g transform="translate(-6 138) scale(0.7)">
        <rect x="35" y="16" width="30" height="70" rx="7" fill="#2849CB"></rect>
        <rect x="37" y="12" width="26" height="8" rx="3" fill="#BDBDBD"></rect>
        <polygon points="54,26 42,50 50,50 45,74 60,44 51,44 57,26" fill="#FFD23F"></polygon>
        </g>
        <g transform="translate(20 138) scale(0.7)">
        <rect x="35" y="16" width="30" height="70" rx="7" fill="#FA1A1D"></rect>
        <rect x="37" y="12" width="26" height="8" rx="3" fill="#BDBDBD"></rect>
        <polygon points="54,26 42,50 50,50 45,74 60,44 51,44 57,26" fill="#FFFFFF"></polygon>
        </g>
        <g transform="translate(212 133) scale(0.8)">
        <path d="M31 24 Q17 24 20 37 Q23 46 33 46" stroke="#FFD23F" strokeWidth="5" fill="none"></path>
        <path d="M69 24 Q83 24 80 37 Q77 46 67 46" stroke="#FFD23F" strokeWidth="5" fill="none"></path>
        <path d="M31 18 H69 V32 Q69 56 50 58 Q31 56 31 32 Z" fill="#FFD23F"></path>
        <rect x="46" y="57" width="8" height="13" fill="#E0B400"></rect>
        <rect x="33" y="70" width="34" height="11" rx="2" fill="#3A2416"></rect>
        <text x="50" y="43" textAnchor="middle" fontFamily="Impact, Anton, sans-serif" fontSize="16" fill="#B8860B">#1</text>
        </g>
        </svg>
      );
    case "verimind":
      return (
        <svg className="rc-scene-svg" width="288" height="246" viewBox="0 0 288 246" aria-hidden="true" style={{ display: "block" }}>
        <rect width="288" height="246" fill="#0E4D34"></rect>
        <g stroke="#1F7A4D" strokeWidth="5" fill="none" strokeLinecap="round" strokeLinejoin="round">
        <path d="M0 70 H62 L84 92 H104"></path>
        <path d="M288 76 H226 L206 96 H184"></path>
        <path d="M0 196 H58 L80 174 H104"></path>
        <path d="M288 192 H228 L206 170 H184"></path>
        <path d="M144 58 V84"></path>
        <path d="M144 164 V246"></path>
        </g>
        <circle cx="0" cy="70" r="3.5" fill="#BFEA88" style={{ animation: "rc-run 2s linear infinite" }}></circle>
        <circle cx="0" cy="196" r="3.5" fill="#BFEA88" style={{ animation: "rc-run 2s linear 1s infinite" }}></circle>
        <g fill="#C9A227">
        <circle cx="104" cy="92" r="5"></circle>
        <circle cx="184" cy="96" r="5"></circle>
        <circle cx="104" cy="174" r="5"></circle>
        <circle cx="184" cy="170" r="5"></circle>
        <circle cx="144" cy="58" r="5"></circle>
        </g>
        <g fill="#BDBDBD">
        <rect x="114" y="76" width="6" height="10"></rect>
        <rect x="130" y="76" width="6" height="10"></rect>
        <rect x="146" y="76" width="6" height="10"></rect>
        <rect x="162" y="76" width="6" height="10"></rect>
        <rect x="114" y="162" width="6" height="10"></rect>
        <rect x="130" y="162" width="6" height="10"></rect>
        <rect x="146" y="162" width="6" height="10"></rect>
        <rect x="162" y="162" width="6" height="10"></rect>
        <rect x="96" y="96" width="10" height="6"></rect>
        <rect x="96" y="112" width="10" height="6"></rect>
        <rect x="96" y="128" width="10" height="6"></rect>
        <rect x="96" y="144" width="10" height="6"></rect>
        <rect x="182" y="96" width="10" height="6"></rect>
        <rect x="182" y="112" width="10" height="6"></rect>
        <rect x="182" y="128" width="10" height="6"></rect>
        <rect x="182" y="144" width="10" height="6"></rect>
        </g>
        <rect x="104" y="84" width="80" height="80" rx="6" fill="#1E1E1E"></rect>
        <circle cx="114" cy="94" r="3" fill="#3A3A3A"></circle>
        <text x="144" y="132" textAnchor="middle" fontFamily="Impact, Anton, sans-serif" fontSize="30" fill="#F4F4F4">AI</text>
        <text x="144" y="150" textAnchor="middle" fontFamily="Archivo, sans-serif" fontWeight="800" fontSize="8" letterSpacing="1.5" fill="#9A9A9A">VERIMIND</text>
        <g transform="translate(14 46)">
        <g style={{ animation: "rc-crawl 3s ease-in-out infinite alternate" }}>
        <g transform="rotate(90 20 20)">
        <path d="M13 16 L5 12 M12 22 L3 22 M13 28 L5 32 M27 16 L35 12 M28 22 L37 22 M27 28 L35 32" stroke="#3A3A3A" strokeWidth="2.5" strokeLinecap="round"></path>
        <ellipse cx="20" cy="23" rx="8" ry="10" fill="#8F86E8"></ellipse>
        <circle cx="20" cy="11" r="5" fill="#3A3A3A"></circle>
        </g>
        </g>
        </g>
        <g transform="translate(226 150)">
        <g style={{ animation: "rc-crawlBack 3.4s ease-in-out infinite alternate" }}>
        <g transform="rotate(-90 20 20)">
        <path d="M13 16 L5 12 M12 22 L3 22 M13 28 L5 32 M27 16 L35 12 M28 22 L37 22 M27 28 L35 32" stroke="#3A3A3A" strokeWidth="2.5" strokeLinecap="round"></path>
        <ellipse cx="20" cy="23" rx="8" ry="10" fill="#8F86E8"></ellipse>
        <circle cx="20" cy="11" r="5" fill="#3A3A3A"></circle>
        </g>
        </g>
        </g>
        <g transform="translate(34 118)">
        <path d="M13 16 L5 12 M12 22 L3 22 M13 28 L5 32 M27 16 L35 12 M28 22 L37 22 M27 28 L35 32" stroke="#3A3A3A" strokeWidth="2.5" strokeLinecap="round"></path>
        <ellipse cx="20" cy="23" rx="8" ry="10" fill="#8F86E8"></ellipse>
        <circle cx="20" cy="11" r="5" fill="#3A3A3A"></circle>
        <path d="M4 6 L36 38 M36 6 L4 38" stroke="#FA1A1D" strokeWidth="5" strokeLinecap="round" style={{ animation: "rc-twinkle 1.2s ease-in-out infinite" }}></path>
        </g>
        <g transform="translate(118 96)">
        <g style={{ animation: "rc-sweep 4s ease-in-out infinite" }}>
        <line x1="36" y1="36" x2="58" y2="58" stroke="#6B3E26" strokeWidth="9" strokeLinecap="round"></line>
        <circle cx="22" cy="22" r="20" fill="#74D4F0" fillOpacity="0.3" stroke="#D9D9D9" strokeWidth="6"></circle>
        </g>
        </g>
        <rect x="14" y="14" width="112" height="32" rx="6" fill="#FFD23F"></rect>
        <text x="70" y="37" textAnchor="middle" fontFamily="Impact, Anton, sans-serif" fontSize="20" fill="#0B1550">BUG HUNT</text>
        <text x="272" y="36" textAnchor="end" fontFamily="Archivo, sans-serif" fontWeight="800" fontSize="11" fill="#BFEA88">0 BUGS LEFT</text>
        </svg>
      );
    case "plant":
      return (
        <svg className="rc-scene-svg" width="288" height="246" viewBox="0 0 288 246" aria-hidden="true" style={{ display: "block" }}>
        <rect width="288" height="246" fill="#9ED8F0"></rect>
        <g style={{ animation: "rc-drift 7s ease-in-out infinite alternate" }}>
        <ellipse cx="170" cy="40" rx="26" ry="11" fill="#FFFFFF"></ellipse>
        <ellipse cx="186" cy="32" rx="16" ry="10" fill="#FFFFFF"></ellipse>
        </g>
        <g style={{ animation: "rc-drift 9s ease-in-out 1s infinite alternate-reverse" }}>
        <ellipse cx="236" cy="96" rx="20" ry="8" fill="#FFFFFF"></ellipse>
        <ellipse cx="248" cy="90" rx="12" ry="7" fill="#FFFFFF"></ellipse>
        </g>
        <g transform="translate(212 8) scale(0.66)">
        <g style={{ transformOrigin: "50px 50px", animation: "rc-spin 10s linear infinite" }}>
        <line x1="50" y1="6" x2="50" y2="18" stroke="#FFD23F" strokeWidth="6" strokeLinecap="round"></line>
        <line x1="50" y1="82" x2="50" y2="94" stroke="#FFD23F" strokeWidth="6" strokeLinecap="round"></line>
        <line x1="6" y1="50" x2="18" y2="50" stroke="#FFD23F" strokeWidth="6" strokeLinecap="round"></line>
        <line x1="82" y1="50" x2="94" y2="50" stroke="#FFD23F" strokeWidth="6" strokeLinecap="round"></line>
        <line x1="19" y1="19" x2="27" y2="27" stroke="#FFD23F" strokeWidth="6" strokeLinecap="round"></line>
        <line x1="73" y1="73" x2="81" y2="81" stroke="#FFD23F" strokeWidth="6" strokeLinecap="round"></line>
        <line x1="81" y1="19" x2="73" y2="27" stroke="#FFD23F" strokeWidth="6" strokeLinecap="round"></line>
        <line x1="27" y1="73" x2="19" y2="81" stroke="#FFD23F" strokeWidth="6" strokeLinecap="round"></line>
        </g>
        <circle cx="50" cy="50" r="24" fill="#FFD23F"></circle>
        <rect x="31" y="42" width="16" height="10" rx="4" fill="#1E1E1E"></rect>
        <rect x="53" y="42" width="16" height="10" rx="4" fill="#1E1E1E"></rect>
        <line x1="47" y1="45" x2="53" y2="45" stroke="#1E1E1E" strokeWidth="2.5"></line>
        <path d="M42 60 Q50 67 58 60" stroke="#1E1E1E" strokeWidth="2.5" fill="none" strokeLinecap="round"></path>
        </g>
        <rect x="14" y="14" width="138" height="32" rx="16" fill="#FFFFFF"></rect>
        <rect x="31" y="22" width="6" height="16" rx="1" fill="#FA1A1D"></rect>
        <rect x="26" y="27" width="16" height="6" rx="1" fill="#FA1A1D"></rect>
        <text x="94" y="36" textAnchor="middle" fontFamily="Impact, Anton, sans-serif" fontSize="17" fill="#0B1550">PLANT CLINIC</text>
        <rect x="0" y="198" width="288" height="48" fill="#5FA83F"></rect>
        <path d="M0 198 L8 188 L16 198 L24 190 L32 198 L40 187 L48 198 L56 190 L64 198 L72 188 L80 198 L88 191 L96 198 L104 188 L112 198 L120 190 L128 198 L136 187 L144 198 L152 190 L160 198 L168 188 L176 198 L184 191 L192 198 L200 188 L208 198 L216 190 L224 198 L232 187 L240 198 L248 190 L256 198 L264 188 L272 198 L280 191 L288 198 Z" fill="#7CC45A"></path>
        <g transform="translate(22 42) scale(0.8) rotate(18 50 50)">
        <path d="M32 40 Q43 18 54 40" stroke="#2F6B7D" strokeWidth="6" fill="none" strokeLinecap="round"></path>
        <path d="M24 40 H62 V78 Q62 83 57 83 H29 Q24 83 24 78 Z" fill="#2F9BD0"></path>
        <path d="M62 50 L86 34 L89 39 L64 60 Z" fill="#2F9BD0"></path>
        </g>
        <path d="M102 82 Q99 88 102 90 Q105 88 102 82 Z" fill="#2F9BD0" style={{ animation: "rc-fall 1.2s ease-in infinite" }}></path>
        <path d="M109 80 Q106 86 109 88 Q112 86 109 80 Z" fill="#2F9BD0" style={{ animation: "rc-fall 1.2s ease-in 0.4s infinite" }}></path>
        <path d="M114 84 Q111 90 114 92 Q117 90 114 84 Z" fill="#2F9BD0" style={{ animation: "rc-fall 1.2s ease-in 0.8s infinite" }}></path>
        <g transform="translate(88 100) scale(1.1)">
        <g style={{ transformOrigin: "50px 56px", animation: "rc-sway 2.4s ease-in-out infinite" }}>
        <ellipse cx="38" cy="36" rx="9" ry="18" fill="#7CC45A" transform="rotate(-30 38 36)"></ellipse>
        <ellipse cx="62" cy="36" rx="9" ry="18" fill="#7CC45A" transform="rotate(30 62 36)"></ellipse>
        <ellipse cx="50" cy="28" rx="8" ry="20" fill="#3F8A2A"></ellipse>
        </g>
        <path d="M30 58 H70 L64 86 H36 Z" fill="#E8943A"></path>
        <rect x="27" y="54" width="46" height="9" rx="3" fill="#D07A2A"></rect>
        <circle cx="43" cy="70" r="2.5" fill="#1E1E1E"></circle>
        <circle cx="57" cy="70" r="2.5" fill="#1E1E1E"></circle>
        <path d="M45 76 Q50 80 55 76" stroke="#1E1E1E" strokeWidth="2.2" fill="none" strokeLinecap="round"></path>
        </g>
        <g transform="translate(204 146) scale(0.52)">
        <path d="M50 12 Q86 30 76 66 Q66 88 50 90 Q34 88 24 66 Q14 30 50 12 Z" fill="#7CC45A"></path>
        <path d="M50 20 V52" stroke="#3F8A2A" strokeWidth="3"></path>
        <g transform="rotate(-28 50 42)">
        <rect x="28" y="35" width="44" height="14" rx="7" fill="#F2C9A0"></rect>
        <rect x="44" y="35" width="12" height="14" fill="#E3B386"></rect>
        </g>
        <path d="M38 64 Q41 61 44 64 M56 64 Q59 61 62 64" stroke="#1E1E1E" strokeWidth="2.4" fill="none" strokeLinecap="round"></path>
        <path d="M44 75 Q50 71 56 75" stroke="#1E1E1E" strokeWidth="2.4" fill="none" strokeLinecap="round"></path>
        </g>
        <g style={{ animation: "rc-bob 2s ease-in-out infinite" }}>
        <rect x="212" y="118" width="50" height="22" rx="11" fill="#FFFFFF"></rect>
        <path d="M226 138 L222 148 L236 139 Z" fill="#FFFFFF"></path>
        <text x="237" y="133" textAnchor="middle" fontFamily="Impact, Anton, sans-serif" fontSize="12" fill="#0B1550">ouch!</text>
        </g>
        </svg>
      );
    case "bunk":
      return (
        <svg className="rc-scene-svg" width="288" height="246" viewBox="0 0 288 246" aria-hidden="true" style={{ display: "block" }}>
        <defs>
        <pattern id="scStripes" width="18" height="18" patternUnits="userSpaceOnUse"><rect width="18" height="18" fill="#E2B5F0"></rect><rect width="9" height="18" fill="#D8A6E8"></rect></pattern>
        </defs>
        <rect width="288" height="246" fill="url(#scStripes)"></rect>
        <rect x="0" y="206" width="288" height="40" fill="#8A5433"></rect>
        <path d="M0 222 H288 M60 206 V222 M150 206 V222 M230 206 V222 M20 222 V246 M110 222 V246 M200 222 V246" stroke="#6B3E26" strokeWidth="2"></path>
        <rect x="20" y="22" width="92" height="72" rx="4" fill="#0B1550" stroke="#FFFFFF" strokeWidth="5"></rect>
        <circle cx="44" cy="40" r="9" fill="#FFD23F"></circle>
        <circle cx="48" cy="37" r="8" fill="#0B1550"></circle>
        <circle cx="88" cy="38" r="1.6" fill="#FFFFFF" style={{ animation: "rc-twinkle 2s ease-in-out infinite" }}></circle>
        <circle cx="96" cy="76" r="1.5" fill="#FFFFFF" style={{ animation: "rc-twinkle 2.4s ease-in-out 0.6s infinite" }}></circle>
        <circle cx="40" cy="80" r="1.3" fill="#FFFFFF" style={{ animation: "rc-twinkle 1.8s ease-in-out 1s infinite" }}></circle>
        <path d="M66 22 V94 M20 58 H112" stroke="#FFFFFF" strokeWidth="4"></path>
        <rect x="132" y="22" width="66" height="26" rx="4" fill="#F4F4F4" stroke="#6B3E26" strokeWidth="2"></rect>
        <text x="165" y="41" textAnchor="middle" fontFamily="Impact, Anton, sans-serif" fontSize="16" fill="#0B1550">B-101</text>
        <circle cx="224" cy="28" r="3" fill="#6B3E26"></circle>
        <g style={{ transformOrigin: "224px 28px", animation: "rc-key-swing 2.4s ease-in-out infinite" }}>
        <line x1="224" y1="28" x2="224" y2="40" stroke="#6B3E26" strokeWidth="2"></line>
        <circle cx="224" cy="47" r="7" stroke="#FFD23F" strokeWidth="4" fill="none"></circle>
        <rect x="222" y="53" width="4" height="22" fill="#FFD23F"></rect>
        <rect x="226" y="66" width="5" height="3" fill="#FFD23F"></rect>
        <rect x="226" y="71" width="4" height="3" fill="#FFD23F"></rect>
        </g>
        <g transform="translate(150 88) scale(1.3)">
        <rect x="16" y="14" width="7" height="74" rx="2" fill="#6B3E26"></rect>
        <rect x="77" y="14" width="7" height="74" rx="2" fill="#6B3E26"></rect>
        <rect x="23" y="36" width="54" height="9" rx="2" fill="#D9D9D9"></rect>
        <rect x="36" y="29" width="41" height="9" rx="3" fill="#FA1A1D"></rect>
        <rect x="25" y="28" width="11" height="8" rx="3" fill="#F4F4F4"></rect>
        <circle cx="31" cy="26" r="5.5" fill="#F2C9A0"></circle>
        <path d="M25.5 24 Q31 18 36.5 24" fill="#3A2416"></path>
        <rect x="23" y="68" width="54" height="9" rx="2" fill="#D9D9D9"></rect>
        <rect x="36" y="61" width="41" height="9" rx="3" fill="#2849CB"></rect>
        <rect x="25" y="60" width="11" height="8" rx="3" fill="#F4F4F4"></rect>
        <circle cx="31" cy="58" r="5.5" fill="#C98F5E"></circle>
        <path d="M25.5 56 Q31 50 36.5 56" fill="#1E1E1E"></path>
        </g>
        <text x="196" y="116" fontFamily="Impact, Anton, sans-serif" fontSize="14" fill="#0B1550" style={{ animation: "rc-z 2.4s ease-out infinite" }}>z</text>
        <text x="204" y="110" fontFamily="Impact, Anton, sans-serif" fontSize="10" fill="#0B1550" style={{ animation: "rc-z 2.4s ease-out 1.2s infinite" }}>z</text>
        <g style={{ transformOrigin: "60px 150px", animation: "rc-chatA 4s ease-in-out infinite" }}>
        <rect x="22" y="126" width="84" height="32" rx="14" fill="#74D4F0"></rect>
        <path d="M34 156 L30 168 L48 157 Z" fill="#74D4F0"></path>
        <text x="64" y="147" textAnchor="middle" fontFamily="Impact, Anton, sans-serif" fontSize="15" fill="#0B1550">roomie?</text>
        </g>
        <g style={{ transformOrigin: "110px 180px", animation: "rc-chatB 4s ease-in-out infinite" }}>
        <rect x="70" y="164" width="72" height="30" rx="14" fill="#FFFFFF"></rect>
        <path d="M130 192 L136 202 L120 193 Z" fill="#FFFFFF"></path>
        <text x="106" y="184" textAnchor="middle" fontFamily="Impact, Anton, sans-serif" fontSize="15" fill="#0B1550">yes!!</text>
        </g>
        </svg>
      );
    default:
      return null;
  }
}
