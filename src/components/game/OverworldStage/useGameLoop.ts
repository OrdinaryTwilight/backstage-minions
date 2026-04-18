import { useEffect, useState } from "react";
import { CHARACTERS } from "../../../data/gameData";
import { ZoneConfig } from "../../../data/types";
import {
  GAME_HEIGHT,
  GAME_LOOP_FPS,
  GAME_WIDTH,
  PLAYER_SIZE,
} from "./constants";
import { DialogueState, NPC } from "./types";
import {
  calculateMovementDelta,
  checkCollision,
  findActiveStaticZone,
  updateSingleNpc,
} from "./utils";

/* ---------------- TYPES ---------------- */

type InputState = {
  up: boolean;
  down: boolean;
  left: boolean;
  right: boolean;
};

type UseGameLoopParams = {
  currentZones: Record<string, ZoneConfig>;
  currentRoom: string;
  charId?: string;
  input: InputState;
  targetPos: { x: number; y: number } | null;
  setTargetPos: (val: null) => void;
  activeDialogue: DialogueState | null;
};

/* ---------------- PURE TICK ENGINE ---------------- */

function computeNextState(params: {
  prevPos: { x: number; y: number };
  npcs: NPC[];
  input: InputState;
  targetPos: { x: number; y: number } | null;
  currentZones: Record<string, ZoneConfig>;
  setTargetPos: (val: null) => void;
}) {
  const { prevPos, npcs, input, targetPos, currentZones, setTargetPos } =
    params;

  const { dx, dy, reached } = calculateMovementDelta(
    prevPos,
    targetPos,
    input.up,
    input.down,
    input.left,
    input.right,
  );

  if (reached) setTargetPos(null);

  let newX = prevPos.x + dx;
  let newY = prevPos.y + dy;

  newX = Math.max(0, Math.min(newX, GAME_WIDTH - PLAYER_SIZE));
  newY = Math.max(0, Math.min(newY, GAME_HEIGHT - PLAYER_SIZE));

  if (checkCollision(newX, prevPos.y, currentZones)) newX = prevPos.x;
  if (checkCollision(prevPos.x, newY, currentZones)) newY = prevPos.y;

  const isMoving = dx !== 0 || dy !== 0;

  let closestNpcId: string | null = null;
  let closestDist = Infinity;

  const updatedNpcs = npcs.map((npc) => {
    const dist = Math.hypot(newX - npc.x, newY - npc.y);

    if (dist < closestDist) {
      closestDist = dist;
      closestNpcId = npc.id;
    }

    if (dist < 80) return npc;

    return updateSingleNpc(npc, newX, newY, isMoving, currentZones);
  });

  const activeZone =
    findActiveStaticZone(newX, newY, currentZones) ||
    (closestNpcId && closestDist < 80 ? closestNpcId : null);

  const bump =
    closestNpcId && closestDist < 32 && isMoving && Math.random() < 0.05
      ? { id: closestNpcId, msg: "Watch it!" }
      : null;

  return {
    pos: { x: newX, y: newY },
    npcs: updatedNpcs,
    activeZone,
    bump,
  };
}

/* ---------------- HOOK ---------------- */

export function useGameLoop({
  currentZones,
  currentRoom,
  charId,
  input,
  targetPos,
  setTargetPos,
  activeDialogue,
}: UseGameLoopParams) {
  const [pos, setPos] = useState({
    x: GAME_WIDTH / 2,
    y: GAME_HEIGHT / 2,
  });

  const [npcs, setNpcs] = useState<NPC[]>([]);
  const [activeZone, setActiveZone] = useState<string | null>(null);
  const [bumpMsg, setBumpMsg] = useState<{
    id: string;
    msg: string;
  } | null>(null);

  /* ---------------- SPAWN NPCS ---------------- */

  useEffect(() => {
    const available = CHARACTERS.filter((c) => c.id !== charId);
    const shuffled = [...available].sort(() => 0.5 - Math.random());
    const count = Math.floor(Math.random() * 3) + 2;

    const spawned = shuffled.slice(0, count).map((npc) => {
      let x = 0;
      let y = 0;

      do {
        x = Math.random() * (GAME_WIDTH - 200) + 100;
        y = Math.random() * (GAME_HEIGHT - 200) + 100;
      } while (checkCollision(x, y, currentZones));

      return {
        id: npc.id,
        name: npc.name,
        icon: npc.icon,
        dept: npc.department || (npc as any).role,
        x,
        y,
        dx: (Math.random() - 0.5) * 2,
        dy: (Math.random() - 0.5) * 2,
        moveTimer: Math.floor(Math.random() * 100) + 50,
        isHidden: false,
        hideTimer: 0,
      };
    });

    setNpcs(spawned as NPC[]);
  }, [charId, currentRoom, currentZones]);

  /* ---------------- GAME LOOP ---------------- */

  useEffect(() => {
    if (activeDialogue) return;

    const interval = setInterval(() => {
      setPos((prevPos) => {
        const result = computeNextState({
          prevPos,
          npcs,
          input,
          targetPos,
          currentZones,
          setTargetPos,
        });

        setNpcs(result.npcs);
        setActiveZone(result.activeZone);

        if (result.bump && !bumpMsg) {
          setBumpMsg(result.bump);
          setTimeout(() => setBumpMsg(null), 1500);
        }

        return result.pos;
      });
    }, 1000 / GAME_LOOP_FPS);

    return () => clearInterval(interval);
  }, [
    npcs,
    input.up,
    input.down,
    input.left,
    input.right,
    targetPos,
    activeDialogue,
    currentZones,
  ]);

  return { pos, setPos, npcs, activeZone, bumpMsg };
}
