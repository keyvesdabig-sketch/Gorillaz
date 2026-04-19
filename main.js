import { CANVAS_W, CANVAS_H, AI_THINK_DELAY } from './constants.js';
import { gs, STATE, transition, initGame } from './state.js';
import { generateTerrain, getHeight } from './terrain.js';
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
    // Gorillas auf dem Terrain platzieren
    gs.players[0].x = 75;
    gs.players[0].y = getHeight(75);
    gs.players[1].x = CANVAS_W - 75;
    gs.players[1].y = getHeight(CANVAS_W - 75);
    gs.aiThinkTimer  = AI_THINK_DELAY;
    transition('SETUP_DONE');
  }

  render(ctx, gs);
  requestAnimationFrame(tick);
}

requestAnimationFrame(tick);
