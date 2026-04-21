import { initAudio, playShoot, playExplosion, playDeath } from './audio.js';

function assert(cond, msg) {
  if (!cond) console.error(`FAIL: ${msg}`);
  else       console.log(`PASS: ${msg}`);
}

assert(typeof initAudio    === 'function', 'initAudio ist exportiert');
assert(typeof playShoot    === 'function', 'playShoot ist exportiert');
assert(typeof playExplosion === 'function', 'playExplosion ist exportiert');
assert(typeof playDeath    === 'function', 'playDeath ist exportiert');

initAudio();
initAudio(); // doppelter Aufruf darf keinen zweiten Context erzeugen

let noThrow = true;
try { playShoot(); } catch(e) { noThrow = false; }
assert(noThrow, 'playShoot() wirft keinen Fehler nach initAudio()');

noThrow = true;
try { playShoot(); } catch(e) { noThrow = false; }
assert(noThrow, 'playShoot() zweimal aufrufbar ohne Fehler');

console.log('Audio-Tests fertig');
