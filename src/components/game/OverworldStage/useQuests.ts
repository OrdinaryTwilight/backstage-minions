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
    return (
      handleActorQuest(activeZone, activeNpc) ||
      handleTapeQuest(activeZone) ||
      handleDirectorQuest(activeZone, activeNpc) ||
      null
    );
  };

  function handleActorQuest(activeZone: string, activeNpc?: any) {
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

    if (
      activeNpc?.id === "actor_lead" &&
      !completedQuests.includes("actor_water")
    ) {
      return inventory.includes("Water Bottle")
        ? {
            speaker: activeNpc.name,
            icon: activeNpc.icon,
            text: "Oh my gosh, water! My throat was so dry, I thought I'd die out there. Thank you so much!",
            choices: [
              { id: "give_water", text: "Give Water Bottle (+20 pts)" },
            ],
          }
        : {
            speaker: activeNpc.name,
            icon: activeNpc.icon,
            text: "I can't go on stage like this... my throat is so dry. I need water...",
            choices: [
              { id: "ok", text: "I'll see if Craft Services has any." },
            ],
          };
    }

    return null;
  }

  function handleTapeQuest(activeZone: string) {
    if (
      activeZone === "propsTable" &&
      !inventory.includes("Gaff Tape") &&
      !completedQuests.includes("lx_tape")
    ) {
      return {
        speaker: "Props Master",
        icon: "🛠️",
        text: "Hey, since you're walking around... Can you bring this Gaff Tape to the LX Booth?",
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

    return null;
  }

  function handleDirectorQuest(activeZone: string, activeNpc?: any) {
    if (
      activeZone === "stageManager" &&
      !inventory.includes("Director's Script") &&
      !completedQuests.includes("director_script")
    ) {
      return {
        speaker: "Stage Manager",
        icon: "📋",
        text: "The Director left their script on my desk again. Can you run this to the Green Room before house opens?",
        choices: [
          { id: "take_script", text: "Take Director's Script" },
          { id: "ok", text: "Maybe later." },
        ],
      };
    }

    if (
      activeNpc?.dept === "Director" &&
      !completedQuests.includes("director_script")
    ) {
      return inventory.includes("Director's Script")
        ? {
            speaker: activeNpc.name,
            icon: activeNpc.icon,
            text: "Ah, my script! The SM found it? Excellent work, let's get ready for places.",
            choices: [{ id: "give_script", text: "Give Script (+20 pts)" }],
          }
        : {
            speaker: activeNpc.name,
            icon: activeNpc.icon,
            text: "I've completely lost my blocking notes... Have you seen my script?",
            choices: [{ id: "ok", text: "I'll ask the SM." }],
          };
    }

    return null;
  }

  const handleQuestChoice = (choiceId: string, clearDialogue: () => void) => {
    // Pickups
    if (choiceId === "take_tape") {
      setInventory((prev) => [...prev, "Gaff Tape"]);
      setQuestFeedback({ text: "Acquired: Gaff Tape!", isError: false });
    } else if (choiceId === "take_water") {
      setInventory((prev) => [...prev, "Water Bottle"]);
      setQuestFeedback({ text: "Acquired: Water Bottle!", isError: false });
    } else if (choiceId === "take_script") {
      setInventory((prev) => [...prev, "Director's Script"]);
      setQuestFeedback({
        text: "Acquired: Director's Script!",
        isError: false,
      });
    }

    // Dropoffs
    else if (choiceId === "give_water") {
      setInventory((prev) => prev.filter((i) => i !== "Water Bottle"));
      setCompletedQuests((prev) => [...prev, "actor_water"]);
      dispatch({ type: "ADD_SCORE", delta: 20 });
      setQuestFeedback({ text: "Quest Complete! +20 Pts", isError: false });
    } else if (choiceId === "give_tape") {
      setInventory((prev) => prev.filter((i) => i !== "Gaff Tape"));
      setCompletedQuests((prev) => [...prev, "lx_tape"]);
      dispatch({ type: "ADD_SCORE", delta: 20 });
      setQuestFeedback({ text: "Quest Complete! +20 Pts", isError: false });
    } else if (choiceId === "give_script") {
      setInventory((prev) => prev.filter((i) => i !== "Director's Script"));
      setCompletedQuests((prev) => [...prev, "director_script"]);
      dispatch({ type: "ADD_SCORE", delta: 20 });
      setQuestFeedback({ text: "Quest Complete! +20 Pts", isError: false });
    } else {
      return false; // Not a quest choice
    }

    clearDialogue();
    setTimeout(() => setQuestFeedback(null), 2500);
    return true;
  };

  return { inventory, checkQuestIntercept, handleQuestChoice, questFeedback };
}
