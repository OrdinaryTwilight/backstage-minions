/**
 * Dynamically generates the sequence of minigames/stages for a given session.
 */
export function generateStageSequence(department: string): string[] {
  // 1. Every session starts by picking equipment at the loading dock
  const sequence: string[] = ["equipment"];

  // 2. Department-specific Pre-Show prep
  if (department === "lighting") {
    sequence.push("planning");
  } else if (department === "sound") {
    sequence.push("sound_design");
  } else {
    // TODO: Add specific prep stages for remaining departments
    // e.g., if (department === "video") sequence.push("projection_mapping");
    // e.g., if (department === "wardrobe") sequence.push("quick_change_prep");
  }

  // 3. The main event
  // TODO: "cue_execution" is currently pushed globally for all departments.
  // Non-console departments (Props, Wardrobe) may need a completely different
  // main stage key like "track_execution" or "backstage_management" in the future.
  sequence.push("cue_execution", "cable_coiling", "wrapup");

  return sequence;
}
