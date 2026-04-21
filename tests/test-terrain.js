import { generateTerrain, getHeight, getPixel, carveExplosion } from '../src/terrain.js';
import { CANVAS_W, CANVAS_H, EXPLOSION_RADIUS } from '../src/constants.js';

function assert(cond, msg) {
  if (!cond) console.error(`FAIL: ${msg}`);
  else       console.log(`PASS: ${msg}`);
}

generateTerrain();

// Höhen im sinnvollen Bereich
let allInBounds = true;
for (let x = 0; x < CANVAS_W; x++) {
  const h = getHeight(x);
  if (h < 100 || h > 300) { allInBounds = false; break; }
}
assert(allInBounds, 'alle Höhen zwischen 100 und 300');

// Pixel unter Oberfläche ist Terrain, darüber Luft
const midX  = Math.floor(CANVAS_W / 2);
const surfY = Math.floor(getHeight(midX));
assert(getPixel(midX, surfY + 10) === true,  'Pixel 10px unter Oberfläche ist Terrain');
assert(getPixel(midX, surfY - 10) === false, 'Pixel 10px über Oberfläche ist Luft');

// Out-of-bounds
assert(getPixel(-1,       0) === false, 'out-of-bounds links ist false');
assert(getPixel(CANVAS_W, 0) === false, 'out-of-bounds rechts ist false');

// carveExplosion entfernt Terrain-Pixel
const cx = midX;
const cy = surfY + 5;
carveExplosion(cx, cy, EXPLOSION_RADIUS);
assert(getPixel(cx, cy) === false, 'Explosionszentrum ist danach Luft');
assert(getHeight(cx) > surfY,      'Höhe im Explosionsbereich gestiegen (Loch)');

console.log('Terrain-Tests fertig');
