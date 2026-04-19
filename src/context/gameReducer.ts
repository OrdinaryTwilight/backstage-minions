// src/context/gameReducer.ts
import { GameAction, GameState } from "../types/game";
import {
  createNewSession,
  getNextConflict,
  updateCounter,
} from "./reducerHelpers";

export function gameReducer(state: GameState, action: GameAction): GameState {
  // session is used in many cases, extracted for cleaner access
  const session = state.session;

  switch (action.type) {
    case "LOAD_SAVE":
      return { ...state, ...action.payload };

    case "START_SESSION":
      return {
        ...state,
        session: createNewSession(
          action.productionId,
          action.difficulty,
          action.characterId,
        ),
      };

    case "NEXT_STAGE":
      if (!session) return state;
      return {
        ...state,
        session: {
          ...session,
          currentStageIndex: session.currentStageIndex + 1,
          activeConflict: getNextConflict(session),
        },
      };

    case "ADD_SCORE":
      return {
        ...state,
        session: updateCounter(session, "score", action.delta),
      };

    case "CUE_HIT": {
      // 1. Increment cues hit
      const updatedSession = updateCounter(session, "cuesHit", 1);
      // 2. Add points to the total score (e.g., 10 points per cue)
      return {
        ...state,
        session: updateCounter(updatedSession, "score", 10),
      };
    }

    case "CUE_MISSED":
      return { ...state, session: updateCounter(session, "cuesMissed", 1) };

    case "UPDATE_STRESS":
      if (!session) return state;
      return {
        ...state,
        session: {
          ...session,
          stress: Math.max(0, Math.min(100, session.stress + action.delta)),
        },
      };

    case "RESOLVE_CONFLICT":
      if (!session) return state;
      return {
        ...state,
        session: {
          ...session,
          activeConflict: null,
          conflictsSeen: [...session.conflictsSeen, action.conflictId],
        },
      };

    case "CLEAR_SESSION":
      return { ...state, session: null };

    default:
      return state;
  }
}
