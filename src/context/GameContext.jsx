import { createContext, useContext, useEffect, useReducer } from "react";

const STORAGE_KEY = "a3_backstage_save";

// Game state structure for persistence and session management
const initialState = {
  // Current active level session (only set during gameplay)
  session: null, // { productionId, difficulty, characterId, stage, score, lives, cuesHit, cuesMissed, plotLights, conflictsSeen }

  // Persistent progress tracking (survives across sessions)
  progress: {}, // { [productionId_difficulty]: { stars, completed } }

  // Unlocked narrative content (rewards for completing levels)
  unlockedStories: [], // array of story ids

  // Network contacts earned through social choices
  contacts: [], // npc names gained via networking/conflict choices
};

// Central reducer for all game state updates
function reducer(state, action) {
  switch (action.type) {
    // Load saved game from localStorage
    case "LOAD_SAVE":
      return { ...state, ...action.payload };

    // Initialize a new level session
    case "START_SESSION":
      return {
        ...state,
        session: {
          productionId: action.productionId,
          difficulty: action.difficulty,
          characterId: action.characterId,
          stage: "planning",
          score: 0,
          // Difficulty affects starting lives: professional (2) < community (3) < school (4)
          lives:
            action.difficulty === "professional"
              ? 2
              : action.difficulty === "community"
                ? 3
                : 4,
          cuesHit: 0,
          cuesMissed: 0,
          plotLights: [],
          conflictsSeen: [],
        },
      };

    // Advance to next stage: planning → rehearsal → liveshow → wrapup
    case "ADVANCE_STAGE": {
      const stageOrder = ["planning", "rehearsal", "liveshow", "wrapup"];
      const next = stageOrder[stageOrder.indexOf(state.session.stage) + 1];
      return { ...state, session: { ...state.session, stage: next } };
    }

    // Award points for successful choices/cues
    case "ADD_SCORE":
      return {
        ...state,
        session: {
          ...state.session,
          score: state.session.score + action.delta,
        },
      };

    // Deduct a life when cues are missed
    case "LOSE_LIFE": {
      const newLives = state.session.lives - 1;
      return { ...state, session: { ...state.session, lives: newLives } };
    }

    // Track accuracy: successful cue execution
    case "CUE_HIT":
      return {
        ...state,
        session: { ...state.session, cuesHit: state.session.cuesHit + 1 },
      };

    // Track accuracy: missed cue execution
    case "CUE_MISSED":
      return {
        ...state,
        session: { ...state.session, cuesMissed: state.session.cuesMissed + 1 },
      };

    // Save lighting plot from planning stage
    case "SET_PLOT_LIGHTS":
      return {
        ...state,
        session: { ...state.session, plotLights: action.lights },
      };

    // Mark conflict as seen (prevents repetition, affects available choices)
    case "MARK_CONFLICT_SEEN":
      return {
        ...state,
        session: {
          ...state.session,
          conflictsSeen: [...state.session.conflictsSeen, action.conflictId],
        },
      };

    // Add NPC contact to network
    case "ADD_CONTACT":
      return {
        ...state,
        contacts: [...new Set([...state.contacts, action.name])],
      };

    // Complete level: save progress, unlock stories, return to main menu
    case "COMPLETE_LEVEL": {
      const key = `${action.productionId}_${action.difficulty}`;
      const stars = action.stars;
      const prev = state.progress[key]?.stars ?? 0;
      return {
        ...state,
        session: null,
        progress: {
          ...state.progress,
          [key]: { stars: Math.max(prev, stars), completed: true },
        },
        unlockedStories: [
          ...new Set([...state.unlockedStories, ...action.unlockedStories]),
        ],
      };
    }

    // Fail level: clear session but preserve progress
    case "FAIL_LEVEL":
      return { ...state, session: null };

    case "RESET_LIVES":
      return {
        ...state,
        session: {
          ...state.session,
          lives: 3, // Or whatever your default max lives are
        },
      };

    default:
      return state;
  }
}

const GameContext = createContext(null);

export function GameProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  // Load save on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) dispatch({ type: "LOAD_SAVE", payload: JSON.parse(saved) });
    } catch {}
  }, []);

  // Persist on every change (skip session to avoid mid-game saves)
  useEffect(() => {
    const { session, ...toSave } = state;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
  }, [state]);

  return (
    <GameContext.Provider value={{ state, dispatch }}>
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error("useGame must be used inside GameProvider");
  return ctx;
}
