import { CANVAS_W, CANVAS_H, COLORS } from './constants.js';

export const terrainH  = new Float32Array(CANVAS_W);
export const terrainPx = new Uint8Array(CANVAS_W * CANVAS_H);

let _imageDataDirty  = true;
let _cachedImageData = null;

export function generateTerrain() {
  terrainPx.fill(0);
  for (let x = 0; x < CANVAS_W; x++) {
    // Tal-Faktor: In der Mitte tiefer (wie der Fluss im Bild)
    const mid = CANVAS_W / 2;
    const valleyFactor = Math.pow(Math.abs(x - mid) / mid, 0.8) * 100;
    
    const noise = Math.sin(x * 0.015) * 40 + 
                  Math.sin(x * 0.03 + 2) * 20 + 
                  (Math.random() - 0.5) * 3;
    
    terrainH[x] = 120 + valleyFactor + noise;
    
    for (let y = Math.floor(terrainH[x]); y < CANVAS_H; y++) {
      terrainPx[y * CANVAS_W + x] = 1;
    }
  }
  _imageDataDirty = true;
}

export function getHeight(x) {
  const xi = Math.max(0, Math.min(CANVAS_W - 1, Math.floor(x)));
  return terrainH[xi];
}

export function getPixel(x, y) {
  const xi = Math.floor(x);
  const yi = Math.floor(y);
  if (xi < 0 || xi >= CANVAS_W || yi < 0 || yi >= CANVAS_H) return false;
  return terrainPx[yi * CANVAS_W + xi] === 1;
}

export function carveExplosion(cx, cy, radius) {
  const x0 = Math.max(0, Math.floor(cx - radius));
  const x1 = Math.min(CANVAS_W - 1, Math.ceil(cx + radius));
  const y0 = Math.max(0, Math.floor(cy - radius));
  const y1 = Math.min(CANVAS_H - 1, Math.ceil(cy + radius));
  const r2 = radius * radius;

  for (let x = x0; x <= x1; x++) {
    for (let y = y0; y <= y1; y++) {
      const dx = x - cx, dy = y - cy;
      if (dx * dx + dy * dy <= r2) terrainPx[y * CANVAS_W + x] = 0;
    }
    let newH = CANVAS_H;
    for (let y = 0; y < CANVAS_H; y++) {
      if (terrainPx[y * CANVAS_W + x] === 1) { newH = y; break; }
    }
    terrainH[x] = newH;
  }
  _imageDataDirty = true;
}

function hexToRgb(hex) {
  return {
    r: parseInt(hex.slice(1, 3), 16),
    g: parseInt(hex.slice(3, 5), 16),
    b: parseInt(hex.slice(5, 7), 16),
  };
}

export function buildTerrainImageData(ctx) {
  if (!_imageDataDirty && _cachedImageData) return _cachedImageData;

  const img     = ctx.createImageData(CANVAS_W, CANVAS_H);
  const surface = hexToRgb(COLORS.SURFACE);
  const body    = hexToRgb(COLORS.TERRAIN);

  for (let x = 0; x < CANVAS_W; x++) {
    const surfY = Math.floor(terrainH[x]);
    for (let y = surfY; y < CANVAS_H; y++) {
      if (terrainPx[y * CANVAS_W + x] === 1) {
        const i = (y * CANVAS_W + x) * 4;
        
        let r = body.r;
        let g = body.g;
        let b = body.b;

        // "Rocky" Textur-Rauschen
        const noise = (Math.sin(x * 0.5) * Math.cos(y * 0.5) * 10);
        r += noise; g += noise; b += noise;

        // Oberflächen-Glow (Gras-Kante)
        if (y === surfY) {
          r = surface.r; g = surface.g; b = surface.b;
        } else if (y < surfY + 4) {
          const factor = 1 - (y - surfY) / 4;
          r = r * (1 - factor) + surface.r * factor;
          g = g * (1 - factor) + surface.g * factor;
          b = b * (1 - factor) + surface.b * factor;
        }

        img.data[i]     = Math.min(255, r);
        img.data[i + 1] = Math.min(255, g);
        img.data[i + 2] = Math.min(255, b);
        img.data[i + 3] = 255;
      }
    }
  }
  _cachedImageData = img;
  _imageDataDirty  = false;
  return img;
}
