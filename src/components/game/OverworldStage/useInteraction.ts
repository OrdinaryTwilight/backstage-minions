// src/components/game/OverworldStage/useInteraction.ts
import { useCallback } from "react";
import { NARRATIVE } from "../../../data/narrative";
import { GAME_HEIGHT, GAME_WIDTH } from "./constants";
import { DialogueState, FeedbackMessage, NPC } from "./types";

interface UseInteractionProps {
  activeZone: string | null;
  activeDialogue: DialogueState | null;
  // Type currentZones flexibly to avoid missing 'Zone' exports
  currentZones: Record<string, any>;
  npcs: NPC[];
  currentRoom: string;
  targetZoneId: string | null;
  targetLabel: string;
  state: any;
  setCurrentRoom: (room: string) => void;
  setPos: (pos: { x: number; y: number }) => void;
  setTargetPos: (pos: null) => void;
  setActiveDialogue: (dialogue: DialogueState | null) => void;
  setFeedbackMsg: (msg: FeedbackMessage | null) => void;
  checkQuestIntercept: (zone: string, npc?: NPC) => DialogueState | null;
  onComplete: () => void;
}

const formatRoomName = (str: string) =>
  str.replace(/([A-Z])/g, " $1").replace(/^./, (s) => s.toUpperCase());

export function useInteraction(props: UseInteractionProps) {
  return useCallback(() => {
    if (!props.activeZone || props.activeDialogue) return;
    props.setTargetPos(null);

    const staticZone = props.currentZones[props.activeZone];
    const activeNpc = props.npcs.find((n) => n.id === props.activeZone);

    // 1. Quests Intercept
    const questDialogue = props.checkQuestIntercept(
      props.activeZone,
      activeNpc,
    );
    if (questDialogue) {
      props.setActiveDialogue(questDialogue);
      return;
    }

    // 2. Zone Interaction (Doors, Objectives, Static Props)
    if (staticZone) {
      if (staticZone.isDoor) {
        props.setCurrentRoom(staticZone.isDoor);
        props.setPos({ x: GAME_WIDTH / 2, y: GAME_HEIGHT / 2 });
        props.setFeedbackMsg({
          text: `Entering ${formatRoomName(staticZone.isDoor)}...`,
          isError: false,
        });
        setTimeout(() => props.setFeedbackMsg(null), 1500);
      } else if (
        props.activeZone === props.targetZoneId &&
        props.currentRoom === "stage"
      ) {
        props.onComplete();
      } else if (
        (props.activeZone === "lightBooth" &&
          props.targetZoneId !== "lightBooth") ||
        (props.activeZone === "soundBooth" &&
          props.targetZoneId !== "soundBooth")
      ) {
        props.setFeedbackMsg({
          text: `Not here! Head to the ${props.targetLabel}!`,
          isError: true,
        });
        setTimeout(() => props.setFeedbackMsg(null), 2500);
      } else if (staticZone.dialogues) {
        props.setActiveDialogue(
          staticZone.dialogues[
            Math.floor(Math.random() * staticZone.dialogues.length)
          ],
        );
      } else if (staticZone.dialogue) {
        props.setActiveDialogue(staticZone.dialogue);
      }
    }
    // 3. Contextual NPC Chatter
    else if (activeNpc) {
      // Safely cast the state value to match the narrative configuration keys
      const currentStageKey = props.state.session?.stages[
        props.state.session?.currentStageIndex
      ] as keyof typeof NARRATIVE.overworld.chatterByStage | undefined;

      const stageChatter =
        currentStageKey && NARRATIVE.overworld.chatterByStage[currentStageKey]
          ? NARRATIVE.overworld.chatterByStage[currentStageKey]
          : NARRATIVE.overworld.npcChatter;

      const randomLine =
        stageChatter[Math.floor(Math.random() * stageChatter.length)];

      props.setActiveDialogue({
        speaker: activeNpc.name,
        icon: activeNpc.icon,
        text: randomLine,
        choices: [{ id: "ok", text: "Got it." }],
      });
    }
  }, [props]);
}
