let audioCtx = null;

export function initAudio() {
  if (audioCtx) return;
  audioCtx = new AudioContext();
}

export function playShoot()     {}
export function playExplosion() {}
export function playDeath()     {}
