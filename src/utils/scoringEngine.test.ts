import { describe, expect, it } from "vitest";
import { calculateStars } from "./scoringEngine";

describe("scoringEngine", () => {
  describe("calculateStars", () => {
    it("returns 3 stars when hit rate >= 90% in cue-based stages", () => {
      expect(calculateStars(10, 9, 0)).toBe(3);
      expect(calculateStars(10, 10, 0)).toBe(3);
    });

    it("returns 2 stars when hit rate >= 65% but < 90%", () => {
      expect(calculateStars(10, 7, 0)).toBe(2);
      expect(calculateStars(10, 8, 0)).toBe(2);
    });

    it("returns 1 star when hit rate < 65%", () => {
      expect(calculateStars(10, 6, 0)).toBe(1);
      expect(calculateStars(10, 0, 0)).toBe(1);
    });

    it("returns 3 stars for score >= 100 in non-cue stages", () => {
      expect(calculateStars(0, 0, 100)).toBe(3);
      expect(calculateStars(0, 0, 150)).toBe(3);
    });

    it("returns 2 stars for score >= 50 but < 100 in non-cue stages", () => {
      expect(calculateStars(0, 0, 50)).toBe(2);
      expect(calculateStars(0, 0, 99)).toBe(2);
    });

    it("returns 1 star for score < 50 in non-cue stages", () => {
      expect(calculateStars(0, 0, 49)).toBe(1);
      expect(calculateStars(0, 0, 0)).toBe(1);
    });
  });
});
