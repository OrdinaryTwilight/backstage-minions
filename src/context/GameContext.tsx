import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useReducer,
} from "react";
import { GameAction, GameState } from "../types/game";
import { gameReducer } from "./gameReducer";

const STORAGE_KEY = "a3_backstage_save";

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

export function GameProvider({ children }: { readonly children: ReactNode }) {
  const [state, dispatch] = useReducer(gameReducer, initialState);

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
  if (!context) throw new Error("useGame must be used within a GameProvider");
  return context;
}
