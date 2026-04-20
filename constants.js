export const CANVAS_W = 640;   // interne Auflösung — CSS skaliert auf 1280×720
export const CANVAS_H = 360;
export const GRAVITY = 300;        // px/s²
export const EXPLOSION_RADIUS = 40;
export const GORILLA_W = 40;
export const GORILLA_H = 50;
export const GORILLA_HP = 100;
export const WIND_MAX = 30;        // px/s²
export const AI_THINK_DELAY = 1.5; // Sekunden
export const AI_INACCURACY = 15;   // Grad Zufalls-Abweichung

export const COLORS = {
  SKY_TOP:      '#99f2f2', // Helles Türkis aus dem Bild
  SKY_BOTTOM:   '#ffffff', // Weißer Horizont/Wolken
  TERRAIN:      '#2d3e30', // Dunkles Wald-Grün/Braun
  SURFACE:      '#4caf50', // Sattes Gras-Grün
  BANANA:       '#fbff00',
  GORILLA_BODY: '#5d4037',
  GORILLA_DARK: '#3e2723',
  GORILLA_EYES: '#00f2ff',
  HP_GOOD:      '#00f2ff',
  HP_BAD:       '#ff0055',
  WIND:         '#00f2ff',
  TEXT:         '#ffffff',
  PARTICLE:     ['#4caf50', '#8bc34a', '#2d3e30', '#fbff00'],
  CITY_GLOW:    'rgba(0,0,0,0)', // Deaktiviert für Natur-Look
  STAR_COLOR:   'rgba(255,255,255,0.5)',
};
