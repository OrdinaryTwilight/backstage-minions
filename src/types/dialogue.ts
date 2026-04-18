// src/types/dialogue.ts

export interface DialogueChoice {
  id: string;
  text: string;
  nextNodeId: string; // 'end' will close the dialogue
  requiredItem?: string; // Only show if player has this in inventory
  requiredQuest?: string; // Only show if quest is active
  sideEffect?: string; // Action to dispatch (e.g., "give_tape", "add_contact")
  pointDelta?: number;
}

export interface DialogueNode {
  id: string;
  // An array of possible texts. The system evaluates the condition and picks the first valid one.
  variants: {
    condition?: "high_stress" | "low_affinity" | "high_affinity";
    text: string;
  }[];
  choices: DialogueChoice[];
  timeLimitMs?: number; // e.g., 5000 (5 seconds)
  timeoutNodeId?: string; // Where to jump if they fail to answer
}

export type DialogueTree = Record<string, DialogueNode>;
