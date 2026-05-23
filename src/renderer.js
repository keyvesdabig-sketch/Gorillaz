import { CANVAS_W, CANVAS_H, COLORS, GORILLA_H } from './constants.js';
import { buildTerrainImageData } from './terrain.js';
import { drawGorilla } from './gorilla.js';
import { STATE } from './state.js';

export function render(ctx, gs) {
  drawSky(ctx);
  drawTerrain(ctx);
  drawGorillas(ctx, gs);
  drawAimIndicator(ctx, gs);
  drawBanana(ctx, gs.banana);
  drawParticles(ctx, gs.particles);
}

function drawSky(ctx) {
  // Wir machen den Himmel transparent, damit das Hintergrundbild durchscheint.
  // Ein leichter Verlauf sorgt für Atmosphäre.
  const grad = ctx.createLinearGradient(0, 0, 0, CANVAS_H);
  grad.addColorStop(0, COLORS.SKY_TOP + '66'); // 66 = ca 40% Opazität
  grad.addColorStop(1, COLORS.SKY_BOTTOM + '22');
  
  ctx.clearRect(0, 0, CANVAS_W, CANVAS_H); // Leinwand leeren für Transparenz
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);
}

let _terrainCanvas = null;
function drawTerrain(ctx) {
  const img = buildTerrainImageData(ctx);
  if (!img) return;
  if (!_terrainCanvas) {
    _terrainCanvas = document.createElement('canvas');
    _terrainCanvas.width = CANVAS_W;
    _terrainCanvas.height = CANVAS_H;
  }
  const offCtx = _terrainCanvas.getContext('2d');
  offCtx.putImageData(img, 0, 0);
  ctx.drawImage(_terrainCanvas, 0, 0);
}

function drawGorillas(ctx, gs) {
  const [p0, p1] = gs.players;
  drawGorilla(ctx, p0.x, p0.y, 'right', p0.animState);
  drawGorilla(ctx, p1.x, p1.y, 'left',  p1.animState);
}

function drawAimIndicator(ctx, gs) {
  if (gs.phase !== STATE.AIMING) return;
  
  const shooter = gs.players[gs.turn];
  if (shooter.isAI) return;

  // Position: Unten Mitte, über dem Text-HUD
  const x = CANVAS_W / 2;
  const y = CANVAS_H - 35;
  
  // Winkel für die Anzeige (P1 schießt nach rechts, P2 nach links)
  const angleAbs = gs.turn === 0 ? gs.aim.angle : 180 - gs.aim.angle;
  const angleRad = angleAbs * (Math.PI / 180);
  const length   = gs.aim.power * 0.6;
  
  ctx.save();
  ctx.translate(x, y);
  
  // Hintergrund-Bogen (Dial)
  ctx.beginPath();
  ctx.arc(0, 0, 75, Math.PI, 0);
  ctx.strokeStyle = 'rgba(0, 242, 255, 0.15)';
  ctx.lineWidth = 12;
  ctx.stroke();

  // Ziel-Pfeil
  ctx.shadowBlur = 15;
  ctx.shadowColor = COLORS.SURFACE;
  ctx.strokeStyle = COLORS.SURFACE;
  ctx.lineWidth = 4;
  ctx.lineCap = 'round';
  
  ctx.beginPath();
  ctx.moveTo(0, 0);
  const tx = Math.cos(-angleRad) * (length + 20);
  const ty = Math.sin(-angleRad) * (length + 20);
  ctx.lineTo(tx, ty);
  ctx.stroke();
  
  // Pfeilspitze
  const arrowSize = 6;
  ctx.save();
  ctx.translate(tx, ty);
  ctx.rotate(-angleRad);
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(-arrowSize, -arrowSize);
  ctx.moveTo(0, 0);
  ctx.lineTo(-arrowSize, arrowSize);
  ctx.stroke();
  ctx.restore();
  
  ctx.restore();
}

function drawBanana(ctx, banana) {
  if (!banana) return;

  // Flugbahn (Trail) während des Flugs
  if (banana.trail && banana.trail.length > 1) {
    ctx.save();
    ctx.beginPath();
    ctx.setLineDash([2, 4]);
    ctx.strokeStyle = COLORS.BANANA;
    ctx.globalAlpha = 0.4;
    ctx.lineWidth = 1;
    ctx.moveTo(banana.trail[0].x, banana.trail[0].y);
    for (let i = 1; i < banana.trail.length; i++) {
      ctx.lineTo(banana.trail[i].x, banana.trail[i].y);
    }
    ctx.stroke();
    ctx.restore();
  }

  ctx.save();
  ctx.translate(banana.x, banana.y);
  ctx.rotate(banana.rotation);
  
  // Stärkerer Glow
  ctx.shadowBlur = 20;
  ctx.shadowColor = COLORS.BANANA;
  
  // Körper der Banane (Gelber Bogen)
  ctx.fillStyle = COLORS.BANANA;
  ctx.beginPath();
  ctx.arc(0, 0, 7, 0.2, Math.PI - 0.2);
  ctx.lineWidth = 4;
  ctx.strokeStyle = COLORS.BANANA;
  ctx.stroke();
  
  // Füllung
  ctx.fill();
  
  // Kleine Enden
  ctx.fillStyle = '#4a2c1a';
  ctx.fillRect(5, 1, 2, 2);
  ctx.fillRect(-7, 1, 2, 2);
  
  ctx.restore();
}

function drawParticles(ctx, particles) {
  for (const p of particles) {
    ctx.save();
    ctx.globalAlpha = Math.max(0, p.life);
    ctx.fillStyle   = p.color;
    ctx.shadowBlur  = 5;
    ctx.shadowColor = p.color;
    ctx.fillRect(p.x - p.size / 2, p.y - p.size / 2, p.size, p.size);
    ctx.restore();
  }
}

