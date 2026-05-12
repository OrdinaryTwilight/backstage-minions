import { cleanup } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { generateStageSequence } from "./levelFlowEngine";

describe("levelFlowEngine", () => {
  afterEach(() => {
    cleanup();
  });

  describe("generateStageSequence", () => {
    it("always starts with 'equipment'", () => {
      [
        "lighting",
        "sound",
        "management",
        "scenic",
        "wardrobe",
        "props",
      ].forEach((dept) => {
        expect(generateStageSequence(dept)[0]).toBe("equipment");
      });
    });

    it("always ends with cable_coiling then wrapup", () => {
      ["lighting", "sound", "management", "scenic", "props"].forEach((dept) => {
        const seq = generateStageSequence(dept);
        expect(seq[seq.length - 1]).toBe("wrapup");
        expect(seq[seq.length - 2]).toBe("cable_coiling");
      });
    });

    it("includes 'planning' and 'cue_execution' for lighting department", () => {
      const seq = generateStageSequence("lighting");
      expect(seq).toContain("planning");
      expect(seq).toContain("cue_execution");
      expect(seq).not.toContain("sound_design");
    });

    it("includes 'sound_design' and 'cue_execution' for sound department", () => {
      const seq = generateStageSequence("sound");
      expect(seq).toContain("sound_design");
      expect(seq).toContain("cue_execution");
      expect(seq).not.toContain("planning");
    });

    it("includes 'stage_management' and 'cue_execution' for management department", () => {
      const seq = generateStageSequence("management");
      expect(seq).toContain("stage_management");
      expect(seq).toContain("cue_execution");
    });

    it("includes 'scenic' and 'cue_execution' for scenic department", () => {
      const seq = generateStageSequence("scenic");
      expect(seq).toContain("scenic");
      expect(seq).toContain("cue_execution");
    });

    it("includes only 'wardrobe' (no cue_execution) for wardrobe department", () => {
      const seq = generateStageSequence("wardrobe");
      expect(seq).toContain("wardrobe");
      expect(seq).not.toContain("cue_execution");
    });

    it("falls back to 'cue_execution' for unknown departments", () => {
      const seq = generateStageSequence("unknown_dept");
      expect(seq).toContain("cue_execution");
      expect(seq).not.toContain("planning");
      expect(seq).not.toContain("sound_design");
    });

    it("returns correct sequence length for lighting (5 stages)", () => {
      // equipment + planning + cue_execution + cable_coiling + wrapup
      expect(generateStageSequence("lighting")).toHaveLength(5);
    });

    it("returns correct sequence length for wardrobe (4 stages)", () => {
      // equipment + wardrobe + cable_coiling + wrapup
      expect(generateStageSequence("wardrobe")).toHaveLength(4);
    });
  });
});
