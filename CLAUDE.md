# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Dev Server

```bash
npx serve .
```

Öffne http://localhost:3000 — kein Build-Step nötig, ES-Module direkt im Browser.

## Architecture

Rundenbasiertes Artillery-Game (HTML5 Canvas, Vanilla JS ES-Module, kein Build-Tool). Canvas 1280×720, Neon-Night-Farbpalette.

**State Machine** (`state.js`) treibt die gesamte Logik über einen mutablen Singleton `gs`:

```
SETUP → AIMING → FLYING → EXPLODING → NEXT_TURN → GAME_OVER
```

`main.js` betreibt den `requestAnimationFrame`-Loop: `update(dt)` → `render(ctx, gs)` → `drawUI(ctx, gs)`.

**Terrain** (`terrain.js`) hält zwei parallele Datenstrukturen: `terrainH[x]` (1D Height-Array) und `terrainPx` (Uint8Array Pixel-Buffer). Beide müssen nach `carveExplosion()` konsistent sein. `buildTerrainImageData()` ist gecacht — wird nur bei Änderung neu gebaut.

**Module und ihre Verantwortlichkeit:**

| Datei | Zuständig für |
|---|---|
| `constants.js` | Farben, Canvas-Größe, Physik-Konstanten |
| `state.js` | `gs` Singleton, `transition(event)`, `initGame()` |
| `terrain.js` | Generierung, Pixel-Buffer, `carveExplosion`, ImageData-Cache |
| `particles.js` | Partikel erzeugen (`createExplosionParticles`) und bewegen (`stepParticles`) |
| `physics.js` | `createBanana`, `stepBanana`, `simulateTrajectory` |
| `collision.js` | `checkOutOfBounds`, `checkTerrain`, `checkGorilla` (AABB) |
| `gorilla.js` | Prozedurales Zeichnen (Idle / Throw, ~64×80 px) |
| `renderer.js` | Layer-Reihenfolge: Himmel → Terrain → Gorillas → Banane → Partikel |
| `ui.js` | HP-Balken, Wind-Pfeil, Winkel/Kraft-Anzeige |
| `ai.js` | `calculateAIShot` via `simulateTrajectory` + 30 % Ungenauigkeit |
| `main.js` | Game Loop, Keyboard-Input, Orchestrierung |

## Schaden-System

- **Direkttreffer** (AABB): `-30 HP` via `triggerExplosion(cx, cy, hitIdx)`
- **Splash** (innerhalb Explosions-Radius, kein Direkttreffer): `-10 HP`
- Beide Fälle werden in `triggerExplosion()` in `main.js` berechnet — nicht in `collision.js`

## Tests

Test-Dateien (`test-terrain.js`, `test-physics.js`, `test-collision.js`) im Browser-Console ausführen:

```js
import('./test-terrain.js')
import('./test-physics.js')
import('./test-collision.js')
```

## Docs

- Spec: `docs/superpowers/specs/2026-04-19-modern-retro-gorillas-design.md`
- Implementierungsplan: `docs/superpowers/plans/2026-04-19-modern-retro-gorillas.md`
