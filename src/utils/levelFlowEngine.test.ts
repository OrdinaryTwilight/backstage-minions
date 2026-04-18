import { afterEach, describe, expect, it } from "vitest";
import { generateStageSequence } from "./levelFlowEngine";
import { cleanup } from "@testing-library/react";

describe("levelFlowEngine", () => {
  afterEach(() => {
    cleanup();
  });
  describe("generateStageSequence", () => {
    it("includes planning stage for lighting department", () => {
      const seq = generateStageSequence("lighting");
      expect(seq).toContain("planning");
      expect(seq).not.toContain("sound_design");
    });

    it("includes sound_design stage for sound department", () => {
      const seq = generateStageSequence("sound");
      expect(seq).toContain("sound_design");
      expect(seq).not.toContain("planning");
    });

    it("always starts with equipment and ends with cable coiling -> wrapup", () => {
      const seq = generateStageSequence("lighting");

      expect(seq[0]).toBe("equipment");
      expect(seq[seq.length - 1]).toBe("wrapup");
      expect(seq[seq.length - 2]).toBe("cable_coiling");
    });
  });
});
