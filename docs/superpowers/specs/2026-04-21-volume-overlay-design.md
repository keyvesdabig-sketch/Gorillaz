# Volume Overlay — Design Spec
**Datum:** 2026-04-21  
**Status:** Genehmigt

---

## Überblick

Lautstärke-Overlay mit drei Kanälen (FX, Music, Ambient), aufrufbar über `M`-Taste. Musik-MP3 startet beim ersten Tastendruck. Ambient-Kanal ist Platzhalter (MP3-Datei folgt). DOM-basierte Slider im Neon-Night-Stil passend zum bestehenden CSS.

---

## Architektur

| Datei | Änderung |
|---|---|
| `audio.js` | FX-Master-GainNode, Music/Ambient `<audio>`-Elemente, Volume-Setter |
| `volume-overlay.js` | Neu — DOM-Overlay erstellen, Slider-Events verdrahten |
| `style.css` | `#volume-overlay`-Styles ergänzen |
| `main.js` | `M`-Taste verdrahten, `initVolumeOverlay()` aufrufen |
| `index.html` | `<script type="module">` für `volume-overlay.js` — nein, wird von `main.js` importiert |

---

## `audio.js` — Erweiterungen

### FX-Master-GainNode

```
audioCtx.destination
    ↑
  fxMaster (GainNode)
    ↑
  gain (pro FX-Sound)
```

- `let fxMaster = null` im Module-Scope
- In `initAudio()`: `fxMaster = audioCtx.createGain(); fxMaster.connect(audioCtx.destination);`
- Alle FX-Funktionen (`playShoot`, `playExplosion`, `playDeath`): `gain.connect(fxMaster)` statt `gain.connect(audioCtx.destination)`
- `setFxVolume(v)`: `fxMaster.gain.value = v` — v: 0.0–1.0

### Music

- `let musicEl = null` im Module-Scope
- In `initAudio()`: `musicEl = new Audio('lofiewme-pixel-fantasia-355123.mp3'); musicEl.loop = true; musicEl.volume = 0.5; musicEl.play()`
- `setMusicVolume(v)`: `musicEl.volume = v`

### Ambient

- `let ambientEl = null` im Module-Scope
- In `initAudio()`: `ambientEl = new Audio(); ambientEl.loop = true; ambientEl.volume = 0.3`
- `setAmbientVolume(v)`: `if (ambientEl) ambientEl.volume = v`
- Kein `play()` — kein `src` gesetzt, bleibt stumm bis Datei hinzugefügt wird

### Neue Exports

```js
export function setFxVolume(v)      { ... }
export function setMusicVolume(v)   { ... }
export function setAmbientVolume(v) { ... }
```

---

## `volume-overlay.js`

Exportiert eine Funktion `initVolumeOverlay()`. Erstellt ein `<div id="volume-overlay">` und hängt es an `#game-container`. Das Overlay ist standardmäßig `display: none`.

### DOM-Struktur

```html
<div id="volume-overlay">
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
</div>
```

`initVolumeOverlay()` verdrahtet die `input`-Events:
- FX-Slider → `setFxVolume(v)` + Update `vol-fx-val`
- Music-Slider → `setMusicVolume(v)` + Update `vol-music-val`
- Ambient-Slider → `setAmbientVolume(v)` + Update `vol-ambient-val`

### Toggle-Funktion

`volume-overlay.js` exportiert auch `toggleVolumeOverlay()`:

```js
export function toggleVolumeOverlay() {
  const el = document.getElementById('volume-overlay');
  el.style.display = el.style.display === 'flex' ? 'none' : 'flex';
}
```

---

## `style.css` — Neue Styles

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
  color: rgba(255,255,255,0.4);
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
  color: rgba(255,255,255,0.6);
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

---

## `main.js` — Änderungen

```js
import { initVolumeOverlay, toggleVolumeOverlay } from './volume-overlay.js';
```

In `keydown`-Handler: `if (e.code === 'KeyM') toggleVolumeOverlay();`

Einmalig nach `initGame(true)`: `initVolumeOverlay();`

`M`-Taste verhindert kein `e.preventDefault()` — sie muss aber nicht geblockt werden, da sie keine native Browser-Aktion auslöst.

---

## Nicht im Scope

- Persistenz der Lautstärke-Einstellungen (kein LocalStorage)
- Keyboard-Navigation innerhalb des Overlays
- Fade-In/Out-Animation des Overlays
- Ambient-MP3-Datei (kommt separat)
