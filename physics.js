import { GRAVITY, CANVAS_W, CANVAS_H } from './constants.js';
import { getPixel } from './terrain.js';

const SUBSTEP_THRESHOLD = 200; // px/s — darüber: 4 Sub-Schritte gegen Tunneling

export function createBanana(x, y, angleDeg, power, wind) {
  const rad   = angleDeg * (Math.PI / 180);
  const speed = power * 4; // power 0-100 → 0-400 px/s (640px-Welt)
  return {
    x,
    y,
    vx: Math.cos(rad) * speed,
    vy: -Math.sin(rad) * speed,
    wind,
    rotation: 0,
  };
}

export function stepBanana(banana, dt) {
  const speed = Math.sqrt(banana.vx * banana.vx + banana.vy * banana.vy);
  const steps = speed > SUBSTEP_THRESHOLD ? 4 : 1;
  const sub   = dt / steps;

  for (let i = 0; i < steps; i++) {
    banana.vx += banana.wind * sub;
    banana.vy += GRAVITY * sub;
    banana.x  += banana.vx * sub;
    banana.y  += banana.vy * sub;
  }
  banana.rotation += 5 * dt;
}

export function simulateTrajectory(x, y, angleDeg, power, wind) {
  const b  = createBanana(x, y, angleDeg, power, wind);
  const dt = 0.016;
  for (let i = 0; i < 5000; i++) {
    stepBanana(b, dt);
    if (b.x < 0 || b.x >= CANVAS_W || b.y >= CANVAS_H) return null;
    if (getPixel(b.x, b.y)) return { x: b.x, y: b.y };
  }
  return null;
}
