import { checkOutOfBounds, checkTerrain, checkGorilla } from '../src/collision.js';
import { CANVAS_W, CANVAS_H, GORILLA_W, GORILLA_H } from '../src/constants.js';
import { generateTerrain } from '../src/terrain.js';

function assert(cond, msg) {
  if (!cond) console.error(`FAIL: ${msg}`);
  else       console.log(`PASS: ${msg}`);
}

generateTerrain();

// checkOutOfBounds
assert( checkOutOfBounds({ x: -1,           y: 180 }), 'OOB: links');
assert( checkOutOfBounds({ x: CANVAS_W + 1, y: 180 }), 'OOB: rechts');
assert( checkOutOfBounds({ x: 320,          y: CANVAS_H + 1 }), 'OOB: unten');
assert(!checkOutOfBounds({ x: 320,          y: 180 }), 'in bounds: Mitte');
assert(!checkOutOfBounds({ x: 0,            y: 0   }), 'in bounds: Ecke oben-links');

// checkTerrain: Pixel weit unter der Oberfläche muss Terrain sein
assert( checkTerrain({ x: 320, y: CANVAS_H - 1 }),   'Terrain unten am Rand vorhanden');
assert(!checkTerrain({ x: 320, y: 0 }),               'kein Terrain ganz oben');

// checkGorilla: AABB-Treffer
const players = [
  { x: 100, y: 200 },
  { x: 500, y: 200 },
];
const hw = GORILLA_W / 2;

assert(checkGorilla({ x: 100,           y: 160 }, players) === 0, 'Treffer auf P1 (Mitte)');
assert(checkGorilla({ x: 100 - hw + 1, y: 160 }, players) === 0, 'Treffer auf P1 (linker Rand)');
assert(checkGorilla({ x: 100 + hw - 1, y: 160 }, players) === 0, 'Treffer auf P1 (rechter Rand)');
assert(checkGorilla({ x: 500,           y: 160 }, players) === 1, 'Treffer auf P2');
assert(checkGorilla({ x: 300,           y: 160 }, players) === -1, 'kein Treffer in der Mitte');
assert(checkGorilla({ x: 100,           y: 201 }, players) === -1, 'kein Treffer unterhalb Gorilla');
assert(checkGorilla({ x: 100,           y: 200 - GORILLA_H - 1 }, players) === -1, 'kein Treffer oberhalb Gorilla');

console.log('Collision-Tests fertig');
