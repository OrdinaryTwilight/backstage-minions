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

export function useGameLoop(
  currentZones: Record<string, ZoneConfig>,
  currentRoom: string,
  charId: string | undefined,
  up: boolean,
  down: boolean,
  left: boolean,
  right: boolean,
  targetPos: { x: number; y: number } | null,
  setTargetPos: (val: null) => void,
  activeDialogue: DialogueState | null,
) {
  const [pos, setPos] = useState({ x: GAME_WIDTH / 2, y: GAME_HEIGHT / 2 });
  const [npcs, setNpcs] = useState<NPC[]>([]);
  const [activeZone, setActiveZone] = useState<string | null>(null);
  const [bumpMsg, setBumpMsg] = useState<{ id: string; msg: string } | null>(
    null,
  );

  useEffect(() => {
    const available = CHARACTERS.filter((c) => c.id !== charId);
    let shuffled = [...available].sort(() => 0.5 - Math.random());
    let count = Math.floor(Math.random() * 3) + 2;

    // FIX 1: Ensure the Director and Lead Actor ALWAYS spawn in the Green Room
    if (currentRoom === "greenRoom") {
      const extraActors = [
        {
          id: "actor_lead",
          name: "Lead Actor",
          icon: "🎭",
          department: "Actor",
        },
        { id: "actor_chorus", name: "Chorus", icon: "👯", department: "Actor" },
        {
          id: "actor_under",
          name: "Understudy",
          icon: "🤺",
          department: "Actor",
        },
        {
          id: "director_npc",
          name: "Director",
          icon: "🎬",
          department: "Director",
        },
      ];
      shuffled = [...extraActors, ...shuffled].sort(
        () => 0.5 - Math.random(),
      ) as any;
      count += 2;
    }

    const spawned = shuffled.slice(0, count).map((npc) => {
      let spawnX, spawnY;
      do {
        spawnX = Math.random() * (GAME_WIDTH - 200) + 100;
        spawnY = Math.random() * (GAME_HEIGHT - 200) + 100;
      } while (checkCollision(spawnX, spawnY, currentZones));

      return {
        id: npc.id,
        name: npc.name,
        icon: npc.icon,
        dept: npc.department || (npc as any).role,
        x: spawnX,
        y: spawnY,
        dx: (Math.random() - 0.5) * 2,
        dy: (Math.random() - 0.5) * 2,
        moveTimer: Math.floor(Math.random() * 100) + 50,
        isHidden: false,
        hideTimer: 0,
      };
    });
    setNpcs(spawned as NPC[]);
  }, [charId, currentRoom, currentZones]);

  useEffect(() => {
    if (activeDialogue) return;

    const interval = setInterval(() => {
      setPos((prevPos) => {
        const { dx, dy, reached } = calculateMovementDelta(
          prevPos,
          targetPos,
          up,
          down,
          left,
          right,
        );
        if (reached) setTargetPos(null);

        let newX = prevPos.x + dx;
        let newY = prevPos.y + dy;
        newX = Math.max(0, Math.min(newX, GAME_WIDTH - PLAYER_SIZE));
        newY = Math.max(0, Math.min(newY, GAME_HEIGHT - PLAYER_SIZE));

        if (checkCollision(newX, prevPos.y, currentZones)) {
          newX = prevPos.x;
          setTargetPos(null);
        }
        if (checkCollision(prevPos.x, newY, currentZones)) {
          newY = prevPos.y;
          setTargetPos(null);
        }

        const isPlayerMoving = dx !== 0 || dy !== 0;

        let currentNpcs: NPC[] = [];
        setNpcs((prevNpcs) => {
          currentNpcs = prevNpcs.map((npc) => {
            // FIX 2: Freeze the NPC in place if the player steps within interaction radius!
            const distToPlayer = Math.hypot(newX - npc.x, newY - npc.y);
            if (distToPlayer < 80) {
              return npc; // Skip updating position so they stop and wait for you
            }
            return updateSingleNpc(
              npc,
              newX,
              newY,
              isPlayerMoving,
              currentZones,
            );
          });
          return currentNpcs;
        });

        const currentActiveStatic = findActiveStaticZone(
          newX,
          newY,
          currentZones,
        );

        let closestNpcId: string | null = null;
        let closestDist = Infinity;

        if (currentNpcs.length > 0) {
          const distances = currentNpcs.map((npc) => ({
            npc,
            dist: Math.hypot(newX - npc.x, newY - npc.y),
          }));
          const closest = distances.reduce(
            (prev, curr) => (curr.dist < prev.dist ? curr : prev),
            distances[0],
          );

          if (closest.dist < 80) {
            closestNpcId = closest.npc.id;
            closestDist = closest.dist;
          }
          if (
            closest.dist < 32 &&
            isPlayerMoving &&
            Math.random() < 0.05 &&
            !bumpMsg
          ) {
            setBumpMsg({ id: closest.npc.id, msg: "Watch it!" });
            setTimeout(() => setBumpMsg(null), 1500);
          }
        }

        // Priority Logic: Close NPC > Static Zone > Farther NPC
        if (closestNpcId && closestDist < 30) {
          setActiveZone(closestNpcId);
        } else if (currentActiveStatic) {
          setActiveZone(currentActiveStatic);
        } else if (closestNpcId) {
          setActiveZone(closestNpcId);
        } else {
          setActiveZone(null);
        }

        return { x: newX, y: newY };
      });
    }, 1000 / GAME_LOOP_FPS);

    return () => clearInterval(interval);
  }, [
    up,
    down,
    left,
    right,
    targetPos,
    activeDialogue,
    bumpMsg,
    currentZones,
    setTargetPos,
  ]);

  return { pos, setPos, npcs, activeZone, bumpMsg };
}
