/**
 * @file Game State Reducer
 * @description Pure reducer function that processes all game state mutations.
 * Handles all game actions: session management, scoring, conflicts, inventory, and chat.
 *
 * Game Action Categories:
 * - **Session Management**: START_SESSION, NEXT_STAGE, CLEAR_SESSION
 * - **Scoring & Performance**: ADD_SCORE, CUE_HIT, CUE_MISSED, RESOLVE_CONFLICT, COMPLETE_LEVEL
 * - **Inventory & Items**: ADD_INVENTORY, REMOVE_INVENTORY, ADD_GEAR (equipment)
 * - **Progression**: COMPLETE_QUEST, UPDATE_STRESS
 * - **Social**: ADD_CONTACT, MARK_CONTACT_READ, ADD_CHAT_MESSAGE
 * - **Persistence**: LOAD_SAVE
 *
 * Core Principle: All mutations return new state objects (immutable pattern).
 * The withSession helper ensures session-scoped updates are properly nested.
 */

import { GameAction, GameSession, GameState } from "../types/game";
import {
  createNewSession,
  getNextConflict,
  updateCounter,
} from "./reducerHelpers";

/**
 * Helper function to apply mutations only to the active game session.
 * Ensures session updates don't accidentally mutate other state branches.
 *
 * @param state - Current game state
 * @param updater - Function that receives session and returns updated session
 * @returns New game state with updated session (or unchanged if no active session)
 */
function withSession(
  state: GameState,
  updater: (session: GameSession) => GameSession,
): GameState {
  if (!state.session) return state;
  return { ...state, session: updater(state.session) };
}

/**
 * Game state reducer - processes all game actions and returns updated state.
 * This is the single source of truth for how state changes in response to events.
 *
 * @param state - Current game state
 * @param action - Action describing what state change to apply
 * @returns New game state after applying action
 */

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
        updateCounter(session, "score", action.delta || 0),
      );

    case "CUE_HIT":
      return withSession(state, (session) => {
        const updatedSession = updateCounter(session, "cuesHit", 1);
        return updateCounter(updatedSession, "score", 10);
      });

    case "CUE_MISSED":
      return withSession(state, (session) =>
        updateCounter(session, "cuesMissed", 1),
      );

    case "UPDATE_STRESS":
      return withSession(state, (session) => ({
        ...session,
        stress: Math.max(
          0,
          Math.min(100, session.stress + (action.delta || 0)),
        ),
      }));

    case "RESOLVE_CONFLICT":
      return withSession(state, (session) => {
        const updatedSession = updateCounter(
          session,
          "score",
          action.pointDelta || 0,
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
        const updatedSession = updateCounter(
          session,
          "score",
          action.pointDelta || 0,
        );

        return {
          ...updatedSession,
          completedQuests: [...updatedSession.completedQuests, action.questId],
          activeQuests: updatedSession.activeQuests.filter(
            (id) => id !== action.questId,
          ),
        };
      });

    case "COMPLETE_LEVEL": {
      const progressKey = `${action.productionId}_${action.difficulty}`;
      const existingRecord = state.progress?.[progressKey];

      const newStars = Math.max(existingRecord?.stars || 0, action.stars || 0);
      const newScore = Math.max(
        existingRecord?.score || 0,
        state.session?.score || 0,
      );

      const uniqueStories = Array.from(
        new Set([
          ...(state.unlockedStories || []),
          ...(action.unlockedStories || []),
        ]),
      );

      return {
        ...state,
        progress: {
          ...state.progress,
          [progressKey]: {
            stars: newStars,
            score: newScore,
            completed: true,
          },
        },
        unlockedStories: uniqueStories,
        session: null, // Safely clear the session since the show is over
      };
    }

    case "CLEAR_SESSION":
      return { ...state, session: null };

    case "ADD_CONTACT": {
      if (state.contacts.includes(action.contactId)) return state;
      return {
        ...state,
        contacts: [...state.contacts, action.contactId],
        unreadContacts: [...(state.unreadContacts || []), action.contactId],
      };
    }

    case "MARK_CONTACT_READ": {
      if (!state.unreadContacts?.includes(action.contactId)) return state;
      return {
        ...state,
        unreadContacts: state.unreadContacts.filter(
          (id) => id !== action.contactId,
        ),
      };
    }

    case "ADD_CHAT_MESSAGE": {
      const { contactId, message } = action;
      const history = state.chatHistory || {};
      const contactHistory = history[contactId] || [];

      const isFromPlayer = message.sender === "You";
      let unreadContacts = state.unreadContacts || [];

      if (!isFromPlayer && !unreadContacts.includes(contactId)) {
        unreadContacts = [...unreadContacts, contactId];
      }

      return {
        ...state,
        chatHistory: {
          ...history,
          [contactId]: [...contactHistory, message],
        },
        unreadContacts,
      };
    }

    default:
      return state;
  }
}
