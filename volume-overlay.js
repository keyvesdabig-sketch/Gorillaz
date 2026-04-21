import { setFxVolume, setMusicVolume, setAmbientVolume } from './audio.js';

export function initVolumeOverlay() {
  if (document.getElementById('volume-overlay')) return;

  const overlay = document.createElement('div');
  overlay.id = 'volume-overlay';
  overlay.style.display = 'none';
  overlay.innerHTML = `
    <div class="vol-title">LAUTSTÄRKE <span class="vol-hint">[M]</span></div>
    <div class="vol-row">
      <span class="vol-label">FX</span>
      <input type="range" id="vol-fx" min="0" max="1" step="0.01" value="1">
      <span class="vol-val" id="vol-fx-val">100</span>
    </div>
    <div class="vol-row">
      <span class="vol-label">Music</span>
      <input type="range" id="vol-music" min="0" max="1" step="0.01" value="0.5">
      <span class="vol-val" id="vol-music-val">50</span>
    </div>
    <div class="vol-row">
      <span class="vol-label">Ambient</span>
      <input type="range" id="vol-ambient" min="0" max="1" step="0.01" value="0.3">
      <span class="vol-val" id="vol-ambient-val">30</span>
    </div>
  `;

  document.getElementById('game-container').appendChild(overlay);

  document.getElementById('vol-fx').addEventListener('input', e => {
    const v = parseFloat(e.target.value);
    setFxVolume(v);
    document.getElementById('vol-fx-val').textContent = Math.round(v * 100);
  });

  document.getElementById('vol-music').addEventListener('input', e => {
    const v = parseFloat(e.target.value);
    setMusicVolume(v);
    document.getElementById('vol-music-val').textContent = Math.round(v * 100);
  });

  document.getElementById('vol-ambient').addEventListener('input', e => {
    const v = parseFloat(e.target.value);
    setAmbientVolume(v);
    document.getElementById('vol-ambient-val').textContent = Math.round(v * 100);
  });
}

export function toggleVolumeOverlay() {
  const el = document.getElementById('volume-overlay');
  el.style.display = el.style.display === 'flex' ? 'none' : 'flex';
}
