// src/components/game/OverworldStage/useInteraction.ts
import { useCallback } from "react";
import { ZoneConfig } from "../../../data/types";
import { GameState } from "../../../types/game";
import { GAME_HEIGHT, GAME_WIDTH } from "./constants";
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

// Extracted to handle doors and props
function handleStaticZoneInteraction(
  staticZone: ZoneConfig,
  props: UseInteractionProps,
) {
  if (staticZone.isDoor) {
    props.setCurrentRoom(staticZone.isDoor);
    props.setPos({ x: GAME_WIDTH / 2, y: GAME_HEIGHT / 2 });
    props.setFeedbackMsg({
      text: `Entering ${formatRoomName(staticZone.isDoor)}...`,
      isError: false,
    });
    setTimeout(() => props.setFeedbackMsg(null), 1500);
    return;
  }

  if (
    props.activeZone === props.targetZoneId &&
    props.currentRoom === "stage"
  ) {
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

  if (
    (props.activeZone === "lightBooth" &&
      props.targetZoneId !== "lightBooth") ||
    (props.activeZone === "soundBooth" && props.targetZoneId !== "soundBooth")
  ) {
    props.setFeedbackMsg({
      text: `Not here! Head to the ${props.targetLabel}!`,
      isError: true,
    });
    setTimeout(() => props.setFeedbackMsg(null), 2500);
    return;
  }

  // FIX: If the zone has dialogue, trigger the quest dialogue box!
  if (staticZone.dialogues && staticZone.dialogues.length > 0) {
    props.setActiveQuestDialogue(
      staticZone.dialogues[
        Math.floor(Math.random() * staticZone.dialogues.length)
      ] as unknown as DialogueState,
    );
    return;
  }

  if (staticZone.dialogue) {
    props.setActiveQuestDialogue(
      staticZone.dialogue as unknown as DialogueState,
    );
    return;
  }

  // FIX: Format the zone name so it reads "Props Table" instead of "propTable"
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
      props.setActiveNpcId(activeNpc.id);
    }
  }, [props]);
}
