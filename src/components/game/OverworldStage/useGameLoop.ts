import { useCallback, useEffect, useRef, useState } from "react";
import {
  AVAILABLE_NPCS,
  CHARACTERS,
  NPC_ICONS,
} from "../../../data/characters";
import { QUEST_REGISTRY } from "../../../data/quests";
import { ZoneConfig } from "../../../data/types";
import {
  GAME_HEIGHT,
  GAME_LOOP_FPS,
  GAME_WIDTH,
  PLAYER_SIZE,
} from "./constants";
import { NPC } from "./types";
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

  const isPlayerMoving = dx !== 0 || dy !== 0;

  let closestNpcId: string | null = null;
  let closestDist = Infinity;
  let isNpcMovingIntoPlayer = false;

  const updatedNpcs = npcs.map((npc) => {
    const dist = Math.hypot(newX - npc.x, newY - npc.y);

    if (dist < closestDist) {
      closestDist = dist;
      closestNpcId = npc.id;
      isNpcMovingIntoPlayer = (npc.dx !== 0 || npc.dy !== 0) && dist < 32;
    }

    if (dist < 80) return npc;

    return updateSingleNpc(npc, newX, newY, isPlayerMoving, currentZones);
  });

  const activeZone =
    findActiveStaticZone(newX, newY, currentZones) ||
    (closestNpcId && closestDist < 80 ? closestNpcId : null);

  // UX FIX: Two-way dynamic collision text
  let bump = null;

  if (
    closestNpcId &&
    closestDist < 32 &&
    (isPlayerMoving || isNpcMovingIntoPlayer) &&
    Math.random() < 0.05
  ) {
    const bumpLines = ["Watch it!", "Hey!", "Ouch!", "Careful!", "Excuse me!"];
    const randomMsg = bumpLines[Math.floor(Math.random() * bumpLines.length)];

    let bumpTarget;
    if (!isPlayerMoving && isNpcMovingIntoPlayer) {
      bumpTarget = "player";
    } else {
      bumpTarget = Math.random() > 0.5 ? "player" : closestNpcId;
    }

    bump = { id: bumpTarget, msg: randomMsg };
  }

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

  const isBumpActiveRef = useRef(false);

  const getNpcIcon = (npcRole: string): string => {
    const iconKey = Object.keys(NPC_ICONS).find((k) => npcRole.includes(k));
    return iconKey ? NPC_ICONS[iconKey as keyof typeof NPC_ICONS] : "👤";
  };

  useEffect(() => {
    const spawnNpcs = () => {
      const mappedAvailableNPCs = AVAILABLE_NPCS.filter(
        (npc) =>
          npc.id !== "sys_comms" && !npc.role.toLowerCase().includes("system"),
      ).map((npc) => {
        const icon = getNpcIcon(npc.role);
        return {
          id: npc.id,
          name: npc.name,
          department: npc.role,
          icon,
        };
      });

      const baseAvailable = [
        ...CHARACTERS.filter((c) => c.id !== charId),
        ...mappedAvailableNPCs,
      ];

      const forceSpawnIds = new Set<string>();
      const inv = JSON.parse(
        sessionStorage.getItem("minion_inventory") || "[]",
      );

      const activeQuestDefs = QUEST_REGISTRY.filter((q) =>
        activeQuests.includes(q.id),
      );
      activeQuestDefs.forEach((q) => {
        if (q.targetNpcId) forceSpawnIds.add(q.targetNpcId);
      });

      if (inv.includes("Director's Script")) forceSpawnIds.add("npc_arthur");
      if (inv.includes("Water Bottle")) forceSpawnIds.add("npc_madeline");
      if (inv.includes("AA Batteries")) forceSpawnIds.add("char_casey");
      if (inv.includes("Gaff Tape")) forceSpawnIds.add("char_alex");
      if (inv.includes("Missing Prop Sword")) forceSpawnIds.add("npc_sam");

      const forceSpawnArray = new Set(Array.from(forceSpawnIds));
      const mustSpawn = baseAvailable.filter((npc) =>
        forceSpawnArray.has(npc.id),
      );
      const shuffled = baseAvailable
        .filter((npc) => !forceSpawnArray.has(npc.id))
        .sort(() => 0.5 - Math.random());

      const randomCount = Math.max(0, 3 - mustSpawn.length);
      const toSpawn = [...mustSpawn, ...shuffled.slice(0, randomCount)];

      const spawned = toSpawn.map((npc) => {
        let x = 0;
        let y = 0;
        let attempts = 0;
        do {
          x = Math.random() * (GAME_WIDTH - 200) + 100;
          y = Math.random() * (GAME_HEIGHT - 200) + 100;
          attempts++;
        } while (checkCollision(x, y, currentZones) && attempts < 50);

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

    Promise.resolve().then(() => {
      setNpcs(spawnNpcs());
    });
  }, [charId, currentRoom, currentZones, activeQuests]);

  const inputRef = useRef(input);
  const npcsRef = useRef(npcs);
  const targetPosRef = useRef(targetPos);

  useEffect(() => {
    inputRef.current = input;
  }, [input]);
  useEffect(() => {
    npcsRef.current = npcs;
  }, [npcs]);
  useEffect(() => {
    targetPosRef.current = targetPos;
  }, [targetPos]);

  const handleGameLoopTick = useCallback(
    (prevPos: { x: number; y: number }) => {
      const result = computeNextState({
        prevPos,
        npcs: npcsRef.current,
        input: inputRef.current,
        targetPos: targetPosRef.current,
        currentZones,
        setTargetPos,
      });

      setNpcs(result.npcs);
      setActiveZone(result.activeZone);

      if (result.bump && !isBumpActiveRef.current) {
        isBumpActiveRef.current = true;
        setBumpMsg(result.bump);
        setTimeout(() => {
          setBumpMsg(null);
          isBumpActiveRef.current = false;
        }, 1500);
      }

      return result.pos;
    },
    [currentZones, setTargetPos],
  );

  useEffect(() => {
    if (activeNpcId) return;

    let animationFrameId: number;
    let lastTime = performance.now();

    const tick = (currentTime: number) => {
      const deltaTime = currentTime - lastTime;
      if (deltaTime >= 1000 / GAME_LOOP_FPS) {
        setPos((prevPos) => handleGameLoopTick(prevPos));
        lastTime = currentTime;
      }
      animationFrameId = requestAnimationFrame(tick);
    };

    animationFrameId = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(animationFrameId);
  }, [activeNpcId, handleGameLoopTick]);

  return { pos, setPos, npcs, activeZone, bumpMsg };
}
