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
