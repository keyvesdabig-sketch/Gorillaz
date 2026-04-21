let audioCtx = null;

export function initAudio() {
  if (audioCtx) return;
  audioCtx = new AudioContext();
}

export function playShoot() {
  if (!audioCtx) return;
  const osc  = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.type = 'square';
  const t = audioCtx.currentTime;
  osc.frequency.setValueAtTime(150, t);
  osc.frequency.linearRampToValueAtTime(400, t + 0.15);
  gain.gain.setValueAtTime(0.3, t);
  gain.gain.linearRampToValueAtTime(0, t + 0.15);
  osc.connect(gain);
  gain.connect(audioCtx.destination);
  osc.start(t);
  osc.stop(t + 0.15);
}
export function playExplosion() {}
export function playDeath()     {}
