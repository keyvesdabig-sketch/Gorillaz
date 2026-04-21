import { simulateTrajectory } from './physics.js';
import { AI_INACCURACY } from './constants.js';

export function calculateAIShot(shooter, target, wind) {
  const dx = target.x - shooter.x;
  const startY = shooter.y - 48;  // Wurfhöhe

  for (let power = 20; power <= 100; power += 4) {
    // Groben Winkel schätzen: flach wenn nah, steiler wenn weit
    const distFactor = Math.abs(dx) / 800;
    const baseAngle  = 20 + distFactor * 50;
    const direction  = dx > 0 ? 1 : -1;

    for (let aDelta = -30; aDelta <= 30; aDelta += 5) {
      const angleRel = baseAngle + aDelta;
      const angleAbs = direction > 0 ? angleRel : 180 - angleRel;
      
      const impact   = simulateTrajectory(shooter.x, startY, angleAbs, power, wind);
      if (!impact) continue;

      const dist = Math.abs(impact.x - target.x);
      if (dist < 60) {
        // Treffer nah genug — 30% Ungenauigkeit hinzufügen
        const inaccuracy = (Math.random() - 0.5) * 2 * AI_INACCURACY;
        return {
          angle: angleRel + inaccuracy,
          power: Math.max(5, Math.min(100, power + (Math.random() - 0.5) * 20)),
        };
      }
    }
  }

  // Fallback: ungefährer Direktschuss (relativ 45 Grad)
  return { angle: 45, power: 60 };
}
