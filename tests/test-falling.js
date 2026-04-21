import { isGorillaAirborne } from '../src/collision.js';
import { stepGorillaFall } from '../src/physics.js';
import { GRAVITY } from '../src/constants.js';
import { generateTerrain, getHeight } from '../src/terrain.js';

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

// Gorilla exakt auf Terrain-Oberfläche → nicht airborne (0.5px epsilon)
const gsExact = { players: [{ x: 200, y: getHeight(200) }] };
assert(isGorillaAirborne(gsExact, 0) === false, 'Gorilla exakt auf Terrain ist nicht in der Luft');

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
