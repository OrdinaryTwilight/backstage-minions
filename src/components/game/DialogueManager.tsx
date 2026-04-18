import { useState } from "react";
import { useGame } from "../../context/GameContext";
import {
  CHARACTERS,
  DIALOGUE_REGISTRY,
  GENERIC_DEPARTMENT_TREE,
} from "../../data/gameData";
import { DialogueChoice, DialogueTree } from "../../types/dialogue"; // Import directly if not in gameData
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

  // 1. Find the target character data
  const targetNpc = CHARACTERS.find((c) => c.id === npcId);

  // 2. Fallback to generic tree if this NPC doesn't have a specific story
  const tree: DialogueTree =
    DIALOGUE_REGISTRY[npcId] || GENERIC_DEPARTMENT_TREE;

  const [currentNodeId, setCurrentNodeId] = useState<string>("start");
  const currentNode = tree[currentNodeId];

  // Failsafe
  if (!targetNpc || !currentNode) {
    return null;
  }

  // 3. Dynamic Text Interpolation
  const parsedText = currentNode.text
    .replace("{department}", targetNpc.department || "the deck")
    .replace("{role}", targetNpc.role || "crew");

  // 4. Filter choices (Inventory/Quest checks)
  const availableChoices = currentNode.choices.filter((choice) => {
    if (choice.requiredItem && !state.inventory.includes(choice.requiredItem)) {
      return false;
    }
    return true;
  });

  const handleChoice = (choice: DialogueChoice) => {
    // Process points and side effects
    if (choice.pointDelta)
      dispatch({ type: "ADD_SCORE", delta: choice.pointDelta });
    if (choice.sideEffect === "ally_gained")
      dispatch({ type: "ADD_CONTACT", contactId: targetNpc.id });
    if (choice.sideEffect === "start_gaff_quest")
      dispatch({ type: "ADD_QUEST", questId: "find_gaff_tape" });

    // Traverse the tree
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
    />
  );
}
