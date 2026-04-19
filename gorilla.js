import { COLORS, GORILLA_W, GORILLA_H } from './constants.js';

export function drawGorilla(ctx, x, y, facing, animState) {
  // x/y = Boden-Mitte des Gorillas
  ctx.save();
  ctx.translate(x, y);
  if (facing === 'left') ctx.scale(-1, 1);

  const b = COLORS.GORILLA_BODY;
  const d = COLORS.GORILLA_DARK;

  // Beine
  ctx.fillStyle = d;
  ctx.fillRect(-20,  -20, 14, 20);  // linkes Bein
  ctx.fillRect(  6,  -20, 14, 20);  // rechtes Bein

  // Torso
  ctx.fillStyle = b;
  ctx.fillRect(-22,  -56, 44, 36);  // Rumpf

  // Arme
  if (animState === 'idle') {
    ctx.fillStyle = d;
    ctx.fillRect(-36,  -54, 14, 22);  // linker Arm hängt
    ctx.fillRect( 22,  -54, 14, 22);  // rechter Arm hängt
  } else {
    // throw: rechter Arm gehoben
    ctx.fillStyle = d;
    ctx.fillRect(-36,  -54, 14, 22);  // linker Arm hängt
    ctx.fillRect( 22,  -76, 14, 28);  // rechter Arm oben
  }

  // Hände
  ctx.fillStyle = d;
  ctx.fillRect(-40,  -38,  8,  8);  // linke Hand
  if (animState === 'idle') {
    ctx.fillRect( 32,  -38,  8,  8);  // rechte Hand unten
  } else {
    ctx.fillRect( 32,  -52,  8,  8);  // rechte Hand oben
  }

  // Kopf
  ctx.fillStyle = b;
  ctx.fillRect(-18,  -80, 36, 28);  // Kopf

  // Augen
  ctx.fillStyle = COLORS.GORILLA_EYES;
  ctx.fillRect( -12,  -72,  7,  7);
  ctx.fillRect(   5,  -72,  7,  7);

  // Pupillen
  ctx.fillStyle = '#000';
  ctx.fillRect( -10,  -70,  3,  3);
  ctx.fillRect(   7,  -70,  3,  3);

  ctx.restore();
}
