import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useReducer,
} from "react";
import { CONFLICTS, PRODUCTION_STAGES } from "../data/gameData";
import { Conflict, GameAction, GameState } from "../types/game";

/**
 * GameContext: Central state management for active gameplay
 *
 * Manages:
 * - Active game sessions (production, difficulty, character, score, progress)
 * - Career progress (completed levels, stars earned, unlocked content)
 * - Persistent data (saved games, contact list, story unlocks)
 *
 * Usage:
 * ```tsx
 * const { state, dispatch } = useGame();
 * dispatch({ type: "ADD_SCORE", delta: 10 });
 * ```
 */

const STORAGE_KEY = "a3_backstage_save";

const initialState: GameState = {
  session: null,
  progress: {},
  unlockedStories: [],
  contacts: [],
  unreadContacts: [],
};

/**
 * Reducer: Core game state machine
 *
 * ACTION REFERENCE:
 *
 * Session Lifecycle:
 * - START_SESSION(productionId, difficulty, characterId)
 *   Initializes a new game session with production/character selection.
 *   Sets initial lives based on difficulty (professional=2, community=3, school=4).
 *   Loads stage sequence from PRODUCTION_STAGES.
 *
 * - NEXT_STAGE()
 *   Advances currentStageIndex by 1. Called when player completes a stage.
 *   Stage mapping is defined in STAGE_COMPONENTS (GameLevelPage).
 *
 * - COMPLETE_LEVEL(productionId, difficulty, stars, unlockedStories)
 *   Marks a level complete and stores star rating (1-3).
 *   Stars are maximized (never decreased) to preserve best scores.
 *   Unlocks new stories for later viewing.
 *
 * - CLEAR_SESSION()
 *   Destroys active session (used on game-over or main menu return).
 *
 * Scoring & Progress:
 * - ADD_SCORE(delta: number)
 *   Increments total score by delta. Called after successful cues, planning, etc.
 *   Used by: CueExecutionStage (+10 per hit), PlanningStage (+5 per fixture), etc.
 *
 * - CUE_HIT()
 *   Increments cuesHit counter. Tracked separately for statistics/end-level screen.
 *   Used by: CueExecutionStage when checkFaderAlignment() returns true.
 *
 * - CUE_MISSED()
 *   Increments cuesMissed counter. Inverse of CUE_HIT for hit rate calculation.
 *   Used by: CueExecutionStage when checkFaderAlignment() returns false.
 *
 * - LOSE_LIFE()
 *   Decrements lives by 1. Game over when lives reach 0.
 *   Triggered by: Failed conflicts, missed cues in extreme cases, etc.
 *
 * Stage State Management:
 * - SET_GEAR(gearId: string)
 *   Stores selected gear ID for equipment planning stage.
 *   Used by: EquipmentStage to track player selection.
 *
 * - SET_PLOT_LIGHTS(lights: LightPlotNode[])
 *   Stores the lighting plot grid state from PlanningStage.
 *   Used by: PlanningStage upon submission, persisted in progress tracking.
 *
 * Persistence:
 * - LOAD_SAVE(payload: Partial<GameState>)
 *   Merges saved game state (from localStorage) into current state.
 *   Used on app mount to restore previous session or career progress.
 */

const getLivesForDifficulty = (difficulty: string): number => {
  if (difficulty === "professional") return 2;
  if (difficulty === "community") return 3;
  return 4;
};

const createNewSession = (
  action: GameAction & { type: "START_SESSION" },
): GameState["session"] => {
  return {
    productionId: action.productionId,
    difficulty: action.difficulty,
    characterId: action.characterId,
    stages: PRODUCTION_STAGES,
    currentStageIndex: 0,
    gearId: null,
    score: 0,
    lives: getLivesForDifficulty(action.difficulty),
    cuesHit: 0,
    cuesMissed: 0,
    plotLights: [],
    conflictsSeen: [],
    activeConflict: null,
  };
};

const getNextConflict = (session: GameState["session"]): Conflict | null => {
  if (!session) return null;
  const nextIdx = session.currentStageIndex + 1;
  const nextStageKey = session.stages[nextIdx];

  const availableConflicts = CONFLICTS.filter(
    (c) => c.trigger === nextStageKey && !session.conflictsSeen.includes(c.id),
  );

  if (availableConflicts.length === 0 || Math.random() <= 0.5) {
    return null;
  }

  const randIndex = Math.floor(Math.random() * availableConflicts.length);
  return availableConflicts[randIndex];
};

const addToSessionCounter = (
  session: GameState["session"],
  property: "score" | "cuesHit" | "cuesMissed",
  delta: number,
): GameState["session"] => {
  if (!session) return null;
  const current = session[property];
  return {
    ...session,
    [property]: (Number(current) || 0) + delta,
  };
};

function reducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case "LOAD_SAVE":
      return { ...state, ...action.payload };

    case "START_SESSION": {
      return {
        ...state,
        session: createNewSession(
          action as GameAction & { type: "START_SESSION" },
        ),
      };
    }

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

    case "NEXT_STAGE": {
      if (!state.session) return state;
      const nextIdx = state.session.currentStageIndex + 1;
      return {
        ...state,
        session: {
          ...state.session,
          currentStageIndex: nextIdx,
          activeConflict: getNextConflict(state.session),
        },
      };
    }

    case "ADD_SCORE":
      return {
        ...state,
        session: addToSessionCounter(
          state.session,
          "score",
          Number(action.delta) || 0,
        ),
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
        session: addToSessionCounter(state.session, "cuesHit", 1),
      };

    case "CUE_MISSED":
      return {
        ...state,
        session: addToSessionCounter(state.session, "cuesMissed", 1),
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

    case "MARK_CONFLICT_SEEN":
      return {
        ...state,
        session: state.session
          ? {
              ...state.session,
              conflictsSeen: [
                ...state.session.conflictsSeen,
                action.conflictId,
              ],
            }
          : null,
      };

    case "RESOLVE_CONFLICT":
      return {
        ...state,
        session: state.session
          ? {
              ...state.session,
              activeConflict: null,
              conflictsSeen: [
                ...state.session.conflictsSeen,
                action.conflictId,
              ],
            }
          : null,
      };

    case "ADD_CONTACT":
      if (state.contacts.includes(action.contactId)) return state;
      return {
        ...state,
        contacts: [...state.contacts, action.contactId],
        unreadContacts: [...state.unreadContacts, action.contactId],
      };

    case "MARK_CONTACT_READ":
      return {
        ...state,
        unreadContacts: state.unreadContacts.filter(
          (id) => id !== action.contactId,
        ),
      };
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

export function GameProvider({ children }: { readonly children: ReactNode }) {
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

  const value = useMemo(() => ({ state, dispatch }), [state, dispatch]);

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}

export function useGame(): GameContextType {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error("useGame must be used within a GameProvider");
  }
  return context;
}
