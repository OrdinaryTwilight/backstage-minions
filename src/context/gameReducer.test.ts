import { describe, expect, it } from "vitest";
import { GameState } from "../types/game";
import { gameReducer } from "./gameReducer";

describe("gameReducer Core Logic", () => {
  const initialState: GameState = {
    session: null,
    progress: {},
    unlockedStories: [],
    contacts: [],
    unreadContacts: [],
  };

  it("START_SESSION initializes a correct technical session", () => {
    const state = gameReducer(initialState, {
      type: "START_SESSION",
      productionId: "phantom",
      difficulty: "school",
      characterId: "char_ben",
    });

    expect(state.session).toBeDefined();
    expect(state.session?.productionId).toBe("phantom");
    expect(state.session?.lives).toBe(4); // School difficulty grants 4 lives
    expect(state.session?.score).toBe(0);
    expect(state.session?.currentStageIndex).toBe(0);
  });

  it("ADD_SCORE correctly increments the score delta", () => {
    let state = gameReducer(initialState, {
      type: "START_SESSION",
      productionId: "phantom",
      difficulty: "school",
      characterId: "char_ben",
    });

    state = gameReducer(state, { type: "ADD_SCORE", delta: 50 });
    expect(state.session?.score).toBe(50);

    state = gameReducer(state, { type: "ADD_SCORE", delta: -10 });
    expect(state.session?.score).toBe(40); // Proves penalty logic works
  });

  it("CUE_HIT and CUE_MISSED update the timeline trackers", () => {
    let state = gameReducer(initialState, {
      type: "START_SESSION",
      productionId: "phantom",
      difficulty: "school",
      characterId: "char_ben",
    });

    state = gameReducer(state, { type: "CUE_HIT" });
    state = gameReducer(state, { type: "CUE_HIT" });
    state = gameReducer(state, { type: "CUE_MISSED" });

    expect(state.session?.cuesHit).toBe(2);
    expect(state.session?.cuesMissed).toBe(1);
  });

  it("NEXT_STAGE advances the internal index", () => {
    let state = gameReducer(initialState, {
      type: "START_SESSION",
      productionId: "phantom",
      difficulty: "school",
      characterId: "char_ben",
    });

    state = gameReducer(state, { type: "NEXT_STAGE" });
    expect(state.session?.currentStageIndex).toBe(1);
  });

  it("COMPLETE_LEVEL correctly saves progress and stars globally", () => {
    const state = gameReducer(initialState, {
      type: "COMPLETE_LEVEL",
      productionId: "phantom",
      difficulty: "community",
      stars: 3,
      unlockedStories: ["story_1"],
    });

    const savedProgress = state.progress["phantom_community"];
    expect(savedProgress).toBeDefined();
    expect(savedProgress.stars).toBe(3);
    expect(savedProgress.completed).toBe(true);
    expect(state.unlockedStories).toContain("story_1");
  });

  it("ADD_CONTACT adds to networks without duplicating", () => {
    let state = gameReducer(initialState, {
      type: "ADD_CONTACT",
      contactId: "char_sam",
    });
    expect(state.contacts).toContain("char_sam");
    expect(state.unreadContacts).toContain("char_sam");

    // Dispatching again should not create duplicates
    state = gameReducer(state, { type: "ADD_CONTACT", contactId: "char_sam" });
    expect(state.contacts.length).toBe(1);
  });
});
