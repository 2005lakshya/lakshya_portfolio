import { live, output } from "@/components/projects/crate/crateSounds";

/**
 * Sound effects for the site, built the way VinHack builds its sounds: every
 * one is two small ingredients stacked.
 *
 *   transient   50ms of white noise through a narrow band, gone in a few tens
 *               of milliseconds: a click, a snap, a scrape of paper.
 *   tone        a short triangle wave sliding down in pitch as it fades: the
 *               body of the thing landing.
 *
 * Nothing here plays on its own. Every effect answers something the visitor
 * did (a grab, a drop, a tear, a click), never a scroll, which is what keeps
 * the page from nagging. They share the record crate's audio context and its
 * on/off switch, so one toggle silences the whole site.
 */

let noise: AudioBuffer | null = null;

function noiseBuffer(ac: AudioContext): AudioBuffer {
  if (!noise || noise.sampleRate !== ac.sampleRate) {
    const frames = Math.floor(ac.sampleRate * 0.05);
    noise = ac.createBuffer(1, frames, ac.sampleRate);
    const channel = noise.getChannelData(0);
    for (let i = 0; i < frames; i++) channel[i] = Math.random() * 2 - 1;
  }
  return noise;
}

type Transient = { gain: number; freq: number; q: number; decay: number; at?: number };
type Tone = { gain: number; from: number; to: number; decay: number; at?: number; type?: OscillatorType };

function transient(ac: AudioContext, { gain, freq, q, decay, at = 0 }: Transient) {
  const out = output();
  if (!out) return;
  const source = ac.createBufferSource();
  source.buffer = noiseBuffer(ac);
  const band = ac.createBiquadFilter();
  band.type = "bandpass";
  band.frequency.value = freq;
  band.Q.value = q;
  const level = ac.createGain();
  const t = ac.currentTime + at;
  // Exponential ramps cannot reach zero, so they land just under audibility.
  level.gain.setValueAtTime(gain, t);
  level.gain.exponentialRampToValueAtTime(0.0001, t + decay);
  source.connect(band).connect(level).connect(out);
  source.start(t);
  source.stop(t + decay + 0.02);
}

function tone(ac: AudioContext, { gain, from, to, decay, at = 0, type = "triangle" }: Tone) {
  const out = output();
  if (!out) return;
  const osc = ac.createOscillator();
  osc.type = type;
  const level = ac.createGain();
  const t = ac.currentTime + at;
  osc.frequency.setValueAtTime(from, t);
  osc.frequency.exponentialRampToValueAtTime(to, t + decay);
  level.gain.setValueAtTime(gain, t);
  level.gain.exponentialRampToValueAtTime(0.0001, t + decay);
  osc.connect(level).connect(out);
  osc.start(t);
  osc.stop(t + decay + 0.02);
}

const last: Record<string, number> = {};
/** At most one of `key` per `gap` seconds, so a burst of events can't turn into a buzz. */
function gate(ac: AudioContext, key: string, gap: number) {
  if (ac.currentTime - (last[key] ?? -1) < gap) return false;
  last[key] = ac.currentTime;
  return true;
}

/** A crumb of paper noise at a slightly random pitch; many of them make a rustle. */
function rustle(ac: AudioContext, { gain, freq, at, spread = 0.25 }: { gain: number; freq: number; at: number; spread?: number }) {
  transient(ac, { gain, freq: freq * (1 + (Math.random() * 2 - 1) * spread), q: 0.7 + Math.random() * 0.8, decay: 0.022 + Math.random() * 0.016, at });
}

/* ---------------------------------------------------------------- stickers */

/** A sticker lifted off the paper: a light, bright tick. */
export function playPeel() {
  const ac = live();
  if (!ac || !gate(ac, "peel", 0.06)) return;
  transient(ac, { gain: 0.14, freq: 4200, q: 1.6, decay: 0.022 });
  tone(ac, { gain: 0.05, from: 320, to: 180, decay: 0.03 });
}

/** Pressed back down, or stamped on: a soft pad hit. */
export function playSlap() {
  const ac = live();
  if (!ac || !gate(ac, "slap", 0.05)) return;
  transient(ac, { gain: 0.14, freq: 900, q: 0.7, decay: 0.03 });
  tone(ac, { gain: 0.14, from: 150, to: 58, decay: 0.1 });
}

/** Thrown away: a short sweep of paper going past. */
export function playWhoosh() {
  const ac = live();
  if (!ac || !gate(ac, "whoosh", 0.2)) return;
  const bursts = 7;
  for (let i = 0; i < bursts; i++) {
    const t = i / (bursts - 1);
    rustle(ac, { gain: 0.07 * (1 - t * 0.6), freq: 3600 * Math.pow(900 / 3600, t), at: t * 0.2 + Math.random() * 0.012 });
  }
}

/* ------------------------------------------------------------------ paper */

/** A sheet turned over or flicked to. */
export function playPaper() {
  const ac = live();
  if (!ac || !gate(ac, "paper", 0.3)) return;
  rustle(ac, { gain: 0.075, freq: 3600, at: 0 });
  const bursts = 6;
  for (let i = 0; i < bursts; i++) {
    const t = i / (bursts - 1);
    rustle(ac, { gain: 0.045 * (1 - t * 0.55), freq: 2800 * Math.pow(1100 / 2800, t), at: 0.02 + t * 0.17 + Math.random() * 0.015 });
  }
  tone(ac, { gain: 0.035, from: 190, to: 86, decay: 0.06, at: 0.19 });
}

/** A tab ripped off along its perforation. */
export function playTear() {
  const ac = live();
  if (!ac) return;
  transient(ac, { gain: 0.13, freq: 3400, q: 0.35, decay: 0.14 });
  transient(ac, { gain: 0.07, freq: 6200, q: 0.5, decay: 0.09, at: 0.02 });
  tone(ac, { gain: 0.05, from: 210, to: 84, decay: 0.13 });
}

/** One tick of a mechanism: a letter pencilled in, a sprocket, a switch. */
export function playTick() {
  const ac = live();
  if (!ac || !gate(ac, "tick", 0.03)) return;
  const wobble = 0.94 + Math.random() * 0.12;
  transient(ac, { gain: 0.09, freq: 1850 * wobble, q: 2.4, decay: 0.018 });
  tone(ac, { gain: 0.044, from: 168 * wobble, to: 120, decay: 0.024 });
}

/** A run of ticks ending in a clean cut: scissors round a coupon, a receipt feeding out. */
export function playRun(steps = 10, seconds = 1.2) {
  const ac = live();
  if (!ac) return;
  const gap = seconds / steps;
  for (let i = 0; i < steps; i++) {
    const wobble = 0.94 + Math.random() * 0.12;
    transient(ac, { gain: 0.09, freq: 1850 * wobble, q: 2.4, decay: 0.018, at: i * gap });
    tone(ac, { gain: 0.044, from: 168 * wobble, to: 120, decay: 0.024, at: i * gap });
  }
  transient(ac, { gain: 0.13, freq: 3400, q: 0.35, decay: 0.14, at: seconds });
  tone(ac, { gain: 0.05, from: 210, to: 84, decay: 0.13, at: seconds });
}

/** A switch clicked: the torch, a toggle. */
export function playClick() {
  const ac = live();
  if (!ac || !gate(ac, "click", 0.05)) return;
  transient(ac, { gain: 0.2, freq: 2900, q: 1.5, decay: 0.025 });
  tone(ac, { gain: 0.13, from: 230, to: 88, decay: 0.055 });
}

/** The film strip winding on a few frames. */
export function playFilm() {
  const ac = live();
  if (!ac || !gate(ac, "film", 0.3)) return;
  const count = 12;
  for (let i = 0; i < count; i++) {
    const p = i / count;
    const wobble = 0.94 + Math.random() * 0.12;
    transient(ac, { gain: 0.06 * (1 - p * 0.45), freq: 2750 * wobble, q: 2.4, decay: 0.016, at: Math.pow(p, 1.2) * 0.9 });
  }
  transient(ac, { gain: 0.2, freq: 2200, q: 0.9, decay: 0.03, at: 0.95 });
  tone(ac, { gain: 0.12, from: 240, to: 96, decay: 0.06, at: 0.95 });
}

/** A little three-note chirp, for something that worked. */
export function playChirp() {
  const ac = live();
  if (!ac) return;
  tone(ac, { gain: 0.05, from: 523.25, to: 659.25, decay: 0.06, at: 0, type: "sine" });
  tone(ac, { gain: 0.06, from: 659.25, to: 783.99, decay: 0.08, at: 0.05, type: "sine" });
  tone(ac, { gain: 0.07, from: 783.99, to: 1046.5, decay: 0.12, at: 0.1, type: "sine" });
}
