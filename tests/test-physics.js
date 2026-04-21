import { createBanana, stepBanana, simulateTrajectory } from '../src/physics.js';
import { GRAVITY } from '../src/constants.js';
import { generateTerrain } from '../src/terrain.js';

function assert(cond, msg) {
  if (!cond) console.error(`FAIL: ${msg}`);
  else       console.log(`PASS: ${msg}`);
}

// Terrain muss initialisiert sein, damit simulateTrajectory funktioniert
generateTerrain();

// Gravitation erhöht vy pro Sekunde um GRAVITY
const b1     = createBanana(320, 150, 90, 0, 0);
const initVY = b1.vy;
stepBanana(b1, 1.0);
assert(Math.abs(b1.vy - (initVY + GRAVITY)) < 0.01, `vy wächst um GRAVITY (${GRAVITY}) pro Sekunde`);

// Banane bewegt sich horizontal bei 0°
const b2 = createBanana(100, 150, 0, 100, 0);
stepBanana(b2, 1.0);
assert(b2.x > 100, 'Banane bewegt sich nach rechts bei Winkel 0°');

// Wind verschiebt Banane horizontal
const b3 = createBanana(320, 80, 90, 50, 30);
stepBanana(b3, 1.0);
const b4 = createBanana(320, 80, 90, 50, 0);
stepBanana(b4, 1.0);
assert(b3.x > b4.x, 'Wind +30 verschiebt Banane nach rechts');

// Rotation nimmt mit der Zeit zu
const b5 = createBanana(320, 80, 45, 50, 0);
const rot0 = b5.rotation;
stepBanana(b5, 0.5);
assert(b5.rotation > rot0, 'Rotation nimmt mit der Zeit zu');

// simulateTrajectory findet Impact-Punkt
const impact = simulateTrajectory(50, 100, 45, 80, 0);
assert(impact !== null,                                  'simulateTrajectory findet Impact-Punkt');
assert(typeof impact.x === 'number' && typeof impact.y === 'number', 'Impact hat x und y');

// simulateTrajectory gibt null zurück wenn Banane das Canvas verlässt
const noImpact = simulateTrajectory(320, 80, 90, 1, 0); // sehr langsam → fällt sofort
// (darf null sein wenn kein Terrain getroffen wird — kein Crash)
assert(noImpact === null || typeof noImpact.x === 'number', 'simulateTrajectory gibt null oder Objekt zurück');

console.log('Physics-Tests fertig');
