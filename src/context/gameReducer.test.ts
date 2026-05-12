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
  chatHistory: {},
  hasSeenIntro: false,
};

const mockSession: GameSession = {
  productionId: "prod-1",
  difficulty: "community",
  characterId: "char-1",
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

  it("handles MARK_INTRO_SEEN", () => {
    const state = gameReducer(initialState, { type: "MARK_INTRO_SEEN" });
    expect(state.hasSeenIntro).toBe(true);
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

  it("handles NEXT_STAGE with no active session (no-op)", () => {
    const state = gameReducer(initialState, { type: "NEXT_STAGE" });
    expect(state.session).toBeNull();
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

  it("handles ADD_SCORE with zero delta", () => {
    const startingState: GameState = {
      ...initialState,
      session: { ...mockSession, score: 50 },
    };
    const state = gameReducer(startingState, { type: "ADD_SCORE", delta: 0 });
    expect(state.session?.score).toBe(50);
  });

  it("handles CUE_HIT and CUE_MISSED", () => {
    let state: GameState = {
      ...initialState,
      session: { ...mockSession, cuesHit: 0, cuesMissed: 0 },
    };

    state = gameReducer(state, { type: "CUE_HIT" });
    expect(state.session?.cuesHit).toBe(1);
    expect(state.session?.score).toBe(10); // CUE_HIT adds 10 to score

    state = gameReducer(state, { type: "CUE_MISSED" });
    expect(state.session?.cuesMissed).toBe(1);
  });

  it("handles UPDATE_STRESS (clamps between 0 and 100)", () => {
    let state: GameState = {
      ...initialState,
      session: { ...mockSession, stress: 50 },
    };

    state = gameReducer(state, { type: "UPDATE_STRESS", delta: 30 });
    expect(state.session?.stress).toBe(80);

    // Should not exceed 100
    state = gameReducer(state, { type: "UPDATE_STRESS", delta: 50 });
    expect(state.session?.stress).toBe(100);

    // Should not go below 0
    state = gameReducer(state, { type: "UPDATE_STRESS", delta: -200 });
    expect(state.session?.stress).toBe(0);
  });

  it("handles RESOLVE_CONFLICT", () => {
    const conflictId = "conflict-1";
    const startingState: GameState = {
      ...initialState,
      session: { ...mockSession, score: 100, conflictsSeen: [] },
    };
    const state = gameReducer(startingState, {
      type: "RESOLVE_CONFLICT",
      conflictId,
      pointDelta: 25,
    });

    expect(state.session?.activeConflict).toBeNull();
    expect(state.session?.conflictsSeen).toContain(conflictId);
    expect(state.session?.score).toBe(125);
  });

  it("handles ADD_INVENTORY", () => {
    const state: GameState = {
      ...initialState,
      session: { ...mockSession, inventory: ["torch"] },
    };
    const newState = gameReducer(state, {
      type: "ADD_INVENTORY",
      item: "Gaff Tape",
    });
    expect(newState.session?.inventory).toContain("Gaff Tape");
    expect(newState.session?.inventory).toContain("torch");
  });

  it("handles REMOVE_INVENTORY", () => {
    const state: GameState = {
      ...initialState,
      session: { ...mockSession, inventory: ["torch", "Gaff Tape"] },
    };
    const newState = gameReducer(state, {
      type: "REMOVE_INVENTORY",
      item: "Gaff Tape",
    });
    expect(newState.session?.inventory).not.toContain("Gaff Tape");
    expect(newState.session?.inventory).toContain("torch");
  });

  it("handles COMPLETE_QUEST", () => {
    const state: GameState = {
      ...initialState,
      session: {
        ...mockSession,
        activeQuests: ["quest-a", "quest-b"],
        completedQuests: [],
        score: 0,
      },
    };
    const newState = gameReducer(state, {
      type: "COMPLETE_QUEST",
      questId: "quest-a",
      pointDelta: 50,
    });

    expect(newState.session?.completedQuests).toContain("quest-a");
    expect(newState.session?.activeQuests).not.toContain("quest-a");
    expect(newState.session?.activeQuests).toContain("quest-b");
    expect(newState.session?.score).toBe(50);
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
    expect(state.progress["prod-1_community"].completed).toBe(true);
    expect(state.unlockedStories).toContain("story-1");
    expect(state.session).toBeNull(); // Session cleared after level completion

    state = gameReducer(state, { type: "CLEAR_SESSION" });
    expect(state.session).toBeNull();
  });

  it("COMPLETE_LEVEL preserves best star rating across playthroughs", () => {
    // First run: 3 stars
    let state = gameReducer(
      { ...initialState, session: { ...mockSession, score: 200 } },
      {
        type: "COMPLETE_LEVEL",
        productionId: "prod-1",
        difficulty: "community",
        stars: 3,
        unlockedStories: [],
      },
    );
    expect(state.progress["prod-1_community"].stars).toBe(3);

    // Second run: only 1 star — best rating should be preserved
    state = gameReducer(
      { ...state, session: { ...mockSession, score: 50 } },
      {
        type: "COMPLETE_LEVEL",
        productionId: "prod-1",
        difficulty: "community",
        stars: 1,
        unlockedStories: [],
      },
    );
    expect(state.progress["prod-1_community"].stars).toBe(3); // Still 3!
  });

  it("handles ADD_CONTACT (idempotent - no duplicate contacts)", () => {
    let state: GameState = { ...initialState, contacts: [] };

    state = gameReducer(state, { type: "ADD_CONTACT", contactId: "npc_bryan" });
    expect(state.contacts).toContain("npc_bryan");
    expect(state.unreadContacts).toContain("npc_bryan");

    // Adding the same contact again should not duplicate it
    const lengthBefore = state.contacts.length;
    state = gameReducer(state, { type: "ADD_CONTACT", contactId: "npc_bryan" });
    expect(state.contacts.length).toBe(lengthBefore);
  });

  it("handles MARK_CONTACT_READ", () => {
    let state: GameState = {
      ...initialState,
      contacts: ["npc_bryan"],
      unreadContacts: ["npc_bryan"],
    };

    state = gameReducer(state, {
      type: "MARK_CONTACT_READ",
      contactId: "npc_bryan",
    });
    expect(state.unreadContacts).not.toContain("npc_bryan");

    // Marking already-read contact is a no-op
    const prevUnread = state.unreadContacts.length;
    state = gameReducer(state, {
      type: "MARK_CONTACT_READ",
      contactId: "npc_bryan",
    });
    expect(state.unreadContacts.length).toBe(prevUnread);
  });

  it("handles ADD_CHAT_MESSAGE", () => {
    const state: GameState = { ...initialState, chatHistory: {} };
    const newState = gameReducer(state, {
      type: "ADD_CHAT_MESSAGE",
      contactId: "npc_bryan",
      message: { sender: "Bryan", text: "Hello!" },
    });

    expect(newState.chatHistory?.["npc_bryan"]).toBeDefined();
    expect(newState.chatHistory?.["npc_bryan"][0].text).toBe("Hello!");
  });

  it("handles SET_GEAR", () => {
    const startState: GameState = {
      ...initialState,
      session: { ...mockSession, gearId: null },
    };
    const newState = gameReducer(startState, {
      type: "SET_GEAR",
      gearId: "gear_led_par",
    });
    expect(newState.session?.gearId).toBe("gear_led_par");
  });

  it("handles LOAD_SAVE", () => {
    const savedData = {
      progress: { "prod-1_school": { stars: 2, completed: true } },
      contacts: ["npc_test"],
      unreadContacts: [],
    };
    const newState = gameReducer(initialState, {
      type: "LOAD_SAVE",
      payload: savedData,
    });
    expect(newState.progress["prod-1_school"].stars).toBe(2);
    expect(newState.contacts).toContain("npc_test");
  });
});
