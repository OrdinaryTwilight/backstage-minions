import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useReducer,
} from "react";
import { z } from "zod";
import { GameAction, GameState } from "../types/game";
import { gameReducer } from "./gameReducer";

const LOCAL_STORAGE_KEY = "a3_backstage_save";
const SESSION_STORAGE_KEY = "a3_backstage_active_run";

// ----------------------------------------------------------------------------
// 1. Zod Schemas for Validation
// Using .catch() ensures that if a specific property is missing from an older
// save file, it recovers gracefully using defaults instead of wiping the save.
// ----------------------------------------------------------------------------
const LevelProgressSchema = z.object({
  stars: z.number().catch(0),
  completed: z.boolean().catch(false),
});

const GameSaveSchema = z.object({
  progress: z.record(z.string(), LevelProgressSchema).catch({}),
  unlockedStories: z.array(z.string()).catch([]),
  contacts: z.array(z.string()).catch(["char_ben", "char_casey", "sys_comms"]),
  unreadContacts: z.array(z.string()).catch(["sys_comms"]),
});

// ----------------------------------------------------------------------------
// 2. Initial State & Context Setup
// ----------------------------------------------------------------------------
const initialState: GameState = {
  session: null,
  progress: {},
  unlockedStories: [],
  contacts: ["char_ben", "char_casey", "sys_comms"],
  unreadContacts: ["sys_comms"],
};

interface GameContextType {
  state: GameState;
  dispatch: React.Dispatch<GameAction>;
}

export const GameContext = createContext<GameContextType | null>(null);

// ----------------------------------------------------------------------------
// 3. Provider Component
// ----------------------------------------------------------------------------
export function GameProvider({ children }: { readonly children: ReactNode }) {
  const [state, dispatch] = useReducer(gameReducer, initialState);

  // --- MOUNT: Load & Validate Save Data ---
  useEffect(() => {
    try {
      let loadedState: Partial<GameState> = {};

      // 1. Load Career Progress (Local Storage)
      const localString = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (localString) {
        const parsedJson = JSON.parse(localString);
        const validation = GameSaveSchema.safeParse(parsedJson);

        if (validation.success) {
          loadedState = { ...validation.data };
        } else {
          console.warn("Save file root structure is invalid. Starting fresh.");
        }
      }

      // 2. Load Active Run (Session Storage)
      const sessionString = sessionStorage.getItem(SESSION_STORAGE_KEY);
      if (sessionString) {
        // Ephemeral data doesn't strictly need Zod validation since it clears on tab close,
        // but wrapping it in try/catch prevents a corrupted string from crashing the load.
        loadedState.session = JSON.parse(sessionString);
      }

      // 3. Dispatch Combined State
      if (Object.keys(loadedState).length > 0) {
        dispatch({ type: "LOAD_SAVE", payload: loadedState });
      }
    } catch (error) {
      console.error("Failed to parse storage data:", error);
    }
  }, []);

  // --- UPDATE: Debounced Persistent Saving ---
  useEffect(() => {
    const handler = setTimeout(() => {
      const { session, ...persistentState } = state;

      try {
        // 1. Save Career Progress
        localStorage.setItem(
          LOCAL_STORAGE_KEY,
          JSON.stringify(persistentState),
        );

        // 2. Save Active Run
        if (session) {
          sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
        } else {
          // Clean up session storage if the session was cleared (e.g., returning to main menu)
          sessionStorage.removeItem(SESSION_STORAGE_KEY);
        }
      } catch (error) {
        console.error("Failed to write to storage:", error);
      }
    }, 1000);

    return () => {
      clearTimeout(handler);
    };
  }, [state]);

  const value = useMemo(() => ({ state, dispatch }), [state, dispatch]);

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}

export function useGame(): GameContextType {
  const context = useContext(GameContext);
  if (!context) throw new Error("useGame must be used within a GameProvider");
  return context;
}
