import { GRAVITY, CANVAS_W, CANVAS_H } from './constants.js';
import { getPixel, getHeight } from './terrain.js';

const SUBSTEP_THRESHOLD = 200;

export function createBanana(x, y, angleDeg, power, wind) {
  const rad   = angleDeg * (Math.PI / 180);
  const speed = power * 4;
  return {
    x,
    y,
    vx: Math.cos(rad) * speed,
    vy: -Math.sin(rad) * speed,
    wind,
    rotation: 0,
    trail: [{x, y}],
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
  banana.rotation += 8 * dt;
  
  // Trail updaten (Punkt hinzufügen wenn weit genug weg vom letzten Punkt)
  const last = banana.trail[banana.trail.length - 1];
  const distSq = (banana.x - last.x)**2 + (banana.y - last.y)**2;
  if (distSq > 16) {
    banana.trail.push({x: banana.x, y: banana.y});
    if (banana.trail.length > 50) banana.trail.shift(); // Max Länge
  }
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

export function getTrajectoryPoints(x, y, angleDeg, power, wind) {
  const b  = createBanana(x, y, angleDeg, power, wind);
  const dt = 0.05; // Gröberer Zeitschritt für Performance
  const points = [];
  for (let i = 0; i < 30; i++) {
    stepBanana(b, dt);
    points.push({x: b.x, y: b.y});
    if (b.x < 0 || b.x >= CANVAS_W || b.y >= CANVAS_H || getPixel(b.x, b.y)) break;
  }
  return points;
}

export function stepGorillaFall(gs, dt) {
  const p = gs.players[gs.fallingIdx];
  gs.fallingVY += GRAVITY * dt;
  p.y += gs.fallingVY * dt;
  const groundY = getHeight(p.x);
  if (p.y >= groundY) {
    p.y = groundY;
    return { landed: true };
  }
  return { landed: false };
}
