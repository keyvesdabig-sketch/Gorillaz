# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Dev Server

```bash
npx serve .
```

Öffne http://localhost:3000 — kein Build-Step nötig, ES-Module direkt im Browser.

## Architecture

Rundenbasiertes Artillery-Game (HTML5 Canvas, Vanilla JS ES-Module, kein Build-Tool). Interne Auflösung **640×360**, via CSS auf 1280×720 hochskaliert (`image-rendering: pixelated` — Retro-Pixel-Look, 4× weniger Pixel-Arbeit). Neon-Night-Farbpalette.

**State Machine** (`state.js`) treibt die gesamte Logik über einen mutablen Singleton `gs`:

```
SETUP → AIMING → FLYING → EXPLODING → NEXT_TURN → GAME_OVER
```

`main.js` betreibt den `requestAnimationFrame`-Loop. Pro Frame werden in dieser Reihenfolge aufgerufen:

```
processAimingInput(dt) → processAI(dt) → processFlight(dt) →
processExploding(dt) → processNextTurn() → processGameOver() →
render(ctx, gs) → drawUI(ctx, gs)
```

Jede `process*`-Funktion prüft zuerst via Early-Return ob ihre Phase aktiv ist.

**Terrain** (`terrain.js`) hält zwei parallele Datenstrukturen: `terrainH[x]` (1D Height-Array, 640 Einträge) und `terrainPx` (Uint8Array Pixel-Buffer, 640×360). Beide müssen nach `carveExplosion()` konsistent sein. `buildTerrainImageData()` ist gecacht — wird nur bei Änderung neu gebaut.

**Physics** (`physics.js`) verwendet Sub-Stepping: bei Geschwindigkeit > 200 px/s wird `stepBanana` in 4 Sub-Schritte aufgeteilt, um den Tunneling-Bug zu verhindern.

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
| `renderer.js` | Layer-Reihenfolge: Himmel → Terrain → Gorillas → Banane → Partikel → GAME_OVER-Overlay |
| `ui.js` | HP-Balken, Wind-Pfeil, Winkel/Kraft-Anzeige |
| `ai.js` | `calculateAIShot` via `simulateTrajectory` + 30 % Ungenauigkeit |
| `main.js` | Game Loop, Keyboard-Input, Orchestrierung |

## Spielmodus umschalten

In `main.js` Zeile `initGame(true/false)`:
- `true` — P2 ist KI (Standard)
- `false` — Hotseat (beide Spieler manuell)

## Tastatur-Controls

| Taste | Aktion |
|---|---|
| `←` / `→` | Winkel ändern (60°/s) |
| `↑` / `↓` | Kraft ändern (40/s) |
| `Leertaste` | Schießen / Neues Spiel (bei GAME_OVER) |

## Schaden-System

- **Direkttreffer** (AABB): `-30 HP` via `triggerExplosion(cx, cy, hitIdx)`
- **Splash** (innerhalb Explosions-Radius, kein Direkttreffer): `-10 HP`
- Beide Fälle werden in `triggerExplosion()` in `main.js` berechnet — nicht in `collision.js`

## Tests

Kein Build-Tool — Tests laufen ausschließlich im Browser-Console (nach `npx serve .`):

```js
import('./test-terrain.js')   // generateTerrain, getHeight, getPixel
import('./test-physics.js')   // stepBanana, Gravitation, Wind
import('./test-collision.js') // checkOutOfBounds, AABB-Gorilla
```

Erwartete Ausgabe: `PASS:` Zeilen, abgeschlossen mit `*-Tests fertig`.

## Docs

- Spec: `docs/superpowers/specs/2026-04-19-modern-retro-gorillas-design.md`
- Implementierungsplan: `docs/superpowers/plans/2026-04-19-modern-retro-gorillas.md`
