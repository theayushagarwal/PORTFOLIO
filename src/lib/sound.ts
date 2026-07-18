// Synthesized Web Audio API manager for zero-latency, asset-free tactile sounds.
let audioCtx: AudioContext | null = null;

// Module-level timestamp to rate-limit/debounce ticks during rapid mouse movement
let lastTickTime = 0;

// Idle timer to put AudioContext to sleep and free up CPU resources
let suspendTimeout: NodeJS.Timeout | null = null;

function initAudio() {
  if (typeof window === "undefined") return;
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    audioCtx = new AudioContextClass();
  } catch (e) {
    console.warn("Web Audio API not supported in this browser:", e);
  }
}

// Reset idle suspend timer (10s of silence will suspend context to yield CPU threads)
function resetSuspendTimer() {
  if (typeof window === "undefined" || !audioCtx) return;

  if (suspendTimeout) {
    clearTimeout(suspendTimeout);
  }

  suspendTimeout = setTimeout(() => {
    if (audioCtx && audioCtx.state === "running") {
      audioCtx.suspend().catch((e) => console.warn("Failed to suspend AudioContext:", e));
    }
  }, 10000); // 10 seconds of idle inactivity
}

// Helper to apply random micro-jitter to frequencies and durations
function jitter(base: number, percent: number): number {
  const range = base * percent;
  return base + (Math.random() * 2 - 1) * range;
}

// Synchronously ensure audio context is active (avoids async/await microtask delay)
function resumeContextSync(): boolean {
  if (!audioCtx) {
    initAudio();
  }
  if (!audioCtx) return false;

  if (audioCtx.state === "suspended") {
    // Kick off resume() without waiting for it. We still schedule and start
    // the oscillator below; the browser resumes almost immediately in
    // response to the gesture, and the already-scheduled nodes play as soon
    // as it does.
    audioCtx.resume().catch((e) => console.warn("Failed to resume AudioContext:", e));
  }

  // Refresh the suspend timer upon activity
  resetSuspendTimer();

  return audioCtx.state !== "closed";
}

export function resumeAudio(): Promise<void> {
  if (!audioCtx) {
    initAudio();
  }
  if (!audioCtx) return Promise.resolve();

  // Refresh the suspend timer
  resetSuspendTimer();

  return audioCtx.resume();
}

// Set up a one-time listener to initialize/resume AudioContext on first gesture
export function initAudioOnFirstInteraction() {
  if (typeof window === "undefined" || typeof document === "undefined") return;

  const handleInteraction = () => {
    resumeAudio().catch((e) => console.warn("Failed to resume context on interaction:", e));
    cleanup();
  };

  const cleanup = () => {
    document.removeEventListener("pointerdown", handleInteraction);
    document.removeEventListener("keydown", handleInteraction);
  };

  document.addEventListener("pointerdown", handleInteraction, { once: true });
  document.addEventListener("keydown", handleInteraction, { once: true });
}

/**
 * 1. playTick: Crisp, mechanical hover click (10/10 liquid pop).
 * Debounced at 45ms and memory-optimized via explicit node graph de-allocation on finish.
 */
export function playTick(pan = 0) {
  // Rate-limiting: Prevent multiple ticks triggering too close together (under 45ms)
  const nowMs = performance.now();
  if (nowMs - lastTickTime < 45) {
    return;
  }

  if (!resumeContextSync() || !audioCtx) return;

  // Set the start time of the playback
  lastTickTime = nowMs;

  const now = audioCtx.currentTime;

  // Flavor selection: 3 distinct timbre flavors picked randomly each hover
  const flavors = [
    { type: "sine" as OscillatorType, startFreq: 2000, endFreq: 1000, baseDuration: 0.025 }, // Flavor A: "bright"
    { type: "triangle" as OscillatorType, startFreq: 1400, endFreq: 700, baseDuration: 0.025 }, // Flavor B: "woody"
    { type: "sine" as OscillatorType, startFreq: 2800, endFreq: 1800, baseDuration: 0.018 }, // Flavor C: "glassy"
  ];
  const selectedFlavor = flavors[Math.floor(Math.random() * flavors.length)];

  // Timing jitter: +/-10% variation on chosen flavor's base duration (clamped to 12ms minimum)
  const duration = Math.max(0.012, jitter(selectedFlavor.baseDuration, 0.1));

  // Stereo panner shared by both noise transient and tone layers
  const panner = audioCtx.createStereoPanner();
  const panValue = typeof pan === "number" ? pan : 0;
  panner.pan.setValueAtTime(panValue, now);
  panner.connect(audioCtx.destination);

  // 1. Synthesize percussive transient click (highly resonant liquid pop)
  const sampleCount = Math.floor(audioCtx.sampleRate * 0.007); // ~7ms duration
  const noiseBuffer = audioCtx.createBuffer(1, sampleCount, audioCtx.sampleRate);
  const bufferData = noiseBuffer.getChannelData(0);

  // Fill buffer with random noise samples
  for (let i = 0; i < sampleCount; i++) {
    bufferData[i] = (Math.random() * 2 - 1) * 0.5;
  }

  const noiseSource = audioCtx.createBufferSource();
  noiseSource.buffer = noiseBuffer;

  const noiseGain = audioCtx.createGain();
  const noiseFilter = audioCtx.createBiquadFilter();

  noiseGain.gain.setValueAtTime(0.17, now);
  noiseGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.007);

  // Resonant bandpass filter: centers the noise burst to behave like a tiny physical chamber
  noiseFilter.type = "bandpass";
  const bandpassFreq = selectedFlavor.type === "triangle" ? 1800 : 2800;
  noiseFilter.frequency.setValueAtTime(bandpassFreq, now);
  noiseFilter.Q.setValueAtTime(8.0, now); // High Q factor creates the wooden click/pop character

  noiseSource.connect(noiseGain);
  noiseGain.connect(noiseFilter);
  noiseFilter.connect(panner); // Route through panner

  // 2. Synthesize base tone sweep
  const osc = audioCtx.createOscillator();
  const gainNode = audioCtx.createGain();
  const filter = audioCtx.createBiquadFilter();

  const startFreq = jitter(selectedFlavor.startFreq, 0.06);
  const endFreq = jitter(selectedFlavor.endFreq, 0.06);

  osc.type = selectedFlavor.type;
  osc.frequency.setValueAtTime(startFreq, now);
  osc.frequency.exponentialRampToValueAtTime(endFreq, now + duration);

  gainNode.gain.setValueAtTime(0.045, now);
  gainNode.gain.exponentialRampToValueAtTime(0.0001, now + duration * 0.65);

  filter.type = "highpass";
  filter.frequency.setValueAtTime(1700, now);

  osc.connect(gainNode);
  gainNode.connect(filter);
  filter.connect(panner); // Route through panner

  // Memory Optimization: Disconnect and sever the nodes immediately after playback ends to bypass GC pressure
  osc.onended = () => {
    osc.disconnect();
    gainNode.disconnect();
    filter.disconnect();
    panner.disconnect();
  };

  noiseSource.onended = () => {
    noiseSource.disconnect();
    noiseGain.disconnect();
    noiseFilter.disconnect();
  };

  // Trigger both components simultaneously
  noiseSource.start(now);
  osc.start(now);

  osc.stop(now + duration);
}

/**
 * 2. playSwell: Cinematic, low-frequency ascending system swell (1.8s) (10/10 with gleam shimmer).
 * Memory-optimized via explicit node graph de-allocation on finish.
 */
export function playSwell() {
  if (!resumeContextSync() || !audioCtx) return;

  const now = audioCtx.currentTime;
  const duration = 1.8;

  const subOsc = audioCtx.createOscillator();
  const subGain = audioCtx.createGain();

  const midOsc = audioCtx.createOscillator();
  const midGain = audioCtx.createGain();

  const filter = audioCtx.createBiquadFilter();

  subOsc.type = "sine";
  subOsc.frequency.setValueAtTime(45, now);
  subOsc.frequency.linearRampToValueAtTime(95, now + duration);

  midOsc.type = "triangle";
  midOsc.frequency.setValueAtTime(180, now);
  midOsc.frequency.linearRampToValueAtTime(280, now + duration);

  subGain.gain.setValueAtTime(0, now);
  subGain.gain.linearRampToValueAtTime(0.22, now + 1.2);
  subGain.gain.setValueAtTime(0.22, now + 1.5);
  subGain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

  midGain.gain.setValueAtTime(0, now);
  midGain.gain.linearRampToValueAtTime(0.035, now + 1.2);
  midGain.gain.setValueAtTime(0.035, now + 1.5);
  midGain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

  filter.type = "lowpass";
  filter.frequency.setValueAtTime(100, now);
  filter.frequency.exponentialRampToValueAtTime(600, now + duration);

  subOsc.connect(subGain);
  midOsc.connect(midGain);

  subGain.connect(filter);
  midGain.connect(filter);

  filter.connect(audioCtx.destination);

  // 3. Shimmer/Gleam layer: quiet, high-frequency tremolo sine sweep at the end of the swell (1.4s to 1.8s)
  const shimmerOsc = audioCtx.createOscillator();
  const shimmerGain = audioCtx.createGain();
  const lfo = audioCtx.createOscillator();
  const lfoGain = audioCtx.createGain();

  shimmerOsc.type = "sine";
  shimmerOsc.frequency.setValueAtTime(3500, now + 1.4);
  shimmerOsc.frequency.exponentialRampToValueAtTime(4200, now + 1.8);

  // LFO modulates the shimmer gain at 12Hz to create a crystalline sparkle
  lfo.type = "sine";
  lfo.frequency.setValueAtTime(12, now + 1.4);
  lfoGain.gain.setValueAtTime(0.012, now + 1.4); // Subtle amplitude modulation depth

  shimmerGain.gain.setValueAtTime(0, now);
  shimmerGain.gain.setValueAtTime(0, now + 1.4);
  shimmerGain.gain.linearRampToValueAtTime(0.02, now + 1.68);
  shimmerGain.gain.exponentialRampToValueAtTime(0.0001, now + 1.8);

  lfo.connect(lfoGain);
  lfoGain.connect(shimmerGain.gain);

  shimmerOsc.connect(shimmerGain);
  shimmerGain.connect(audioCtx.destination);

  // Memory Optimization: Disconnect nodes upon completion
  subOsc.onended = () => {
    subOsc.disconnect();
    subGain.disconnect();
    midOsc.disconnect();
    midGain.disconnect();
    filter.disconnect();
  };

  shimmerOsc.onended = () => {
    shimmerOsc.disconnect();
    shimmerGain.disconnect();
    lfo.disconnect();
    lfoGain.disconnect();
  };

  // Start oscillators
  subOsc.start(now);
  midOsc.start(now);
  lfo.start(now + 1.4);
  shimmerOsc.start(now + 1.4);

  // Stop oscillators
  subOsc.stop(now + duration);
  midOsc.stop(now + duration);
  lfo.stop(now + duration);
  shimmerOsc.stop(now + duration);
}

/**
 * 3. playExit: Textured suction dissolve (10/10 air whoosh).
 * Replaced the arcade-style sine glide with a premium lowpass white-noise whoosh sweep.
 */
export function playExit() {
  if (!resumeContextSync() || !audioCtx) return;

  const now = audioCtx.currentTime;
  const duration = 0.3; // Quick 300ms suction whoosh

  // Generate white noise for the air sweep
  const sampleCount = Math.floor(audioCtx.sampleRate * duration);
  const noiseBuffer = audioCtx.createBuffer(1, sampleCount, audioCtx.sampleRate);
  const bufferData = noiseBuffer.getChannelData(0);

  for (let i = 0; i < sampleCount; i++) {
    bufferData[i] = (Math.random() * 2 - 1) * 0.45;
  }

  const noiseSource = audioCtx.createBufferSource();
  noiseSource.buffer = noiseBuffer;

  const gainNode = audioCtx.createGain();
  const filter = audioCtx.createBiquadFilter();

  // Volume: smooth fade-out over 300ms
  gainNode.gain.setValueAtTime(0.18, now);
  gainNode.gain.exponentialRampToValueAtTime(0.0001, now + duration);

  // Lowpass filter sweep: sweeps downward from 3.5kHz to 80Hz to create the organic suction dissolve
  filter.type = "lowpass";
  filter.frequency.setValueAtTime(3500, now);
  filter.frequency.exponentialRampToValueAtTime(80, now + duration);

  noiseSource.connect(gainNode);
  gainNode.connect(filter);
  filter.connect(audioCtx.destination);

  // Memory Optimization: Disconnect node graph on ended
  noiseSource.onended = () => {
    noiseSource.disconnect();
    gainNode.disconnect();
    filter.disconnect();
  };

  noiseSource.start(now);
  noiseSource.stop(now + duration);
}
