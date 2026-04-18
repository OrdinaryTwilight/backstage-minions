import { describe, expect, it } from "vitest";
import { getOverworldObjective } from "./objectiveEngine";

describe("getOverworldObjective", () => {
  it("returns cable_coiling objective when nextStageKey is cable_coiling", () => {
    const result = getOverworldObjective("cable_coiling", "lighting");
    expect(result.targetZoneId).toBe("wings");
    expect(result.targetLabel).toBe("STAGE WINGS");
    expect(result.instructionText).toContain("Strike");
  });

  it("returns wrapup objective when nextStageKey is wrapup", () => {
    const result = getOverworldObjective("wrapup", "sound");
    expect(result.targetZoneId).toBe("stageManager");
    expect(result.targetLabel).toBe("SM DESK");
    expect(result.instructionText).toContain("sign out");
  });

  it("returns LX BOOTH for lighting department default", () => {
    const result = getOverworldObjective("execution", "lighting");
    expect(result.targetZoneId).toBe("lightBooth");
    expect(result.targetLabel).toBe("LX BOOTH");
  });

  it("returns SOUND BOOTH for sound department default", () => {
    const result = getOverworldObjective("execution", "sound");
    expect(result.targetZoneId).toBe("soundBooth");
    expect(result.targetLabel).toBe("SOUND BOOTH");
  });
});
