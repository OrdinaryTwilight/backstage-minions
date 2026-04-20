import { describe, expect, it } from "vitest";
import { calculateStars } from "./scoringEngine";

describe("scoringEngine", () => {
  describe("calculateStars", () => {
    it("returns 3 stars when hit rate >= 90% in cue-based stages", () => {
      expect(
        calculateStars({ score: 100, cuesHit: 9, cuesMissed: 1 } as any, 10),
      ).toBe(3);
      expect(
        calculateStars({ score: 100, cuesHit: 10, cuesMissed: 0 } as any, 10),
      ).toBe(3);
    });

    it("returns 2 stars when hit rate >= 65% but < 90%", () => {
      expect(
        calculateStars({ score: 75, cuesHit: 7, cuesMissed: 3 } as any, 10),
      ).toBe(2);
      expect(
        calculateStars({ score: 85, cuesHit: 8, cuesMissed: 2 } as any, 10),
      ).toBe(2);
    });

    it("returns 1 star when hit rate < 65%", () => {
      expect(
        calculateStars({ score: 50, cuesHit: 6, cuesMissed: 4 } as any, 10),
      ).toBe(1);
      expect(
        calculateStars({ score: 0, cuesHit: 0, cuesMissed: 10 } as any, 10),
      ).toBe(1);
    });

    it("returns 3 stars for score >= 100 in non-cue stages", () => {
      expect(
        calculateStars({ score: 100, cuesHit: 0, cuesMissed: 0 } as any, 0),
      ).toBe(3);
      expect(
        calculateStars({ score: 150, cuesHit: 0, cuesMissed: 0 } as any, 0),
      ).toBe(3);
    });

    it("returns 2 stars for score >= 50 but < 100 in non-cue stages", () => {
      expect(
        calculateStars({ score: 50, cuesHit: 0, cuesMissed: 0 } as any, 0),
      ).toBe(2);
      expect(
        calculateStars({ score: 99, cuesHit: 0, cuesMissed: 0 } as any, 0),
      ).toBe(2);
    });

    it("returns 1 star for score < 50 in non-cue stages", () => {
      expect(
        calculateStars({ score: 49, cuesHit: 0, cuesMissed: 0 } as any, 0),
      ).toBe(1);
      expect(
        calculateStars({ score: 0, cuesHit: 0, cuesMissed: 0 } as any, 0),
      ).toBe(1);
    });
  });
});
