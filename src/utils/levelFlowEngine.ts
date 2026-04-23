/**
 * @file Level Flow Engine
 * @description Generates the sequence of game stages/minigames for each production level.
 * 
 * Stage Flow Architecture:
 * 1. **Equipment** (loading dock) - always first, player selects gear
 * 2. **Department-specific prep** - varies by character's department:
 *    - Lighting → Planning (position lights)
 *    - Sound → Sound Design (craft audio)
 *    - Management → Stage Management (assign dressing rooms)
 *    - Scenic → Scenic (operate rigging)
 *    - Wardrobe → Wardrobe pre-show (quick costume changes)
 * 3. **Cue Execution** (main event) - timing-based minigame for most departments
 * 4. **Post-show** - Cable Coiling (strike/cleanup) and Wrap-up (sign out)
 * 
 * Each stage represents a different theater department responsibility and contains
 * its own minigame mechanics and scoring rules.
 */

/**
 * Dynamically generates the sequence of minigames/stages for a given session.
 * 
 * The sequence is deterministic based on the selected department - same character
 * always plays the same stage sequence, but conflicts and objectives are randomized.
 * 
 * @param department - Department of the selected character (affects which stages appear)
 * @returns Array of stage keys in order they will be played
 * @example
 * const stages = generateStageSequence('lighting');
 * // ['equipment', 'planning', 'cue_execution', 'cable_coiling', 'wrapup']
 */
export function generateStageSequence(department: string): string[] {
  // 1. Equipment selection - universal stage, always first
  const sequence: string[] = ["equipment"];

  // 2. Department-specific pre-show prep and main event
  // Each department has unique gameplay mechanics during preparation
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

  // 3. Post-show cleanup and exit
  // All departments end with strike (cleanup) and wrap-up (sign out)
  sequence.push("cable_coiling", "wrapup");

  return sequence;
}
