/**
 * Dynamically generates the sequence of minigames/stages for a given session.
 */
export function generateStageSequence(
  department: string,
): string[] {
  // 1. Every session starts by picking equipment at the loading dock
  const sequence: string[] = ["equipment"];

  // 2. Department-specific Pre-Show prep
  if (department === "lighting") {
    sequence.push("planning");
  } else if (department === "sound") {
    sequence.push("sound_design");
  }

  // 3. The main event
  sequence.push("execution", "cable_coiling", "wrapup");

  return sequence;
}
