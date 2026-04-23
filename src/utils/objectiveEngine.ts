/**
 * @file Objective Engine
 * @description Generates and manages overworld navigation objectives/goals.
 * Maps game stages to physical theater locations and provides in-game instructions.
 *
 * Objective System:
 * Each stage has a corresponding theater location where the player must navigate:
 * - Equipment → Loading Dock
 * - Planning → Light Booth
 * - Sound Design → Sound Booth
 * - Cable Coiling → Stage Wings
 * - Wrap-up → SM Desk (sign out)
 * - etc.
 *
 * The overworld stage is a navigation puzzle where players must reach the correct
 * location to proceed to the next minigame. This ties story and mechanics together.
 */

/**
 * Generates objective data for navigating to the next required location.
 *
 * Determines which theater zone the player must reach and provides
 * narrative-appropriate instructions based on the next stage.
 *
 * @param nextStageKey - Key of the upcoming stage to navigate to
 * @param department - Player's department (affects routing, e.g., sound → sound booth)
 * @returns Objective with targetZoneId, display label, and in-game instructions
 * @example
 * const objective = getOverworldObjective('planning', 'lighting');
 * // { targetZoneId: 'lightBooth', targetLabel: 'LX BOOTH', instructionText: '...' }
 */
export function getOverworldObjective(
  nextStageKey?: string,
  department?: string,
) {
  if (nextStageKey === "cable_coiling") {
    return {
      targetZoneId: "wings",
      targetLabel: "STAGE WINGS",
      instructionText: "Show's over! Report to the WINGS for Strike.",
    };
  }

  if (nextStageKey === "wrapup") {
    return {
      targetZoneId: "stageManager",
      targetLabel: "SM DESK",
      instructionText: "Strike is complete. Report to the SM DESK to sign out.",
    };
  }

  if (nextStageKey === "stage_management") {
    return {
      targetZoneId: "callboard",
      targetLabel: "CALLBOARD",
      instructionText:
        "Report to the CALLBOARD in the Green Room to assign dressing rooms.",
    };
  }

  if (nextStageKey === "wardrobe") {
    return {
      targetZoneId: "wardrobeDept",
      targetLabel: "WARDROBE",
      instructionText: "Report to WARDROBE in the Green Room for preshow prep.",
    };
  }

  if (nextStageKey === "scenic") {
    return {
      targetZoneId: "flyRail",
      targetLabel: "FLY RAIL",
      instructionText:
        "Report to the FLY RAIL at the Catwalks to operate the scenery.",
    };
  }

  let targetZoneId = "stageManager";
  let targetLabel = "SM DESK";

  if (department === "lighting") {
    targetZoneId = "lightBooth";
    targetLabel = "LX BOOTH";
  } else if (department === "sound") {
    targetZoneId = "soundBooth";
    targetLabel = "SOUND BOOTH";
  } else if (department === "scenic") {
    targetZoneId = "flyRail";
    targetLabel = "FLY RAIL";
  } else if (department === "management") {
    targetZoneId = "stageManager";
    targetLabel = "SM DESK";
  }

  return {
    targetZoneId,
    targetLabel,
    instructionText: `Report to the ${targetLabel} immediately!`,
  };
}
