import { GORILLA_HP, WIND_MAX, AI_THINK_DELAY, CANVAS_W } from './constants.js';

export const STATE = {
  SETUP:      'SETUP',
  AIMING:     'AIMING',
  FLYING:     'FLYING',
  EXPLODING:  'EXPLODING',
  NEXT_TURN:  'NEXT_TURN',
  GAME_OVER:  'GAME_OVER',
};

export const gs = {
  phase:        STATE.SETUP,
  turn:         0,
  players: [
    { hp: GORILLA_HP, isAI: false, name: 'Spieler 1', x: 0, y: 0, animState: 'idle' },
    { hp: GORILLA_HP, isAI: false, name: 'Spieler 2', x: 0, y: 0, animState: 'idle' },
  ],
  aim:          { angle: 45, power: 50 },
  wind:         0,
  banana:       null,
  particles:    [],
  explodeTimer: 0,
  aiThinkTimer: 0,
  winner:       -1,
};

export function initGame(player2IsAI = false) {
  gs.phase        = STATE.SETUP;
  gs.turn         = 0;
  gs.winner       = -1;
  gs.banana       = null;
  gs.particles    = [];
  gs.players[0]   = { hp: GORILLA_HP, isAI: false, name: 'Spieler 1', x: 0, y: 0, animState: 'idle' };
  gs.players[1]   = { hp: GORILLA_HP, isAI: player2IsAI, name: player2IsAI ? 'KI' : 'Spieler 2', x: 0, y: 0, animState: 'idle' };
  gs.aim          = { angle: 45, power: 50 };
  gs.wind         = (Math.random() * 2 - 1) * WIND_MAX;
}

export function transition(event) {
  switch (gs.phase) {
    case STATE.SETUP:
      if (event === 'SETUP_DONE') gs.phase = STATE.AIMING;
      break;

    case STATE.AIMING:
      if (event === 'SHOOT') {
        gs.phase = STATE.FLYING;
        gs.players[gs.turn].animState = 'throw';
      }
      break;

    case STATE.FLYING:
      if (event === 'OUT_OF_BOUNDS') {
        gs.banana = null;
        gs.phase  = STATE.NEXT_TURN;
      } else if (event === 'HIT_TERRAIN' || event === 'HIT_GORILLA') {
        gs.phase = STATE.EXPLODING;
        gs.explodeTimer = 0.6;
      }
      break;

    case STATE.EXPLODING:
      if (event === 'EXPLODE_DONE') {
        if (gs.players[0].hp <= 0 || gs.players[1].hp <= 0) {
          gs.winner = gs.players[0].hp > 0 ? 0 : 1;
          gs.phase  = STATE.GAME_OVER;
        } else {
          gs.phase = STATE.NEXT_TURN;
        }
      }
      break;

    case STATE.NEXT_TURN:
      if (event === 'NEXT_TURN_DONE') {
        gs.turn                  = 1 - gs.turn;
        gs.wind                  = (Math.random() * 2 - 1) * WIND_MAX;
        gs.aim                   = { angle: 45, power: 50 };
        gs.banana                = null;
        gs.particles             = [];
        gs.players[0].animState  = 'idle';
        gs.players[1].animState  = 'idle';
        gs.aiThinkTimer          = AI_THINK_DELAY;
        gs.phase                 = STATE.AIMING;
      }
      break;
  }
}
