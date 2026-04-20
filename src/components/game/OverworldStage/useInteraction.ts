import { useCallback } from "react";
import { NARRATIVE } from "../../../data/narrative";
import { ZoneConfig } from "../../../data/types";
import { OVERWORLD_MAPS } from "../../../data/zones";
import { GameSession, GameState } from "../../../types/game";
import { GAME_HEIGHT, GAME_WIDTH, PLAYER_SIZE } from "./constants";
import { DialogueState, FeedbackMessage, NPC } from "./types";

interface UseInteractionProps {
  activeZone: string | null;
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

function getDoorSpawnPosition(targetRoomId: string, currentRoomId: string) {
  let spawnX = GAME_WIDTH / 2;
  let spawnY = GAME_HEIGHT / 2;

  const targetRoomConfig = OVERWORLD_MAPS[targetRoomId];
  if (!targetRoomConfig) return { x: spawnX, y: spawnY };

  const entryDoorKey = Object.keys(targetRoomConfig).find(
    (k) => targetRoomConfig[k].isDoor === currentRoomId,
  );

  if (entryDoorKey) {
    const door = targetRoomConfig[entryDoorKey];
    spawnX = door.x + door.w / 2 - PLAYER_SIZE / 2;
    spawnY =
      door.y < GAME_HEIGHT / 2
        ? door.y + door.h + 10
        : door.y - PLAYER_SIZE - 10;
  }

  return { x: spawnX, y: spawnY };
}

export function getShowPhase(
  session: GameSession | null,
): "preShow" | "duringShow" | "postShow" {
  if (!session) return "preShow";
  const { stages, currentStageIndex } = session;
  const currentStage = stages[currentStageIndex];

  if (currentStage === "wrapup" || currentStage === "cable_coiling")
    return "postShow";
  if (currentStage === "cue_execution") return "duringShow";

  const execIndex = stages.indexOf("cue_execution");
  if (execIndex > -1 && currentStageIndex > execIndex) return "postShow";
  if (execIndex > -1 && currentStageIndex === execIndex - 1)
    return "duringShow";

  return "preShow";
}

function handleStaticZoneInteraction(
  staticZone: ZoneConfig,
  props: UseInteractionProps,
) {
  if (staticZone.isDoor) {
    const { x, y } = getDoorSpawnPosition(staticZone.isDoor, props.currentRoom);

    // Trigger the room transition wrapper
    props.setCurrentRoom(staticZone.isDoor);

    // Wait for the fade out to complete before moving the player,
    // so the teleport happens while the screen is black
    setTimeout(() => {
      props.setPos({ x, y });
    }, 200);

    props.setFeedbackMsg({
      text: `Entering ${formatRoomName(staticZone.isDoor)}...`,
      isError: false,
    });
    setTimeout(() => props.setFeedbackMsg(null), 1500);
    return;
  }

  if (
    props.activeZone === props.targetZoneId &&
    props.currentRoom === "backstage"
  ) {
    props.onComplete();
    return;
  }

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

  if (staticZone.dialogues && staticZone.dialogues.length > 0) {
    const randomIdx = Math.floor(Math.random() * staticZone.dialogues.length);
    props.setActiveQuestDialogue(
      staticZone.dialogues[randomIdx] as unknown as DialogueState,
    );
    return;
  }

  if (staticZone.dialogue) {
    props.setActiveQuestDialogue(
      staticZone.dialogue as unknown as DialogueState,
    );
    return;
  }

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
    if (!props.activeZone) return;
    props.setTargetPos(null);

    if (props.activeNpcId || props.activeQuestDialogue) {
      props.setActiveNpcId(null);
      props.setActiveQuestDialogue(null);
    }

    const staticZone = props.currentZones[props.activeZone];
    const activeNpc = props.npcs.find((n) => n.id === props.activeZone);

    const questDialogue = props.checkQuestIntercept(
      props.activeZone,
      activeNpc,
    );
    if (questDialogue) {
      props.setActiveQuestDialogue(questDialogue);
      return;
    }

    if (staticZone) {
      handleStaticZoneInteraction(staticZone, props);
      return;
    }

    if (activeNpc) {
      if (activeNpc.id.startsWith("char_")) {
        props.setActiveNpcId(activeNpc.id);
      } else {
        const phase = getShowPhase(props.state.session);
        const idleQuotes = NARRATIVE.overworld.npcChatter[phase];

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
