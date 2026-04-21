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

  const inventory = state.session?.inventory || [];
  const completedQuests = state.session?.completedQuests || [];

  const processSingleQuest = (
    quest: QuestDefinition,
    activeZone: string,
    activeNpc?: NPC,
  ): DialogueState | null => {
    if (completedQuests.includes(quest.id)) return null;

    const qText = NARRATIVE.quests[quest.narrativeRef] as Record<
      string,
      string
    >;

    // 1. Check for Pickup (Static Zones)
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

    // 2. Check for Turn-in (Targeting NPC OR Zone)
    const isTargetingNpc = activeNpc?.id === quest.targetNpcId;
    const isTargetingZone = activeZone === quest.targetZoneId;

    if (isTargetingNpc || isTargetingZone) {
      const speakerName = activeNpc ? activeNpc.name : "System";
      const speakerIcon = activeNpc ? activeNpc.icon : "⚠️";

      if (inventory.includes(quest.requiredItem)) {
        return {
          speaker: speakerName,
          icon: speakerIcon,
          text: qText.targetThanksText || "Issue resolved.",
          choices: [
            { id: `give_${quest.id}`, text: qText.giveAction || "Complete" },
          ],
        };
      } else {
        // Player doesn't have the item, but interacted with the target.
        // Give them the option to back out or ignore the quest to continue main flow.
        return {
          speaker: speakerName,
          icon: speakerIcon,
          text: qText.targetNeedText || "Something is missing here.",
          choices: [
            { id: "ok", text: qText.searchAction || "I'll look around." },
            { id: "ignore", text: "I don't have time for this." }, // Added ignore option
          ],
        };
      }
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

  const handleQuestChoice = (
    choiceId: string,
    clearDialogue: () => void,
  ): "quest_handled" | "ignored" | "none" => {
    // Explicitly handle the new ignore action
    if (choiceId === "ignore") {
      clearDialogue();
      return "ignored";
    }

    if (choiceId === "skip_strike_accept") {
      dispatch({ type: "NEXT_STAGE" });
      setQuestFeedback({
        text: "Strike skipped. Time to head home.",
        isError: false,
      });
      clearDialogue();
      setTimeout(() => setQuestFeedback(null), 2500);
      return "quest_handled";
    }

    if (choiceId.startsWith("take_") || choiceId.startsWith("give_")) {
      const actionType = choiceId.split("_")[0];
      const targetQuestId = choiceId.replace(`${actionType}_`, "");
      const quest = QUEST_REGISTRY.find((q) => q.id === targetQuestId);

      if (quest) {
        const qText = NARRATIVE.quests[quest.narrativeRef] as Record<
          string,
          string
        >;

        if (actionType === "take") {
          dispatch({ type: "ADD_INVENTORY", item: quest.requiredItem });
          setQuestFeedback({ text: qText.feedbackAcquired, isError: false });
        } else if (actionType === "give") {
          dispatch({ type: "REMOVE_INVENTORY", item: quest.requiredItem });
          dispatch({
            type: "COMPLETE_QUEST",
            questId: quest.id,
            pointDelta: 50,
          });
          dispatch({ type: "ADD_SCORE", delta: quest.scoreReward });
          setQuestFeedback({ text: qText.feedbackComplete, isError: false });
        }
        clearDialogue();
        setTimeout(() => setQuestFeedback(null), 2500);
        return "quest_handled";
      }
    }

    if (choiceId === "ok") {
      clearDialogue();
      return "quest_handled";
    }

    return "none";
  };

  return { inventory, checkQuestIntercept, handleQuestChoice, questFeedback };
}
