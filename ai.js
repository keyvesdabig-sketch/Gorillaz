import { simulateTrajectory } from './physics.js';
import { AI_INACCURACY } from './constants.js';

export function calculateAIShot(shooter, target, wind) {
  const dx = target.x - shooter.x;
  const startY = shooter.y - 48;

  for (let power = 20; power <= 100; power += 4) {
    const distFactor = Math.abs(dx) / 800;
    const baseAngle  = 20 + distFactor * 50;
    const direction  = dx > 0 ? 1 : -1;

    for (let aDelta = -30; aDelta <= 30; aDelta += 5) {
      const angle  = direction > 0
        ? baseAngle + aDelta
        : 180 - baseAngle - aDelta;
      const impact = simulateTrajectory(shooter.x, startY, angle, power, wind);
      if (!impact) continue;

      const dist = Math.abs(impact.x - target.x);
      if (dist < 60) {
        const inaccuracy = (Math.random() - 0.5) * 2 * AI_INACCURACY;
        return {
          angle: angle + inaccuracy,
          power: Math.max(5, Math.min(100, power + (Math.random() - 0.5) * 20)),
        };
      }
    }
  }

  const roughAngle = dx > 0 ? 45 : 135;
  return { angle: roughAngle, power: 60 };
}
