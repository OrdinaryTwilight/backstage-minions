/**
 * Dynamically generates the sequence of minigames/stages for a given session.
 */
export function generateStageSequence(department: string): string[] {
  // 1. Every session starts by picking equipment at the loading dock
  const sequence: string[] = ["equipment"];

  // 2. Department-specific Pre-Show prep and Main Event
  if (department === "lighting") {
    sequence.push("planning", "cue_execution");
  } else if (department === "sound") {
    sequence.push("sound_design", "cue_execution");
  } else if (department === "management") {
    sequence.push("stage_management", "cue_execution"); // Route to execution!
  } else if (department === "scenic") {
    sequence.push("scenic", "cue_execution"); // Route to execution!
  } else if (department === "wardrobe") {
    sequence.push("wardrobe"); // Wardrobe is packed with 2 stages already
  } else {
    sequence.push("cue_execution");
  }

  // 3. Post-show
  sequence.push("cable_coiling", "wrapup");

  return sequence;
}
