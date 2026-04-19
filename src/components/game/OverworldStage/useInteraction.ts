// src/components/game/OverworldStage/useInteraction.ts
import { useCallback } from "react";
import { NARRATIVE } from "../../../data/narrative";
import { ZoneConfig } from "../../../data/types";
import { OVERWORLD_MAPS } from "../../../data/zones";
import { GameState } from "../../../types/game";
import { GAME_HEIGHT, GAME_WIDTH, PLAYER_SIZE } from "./constants";
import { DialogueState, FeedbackMessage, NPC } from "./types"; // Note: Removed DialogueState

interface UseInteractionProps {
  activeZone: string | null;
  // CHANGED: Tracks active NPC string instead of dialogue object
  activeNpcId: string | null;
  currentZones: Record<string, ZoneConfig>;
  npcs: NPC[];
  currentRoom: string;
  targetZoneId: string | null;
  targetLabel: string;
  state: GameState;
  setCurrentRoom: (room: string) => void;
  setPos: (pos: { x: number; y: number }) => void;
  setTargetPos: (pos: null) => void;
  setActiveNpcId: (id: string | null) => void;
  setFeedbackMsg: (msg: FeedbackMessage | null) => void;
  onComplete: () => void;
  activeQuestDialogue: DialogueState | null;
  setActiveQuestDialogue: (dialogue: DialogueState | null) => void;
  checkQuestIntercept: (zone: string, npc?: NPC) => DialogueState | null;
}

const formatRoomName = (str: string) =>
  str
    .replaceAll(/([A-Z])/g, " $1")
    .replace(/^./, (s: string) => s.toUpperCase());

// --- EXTRACTED HELPER: Calculates the correct spawn coordinates ---
function getDoorSpawnPosition(targetRoomId: string, currentRoomId: string) {
  let spawnX = GAME_WIDTH / 2;
  let spawnY = GAME_HEIGHT / 2;

  const targetRoomConfig = OVERWORLD_MAPS[targetRoomId];
  if (!targetRoomConfig) return { x: spawnX, y: spawnY };

  // Find the door in the NEXT room that leads BACK to the CURRENT room
  const entryDoorKey = Object.keys(targetRoomConfig).find(
    (k) => targetRoomConfig[k].isDoor === currentRoomId,
  );

  if (entryDoorKey) {
    const door = targetRoomConfig[entryDoorKey];
    spawnX = door.x + door.w / 2 - PLAYER_SIZE / 2;
    // If the door is at the top of the screen, spawn below it. Otherwise, spawn above it.
    spawnY =
      door.y < GAME_HEIGHT / 2
        ? door.y + door.h + 10
        : door.y - PLAYER_SIZE - 10;
  }

  return { x: spawnX, y: spawnY };
}

// Extracted to handle doors and props
function handleStaticZoneInteraction(
  staticZone: ZoneConfig,
  props: UseInteractionProps,
) {
  // 1. Door Transistions
  if (staticZone.isDoor) {
    const { x, y } = getDoorSpawnPosition(staticZone.isDoor, props.currentRoom);

    props.setCurrentRoom(staticZone.isDoor);
    props.setPos({ x, y });
    props.setFeedbackMsg({
      text: `Entering ${formatRoomName(staticZone.isDoor)}...`,
      isError: false,
    });

    setTimeout(() => props.setFeedbackMsg(null), 1500);
    return;
  }

  // 2. Stage Objectives
  if (
    props.activeZone === props.targetZoneId &&
    props.currentRoom === "stage"
  ) {
    // Objective: Strike Skip Interceptor
    if (props.targetZoneId === "wings" && Math.random() > 0.5) {
      props.setActiveQuestDialogue({
        speaker: "Senior Technician",
        text: "Hey, take a breather. The locals have the strike handled tonight. Head straight to the SM desk and sign off.",
        choices: [
          {
            id: "skip_strike_accept",
            text: '"Copy that. Thanks for the help!"',
          },
        ],
      });
      return;
    }

    props.onComplete();
    return;
  }

  // 3. Incorrect Location Penalties
  const isWrongLightBooth =
    props.activeZone === "lightBooth" && props.targetZoneId !== "lightBooth";
  const isWrongSoundBooth =
    props.activeZone === "soundBooth" && props.targetZoneId !== "soundBooth";

  if (isWrongLightBooth || isWrongSoundBooth) {
    props.setFeedbackMsg({
      text: `Not here! Head to the ${props.targetLabel}!`,
      isError: true,
    });
    setTimeout(() => props.setFeedbackMsg(null), 2500);
    return;
  }

  // 4. Zone Multi-Dialogue (Randomizer)
  if (staticZone.dialogues && staticZone.dialogues.length > 0) {
    const randomIdx = Math.floor(Math.random() * staticZone.dialogues.length);
    props.setActiveQuestDialogue(
      staticZone.dialogues[randomIdx] as unknown as DialogueState,
    );
    return;
  }

  // 5. Zone Single Dialogue
  if (staticZone.dialogue) {
    props.setActiveQuestDialogue(
      staticZone.dialogue as unknown as DialogueState,
    );
    return;
  }

  // 6. Generic Prop Inspection fallback
  const zoneName =
    staticZone.label || formatRoomName(props.activeZone || "area");
  props.setFeedbackMsg({
    text: `You inspected the ${zoneName}. Looks fine.`,
    isError: false,
  });
  setTimeout(() => props.setFeedbackMsg(null), 1500);
}

export function useInteraction(props: UseInteractionProps) {
  return useCallback(() => {
    if (!props.activeZone) return; // We still need an active zone
    props.setTargetPos(null);

    // If an interaction is already open, clear it to allow the override!
    if (props.activeNpcId || props.activeQuestDialogue) {
      props.setActiveNpcId(null);
      props.setActiveQuestDialogue(null);
    }

    const staticZone = props.currentZones[props.activeZone];
    const activeNpc = props.npcs.find((n) => n.id === props.activeZone);

    // Check for quest intercept before anything else
    const questDialogue = props.checkQuestIntercept(
      props.activeZone,
      activeNpc,
    );
    if (questDialogue) {
      props.setActiveQuestDialogue(questDialogue);
      return;
    }

    // 1. Zone Interaction (Doors, Objectives, Props)
    if (staticZone) {
      handleStaticZoneInteraction(staticZone, props);
      return;
    }

    // 2. NPC Interaction Trigger
    if (activeNpc) {
      // If the NPC is a major character (e.g., char_ben), open their full Dialogue Tree
      if (activeNpc.id.startsWith("char_")) {
        props.setActiveNpcId(activeNpc.id);
      } else {
        // Otherwise, they are generic crew. Feed them random idle chatter!
        const currentStage =
          props.state.session?.stages[props.state.session.currentStageIndex] ||
          "wrapup";

        const idleQuotes = [
          ...NARRATIVE.overworld.npcChatter,
          ...(NARRATIVE.overworld.chatterByStage[
            currentStage as keyof typeof NARRATIVE.overworld.chatterByStage
          ] || []),
        ];

        const randomQuote =
          idleQuotes[Math.floor(Math.random() * idleQuotes.length)];

        props.setActiveQuestDialogue({
          speaker: activeNpc.name,
          icon: activeNpc.icon,
          text: `"${randomQuote}"`,
          choices: [{ id: "ok", text: "Leave them to it." }],
        });
      }
    }
  }, [props]);
}
