/**
 * @file Dialogue Type Definitions
 * @description TypeScript interfaces for dialogue system types.
 * 
 * Dialogue System Architecture:
 * - **DialogueTree**: Map of node IDs to nodes (graph structure for branching conversations)
 * - **DialogueNode**: Single conversation moment with variants and player choices
 * - **DialogueChoice**: A response option leading to next node
 * - **DialogueNode.variants**: Multiple text versions based on game state (stress, affinity, stage, etc.)
 * - **Conditions**: "high_stress", "low_affinity", "high_affinity", "pre_show", "post_show"
 * 
 * @see DialogueManager.tsx for dialogue tree evaluation logic
 */

/**
 * A player dialogue choice/response option.
 * Can have preconditions (required inventory/quest) and side effects.
 */
export interface DialogueChoice {
  id: string;
  text: string;
  nextNodeId: string; // 'end' will close the dialogue
  requiredItem?: string; // Only show if player has this in inventory
  requiredQuest?: string; // Only show if quest is active
  sideEffect?: string; // Action to dispatch (e.g., "give_tape", "add_contact")
  pointDelta?: number;
}

/**
 * A single node in a dialogue tree (conversation moment).
 * Supports multiple variants that change based on game state (stress, affinity, stage).
 * Can have timed choices that auto-advance if player doesn't respond quickly.
 */
export interface DialogueNode {
  id: string;
  // An array of possible texts. The system evaluates the condition and picks the first valid one.
  variants: {
    condition?:
      | "high_stress"
      | "low_affinity"
      | "high_affinity"
      | "pre_show"
      | "post_show";
    text: string;
  }[];
  choices: DialogueChoice[];
  timeLimitMs?: number; // e.g., 5000 (5 seconds)
  timeoutNodeId?: string; // Where to jump if they fail to answer
}

/**
 * A complete dialogue conversation structure.
 * Map of node IDs to nodes, forming a branching dialogue tree.
 * Can have start → middle nodes → end, with branches based on player choices.
 */
export type DialogueTree = Record<string, DialogueNode>;
