# Modern Retro Gorillas — Design Spec
**Datum:** 2026-04-19  
**Status:** Genehmigt

---

## Überblick

Rundenbasiertes Artillery-Game im Stil des Klassikers "Gorillas". HTML5 Canvas, Vanilla JS ES-Module, kein Build-Tool. Zwei Gorillas werfen Bananen auf einem zerstörbaren Terrain. Hotseat (2 lokale Spieler) und KI-Gegner.

---

## Entscheidungen

| Parameter | Entscheidung |
|---|---|
| Tech | HTML5 Canvas + Vanilla JS ES-Module, kein Build-Tool |
| Canvas | 1280 × 720 px |
| Farbpalette | Neon Night (#1a1a2e Hintergrund, #e94560 Akzent, #53d8fb Terrain, #ffe135 Banane) |
| Spielmodi | Hotseat (P1 vs P2) + KI-Gegner |
| Terrain | Prozedural (Noise-basiert), Pixel-Buffer, zerstörbar |
| MVP-Scope | Terrain + Banane + Explosion + HP — keine Bäume/Gebäude, kein Screen Shake |
| Gorilla-Sprites | ~64×80 px, Pixel-Art, 2 Zustände: Idle + Throw (3–4 Frames) |
| Lokaler Server | `npx serve .` |

---

## Dateistruktur

```
Gorillaz/
├── index.html       ← Einstiegspunkt, Canvas, UI-Overlay
├── main.js          ← Game Loop, initialisiert alle Module
├── state.js         ← State Machine
├── terrain.js       ← Terrain-Generierung, Pixel-Buffer, Explosion
├── physics.js       ← Projektil-Physik (vx, vy, Gravitation, Wind)
├── collision.js     ← Trefferprüfung (Terrain + Gorilla)
├── gorilla.js       ← Sprite-Daten, Animations-Frames
├── renderer.js      ← Layer-Rendering
├── ai.js            ← KI-Schuss-Berechnung
├── ui.js            ← HP-Balken, Wind, Winkel/Kraft-Anzeige
└── constants.js     ← Farben, Physik-Konstanten, Canvas-Größe
```

---

## State Machine

```
SETUP → AIMING → FLYING → EXPLODING → NEXT_TURN
                                           ↓
                                      HP ≤ 0? → GAME_OVER
                                      sonst  → AIMING
```

- **SETUP:** Terrain generieren, Gorillas platzieren
- **AIMING:** Input (Tastatur) oder KI berechnet Winkel/Kraft. KI wartet 1,5s vor Schuss
- **FLYING:** Physics-Tick + Collision-Check pro Frame. Kein Input möglich
- **EXPLODING:** Terrain-Pixel löschen, Partikel spawnen, HP abziehen
- **NEXT_TURN:** Spielerwechsel oder Game Over

---

## Game Loop

```js
function tick(timestamp) {
  update(timestamp);  // state.js + physics.js + collision.js
  render();           // renderer.js
  requestAnimationFrame(tick);
}
```

`update()` ist nur aktiv wenn `state === FLYING`. Alle anderen Zustände warten auf Input oder Timer.

---

## Terrain Engine

**Datenstruktur:**
- `terrain[x]` — 1D Height-Array (0–1279), Y-Koordinate der Oberfläche
- `terrainPixels[x][y]` — Uint8Array Pixel-Buffer (true = Terrain vorhanden)

**Generierung** (Sinus-Overlay, kein externes Noise-Library nötig):
```js
for (let x = 0; x < CANVAS_W; x++) {
  terrain[x] = BASE_HEIGHT
    + Math.sin(x * 0.008) * 80
    + Math.sin(x * 0.02 + 1.3) * 40
    + Math.sin(x * 0.05 + 0.7) * 20;
}
```

**Explosion:**
```js
function carveExplosion(cx, cy, radius) {
  // Kreis-förmig Pixel im Buffer löschen
  // Anschließend Height-Array neu berechnen
}
```
Explosions-Radius MVP: 40 px. Gorillas die danach über einem Loch schweben: `gorilla.y` wird auf `terrain[gorilla.x]` gesnappt (keine Animations-Physik im MVP).

---

## Physics

**Pro Frame (dt in Sekunden):**
```js
vx += wind * dt;
vy += GRAVITY * dt;   // GRAVITY = 300 px/s²
banana.x += vx * dt;
banana.y += vy * dt;
```

**Startgeschwindigkeit:**
```js
vx = Math.cos(angleRad) * power;
vy = -Math.sin(angleRad) * power;  // power: 0–100, skaliert auf px/s
```

**Wind:** Zufällige Float-Zahl pro Runde (`−30 … +30 px/s²`), als UI-Pfeil angezeigt.

---

## Collision

Reihenfolge pro Frame während FLYING:

1. **Out of bounds:** `x < 0 || x > 1280 || y > 720` → `NEXT_TURN`
2. **Terrain:** `terrainPixels[floor(banana.x)][floor(banana.y)]` → `EXPLODING`
3. **Gorilla:** AABB-Check (64×80 px Bounding Box)
   - Direkttreffer: −30 HP
   - Splashzone (innerhalb Explosions-Radius): −10 HP

HP-System: Start 100 HP, bei 0 → `GAME_OVER`.

---

## KI-Logik

**Ansatz:** Iterative Simulation mit analytischer Schätzung + absichtlichem Fehler.

```js
function calculateShot(shooter, target, wind) {
  for (let power = 10; power <= 100; power += 5) {
    const angle = estimateAngle(shooter, target, power, wind);
    if (simulateTrajectory(angle, power, wind) hits target) {
      // 70% Chance: korrekt schießen
      // 30% Chance: ±15° Winkel-Abweichung (wirkt menschlich)
      return applyInaccuracy({ angle, power });
    }
  }
  return randomShotToward(target);
}
```

`simulateTrajectory` nutzt dieselbe Physik wie `physics.js` — kein doppelter Code.  
**Timing:** 1,5s `setTimeout` vor dem KI-Schuss (visuelles Feedback für Spieler).

---

## Renderer

Layer-Reihenfolge pro Frame:

1. Himmel — `fillRect` mit Neon-Night Gradient
2. Terrain — `ImageData` aus `terrainPixels`
3. Gorillas — Sprite-Frames (Idle / Throw)
4. Banane — 6×6 px gelbes Rechteck, rotiert mit Flugrichtung
5. Partikel — Explosion-Trümmer (fade out über 1–2s)
6. UI-Overlay — HP-Balken, Wind-Pfeil, Winkel/Kraft-Text

---

## UI & Steuerung

**Tastatur (während AIMING):**
- `←` / `→` — Winkel anpassen
- `↑` / `↓` — Kraft anpassen
- `Space` — Schießen

**UI-Elemente:**
- HP-Balken: P1 links, P2 rechts (Neon-Grün/Rot)
- Wind-Pfeil: mittig oben, Länge proportional zur Windstärke
- Winkel/Kraft: unten eingeblendet während AIMING

---

## Farbpalette (Neon Night)

```js
// constants.js
export const COLORS = {
  SKY_TOP:    '#1a1a2e',
  SKY_BOTTOM: '#16213e',
  TERRAIN:    '#0f3460',
  SURFACE:    '#53d8fb',
  BANANA:     '#ffe135',
  ACCENT:     '#e94560',
  HP_GOOD:    '#4ecca3',
  HP_BAD:     '#e94560',
  PARTICLE_1: '#e94560',
  PARTICLE_2: '#f5a623',
  PARTICLE_3: '#53d8fb',
  TEXT:       '#ffffff',
};
```

---

## Out of Scope (MVP)

- Bäume, Gebäude, Dekorationen
- Screen Shake
- Squash & Stretch Animationen
- Sound-Effekte
- Vordefinierte Level (Blueprint 2)
- Netzwerk-Multiplayer
