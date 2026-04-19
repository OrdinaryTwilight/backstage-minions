// src/components/game/OverworldStage/useQuests.ts
import { useState } from "react";
import { useGame } from "../../../context/GameContext";
import { NARRATIVE } from "../../../data/narrative";
import { QUEST_REGISTRY, QuestDefinition } from "../../../data/quests";
import { DialogueState, NPC } from "./types";

export function useQuests() {
  const { state, dispatch } = useGame();
  const [questFeedback, setQuestFeedback] = useState<{
    text: string;
    isError: boolean;
  } | null>(null);

  // Derive state directly from the global GameSession, defaulting to empty arrays
  const inventory = state.session?.inventory || [];
  const completedQuests = state.session?.completedQuests || [];

  // Helper function to drastically reduce cognitive complexity
  const processSingleQuest = (
    quest: QuestDefinition,
    activeZone: string,
    activeNpc?: NPC,
  ): DialogueState | null => {
    if (completedQuests.includes(quest.id)) return null;

    // Use a unified type assertion since we standardized narrative.ts
    const qText = NARRATIVE.quests[quest.narrativeRef] as any;

    // 1. Check for Pickup
    if (
      activeZone === quest.pickupZone &&
      !inventory.includes(quest.requiredItem)
    ) {
      return {
        speaker: quest.pickupNpcName,
        icon: quest.pickupIcon,
        text: qText.pickupText,
        choices: [{ id: `take_${quest.id}`, text: qText.pickupAction }],
      };
    }

    // 2. Check for Turn-in (Targeting either an NPC or a Zone)
    const isTargetingNpc =
      activeNpc !== undefined && activeNpc.id === quest.targetNpcId;
    const isTargetingZone = activeZone === quest.targetZoneId;

    if (isTargetingNpc || isTargetingZone) {
      const speakerName = activeNpc ? activeNpc.name : "System";
      const speakerIcon = activeNpc ? activeNpc.icon : "⚠️";

      return inventory.includes(quest.requiredItem)
        ? {
            speaker: speakerName,
            icon: speakerIcon,
            text: qText.targetThanksText || "Issue resolved.",
            choices: [
              { id: `give_${quest.id}`, text: qText.giveAction || "Complete" },
            ],
          }
        : {
            speaker: speakerName,
            icon: speakerIcon,
            text: qText.targetNeedText || "Something is missing here.",
            choices: [
              { id: "ok", text: qText.searchAction || "I'll look around." },
            ],
          };
    }

    return null;
  };

  const checkQuestIntercept = (
    activeZone: string,
    activeNpc?: NPC,
  ): DialogueState | null => {
    for (const quest of QUEST_REGISTRY) {
      const dialog = processSingleQuest(quest, activeZone, activeNpc);
      if (dialog) return dialog;
    }
    return null;
  };

  const handleQuestChoice = (choiceId: string, clearDialogue: () => void) => {
    let wasQuest = false;

    if (choiceId === "skip_strike_accept") {
      dispatch({ type: "NEXT_STAGE" });
      setQuestFeedback({
        text: "Strike skipped. Time to head home.",
        isError: false,
      });
      wasQuest = true;
    }

    if (choiceId.startsWith("take_") || choiceId.startsWith("give_")) {
      const actionType = choiceId.split("_")[0];
      const targetQuestId = choiceId.replace(`${actionType}_`, "");
      const quest = QUEST_REGISTRY.find((q) => q.id === targetQuestId);

      if (quest) {
        const qText = NARRATIVE.quests[quest.narrativeRef] as any;

        if (actionType === "take") {
          dispatch({ type: "ADD_INVENTORY", item: quest.requiredItem });
          setQuestFeedback({ text: qText.feedbackAcquired, isError: false });
        } else if (actionType === "give") {
          dispatch({ type: "REMOVE_INVENTORY", item: quest.requiredItem });
          dispatch({ type: "COMPLETE_QUEST", questId: quest.id });
          dispatch({ type: "ADD_SCORE", delta: quest.scoreReward });
          setQuestFeedback({ text: qText.feedbackComplete, isError: false });
        }
        wasQuest = true;
      }
    }

    if (wasQuest) {
      clearDialogue();
      setTimeout(() => setQuestFeedback(null), 2500);
    }
    return wasQuest;
  };

  return { inventory, checkQuestIntercept, handleQuestChoice, questFeedback };
}
