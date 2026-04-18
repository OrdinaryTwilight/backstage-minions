// src/context/gameReducer.test.ts
import { describe, expect, it } from "vitest";
import { GameSession, GameState } from "../types/game";
import { gameReducer } from "./gameReducer";

const initialState: GameState = {
  session: null,
  progress: {},
  unlockedStories: [],
  contacts: [],
  unreadContacts: [],
  inventory: [],
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
  activeQuests: [],
  completedQuests: [],
  inventory: [],
  stress: 0,
  affinities: {},
};

describe("gameReducer", () => {
  it("handles START_SESSION", () => {
    const action = {
      type: "START_SESSION",
      productionId: "test-prod",
      difficulty: "community",
      characterId: "char-1",
    } as const;
    const state = gameReducer(initialState, action);
    expect(state.session).not.toBeNull();
    expect(state.session?.productionId).toBe("test-prod");
    expect(state.session?.difficulty).toBe("community");
  });

  it("handles NEXT_STAGE", () => {
    const startingState: GameState = {
      ...initialState,
      session: { ...mockSession, currentStageIndex: 0 },
    };
    const action = { type: "NEXT_STAGE" } as const;
    const state = gameReducer(startingState, action);
    expect(state.session?.currentStageIndex).toBe(1);
  });

  it("handles ADD_SCORE", () => {
    const startingState: GameState = {
      ...initialState,
      session: { ...mockSession, score: 10 },
    };
    const action = { type: "ADD_SCORE", delta: 15 } as const;
    const state = gameReducer(startingState, action);
    expect(state.session?.score).toBe(25);
  });

  it("handles CUE_HIT and CUE_MISSED", () => {
    let state: GameState = {
      ...initialState,
      session: { ...mockSession, cuesHit: 0, cuesMissed: 0 },
    };

    state = gameReducer(state, { type: "CUE_HIT" });
    expect(state.session?.cuesHit).toBe(1);

    state = gameReducer(state, { type: "CUE_MISSED" });
    expect(state.session?.cuesMissed).toBe(1);
  });

  it("handles COMPLETE_LEVEL and CLEAR_SESSION", () => {
    let state: GameState = { ...initialState, session: mockSession };

    state = gameReducer(state, {
      type: "COMPLETE_LEVEL",
      productionId: "prod-1",
      difficulty: "community",
      stars: 3,
      unlockedStories: ["story-1"],
    });

    expect(state.progress["prod-1_community"]).toBeDefined();
    expect(state.progress["prod-1_community"].stars).toBe(3);

    state = gameReducer(state, { type: "CLEAR_SESSION" });
    expect(state.session).toBeNull();
  });
});
