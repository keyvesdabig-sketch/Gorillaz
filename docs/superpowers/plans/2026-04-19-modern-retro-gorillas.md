# Modern Retro Gorillas — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement a spielbares artillery-Game (Hotseat + KI) mit prozeduralem zerstörbarem Terrain, Bananen-Physik, Explosions-System und Neon-Night-Optik — als reine HTML5-Canvas-App ohne Build-Tool.

**Architecture:** 12 ES-Module-Dateien, geladen via `<script type="module">` in `index.html`. Zustand in einem mutablen Singleton `gs` (game state) in `state.js`. State Machine treibt alle Logik: SETUP → AIMING → FLYING → EXPLODING → NEXT_TURN → GAME_OVER. `main.js` betreibt den `requestAnimationFrame`-Loop und ruft update + render auf.

**Tech Stack:** HTML5 Canvas 2D API, Vanilla JavaScript ES Modules, `npx serve .` als lokaler Dev-Server

---

## Datei-Übersicht

| Datei | Verantwortlichkeit |
|---|---|
| `index.html` | Canvas, CSS-Reset, Modul-Einstiegspunkt |
| `constants.js` | Farben, Canvas-Größe, Physik-Konstanten |
| `state.js` | Mutabler Game-State `gs`, `transition(event)` |
| `terrain.js` | Terrain-Generierung, Pixel-Buffer, `carveExplosion` |
| `particles.js` | Partikel erzeugen und pro Frame bewegen |
| `physics.js` | Bananen-Physik-Tick, `simulateTrajectory` |
| `collision.js` | Terrain-Treffer, AABB-Gorilla-Treffer, Out-of-Bounds |
| `gorilla.js` | Gorilla prozedural zeichnen (Idle / Throw) |
| `renderer.js` | Alle Layer in Reihenfolge auf Canvas zeichnen |
| `ui.js` | HP-Balken, Wind-Pfeil, Winkel/Kraft-Text |
| `ai.js` | `calculateAIShot` via `simulateTrajectory` |
| `main.js` | Game Loop, Input-Handler, Orchestrierung |

**Test-Dateien** (im Browser-Console mit `import('./test-X.js')` ausführen):

| Datei | Testet |
|---|---|
| `test-terrain.js` | `generateTerrain`, `getHeight`, `getPixel` |
| `test-physics.js` | `stepBanana`, Gravitation, Wind-Einfluss |
| `test-collision.js` | `checkOutOfBounds`, AABB-Logik |

---

## Task 1: Scaffold

**Files:**
- Create: `index.html`
- Create: `constants.js`
- Create: `state.js` (Stub)
- Create: `terrain.js` (Stub)
- Create: `particles.js` (Stub)
- Create: `physics.js` (Stub)
- Create: `collision.js` (Stub)
- Create: `gorilla.js` (Stub)
- Create: `renderer.js` (Stub)
- Create: `ui.js` (Stub)
- Create: `ai.js` (Stub)
- Create: `main.js`

- [ ] **Step 1: `constants.js` schreiben**

```js
export const CANVAS_W = 640;   // interne Auflösung — CSS skaliert auf 1280×720
export const CANVAS_H = 360;
export const GRAVITY = 300;        // px/s²
export const EXPLOSION_RADIUS = 40;
export const GORILLA_W = 64;
export const GORILLA_H = 80;
export const GORILLA_HP = 100;
export const WIND_MAX = 30;        // px/s²
export const AI_THINK_DELAY = 1.5; // Sekunden
export const AI_INACCURACY = 15;   // Grad Zufalls-Abweichung

export const COLORS = {
  SKY_TOP:      '#1a1a2e',
  SKY_BOTTOM:   '#16213e',
  TERRAIN:      '#0f3460',
  SURFACE:      '#53d8fb',
  BANANA:       '#ffe135',
  GORILLA_BODY: '#8B6914',
  GORILLA_DARK: '#5a3e08',
  GORILLA_EYES: '#ffffff',
  HP_GOOD:      '#4ecca3',
  HP_BAD:       '#e94560',
  WIND:         '#53d8fb',
  TEXT:         '#ffffff',
  PARTICLE:     ['#e94560', '#f5a623', '#53d8fb', '#ffe135'],
};
```

- [ ] **Step 2: `index.html` schreiben**

```html
<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8">
  <title>Modern Retro Gorillas</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      background: #000;
      display: flex;
      align-items: center;
      justify-content: center;
      height: 100vh;
      overflow: hidden;
    }
    canvas {
      display: block;
      width: 1280px;
      height: 720px;
      image-rendering: pixelated;  /* 640×360 → 1280×720, Retro-Pixel-Look */
    }
  </style>
</head>
<body>
  <canvas id="game"></canvas>
  <script type="module" src="main.js"></script>
</body>
</html>
```

- [ ] **Step 3: Alle Stub-Module schreiben** (ein Durchgang)

`state.js`:
```js
export const STATE = {
  SETUP: 'SETUP', AIMING: 'AIMING', FLYING: 'FLYING',
  EXPLODING: 'EXPLODING', NEXT_TURN: 'NEXT_TURN', GAME_OVER: 'GAME_OVER',
};
export const gs = { phase: STATE.SETUP };
export function transition(_event) {}
```

`terrain.js`:
```js
export function generateTerrain() {}
export function getHeight(_x) { return 400; }
export function getPixel(_x, _y) { return false; }
export function carveExplosion(_cx, _cy, _r) {}
export function buildTerrainImageData(_ctx) { return null; }
```

`particles.js`:
```js
export function createExplosionParticles(_cx, _cy) { return []; }
export function stepParticles(particles, _dt) { return particles; }
```

`physics.js`:
```js
export function createBanana(_x, _y, _angle, _power, _wind) { return null; }
export function stepBanana(_banana, _dt) {}
export function simulateTrajectory(_x, _y, _angle, _power, _wind) { return null; }
```

`collision.js`:
```js
export function checkOutOfBounds(_b) { return false; }
export function checkTerrain(_b) { return false; }
export function checkGorilla(_b, _players) { return -1; }
```

`gorilla.js`:
```js
export function drawGorilla(_ctx, _x, _y, _facing, _animState) {}
```

`renderer.js`:
```js
export function render(_ctx, _gs) {}
```

`ui.js`:
```js
export function drawUI(_ctx, _gs) {}
```

`ai.js`:
```js
export function calculateAIShot(_shooter, _target, _wind) {
  return { angle: 45, power: 50 };
}
```

- [ ] **Step 4: `main.js` schreiben**

```js
import { CANVAS_W, CANVAS_H, COLORS } from './constants.js';

const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
canvas.width = CANVAS_W;
canvas.height = CANVAS_H;

function tick() {
  ctx.fillStyle = COLORS.SKY_TOP;
  ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);
  requestAnimationFrame(tick);
}

requestAnimationFrame(tick);
```

- [ ] **Step 5: Server starten und verifizieren**

```bash
npx serve .
```

Öffne http://localhost:3000 — erwartet: dunkler Canvas (#1a1a2e), keine Console-Fehler.

- [ ] **Step 6: Git initialisieren und committen**

```bash
git init
git add .
git commit -m "feat: project scaffold with module stubs"
```

---

## Task 2: State Machine

**Files:**
- Modify: `state.js`

- [ ] **Step 1: Test-Erwartungen in Console kommentieren**

Füge oben in `state.js` als Kommentar ein (wird beim nächsten Schritt gegen echte Logik getestet):
```
// Erwartete Transitionen:
// SETUP + SETUP_DONE → AIMING
// AIMING + SHOOT → FLYING
// FLYING + HIT_TERRAIN → EXPLODING
// FLYING + OUT_OF_BOUNDS → NEXT_TURN
// EXPLODING + EXPLODE_DONE → NEXT_TURN (wenn kein Spieler tot)
// EXPLODING + EXPLODE_DONE → GAME_OVER (wenn HP ≤ 0)
// NEXT_TURN → AIMING (automatisch, schaltet Spieler um)
```

- [ ] **Step 2: `state.js` vollständig implementieren**

```js
import { GORILLA_HP, WIND_MAX, AI_THINK_DELAY, CANVAS_W } from './constants.js';

export const STATE = {
  SETUP:      'SETUP',
  AIMING:     'AIMING',
  FLYING:     'FLYING',
  EXPLODING:  'EXPLODING',
  NEXT_TURN:  'NEXT_TURN',
  GAME_OVER:  'GAME_OVER',
};

export const gs = {
  phase:         STATE.SETUP,
  turn:          0,          // 0 = P1, 1 = P2
  players: [
    { hp: GORILLA_HP, isAI: false, name: 'Spieler 1', x: 0, y: 0, animState: 'idle' },
    { hp: GORILLA_HP, isAI: false, name: 'Spieler 2', x: 0, y: 0, animState: 'idle' },
  ],
  aim:           { angle: 45, power: 50 },
  wind:          0,
  banana:        null,
  particles:     [],
  explodeTimer:  0,
  aiThinkTimer:  0,
  winner:        -1,
};

export function initGame(player2IsAI = false) {
  gs.phase        = STATE.SETUP;
  gs.turn         = 0;
  gs.winner       = -1;
  gs.banana       = null;
  gs.particles    = [];
  gs.players[0]   = { hp: GORILLA_HP, isAI: false, name: 'Spieler 1', x: 0, y: 0, animState: 'idle' };
  gs.players[1]   = { hp: GORILLA_HP, isAI: player2IsAI, name: player2IsAI ? 'KI' : 'Spieler 2', x: 0, y: 0, animState: 'idle' };
  gs.aim          = { angle: 45, power: 50 };
  gs.wind         = (Math.random() * 2 - 1) * WIND_MAX;
}

export function transition(event) {
  switch (gs.phase) {
    case STATE.SETUP:
      if (event === 'SETUP_DONE') gs.phase = STATE.AIMING;
      break;

    case STATE.AIMING:
      if (event === 'SHOOT') {
        gs.phase = STATE.FLYING;
        gs.players[gs.turn].animState = 'throw';
      }
      break;

    case STATE.FLYING:
      if (event === 'OUT_OF_BOUNDS') {
        gs.banana = null;
        gs.phase  = STATE.NEXT_TURN;
      } else if (event === 'HIT_TERRAIN' || event === 'HIT_GORILLA') {
        gs.phase = STATE.EXPLODING;
        gs.explodeTimer = 0.6;
      }
      break;

    case STATE.EXPLODING:
      if (event === 'EXPLODE_DONE') {
        if (gs.players[0].hp <= 0 || gs.players[1].hp <= 0) {
          gs.winner = gs.players[0].hp > 0 ? 0 : 1;
          gs.phase  = STATE.GAME_OVER;
        } else {
          gs.phase = STATE.NEXT_TURN;
        }
      }
      break;

    case STATE.NEXT_TURN:
      if (event === 'NEXT_TURN_DONE') {
        gs.turn              = 1 - gs.turn;
        gs.wind              = (Math.random() * 2 - 1) * WIND_MAX;
        gs.aim               = { angle: 45, power: 50 };
        gs.banana            = null;
        gs.particles         = [];
        gs.players[0].animState = 'idle';
        gs.players[1].animState = 'idle';
        gs.aiThinkTimer      = AI_THINK_DELAY;
        gs.phase             = STATE.AIMING;
      }
      break;
  }
}
```

- [ ] **Step 3: State Machine manuell in Console testen**

Öffne Browser-Console nach `npx serve .` und importiere:
```js
const m = await import('./state.js');
m.initGame();
console.assert(m.gs.phase === 'SETUP', 'start: SETUP');
m.transition('SETUP_DONE');
console.assert(m.gs.phase === 'AIMING', 'nach SETUP_DONE: AIMING');
m.transition('SHOOT');
console.assert(m.gs.phase === 'FLYING', 'nach SHOOT: FLYING');
m.transition('OUT_OF_BOUNDS');
console.assert(m.gs.phase === 'NEXT_TURN', 'nach OOB: NEXT_TURN');
m.transition('NEXT_TURN_DONE');
console.assert(m.gs.phase === 'AIMING', 'nach NEXT_TURN_DONE: AIMING');
console.log('Alle State-Tests bestanden');
```

Erwartet: `Alle State-Tests bestanden` ohne Fehler.

- [ ] **Step 4: Committen**

```bash
git add state.js
git commit -m "feat: state machine with transition logic"
```

---

## Task 3: Terrain-Generierung

**Files:**
- Modify: `terrain.js`
- Create: `test-terrain.js`

- [ ] **Step 1: `test-terrain.js` schreiben (Test zuerst)**

```js
import { generateTerrain, getHeight, getPixel } from './terrain.js';
import { CANVAS_W, CANVAS_H } from './constants.js';

function assert(cond, msg) {
  if (!cond) console.error(`FAIL: ${msg}`);
  else console.log(`PASS: ${msg}`);
}

generateTerrain();

// Höhe liegt im sinnvollen Bereich
let allInBounds = true;
for (let x = 0; x < CANVAS_W; x++) {
  const h = getHeight(x);
  if (h < 100 || h > 300) { allInBounds = false; break; }
}
assert(allInBounds, 'alle Höhen zwischen 100 und 300');

// Pixel unter der Oberfläche ist Terrain
const midX = Math.floor(CANVAS_W / 2);
const surfY = Math.floor(getHeight(midX));
assert(getPixel(midX, surfY + 10) === true, 'Pixel 10px unter Oberfläche ist Terrain');
assert(getPixel(midX, surfY - 10) === false, 'Pixel 10px über Oberfläche ist Luft');
assert(getPixel(-1, 0) === false, 'out-of-bounds links ist false');
assert(getPixel(CANVAS_W, 0) === false, 'out-of-bounds rechts ist false');

console.log('Terrain-Tests fertig');
```

- [ ] **Step 2: Test im Browser ausführen — Fehler erwarten**

```bash
# Server läuft noch, öffne Console:
```
```js
import('./test-terrain.js')
```

Erwartet: mehrere `FAIL`-Meldungen (Terrain gibt noch 400 zurück).

- [ ] **Step 3: `terrain.js` implementieren**

```js
import { CANVAS_W, CANVAS_H, COLORS } from './constants.js';

export const terrainH  = new Float32Array(CANVAS_W);
export const terrainPx = new Uint8Array(CANVAS_W * CANVAS_H);

let _imageDataDirty = true;
let _cachedImageData = null;

export function generateTerrain() {
  terrainPx.fill(0);
  for (let x = 0; x < CANVAS_W; x++) {
    const h = 190
      + Math.sin(x * 0.016)        * 40
      + Math.sin(x * 0.04  + 1.3)  * 20
      + Math.sin(x * 0.10  + 0.7)  * 10;
    terrainH[x] = h;
    for (let y = Math.floor(h); y < CANVAS_H; y++) {
      terrainPx[y * CANVAS_W + x] = 1;
    }
  }
  _imageDataDirty = true;
}

export function getHeight(x) {
  const xi = Math.max(0, Math.min(CANVAS_W - 1, Math.floor(x)));
  return terrainH[xi];
}

export function getPixel(x, y) {
  const xi = Math.floor(x);
  const yi = Math.floor(y);
  if (xi < 0 || xi >= CANVAS_W || yi < 0 || yi >= CANVAS_H) return false;
  return terrainPx[yi * CANVAS_W + xi] === 1;
}

export function carveExplosion(cx, cy, radius) {
  const x0 = Math.max(0, Math.floor(cx - radius));
  const x1 = Math.min(CANVAS_W - 1, Math.ceil(cx + radius));
  const y0 = Math.max(0, Math.floor(cy - radius));
  const y1 = Math.min(CANVAS_H - 1, Math.ceil(cy + radius));
  const r2 = radius * radius;

  for (let x = x0; x <= x1; x++) {
    for (let y = y0; y <= y1; y++) {
      const dx = x - cx, dy = y - cy;
      if (dx * dx + dy * dy <= r2) terrainPx[y * CANVAS_W + x] = 0;
    }
    // Höhen-Array für diese Spalte neu berechnen
    let newH = CANVAS_H;
    for (let y = 0; y < CANVAS_H; y++) {
      if (terrainPx[y * CANVAS_W + x] === 1) { newH = y; break; }
    }
    terrainH[x] = newH;
  }
  _imageDataDirty = true;
}

function hexToRgb(hex) {
  return {
    r: parseInt(hex.slice(1, 3), 16),
    g: parseInt(hex.slice(3, 5), 16),
    b: parseInt(hex.slice(5, 7), 16),
  };
}

export function buildTerrainImageData(ctx) {
  if (!_imageDataDirty && _cachedImageData) return _cachedImageData;

  const img     = ctx.createImageData(CANVAS_W, CANVAS_H);
  const surface = hexToRgb(COLORS.SURFACE);
  const body    = hexToRgb(COLORS.TERRAIN);

  for (let x = 0; x < CANVAS_W; x++) {
    const surfY = Math.floor(terrainH[x]);
    for (let y = surfY; y < CANVAS_H; y++) {
      if (terrainPx[y * CANVAS_W + x] === 1) {
        const i = (y * CANVAS_W + x) * 4;
        const c = (y === surfY) ? surface : body;
        img.data[i]     = c.r;
        img.data[i + 1] = c.g;
        img.data[i + 2] = c.b;
        img.data[i + 3] = 255;
      }
    }
  }
  _cachedImageData  = img;
  _imageDataDirty   = false;
  return img;
}
```

- [ ] **Step 4: Tests erneut ausführen — PASS erwarten**

```js
import('./test-terrain.js')
```

Erwartet: alle Zeilen mit `PASS:`.

- [ ] **Step 5: Committen**

```bash
git add terrain.js test-terrain.js
git commit -m "feat: terrain generation with pixel buffer and carve explosion"
```

---

## Task 4: Terrain-Renderer

**Files:**
- Modify: `renderer.js`
- Modify: `main.js`

- [ ] **Step 1: `renderer.js` mit Himmel + Terrain implementieren**

```js
import { CANVAS_W, CANVAS_H, COLORS } from './constants.js';
import { buildTerrainImageData } from './terrain.js';
import { STATE } from './state.js';

export function render(ctx, gs) {
  drawSky(ctx);
  drawTerrain(ctx);
}

function drawSky(ctx) {
  const grad = ctx.createLinearGradient(0, 0, 0, CANVAS_H);
  grad.addColorStop(0, COLORS.SKY_TOP);
  grad.addColorStop(1, COLORS.SKY_BOTTOM);
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);
}

function drawTerrain(ctx) {
  const img = buildTerrainImageData(ctx);
  if (img) ctx.putImageData(img, 0, 0);
}
```

- [ ] **Step 2: `main.js` updaten — Terrain generieren + rendern**

```js
import { CANVAS_W, CANVAS_H } from './constants.js';
import { gs, STATE, transition, initGame } from './state.js';
import { generateTerrain } from './terrain.js';
import { render } from './renderer.js';

const canvas = document.getElementById('game');
const ctx    = canvas.getContext('2d');
canvas.width  = CANVAS_W;
canvas.height = CANVAS_H;

initGame(false); // false = P2 ist Mensch

let lastTime = 0;

function tick(timestamp) {
  const dt = Math.min((timestamp - lastTime) / 1000, 0.05);
  lastTime = timestamp;

  if (gs.phase === STATE.SETUP) {
    generateTerrain();
    transition('SETUP_DONE');
  }

  render(ctx, gs);
  requestAnimationFrame(tick);
}

requestAnimationFrame(tick);
```

- [ ] **Step 3: Visuell im Browser verifizieren**

Erwartetes Bild: Neon-Night Himmel (dunkelblau Gradient) + Hügellandschaft mit blauer Oberfläche (#53d8fb Linie) und dunklerem Terrain-Körper (#0f3460).

- [ ] **Step 4: Committen**

```bash
git add renderer.js main.js
git commit -m "feat: terrain and sky rendering"
```

---

## Task 5: Gorilla-Sprites

**Files:**
- Modify: `gorilla.js`
- Modify: `renderer.js`
- Modify: `state.js` (Gorilla-Startpositionen)
- Modify: `main.js` (Gorilla-Placement in SETUP)

- [ ] **Step 1: `gorilla.js` implementieren**

```js
import { COLORS, GORILLA_W, GORILLA_H } from './constants.js';

export function drawGorilla(ctx, x, y, facing, animState) {
  // x/y = Boden-Mitte des Gorillas
  ctx.save();
  ctx.translate(x, y);
  if (facing === 'left') ctx.scale(-1, 1);

  const b = COLORS.GORILLA_BODY;
  const d = COLORS.GORILLA_DARK;

  // Beine
  ctx.fillStyle = d;
  ctx.fillRect(-20,  -20, 14, 20);  // linkes Bein
  ctx.fillRect(  6,  -20, 14, 20);  // rechtes Bein

  // Torso
  ctx.fillStyle = b;
  ctx.fillRect(-22,  -56, 44, 36);  // Rumpf

  // Arme
  if (animState === 'idle') {
    ctx.fillStyle = d;
    ctx.fillRect(-36,  -54, 14, 22);  // linker Arm hängt
    ctx.fillRect( 22,  -54, 14, 22);  // rechter Arm hängt
  } else {
    // throw: rechter Arm gehoben
    ctx.fillStyle = d;
    ctx.fillRect(-36,  -54, 14, 22);  // linker Arm hängt
    ctx.fillRect( 22,  -76, 14, 28);  // rechter Arm oben
  }

  // Hände
  ctx.fillStyle = d;
  ctx.fillRect(-40,  -38,  8,  8);  // linke Hand
  if (animState === 'idle') {
    ctx.fillRect( 32,  -38,  8,  8);  // rechte Hand unten
  } else {
    ctx.fillRect( 32,  -52,  8,  8);  // rechte Hand oben
  }

  // Kopf
  ctx.fillStyle = b;
  ctx.fillRect(-18,  -80, 36, 28);  // Kopf

  // Augen
  ctx.fillStyle = COLORS.GORILLA_EYES;
  ctx.fillRect( -12,  -72,  7,  7);
  ctx.fillRect(   5,  -72,  7,  7);

  // Pupillen
  ctx.fillStyle = '#000';
  ctx.fillRect( -10,  -70,  3,  3);
  ctx.fillRect(   7,  -70,  3,  3);

  ctx.restore();
}
```

- [ ] **Step 2: Gorilla-Positionen in `main.js` SETUP belegen**

Ersetze den SETUP-Block in `main.js`:

```js
if (gs.phase === STATE.SETUP) {
  generateTerrain();
  // Gorillas auf dem Terrain platzieren
  gs.players[0].x = 75;
  gs.players[0].y = getHeight(75);
  gs.players[1].x = CANVAS_W - 75;
  gs.players[1].y = getHeight(CANVAS_W - 75);
  gs.aiThinkTimer  = AI_THINK_DELAY;
  transition('SETUP_DONE');
}
```

Füge den Import hinzu:
```js
import { getHeight } from './terrain.js';
import { AI_THINK_DELAY } from './constants.js';
```

- [ ] **Step 3: Gorillas im Renderer zeichnen**

In `renderer.js` nach `drawTerrain(ctx)` hinzufügen:

```js
import { drawGorilla } from './gorilla.js';

// In render():
drawGorillas(ctx, gs);

// Neue Funktion:
function drawGorillas(ctx, gs) {
  const [p0, p1] = gs.players;
  drawGorilla(ctx, p0.x, p0.y, 'right', p0.animState);
  drawGorilla(ctx, p1.x, p1.y, 'left',  p1.animState);
}
```

- [ ] **Step 4: Visuell verifizieren**

Erwartetes Bild: Zwei braune Gorillas stehen auf dem Terrain, einer links (schaut rechts), einer rechts (schaut links).

- [ ] **Step 5: Committen**

```bash
git add gorilla.js renderer.js main.js
git commit -m "feat: gorilla sprites placed on terrain"
```

---

## Task 6: Physics Engine

**Files:**
- Modify: `physics.js`
- Create: `test-physics.js`

- [ ] **Step 1: `test-physics.js` schreiben (Test zuerst)**

```js
import { createBanana, stepBanana, simulateTrajectory } from './physics.js';
import { GRAVITY } from './constants.js';

function assert(cond, msg) {
  if (!cond) console.error(`FAIL: ${msg}`);
  else console.log(`PASS: ${msg}`);
}

// Test 1: Gravitation erhöht vy pro Sekunde um GRAVITY
const b = createBanana(640, 300, 90, 0, 0); // gerade hoch, kein Wind, Kraft 0
const initVY = b.vy;
stepBanana(b, 1.0);
assert(Math.abs(b.vy - (initVY + GRAVITY)) < 0.01, `vy wächst um GRAVITY (${GRAVITY}) pro Sekunde`);

// Test 2: Banane bewegt sich horizontal
const b2 = createBanana(100, 300, 0, 100, 0); // 0° = horizontal rechts
stepBanana(b2, 1.0);
assert(b2.x > 100, 'Banane bewegt sich nach rechts bei Winkel 0°');

// Test 3: Wind verschiebt Banane
const b3 = createBanana(320, 150, 90, 50, 30); // Wind +30
stepBanana(b3, 1.0);
const b4 = createBanana(320, 150, 90, 50, 0);
stepBanana(b4, 1.0);
assert(b3.x > b4.x, 'Wind +30 verschiebt Banane nach rechts');

// Test 4: simulateTrajectory gibt Impact zurück
const impact = simulateTrajectory(50, 150, 45, 80, 0);
assert(impact !== null, 'simulateTrajectory findet Impact-Punkt');
assert(typeof impact.x === 'number' && typeof impact.y === 'number', 'Impact hat x und y');

console.log('Physics-Tests fertig');
```

- [ ] **Step 2: Test ausführen — Fehler erwarten**

```js
import('./test-physics.js')
```

Erwartet: `FAIL`-Meldungen.

- [ ] **Step 3: `physics.js` implementieren**

```js
import { GRAVITY, CANVAS_W, CANVAS_H } from './constants.js';
import { getPixel } from './terrain.js';

const SUBSTEP_THRESHOLD = 200; // px/s — darüber: 4 Sub-Schritte gegen Tunneling

export function createBanana(x, y, angleDeg, power, wind) {
  const rad   = angleDeg * (Math.PI / 180);
  const speed = power * 4; // power 0-100 → 0-400 px/s (640px-Welt)
  return {
    x,
    y,
    vx: Math.cos(rad) * speed,
    vy: -Math.sin(rad) * speed,
    wind,
    rotation: 0,
  };
}

export function stepBanana(banana, dt) {
  const speed = Math.sqrt(banana.vx * banana.vx + banana.vy * banana.vy);
  const steps = speed > SUBSTEP_THRESHOLD ? 4 : 1;
  const sub   = dt / steps;

  for (let i = 0; i < steps; i++) {
    banana.vx += banana.wind * sub;
    banana.vy += GRAVITY * sub;
    banana.x  += banana.vx * sub;
    banana.y  += banana.vy * sub;
  }
  banana.rotation += 5 * dt;
}

export function simulateTrajectory(x, y, angleDeg, power, wind) {
  const b  = createBanana(x, y, angleDeg, power, wind);
  const dt = 0.016;
  for (let i = 0; i < 5000; i++) {
    stepBanana(b, dt);
    if (b.x < 0 || b.x >= CANVAS_W || b.y >= CANVAS_H) return null;
    if (getPixel(b.x, b.y)) return { x: b.x, y: b.y };
  }
  return null;
}
```

- [ ] **Step 4: Tests erneut ausführen — PASS erwarten**

```js
import('./test-physics.js')
```

Erwartet: alle `PASS:`.

- [ ] **Step 5: Committen**

```bash
git add physics.js test-physics.js
git commit -m "feat: banana physics with gravity, wind, and trajectory simulation"
```

---

## Task 7: Collision Detection

**Files:**
- Modify: `collision.js`
- Create: `test-collision.js`

- [ ] **Step 1: `test-collision.js` schreiben**

```js
import { checkOutOfBounds, checkGorilla } from './collision.js';
import { CANVAS_W, CANVAS_H, GORILLA_W, GORILLA_H } from './constants.js';

function assert(cond, msg) {
  if (!cond) console.error(`FAIL: ${msg}`);
  else console.log(`PASS: ${msg}`);
}

// checkOutOfBounds
assert(checkOutOfBounds({ x: -1,          y: 180 }), 'OOB: links');
assert(checkOutOfBounds({ x: CANVAS_W +1, y: 180 }), 'OOB: rechts');
assert(checkOutOfBounds({ x: 320,         y: CANVAS_H + 1 }), 'OOB: unten');
assert(!checkOutOfBounds({ x: 320,        y: 180 }), 'in bounds: Mitte');
assert(!checkOutOfBounds({ x: 0,          y: 0 }), 'in bounds: Ecke oben-links');

// checkGorilla: Banane direkt auf Gorilla
const players = [
  { x: 100, y: 200 },
  { x: 500, y: 200 },
];
assert(checkGorilla({ x: 100, y: 160 }, players) === 0, 'Treffer auf P1');
assert(checkGorilla({ x: 500, y: 160 }, players) === 1, 'Treffer auf P2');
assert(checkGorilla({ x: 300, y: 160 }, players) === -1, 'kein Treffer in der Mitte');

console.log('Collision-Tests fertig');
```

- [ ] **Step 2: Test ausführen — Fehler erwarten**

```js
import('./test-collision.js')
```

- [ ] **Step 3: `collision.js` implementieren**

```js
import { CANVAS_W, CANVAS_H, GORILLA_W, GORILLA_H } from './constants.js';
import { getPixel } from './terrain.js';

export function checkOutOfBounds(banana) {
  return banana.x < 0 || banana.x > CANVAS_W || banana.y > CANVAS_H;
}

export function checkTerrain(banana) {
  return getPixel(banana.x, banana.y);
}

export function checkGorilla(banana, players) {
  for (let i = 0; i < players.length; i++) {
    const p  = players[i];
    const hw = GORILLA_W / 2;
    if (
      banana.x >= p.x - hw &&
      banana.x <= p.x + hw &&
      banana.y >= p.y - GORILLA_H &&
      banana.y <= p.y
    ) return i;
  }
  return -1;
}
```

- [ ] **Step 4: Tests ausführen — PASS erwarten**

```js
import('./test-collision.js')
```

- [ ] **Step 5: Committen**

```bash
git add collision.js test-collision.js
git commit -m "feat: collision detection for terrain, gorilla AABB, and out-of-bounds"
```

---

## Task 8: Input-Handler & AIMING-State

**Files:**
- Modify: `main.js`

- [ ] **Step 1: Keyboard-State und Handler in `main.js` hinzufügen**

Füge nach den Imports in `main.js` ein:

```js
const keys = {};
window.addEventListener('keydown', e => {
  keys[e.code] = true;
  e.preventDefault();
});
window.addEventListener('keyup', e => { keys[e.code] = false; });
```

- [ ] **Step 2: `processAimingInput(dt)` Funktion in `main.js` schreiben**

```js
const AIM_SPEED   = 60;  // Grad/Sekunde
const POWER_SPEED = 40;  // Einheiten/Sekunde

function processAimingInput(dt) {
  if (gs.phase !== STATE.AIMING) return;
  if (gs.players[gs.turn].isAI) return;  // KI steuert selbst

  if (keys['ArrowLeft'])  gs.aim.angle = Math.min(180, gs.aim.angle + AIM_SPEED * dt);
  if (keys['ArrowRight']) gs.aim.angle = Math.max(0,   gs.aim.angle - AIM_SPEED * dt);
  if (keys['ArrowUp'])    gs.aim.power = Math.min(100, gs.aim.power + POWER_SPEED * dt);
  if (keys['ArrowDown'])  gs.aim.power = Math.max(5,   gs.aim.power - POWER_SPEED * dt);

  if (keys['Space']) {
    keys['Space'] = false;  // einmaliger Auslöser
    fireShot();
  }
}
```

- [ ] **Step 3: `fireShot()` in `main.js` schreiben**

```js
import { createBanana } from './physics.js';
import { GORILLA_H } from './constants.js';

function fireShot() {
  const shooter = gs.players[gs.turn];
  const facing  = gs.turn === 0 ? 1 : -1;  // P1 schießt rechts, P2 links
  const angle   = gs.turn === 0 ? gs.aim.angle : 180 - gs.aim.angle;

  gs.banana = createBanana(
    shooter.x,
    shooter.y - GORILLA_H * 0.6,  // Wurfhöhe (Arm)
    angle,
    gs.aim.power,
    gs.wind,
  );
  transition('SHOOT');
}
```

- [ ] **Step 4: `processAimingInput` in den Game Loop einbinden**

Im `tick`-Handler, nach dem SETUP-Block und vor `render(ctx, gs)`:

```js
processAimingInput(dt);
```

- [ ] **Step 5: Verifizieren**

- Öffne Browser, drücke `←` / `→` / `↑` / `↓` — prüfe in Console: `gs.aim` ändert sich.
- Drücke `Space` — prüfe: `gs.phase === 'FLYING'`.

- [ ] **Step 6: Committen**

```bash
git add main.js
git commit -m "feat: keyboard input for aiming angle, power, and shoot"
```

---

## Task 9: Bananen-Flug (FLYING State)

**Files:**
- Modify: `main.js`
- Modify: `renderer.js`

- [ ] **Step 1: FLYING-Update-Logik in `main.js` hinzufügen**

Füge in die `tick`-Funktion nach `processAimingInput(dt)` ein:

```js
import { stepBanana } from './physics.js';
import { checkOutOfBounds, checkTerrain, checkGorilla } from './collision.js';

// ...

function processFlight(dt) {
  if (gs.phase !== STATE.FLYING || !gs.banana) return;

  stepBanana(gs.banana, dt);

  if (checkOutOfBounds(gs.banana)) {
    transition('OUT_OF_BOUNDS');
    return;
  }
  if (checkTerrain(gs.banana)) {
    transition('HIT_TERRAIN');
    return;
  }
  const hitIdx = checkGorilla(gs.banana, gs.players);
  if (hitIdx !== -1) {
    gs.players[hitIdx].hp = Math.max(0, gs.players[hitIdx].hp - 30);
    transition('HIT_GORILLA');
  }
}
```

Und im `tick`-Loop:
```js
processFlight(dt);
```

- [ ] **Step 2: NEXT_TURN automatisch verarbeiten**

```js
function processNextTurn() {
  if (gs.phase !== STATE.NEXT_TURN) return;
  transition('NEXT_TURN_DONE');
}
```

Im `tick`-Loop:
```js
processNextTurn();
```

- [ ] **Step 3: Banane im Renderer zeichnen**

In `renderer.js` nach `drawGorillas()` aufrufen:

```js
function drawBanana(ctx, banana) {
  if (!banana) return;
  ctx.save();
  ctx.translate(banana.x, banana.y);
  ctx.rotate(banana.rotation);
  ctx.fillStyle = COLORS.BANANA;
  ctx.fillRect(-4, -4, 8, 8);  // kleines Rechteck, ~8×8px
  ctx.restore();
}
```

In `render()`:
```js
drawBanana(ctx, gs.banana);
```

- [ ] **Step 4: Verifizieren**

- Schieß mit `Space` ab — die Banane fliegt sichtbar über den Screen.
- Treffer auf Terrain: Banane verschwindet, Spieler wechselt (kein Loch noch, kommt in Task 10).
- Out of Bounds: Spieler wechselt.

- [ ] **Step 5: Committen**

```bash
git add main.js renderer.js
git commit -m "feat: banana flight with collision detection and turn switching"
```

---

## Task 10: Explosions-System & Partikel

**Files:**
- Modify: `particles.js`
- Modify: `main.js`
- Modify: `renderer.js`

- [ ] **Step 1: `particles.js` implementieren**

```js
import { COLORS, CANVAS_H } from './constants.js';

export function createExplosionParticles(cx, cy) {
  const particles = [];
  for (let i = 0; i < 35; i++) {
    const angle = Math.random() * Math.PI * 2;
    const speed = 60 + Math.random() * 220;
    particles.push({
      x:     cx,
      y:     cy,
      vx:    Math.cos(angle) * speed,
      vy:    Math.sin(angle) * speed - 120,  // leichter Aufwärts-Bias
      life:  1.0,
      color: COLORS.PARTICLE[Math.floor(Math.random() * COLORS.PARTICLE.length)],
      size:  3 + Math.random() * 6,
    });
  }
  return particles;
}

export function stepParticles(particles, dt) {
  for (const p of particles) {
    p.x    += p.vx * dt;
    p.y    += p.vy * dt;
    p.vy   += 300 * dt;  // Gravitation auf Partikel
    p.life -= dt / 1.5;  // verblasst in ~1,5s
  }
  return particles.filter(p => p.life > 0);
}
```

- [ ] **Step 2: EXPLODING-Logik in `main.js` hinzufügen**

Füge `triggerExplosion` und `processExploding` hinzu:

```js
import { carveExplosion, getHeight } from './terrain.js';
import { createExplosionParticles, stepParticles } from './particles.js';
import { EXPLOSION_RADIUS, GORILLA_HP } from './constants.js';

// directHitIdx: Index des Gorillas mit Direkttreffer (-1 = kein Direkttreffer)
function triggerExplosion(cx, cy, directHitIdx = -1) {
  carveExplosion(cx, cy, EXPLOSION_RADIUS);
  gs.particles = [...gs.particles, ...createExplosionParticles(cx, cy)];

  for (let i = 0; i < gs.players.length; i++) {
    const p  = gs.players[i];
    if (i === directHitIdx) {
      // Direkttreffer: -30 HP
      p.hp = Math.max(0, p.hp - 30);
    } else {
      // Splash-Schaden: Gorilla innerhalb Explosions-Radius → -10 HP
      const dx   = p.x - cx;
      const dy   = (p.y - GORILLA_H / 2) - cy;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist <= EXPLOSION_RADIUS) {
        p.hp = Math.max(0, p.hp - 10);
      }
    }
  }

  gs.banana = null;
}

function processExploding(dt) {
  if (gs.phase !== STATE.EXPLODING) return;

  gs.particles    = stepParticles(gs.particles, dt);
  gs.explodeTimer = Math.max(0, gs.explodeTimer - dt);

  if (gs.explodeTimer <= 0 && gs.particles.length === 0) {
    // Gorillas auf neues Terrain-Level snappen
    for (const p of gs.players) {
      p.y = getHeight(p.x);
    }
    transition('EXPLODE_DONE');
  }
}
```

Ändere `processFlight`: nach `transition('HIT_TERRAIN')` und `transition('HIT_GORILLA')` jeweils `triggerExplosion` aufrufen:

```js
if (checkTerrain(gs.banana)) {
  triggerExplosion(gs.banana.x, gs.banana.y, -1);  // kein Direkttreffer, nur Splash
  transition('HIT_TERRAIN');
  return;
}
const hitIdx = checkGorilla(gs.banana, gs.players);
if (hitIdx !== -1) {
  triggerExplosion(gs.banana.x, gs.banana.y, hitIdx);  // Direkttreffer: -30 HP via triggerExplosion
  transition('HIT_GORILLA');
}
```

Im `tick`-Loop ergänzen:
```js
processExploding(dt);
```

- [ ] **Step 3: Partikel im Renderer zeichnen**

In `renderer.js`:

```js
function drawParticles(ctx, particles) {
  for (const p of particles) {
    ctx.globalAlpha = Math.max(0, p.life);
    ctx.fillStyle   = p.color;
    ctx.fillRect(p.x - p.size / 2, p.y - p.size / 2, p.size, p.size);
  }
  ctx.globalAlpha = 1;
}
```

In `render()` nach `drawBanana`:
```js
drawParticles(ctx, gs.particles);
```

- [ ] **Step 4: Visuell verifizieren**

- Banane trifft Terrain → Loch erscheint + Partikel-Explosion in Neon-Farben.
- Partikel verblassen nach ~1,5s.
- Nach der Explosion ist das Loch dauerhaft im Terrain sichtbar.
- Gorilla fällt in Loch → snappt auf neues Terrain-Level.

- [ ] **Step 5: Committen**

```bash
git add particles.js main.js renderer.js
git commit -m "feat: explosion carves terrain hole and spawns neon particles"
```

---

## Task 11: Game-Loop vervollständigen (GAME_OVER)

**Files:**
- Modify: `renderer.js`
- Modify: `main.js`

- [ ] **Step 1: GAME_OVER-Screen in `renderer.js` hinzufügen**

```js
function drawGameOver(ctx, gs) {
  if (gs.phase !== STATE.GAME_OVER) return;

  // Abdunkeln
  ctx.fillStyle = 'rgba(0,0,0,0.6)';
  ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);

  // Gewinner-Text
  ctx.fillStyle    = COLORS.TEXT;
  ctx.font         = 'bold 64px monospace';
  ctx.textAlign    = 'center';
  ctx.fillText(`${gs.players[gs.winner].name} gewinnt!`, CANVAS_W / 2, CANVAS_H / 2 - 40);

  ctx.font      = '28px monospace';
  ctx.fillStyle = COLORS.SURFACE;
  ctx.fillText('Leertaste: Neues Spiel', CANVAS_W / 2, CANVAS_H / 2 + 30);

  ctx.textAlign = 'left';
}
```

In `render()` ganz am Ende:
```js
drawGameOver(ctx, gs);
```

- [ ] **Step 2: Neues Spiel bei Space auf GAME_OVER**

In `main.js` — in `processAimingInput` oder separat:

```js
function processGameOver() {
  if (gs.phase !== STATE.GAME_OVER) return;
  if (keys['Space']) {
    keys['Space'] = false;
    initGame(gs.players[1].isAI);
    generateTerrain();
    gs.players[0].x = 75;
    gs.players[0].y = getHeight(75);
    gs.players[1].x = CANVAS_W - 75;
    gs.players[1].y = getHeight(CANVAS_W - 75);
    gs.aiThinkTimer  = AI_THINK_DELAY;
    transition('SETUP_DONE');
  }
}
```

Im `tick`-Loop:
```js
processGameOver();
```

- [ ] **Step 3: Verifizieren**

- Spiel vollständig durchspielen (einen Gorilla auf 0 HP bringen).
- GAME_OVER-Screen erscheint mit Gewinner-Name.
- Leertaste startet neues Spiel mit neuem Terrain.

- [ ] **Step 4: Committen**

```bash
git add renderer.js main.js
git commit -m "feat: game over screen with winner display and new game restart"
```

---

## Task 12: UI-Overlay

**Files:**
- Modify: `ui.js`
- Modify: `main.js`

- [ ] **Step 1: `ui.js` implementieren**

```js
import { CANVAS_W, CANVAS_H, COLORS, GORILLA_HP, WIND_MAX } from './constants.js';
import { STATE } from './state.js';

const BAR_W = 200;
const BAR_H = 18;
const PAD   = 16;

export function drawUI(ctx, gs) {
  drawHPBars(ctx, gs);
  drawWindArrow(ctx, gs);
  if (gs.phase === STATE.AIMING && !gs.players[gs.turn].isAI) {
    drawAimInfo(ctx, gs);
  }
  drawTurnIndicator(ctx, gs);
}

function drawHPBars(ctx, gs) {
  // P1 links
  drawBar(ctx, PAD, PAD, gs.players[0].hp, gs.players[0].name, 'left');
  // P2 rechts
  drawBar(ctx, CANVAS_W - PAD - BAR_W, PAD, gs.players[1].hp, gs.players[1].name, 'right');
}

function drawBar(ctx, x, y, hp, name, align) {
  const pct      = Math.max(0, hp / GORILLA_HP);
  const barColor = pct > 0.5 ? COLORS.HP_GOOD : COLORS.HP_BAD;

  // Hintergrund
  ctx.fillStyle = 'rgba(0,0,0,0.5)';
  ctx.fillRect(x - 2, y - 2, BAR_W + 4, BAR_H + 20);

  // Balken
  ctx.fillStyle = '#333';
  ctx.fillRect(x, y + 16, BAR_W, BAR_H);
  ctx.fillStyle = barColor;
  ctx.fillRect(x, y + 16, Math.floor(BAR_W * pct), BAR_H);

  // Name + HP
  ctx.fillStyle  = COLORS.TEXT;
  ctx.font       = '13px monospace';
  ctx.textAlign  = align === 'left' ? 'left' : 'right';
  const tx       = align === 'left' ? x : x + BAR_W;
  ctx.fillText(`${name}  ${hp} HP`, tx, y + 12);
  ctx.textAlign  = 'left';
}

function drawWindArrow(ctx, gs) {
  const cx     = CANVAS_W / 2;
  const cy     = 30;
  const scale  = (gs.wind / WIND_MAX) * 60;
  const arrowX = cx + scale;

  ctx.strokeStyle = COLORS.WIND;
  ctx.lineWidth   = 3;
  ctx.beginPath();
  ctx.moveTo(cx, cy);
  ctx.lineTo(arrowX, cy);
  ctx.stroke();

  // Pfeilspitze
  if (Math.abs(scale) > 4) {
    const dir = scale > 0 ? 1 : -1;
    ctx.fillStyle = COLORS.WIND;
    ctx.beginPath();
    ctx.moveTo(arrowX,            cy);
    ctx.lineTo(arrowX - dir * 10, cy - 6);
    ctx.lineTo(arrowX - dir * 10, cy + 6);
    ctx.closePath();
    ctx.fill();
  }

  ctx.fillStyle  = COLORS.TEXT;
  ctx.font       = '11px monospace';
  ctx.textAlign  = 'center';
  ctx.fillText(`Wind: ${gs.wind.toFixed(1)}`, cx, cy + 20);
  ctx.textAlign  = 'left';
}

function drawAimInfo(ctx, gs) {
  const text = `Winkel: ${Math.round(gs.aim.angle)}°   Kraft: ${Math.round(gs.aim.power)}`;
  ctx.fillStyle = 'rgba(0,0,0,0.5)';
  ctx.fillRect(CANVAS_W / 2 - 160, CANVAS_H - 44, 320, 32);
  ctx.fillStyle  = COLORS.TEXT;
  ctx.font       = '16px monospace';
  ctx.textAlign  = 'center';
  ctx.fillText(text, CANVAS_W / 2, CANVAS_H - 22);
  ctx.textAlign  = 'left';
}

function drawTurnIndicator(ctx, gs) {
  if (gs.phase !== STATE.AIMING) return;
  const name = gs.players[gs.turn].name;
  ctx.fillStyle  = COLORS.SURFACE;
  ctx.font       = '14px monospace';
  ctx.textAlign  = 'center';
  ctx.fillText(`▶ ${name} ist dran`, CANVAS_W / 2, CANVAS_H - 55);
  ctx.textAlign  = 'left';
}
```

- [ ] **Step 2: `drawUI` in `main.js` aufrufen**

Füge zu Imports hinzu:
```js
import { drawUI } from './ui.js';
```

Im `tick`-Loop nach `render(ctx, gs)`:
```js
drawUI(ctx, gs);
```

- [ ] **Step 3: Visuell verifizieren**

- HP-Balken beider Spieler sichtbar, werden nach Treffer kleiner.
- Wind-Pfeil in der Mitte oben zeigt Richtung und Stärke.
- Während AIMING: Winkel und Kraft unten eingeblendet.
- Spieler-Name oben in der Mitte zeigt, wer dran ist.

- [ ] **Step 4: Committen**

```bash
git add ui.js main.js
git commit -m "feat: UI overlay with HP bars, wind arrow, and aim display"
```

---

## Task 13: KI-Gegner

**Files:**
- Modify: `ai.js`
- Modify: `main.js`

- [ ] **Step 1: `ai.js` implementieren**

```js
import { simulateTrajectory } from './physics.js';
import { AI_INACCURACY } from './constants.js';

export function calculateAIShot(shooter, target, wind) {
  const dx = target.x - shooter.x;
  const startY = shooter.y - 48;  // Wurfhöhe

  for (let power = 20; power <= 100; power += 4) {
    // Groben Winkel schätzen: flach wenn nah, steiler wenn weit
    const distFactor = Math.abs(dx) / 800;
    const baseAngle  = 20 + distFactor * 50;
    const direction  = dx > 0 ? 1 : -1;

    for (let aDelta = -30; aDelta <= 30; aDelta += 5) {
      const angle    = direction > 0
        ? baseAngle + aDelta
        : 180 - baseAngle - aDelta;
      const impact   = simulateTrajectory(shooter.x, startY, angle, power, wind);
      if (!impact) continue;

      const dist = Math.abs(impact.x - target.x);
      if (dist < 60) {
        // Treffer nah genug — 30% Ungenauigkeit hinzufügen
        const inaccuracy = (Math.random() - 0.5) * 2 * AI_INACCURACY;
        return {
          angle: angle + inaccuracy,
          power: Math.max(5, Math.min(100, power + (Math.random() - 0.5) * 20)),
        };
      }
    }
  }

  // Fallback: ungefährer Direktschuss
  const roughAngle = dx > 0 ? 45 : 135;
  return { angle: roughAngle, power: 60 };
}
```

- [ ] **Step 2: KI-Logik in `main.js` verdrahten**

Füge eine `processAI(dt)` Funktion hinzu:

```js
import { calculateAIShot } from './ai.js';

function processAI(dt) {
  if (gs.phase !== STATE.AIMING) return;
  const current = gs.players[gs.turn];
  if (!current.isAI) return;

  gs.aiThinkTimer -= dt;
  if (gs.aiThinkTimer > 0) return;

  const opponent = gs.players[1 - gs.turn];
  const shot     = calculateAIShot(current, opponent, gs.wind);
  gs.aim.angle   = shot.angle;
  gs.aim.power   = shot.power;
  fireShot();
}
```

Im `tick`-Loop nach `processAimingInput(dt)`:
```js
processAI(dt);
```

- [ ] **Step 3: KI aktivieren — Spielstart mit KI-Gegner**

In `main.js` — `initGame` auf `true` für P2 stellen:

```js
initGame(true);  // true = P2 ist KI
```

- [ ] **Step 4: Verifizieren**

- Spiel starten — P1 zielt manuell, P2 (KI) schießt nach 1,5s automatisch.
- KI trifft nicht immer, aber schießt in die richtige Richtung.
- Vollständige Runden-Schleife: P1 schießt → P2 KI schießt → ... bis GAME_OVER.
- `initGame(false)` testen für Hotseat-Modus.

- [ ] **Step 5: Finaler Commit**

```bash
git add ai.js main.js
git commit -m "feat: AI opponent with trajectory simulation and configurable inaccuracy"
```

---

## Abschluss-Verifizierung

Nach Task 13 manuell prüfen:

- [ ] Vollständiges Hotseat-Spiel (`initGame(false)`): P1 vs P2, Terrain zerstörbar, HP-System, GAME_OVER, Neustart
- [ ] Vollständiges KI-Spiel (`initGame(true)`): P1 vs KI, KI schießt automatisch mit 1,5s Delay
- [ ] Explosion hinterlässt dauerhaftes Loch im Terrain
- [ ] Partikel in Neon-Farben erscheinen und verblassen
- [ ] HP-Balken aktualisieren sich korrekt
- [ ] Wind-Pfeil stimmt mit Bananen-Drift überein
- [ ] GAME_OVER mit korrektem Gewinnernamen
- [ ] Neustart generiert frisches Terrain
- [ ] Keine Console-Fehler während normalem Spielverlauf
