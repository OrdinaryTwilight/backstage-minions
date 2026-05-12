/**
 * @file reducerHelpers Tests
 * @description Unit tests for session creation, conflict selection, and counter updates.
 */

import { describe, expect, it, vi } from "vitest";
import { GameSession } from "../types/game";
import {
  createNewSession,
  getNextConflict,
  updateCounter,
} from "./reducerHelpers";

// Provide minimal mocks for the data and utility modules this helper imports
vi.mock("../data/gameData", () => ({
  CHARACTERS: [
    { id: "char_light", department: "lighting" },
    { id: "char_sound", department: "sound" },
    { id: "char_mgmt", department: "management" },
    { id: "char_scenic", department: "scenic" },
    { id: "char_ward", department: "wardrobe" },
  ],
  CONFLICTS: [
    { id: "conf_plan_1", trigger: "planning", npc: "npc_test" },
    { id: "conf_plan_2", trigger: "planning", npc: "npc_test2" },
    { id: "conf_exec", trigger: "cue_execution", npc: "npc_exec" },
    { id: "conf_rehearsal", trigger: "rehearsal", npc: "npc_reh" },
  ],
}));

vi.mock("../utils/levelFlowEngine", () => ({
  generateStageSequence: (dept: string) => {
    if (dept === "lighting")
      return [
        "equipment",
        "planning",
        "cue_execution",
        "cable_coiling",
        "wrapup",
      ];
    if (dept === "sound")
      return [
        "equipment",
        "sound_design",
        "cue_execution",
        "cable_coiling",
        "wrapup",
      ];
    return ["equipment", "cue_execution", "cable_coiling", "wrapup"];
  },
}));

const baseSession: GameSession = {
  productionId: "prod_test",
  difficulty: "community",
  characterId: "char_light",
  stages: ["equipment", "planning", "cue_execution", "cable_coiling", "wrapup"],
  currentStageIndex: 0,
  gearId: null,
  score: 0,
  lives: 3,
  cuesHit: 0,
  cuesMissed: 0,
  plotLights: [],
  conflictsSeen: [],
  activeConflict: null,
  activeQuests: [],
  completedQuests: [],
  inventory: [],
  stress: 0,
  affinities: {},
};

describe("reducerHelpers", () => {
  describe("createNewSession", () => {
    it("creates a session with correct production and character", () => {
      const session = createNewSession("prod_phantom", "school", "char_light");
      expect(session.productionId).toBe("prod_phantom");
      expect(session.characterId).toBe("char_light");
      expect(session.difficulty).toBe("school");
    });

    it("sets 4 lives for school difficulty", () => {
      const session = createNewSession("prod", "school", "char_light");
      expect(session.lives).toBe(4);
    });

    it("sets 3 lives for community difficulty", () => {
      const session = createNewSession("prod", "community", "char_light");
      expect(session.lives).toBe(3);
    });

    it("sets 2 lives for professional difficulty", () => {
      const session = createNewSession("prod", "professional", "char_light");
      expect(session.lives).toBe(2);
    });

    it("initializes all counters to zero", () => {
      const session = createNewSession("prod", "community", "char_light");
      expect(session.score).toBe(0);
      expect(session.cuesHit).toBe(0);
      expect(session.cuesMissed).toBe(0);
      expect(session.stress).toBe(0);
    });

    it("starts at stage index 0", () => {
      const session = createNewSession("prod", "community", "char_light");
      expect(session.currentStageIndex).toBe(0);
    });

    it("generates stage sequence based on department", () => {
      const lightSession = createNewSession("prod", "community", "char_light");
      expect(lightSession.stages).toContain("planning");

      const soundSession = createNewSession("prod", "community", "char_sound");
      expect(soundSession.stages).toContain("sound_design");
    });

    it("falls back to 'lighting' department for unknown character", () => {
      // Unknown character ID → department defaults to "lighting"
      const session = createNewSession("prod", "community", "char_unknown");
      expect(session.stages).toContain("planning");
    });

    it("initializes with empty collections", () => {
      const session = createNewSession("prod", "community", "char_light");
      expect(session.inventory).toEqual([]);
      expect(session.conflictsSeen).toEqual([]);
      expect(session.activeQuests).toEqual([]);
      expect(session.completedQuests).toEqual([]);
      expect(session.plotLights).toEqual([]);
    });
  });

  describe("getNextConflict", () => {
    it("returns a conflict matching the next stage key", () => {
      const session: GameSession = {
        ...baseSession,
        stages: [
          "equipment",
          "planning",
          "cue_execution",
          "cable_coiling",
          "wrapup",
        ],
        currentStageIndex: 0, // Next stage = stages[1] = "planning"
        conflictsSeen: [],
      };
      const conflict = getNextConflict(session);
      // Should return one of the "planning" trigger conflicts (or rehearsal which maps to planning)
      expect(conflict).not.toBeNull();
      const validConflicts = ["conf_plan_1", "conf_plan_2", "conf_rehearsal"];
      expect(validConflicts).toContain(conflict?.id);
    });

    it("returns null when there are no unseen conflicts for the next stage", () => {
      const session: GameSession = {
        ...baseSession,
        stages: [
          "equipment",
          "planning",
          "cue_execution",
          "cable_coiling",
          "wrapup",
        ],
        currentStageIndex: 0,
        conflictsSeen: ["conf_plan_1", "conf_plan_2", "conf_rehearsal"], // All planning-related seen
      };
      const conflict = getNextConflict(session);
      expect(conflict).toBeNull();
    });

    it("maps 'rehearsal' trigger conflicts to the 'planning' stage", () => {
      const session: GameSession = {
        ...baseSession,
        stages: [
          "equipment",
          "planning",
          "cue_execution",
          "cable_coiling",
          "wrapup",
        ],
        currentStageIndex: 0,
        // Only planning conflicts seen; rehearsal should still surface for planning stage
        conflictsSeen: ["conf_plan_1", "conf_plan_2"],
      };
      const conflict = getNextConflict(session);
      expect(conflict?.id).toBe("conf_rehearsal");
    });

    it("returns null when next stage has no conflicts defined", () => {
      const session: GameSession = {
        ...baseSession,
        stages: ["equipment", "cable_coiling", "wrapup"],
        currentStageIndex: 0, // Next stage = "cable_coiling", no conflicts defined
        conflictsSeen: [],
      };
      const conflict = getNextConflict(session);
      expect(conflict).toBeNull();
    });
  });

  describe("updateCounter", () => {
    it("increments the score by delta", () => {
      const updated = updateCounter({ ...baseSession, score: 50 }, "score", 25);
      expect(updated.score).toBe(75);
    });

    it("increments cuesHit", () => {
      const updated = updateCounter(
        { ...baseSession, cuesHit: 3 },
        "cuesHit",
        1,
      );
      expect(updated.cuesHit).toBe(4);
    });

    it("increments cuesMissed", () => {
      const updated = updateCounter(
        { ...baseSession, cuesMissed: 2 },
        "cuesMissed",
        1,
      );
      expect(updated.cuesMissed).toBe(3);
    });

    it("handles negative delta (score penalty)", () => {
      const updated = updateCounter(
        { ...baseSession, score: 100 },
        "score",
        -20,
      );
      expect(updated.score).toBe(80);
    });

    it("initialises missing counter to 0 before applying delta", () => {
      // Deliberately omit score to test the `|| 0` fallback
      const sessionWithoutScore = {
        ...baseSession,
        score: undefined as unknown as number,
      };
      const updated = updateCounter(sessionWithoutScore, "score", 10);
      expect(updated.score).toBe(10);
    });

    it("does not mutate the original session (immutable update)", () => {
      const original = { ...baseSession, score: 50 };
      updateCounter(original, "score", 25);
      expect(original.score).toBe(50); // Unchanged
    });
  });
});
