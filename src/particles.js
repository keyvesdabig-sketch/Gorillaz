import { COLORS, GRAVITY } from './constants.js';

export function createExplosionParticles(cx, cy) {
  const particles = [];
  for (let i = 0; i < 35; i++) {
    const angle = Math.random() * Math.PI * 2;
    const speed = 60 + Math.random() * 220;
    particles.push({
      x:     cx,
      y:     cy,
      vx:    Math.cos(angle) * speed,
      vy:    Math.sin(angle) * speed - 120,
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
    p.vy   += GRAVITY * dt;
    p.life -= dt / 1.5;
  }
  return particles.filter(p => p.life > 0);
}
