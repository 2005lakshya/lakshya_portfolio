import type { SceneKind } from "./crateData";

/**
 * Sound effects for the record crate, synthesised with the Web Audio API so no
 * audio files ship with the site.
 *
 * Browsers keep audio locked until the visitor clicks or presses a key, so the
 * context is only created and resumed on that first gesture (`installUnlock`).
 * Until then, and whenever the visitor has switched sound off, every effect
 * below is a silent no-op.
 */

export type SoundState = { enabled: boolean; unlocked: boolean };

const PREF_KEY = "portfolio-sound";

let ctx: AudioContext | null = null;
let master: GainNode | null = null;
let noise: AudioBuffer | null = null;
let crackleBuffer: AudioBuffer | null = null;
let crackle: { src: AudioBufferSourceNode; gain: GainNode } | null = null;
let lastFlick = 0;

let enabled = readPref();
let unlocked = false;
const listeners = new Set<(state: SoundState) => void>();

function readPref(): boolean {
  try {
    return window.localStorage.getItem(PREF_KEY) !== "off";
  } catch {
    return true;
  }
}

function emit() {
  const state = { enabled, unlocked };
  listeners.forEach((fn) => fn(state));
}

export function getSoundState(): SoundState {
  return { enabled, unlocked };
}

export function subscribeSound(fn: (state: SoundState) => void): () => void {
  listeners.add(fn);
  return () => {
    listeners.delete(fn);
  };
}

export function setSoundEnabled(on: boolean) {
  enabled = on;
  try {
    window.localStorage.setItem(PREF_KEY, on ? "on" : "off");
  } catch {
    // Private windows can refuse storage; the choice still holds for this visit.
  }
  if (!on) stopCrackle();
  emit();
}

function ensureContext(): AudioContext | null {
  if (ctx) return ctx;
  const Ctor = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!Ctor) return null;
  ctx = new Ctor();
  master = ctx.createGain();
  master.gain.value = 0.55;
  master.connect(ctx.destination);

  noise = ctx.createBuffer(1, ctx.sampleRate, ctx.sampleRate);
  const white = noise.getChannelData(0);
  for (let i = 0; i < white.length; i++) white[i] = Math.random() * 2 - 1;

  crackleBuffer = makeCrackle(ctx);
  return ctx;
}

/** Three seconds of surface noise: faint hiss with scattered pops, looped while a record plays. */
function makeCrackle(c: AudioContext): AudioBuffer {
  const buffer = c.createBuffer(1, c.sampleRate * 3, c.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < data.length; i++) data[i] += (Math.random() * 2 - 1) * 0.01;
  for (let i = 0; i < data.length; i++) {
    const roll = Math.random();
    if (roll > 0.0007) continue;
    const big = roll < 0.00005;
    const amp = (big ? 0.7 : 0.18 + Math.random() * 0.3) * (Math.random() < 0.5 ? -1 : 1);
    const length = big ? 180 : 40 + Math.floor(Math.random() * 60);
    for (let k = 0; k < length && i + k < data.length; k++) data[i + k] += amp * Math.exp(-k / (length / 5));
  }
  return buffer;
}

/** Starts listening for the visitor's first click or key press, which unlocks audio. */
export function installUnlock(): () => void {
  const unlock = () => {
    const c = ensureContext();
    remove();
    if (!c) return;
    c.resume().then(() => {
      unlocked = c.state === "running";
      emit();
    });
  };
  const remove = () => {
    window.removeEventListener("pointerdown", unlock);
    window.removeEventListener("keydown", unlock);
  };
  if (unlocked) return () => {};
  window.addEventListener("pointerdown", unlock, { passive: true });
  window.addEventListener("keydown", unlock);
  return remove;
}

/** The running context, or null when sound is off or still locked. */
export function live(): AudioContext | null {
  if (!enabled || !ctx || !master || ctx.state !== "running") return null;
  return ctx;
}

/** The output every effect connects to; the rest of the site's sounds share it. */
export function output(): GainNode | null {
  return master;
}

export function envelope(c: AudioContext, peak: number, attack: number, decay: number, at = c.currentTime): GainNode {
  const g = c.createGain();
  g.gain.setValueAtTime(0.0001, at);
  g.gain.exponentialRampToValueAtTime(peak, at + attack);
  g.gain.exponentialRampToValueAtTime(0.0001, at + attack + decay);
  return g;
}

export function noiseBurst(c: AudioContext, opts: { at?: number; type: BiquadFilterType; freq: number; q?: number; peak: number; attack: number; decay: number }) {
  const at = opts.at ?? c.currentTime;
  const src = c.createBufferSource();
  src.buffer = noise;
  const filter = c.createBiquadFilter();
  filter.type = opts.type;
  filter.frequency.value = opts.freq;
  filter.Q.value = opts.q ?? 1;
  const g = envelope(c, opts.peak, opts.attack, opts.decay, at);
  src.connect(filter).connect(g).connect(master!);
  src.start(at, Math.random() * 0.5, opts.attack + opts.decay + 0.05);
  return filter;
}

export function tone(c: AudioContext, opts: { at?: number; type?: OscillatorType; from: number; to?: number; glide?: number; peak: number; attack: number; decay: number }) {
  const at = opts.at ?? c.currentTime;
  const osc = c.createOscillator();
  osc.type = opts.type ?? "sine";
  osc.frequency.setValueAtTime(opts.from, at);
  if (opts.to) osc.frequency.exponentialRampToValueAtTime(opts.to, at + (opts.glide ?? opts.decay));
  const g = envelope(c, opts.peak, opts.attack, opts.decay, at);
  osc.connect(g).connect(master!);
  osc.start(at);
  osc.stop(at + opts.attack + opts.decay + 0.05);
}

/* ------------------------------------------------------------- the crate */

/** A sleeve flicked past while digging through the crate. */
export function playFlick() {
  const c = live();
  if (!c || c.currentTime - lastFlick < 0.03) return;
  lastFlick = c.currentTime;
  noiseBurst(c, { type: "bandpass", freq: 1800 + Math.random() * 900, q: 1.2, peak: 0.35, attack: 0.004, decay: 0.07 });
}

/** A record sliding out of its sleeve. */
export function playSlide() {
  const c = live();
  if (!c) return;
  const f = noiseBurst(c, { type: "lowpass", freq: 400, q: 0.7, peak: 0.22, attack: 0.08, decay: 0.3 });
  f.frequency.exponentialRampToValueAtTime(2600, c.currentTime + 0.35);
}

/** The stylus touching down: a low thump with a click on top. */
export function playNeedleDrop() {
  const c = live();
  if (!c) return;
  tone(c, { from: 95, to: 42, glide: 0.14, peak: 0.5, attack: 0.004, decay: 0.2 });
  noiseBurst(c, { type: "bandpass", freq: 3200, q: 0.9, peak: 0.25, attack: 0.002, decay: 0.03 });
}

/** The tonearm lifting off. */
export function playArmLift() {
  const c = live();
  if (!c) return;
  noiseBurst(c, { type: "highpass", freq: 2500, peak: 0.2, attack: 0.002, decay: 0.02 });
  tone(c, { from: 620, to: 500, peak: 0.06, attack: 0.003, decay: 0.05 });
}

/** The platter running down after Stop. */
export function playWindDown() {
  const c = live();
  if (!c) return;
  const osc = c.createOscillator();
  osc.type = "sawtooth";
  osc.frequency.setValueAtTime(220, c.currentTime);
  osc.frequency.exponentialRampToValueAtTime(32, c.currentTime + 0.7);
  const lp = c.createBiquadFilter();
  lp.type = "lowpass";
  lp.frequency.value = 900;
  const g = envelope(c, 0.1, 0.01, 0.7);
  osc.connect(lp).connect(g).connect(master!);
  osc.start();
  osc.stop(c.currentTime + 0.8);
}

/** Surface noise that runs for as long as a record is spinning. */
export function startCrackle() {
  const c = live();
  if (!c || crackle || !crackleBuffer) return;
  const src = c.createBufferSource();
  src.buffer = crackleBuffer;
  src.loop = true;
  const gain = c.createGain();
  gain.gain.setValueAtTime(0.0001, c.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.5, c.currentTime + 0.4);
  src.connect(gain).connect(master!);
  src.start();
  crackle = { src, gain };
}

export function stopCrackle() {
  if (!crackle || !ctx) return;
  const { src, gain } = crackle;
  crackle = null;
  const now = ctx.currentTime;
  gain.gain.cancelScheduledValues(now);
  gain.gain.setValueAtTime(Math.max(gain.gain.value, 0.0001), now);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.25);
  src.stop(now + 0.3);
}

/* ------------------------------------------------------------- the cover */

/** The cover turning over. */
export function playFlip() {
  const c = live();
  if (!c) return;
  const f = noiseBurst(c, { type: "bandpass", freq: 500, q: 0.8, peak: 0.22, attack: 0.1, decay: 0.2 });
  f.frequency.exponentialRampToValueAtTime(3500, c.currentTime + 0.3);
}

/** One short sound per project, played as its scene comes round on the back of the cover. */
export function playTheme(kind: SceneKind) {
  const c = live();
  if (!c) return;
  const t = c.currentTime;
  switch (kind) {
    case "messit": {
      // The mess bell.
      tone(c, { from: 1318.5, peak: 0.22, attack: 0.005, decay: 1.2 });
      tone(c, { from: 2637, peak: 0.08, attack: 0.005, decay: 0.8 });
      tone(c, { from: 3951, peak: 0.04, attack: 0.005, decay: 0.5 });
      break;
    }
    case "robowars": {
      // Steel on steel.
      [523, 1240, 1990, 2870].forEach((f, i) => tone(c, { from: f * (0.98 + Math.random() * 0.04), peak: 0.14 / (i + 1), attack: 0.002, decay: 0.6 - i * 0.1 }));
      noiseBurst(c, { type: "highpass", freq: 1500, peak: 0.3, attack: 0.002, decay: 0.06 });
      break;
    }
    case "hackx": {
      // A burst of typing.
      let at = t;
      for (let i = 0; i < 9; i++) {
        at += 0.05 + Math.random() * 0.07;
        noiseBurst(c, { at, type: "highpass", freq: 2000 + Math.random() * 1500, peak: 0.18 + Math.random() * 0.12, attack: 0.002, decay: 0.012 });
      }
      break;
    }
    case "verimind": {
      // A bug hitting the zapper.
      const osc = c.createOscillator();
      osc.type = "square";
      osc.frequency.setValueAtTime(120, t);
      const wobble = c.createOscillator();
      wobble.frequency.value = 38;
      const depth = c.createGain();
      depth.gain.value = 60;
      wobble.connect(depth).connect(osc.frequency);
      const bp = c.createBiquadFilter();
      bp.type = "bandpass";
      bp.frequency.value = 1500;
      const g = envelope(c, 0.12, 0.005, 0.28);
      osc.connect(bp).connect(g).connect(master!);
      osc.start(t);
      wobble.start(t);
      osc.stop(t + 0.35);
      wobble.stop(t + 0.35);
      break;
    }
    case "plant": {
      // Three water drops.
      for (let i = 0; i < 3; i++) tone(c, { at: t + i * 0.18, from: 1400 - i * 120, to: 480, glide: 0.08, peak: 0.22, attack: 0.003, decay: 0.12 });
      break;
    }
    case "bunk": {
      // "roomie?" then "yes!!".
      tone(c, { at: t, from: 880, peak: 0.18, attack: 0.004, decay: 0.09 });
      tone(c, { at: t + 0.14, from: 1320, peak: 0.18, attack: 0.004, decay: 0.12 });
      break;
    }
  }
}
