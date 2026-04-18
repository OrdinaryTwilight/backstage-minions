// src/components/game/DialogueManager.tsx
import { useState } from "react";
import { useGame } from "../../context/GameContext";
import {
  DIALOGUE_REGISTRY,
  GENERIC_DEPARTMENT_TREE,
} from "../../data/dialogues";
import { DialogueChoice, DialogueTree } from "../../types/dialogue";
import { Character } from "../../types/game";
import DialogueBox from "./DialogueBox";

interface DialogueManagerProps {
  targetNpc: Character;
  onClose: () => void;
}

export default function DialogueManager({
  targetNpc,
  onClose,
}: Readonly<DialogueManagerProps>) {
  const { state, dispatch } = useGame();

  // 1. Resolve which tree to use (Specific vs Fallback)
  const tree: DialogueTree =
    DIALOGUE_REGISTRY[targetNpc.id] || GENERIC_DEPARTMENT_TREE;

  const [currentNodeId, setCurrentNodeId] = useState<string>("start");
  const currentNode = tree[currentNodeId];

  // 2. Dynamic Text Interpolation (Replaces {department} with "lighting", etc.)
  const parsedText = currentNode.text
    .replace("{department}", targetNpc.department || "the deck")
    .replace("{role}", targetNpc.role || "crew")
    .replace("{playerName}", "Tech"); // Replace with actual player name if you have one

  // 3. Filter choices based on player state (e.g., inventory checks)
  const availableChoices = currentNode.choices.filter((choice) => {
    if (choice.requiredItem && !state.inventory.includes(choice.requiredItem)) {
      return false; // Hide choice if they don't have the item
    }
    return true;
  });

  // 4. Handle choice execution
  const handleChoice = (choice: DialogueChoice) => {
    // Apply points
    if (choice.pointDelta) {
      dispatch({ type: "ADD_SCORE", delta: choice.pointDelta });
    }

    // Apply side effects
    if (choice.sideEffect === "ally_gained") {
      dispatch({ type: "ADD_CONTACT", contactId: targetNpc.id });
    } else if (choice.sideEffect === "start_gaff_quest") {
      dispatch({ type: "ADD_QUEST", questId: "find_gaff_tape" });
    }

    // Navigate to next node or close
    if (choice.nextNodeId === "end") {
      onClose();
    } else {
      setCurrentNodeId(choice.nextNodeId);
    }
  };

  if (!currentNode) return null;

  return (
    <DialogueBox<DialogueChoice>
      speaker={targetNpc.name}
      icon={targetNpc.icon}
      text={parsedText}
      choices={availableChoices}
      onChoice={handleChoice}
    />
  );
}
