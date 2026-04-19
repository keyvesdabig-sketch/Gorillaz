import { CANVAS_W, CANVAS_H, COLORS } from './constants.js';

const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
canvas.width = CANVAS_W;
canvas.height = CANVAS_H;

function tick() {
  ctx.fillStyle = COLORS.SKY_TOP;
  ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);
  requestAnimationFrame(tick);
}

requestAnimationFrame(tick);
