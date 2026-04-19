// Neon-Night Farbpalette
export const COLORS = {
  sky:           '#0a0e27',
  terrain:       '#1a3a3a',
  gorilla:       '#c41e3a',
  banana:        '#ffd700',
  explosion:     '#ff6b35',
  particle:      '#ff8c00',
  hp_full:       '#00ff00',
  hp_low:        '#ff0000',
  wind_arrow:    '#00ffff',
  ui_text:       '#ffffff',
};

// Canvas-Dimensionen
export const CANVAS_W = 640;
export const CANVAS_H = 360;

// Gorilla
export const GORILLA_HP = 100;
export const GORILLA_W = 64;
export const GORILLA_H = 80;

// Banana / Physik
export const BANANA_R = 4;
export const GRAVITY = 200; // px/s²
export const AIR_FRICTION = 0.99; // per frame
export const BANANA_TERMINAL_V = 250; // px/s

// Physics Sub-Stepping
export const STEP_THRESHOLD = 200; // px/s, wenn überschritten: 4x Sub-Steps

// Explosion
export const EXPLOSION_RADIUS = 60;
export const EXPLOSION_DURATION = 0.6; // Sekunden
export const DAMAGE_DIRECT = 30; // HP bei Direkttreffer
export const DAMAGE_SPLASH = 10; // HP bei Splash (im Radius)

// Wind
export const WIND_MAX = 100; // Max absolute Windstärke (px/s)

// AI
export const AI_THINK_DELAY = 1.5; // Sekunden Nachdenkzeit für KI
