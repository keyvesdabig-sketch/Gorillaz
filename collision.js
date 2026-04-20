import { CANVAS_W, CANVAS_H, GORILLA_W, GORILLA_H } from './constants.js';
import { getPixel } from './terrain.js';

export function checkOutOfBounds(banana) {
  return banana.x < 0 || banana.x > CANVAS_W || banana.y > CANVAS_H;
}

export function checkTerrain(banana) {
  return getPixel(banana.x, banana.y);
}

export function checkGorilla(banana, players) {
  const hw = GORILLA_W / 2;
  for (let i = 0; i < players.length; i++) {
    const p = players[i];
    if (
      banana.x >= p.x - hw &&
      banana.x <= p.x + hw &&
      banana.y >= p.y - GORILLA_H &&
      banana.y <= p.y
    ) return i;
  }
  return -1;
}
