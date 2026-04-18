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

  const isLighting = department === "lighting";
  return {
    targetZoneId: isLighting ? "lightBooth" : "soundBooth",
    targetLabel: isLighting ? "LX BOOTH" : "SOUND BOOTH",
    instructionText: `Report to the ${isLighting ? "LX BOOTH" : "SOUND BOOTH"} immediately!`,
  };
}
