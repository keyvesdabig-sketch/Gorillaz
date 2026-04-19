import { checkOutOfBounds, checkGorilla } from './collision.js';
import { CANVAS_W, CANVAS_H, GORILLA_W, GORILLA_H } from './constants.js';

function assert(cond, msg) {
  if (!cond) console.error(`FAIL: ${msg}`);
  else console.log(`PASS: ${msg}`);
}

// checkOutOfBounds
assert(checkOutOfBounds({ x: -1,          y: 180 }), 'OOB: links');
assert(checkOutOfBounds({ x: CANVAS_W +1, y: 180 }), 'OOB: rechts');
assert(checkOutOfBounds({ x: 320,         y: CANVAS_H + 1 }), 'OOB: unten');
assert(!checkOutOfBounds({ x: 320,        y: 180 }), 'in bounds: Mitte');
assert(!checkOutOfBounds({ x: 0,          y: 0 }), 'in bounds: Ecke oben-links');

// checkGorilla: Banane direkt auf Gorilla
const players = [
  { x: 100, y: 200 },
  { x: 500, y: 200 },
];
assert(checkGorilla({ x: 100, y: 160 }, players) === 0, 'Treffer auf P1');
assert(checkGorilla({ x: 500, y: 160 }, players) === 1, 'Treffer auf P2');
assert(checkGorilla({ x: 300, y: 160 }, players) === -1, 'kein Treffer in der Mitte');

console.log('Collision-Tests fertig');
