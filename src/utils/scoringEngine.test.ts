import { describe, expect, it } from "vitest";
import { GameSession } from "../types/game";
import { calculateStars } from "./scoringEngine";

/**
 * Builds a minimal but complete GameSession for testing purposes.
 * The stages array directly controls which score components are considered.
 */
function makeSession(
  overrides: Partial<GameSession> &
    Pick<GameSession, "score" | "cuesHit" | "cuesMissed">,
): GameSession {
  return {
    productionId: "prod_test",
    difficulty: "school",
    characterId: "char_test",
    stages: ["equipment", "cable_coiling", "wrapup"],
    currentStageIndex: 0,
    gearId: null,
    lives: 4,
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
    ...overrides,
  };
}

describe("scoringEngine", () => {
  describe("calculateStars", () => {
    it("returns 1 when session is null", () => {
      expect(calculateStars(null, 0, 0)).toBe(1);
    });

    describe("cue-based stages", () => {
      // With cue_execution + 10 base cues, maxShowScore = 100
      const cueStages = [
        "equipment",
        "cue_execution",
        "cable_coiling",
        "wrapup",
      ];

      it("returns 3 stars when score >= 95% and hit rate >= 80%", () => {
        const session = makeSession({
          stages: cueStages,
          score: 96,
          cuesHit: 9,
          cuesMissed: 1,
        });
        expect(calculateStars(session, 10, 10)).toBe(3);
      });

      it("returns 3 stars with a perfect run", () => {
        const session = makeSession({
          stages: cueStages,
          score: 100,
          cuesHit: 10,
          cuesMissed: 0,
        });
        expect(calculateStars(session, 10, 10)).toBe(3);
      });

      it("returns 2 stars when score >= 70% and hit rate >= 60%", () => {
        const session = makeSession({
          stages: cueStages,
          score: 70,
          cuesHit: 7,
          cuesMissed: 3,
        });
        expect(calculateStars(session, 10, 10)).toBe(2);
      });

      it("returns 1 star when hit rate is below threshold", () => {
        const session = makeSession({
          stages: cueStages,
          score: 50,
          cuesHit: 5,
          cuesMissed: 5,
        });
        // hit rate 0.5 < 0.6 threshold → 1 star
        expect(calculateStars(session, 10, 10)).toBe(1);
      });

      it("returns 1 star when score is below 70% threshold", () => {
        const session = makeSession({
          stages: cueStages,
          score: 50,
          cuesHit: 7,
          cuesMissed: 3,
        });
        // score 50/100 = 50% < 70% threshold → 1 star
        expect(calculateStars(session, 10, 10)).toBe(1);
      });

      it("handles zero total cues (treats hit rate as perfect)", () => {
        const session = makeSession({
          stages: cueStages,
          score: 96,
          cuesHit: 0,
          cuesMissed: 0,
        });
        // totalCues = 0 → hitRate = 1 (perfect), score 96 >= 95% → 3 stars
        expect(calculateStars(session, 10, 0)).toBe(3);
      });
    });

    describe("non-cue stages (stage_management, score = 50 max)", () => {
      // stage_management adds 50 to maxShowScore (no cue_execution)
      const smStages = [
        "equipment",
        "stage_management",
        "cable_coiling",
        "wrapup",
      ];

      it("returns 3 stars when score >= 95% of max (48 of 50)", () => {
        const session = makeSession({
          stages: smStages,
          score: 50,
          cuesHit: 0,
          cuesMissed: 0,
        });
        expect(calculateStars(session, 0, 0)).toBe(3);
      });

      it("returns 2 stars when score >= 70% but < 95% of max", () => {
        const session = makeSession({
          stages: smStages,
          score: 40,
          cuesHit: 0,
          cuesMissed: 0,
        });
        // 40/50 = 80% >= 70% threshold → 2 stars (hitRate = 1 with 0 cues)
        expect(calculateStars(session, 0, 0)).toBe(2);
      });

      it("returns 1 star when score is below 70% of max", () => {
        const session = makeSession({
          stages: smStages,
          score: 20,
          cuesHit: 0,
          cuesMissed: 0,
        });
        // 20/50 = 40% < 70% threshold → 1 star
        expect(calculateStars(session, 0, 0)).toBe(1);
      });
    });

    describe("scenic stages (maxShowScore = 200)", () => {
      const scenicStages = [
        "equipment",
        "scenic",
        "cue_execution",
        "cable_coiling",
        "wrapup",
      ];

      it("returns 3 stars on perfect scenic + cue run", () => {
        // scenic 200 + cue_execution 10*10=100 → max 300 (school with 10 base cues)
        const session = makeSession({
          stages: scenicStages,
          difficulty: "school",
          score: 295,
          cuesHit: 9,
          cuesMissed: 1,
        });
        expect(calculateStars(session, 10, 10)).toBe(3);
      });
    });

    describe("sound_design stages (maxShowScore depends on difficulty)", () => {
      const soundStages = ["sound_design", "cable_coiling", "wrapup"];

      it("calculates maxScore of 150 for professional difficulty sound_design", () => {
        const session = makeSession({
          stages: soundStages,
          difficulty: "professional",
          score: 145, // >= 95% of 150
          cuesHit: 0,
          cuesMissed: 0,
        });
        expect(calculateStars(session, 0, 0)).toBe(3);
      });

      it("calculates maxScore of 120 for community difficulty sound_design", () => {
        const session = makeSession({
          stages: soundStages,
          difficulty: "community",
          score: 114, // >= 95% of 120
          cuesHit: 0,
          cuesMissed: 0,
        });
        expect(calculateStars(session, 0, 0)).toBe(3);
      });

      it("calculates maxScore of 100 for school difficulty sound_design", () => {
        const session = makeSession({
          stages: soundStages,
          difficulty: "school",
          score: 95, // >= 95% of 100
          cuesHit: 0,
          cuesMissed: 0,
        });
        expect(calculateStars(session, 0, 0)).toBe(3);
      });

      it("uses default maxScore 100 for unknown difficulty sound_design", () => {
        const session = makeSession({
          stages: soundStages,
          difficulty: "unknown_tier",
          score: 95, // 95% of fallback 100
          cuesHit: 0,
          cuesMissed: 0,
        });
        expect(calculateStars(session, 0, 0)).toBe(3);
      });
    });

    describe("wardrobe stages (maxShowScore depends on difficulty)", () => {
      const wardrobeStages = ["wardrobe", "cable_coiling", "wrapup"];

      it("calculates maxScore of 410 for professional difficulty wardrobe (300+110)", () => {
        const session = makeSession({
          stages: wardrobeStages,
          difficulty: "professional",
          score: 390, // >= 95% of 410
          cuesHit: 0,
          cuesMissed: 0,
        });
        expect(calculateStars(session, 0, 0)).toBe(3);
      });

      it("calculates maxScore of 310 for community difficulty wardrobe (200+110)", () => {
        const session = makeSession({
          stages: wardrobeStages,
          difficulty: "community",
          score: 295, // >= 95% of 310
          cuesHit: 0,
          cuesMissed: 0,
        });
        expect(calculateStars(session, 0, 0)).toBe(3);
      });

      it("calculates maxScore of 230 for school difficulty wardrobe (120+110)", () => {
        const session = makeSession({
          stages: wardrobeStages,
          difficulty: "school",
          score: 219, // >= 95% of 230
          cuesHit: 0,
          cuesMissed: 0,
        });
        expect(calculateStars(session, 0, 0)).toBe(3);
      });

      it("uses fallback maxScore of 230 for unknown difficulty wardrobe (120+110)", () => {
        const session = makeSession({
          stages: wardrobeStages,
          difficulty: "unknown_tier",
          score: 219,
          cuesHit: 0,
          cuesMissed: 0,
        });
        expect(calculateStars(session, 0, 0)).toBe(3);
      });
    });

    describe("planning stage (adds 100 to maxScore)", () => {
      const planningStages = ["planning", "cable_coiling", "wrapup"];

      it("calculates maxScore of 100 for planning-only stage", () => {
        const session = makeSession({
          stages: planningStages,
          score: 95, // >= 95% of 100
          cuesHit: 0,
          cuesMissed: 0,
        });
        expect(calculateStars(session, 0, 0)).toBe(3);
      });
    });

    describe("empty stages (maxScore defaults to 100)", () => {
      it("returns 3 stars when score >= 95 on empty stages (default max 100)", () => {
        const session = makeSession({
          stages: [],
          score: 95,
          cuesHit: 0,
          cuesMissed: 0,
        });
        expect(calculateStars(session, 0, 0)).toBe(3);
      });
    });
  });
});
