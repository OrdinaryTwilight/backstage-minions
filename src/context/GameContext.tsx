/**
 * @file Game State Management Context
 * @description Provides centralized state management for the entire game.
 * Manages persistent game progress (save/load), active game sessions, and UI state.
 * Uses React Context + Reducer pattern with localStorage/sessionStorage for data persistence.
 *
 * Game Flow:
 * - Persistent state: level progress, character unlocks, chat history (localStorage)
 * - Session state: current run data, score, conflicts, stress levels (sessionStorage)
 * - On load: migrates old save data IDs, injects new contacts into existing saves
 * - On change: auto-saves state with 1s debounce
 */

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

/** LocalStorage key for persistent progress (levels, contacts, chat history) */
const LOCAL_STORAGE_KEY = "a3_backstage_save";
/** SessionStorage key for active game session (current run, score, conflicts) */
const SESSION_STORAGE_KEY = "a3_backstage_active_run";

/**
 * Migration map for backward compatibility with old save files.
 * Silently converts deprecated character/NPC IDs from previous versions to current IDs.
 * This ensures players' old saves continue to work after character roster updates.
 */
const ID_MIGRATIONS: Record<string, string> = {
  char_ben: "char_shane",
  char_alex: "char_wynn",
  char_jordan: "char_zen",
  char_maya: "char_lia",
  char_tara: "char_karishma",
  char_dante: "char_sylvester",
  char_chloe: "char_angel",
  char_marcus: "char_richmond",
  char_zoe: "char_jay",
  char_owen: "char_shaun",
  char_fiona: "char_jasper",
  npc_mateo: "npc_bryan",
  npc_arthur: "npc_yg",
  npc_jd: "npc_elara",
};

/**
 * Migrates old character/NPC IDs to current IDs for save data compatibility.
 * @param ids - Array of IDs from old save file
 * @returns Array of migrated IDs (old IDs converted, unchanged IDs passed through)
 */
export const migrateIds = (ids: string[]) =>
  ids.map((id) => ID_MIGRATIONS[id] || id);

const LevelProgressSchema = z.object({
  stars: z.number().catch(0),
  completed: z.boolean().catch(false),
});

const ChatMessageSchema = z.object({
  sender: z.string(),
  text: z.string(),
});

export const GameSaveSchema = z.object({
  progress: z.record(z.string(), LevelProgressSchema).catch({}),
  unlockedStories: z.array(z.string()).catch([]),
  contacts: z
    .array(z.string())
    .catch(["sys_comms", "group_official", "group_tech_survivors"]),
  unreadContacts: z
    .array(z.string())
    .catch(["sys_comms", "group_official", "group_tech_survivors"]),
  chatHistory: z.record(z.string(), z.array(ChatMessageSchema)).catch({}),
  hasSeenIntro: z.boolean().catch(false),
});

const initialState: GameState = {
  session: null,
  progress: {},
  unlockedStories: [],
  contacts: ["sys_comms", "group_official", "group_tech_survivors"],
  unreadContacts: ["sys_comms", "group_official", "group_tech_survivors"],
  chatHistory: {},
  hasSeenIntro: false,
};

/** Type definition for the Game Context value */
interface GameContextType {
  /** Current complete game state (progress, session, chat history, etc.) */
  state: GameState;
  /** Dispatch function to trigger state updates via gameReducer */
  dispatch: React.Dispatch<GameAction>;
}

/** React Context for game state - use useGame() hook to access */
export const GameContext = createContext<GameContextType | null>(null);

/**
 * GameProvider Component
 * Wraps the app with game state context. Initializes state from storage and auto-saves on changes.
 *
 * Responsibilities:
 * - Load saved progress from localStorage (if exists)
 * - Load active session from sessionStorage (if exists)
 * - Migrate old save data to current format
 * - Auto-save state changes (with debounce)
 * - Inject new default contacts into existing saves
 *
 * @param props - React component props
 * @param props.children - Child components that will access game state via useGame()
 * @returns Provider component wrapping children with game context
 */
export function GameProvider({ children }: { readonly children: ReactNode }) {
  const [state, dispatch] = useReducer(gameReducer, initialState);

  useEffect(() => {
    try {
      let loadedState: Partial<GameState> = {};

      const localString = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (localString) {
        const parsedJson = JSON.parse(localString);
        const validation = GameSaveSchema.safeParse(parsedJson);

        if (validation.success) {
          loadedState = { ...validation.data };

          if (loadedState.contacts) {
            // Keep track of the raw loaded contacts to know if we are injecting new ones
            const oldContacts = new Set(loadedState.contacts);

            // 1. Apply ID Migrations
            loadedState.contacts = migrateIds(loadedState.contacts);

            loadedState.unreadContacts ??= [];
            loadedState.unreadContacts = migrateIds(loadedState.unreadContacts);

            // 2. UX/LOGIC FIX: Retroactively inject the new default group chats into existing saves!
            const defaultContacts = [
              "sys_comms",
              "group_official",
              "group_tech_survivors",
            ];

            defaultContacts.forEach((c) => {
              if (!loadedState.contacts!.includes(c)) {
                loadedState.contacts!.push(c);
              }
              // If they didn't have it in their old save, give them a notification dot for it!
              if (
                !oldContacts.has(c) &&
                !loadedState.unreadContacts!.includes(c)
              ) {
                loadedState.unreadContacts!.push(c);
              }
            });
          }
        } else {
          console.warn("Save file root structure is invalid. Starting fresh.");
        }
      }

      const sessionString = sessionStorage.getItem(SESSION_STORAGE_KEY);
      if (sessionString) {
        loadedState.session = JSON.parse(sessionString);
      }

      if (Object.keys(loadedState).length > 0) {
        dispatch({ type: "LOAD_SAVE", payload: loadedState });
      }
    } catch (error) {
      console.error("Failed to parse storage data:", error);
    }
  }, []);

  useEffect(() => {
    const handler = setTimeout(() => {
      const { session, ...persistentState } = state;

      try {
        localStorage.setItem(
          LOCAL_STORAGE_KEY,
          JSON.stringify(persistentState),
        );
        if (session) {
          sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
        } else {
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

/**
 * Custom hook to access game state and dispatch within any component.
 * Must be used inside a GameProvider.
 *
 * @returns Object with current state and dispatch function
 * @throws Error if used outside of GameProvider
 * @example
 * const { state, dispatch } = useGame();
 * dispatch({ type: 'START_SESSION', productionId: 'prod_1', ... });
 */
export function useGame(): GameContextType {
  const context = useContext(GameContext);
  if (!context) throw new Error("useGame must be used within a GameProvider");
  return context;
}
