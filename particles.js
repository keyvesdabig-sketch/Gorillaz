import { COLORS, CANVAS_H } from './constants.js';

export function createExplosionParticles(cx, cy) {
  const particles = [];
  for (let i = 0; i < 35; i++) {
    const angle = Math.random() * Math.PI * 2;
    const speed = 60 + Math.random() * 220;
    particles.push({
      x:     cx,
      y:     cy,
      vx:    Math.cos(angle) * speed,
      vy:    Math.sin(angle) * speed - 120,  // leichter Aufwärts-Bias
      life:  1.0,
      color: COLORS.PARTICLE[Math.floor(Math.random() * COLORS.PARTICLE.length)],
      size:  3 + Math.random() * 6,
    });
  }
  return particles;
}

export function stepParticles(particles, dt) {
  for (const p of particles) {
    p.x    += p.vx * dt;
    p.y    += p.vy * dt;
    p.vy   += 300 * dt;  // Gravitation auf Partikel
    p.life -= dt / 1.5;  // verblasst in ~1,5s
  }
  return particles.filter(p => p.life > 0);
}
