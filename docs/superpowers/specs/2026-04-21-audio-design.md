# Audio — Design Spec
**Datum:** 2026-04-21  
**Status:** Genehmigt

---

## Überblick

Chiptune-Sounddesign für Modern Retro Gorillas via Web Audio API. Keine externen Assets, keine Bibliotheken — alle Sounds werden programmatisch synthetisiert. Gestaffelter Scope: Kern-Sounds zuerst, optionale Erweiterungen in einer zweiten Phase.

---

## Architektur

Neue Datei `audio.js` mit drei exportierten Funktionen für Phase 1. `main.js` importiert und ruft sie direkt auf.

```
audio.js
  └── initAudio()        ← AudioContext lazy initialisieren
  └── playShoot()        ← Schuss-Sound
  └── playExplosion()    ← Explosions-Sound
  └── playDeath()        ← Tod-Sting
```

**AudioContext-Initialisierung:** Browser-Autoplay-Policy erfordert einen User-Gesture vor dem ersten Sound. `initAudio()` wird einmalig im `keydown`-Handler in `main.js` aufgerufen. Danach ist der Context entsperrt und alle Sounds können sofort abgespielt werden.

**One-shot-Trigger:** Jede Funktion erzeugt ihre eigenen Nodes, verbindet sie mit `audioCtx.destination` und ruft `start()` / `stop()` mit absolutem Zeitstempel auf. Keine globale Zustandsverwaltung nötig.

---

## Kern-Sounds (Phase 1)

### `playShoot()`
- **Wellenform:** Square wave (`OscillatorNode`, type `square`)
- **Frequenz:** Linearer Sweep 150 Hz → 400 Hz
- **Hüllkurve:** Gain 0.3, Attack instant, Decay auf 0 innerhalb ~0.15 s
- **Dauer:** 0.15 s

### `playExplosion()`
- **Wellenform:** White Noise (`AudioBufferSourceNode` mit zufälligem Float32Array)
- **Filter:** `BiquadFilterNode` type `lowpass`, Cutoff fällt von 800 Hz → 100 Hz
- **Hüllkurve:** Gain 0.5, Attack instant, Decay auf 0 innerhalb ~0.5 s
- **Dauer:** 0.5 s

### `playDeath()`
- **Wellenform:** Square wave
- **Melodie:** Absteigende Arpeggio-Phrase — C5 (523 Hz), B4 (494 Hz), Bb4 (466 Hz), A4 (440 Hz), Ab4 (415 Hz), G4 (392 Hz)
- **Timing:** Je Note ~0.12 s, direkt nacheinander geplant via `oscillator.start(t)` / `oscillator.stop(t + 0.12)`
- **Hüllkurve:** Gain 0.25 pro Note, kein Fade
- **Gesamtdauer:** ~0.72 s

---

## Integration in `main.js`

| Aufruf-Stelle | Funktion |
|---|---|
| `keydown`-Handler (einmalig) | `initAudio()` |
| `fireShot()` | `playShoot()` |
| `triggerExplosion()` | `playExplosion()` |
| Nach HP-Prüfung wenn `hp <= 0` (in `processExploding` / `processFalling`) | `playDeath()` |

---

## Optionale Erweiterungen (Phase 2)

Diese Sounds werden im Implementierungsplan als separate, optionale Phase markiert.

| Funktion | Beschreibung |
|---|---|
| `playBananaFly()` / `stopBananaFly()` | Pulsierender Loop — Dreieckwelle 180 Hz, leichtes Vibrato; aktiv während `STATE.FLYING` |
| `playLand()` | Kurzes "Thump" — Sinus 80 → 40 Hz Sweep, ~0.1 s; beim Gorilla-Aufprall nach Fall |
| `playTurnChange()` | Kurzer Tick — Square 440 Hz, ~0.05 s; beim Übergang zu `STATE.AIMING` |

---

## Nicht im Scope

- Hintergrundmusik / Ambient-Loop
- Lautstärkeregler oder Audio-Einstellungen im UI
- Externe Audio-Bibliotheken (Tone.js o. Ä.)
- Audio-Dateien / Samples
