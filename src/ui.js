import { GORILLA_HP, WIND_MAX } from './constants.js';
import { STATE } from './state.js';

export function drawUI(ctx, gs) {
  updateHPBars(gs);
  updateWindIndicator(gs);
  updateTurnAndAim(gs);
  updateGameOver(gs);
}

function updateHPBars(gs) {
  const p0Stats = document.getElementById('p0-stats');
  const p1Stats = document.getElementById('p1-stats');
  const p0Hp    = document.getElementById('p0-hp');
  const p1Hp    = document.getElementById('p1-hp');
  
  if (p0Stats) p0Stats.querySelector('.player-name').textContent = gs.players[0].name;
  if (p1Stats) p1Stats.querySelector('.player-name').textContent = gs.players[1].name;

  if (p0Hp) {
    const pct = Math.max(0, gs.players[0].hp / GORILLA_HP) * 100;
    p0Hp.style.width = `${pct}%`;
    p0Hp.classList.toggle('low', pct < 30);
  }
  
  if (p1Hp) {
    const pct = Math.max(0, gs.players[1].hp / GORILLA_HP) * 100;
    p1Hp.style.width = `${pct}%`;
    p1Hp.classList.toggle('low', pct < 30);
  }
}

function updateWindIndicator(gs) {
  const windBar   = document.getElementById('wind-line');
  const windHead  = document.getElementById('wind-arrowhead');
  const windValue = document.getElementById('wind-value');
  const arrowLeft = document.getElementById('wind-arrow-left');
  const arrowRight = document.getElementById('wind-arrow-right');
  if (!windBar) return;

  const pct = gs.wind / WIND_MAX; // -1 to +1
  const absPct = Math.abs(pct);
  const goRight = gs.wind >= 0;

  if (absPct < 0.02) {
    windBar.style.width = '0';
    if (windHead) { windHead.style.left = '50%'; windHead.classList.remove('right', 'left'); }
    if (arrowLeft)  arrowLeft.classList.remove('active');
    if (arrowRight) arrowRight.classList.remove('active');
  } else if (goRight) {
    windBar.style.left  = '50%';
    windBar.style.width = `${absPct * 46}%`;
    windBar.classList.remove('leftward');
    if (windHead) { windHead.style.left = `calc(50% + ${absPct * 46}% - 1px)`; windHead.classList.remove('left'); windHead.classList.add('right'); }
    if (arrowRight) arrowRight.classList.add('active');
    if (arrowLeft)  arrowLeft.classList.remove('active');
  } else {
    windBar.style.left  = `${50 - absPct * 46}%`;
    windBar.style.width = `${absPct * 46}%`;
    windBar.classList.add('leftward');
    if (windHead) { windHead.style.left = `calc(${50 - absPct * 46}% - 6px)`; windHead.classList.remove('right'); windHead.classList.add('left'); }
    if (arrowLeft)  arrowLeft.classList.add('active');
    if (arrowRight) arrowRight.classList.remove('active');
  }

  if (windValue) windValue.textContent = `${gs.wind > 0 ? '+' : ''}${Math.round(gs.wind)}`;
}

function updateTurnAndAim(gs) {
  const turnInd = document.getElementById('turn-indicator');
  const aimUi   = document.getElementById('aim-ui');
  
  if (gs.phase === STATE.AIMING) {
    if (turnInd) {
      turnInd.textContent = `${gs.players[gs.turn].name} ist dran`;
      turnInd.style.opacity = '1';
    }
    
    if (!gs.players[gs.turn].isAI) {
      if (aimUi) {
        aimUi.classList.add('active');
        document.getElementById('angle-val').textContent = Math.round(gs.aim.angle);
        document.getElementById('power-val').textContent = Math.round(gs.aim.power);
      }
    } else {
      if (aimUi) aimUi.classList.remove('active');
    }
  } else {
    if (turnInd) turnInd.style.opacity = '0';
    if (aimUi)   aimUi.classList.remove('active');
  }
}

function updateGameOver(gs) {
  const overlay = document.getElementById('game-over-overlay');
  const winner  = document.getElementById('winner-name');
  
  if (gs.phase === STATE.GAME_OVER) {
    if (overlay) overlay.classList.add('visible');
    if (winner) {
      winner.textContent = gs.winner === -1
        ? 'Unentschieden!'
        : `${gs.players[gs.winner].name} gewinnt!`;
    }
  } else {
    if (overlay) overlay.classList.remove('visible');
  }
}
