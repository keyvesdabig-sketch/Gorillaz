import { CANVAS_W, CANVAS_H, AI_THINK_DELAY, GORILLA_H } from './constants.js';
import { gs, STATE, transition, initGame } from './state.js';
import { generateTerrain, getHeight } from './terrain.js';
import { render } from './renderer.js';
import { createBanana, stepBanana } from './physics.js';
import { checkOutOfBounds, checkTerrain, checkGorilla } from './collision.js';

const canvas = document.getElementById('game');
const ctx    = canvas.getContext('2d');
canvas.width  = CANVAS_W;
canvas.height = CANVAS_H;

const keys = {};
window.addEventListener('keydown', e => {
  keys[e.code] = true;
  e.preventDefault();
});
window.addEventListener('keyup', e => { keys[e.code] = false; });

const AIM_SPEED   = 60;  // Grad/Sekunde
const POWER_SPEED = 40;  // Einheiten/Sekunde

initGame(false); // false = P2 ist Mensch

let lastTime = 0;

function processAimingInput(dt) {
  if (gs.phase !== STATE.AIMING) return;
  if (gs.players[gs.turn].isAI) return;  // KI steuert selbst

  if (keys['ArrowLeft'])  gs.aim.angle = Math.min(180, gs.aim.angle + AIM_SPEED * dt);
  if (keys['ArrowRight']) gs.aim.angle = Math.max(0,   gs.aim.angle - AIM_SPEED * dt);
  if (keys['ArrowUp'])    gs.aim.power = Math.min(100, gs.aim.power + POWER_SPEED * dt);
  if (keys['ArrowDown'])  gs.aim.power = Math.max(5,   gs.aim.power - POWER_SPEED * dt);

  if (keys['Space']) {
    keys['Space'] = false;  // einmaliger Auslöser
    fireShot();
  }
}

function fireShot() {
  const shooter = gs.players[gs.turn];
  const facing  = gs.turn === 0 ? 1 : -1;  // P1 schießt rechts, P2 links
  const angle   = gs.turn === 0 ? gs.aim.angle : 180 - gs.aim.angle;

  gs.banana = createBanana(
    shooter.x,
    shooter.y - GORILLA_H * 0.6,  // Wurfhöhe (Arm)
    angle,
    gs.aim.power,
    gs.wind,
  );
  transition('SHOOT');
}

function processFlight(dt) {
  if (gs.phase !== STATE.FLYING || !gs.banana) return;

  stepBanana(gs.banana, dt);

  if (checkOutOfBounds(gs.banana)) {
    transition('OUT_OF_BOUNDS');
    return;
  }
  if (checkTerrain(gs.banana)) {
    transition('HIT_TERRAIN');
    return;
  }
  const hitIdx = checkGorilla(gs.banana, gs.players);
  if (hitIdx !== -1) {
    gs.players[hitIdx].hp = Math.max(0, gs.players[hitIdx].hp - 30);
    transition('HIT_GORILLA');
  }
}

function processNextTurn() {
  if (gs.phase !== STATE.NEXT_TURN) return;
  transition('NEXT_TURN_DONE');
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
  processFlight(dt);
  processNextTurn();
  render(ctx, gs);
  requestAnimationFrame(tick);
}

requestAnimationFrame(tick);
