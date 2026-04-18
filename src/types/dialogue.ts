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
  text: string; // Can include placeholders like {playerName} or {department}
  choices: DialogueChoice[];
}

export type DialogueTree = Record<string, DialogueNode>;
