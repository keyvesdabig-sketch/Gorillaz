import { CANVAS_W, CANVAS_H, COLORS, GORILLA_HP, WIND_MAX } from './constants.js';
import { STATE } from './state.js';

const BAR_W = 200;
const BAR_H = 18;
const PAD   = 16;

export function drawUI(ctx, gs) {
  drawHPBars(ctx, gs);
  drawWindArrow(ctx, gs);
  if (gs.phase === STATE.AIMING && !gs.players[gs.turn].isAI) {
    drawAimInfo(ctx, gs);
  }
  drawTurnIndicator(ctx, gs);
}

function drawHPBars(ctx, gs) {
  // P1 links
  drawBar(ctx, PAD, PAD, gs.players[0].hp, gs.players[0].name, 'left');
  // P2 rechts
  drawBar(ctx, CANVAS_W - PAD - BAR_W, PAD, gs.players[1].hp, gs.players[1].name, 'right');
}

function drawBar(ctx, x, y, hp, name, align) {
  const pct      = Math.max(0, hp / GORILLA_HP);
  const barColor = pct > 0.5 ? COLORS.HP_GOOD : COLORS.HP_BAD;

  // Hintergrund
  ctx.fillStyle = 'rgba(0,0,0,0.5)';
  ctx.fillRect(x - 2, y - 2, BAR_W + 4, BAR_H + 20);

  // Balken
  ctx.fillStyle = '#333';
  ctx.fillRect(x, y + 16, BAR_W, BAR_H);
  ctx.fillStyle = barColor;
  ctx.fillRect(x, y + 16, Math.floor(BAR_W * pct), BAR_H);

  // Name + HP
  ctx.fillStyle  = COLORS.TEXT;
  ctx.font       = '13px monospace';
  ctx.textAlign  = align === 'left' ? 'left' : 'right';
  const tx       = align === 'left' ? x : x + BAR_W;
  ctx.fillText(`${name}  ${hp} HP`, tx, y + 12);
  ctx.textAlign  = 'left';
}

function drawWindArrow(ctx, gs) {
  const cx     = CANVAS_W / 2;
  const cy     = 30;
  const scale  = (gs.wind / WIND_MAX) * 60;
  const arrowX = cx + scale;

  ctx.strokeStyle = COLORS.WIND;
  ctx.lineWidth   = 3;
  ctx.beginPath();
  ctx.moveTo(cx, cy);
  ctx.lineTo(arrowX, cy);
  ctx.stroke();

  // Pfeilspitze
  if (Math.abs(scale) > 4) {
    const dir = scale > 0 ? 1 : -1;
    ctx.fillStyle = COLORS.WIND;
    ctx.beginPath();
    ctx.moveTo(arrowX,            cy);
    ctx.lineTo(arrowX - dir * 10, cy - 6);
    ctx.lineTo(arrowX - dir * 10, cy + 6);
    ctx.closePath();
    ctx.fill();
  }

  ctx.fillStyle  = COLORS.TEXT;
  ctx.font       = '11px monospace';
  ctx.textAlign  = 'center';
  ctx.fillText(`Wind: ${gs.wind.toFixed(1)}`, cx, cy + 20);
  ctx.textAlign  = 'left';
}

function drawAimInfo(ctx, gs) {
  const text = `Winkel: ${Math.round(gs.aim.angle)}°   Kraft: ${Math.round(gs.aim.power)}`;
  ctx.fillStyle = 'rgba(0,0,0,0.5)';
  ctx.fillRect(CANVAS_W / 2 - 160, CANVAS_H - 44, 320, 32);
  ctx.fillStyle  = COLORS.TEXT;
  ctx.font       = '16px monospace';
  ctx.textAlign  = 'center';
  ctx.fillText(text, CANVAS_W / 2, CANVAS_H - 22);
  ctx.textAlign  = 'left';
}

function drawTurnIndicator(ctx, gs) {
  if (gs.phase !== STATE.AIMING) return;
  const name = gs.players[gs.turn].name;
  ctx.fillStyle  = COLORS.SURFACE;
  ctx.font       = '14px monospace';
  ctx.textAlign  = 'center';
  ctx.fillText(`▶ ${name} ist dran`, CANVAS_W / 2, CANVAS_H - 55);
  ctx.textAlign  = 'left';
}
