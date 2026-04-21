# Volume Overlay — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Lautstärke-Overlay mit FX/Music/Ambient-Slidern (M-Taste toggle), Musik-MP3 startet beim ersten Tastendruck.

**Architecture:** `audio.js` bekommt einen FX-Master-GainNode (alle FX routen durch ihn), zwei `<audio>`-Elemente für Music/Ambient und drei Volume-Setter. `volume-overlay.js` erstellt das DOM-Overlay und verdrahtet die Slider. `main.js` importiert beides und verdrahtet die M-Taste.

**Tech Stack:** Web Audio API GainNode, HTML `<audio>` Element, DOM, CSS (bestehende Neon-Night-Variablen)

**Worktree:** Alle Änderungen in `.worktrees/feature-audio` (Branch `feature/audio`). Das ist der Worktree in dem bereits `audio.js` v1 fertiggestellt wurde.

---

## Datei-Übersicht

| Datei | Änderung |
|---|---|
| `audio.js` | fxMaster GainNode, musicEl/ambientEl, setFxVolume/setMusicVolume/setAmbientVolume, alle FX routen durch fxMaster |
| `test-audio.js` | Neue Exports testen |
| `volume-overlay.js` | Neu — DOM-Overlay, initVolumeOverlay(), toggleVolumeOverlay() |
| `test-volume-overlay.js` | Neu — Export-Checks, DOM-Tests, Toggle-Tests |
| `style.css` | `#volume-overlay`-Styles ergänzen |
| `main.js` | M-Taste verdrahten, initVolumeOverlay() aufrufen |

---

### Task 1: FX-Master-GainNode

Alle FX-Sounds routen durch einen gemeinsamen GainNode. `setFxVolume(v)` setzt dessen Gain.

**Files:**
- Modify: `audio.js`
- Modify: `test-audio.js`

- [ ] **Schritt 1: Test erweitern**

In `test-audio.js` den Import-Ausdruck ersetzen:

```js
import { initAudio, playShoot, playExplosion, playDeath, setFxVolume } from './audio.js';
```

Vor dem letzten `console.log('Audio-Tests fertig')` einfügen:

```js
assert(typeof setFxVolume === 'function', 'setFxVolume ist exportiert');

let noThrow = true;
try { setFxVolume(0.5); } catch(e) { noThrow = false; }
assert(noThrow, 'setFxVolume(0.5) wirft keinen Fehler nach initAudio()');

noThrow = true;
try { setFxVolume(0); } catch(e) { noThrow = false; }
assert(noThrow, 'setFxVolume(0) wirft keinen Fehler');
```

- [ ] **Schritt 2: Test im Browser ausführen (muss FAIL für setFxVolume)**

```
import('./test-audio.js')
```

Erwartetes Ergebnis: `FAIL: setFxVolume ist exportiert`

- [ ] **Schritt 3: audio.js anpassen**

`audio.js` vollständig ersetzen:

```js
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
    osc.start(t + i * 0.12);
    osc.stop(t + (i + 1) * 0.12);
  });
}
```

- [ ] **Schritt 4: Test ausführen (alle PASS)**

```
import('./test-audio.js')
```

Erwartetes Ergebnis: alle PASS inkl. `setFxVolume ist exportiert`.

- [ ] **Schritt 5: Commit**

```bash
git add audio.js test-audio.js
git commit -m "feat: add fxMaster GainNode, route all FX through it, export setFxVolume"
```

---

### Task 2: Music-MP3-Support

Musikdatei `lofiewme-pixel-fantasia-355123.mp3` wird beim ersten Tastendruck gestartet.

**Files:**
- Modify: `audio.js`
- Modify: `test-audio.js`

- [ ] **Schritt 1: Test erweitern**

In `test-audio.js` den Import-Ausdruck ersetzen:

```js
import { initAudio, playShoot, playExplosion, playDeath, setFxVolume, setMusicVolume } from './audio.js';
```

Vor dem letzten `console.log('Audio-Tests fertig')` einfügen:

```js
assert(typeof setMusicVolume === 'function', 'setMusicVolume ist exportiert');

noThrow = true;
try { setMusicVolume(0.3); } catch(e) { noThrow = false; }
assert(noThrow, 'setMusicVolume(0.3) wirft keinen Fehler nach initAudio()');
```

- [ ] **Schritt 2: Test im Browser ausführen (muss FAIL für setMusicVolume)**

```
import('./test-audio.js')
```

Erwartetes Ergebnis: `FAIL: setMusicVolume ist exportiert`

- [ ] **Schritt 3: musicEl in `initAudio()` ergänzen**

In `audio.js` die Funktion `initAudio()` ersetzen:

```js
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
```

- [ ] **Schritt 4: Test ausführen (alle PASS)**

```
import('./test-audio.js')
```

- [ ] **Schritt 5: Manuell verifizieren**

Spiel im Browser öffnen, erste Taste drücken → Musik muss starten.

- [ ] **Schritt 6: Commit**

```bash
git add audio.js test-audio.js
git commit -m "feat: add music MP3 support, starts on first keypress"
```

---

### Task 3: Ambient-Platzhalter

Ambient-Kanal vorbereiten (kein src, bleibt stumm bis Datei gesetzt wird).

**Files:**
- Modify: `audio.js`
- Modify: `test-audio.js`

- [ ] **Schritt 1: Test erweitern**

In `test-audio.js` den Import-Ausdruck ersetzen:

```js
import { initAudio, playShoot, playExplosion, playDeath, setFxVolume, setMusicVolume, setAmbientVolume } from './audio.js';
```

Vor dem letzten `console.log('Audio-Tests fertig')` einfügen:

```js
assert(typeof setAmbientVolume === 'function', 'setAmbientVolume ist exportiert');

noThrow = true;
try { setAmbientVolume(0.2); } catch(e) { noThrow = false; }
assert(noThrow, 'setAmbientVolume(0.2) wirft keinen Fehler');
```

- [ ] **Schritt 2: Test im Browser ausführen (muss FAIL für setAmbientVolume)**

```
import('./test-audio.js')
```

- [ ] **Schritt 3: ambientEl in `initAudio()` ergänzen**

In `audio.js` die Funktion `initAudio()` ersetzen:

```js
export function initAudio() {
  if (audioCtx) return;
  audioCtx = new AudioContext();
  fxMaster  = audioCtx.createGain();
  fxMaster.connect(audioCtx.destination);
  musicEl = new Audio('lofiewme-pixel-fantasia-355123.mp3');
  musicEl.loop   = true;
  musicEl.volume = 0.5;
  musicEl.play().catch(() => {});
  ambientEl = new Audio();
  ambientEl.loop   = true;
  ambientEl.volume = 0.3;
}
```

- [ ] **Schritt 4: Test ausführen (alle PASS)**

```
import('./test-audio.js')
```

- [ ] **Schritt 5: Commit**

```bash
git add audio.js test-audio.js
git commit -m "feat: add ambient audio placeholder (no src, muted until file set)"
```

---

### Task 4: `volume-overlay.js` erstellen

DOM-Overlay mit drei Slidern, idempotente Initialisierung.

**Files:**
- Create: `volume-overlay.js`
- Create: `test-volume-overlay.js`

- [ ] **Schritt 1: Test schreiben**

Neue Datei `test-volume-overlay.js`:

```js
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
```

- [ ] **Schritt 2: Test im Browser ausführen (muss FAIL)**

```
import('./test-volume-overlay.js')
```

Erwartetes Ergebnis: Fehler wegen fehlender Datei.

- [ ] **Schritt 3: `volume-overlay.js` erstellen**

```js
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
```

- [ ] **Schritt 4: Test ausführen (alle PASS)**

```
import('./test-volume-overlay.js')
```

Erwartetes Ergebnis: alle PASS + `VolumeOverlay-Tests fertig`.

- [ ] **Schritt 5: Commit**

```bash
git add volume-overlay.js test-volume-overlay.js
git commit -m "feat: add volume-overlay.js with initVolumeOverlay and toggleVolumeOverlay"
```

---

### Task 5: `style.css` — Overlay-Styles

**Files:**
- Modify: `style.css`

- [ ] **Schritt 1: Styles an das Ende von `style.css` anhängen**

```css
#volume-overlay {
  position: absolute;
  bottom: 120px;
  right: 32px;
  display: none;
  flex-direction: column;
  gap: 16px;
  padding: 20px 24px;
  background: var(--glass);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid var(--border);
  border-radius: 12px;
  z-index: 20;
  pointer-events: auto;
  min-width: 280px;
}

.vol-title {
  font-family: 'Orbitron', sans-serif;
  font-size: 13px;
  text-transform: uppercase;
  letter-spacing: 2px;
  color: var(--cyan);
  margin-bottom: 4px;
}

.vol-hint {
  color: rgba(255, 255, 255, 0.4);
  font-size: 11px;
}

.vol-row {
  display: flex;
  align-items: center;
  gap: 12px;
}

.vol-label {
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: rgba(255, 255, 255, 0.6);
  width: 56px;
}

.vol-row input[type="range"] {
  flex: 1;
  accent-color: var(--cyan);
  cursor: pointer;
}

.vol-val {
  font-family: 'Orbitron', sans-serif;
  font-size: 12px;
  color: var(--cyan);
  width: 28px;
  text-align: right;
}
```

- [ ] **Schritt 2: Visuell verifizieren**

Im Browser-Console:

```js
import { initVolumeOverlay, toggleVolumeOverlay } from './volume-overlay.js';
initVolumeOverlay();
toggleVolumeOverlay();
```

Erwartetes Ergebnis: Glasmorphism-Panel unten rechts, Neon-Cyan-Akzente, drei Slider sichtbar.

- [ ] **Schritt 3: Commit**

```bash
git add style.css
git commit -m "feat: add #volume-overlay styles (glassmorphism, neon-night palette)"
```

---

### Task 6: `main.js` — M-Taste + initVolumeOverlay

**Files:**
- Modify: `main.js`

- [ ] **Schritt 1: Import ergänzen**

In `main.js` nach dem `audio.js`-Import (Zeile 10) einfügen:

```js
import { initVolumeOverlay, toggleVolumeOverlay } from './volume-overlay.js';
```

- [ ] **Schritt 2: `initVolumeOverlay()` aufrufen**

In `main.js` nach `initGame(true);` einfügen:

```js
initVolumeOverlay();
```

- [ ] **Schritt 3: M-Taste im keydown-Handler verdrahten**

Den bestehenden keydown-Handler ersetzen:

```js
window.addEventListener('keydown', e => {
  initAudio();
  if (e.code === 'KeyM') toggleVolumeOverlay();
  keys[e.code] = true;
  e.preventDefault();
});
```

- [ ] **Schritt 4: Vollständig im Browser testen**

Checkliste:
- [ ] `M` öffnet Overlay (unten rechts, glassmorphism)
- [ ] `M` nochmal schließt Overlay
- [ ] FX-Slider: auf 0 schieben → Schuss und Explosion stumm
- [ ] FX-Slider: auf 100 → Sounds wieder hörbar
- [ ] Music-Slider: Musik lauter/leiser
- [ ] Ambient-Slider: bewegt sich, kein Fehler in Console
- [ ] Keine Fehler in der Browser-Console

- [ ] **Schritt 5: Commit**

```bash
git add main.js
git commit -m "feat: wire volume overlay into main.js — M key toggle"
```
