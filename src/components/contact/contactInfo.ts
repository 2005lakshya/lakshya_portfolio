import { contactData } from "@/data/portfolio";

// How to reach Lakshya: shared by the Contact section and the poster wall in the 3D room.
export const EMAIL = contactData.email;
export const PHONE = contactData.phone;
export const LINKEDIN = `linkedin.com/in/${contactData.linkedin}`;
export const GITHUB = `github.com/${contactData.github}`;

export const TABS = [
  { label: EMAIL, copy: EMAIL },
  { label: "+91 85290 75860", copy: PHONE },
  { label: `in/${contactData.linkedin}`, copy: LINKEDIN },
  { label: GITHUB, copy: GITHUB },
  // Already torn off, like on any flyer that has been up for a week.
  { label: EMAIL, copy: EMAIL, gone: true },
  { label: "Resume (PDF)", copy: `${window.location.origin}/Lakshya_Gupta_Resume.pdf` },
];

export const WORDS = [
  { w: "EMAIL", r: 0, c: 0, dir: "down", n: 1, clue: "Where to write to me", value: EMAIL, href: `mailto:${EMAIL}` },
  { w: "GITHUB", r: 3, c: 6, dir: "down", n: 2, clue: "Where my code lives", value: GITHUB, href: `https://${GITHUB}` },
  { w: "LINKEDIN", r: 4, c: 0, dir: "across", n: 3, clue: "Where to network with me", value: LINKEDIN, href: `https://${LINKEDIN}` },
  { w: "PHONE", r: 5, c: 10, dir: "down", n: 4, clue: "Ring me on it", value: "+91 85290 75860", href: "tel:+918529075860" },
  { w: "GURGAON", r: 7, c: 5, dir: "across", n: 5, clue: "My home city", value: contactData.location, href: "" },
] as const;
export const FILL_ORDER = ["EMAIL", "LINKEDIN", "GITHUB", "GURGAON", "PHONE"];

export type Cell = { r: number; c: number; ch: string; num: number | ""; words: { w: string; i: number }[] };
export const CELLS: Cell[] = (() => {
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

/** Sends a message through Web3Forms. Never throws; says what went wrong in words a visitor can act on. */
export async function sendMessage(message: string, email: string): Promise<{ ok: boolean; error: string }> {
  const key = import.meta.env.VITE_WEB3FORMS_ACCESS_KEY || "";
  if (!key) return { ok: false, error: `Messages can't be sent from here right now. Write to ${EMAIL} instead.` };
  try {
    const res = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({ access_key: key, subject: "New message from the portfolio wall", from_name: "Portfolio contact", email, message }),
    });
    const data = await res.json();
    if (data.success) return { ok: true, error: "" };
    return { ok: false, error: data.message || `That didn't go through. Write to ${EMAIL} instead.` };
  } catch {
    return { ok: false, error: `Network trouble. Write to ${EMAIL} instead.` };
  }
}
