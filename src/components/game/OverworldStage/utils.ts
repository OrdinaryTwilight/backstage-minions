import { ZoneConfig } from "../../../data/types";
import {
  GAME_HEIGHT,
  GAME_WIDTH,
  PLAYER_SIZE,
  PLAYER_SPEED,
} from "./constants";
import { NPC } from "./types";

export const checkCollision = (
  newX: number,
  newY: number,
  mapZones: Record<string, ZoneConfig>,
) => {
  for (const zone of Object.values(mapZones)) {
    if (zone.isSolid) {
      if (
        newX < zone.x + zone.w &&
        newX + PLAYER_SIZE > zone.x &&
        newY < zone.y + zone.h &&
        newY + PLAYER_SIZE > zone.y
      )
        return true;
    }
  }
  return false;
};

export const findActiveStaticZone = (
  playerX: number,
  playerY: number,
  mapZones: Record<string, ZoneConfig>,
): string | null => {
  for (const [key, zone] of Object.entries(mapZones)) {
    if (
      playerX < zone.x + zone.w + 20 &&
      playerX + PLAYER_SIZE > zone.x - 20 &&
      playerY < zone.y + zone.h + 20 &&
      playerY + PLAYER_SIZE > zone.y - 20
    )
      return key;
  }
  return null;
};

export const calculateMovementDelta = (
  pos: { x: number; y: number },
  targetPos: { x: number; y: number } | null,
  up: boolean,
  down: boolean,
  left: boolean,
  right: boolean,
) => {
  let dx = 0;
  let dy = 0;
  if (targetPos) {
    const dist = Math.hypot(targetPos.x - pos.x, targetPos.y - pos.y);
    if (dist < PLAYER_SPEED) return { dx: 0, dy: 0, reached: true };
    dx = ((targetPos.x - pos.x) / dist) * PLAYER_SPEED;
    dy = ((targetPos.y - pos.y) / dist) * PLAYER_SPEED;
    return { dx, dy, reached: false };
  }
  if (up) dy -= PLAYER_SPEED;
  if (down) dy += PLAYER_SPEED;
  if (left) dx -= PLAYER_SPEED;
  if (right) dx += PLAYER_SPEED;
  return { dx, dy, reached: false };
};

export const updateSingleNpc = (
  npc: NPC,
  playerX: number,
  playerY: number,
  playerMoving: boolean,
  mapZones: Record<string, ZoneConfig>,
): NPC => {
  if (npc.isHidden) {
    if (npc.hideTimer <= 0)
      return {
        ...npc,
        isHidden: false,
        x: GAME_WIDTH - 50, // Dynamically use GAME_WIDTH instead of hardcoded 600
        y: Math.random() * (GAME_HEIGHT - 100) + 50,
        dx: -1,
        dy: Math.random() - 0.5,
      };
    return { ...npc, hideTimer: npc.hideTimer - 1 };
  }

  const distToPlayer = Math.hypot(playerX - npc.x, playerY - npc.y);
  let stepX = npc.dx;
  let stepY = npc.dy;

  if (distToPlayer < 80 && playerMoving) {
    stepX *= 0.3;
    stepY *= 0.3;
  }

  const nX = npc.x + stepX;
  const nY = npc.y + stepY;

  // Dynamically use GAME_WIDTH to calculate hide trigger
  if (nX > GAME_WIDTH - 50 && Math.random() < 0.01) {
    return {
      ...npc,
      isHidden: true,
      hideTimer: Math.floor(Math.random() * 180) + 120,
    };
  }

  if (
    nX <= 0 ||
    nX >= GAME_WIDTH - PLAYER_SIZE ||
    checkCollision(nX, npc.y, mapZones)
  )
    npc.dx *= -1;
  if (
    nY <= 0 ||
    nY >= GAME_HEIGHT - PLAYER_SIZE ||
    checkCollision(npc.x, nY, mapZones)
  )
    npc.dy *= -1;

  let nTimer = npc.moveTimer - 1;
  if (nTimer <= 0) {
    npc.dx = (Math.random() - 0.5) * 2;
    npc.dy = (Math.random() - 0.5) * 2;
    nTimer = Math.floor(Math.random() * 120) + 60;
  }
  return { ...npc, x: nX, y: nY, moveTimer: nTimer };
};
