export const STATE = {
  SETUP: 'SETUP', AIMING: 'AIMING', FLYING: 'FLYING',
  EXPLODING: 'EXPLODING', NEXT_TURN: 'NEXT_TURN', GAME_OVER: 'GAME_OVER',
};
export const gs = { phase: STATE.SETUP };
export function transition(_event) {}
