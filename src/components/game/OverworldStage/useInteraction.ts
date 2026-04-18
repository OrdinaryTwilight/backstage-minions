// src/components/game/OverworldStage/useInteraction.ts
import { useCallback } from "react";
import { ZoneConfig } from "../../../data/types";
import { GameState } from "../../../types/game";
import { GAME_HEIGHT, GAME_WIDTH } from "./constants";
import { FeedbackMessage, NPC } from "./types"; // Note: Removed DialogueState

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
  // CHANGED: Setter for the NPC ID
  setActiveNpcId: (id: string | null) => void;
  setFeedbackMsg: (msg: FeedbackMessage | null) => void;
  onComplete: () => void;
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

  // Objective validation
  if (
    props.activeZone === props.targetZoneId &&
    props.currentRoom === "stage"
  ) {
    props.onComplete();
    return;
  }

  // Wrong booth validation
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

  // Fallback for generic static zones that shouldn't open a dialogue tree
  props.setFeedbackMsg({
    text: `You inspected the ${props.activeZone}. Looks fine.`,
    isError: false,
  });
  setTimeout(() => props.setFeedbackMsg(null), 1500);
}

export function useInteraction(props: UseInteractionProps) {
  return useCallback(() => {
    // Don't trigger if nothing is nearby or a conversation is already happening
    if (!props.activeZone || props.activeNpcId) return;
    props.setTargetPos(null);

    const staticZone = props.currentZones[props.activeZone];
    const activeNpc = props.npcs.find((n) => n.id === props.activeZone);

    // 1. Zone Interaction (Doors, Objectives, Props)
    if (staticZone) {
      handleStaticZoneInteraction(staticZone, props);
      return;
    }

    // 2. NPC Interaction Trigger
    // CHANGED: We no longer generate dialogue here. We just trigger the manager.
    if (activeNpc) {
      props.setActiveNpcId(activeNpc.id);
    }
  }, [props]);
}
