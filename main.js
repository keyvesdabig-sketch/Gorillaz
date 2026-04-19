import { CANVAS_W, CANVAS_H } from './constants.js';
import { gs, STATE, transition, initGame } from './state.js';
import { generateTerrain } from './terrain.js';
import { render } from './renderer.js';

const canvas = document.getElementById('game');
const ctx    = canvas.getContext('2d');
canvas.width  = CANVAS_W;
canvas.height = CANVAS_H;

initGame(false); // false = P2 ist Mensch

let lastTime = 0;

function tick(timestamp) {
  const dt = Math.min((timestamp - lastTime) / 1000, 0.05);
  lastTime = timestamp;

  if (gs.phase === STATE.SETUP) {
    generateTerrain();
    transition('SETUP_DONE');
  }

  render(ctx, gs);
  requestAnimationFrame(tick);
}

requestAnimationFrame(tick);
