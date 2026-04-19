import { generateTerrain, getHeight, getPixel } from './terrain.js';
import { CANVAS_W, CANVAS_H } from './constants.js';

function assert(cond, msg) {
  if (!cond) console.error(`FAIL: ${msg}`);
  else console.log(`PASS: ${msg}`);
}

generateTerrain();

// Höhe liegt im sinnvollen Bereich
let allInBounds = true;
for (let x = 0; x < CANVAS_W; x++) {
  const h = getHeight(x);
  if (h < 100 || h > 300) { allInBounds = false; break; }
}
assert(allInBounds, 'alle Höhen zwischen 100 und 300');

// Pixel unter der Oberfläche ist Terrain
const midX = Math.floor(CANVAS_W / 2);
const surfY = Math.floor(getHeight(midX));
assert(getPixel(midX, surfY + 10) === true, 'Pixel 10px unter Oberfläche ist Terrain');
assert(getPixel(midX, surfY - 10) === false, 'Pixel 10px über Oberfläche ist Luft');
assert(getPixel(-1, 0) === false, 'out-of-bounds links ist false');
assert(getPixel(CANVAS_W, 0) === false, 'out-of-bounds rechts ist false');

console.log('Terrain-Tests fertig');
