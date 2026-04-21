# ROADMAP — Modern Retro Gorillas

---

## v1 — MVP (aktuell in Planung)

Ziel: Erstes spielbares Build. Zwei Gorillas, zerstörbares Terrain, Hotseat + KI.

- [x] Design Spec
- [x] Implementierungsplan
- [x] Projekt-Scaffold (index.html, constants.js, Modul-Stubs)
- [x] State Machine (SETUP → AIMING → FLYING → EXPLODING → NEXT_TURN → GAME_OVER)
- [x] Terrain-Generierung (Sinus-Overlay, Pixel-Buffer, `carveExplosion`)
- [x] Terrain-Renderer (Sky + Terrain Layer)
- [x] Gorilla-Sprites (prozedural, Idle + Throw)
- [x] Physics Engine (`stepBanana` mit Sub-Stepping, `simulateTrajectory`)
- [x] Collision Detection (Terrain-Pixel, AABB-Gorilla, Out-of-Bounds)
- [x] Input-Handler (Tastatur: Winkel, Kraft, Schuss)
- [x] Bananen-Flug (FLYING State vollständig verdrahtet)
- [x] Explosions-System (Loch + Partikel + Schaden)
- [x] Game Loop (NEXT_TURN, GAME_OVER, Neustart)
- [x] UI-Overlay (HP-Balken, Wind-Pfeil, Winkel/Kraft-Anzeige)
- [x] KI-Gegner (`calculateAIShot`, 30 % Ungenauigkeit, 1,5s Delay)

---

## v2 — Polish & Sound

- [x] **Gorilla Falling-State** — physikalisches Fallen wenn Terrain wegexplodiert (statt Snap)
- [x] **Audio (`audio.js`)** — Web Audio API Synthesizer-Sounds: "Plopp" beim Schuss, Rauschen bei Explosion
- [ ] **Screen Shake** — kurzes Canvas-Wackeln bei Einschlag
- [ ] **Touch-Steuerung** — On-Canvas-Buttons für Tablet/Smartphone

---

## v3 — Content & Modes

- [ ] **Vordefinierte Level** — handgemachte Terrain-Presets (Wald, Stadt, Wüste)
- [ ] **Bäume & Gebäude** — zerstörbare Dekorationen auf dem Terrain
- [ ] **Squash & Stretch** — Gorilla-Animationen beim Wurf
- [ ] **Schwierigkeitsgrade** — Easy / Medium / Hard für KI

---

## Offen / Ideen

- Netzwerk-Multiplayer
- Mehr Waffen (Cluster-Banane, Bumerang)
- Highscore / Statistiken
