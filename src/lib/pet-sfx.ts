type SfxName = "tick" | "boop" | "pop";

const FREQ: Record<SfxName, number> = {
  tick: 660,
  boop: 560,
  pop: 900,
};

const STORAGE_KEY = "menagerie-sound";

type SoundMode = "soft" | "off";

let ctx: AudioContext | null = null;
let mode: SoundMode = "soft";

function readStoredMode(): SoundMode {
  try {
    const v = localStorage.getItem(STORAGE_KEY);
    if (v === "off" || v === "soft") return v;
  } catch {
    /* ignore */
  }
  return "soft";
}

function ensureCtx(): AudioContext | null {
  if (typeof window === "undefined") return null;
  try {
    const AC =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext })
        .webkitAudioContext;
    if (!ctx) {
      ctx = new AC();
      // warm-up blip (inaudible) so first real sfx isn't delayed
      const g = ctx.createGain();
      g.gain.value = 1e-4;
      const o = ctx.createOscillator();
      o.connect(g).connect(ctx.destination);
      o.start();
      o.stop(ctx.currentTime + 0.03);
    }
    if (ctx.state === "suspended") void ctx.resume();
    return ctx;
  } catch {
    return null;
  }
}

function playTone(name: SfxName, audio: AudioContext) {
  const soft = mode === "soft";
  const t0 = audio.currentTime + 0.01;
  const osc = audio.createOscillator();
  const gain = audio.createGain();
  const freq = FREQ[name] * (soft ? 0.8 : 1);

  osc.type = soft ? "sine" : "triangle";
  osc.frequency.setValueAtTime(freq, t0);

  const peak = soft ? 0.04 : 0.055;
  const dur = soft ? 0.1 : 0.07;
  gain.gain.setValueAtTime(0, t0);
  gain.gain.linearRampToValueAtTime(peak, t0 + 0.004);
  gain.gain.exponentialRampToValueAtTime(1e-4, t0 + dur);

  osc.connect(gain).connect(audio.destination);
  osc.start(t0);
  osc.stop(t0 + 0.14);
}

export const petSfx = {
  init() {
    mode = readStoredMode();
    // Unlock AudioContext on first pointer interaction (browser autoplay policy)
    const unlock = () => {
      if (mode !== "off") ensureCtx();
    };
    window.addEventListener("pointerdown", unlock, { once: true, capture: true });
  },

  getMode(): SoundMode {
    return mode;
  },

  setMode(next: SoundMode) {
    mode = next;
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      /* ignore */
    }
    if (next !== "off") {
      ensureCtx();
      this.play("tick");
    }
  },

  toggle(): SoundMode {
    const next: SoundMode = mode === "off" ? "soft" : "off";
    this.setMode(next);
    return next;
  },

  play(name: SfxName = "tick") {
    if (mode === "off") return;
    const audio = ensureCtx();
    if (!audio) return;
    if (audio.state !== "running") {
      void audio.resume().then(() => {
        if (mode !== "off" && ctx) playTone(name, ctx);
      });
      return;
    }
    playTone(name, audio);
  },
};
