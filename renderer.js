import { CANVAS_W, CANVAS_H, COLORS } from './constants.js';
import { buildTerrainImageData } from './terrain.js';
import { STATE } from './state.js';
import { drawGorilla } from './gorilla.js';

export function render(ctx, gs) {
  drawSky(ctx);
  drawTerrain(ctx);
  drawGorillas(ctx, gs);
}

function drawSky(ctx) {
  const grad = ctx.createLinearGradient(0, 0, 0, CANVAS_H);
  grad.addColorStop(0, COLORS.SKY_TOP);
  grad.addColorStop(1, COLORS.SKY_BOTTOM);
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);
}

function drawTerrain(ctx) {
  const img = buildTerrainImageData(ctx);
  if (img) ctx.putImageData(img, 0, 0);
}

function drawGorillas(ctx, gs) {
  const [p0, p1] = gs.players;
  drawGorilla(ctx, p0.x, p0.y, 'right', p0.animState);
  drawGorilla(ctx, p1.x, p1.y, 'left',  p1.animState);
}
