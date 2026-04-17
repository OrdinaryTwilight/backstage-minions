import { createContext, useContext, useEffect, useReducer } from "react";
import { PRODUCTION_STAGES } from "../data/gameData"; // Import the stage order

const STORAGE_KEY = "a3_backstage_save";

const initialState = {
  session: null,
  progress: {},
  unlockedStories: [],
  contacts: [],
};

function reducer(state, action) {
  switch (action.type) {
    case "LOAD_SAVE":
      return { ...state, ...action.payload };

    case "START_SESSION":
      return {
        ...state,
        session: {
          productionId: action.productionId,
          difficulty: action.difficulty,
          characterId: action.characterId,
          stages: PRODUCTION_STAGES,
          currentStageIndex: 0,
          gearId: null, // Initialized
          score: 0,
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

    // NEW ACTION: Save selected gear
    case "SET_GEAR":
      return {
        ...state,
        session: {
          ...state.session,
          gearId: action.gearId,
        },
      };

    // FIX: Page calls "NEXT_STAGE", so we use that name here
    case "NEXT_STAGE":
      return {
        ...state,
        session: {
          ...state.session,
          currentStageIndex: state.session.currentStageIndex + 1,
        },
      };

    case "ADD_SCORE":
      return {
        ...state,
        session: {
          ...state.session,
          score:
            (Number(state.session.score) || 0) + (Number(action.delta) || 0),
        },
      };

    case "LOSE_LIFE":
      return {
        ...state,
        session: { ...state.session, lives: state.session.lives - 1 },
      };

    case "CUE_HIT":
      return {
        ...state,
        session: { ...state.session, cuesHit: state.session.cuesHit + 1 },
      };

    case "CUE_MISSED":
      return {
        ...state,
        session: { ...state.session, cuesMissed: state.session.cuesMissed + 1 },
      };

    case "SET_PLOT_LIGHTS":
      return {
        ...state,
        session: { ...state.session, plotLights: action.lights },
      };

    case "COMPLETE_LEVEL": {
      const key = `${action.productionId}_${action.difficulty}`;
      const stars = action.stars;
      const prev = state.progress[key]?.stars ?? 0;
      return {
        ...state,
        progress: {
          ...state.progress,
          [key]: { stars: Math.max(prev, stars), completed: true },
        },
        unlockedStories: [
          ...new Set([...state.unlockedStories, ...action.unlockedStories]),
        ],
      };
    }

    case "CLEAR_SESSION":
      return { ...state, session: null };

    default:
      return state;
  }
}

const GameContext = createContext(null);

export function GameProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) dispatch({ type: "LOAD_SAVE", payload: JSON.parse(saved) });
    } catch {}
  }, []);

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
  return useContext(GameContext);
}
