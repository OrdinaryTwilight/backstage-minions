import { createContext, ReactNode, useContext, useEffect, useReducer } from "react";
import { PRODUCTION_STAGES } from "../data/gameData";

interface GameSession {
  productionId: string;
  difficulty: "school" | "community" | "professional";
  characterId: string;
  stages: string[];
  currentStageIndex: number;
  gearId: string | null;
  score: number;
  lives: number;
  cuesHit: number;
  cuesMissed: number;
  plotLights: unknown[];
  conflictsSeen: string[];
}

interface LevelProgress {
  stars: number;
  completed: boolean;
}

interface GameState {
  session: GameSession | null;
  progress: Record<string, LevelProgress>;
  unlockedStories: string[];
  contacts: string[];
}

type GameAction =
  | { type: "LOAD_SAVE"; payload: Partial<GameState> }
  | {
      type: "START_SESSION";
      productionId: string;
      difficulty: "school" | "community" | "professional";
      characterId: string;
    }
  | { type: "SET_GEAR"; gearId: string }
  | { type: "NEXT_STAGE" }
  | { type: "ADD_SCORE"; delta: number }
  | { type: "LOSE_LIFE" }
  | { type: "CUE_HIT" }
  | { type: "CUE_MISSED" }
  | { type: "SET_PLOT_LIGHTS"; lights: unknown[] }
  | {
      type: "COMPLETE_LEVEL";
      productionId: string;
      difficulty: string;
      stars: number;
      unlockedStories: string[];
    }
  | { type: "CLEAR_SESSION" };

const STORAGE_KEY = "a3_backstage_save";

const initialState: GameState = {
  session: null,
  progress: {},
  unlockedStories: [],
  contacts: [],
};

function reducer(state: GameState, action: GameAction): GameState {
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
          gearId: null,
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

    case "SET_GEAR":
      return {
        ...state,
        session: state.session
          ? {
              ...state.session,
              gearId: action.gearId,
            }
          : null,
      };

    case "NEXT_STAGE":
      return {
        ...state,
        session: state.session
          ? {
              ...state.session,
              currentStageIndex: state.session.currentStageIndex + 1,
            }
          : null,
      };

    case "ADD_SCORE":
      return {
        ...state,
        session: state.session
          ? {
              ...state.session,
              score:
                (Number(state.session.score) || 0) + (Number(action.delta) || 0),
            }
          : null,
      };

    case "LOSE_LIFE":
      return {
        ...state,
        session: state.session
          ? { ...state.session, lives: state.session.lives - 1 }
          : null,
      };

    case "CUE_HIT":
      return {
        ...state,
        session: state.session
          ? { ...state.session, cuesHit: state.session.cuesHit + 1 }
          : null,
      };

    case "CUE_MISSED":
      return {
        ...state,
        session: state.session
          ? { ...state.session, cuesMissed: state.session.cuesMissed + 1 }
          : null,
      };

    case "SET_PLOT_LIGHTS":
      return {
        ...state,
        session: state.session
          ? { ...state.session, plotLights: action.lights }
          : null,
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

interface GameContextType {
  state: GameState;
  dispatch: React.Dispatch<GameAction>;
}

const GameContext = createContext<GameContextType | null>(null);

export function GameProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) dispatch({ type: "LOAD_SAVE", payload: JSON.parse(saved) });
    } catch {
      // Silently ignore parse errors
    }
  }, []);

  useEffect(() => {
    const { session: _session, ...toSave } = state;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
  }, [state]);

  return (
    <GameContext.Provider value={{ state, dispatch }}>
      {children}
    </GameContext.Provider>
  );
}

export function useGame(): GameContextType {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error("useGame must be used within a GameProvider");
  }
  return context;
}
