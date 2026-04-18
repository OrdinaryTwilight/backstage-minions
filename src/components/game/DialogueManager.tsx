import { useEffect, useState } from "react";
import { useGame } from "../../context/GameContext";
import {
  CHARACTERS,
  DIALOGUE_REGISTRY,
  GENERIC_DEPARTMENT_TREE,
} from "../../data/gameData";
import { DialogueChoice, DialogueTree } from "../../types/dialogue";
import DialogueBox from "./DialogueBox";

interface DialogueManagerProps {
  readonly npcId: string;
  readonly onClose: () => void;
}

export default function DialogueManager({
  npcId,
  onClose,
}: DialogueManagerProps) {
  const { state, dispatch } = useGame();
  const [currentNodeId, setCurrentNodeId] = useState<string>("start");

  const targetNpc = CHARACTERS.find((c) => c.id === npcId);
  const tree: DialogueTree =
    DIALOGUE_REGISTRY[npcId] || GENERIC_DEPARTMENT_TREE;
  const currentNode = tree[currentNodeId];

  if (!targetNpc || !currentNode) return null;

  // 1. RESOLVE VARIANTS BASED ON STATE
  const activeVariant =
    currentNode.variants.find((variant) => {
      if (!variant.condition) return true; // Default fallback

      const currentStress = state.session?.stress || 0;
      const currentAffinity = state.session?.affinities?.[npcId] || 0;

      if (variant.condition === "high_stress" && currentStress >= 75)
        return true;
      if (variant.condition === "low_affinity" && currentAffinity < 0)
        return true;
      if (variant.condition === "high_affinity" && currentAffinity >= 10)
        return true;

      return false;
    }) || currentNode.variants[0]; // Absolute fallback

  const parsedText = activeVariant.text
    .replace("{department}", targetNpc.department || "the deck")
    .replace("{role}", targetNpc.role || "crew");

  // 2. TIMED CHOICES
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (currentNode.timeLimitMs && currentNode.timeoutNodeId) {
      timer = setTimeout(() => {
        // Apply stress penalty for timing out
        dispatch({ type: "UPDATE_STRESS", delta: 10 });
        setCurrentNodeId(currentNode.timeoutNodeId!);
      }, currentNode.timeLimitMs);
    }
    return () => clearTimeout(timer);
  }, [currentNodeId, currentNode, dispatch]);

  const availableChoices = currentNode.choices.filter((choice) => {
    if (choice.requiredItem && !state.inventory.includes(choice.requiredItem))
      return false;
    return true;
  });

  const handleChoice = (choice: DialogueChoice) => {
    if (choice.pointDelta)
      dispatch({ type: "ADD_SCORE", delta: choice.pointDelta });
    if (choice.sideEffect === "ally_gained") {
      dispatch({ type: "ADD_CONTACT", contactId: targetNpc.id });
      dispatch({ type: "UPDATE_AFFINITY", npcId: targetNpc.id, delta: 5 }); // Gain affinity!
    }
    if (choice.sideEffect === "stress_relieved")
      dispatch({ type: "UPDATE_STRESS", delta: -15 });

    if (choice.nextNodeId === "end") {
      onClose();
    } else {
      setCurrentNodeId(choice.nextNodeId);
    }
  };

  return (
    <DialogueBox<DialogueChoice>
      speaker={targetNpc.name}
      icon={targetNpc.icon}
      text={parsedText}
      choices={availableChoices}
      onChoice={handleChoice}
      timeLimitMs={currentNode.timeLimitMs}
    />
  );
}
