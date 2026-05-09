import React from "react";

export interface KeyData {
  id: string;
  label: string;
  color: string;
  shadowColor: string;
  sideColor: string;
  icon: React.ReactNode;
  description: string;
  keyboardKey?: string;
}

export const keys: KeyData[] = [
  {
    id: "c",
    label: "C",
    color: "#1a2c42",
    shadowColor: "#0d1621",
    sideColor: "#132131",
    keyboardKey: "c",
    description: "The mother of all languages ⚡",
    icon: (
      <svg viewBox="0 0 32 32" className="w-8 h-8">
        <text x="16" y="22" textAnchor="middle" fontSize="18" fontWeight="bold" fill="#a0c4ff" fontFamily="sans-serif">C</text>
      </svg>
    ),
  },
  {
    id: "cpp",
    label: "C++",
    color: "#004482",
    shadowColor: "#002241",
    sideColor: "#003361",
    keyboardKey: "+",
    description: "C with classes, and a lot more 🚀",
    icon: (
      <svg viewBox="0 0 32 32" className="w-8 h-8">
        <text x="16" y="22" textAnchor="middle" fontSize="14" fontWeight="bold" fill="#a0c4ff" fontFamily="sans-serif">C++</text>
      </svg>
    ),
  },
  {
    id: "javascript",
    label: "JavaScript",
    color: "#8a6a00",
    shadowColor: "#4d3a00",
    sideColor: "#3a2c00",
    keyboardKey: "j",
    description: "The chaotic backbone of the web 🟨",
    icon: (
      <svg viewBox="0 0 32 32" className="w-8 h-8">
        <rect width="32" height="32" rx="4" fill="#f7df1e" />
        <text x="16" y="23" textAnchor="middle" fontSize="13" fontWeight="700" fill="#222" fontFamily="monospace">JS</text>
      </svg>
    ),
  },
  {
    id: "nodejs",
    label: "Node.js",
    color: "#1a5c1a",
    shadowColor: "#0d3a0d",
    sideColor: "#092b09",
    keyboardKey: "n",
    description: "JS on the server, legend status 🟢",
    icon: (
      <svg viewBox="0 0 32 32" fill="none" className="w-8 h-8">
        <path d="M16 4L5 10.5v11L16 28l11-6.5v-11z" fill="#339933" />
        <path d="M16 4l11 6.5-11 6.5-11-6.5z" fill="#5fba47" />
        <text x="16" y="21" textAnchor="middle" fontSize="7" fontWeight="700" fill="white" fontFamily="sans-serif">node</text>
      </svg>
    ),
  },
  {
    id: "mysql",
    label: "MySQL",
    color: "#004e6e",
    shadowColor: "#002737",
    sideColor: "#003a52",
    keyboardKey: "m",
    description: "The most popular open-source SQL database 🐬",
    icon: (
      <svg viewBox="0 0 32 32" className="w-8 h-8">
        <ellipse cx="16" cy="10" rx="10" ry="4" fill="none" stroke="#f29111" strokeWidth="2" />
        <path d="M6 10 v12 A 10 4 0 0 0 26 22 V 10" fill="none" stroke="#00758f" strokeWidth="2" />
        <text x="16" y="19" textAnchor="middle" fontSize="8" fontWeight="bold" fill="#00758f" fontFamily="sans-serif">SQL</text>
      </svg>
    ),
  },
  {
    id: "flutter",
    label: "Flutter",
    color: "#034a78",
    shadowColor: "#01253c",
    sideColor: "#02375a",
    keyboardKey: "f",
    description: "UI toolkit for beautiful natively compiled apps 📱",
    icon: (
      <svg viewBox="0 0 32 32" className="w-8 h-8">
        <path d="M18 4 L8 14 L12 18 L26 4 Z" fill="#42a5f5" />
        <path d="M13 19 L8 24 L18 34 L26 26 Z" fill="#0d47a1" />
        <path d="M13 19 L18 24 L26 16 L21 11 Z" fill="#1976d2" />
      </svg>
    ),
  },
  {
    id: "react",
    label: "React",
    color: "#0e4f6b",
    shadowColor: "#072d3d",
    sideColor: "#061f2b",
    keyboardKey: "r",
    description: "The UI library everything is built on ⚛️",
    icon: (
      <svg viewBox="0 0 32 32" fill="none" className="w-8 h-8">
        <ellipse cx="16" cy="16" rx="12" ry="5" stroke="#61dafb" strokeWidth="1.5" fill="none" />
        <ellipse cx="16" cy="16" rx="12" ry="5" stroke="#61dafb" strokeWidth="1.5" fill="none" transform="rotate(60 16 16)" />
        <ellipse cx="16" cy="16" rx="12" ry="5" stroke="#61dafb" strokeWidth="1.5" fill="none" transform="rotate(120 16 16)" />
        <circle cx="16" cy="16" r="2.5" fill="#61dafb" />
      </svg>
    ),
  },
  {
    id: "python",
    label: "Python",
    color: "#1d2e3f",
    shadowColor: "#0e171f",
    sideColor: "#16222f",
    keyboardKey: "p",
    description: "Executable pseudocode 🐍",
    icon: (
      <svg viewBox="0 0 32 32" className="w-8 h-8">
        <path d="M16 4 c -4 0 -4 2 -4 2 v 4 h 8 v 2 h -8 c -4 0 -6 2 -6 6 c 0 4 2 6 6 6 h 2 v -4 c 0 -3 2 -5 5 -5 h 5 c 2 0 2 -2 2 -2 v -4 c 0 -4 -2 -5 -6 -5 z" fill="#3776ab" />
        <path d="M16 28 c 4 0 4 -2 4 -2 v -4 h -8 v -2 h 8 c 4 0 6 -2 6 -6 c 0 -4 -2 -6 -6 -6 h -2 v 4 c 0 3 -2 5 -5 5 h -5 c -2 0 -2 2 -2 2 v 4 c 0 4 2 5 6 5 z" fill="#ffd43b" />
        <circle cx="12" cy="7" r="1" fill="white" />
        <circle cx="20" cy="25" r="1" fill="white" />
      </svg>
    ),
  },
  {
    id: "java",
    label: "Java",
    color: "#6b3e00",
    shadowColor: "#351f00",
    sideColor: "#502e00",
    keyboardKey: "v",
    description: "Write once, run anywhere ☕",
    icon: (
      <svg viewBox="0 0 32 32" className="w-8 h-8">
        <path d="M8 20 c 0 4 4 6 10 6 c 4 0 8 -2 8 -6 v -2 h -18 z" fill="#f89820" />
        <path d="M12 16 c -2 -4 2 -6 2 -10 c -4 4 -2 8 -2 10" fill="#5382a1" />
        <path d="M16 18 c -2 -4 2 -6 2 -10 c -4 4 -2 8 -2 10" fill="#5382a1" />
        <path d="M20 16 c -2 -4 2 -6 2 -10 c -4 4 -2 8 -2 10" fill="#5382a1" />
      </svg>
    ),
  },
  {
    id: "typescript",
    label: "TypeScript",
    color: "#1c4a7e",
    shadowColor: "#0d2a4a",
    sideColor: "#091e35",
    keyboardKey: "t",
    description: "JavaScript with a safety net 🔷",
    icon: (
      <svg viewBox="0 0 32 32" className="w-8 h-8">
        <rect width="32" height="32" rx="4" fill="#3178c6" />
        <text x="16" y="23" textAnchor="middle" fontSize="13" fontWeight="700" fill="white" fontFamily="monospace">TS</text>
      </svg>
    ),
  },
  {
    id: "postgresql",
    label: "Postgres",
    color: "#1a3a5c",
    shadowColor: "#0d1f33",
    sideColor: "#091525",
    keyboardKey: "q",
    description: "The GOAT open-source SQL database 🐘",
    icon: (
      <svg viewBox="0 0 32 32" fill="none" className="w-8 h-8">
        <ellipse cx="15" cy="13" rx="9" ry="10" fill="#336791" />
        <ellipse cx="15" cy="10" rx="6" ry="3.5" fill="#fff" opacity="0.15" />
        <circle cx="21" cy="8" r="3" fill="#336791" stroke="#fff" strokeWidth="1" />
        <path d="M21 8c0 4-2 10-6 12" stroke="#fff" strokeWidth="1" strokeLinecap="round" fill="none" />
        <path d="M9 19c1 3 3 4.5 6 4.5" stroke="#fff" strokeWidth="1" strokeLinecap="round" fill="none" />
      </svg>
    ),
  },
  {
    id: "mongodb",
    label: "MongoDB",
    color: "#0f3d1a",
    shadowColor: "#08200e",
    sideColor: "#06180a",
    keyboardKey: "o",
    description: "NoSQL document store, schema-less life 🍃",
    icon: (
      <svg viewBox="0 0 32 32" fill="none" className="w-8 h-8">
        <path d="M16 3C16 3 9 10 9 18a7 7 0 0014 0C23 10 16 3 16 3z" fill="#4db33d" />
        <path d="M16 3v24" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    id: "nextjs",
    label: "Next.js",
    color: "#1a1a2e",
    shadowColor: "#000000",
    sideColor: "#0d0d1a",
    keyboardKey: "x",
    description: "React framework for production — your main stack 🚀",
    icon: (
      <svg viewBox="0 0 32 32" fill="none" className="w-8 h-8">
        <circle cx="16" cy="16" r="13" fill="#000" />
        <circle cx="16" cy="16" r="13" fill="none" stroke="#333" strokeWidth="1" />
        <path d="M10 22V10l14 14.5" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M10 10h7" stroke="white" strokeWidth="2.2" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    id: "fastapi",
    label: "FastAPI",
    color: "#025c50",
    shadowColor: "#012e28",
    sideColor: "#01453c",
    keyboardKey: "i",
    description: "High performance Python web framework 🚀",
    icon: (
      <svg viewBox="0 0 32 32" className="w-8 h-8">
        <circle cx="16" cy="16" r="14" fill="#009688" />
        <path d="M16 6 L6 18 H15 L14 26 L26 14 H17 L18 6 Z" fill="white" />
      </svg>
    ),
  },
  {
    id: "figma",
    label: "Figma",
    color: "#1c1c1c",
    shadowColor: "#0a0a0a",
    sideColor: "#141414",
    keyboardKey: "g",
    description: "Where the design magic happens 🎨",
    icon: (
      <svg viewBox="0 0 32 32" className="w-8 h-8">
        <circle cx="12" cy="8" r="4" fill="#f24e1e" />
        <path d="M16 4 h 4 a 4 4 0 0 1 0 8 h -4 z" fill="#ff7262" />
        <path d="M12 12 h 4 v 8 h -4 z" fill="#a259ff" />
        <circle cx="20" cy="16" r="4" fill="#1abc9c" />
        <circle cx="12" cy="24" r="4" fill="#0acf83" />
      </svg>
    ),
  },
  {
    id: "tailwind",
    label: "Tailwind",
    color: "#0b5c6e",
    shadowColor: "#063440",
    sideColor: "#042530",
    keyboardKey: "w",
    description: "Utility-first CSS framework 🌊",
    icon: (
      <svg viewBox="0 0 32 32" fill="none" className="w-8 h-8">
        <path d="M7 14c1.3-5.3 4.7-8 10-8-2.7 5.3-.7 8 6 8-4 5.3-7.3 8-10 8C7.7 22 6 18.7 7 14z" fill="#38bdf8" />
        <path d="M19 22c1.3-5.3 4.7-8 10-8-2.7 5.3-.7 8 6 8-4 5.3-7.3 8-10 8C19.7 30 18 26.7 19 22z" fill="#38bdf8" opacity="0.6" />
      </svg>
    ),
  },
  {
    id: "firebase",
    label: "Firebase",
    color: "#6b4b00",
    shadowColor: "#352500",
    sideColor: "#503800",
    keyboardKey: "b",
    description: "Backend as a Service by Google 🔥",
    icon: (
      <svg viewBox="0 0 32 32" className="w-8 h-8">
        <path d="M6 24 L16 30 L26 24 L22 6 L18 14 L16 10 L10 20 Z" fill="#ffa000" />
        <path d="M6 24 L10 20 L16 30 Z" fill="#f57c00" />
        <path d="M26 24 L22 6 L16 30 Z" fill="#ffca28" />
      </svg>
    ),
  },
  {
    id: "expressjs",
    label: "Express",
    color: "#111827",
    shadowColor: "#060b14",
    sideColor: "#04080f",
    keyboardKey: "e",
    description: "Minimal Node.js web framework ⚡",
    icon: (
      <svg viewBox="0 0 32 32" className="w-8 h-8">
        <text x="16" y="19" textAnchor="middle" fontSize="10" fontWeight="600" fill="white" fontFamily="monospace">ex</text>
      </svg>
    ),
  },
  {
    id: "git",
    label: "Git",
    color: "#8a2a0f",
    shadowColor: "#4d1508",
    sideColor: "#3a1006",
    keyboardKey: "k",
    description: "The code's personal bodyguard, no cap! 🔀",
    icon: (
      <svg viewBox="0 0 32 32" fill="none" className="w-8 h-8">
        <path d="M28 14.6l-10.6-10.6a2 2 0 00-2.8 0l-2.3 2.3 2.9 2.9a2.4 2.4 0 013 3l2.8 2.8a2.4 2.4 0 11-1.4 1.4l-2.6-2.6v6.8a2.4 2.4 0 11-2 0V13.7a2.4 2.4 0 01-1.3-3.1L9.3 7.7 4 13a2 2 0 000 2.8l10.6 10.6a2 2 0 002.8 0L28 15.4a2 2 0 000-2.8z" fill="#f05032" />
      </svg>
    ),
  },
  {
    id: "kotlin",
    label: "Kotlin",
    color: "#7F52FF",
    shadowColor: "#3F297F",
    sideColor: "#5F3DBF",
    keyboardKey: "l",
    description: "Modern language for Android development 🤖",
    icon: (
      <svg viewBox="0 0 32 32" fill="none" className="w-8 h-8">
        <path d="M32 32H0V0h32L16 16z" fill="url(#kotlin_grad)" />
        <defs>
          <linearGradient id="kotlin_grad" x1="32" y1="0" x2="0" y2="32" gradientUnits="userSpaceOnUse">
            <stop stopColor="#E44857" />
            <stop offset="0.469" stopColor="#C711E1" />
            <stop offset="1" stopColor="#7F52FF" />
          </linearGradient>
        </defs>
      </svg>
    ),
  },
];

export const rows: string[][] = [
  ["c", "cpp", "javascript", "nodejs", "mysql"],
  ["flutter", "react", "python", "java", "typescript"],
  ["postgresql", "mongodb", "nextjs", "fastapi", "figma"],
  ["tailwind", "firebase", "expressjs", "git", "kotlin"],
];
