import { CANVAS_W, CANVAS_H, COLORS } from './constants.js';
import { buildTerrainImageData } from './terrain.js';
import { STATE } from './state.js';

export function render(ctx, gs) {
  drawSky(ctx);
  drawTerrain(ctx);
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
