import { CANVAS_W, CANVAS_H, GORILLA_W, GORILLA_H } from './constants.js';
import { getPixel, getHeight } from './terrain.js';

export function checkOutOfBounds(banana) {
  return banana.x < 0 || banana.x >= CANVAS_W || banana.y >= CANVAS_H || banana.y < -CANVAS_H;
}

export function checkTerrain(banana) {
  return getPixel(banana.x, banana.y);
}

export function checkGorilla(banana, players, shooterIdx = -1) {
  const hw = GORILLA_W / 2;
  for (let i = 0; i < players.length; i++) {
    if (i === shooterIdx) continue;
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

export function isGorillaAirborne(gs, idx) {
  const p = gs.players[idx];
  return p.y < getHeight(p.x) - 0.5;
}
