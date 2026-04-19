// src/components/game/OverworldStage/useGameLoop.ts
import { useCallback, useEffect, useState } from "react";
import { CHARACTERS } from "../../../data/gameData";
import { ZoneConfig } from "../../../data/types";
import {
  GAME_HEIGHT,
  GAME_LOOP_FPS,
  GAME_WIDTH,
  PLAYER_SIZE,
} from "./constants";
import { NPC } from "./types"; // Note: Removed DialogueState
import {
  calculateMovementDelta,
  checkCollision,
  findActiveStaticZone,
  updateSingleNpc,
} from "./utils";

/* ---------------- TYPES ---------------- */

interface InputState {
  up: boolean;
  down: boolean;
  left: boolean;
  right: boolean;
}

interface UseGameLoopParams {
  currentZones: Record<string, ZoneConfig>;
  currentRoom: string;
  charId?: string;
  input: InputState;
  targetPos: { x: number; y: number } | null;
  setTargetPos: (val: null) => void;
  activeNpcId: string | null;
  activeQuests: string[];
}

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
  activeNpcId,
  activeQuests,
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
    const spawnNpcs = () => {
      const available = CHARACTERS.filter((c) => c.id !== charId);

      // 1. Identify which NPCs MUST spawn based on active quests
      const forceSpawnIds: string[] = [];
      if (activeQuests.includes("find_directors_script"))
        forceSpawnIds.push("npc_director");
      if (activeQuests.includes("find_water_bottle"))
        forceSpawnIds.push("npc_elara");
      if (activeQuests.includes("find_gaff_tape"))
        forceSpawnIds.push("npc_zainab");

      // 2. Separate required vs random
      const mustSpawn = available.filter((npc) =>
        forceSpawnIds.includes(npc.id),
      );

      // 3. Shuffle optional and pick enough to have roughly 3-4 NPCs in the room
      const shuffled = [...available].sort(() => 0.5 - Math.random());
      const randomCount = Math.max(0, 3 - mustSpawn.length);
      const toSpawn = [...mustSpawn, ...shuffled.slice(0, randomCount)];

      const spawned = toSpawn.map((npc) => {
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
          dept: npc.department || "crew",
          x,
          y,
          dx: (Math.random() - 0.5) * 2,
          dy: (Math.random() - 0.5) * 2,
          moveTimer: Math.floor(Math.random() * 100) + 50,
          isHidden: false,
          hideTimer: 0,
        };
      });

      return spawned as NPC[];
    };

    // Defer setState to avoid cascading renders
    Promise.resolve().then(() => {
      setNpcs(spawnNpcs());
    });
  }, [charId, currentRoom, currentZones, activeQuests]);

  /* ---------------- GAME LOOP ---------------- */

  // Extract callback to reduce nesting depth and add to useCallback
  const handleGameLoopTick = useCallback(
    (prevPos: { x: number; y: number }) => {
      const result = computeNextState({
        prevPos,
        npcs,
        input,
        targetPos,
        currentZones,
        setTargetPos,
      });

      Promise.resolve().then(() => {
        setNpcs(result.npcs);
        setActiveZone(result.activeZone);

        if (result.bump && !bumpMsg) {
          setBumpMsg(result.bump);
          setTimeout(() => setBumpMsg(null), 1500);
        }
      });

      return result.pos;
    },
    [npcs, input, targetPos, currentZones, setTargetPos, bumpMsg],
  );

  useEffect(() => {
    if (activeNpcId) return;

    const interval = setInterval(() => {
      setPos(handleGameLoopTick);
    }, 1000 / GAME_LOOP_FPS);

    return () => clearInterval(interval);
  }, [handleGameLoopTick, activeNpcId]);

  return { pos, setPos, npcs, activeZone, bumpMsg };
}
