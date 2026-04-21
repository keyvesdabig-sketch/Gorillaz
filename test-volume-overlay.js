import { initVolumeOverlay, toggleVolumeOverlay } from './volume-overlay.js';

function assert(cond, msg) {
  if (!cond) console.error(`FAIL: ${msg}`);
  else       console.log(`PASS: ${msg}`);
}

assert(typeof initVolumeOverlay   === 'function', 'initVolumeOverlay ist exportiert');
assert(typeof toggleVolumeOverlay === 'function', 'toggleVolumeOverlay ist exportiert');

initVolumeOverlay();

const el = document.getElementById('volume-overlay');
assert(el !== null, '#volume-overlay existiert im DOM');

const fxSlider      = document.getElementById('vol-fx');
const musicSlider   = document.getElementById('vol-music');
const ambientSlider = document.getElementById('vol-ambient');
assert(fxSlider      !== null, '#vol-fx Slider existiert');
assert(musicSlider   !== null, '#vol-music Slider existiert');
assert(ambientSlider !== null, '#vol-ambient Slider existiert');

toggleVolumeOverlay();
assert(el.style.display === 'flex', 'toggleVolumeOverlay öffnet Overlay');

toggleVolumeOverlay();
assert(el.style.display === 'none', 'toggleVolumeOverlay schließt Overlay');

initVolumeOverlay();
assert(document.querySelectorAll('#volume-overlay').length === 1, 'initVolumeOverlay ist idempotent — kein doppeltes Element');

console.log('VolumeOverlay-Tests fertig');
