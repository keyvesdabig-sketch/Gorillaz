import { CANVAS_W, CANVAS_H, AI_THINK_DELAY, GORILLA_H, EXPLOSION_RADIUS, FALL_THRESHOLD_PX, FALL_DAMAGE_FACTOR, FALL_DAMAGE_MAX } from './constants.js';
import { gs, STATE, transition, initGame } from './state.js';
import { generateTerrain, getHeight, carveExplosion } from './terrain.js';
import { render } from './renderer.js';
import { createBanana, stepBanana, stepGorillaFall } from './physics.js';
import { checkOutOfBounds, checkTerrain, checkGorilla, isGorillaAirborne } from './collision.js';
import { createExplosionParticles, stepParticles } from './particles.js';
import { drawUI } from './ui.js';
import { calculateAIShot } from './ai.js';
import { initAudio, playShoot, playExplosion, playDeath } from './audio.js';
import { initVolumeOverlay, toggleVolumeOverlay } from './volume-overlay.js';

const canvas = document.getElementById('game');
const ctx    = canvas.getContext('2d');
canvas.width  = CANVAS_W;
canvas.height = CANVAS_H;

const keys = {};
window.addEventListener('keydown', e => {
  initAudio();
  if (e.code === 'KeyM') toggleVolumeOverlay();
  keys[e.code] = true;
  e.preventDefault();
});
window.addEventListener('keyup', e => { keys[e.code] = false; });

const AIM_SPEED   = 60;
const POWER_SPEED = 40;

initGame(true); // true = P2 ist KI
initVolumeOverlay();

let lastTime = 0;

function processAimingInput(dt) {
  if (gs.phase !== STATE.AIMING) return;
  if (gs.players[gs.turn].isAI) return;

  if (keys['ArrowLeft'])  gs.aim.angle = Math.min(180, gs.aim.angle + AIM_SPEED * dt);
  if (keys['ArrowRight']) gs.aim.angle = Math.max(0,   gs.aim.angle - AIM_SPEED * dt);
  if (keys['ArrowUp'])    gs.aim.power = Math.min(100, gs.aim.power + POWER_SPEED * dt);
  if (keys['ArrowDown'])  gs.aim.power = Math.max(5,   gs.aim.power - POWER_SPEED * dt);

  if (keys['Space']) {
    keys['Space'] = false;
    fireShot();
  }
}

function processAI(dt) {
  if (gs.phase !== STATE.AIMING) return;
  const current = gs.players[gs.turn];
  if (!current.isAI) return;

  gs.aiThinkTimer -= dt;
  if (gs.aiThinkTimer > 0) return;

  const opponent = gs.players[1 - gs.turn];
  const shot     = calculateAIShot(current, opponent, gs.wind);
  gs.aim.angle   = shot.angle;
  gs.aim.power   = shot.power;
  fireShot();
}

function fireShot() {
  const shooter = gs.players[gs.turn];
  const facing  = gs.turn === 0 ? 1 : -1;
  const angle   = gs.turn === 0 ? gs.aim.angle : 180 - gs.aim.angle;

  gs.banana = createBanana(
    shooter.x,
    shooter.y - GORILLA_H * 1.0,
    angle,
    gs.aim.power,
    gs.wind,
  );
  transition('SHOOT');
  playShoot();
}

// directHitIdx: Index des Gorillas mit Direkttreffer (-1 = kein Direkttreffer)
function triggerExplosion(cx, cy, directHitIdx = -1) {
  carveExplosion(cx, cy, EXPLOSION_RADIUS);
  gs.particles = [...gs.particles, ...createExplosionParticles(cx, cy)];
  playExplosion();

  for (let i = 0; i < gs.players.length; i++) {
    const p  = gs.players[i];
    if (i === directHitIdx) {
      // Direkttreffer: -30 HP
      p.hp = Math.max(0, p.hp - 30);
    } else {
      // Splash-Schaden: Gorilla innerhalb Explosions-Radius → -10 HP
      const dx   = p.x - cx;
      const dy   = (p.y - GORILLA_H / 2) - cy;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist <= EXPLOSION_RADIUS) {
        p.hp = Math.max(0, p.hp - 10);
      }
    }
  }

  gs.banana = null;
  if (gs.players.some(p => p.hp === 0)) playDeath();
}

function processFlight(dt) {
  if (gs.phase !== STATE.FLYING || !gs.banana) return;

  stepBanana(gs.banana, dt);

  if (checkOutOfBounds(gs.banana)) {
    transition('OUT_OF_BOUNDS');
    return;
  }
  if (checkTerrain(gs.banana)) {
    triggerExplosion(gs.banana.x, gs.banana.y, -1);  // kein Direkttreffer, nur Splash
    transition('HIT_TERRAIN');
    return;
  }
  const hitIdx = checkGorilla(gs.banana, gs.players);
  if (hitIdx !== -1) {
    triggerExplosion(gs.banana.x, gs.banana.y, hitIdx);  // Direkttreffer: -30 HP via triggerExplosion
    transition('HIT_GORILLA');
  }
}

function processExploding(dt) {
  if (gs.phase !== STATE.EXPLODING) return;

  gs.particles    = stepParticles(gs.particles, dt);
  gs.explodeTimer = Math.max(0, gs.explodeTimer - dt);

  if (gs.explodeTimer <= 0 && gs.particles.length === 0) {
    if (gs.players[0].hp <= 0 || gs.players[1].hp <= 0) {
      transition('EXPLODE_DONE');
      return;
    }
    for (let i = 0; i < gs.players.length; i++) {
      if (isGorillaAirborne(gs, i)) {
        gs.fallingIdx = i;
        gs.fallStartY = gs.players[i].y;
        gs.fallingVY  = 0;
        transition('FALL');
        return;
      }
    }
    for (const p of gs.players) p.y = getHeight(p.x);
    transition('EXPLODE_DONE');
  }
}

function processFalling(dt) {
  if (gs.phase !== STATE.FALLING) return;

  const result = stepGorillaFall(gs, dt);
  if (!result.landed) return;

  const fallHeight = gs.players[gs.fallingIdx].y - gs.fallStartY;
  if (fallHeight > FALL_THRESHOLD_PX) {
    const dmg = Math.min(Math.floor(fallHeight * FALL_DAMAGE_FACTOR), FALL_DAMAGE_MAX);
    gs.players[gs.fallingIdx].hp = Math.max(0, gs.players[gs.fallingIdx].hp - dmg);
  }

  if (gs.players[0].hp <= 0 || gs.players[1].hp <= 0) {
    transition('LAND');
    return;
  }

  for (let i = 0; i < gs.players.length; i++) {
    if (i === gs.fallingIdx) continue;
    if (isGorillaAirborne(gs, i)) {
      gs.fallingIdx = i;
      gs.fallStartY = gs.players[i].y;
      gs.fallingVY  = 0;
      return;
    }
  }

  transition('LAND');
}

function processNextTurn() {
  if (gs.phase !== STATE.NEXT_TURN) return;
  transition('NEXT_TURN_DONE');
}

function processGameOver() {
  if (gs.phase !== STATE.GAME_OVER) return;
  if (keys['Space']) {
    keys['Space'] = false;
    initGame(gs.players[1].isAI);
    generateTerrain();
    gs.players[0].x = 75;
    gs.players[0].y = getHeight(75);
    gs.players[1].x = CANVAS_W - 75;
    gs.players[1].y = getHeight(CANVAS_W - 75);
    gs.aiThinkTimer  = AI_THINK_DELAY;
    transition('SETUP_DONE');
  }
}

function tick(timestamp) {
  const dt = Math.min((timestamp - lastTime) / 1000, 0.05);
  lastTime = timestamp;

  if (gs.phase === STATE.SETUP) {
    generateTerrain();
    // Gorillas auf dem Terrain platzieren
    gs.players[0].x = 75;
    gs.players[0].y = getHeight(75);
    gs.players[1].x = CANVAS_W - 75;
    gs.players[1].y = getHeight(CANVAS_W - 75);
    gs.aiThinkTimer  = AI_THINK_DELAY;
    transition('SETUP_DONE');
  }

  processAimingInput(dt);
  processAI(dt);
  processFlight(dt);
  processExploding(dt);
  processFalling(dt);
  processNextTurn();
  processGameOver();
  render(ctx, gs);
  drawUI(ctx, gs);
  requestAnimationFrame(tick);
}

requestAnimationFrame(tick);
