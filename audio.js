let audioCtx = null;
let fxMaster = null;
let musicEl  = null;
let ambientEl = null;
const DEATH_FREQS = [523.25, 493.88, 466.16, 440, 415.30, 392];

export function initAudio() {
  if (audioCtx) return;
  audioCtx = new AudioContext();
  fxMaster  = audioCtx.createGain();
  fxMaster.connect(audioCtx.destination);
  musicEl = new Audio('lofiewme-pixel-fantasia-355123.mp3');
  musicEl.loop   = true;
  musicEl.volume = 0.5;
  musicEl.play().catch(() => {});
}

export function setFxVolume(v)      { if (fxMaster)  fxMaster.gain.value = v; }
export function setMusicVolume(v)   { if (musicEl)   musicEl.volume = v; }
export function setAmbientVolume(v) { if (ambientEl) ambientEl.volume = v; }

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
  gain.connect(fxMaster);
  osc.onended = () => { osc.disconnect(); gain.disconnect(); };
  osc.start(t);
  osc.stop(t + 0.15);
}

export function playExplosion() {
  if (!audioCtx) return;
  const sampleRate = audioCtx.sampleRate;
  const frameCount = Math.floor(sampleRate * 0.5);
  const buffer     = audioCtx.createBuffer(1, frameCount, sampleRate);
  const data       = buffer.getChannelData(0);
  for (let i = 0; i < frameCount; i++) data[i] = Math.random() * 2 - 1;

  const source = audioCtx.createBufferSource();
  source.buffer = buffer;

  const filter = audioCtx.createBiquadFilter();
  filter.type = 'lowpass';
  const gain = audioCtx.createGain();
  const t = audioCtx.currentTime;
  filter.frequency.setValueAtTime(800, t);
  filter.frequency.linearRampToValueAtTime(100, t + 0.5);
  gain.gain.setValueAtTime(0.5, t);
  gain.gain.linearRampToValueAtTime(0, t + 0.5);

  source.connect(filter);
  filter.connect(gain);
  gain.connect(fxMaster);
  source.onended = () => { source.disconnect(); filter.disconnect(); gain.disconnect(); };
  source.start(t);
}

export function playDeath() {
  if (!audioCtx) return;
  const t = audioCtx.currentTime;
  DEATH_FREQS.forEach((freq, i) => {
    const osc  = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = 'square';
    osc.frequency.setValueAtTime(freq, t + i * 0.12);
    gain.gain.setValueAtTime(0.25, t + i * 0.12);
    gain.gain.setValueAtTime(0,    t + (i + 1) * 0.12);
    osc.connect(gain);
    gain.connect(fxMaster);
    osc.onended = () => { osc.disconnect(); gain.disconnect(); };
    osc.start(t + i * 0.12);
    osc.stop(t + (i + 1) * 0.12);
  });
}
