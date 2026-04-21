import { initAudio, playShoot, playExplosion, playDeath, setFxVolume, setMusicVolume, setAmbientVolume } from '../src/audio.js';

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

noThrow = true;
try { playExplosion(); } catch(e) { noThrow = false; }
assert(noThrow, 'playExplosion() wirft keinen Fehler nach initAudio()');

noThrow = true;
try { playDeath(); } catch(e) { noThrow = false; }
assert(noThrow, 'playDeath() wirft keinen Fehler nach initAudio()');

assert(typeof setFxVolume === 'function', 'setFxVolume ist exportiert');

noThrow = true;
try { setFxVolume(0.5); } catch(e) { noThrow = false; }
assert(noThrow, 'setFxVolume(0.5) wirft keinen Fehler nach initAudio()');

noThrow = true;
try { setFxVolume(0); } catch(e) { noThrow = false; }
assert(noThrow, 'setFxVolume(0) wirft keinen Fehler');

assert(typeof setMusicVolume === 'function', 'setMusicVolume ist exportiert');

noThrow = true;
try { setMusicVolume(0.3); } catch(e) { noThrow = false; }
assert(noThrow, 'setMusicVolume(0.3) wirft keinen Fehler nach initAudio()');

assert(typeof setAmbientVolume === 'function', 'setAmbientVolume ist exportiert');

noThrow = true;
try { setAmbientVolume(0.2); } catch(e) { noThrow = false; }
assert(noThrow, 'setAmbientVolume(0.2) wirft keinen Fehler');

console.log('Audio-Tests fertig');
