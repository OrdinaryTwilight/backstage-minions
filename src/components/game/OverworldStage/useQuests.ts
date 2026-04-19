// src/components/game/OverworldStage/useQuests.ts
import { useEffect, useState } from "react";
import { useGame } from "../../../context/GameContext";
import { NARRATIVE } from "../../../data/narrative";
import { DialogueState, NPC } from "./types";

export function useQuests() {
  const { dispatch } = useGame();

  // Use Session Storage to persist quests and inventory through zone/stage changes
  const [inventory, setInventory] = useState<string[]>(() => {
    return JSON.parse(sessionStorage.getItem("minion_inventory") || "[]");
  });
  const [completedQuests, setCompletedQuests] = useState<string[]>(() => {
    return JSON.parse(
      sessionStorage.getItem("minion_completed_quests") || "[]",
    );
  });

  const [questFeedback, setQuestFeedback] = useState<{
    text: string;
    isError: boolean;
  } | null>(null);
  const q = NARRATIVE.quests;

  useEffect(() => {
    sessionStorage.setItem("minion_inventory", JSON.stringify(inventory));
    sessionStorage.setItem(
      "minion_completed_quests",
      JSON.stringify(completedQuests),
    );
  }, [inventory, completedQuests]);

  const checkQuestIntercept = (
    activeZone: string,
    activeNpc?: NPC,
  ): DialogueState | null => {
    return (
      handleActorQuest(activeZone, activeNpc) ||
      handleTapeQuest(activeZone) ||
      handleDirectorQuest(activeZone, activeNpc) ||
      handleBatteriesQuest(activeZone, activeNpc) ||
      handleSpikeQuest(activeZone) ||
      null
    );
  };

  function handleActorQuest(activeZone: string, activeNpc?: NPC) {
    if (
      activeZone === "snackTable" &&
      !inventory.includes("Water Bottle") &&
      !completedQuests.includes("actor_water")
    ) {
      return {
        speaker: "Craft Services",
        icon: "🍩",
        text: q.water.pickupText,
        choices: [{ id: "take_water", text: q.water.pickupAction }],
      };
    }
    if (
      activeNpc?.id === "npc_madeline" &&
      !completedQuests.includes("actor_water")
    ) {
      return inventory.includes("Water Bottle")
        ? {
            speaker: activeNpc.name,
            icon: activeNpc.icon,
            text: q.water.actorThanksText,
            choices: [{ id: "give_water", text: q.water.giveAction }],
          }
        : {
            speaker: activeNpc.name,
            icon: activeNpc.icon,
            text: q.water.actorNeedText,
            choices: [{ id: "ok", text: q.water.searchAction }],
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
        text: q.tape.pickupText,
        choices: [{ id: "take_tape", text: q.tape.pickupAction }],
      };
    }
    if (activeZone === "lightBooth" && inventory.includes("Gaff Tape")) {
      return {
        speaker: "LX Operator",
        icon: "💡",
        text: q.tape.lxThanksText,
        choices: [{ id: "give_tape", text: q.tape.giveAction }],
      };
    }
    return null;
  }

  function handleDirectorQuest(activeZone: string, activeNpc?: NPC) {
    if (
      activeZone === "stageManager" &&
      !inventory.includes("Director's Script") &&
      !completedQuests.includes("director_script")
    ) {
      return {
        speaker: "Stage Manager",
        icon: "📋",
        text: q.script.pickupText,
        choices: [
          { id: "take_script", text: q.script.pickupAction },
          { id: "ok", text: q.script.ignoreAction },
        ],
      };
    }
    if (
      activeNpc?.id === "npc_arthur" && // CHANGED from activeNpc?.dept === "Director"
      !completedQuests.includes("director_script")
    ) {
      return inventory.includes("Director's Script")
        ? {
            speaker: activeNpc.name,
            icon: activeNpc.icon,
            text: q.script.directorThanksText,
            choices: [{ id: "give_script", text: q.script.giveAction }],
          }
        : {
            speaker: activeNpc.name,
            icon: activeNpc.icon,
            text: q.script.directorNeedText,
            choices: [{ id: "ok", text: q.script.searchAction }],
          };
    }
    return null;
  }

  function handleBatteriesQuest(activeZone: string, activeNpc?: NPC) {
    if (
      activeZone === "storage" &&
      !inventory.includes("AA Batteries") &&
      !completedQuests.includes("audio_batteries")
    ) {
      return {
        speaker: "Storage Bin",
        icon: "🔋",
        text: q.batteries.pickupText,
        choices: [{ id: "take_batteries", text: q.batteries.pickupAction }],
      };
    }
    if (
      activeNpc?.id === "char_casey" && // CHANGED from "npc_casey" to match char array
      !completedQuests.includes("audio_batteries")
    ) {
      return inventory.includes("AA Batteries")
        ? {
            speaker: activeNpc.name,
            icon: activeNpc.icon,
            text: q.batteries.actorThanksText,
            choices: [{ id: "give_batteries", text: q.batteries.giveAction }],
          }
        : {
            speaker: activeNpc.name,
            icon: activeNpc.icon,
            text: q.batteries.actorNeedText,
            choices: [{ id: "ok", text: q.batteries.searchAction }],
          };
    }
    return null;
  }

  function handleSpikeQuest(activeZone: string) {
    if (
      activeZone === "propsTable" &&
      !inventory.includes("Glow Tape") &&
      !completedQuests.includes("spike_stairs")
    ) {
      return {
        speaker: "Props Master",
        icon: "🛠️",
        text: q.spikeTape.pickupText,
        choices: [{ id: "take_glow_tape", text: q.spikeTape.pickupAction }],
      };
    }
    // We bind the turn-in to either a generic stage location or explicitly the stairs if they exist on the map
    if (
      (activeZone === "stage" || activeZone === "stairs") &&
      inventory.includes("Glow Tape") &&
      !completedQuests.includes("spike_stairs")
    ) {
      return {
        speaker: "Dark Stair Unit",
        icon: "⚠️",
        text: "The stair edge is barely visible. Someone is definitely going to trip here.",
        choices: [{ id: "give_glow_tape", text: q.spikeTape.giveAction }],
      };
    }
    return null;
  }

  const handleQuestChoice = (choiceId: string, clearDialogue: () => void) => {
    let wasQuest = true;

    if (choiceId === "take_tape") {
      setInventory((prev) => [...prev, "Gaff Tape"]);
      setQuestFeedback({ text: q.tape.feedbackAcquired, isError: false });
    } else if (choiceId === "take_water") {
      setInventory((prev) => [...prev, "Water Bottle"]);
      setQuestFeedback({ text: q.water.feedbackAcquired, isError: false });
    } else if (choiceId === "take_script") {
      setInventory((prev) => [...prev, "Director's Script"]);
      setQuestFeedback({ text: q.script.feedbackAcquired, isError: false });
    } else if (choiceId === "take_batteries") {
      setInventory((prev) => [...prev, "AA Batteries"]);
      setQuestFeedback({ text: q.batteries.feedbackAcquired, isError: false });
    } else if (choiceId === "take_glow_tape") {
      setInventory((prev) => [...prev, "Glow Tape"]);
      setQuestFeedback({ text: q.spikeTape.feedbackAcquired, isError: false });
    } else if (choiceId === "give_water") {
      setInventory((prev) => prev.filter((i) => i !== "Water Bottle"));
      setCompletedQuests((prev) => [...prev, "actor_water"]);
      dispatch({ type: "ADD_SCORE", delta: 20 });
      setQuestFeedback({ text: q.water.feedbackComplete, isError: false });
    } else if (choiceId === "give_tape") {
      setInventory((prev) => prev.filter((i) => i !== "Gaff Tape"));
      setCompletedQuests((prev) => [...prev, "lx_tape"]);
      dispatch({ type: "ADD_SCORE", delta: 20 });
      setQuestFeedback({ text: q.tape.feedbackComplete, isError: false });
    } else if (choiceId === "give_script") {
      setInventory((prev) => prev.filter((i) => i !== "Director's Script"));
      setCompletedQuests((prev) => [...prev, "director_script"]);
      dispatch({ type: "ADD_SCORE", delta: 20 });
      setQuestFeedback({ text: q.script.feedbackComplete, isError: false });
    } else if (choiceId === "give_batteries") {
      setInventory((prev) => prev.filter((i) => i !== "AA Batteries"));
      setCompletedQuests((prev) => [...prev, "audio_batteries"]);
      dispatch({ type: "ADD_SCORE", delta: 20 });
      setQuestFeedback({ text: q.batteries.feedbackComplete, isError: false });
    } else if (choiceId === "give_glow_tape") {
      setInventory((prev) => prev.filter((i) => i !== "Glow Tape"));
      setCompletedQuests((prev) => [...prev, "spike_stairs"]);
      dispatch({ type: "ADD_SCORE", delta: 20 });
      setQuestFeedback({ text: q.spikeTape.feedbackComplete, isError: false });
    } else if (choiceId === "skip_strike_accept") {
      // Dispatches NEXT_STAGE to skip cable coiling and move the internal tracker to wrapup
      dispatch({ type: "NEXT_STAGE" });
      setQuestFeedback({
        text: "Strike skipped. Time to head home.",
        isError: false,
      });
    } else {
      wasQuest = false;
    }

    if (wasQuest) {
      clearDialogue();
      setTimeout(() => setQuestFeedback(null), 2500);
    }
    return wasQuest;
  };

  return { inventory, checkQuestIntercept, handleQuestChoice, questFeedback };
}
