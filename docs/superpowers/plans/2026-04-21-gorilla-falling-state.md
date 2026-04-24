# Gorilla Falling-State Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [x]`) syntax for tracking.

**Goal:** Gorillas fallen physikalisch nach unten wenn Terrain unter ihnen weggesprengt wird, mit moderatem Fallschaden und Unterstützung für Kettenfälle.

**Architecture:** Neuer `FALLING` State in der State Machine zwischen `EXPLODING` und `NEXT_TURN`. `isGorillaAirborne()` erkennt ob ein Gorilla in der Luft hängt; `stepGorillaFall()` bewegt ihn mit Gravitation nach unten. `processFalling()` in `main.js` übernimmt Schadensberechnung und Kettenfall-Logik.

**Tech Stack:** Vanilla JS ES-Module, HTML5 Canvas, keine Abhängigkeiten

---

## Datei-Übersicht

| Datei | Änderung |
|---|---|
| `state.js` | `FALLING` zu `STATE` hinzufügen; neue `gs`-Felder; Transitionen `FALL` und `LAND` |
| `collision.js` | `isGorillaAirborne(gs, idx)` hinzufügen; `getHeight` importieren |
| `physics.js` | `stepGorillaFall(gs, dt)` hinzufügen; `getHeight` importieren |
| `main.js` | `processFalling(dt)` hinzufügen; `processExploding` anpassen; neue Imports |
| `test-falling.js` | Tests für `isGorillaAirborne` und `stepGorillaFall` |

---

### Task 1: State Machine erweitern (`state.js`)

**Files:**
- Modify: `state.js`

- [x] **Schritt 1: `FALLING` zu STATE hinzufügen**

In `state.js` Zeile 9 nach `GAME_OVER`:

```js
export const STATE = {
  SETUP:      'SETUP',
  AIMING:     'AIMING',
  FLYING:     'FLYING',
  EXPLODING:  'EXPLODING',
  FALLING:    'FALLING',
  NEXT_TURN:  'NEXT_TURN',
  GAME_OVER:  'GAME_OVER',
};
```

- [x] **Schritt 2: Neue `gs`-Felder hinzufügen**

In `gs` (Zeile 12) drei neue Felder ergänzen:

```js
export const gs = {
  phase:        STATE.SETUP,
  turn:         0,
  players: [
    { hp: GORILLA_HP, isAI: false, name: 'Spieler 1', x: 0, y: 0, animState: 'idle' },
    { hp: GORILLA_HP, isAI: false, name: 'Spieler 2', x: 0, y: 0, animState: 'idle' },
  ],
  aim:          { angle: 45, power: 50 },
  wind:         0,
  banana:       null,
  particles:    [],
  explodeTimer: 0,
  aiThinkTimer: 0,
  winner:       -1,
  fallingIdx:   -1,
  fallStartY:   0,
  fallingVY:    0,
};
```

- [x] **Schritt 3: `initGame` Reset ergänzen**

In `initGame` (Zeile 28) nach `gs.winner = -1`:

```js
gs.fallingIdx   = -1;
gs.fallStartY   = 0;
gs.fallingVY    = 0;
```

- [x] **Schritt 4: `FALL`-Event in EXPLODING-Case und neuen FALLING-Case hinzufügen**

Den `transition`-Switch in `state.js` (Zeile 40) anpassen. Den EXPLODING-Case und danach den neuen FALLING-Case einfügen:

```js
    case STATE.EXPLODING:
      if (event === 'EXPLODE_DONE') {
        if (gs.players[0].hp <= 0 || gs.players[1].hp <= 0) {
          gs.winner = gs.players[0].hp > 0 ? 0 : 1;
          gs.phase  = STATE.GAME_OVER;
        } else {
          gs.phase = STATE.NEXT_TURN;
        }
      }
      if (event === 'FALL') {
        gs.phase = STATE.FALLING;
      }
      break;

    case STATE.FALLING:
      if (event === 'LAND') {
        if (gs.players[0].hp <= 0 || gs.players[1].hp <= 0) {
          gs.winner = gs.players[0].hp > 0 ? 0 : 1;
          gs.phase  = STATE.GAME_OVER;
        } else {
          gs.phase = STATE.NEXT_TURN;
        }
      }
      break;
```

- [x] **Schritt 5: Committen**

```bash
git add state.js
git commit -m "feat: add FALLING state, gs fields, and FALL/LAND transitions"
```

---

### Task 2: Tests schreiben (`test-falling.js`)

**Files:**
- Create: `test-falling.js`

- [x] **Schritt 1: Testdatei erstellen**

```js
import { isGorillaAirborne } from './collision.js';
import { stepGorillaFall } from './physics.js';
import { GRAVITY } from './constants.js';
import { generateTerrain } from './terrain.js';

function assert(cond, msg) {
  if (!cond) console.error(`FAIL: ${msg}`);
  else       console.log(`PASS: ${msg}`);
}

generateTerrain();

// --- isGorillaAirborne ---

// Gorilla weit über Terrain (y=10) → airborne
const gs1 = { players: [{ x: 100, y: 10 }, { x: 500, y: 10 }] };
assert(isGorillaAirborne(gs1, 0) === true,  'Gorilla bei y=10 ist in der Luft');

// Gorilla bei y=400 (unterhalb jedes möglichen Terrains) → nicht airborne
const gs2 = { players: [{ x: 100, y: 400 }, { x: 500, y: 400 }] };
assert(isGorillaAirborne(gs2, 0) === false, 'Gorilla bei y=400 ist nicht in der Luft');

// --- stepGorillaFall ---

// Gravitation erhöht fallingVY pro Frame
const gs3 = {
  players: [{ x: 320, y: 50 }],
  fallingIdx: 0,
  fallingVY: 0,
};
const r1 = stepGorillaFall(gs3, 0.1);
assert(Math.abs(gs3.fallingVY - GRAVITY * 0.1) < 0.01, 'fallingVY wächst um GRAVITY * dt');
assert(gs3.players[0].y > 50, 'Gorilla bewegt sich nach unten');

// Landung: Gorilla landet und wird auf Terrain gesnappt
const gs4 = {
  players: [{ x: 320, y: 1000 }], // weit unterhalb
  fallingIdx: 0,
  fallingVY: 100,
};
const r2 = stepGorillaFall(gs4, 0.016);
assert(r2.landed === true, 'Gorilla landet wenn er das Terrain erreicht');
assert(gs4.players[0].y <= 1000, 'Gorilla y wird auf Terrain gesnappt (nicht weiter unten)');

// Kein Lande-Signal wenn noch in der Luft
const gs5 = {
  players: [{ x: 320, y: 50 }],
  fallingIdx: 0,
  fallingVY: 0,
};
const r3 = stepGorillaFall(gs5, 0.016);
assert(r3.landed === false, 'Kein Lande-Signal wenn noch in der Luft');

console.log('Falling-Tests fertig');
```

- [x] **Schritt 2: Tests im Browser ausführen (erwarte Fehler)**

Dev-Server starten falls noch nicht läuft:
```bash
npx serve .
```

Im Browser-Console:
```js
import('./test-falling.js')
```

Erwartete Ausgabe: Import-Fehler weil `isGorillaAirborne` und `stepGorillaFall` noch nicht existieren.

---

### Task 3: `isGorillaAirborne` implementieren (`collision.js`)

**Files:**
- Modify: `collision.js`

- [x] **Schritt 1: Import erweitern**

Zeile 1 in `collision.js` ändern — `getHeight` hinzufügen:

```js
import { CANVAS_W, CANVAS_H, GORILLA_W, GORILLA_H } from './constants.js';
import { getPixel, getHeight } from './terrain.js';
```

- [x] **Schritt 2: `isGorillaAirborne` am Ende der Datei hinzufügen**

```js
export function isGorillaAirborne(gs, idx) {
  const p = gs.players[idx];
  return p.y < getHeight(p.x);
}
```

- [x] **Schritt 3: Tests laufen lassen**

Im Browser-Console:
```js
import('./test-falling.js')
```

Erwartete Ausgabe: Die `isGorillaAirborne`-Tests zeigen `PASS:`, die `stepGorillaFall`-Tests zeigen noch Fehler.

---

### Task 4: `stepGorillaFall` implementieren (`physics.js`)

**Files:**
- Modify: `physics.js`

- [x] **Schritt 1: Import erweitern**

Zeile 1 in `physics.js` ändern — `getHeight` hinzufügen:

```js
import { GRAVITY, CANVAS_W, CANVAS_H } from './constants.js';
import { getPixel, getHeight } from './terrain.js';
```

- [x] **Schritt 2: `stepGorillaFall` am Ende der Datei hinzufügen**

```js
export function stepGorillaFall(gs, dt) {
  const p = gs.players[gs.fallingIdx];
  gs.fallingVY += GRAVITY * dt;
  p.y += gs.fallingVY * dt;
  const groundY = getHeight(p.x);
  if (p.y >= groundY) {
    p.y = groundY;
    return { landed: true };
  }
  return { landed: false };
}
```

- [x] **Schritt 3: Alle Tests laufen lassen**

Im Browser-Console:
```js
import('./test-falling.js')
```

Erwartete Ausgabe: Alle Zeilen mit `PASS:`, abgeschlossen mit `Falling-Tests fertig`.

- [x] **Schritt 4: Committen**

```bash
git add collision.js physics.js test-falling.js
git commit -m "feat: isGorillaAirborne and stepGorillaFall with tests"
```

---

### Task 5: Integration in `main.js`

**Files:**
- Modify: `main.js`

- [x] **Schritt 1: Neue Imports hinzufügen**

Zeile 6–7 in `main.js` anpassen:

```js
import { checkOutOfBounds, checkTerrain, checkGorilla, isGorillaAirborne } from './collision.js';
```

Zeile 5 anpassen:

```js
import { createBanana, stepBanana, stepGorillaFall } from './physics.js';
```

- [x] **Schritt 2: `processExploding` anpassen**

Den bestehenden `processExploding`-Block (Zeile 120–133) ersetzen:

```js
function processExploding(dt) {
  if (gs.phase !== STATE.EXPLODING) return;

  gs.particles    = stepParticles(gs.particles, dt);
  gs.explodeTimer = Math.max(0, gs.explodeTimer - dt);

  if (gs.explodeTimer <= 0 && gs.particles.length === 0) {
    if (gs.players[0].hp <= 0 || gs.players[1].hp <= 0) {
      transition('EXPLODE_DONE');
      return;
    }
    for (let i = 0; i < gs.players.length; i++) {
      if (isGorillaAirborne(gs, i)) {
        gs.fallingIdx = i;
        gs.fallStartY = gs.players[i].y;
        gs.fallingVY  = 0;
        transition('FALL');
        return;
      }
    }
    for (const p of gs.players) p.y = getHeight(p.x);
    transition('EXPLODE_DONE');
  }
}
```

- [x] **Schritt 3: `processFalling` hinzufügen**

Nach `processExploding` und vor `processNextTurn` einfügen:

```js
function processFalling(dt) {
  if (gs.phase !== STATE.FALLING) return;

  const result = stepGorillaFall(gs, dt);
  if (!result.landed) return;

  const fallHeight = gs.players[gs.fallingIdx].y - gs.fallStartY;
  if (fallHeight > 20) {
    const dmg = Math.min(Math.floor(fallHeight * 0.15), 20);
    gs.players[gs.fallingIdx].hp = Math.max(0, gs.players[gs.fallingIdx].hp - dmg);
  }

  if (gs.players[0].hp <= 0 || gs.players[1].hp <= 0) {
    transition('LAND');
    return;
  }

  for (let i = 0; i < gs.players.length; i++) {
    if (isGorillaAirborne(gs, i)) {
      gs.fallingIdx = i;
      gs.fallStartY = gs.players[i].y;
      gs.fallingVY  = 0;
      return;
    }
  }

  transition('LAND');
}
```

- [x] **Schritt 4: `processFalling` in den `tick`-Loop einbauen**

In der `tick`-Funktion (Zeile ~170) nach `processExploding(dt)`:

```js
  processExploding(dt);
  processFalling(dt);
  processNextTurn();
```

- [x] **Schritt 5: Manuellen Smoke-Test durchführen**

Dev-Server öffnen: `http://localhost:3000`

Testszenario:
1. Spiel startet → beide Gorillas stehen auf Terrain
2. Schuss direkt neben einen Gorilla abfeuern → Terrain wegsprengen
3. Gorilla fällt ins Loch, landet, Fallschaden erscheint im HP-Balken
4. Nächster Zug läuft normal weiter
5. Kettenfall: Gorilla auf schmalem Vorsprung → erneute Explosion → zweimaliges Fallen

- [x] **Schritt 6: Committen**

```bash
git add main.js
git commit -m "feat: wire processFalling and update processExploding for falling gorillas"
```
