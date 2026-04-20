// src/context/gameReducer.ts
import { GameAction, GameSession, GameState } from "../types/game";
import {
  createNewSession,
  getNextConflict,
  updateCounter,
} from "./reducerHelpers";

/** Helper to reduce cognitive complexity by abstracting the session null-check */
function withSession(
  state: GameState,
  updater: (session: GameSession) => GameSession,
): GameState {
  if (!state.session) return state;
  return { ...state, session: updater(state.session) };
}

export function gameReducer(state: GameState, action: GameAction): GameState {
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
      return withSession(state, (session) => ({
        ...session,
        currentStageIndex: session.currentStageIndex + 1,
        activeConflict: getNextConflict(session),
      }));

    case "ADD_SCORE":
      return withSession(state, (session) =>
        updateCounter(session, "score", action.delta),
      );

    case "CUE_HIT":
      return withSession(state, (session) => {
        // 1. Increment cues hit
        const updatedSession = updateCounter(session, "cuesHit", 1);
        // 2. Add points to the total score (e.g., 10 points per cue)
        return updateCounter(updatedSession, "score", 10);
      });

    case "CUE_MISSED":
      return withSession(state, (session) =>
        updateCounter(session, "cuesMissed", 1),
      );

    case "UPDATE_STRESS":
      return withSession(state, (session) => ({
        ...session,
        stress: Math.max(0, Math.min(100, session.stress + action.delta)),
      }));

    case "RESOLVE_CONFLICT":
      return withSession(state, (session) => {
        // Apply the score earned from the selected dialogue outcome
        const updatedSession = updateCounter(
          session,
          "score",
          action.pointDelta,
        );

        return {
          ...updatedSession,
          activeConflict: null,
          conflictsSeen: [...updatedSession.conflictsSeen, action.conflictId],
        };
      });

    case "ADD_INVENTORY":
      return withSession(state, (session) => ({
        ...session,
        inventory: [...session.inventory, action.item],
      }));

    case "REMOVE_INVENTORY":
      return withSession(state, (session) => ({
        ...session,
        inventory: session.inventory.filter((i) => i !== action.item),
      }));

    case "COMPLETE_QUEST":
      return withSession(state, (session) => {
        // Award points for completing the overworld quest
        const updatedSession = updateCounter(
          session,
          "score",
          action.pointDelta,
        );

        return {
          ...updatedSession,
          completedQuests: [...updatedSession.completedQuests, action.questId],
        };
      });

    case "CLEAR_SESSION":
      return { ...state, session: null };

    default:
      return state;
  }
}
