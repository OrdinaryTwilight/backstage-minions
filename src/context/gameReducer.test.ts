// src/context/gameReducer.test.ts
import { afterEach, describe, expect, it, vi } from "vitest";
import { GameSession, GameState } from "../types/game";
import { gameReducer } from "./gameReducer";

// Note: You may need to mock CONFLICTS and CHARACTERS if they don't load easily in tests,
// but assuming they import fine, we will test the logic.
vi.mock("../data/gameData", () => ({
  CHARACTERS: [
    { id: "char-1", department: "Lighting" },
    { id: "char-2", department: "unknown" },
  ],
  CONFLICTS: [{ id: "conflict-1", trigger: "execution" }],
}));

const initialState: GameState = {
  session: null,
  progress: {},
  unlockedStories: [],
  contacts: [],
  unreadContacts: [],
};

const mockSession: GameSession = {
  productionId: "prod-1",
  difficulty: "community",
  characterId: "char-1",
  stages: ["planning", "execution"],
  currentStageIndex: 0,
  gearId: null,
  score: 0,
  lives: 3,
  cuesHit: 0,
  cuesMissed: 0,
  plotLights: [],
  conflictsSeen: [],
  activeConflict: null,
};

describe("gameReducer", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("handles default action", () => {
    const state = gameReducer(initialState, { type: "UNKNOWN" } as any);
    expect(state).toEqual(initialState);
  });

  describe("START_SESSION", () => {
    it("sets correct lives based on difficulty", () => {
      // Professional = 2
      let state = gameReducer(initialState, {
        type: "START_SESSION",
        productionId: "p1",
        difficulty: "professional",
        characterId: "char-1",
      });
      expect(state.session?.lives).toBe(2);

      // Community = 3
      state = gameReducer(initialState, {
        type: "START_SESSION",
        productionId: "p1",
        difficulty: "community",
        characterId: "char-1",
      });
      expect(state.session?.lives).toBe(3);

      // school (or anything else) = 4
      state = gameReducer(initialState, {
        type: "START_SESSION",
        productionId: "p1",
        difficulty: "school",
        characterId: "char-1",
      });
      expect(state.session?.lives).toBe(4);
    });

    it("falls back to 'lighting' department if character is not found or has no department", () => {
      const state = gameReducer(initialState, {
        type: "START_SESSION",
        productionId: "p1",
        difficulty: "school",
        characterId: "non-existent",
      });
      expect(state.session?.stages).toContain("planning"); // 'planning' is the lighting stage
    });
  });

  describe("NEXT_STAGE and Conflicts", () => {
    it("ignores NEXT_STAGE if session is null", () => {
      const state = gameReducer(initialState, { type: "NEXT_STAGE" });
      expect(state).toEqual(initialState);
    });

    it("advances stage and returns null conflict if random <= 0.5", () => {
      vi.spyOn(Math, "random").mockReturnValue(0.4); // Forces no conflict
      const state = gameReducer(
        { ...initialState, session: mockSession },
        { type: "NEXT_STAGE" },
      );
      expect(state.session?.currentStageIndex).toBe(1);
      expect(state.session?.activeConflict).toBeNull();
    });

    it("advances stage and triggers conflict if available and random > 0.5", () => {
      vi.spyOn(Math, "random").mockReturnValue(0.9); // Forces conflict
      const state = gameReducer(
        { ...initialState, session: mockSession },
        { type: "NEXT_STAGE" },
      );
      expect(state.session?.activeConflict?.id).toBe("conflict-1");
    });
  });

  describe("Session Updates (SET_GEAR, LOSE_LIFE, SET_PLOT_LIGHTS)", () => {
    it("safely ignores actions if session is null", () => {
      expect(
        gameReducer(initialState, { type: "SET_GEAR", gearId: "g1" }).session,
      ).toBeNull();
      expect(
        gameReducer(initialState, { type: "LOSE_LIFE" }).session,
      ).toBeNull();
      expect(
        gameReducer(initialState, { type: "SET_PLOT_LIGHTS", lights: [] })
          .session,
      ).toBeNull();
      expect(
        gameReducer(initialState, {
          type: "MARK_CONFLICT_SEEN",
          conflictId: "c1",
        }).session,
      ).toBeNull();
      expect(
        gameReducer(initialState, {
          type: "RESOLVE_CONFLICT",
          conflictId: "c1",
        }).session,
      ).toBeNull();
    });

    it("updates gear, lives, and plot lights correctly", () => {
      let state = gameReducer(
        { ...initialState, session: mockSession },
        { type: "SET_GEAR", gearId: "gear-99" },
      );
      expect(state.session?.gearId).toBe("gear-99");

      state = gameReducer(state, { type: "LOSE_LIFE" });
      expect(state.session?.lives).toBe(2);

      state = gameReducer(state, {
        type: "SET_PLOT_LIGHTS",
        lights: [
          {
            id: "light1",
            color: "red",
            intensity: 5,
            gridX: 0,
            gridY: 0,
            type: "spot",
          },
        ],
      });
      expect(state.session?.plotLights.length).toBe(1);
    });
  });

  describe("Counters (Score, Cues Hit/Missed)", () => {
    it("safely ignores counter updates if session is null", () => {
      expect(
        gameReducer(initialState, { type: "ADD_SCORE", delta: 10 }).session,
      ).toBeNull();
      expect(gameReducer(initialState, { type: "CUE_HIT" }).session).toBeNull();
      expect(
        gameReducer(initialState, { type: "CUE_MISSED" }).session,
      ).toBeNull();
    });

    it("adds score and correctly falls back if delta is invalid", () => {
      let state = gameReducer(
        { ...initialState, session: mockSession },
        { type: "ADD_SCORE", delta: 10 },
      );
      expect(state.session?.score).toBe(10);

      state = gameReducer(state, {
        type: "ADD_SCORE",
        delta: "invalid" as any,
      });
      expect(state.session?.score).toBe(10); // Should add 0
    });
  });

  describe("Conflicts", () => {
    it("handles MARK_CONFLICT_SEEN and RESOLVE_CONFLICT", () => {
      let state = gameReducer(
        {
          ...initialState,
          session: { ...mockSession, activeConflict: { id: "c1" } as any },
        },
        { type: "MARK_CONFLICT_SEEN", conflictId: "c1" },
      );
      expect(state.session?.conflictsSeen).toContain("c1");

      state = gameReducer(state, {
        type: "RESOLVE_CONFLICT",
        conflictId: "c2",
      });
      expect(state.session?.activeConflict).toBeNull();
      expect(state.session?.conflictsSeen).toContain("c2");
    });
  });

  describe("Contacts and Progress", () => {
    it("handles ADD_CONTACT", () => {
      let state = gameReducer(initialState, {
        type: "ADD_CONTACT",
        contactId: "contact-1",
      });
      expect(state.contacts).toContain("contact-1");
      expect(state.unreadContacts).toContain("contact-1");

      // Adding the same contact again should return the exact same state reference
      const newState = gameReducer(state, {
        type: "ADD_CONTACT",
        contactId: "contact-1",
      });
      expect(newState).toBe(state);
    });

    it("handles MARK_CONTACT_READ", () => {
      let state = gameReducer(
        { ...initialState, unreadContacts: ["c1", "c2"] },
        { type: "MARK_CONTACT_READ", contactId: "c1" },
      );
      expect(state.unreadContacts).not.toContain("c1");
      expect(state.unreadContacts).toContain("c2");
    });

    it("handles COMPLETE_LEVEL", () => {
      const state = gameReducer(initialState, {
        type: "COMPLETE_LEVEL",
        productionId: "prod1",
        difficulty: "school",
        stars: 2,
        unlockedStories: ["s1"],
      });
      expect(state.progress["prod1_school"].stars).toBe(2);
      expect(state.progress["prod1_school"].completed).toBe(true);
      expect(state.unlockedStories).toContain("s1");
    });
  });
});
