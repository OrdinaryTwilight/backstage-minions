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

const STORAGE_KEY = "a3_backstage_save";

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
  inventory: z.array(z.string()).catch([]),
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
  inventory: [],
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
      const savedString = localStorage.getItem(STORAGE_KEY);
      if (savedString) {
        const parsedJson = JSON.parse(savedString);

        // safeParse won't throw errors. It returns a success boolean.
        const validation = GameSaveSchema.safeParse(parsedJson);

        if (validation.success) {
          dispatch({ type: "LOAD_SAVE", payload: validation.data });
        } else {
          console.warn("Save file root structure is invalid. Starting fresh.");
        }
      }
    } catch (error) {
      console.error("Failed to parse localStorage data:", error);
    }
  }, []);

  // --- UPDATE: Debounced Persistent Saving ---
  useEffect(() => {
    // Debounce timer: wait 1 second after the last state change to save
    const handler = setTimeout(() => {
      // Strip out the ephemeral session data; keep the rest
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { session, ...persistentState } = state;

      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(persistentState));
      } catch (error) {
        console.error("Failed to write to localStorage:", error);
      }
    }, 1000);

    // Cleanup: If state changes again within 1 second, clear the previous timer
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
