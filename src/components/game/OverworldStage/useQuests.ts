import { useState } from "react";
import { useGame } from "../../../context/GameContext";
import { DialogueState } from "./types";

export function useQuests() {
  const { dispatch } = useGame();
  const [inventory, setInventory] = useState<string[]>([]);
  const [completedQuests, setCompletedQuests] = useState<string[]>([]);
  const [questFeedback, setQuestFeedback] = useState<{
    text: string;
    isError: boolean;
  } | null>(null);

  const checkQuestIntercept = (
    activeZone: string,
    activeNpc?: any,
  ): DialogueState | null => {
    // QUEST 1: The Parched Actor
    if (
      activeZone === "snackTable" &&
      !inventory.includes("Water Bottle") &&
      !completedQuests.includes("actor_water")
    ) {
      return {
        speaker: "Craft Services",
        icon: "🍩",
        text: "Just stale bagels left... but there is one fresh Water Bottle.",
        choices: [{ id: "take_water", text: "Take Water Bottle" }],
      };
    }

    if (activeNpc?.id === "actor_lead") {
      if (completedQuests.includes("actor_water")) return null; // Fallback to normal chat if already done
      if (inventory.includes("Water Bottle")) {
        return {
          speaker: activeNpc.name,
          icon: activeNpc.icon,
          text: "Oh my gosh, water! My throat was so dry, I thought I'd die out there. Thank you so much!",
          choices: [{ id: "give_water", text: "Give Water Bottle (+20 pts)" }],
        };
      } else {
        return {
          speaker: activeNpc.name,
          icon: activeNpc.icon,
          text: "I can't go on stage like this... my throat is so dry. I need water...",
          choices: [{ id: "ok", text: "I'll see if Craft Services has any." }],
        };
      }
    }

    // QUEST 2: The Missing Tape
    if (
      activeZone === "propsTable" &&
      !inventory.includes("Gaff Tape") &&
      !completedQuests.includes("lx_tape")
    ) {
      return {
        speaker: "Props Master",
        icon: "🛠️",
        text: "Oh, you're heading to the booth? Can you bring this Gaff Tape to the Lighting Designer?",
        choices: [{ id: "take_tape", text: "Take Gaff Tape" }],
      };
    }

    if (activeZone === "lightBooth" && inventory.includes("Gaff Tape")) {
      return {
        speaker: "LX Operator",
        icon: "💡",
        text: "Yes! Gaff tape! You just saved the show. Lock in, we're starting soon.",
        choices: [{ id: "give_tape", text: "Give Gaff Tape (+20 pts)" }],
      };
    }

    return null; // No quest active here, proceed with normal dialogue
  };

  const handleQuestChoice = (choiceId: string, clearDialogue: () => void) => {
    if (choiceId === "take_tape") {
      setInventory((prev) => [...prev, "Gaff Tape"]);
      setQuestFeedback({ text: "Acquired: Gaff Tape!", isError: false });
    } else if (choiceId === "take_water") {
      setInventory((prev) => [...prev, "Water Bottle"]);
      setQuestFeedback({ text: "Acquired: Water Bottle!", isError: false });
    } else if (choiceId === "give_water") {
      setInventory((prev) => prev.filter((i) => i !== "Water Bottle"));
      setCompletedQuests((prev) => [...prev, "actor_water"]);
      dispatch({ type: "ADD_SCORE", delta: 20 });
      setQuestFeedback({ text: "Quest Complete! +20 Pts", isError: false });
    } else if (choiceId === "give_tape") {
      setInventory((prev) => prev.filter((i) => i !== "Gaff Tape"));
      setCompletedQuests((prev) => [...prev, "lx_tape"]);
      dispatch({ type: "ADD_SCORE", delta: 20 });
      setQuestFeedback({ text: "Quest Complete! +20 Pts", isError: false });
    } else {
      return false; // Not a quest choice
    }

    clearDialogue();
    setTimeout(() => setQuestFeedback(null), 2500);
    return true; // Was a quest choice
  };

  return { inventory, checkQuestIntercept, handleQuestChoice, questFeedback };
}
