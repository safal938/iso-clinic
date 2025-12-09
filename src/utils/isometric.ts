import { Point } from '../types/isoclinic';

const TILE_WIDTH = 64;
const TILE_HEIGHT = 32;

export const gridToScreen = (gridX: number, gridY: number): Point => {
  const x = (gridX - gridY) * TILE_WIDTH / 2;
  const y = (gridX + gridY) * TILE_HEIGHT / 2;
  return { x, y };
};

export const getRoomCenter = (gridX: number, gridY: number, width: number, height: number): Point => {
  const centerX = gridX + width / 2;
  const centerY = gridY + height / 2;
  return gridToScreen(centerX, centerY);
};

export const lerp = (p1: Point, p2: Point, t: number): Point => {
  return {
    x: p1.x + (p2.x - p1.x) * t,
    y: p1.y + (p2.y - p1.y) * t,
  };
};

export const getRandomColor = () => {
  const clothing = [
    '#64748b',
    '#475569',
    '#94a3b8',
    '#334155',
    '#57534e',
    '#78716c',
    '#8b5cf6',
    '#3b82f6',
  ];
  return clothing[Math.floor(Math.random() * clothing.length)];
};

export const getIsoDepth = (gridX: number, gridY: number): number => {
  return gridX + gridY;
};
