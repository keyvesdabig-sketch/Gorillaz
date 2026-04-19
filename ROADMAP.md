# ROADMAP — Modern Retro Gorillas

---

## v1 — MVP (aktuell in Planung)

Ziel: Erstes spielbares Build. Zwei Gorillas, zerstörbares Terrain, Hotseat + KI.

- [x] Design Spec
- [x] Implementierungsplan
- [ ] Projekt-Scaffold (index.html, constants.js, Modul-Stubs)
- [ ] State Machine (SETUP → AIMING → FLYING → EXPLODING → NEXT_TURN → GAME_OVER)
- [ ] Terrain-Generierung (Sinus-Overlay, Pixel-Buffer, `carveExplosion`)
- [ ] Terrain-Renderer (Sky + Terrain Layer)
- [ ] Gorilla-Sprites (prozedural, Idle + Throw)
- [ ] Physics Engine (`stepBanana` mit Sub-Stepping, `simulateTrajectory`)
- [ ] Collision Detection (Terrain-Pixel, AABB-Gorilla, Out-of-Bounds)
- [ ] Input-Handler (Tastatur: Winkel, Kraft, Schuss)
- [ ] Bananen-Flug (FLYING State vollständig verdrahtet)
- [ ] Explosions-System (Loch + Partikel + Schaden)
- [ ] Game Loop (NEXT_TURN, GAME_OVER, Neustart)
- [ ] UI-Overlay (HP-Balken, Wind-Pfeil, Winkel/Kraft-Anzeige)
- [ ] KI-Gegner (`calculateAIShot`, 30 % Ungenauigkeit, 1,5s Delay)

---

## v2 — Polish & Sound

- [ ] **Gorilla Falling-State** — physikalisches Fallen wenn Terrain wegexplodiert (statt Snap)
- [ ] **Audio (`audio.js`)** — Web Audio API Synthesizer-Sounds: "Plopp" beim Schuss, Rauschen bei Explosion
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
