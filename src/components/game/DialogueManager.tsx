// src/components/game/DialogueManager.tsx
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

  // Failsafe
  if (!targetNpc || !currentNode) return null;

  // --- 1. RESOLVE VARIANTS (Stress / Affinity Checks) ---
  const activeVariant =
    currentNode.variants.find((variant) => {
      if (!variant.condition) return true; // Default fallback

      // Example hookup for conditions (we will build this out next)
      if (
        variant.condition === "high_stress" &&
        state.session?.lives &&
        state.session.lives < 3
      ) {
        return true;
      }
      // Add affinity checks here later

      return false;
    }) || currentNode.variants[0]; // absolute fallback

  // --- 2. DYNAMIC TEXT INTERPOLATION ---
  const parsedText = activeVariant.text
    .replace("{department}", targetNpc.department || "the deck")
    .replace("{role}", targetNpc.role || "crew");

  // --- 3. TIMED CHOICES LOGIC ---
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    if (currentNode.timeLimitMs && currentNode.timeoutNodeId) {
      timer = setTimeout(() => {
        setCurrentNodeId(currentNode.timeoutNodeId!);
      }, currentNode.timeLimitMs);
    }
    return () => clearTimeout(timer); // Cleanup if they click a choice in time
  }, [currentNodeId, currentNode]);

  // --- 4. FILTER CHOICES & EXECUTE ---
  const availableChoices = currentNode.choices.filter((choice) => {
    if (choice.requiredItem && !state.inventory.includes(choice.requiredItem))
      return false;
    return true;
  });

  const handleChoice = (choice: DialogueChoice) => {
    if (choice.pointDelta)
      dispatch({ type: "ADD_SCORE", delta: choice.pointDelta });
    if (choice.sideEffect === "ally_gained")
      dispatch({ type: "ADD_CONTACT", contactId: targetNpc.id });
    if (choice.sideEffect === "start_gaff_quest")
      dispatch({ type: "ADD_QUEST", questId: "find_gaff_tape" });

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
      // Pass the timeLimit down so the UI can draw a shrinking progress bar!
      timeLimitMs={currentNode.timeLimitMs}
    />
  );
}
