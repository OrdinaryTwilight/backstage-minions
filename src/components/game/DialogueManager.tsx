/**
 * @file Dialogue Manager Component
 * @description Manages branching dialogue trees with NPCs, including state-based responses and side effects.
 *
 * Dialogue System Overview:
 * - Branching dialogue with multiple conversation threads (dialogue trees)
 * - State-aware responses: different dialogue based on stress level, affinity, stage, inventory
 * - Timed choices: some dialogue options have time limits that trigger auto-responses
 * - Side effects: dialogue choices can trigger quests, unlock contacts, modify affinity, add inventory
 * - Dynamic fallbacks: if NPC lacks specific variant (e.g., high-stress response), system generates one
 *
 * Node Structure:
 * - Each dialogue tree has nodes (start, middle, end)
 * - Each node has variants (dialogue text for different states)
 * - Each variant has choices (player responses leading to next nodes)
 * - Choices can have conditions: required inventory, point changes, side effects
 *
 * @component
 */

import { useEffect, useRef, useState } from "react";
import { useGame } from "../../context/GameContext";
import {
  CHARACTERS,
  DIALOGUE_REGISTRY,
  GENERIC_DEPARTMENT_TREE,
} from "../../data/gameData";
import { DialogueChoice, DialogueTree } from "../../types/dialogue";
import DialogueBox from "./DialogueBox";

interface DialogueManagerProps {
  /** ID of the NPC to have dialogue with */
  readonly npcId: string;
  /** Callback when dialogue ends (player exits conversation) */
  readonly onClose: () => void;
}

/**
 * DialogueManager Component
 * Manages dialogue state and renders appropriate dialogue nodes and player choices.
 * Handles variant selection based on game state (stress, affinity, stage, inventory).
 */

export default function DialogueManager({
  npcId,
  onClose,
}: DialogueManagerProps) {
  const { state, dispatch } = useGame();
  const [currentNodeId, setCurrentNodeId] = useState<string>("start");

  const isTransitioningRef = useRef(false);

  const targetNpc = CHARACTERS.find((c) => c.id === npcId);
  const tree: DialogueTree =
    DIALOGUE_REGISTRY[npcId] || GENERIC_DEPARTMENT_TREE;
  const currentNode = tree[currentNodeId];

  // Reset the interaction lock whenever the node successfully updates
  useEffect(() => {
    isTransitioningRef.current = false;
  }, [currentNodeId]);

  // 2. TIMED CHOICES
  // Some dialogue nodes have time limits - if player doesn't choose quickly,
  // stress increases and auto-transition to timeout node (simulates NPC frustration)
  useEffect(() => {
    if (!currentNode?.timeLimitMs || !currentNode?.timeoutNodeId) {
      return;
    }

    const timer = setTimeout(() => {
      dispatch({ type: "UPDATE_STRESS", delta: 10 });
      if (currentNode.timeoutNodeId) {
        setCurrentNodeId(currentNode.timeoutNodeId);
      }
    }, currentNode.timeLimitMs);

    return () => clearTimeout(timer);
  }, [currentNodeId, currentNode, dispatch]);

  // Guard clause after hooks
  if (!targetNpc || !currentNode) return null;

  // 1. VARIANT RESOLUTION BASED ON STATE
  // Dialogue changes based on stress, affinity, and current stage.
  // Selects appropriate variant matching current conditions, falls back to default variant.
  const activeVariant =
    currentNode.variants.find((variant) => {
      if (!variant.condition) return true; // Default fallback

      const currentStress = state.session?.stress || 0;
      const currentAffinity = state.session?.affinities?.[npcId] || 0;
      const currentStage =
        state.session?.stages[state.session.currentStageIndex];

      if (variant.condition === "high_stress" && currentStress >= 75)
        return true;
      if (variant.condition === "low_affinity" && currentAffinity < 0)
        return true;
      if (variant.condition === "high_affinity" && currentAffinity >= 10)
        return true;
      if (
        variant.condition === "pre_show" &&
        (currentStage === "planning" || currentStage === "equipment")
      )
        return true;
      if (
        variant.condition === "post_show" &&
        (currentStage === "wrapup" || currentStage === "cable_coiling")
      )
        return true;

      return false;
    }) || currentNode.variants[0]; // Absolute fallback

  let baseText = activeVariant.text;

  // UX FIX: Dynamic Generic Fallback for High Stress. If the NPC doesn't have a unique stressful
  // response, they will dynamically react to the player's panic rather than looping their generic intro.
  const currentStress = state.session?.stress || 0;
  const hasHighStressVariant = currentNode.variants.some(
    (v) => v.condition === "high_stress",
  );
  if (
    currentStress >= 75 &&
    !hasHighStressVariant &&
    currentNodeId === "start"
  ) {
    baseText = `(They look incredibly stressed out, barely holding it together.)\n\n"${baseText}"\n\n"We need to move faster, everything is falling apart!"`;
  }

  const parsedText = baseText
    .replace("{department}", targetNpc.department || "the deck")
    .replace("{role}", targetNpc.role || "crew");

  /**
   * Filter available choices based on preconditions:
   * - Required inventory (player must have item to see choice)
   * - Quest state (prevent re-triggering completed quests or already-active quests)
   * - Contact state (prevent re-gaining same ally)
   * Provides automatic exit if no choices are available (failsafe).
   */
  const availableChoices = currentNode.choices.filter((choice) => {
    const currentInventory = state.session?.inventory || [];

    // Inventory check
    if (
      choice.requiredItem &&
      !currentInventory.includes(choice.requiredItem)
    ) {
      return false;
    }

    // MEMORY FIX: Prevent re-triggering quests you already have
    if (choice.sideEffect === "start_gaff_quest") {
      const hasQuest =
        state.session?.activeQuests?.includes("find_gaff_tape") ||
        state.session?.completedQuests?.includes("find_gaff_tape");
      if (hasQuest) return false;
    }

    // MEMORY FIX: Prevent re-gaining the same ally
    if (choice.sideEffect === "ally_gained") {
      if (state.contacts?.includes(targetNpc.id)) return false;
    }

    return true;
  });

  // Failsafe: If all choices were hidden, provide an exit!
  if (availableChoices.length === 0) {
    availableChoices.push({
      id: "auto_exit",
      text: "I should get back to work.",
      nextNodeId: "end",
    });
  }

  const handleChoice = (choice: DialogueChoice) => {
    if (isTransitioningRef.current) return;
    isTransitioningRef.current = true;

    if (choice.pointDelta)
      dispatch({ type: "ADD_SCORE", delta: choice.pointDelta });

    if (choice.sideEffect === "ally_gained") {
      dispatch({ type: "ADD_CONTACT", contactId: targetNpc.id });
      dispatch({ type: "UPDATE_AFFINITY", npcId: targetNpc.id, delta: 5 });
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
