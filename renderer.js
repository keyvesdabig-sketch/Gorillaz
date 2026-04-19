import { COLORS } from './constants.js';

function drawSky(ctx) {
  ctx.fillStyle = COLORS.SKY;
  ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
}

function drawTerrain(ctx) {
  // TODO: Terrain-Rendering implementieren
}

function drawGorillas(ctx, gs) {
  // TODO: Gorillas-Rendering implementieren
}

function drawBanana(ctx, banana) {
  if (!banana) return;
  ctx.save();
  ctx.translate(banana.x, banana.y);
  ctx.rotate(banana.rotation);
  ctx.fillStyle = COLORS.BANANA;
  ctx.fillRect(-4, -4, 8, 8);  // kleines Rechteck, ~8×8px
  ctx.restore();
}

export function render(ctx, gs) {
  drawSky(ctx);
  drawTerrain(ctx);
  drawGorillas(ctx, gs);
  drawBanana(ctx, gs.banana);
}
