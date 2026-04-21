# Spec: Gorilla Falling-State

**Datum:** 2026-04-21  
**Status:** Genehmigt

---

## Überblick

Wenn Terrain unter einem Gorilla durch eine Explosion zerstört wird, soll der Gorilla physikalisch nach unten fallen. Das Spiel pausiert während des Falls. Bei Landung wird moderater Fallschaden angewendet. Kettenfälle (mehrfach hintereinander fallen) sind unterstützt.

---

## State Machine

Neuer State `FALLING` wird zwischen `EXPLODING` und `NEXT_TURN` eingefügt:

```
EXPLODING → FALLING (wenn ≥1 Gorilla airborne) → NEXT_TURN / GAME_OVER
           ↑___________________________|  (Kettenfall: nach Landung erneut prüfen)
```

Events: `FALL` (EXPLODING → FALLING), `LAND` (FALLING → NEXT_TURN oder GAME_OVER).

---

## Neue Felder in `gs`

| Feld | Typ | Bedeutung |
|---|---|---|
| `fallingIdx` | `number` | Index des fallenden Gorillas (0 oder 1), -1 wenn keiner fällt |
| `fallStartY` | `number` | Y-Position des Gorillas zu Beginn des Falls |
| `fallingVY` | `number` | Aktuelle Vertikalgeschwindigkeit (px/s) |

---

## Physik

Der Gorilla fällt mit Gravitation, kein Wind-Einfluss:

```js
gs.fallingVY += GRAVITY * dt;
gorilla.y += gs.fallingVY * dt;
```

**Terrain-Kollision:** Bodenhöhe unter dem Gorilla wird über `terrainH[Math.floor(gorilla.x + GORILLA_W / 2)]` abgefragt. Wenn `gorilla.y + GORILLA_H >= terrainHeight` → Landung.

**"In der Luft"-Erkennung:** `isGorillaAirborne(gs, idx)` prüft ob 1px unterhalb des Gorilla-Fußes kein Terrain vorhanden ist. Wird nach jeder Explosion für beide Gorillas aufgerufen.

---

## Schadensformel

Fallschaden tritt nur ab einer Mindesthöhe von 20 px auf:

```js
const fallHeight = gorilla.y - gs.fallStartY;
if (fallHeight > 20) {
    const dmg = Math.min(Math.floor(fallHeight * 0.15), 20);
    gorilla.hp -= dmg;
}
```

Beispiele:
- 20 px → ~3 HP
- 80 px → 12 HP
- 134+ px → 20 HP (Maximum)

Fallschaden kann zum Tod führen (HP ≤ 0 → `GAME_OVER`).

---

## Neue/geänderte Dateien

| Datei | Änderung |
|---|---|
| `state.js` | `FALLING` State + Events `FALL`/`LAND`; neue `gs`-Felder |
| `collision.js` | `isGorillaAirborne(gs, idx)` |
| `physics.js` | `stepGorillaFall(gs, dt)` — Gravitation + Terrain-Check, gibt `{ landed: bool }` zurück |
| `main.js` | `processFalling(dt)`; Aufrufreihenfolge erweitern; Schaden + Tod-Check nach Landung |

---

## Aufrufreihenfolge (main.js)

```
processAimingInput → processAI → processFlight →
processExploding → processFalling → processNextTurn → processGameOver →
render → drawUI
```

---

## Kettenfall-Logik

Nach Landung eines Gorillas prüft `processFalling()` erneut `isGorillaAirborne()` für beide Gorillas. Ist noch einer in der Luft → erneut `FALL` triggern. Erst wenn beide stabil → `LAND`.

---

## Gorilla-Sprite

Keine Änderung am Sprite während des Fallens (Idle-Pose bleibt).

---

## Nicht im Scope

- Simultanes Fallen beider Gorillas (sequenziell stattdessen)
- Visuelle Fall-Animation / Rotation
- Wind-Einfluss auf fallende Gorillas
