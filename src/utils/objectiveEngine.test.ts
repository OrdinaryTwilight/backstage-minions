import { describe, expect, it } from "vitest";
import { getOverworldObjective } from "./objectiveEngine";

describe("getOverworldObjective", () => {
  it("returns cable_coiling objective when nextStageKey is 'cable_coiling'", () => {
    const result = getOverworldObjective("cable_coiling", "lighting");
    expect(result.targetZoneId).toBe("wings");
    expect(result.targetLabel).toBe("STAGE WINGS");
    expect(result.instructionText).toContain("Strike");
  });

  it("returns wrapup objective when nextStageKey is 'wrapup'", () => {
    const result = getOverworldObjective("wrapup", "sound");
    expect(result.targetZoneId).toBe("stageManager");
    expect(result.targetLabel).toBe("SM DESK");
    expect(result.instructionText).toContain("sign out");
  });

  it("returns stage_management objective when nextStageKey is 'stage_management'", () => {
    const result = getOverworldObjective("stage_management", "management");
    expect(result.targetZoneId).toBe("callboard");
    expect(result.targetLabel).toBe("CALLBOARD");
    expect(result.instructionText).toContain("CALLBOARD");
  });

  it("returns wardrobe objective when nextStageKey is 'wardrobe'", () => {
    const result = getOverworldObjective("wardrobe", "wardrobe");
    expect(result.targetZoneId).toBe("wardrobeDept");
    expect(result.targetLabel).toBe("WARDROBE");
  });

  it("returns fly rail objective when nextStageKey is 'scenic'", () => {
    const result = getOverworldObjective("scenic", "scenic");
    expect(result.targetZoneId).toBe("flyRail");
    expect(result.targetLabel).toBe("FLY RAIL");
  });

  it("returns LX BOOTH for lighting department fallback", () => {
    const result = getOverworldObjective("cue_execution", "lighting");
    expect(result.targetZoneId).toBe("lightBooth");
    expect(result.targetLabel).toBe("LX BOOTH");
  });

  it("returns SOUND BOOTH for sound department fallback", () => {
    const result = getOverworldObjective("cue_execution", "sound");
    expect(result.targetZoneId).toBe("soundBooth");
    expect(result.targetLabel).toBe("SOUND BOOTH");
  });

  it("returns FLY RAIL for scenic department fallback", () => {
    const result = getOverworldObjective("cue_execution", "scenic");
    expect(result.targetZoneId).toBe("flyRail");
    expect(result.targetLabel).toBe("FLY RAIL");
  });

  it("returns SM DESK for management department fallback", () => {
    const result = getOverworldObjective("cue_execution", "management");
    expect(result.targetZoneId).toBe("stageManager");
    expect(result.targetLabel).toBe("SM DESK");
  });

  it("returns SM DESK as default for unknown department", () => {
    const result = getOverworldObjective("cue_execution", "props");
    expect(result.targetZoneId).toBe("stageManager");
    expect(result.instructionText).toContain("SM DESK");
  });

  it("returns SM DESK when nextStageKey and department are both undefined", () => {
    const result = getOverworldObjective();
    expect(result.targetZoneId).toBe("stageManager");
    expect(result.targetLabel).toBe("SM DESK");
  });
});
