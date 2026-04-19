import { CANVAS_W, CANVAS_H, COLORS } from './constants.js';
import { buildTerrainImageData } from './terrain.js';
import { STATE } from './state.js';
import { drawGorilla } from './gorilla.js';

export function render(ctx, gs) {
  drawSky(ctx);
  drawTerrain(ctx);
  drawGorillas(ctx, gs);
  drawBanana(ctx, gs.banana);
  drawParticles(ctx, gs.particles);
  drawGameOver(ctx, gs);
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

function drawBanana(ctx, banana) {
  if (!banana) return;
  ctx.save();
  ctx.translate(banana.x, banana.y);
  ctx.rotate(banana.rotation);
  ctx.fillStyle = COLORS.BANANA;
  ctx.fillRect(-4, -4, 8, 8);
  ctx.restore();
}

function drawParticles(ctx, particles) {
  for (const p of particles) {
    ctx.globalAlpha = Math.max(0, p.life);
    ctx.fillStyle   = p.color;
    ctx.fillRect(p.x - p.size / 2, p.y - p.size / 2, p.size, p.size);
  }
  ctx.globalAlpha = 1;
}

function drawGameOver(ctx, gs) {
  if (gs.phase !== STATE.GAME_OVER) return;

  // Abdunkeln
  ctx.fillStyle = 'rgba(0,0,0,0.6)';
  ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);

  // Gewinner-Text
  ctx.fillStyle    = COLORS.TEXT;
  ctx.font         = 'bold 64px monospace';
  ctx.textAlign    = 'center';
  ctx.fillText(`${gs.players[gs.winner].name} gewinnt!`, CANVAS_W / 2, CANVAS_H / 2 - 40);

  ctx.font      = '28px monospace';
  ctx.fillStyle = COLORS.SURFACE;
  ctx.fillText('Leertaste: Neues Spiel', CANVAS_W / 2, CANVAS_H / 2 + 30);

  ctx.textAlign = 'left';
}
