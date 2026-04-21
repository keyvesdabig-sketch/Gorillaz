import { initAudio, playShoot, playExplosion, playDeath } from './audio.js';

function assert(cond, msg) {
  if (!cond) console.error(`FAIL: ${msg}`);
  else       console.log(`PASS: ${msg}`);
}

assert(typeof initAudio    === 'function', 'initAudio ist exportiert');
assert(typeof playShoot    === 'function', 'playShoot ist exportiert');
assert(typeof playExplosion === 'function', 'playExplosion ist exportiert');
assert(typeof playDeath    === 'function', 'playDeath ist exportiert');

console.log('Audio-Tests fertig');
