import { COLORS, GORILLA_H } from './constants.js';

export function drawGorilla(ctx, x, y, facing, animState) {
  ctx.save();
  ctx.translate(x, y);
  
  const scale = GORILLA_H / 85;
  ctx.scale(scale, scale);
  if (facing === 'left') ctx.scale(-1, 1);

  const b = COLORS.GORILLA_BODY;
  const d = COLORS.GORILLA_DARK;
  const e = COLORS.GORILLA_EYES;

  // --- Beine ---
  ctx.fillStyle = d;
  ctx.beginPath();
  ctx.roundRect(-18, -20, 12, 20, 4);
  ctx.roundRect(  6, -20, 12, 20, 4);
  ctx.fill();

  // --- Arme (hinter dem Körper) ---
  ctx.fillStyle = b;
  // Linker Arm
  ctx.beginPath();
  ctx.roundRect(-38, -58, 16, 28, 6);
  ctx.fill();
  
  // --- Torso ---
  ctx.fillStyle = b;
  ctx.beginPath();
  ctx.roundRect(-24, -62, 48, 42, 10);
  ctx.fill();

  // Brust-Detail (Muskeln)
  ctx.fillStyle = d;
  ctx.globalAlpha = 0.4;
  ctx.beginPath();
  ctx.roundRect(-16, -56, 14, 18, 4);
  ctx.roundRect(  2, -56, 14, 18, 4);
  ctx.fill();
  ctx.globalAlpha = 1;

  // --- Arm (vorne) ---
  ctx.fillStyle = b;
  if (animState === 'idle') {
    ctx.beginPath();
    ctx.roundRect(22, -58, 16, 28, 6);
    ctx.fill();
    // Hand
    ctx.fillStyle = d;
    ctx.fillRect(22, -34, 18, 8);
  } else {
    // Wurfarm oben
    ctx.beginPath();
    ctx.roundRect(22, -88, 16, 34, 6);
    ctx.fill();
    // Hand
    ctx.fillStyle = d;
    ctx.fillRect(22, -92, 18, 10);
  }
  
  // Hand links
  ctx.fillStyle = d;
  ctx.fillRect(-40, -34, 18, 8);

  // --- Kopf ---
  ctx.fillStyle = b;
  // Ohren
  ctx.beginPath();
  ctx.arc(-20, -78, 6, 0, Math.PI * 2);
  ctx.arc( 20, -78, 6, 0, Math.PI * 2);
  ctx.fill();
  
  // Haupt-Kopf
  ctx.beginPath();
  ctx.roundRect(-18, -90, 36, 34, 10);
  ctx.fill();

  // Gesichtsbereich (heller/dunkler)
  ctx.fillStyle = d;
  ctx.globalAlpha = 0.3;
  ctx.beginPath();
  ctx.roundRect(-12, -82, 24, 22, 6);
  ctx.fill();
  ctx.globalAlpha = 1;

  // Augen-Glow
  ctx.shadowBlur = 15;
  ctx.shadowColor = e;
  ctx.fillStyle = '#000';
  ctx.fillRect(-11, -78, 8, 8);
  ctx.fillRect(  3, -78, 8, 8);
  
  ctx.fillStyle = e;
  ctx.fillRect(-9, -76, 4, 4);
  ctx.fillRect( 5, -76, 4, 4);
  ctx.shadowBlur = 0;

  // Schnauze
  ctx.fillStyle = d;
  ctx.beginPath();
  ctx.roundRect(-8, -68, 16, 10, 4);
  ctx.fill();
  
  // Nase (Punkte)
  ctx.fillStyle = '#000';
  ctx.fillRect(-3, -64, 2, 2);
  ctx.fillRect( 1, -64, 2, 2);

  ctx.restore();
}
