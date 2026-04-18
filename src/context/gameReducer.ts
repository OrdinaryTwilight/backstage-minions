import { CHARACTERS, Conflict, CONFLICTS } from "../data/gameData";
import { GameAction, GameState } from "../types/game";
import { generateStageSequence } from "../utils/levelFlowEngine";
const getLivesForDifficulty = (difficulty: string): number => {
  if (difficulty === "professional") return 2;
  if (difficulty === "community") return 3;
  return 4;
};

const createNewSession = (
  action: GameAction & { type: "START_SESSION" },
): GameState["session"] => {
  const char = CHARACTERS.find((c) => c.id === action.characterId);
  const dept = char?.department?.toLowerCase() || "lighting";
  return {
    productionId: action.productionId,
    difficulty: action.difficulty,
    characterId: action.characterId,

    // USE THE ENGINE HERE!
    stages: generateStageSequence(dept),

    currentStageIndex: 0,
    gearId: null,
    score: 0,
    lives: getLivesForDifficulty(action.difficulty),
    cuesHit: 0,
    cuesMissed: 0,
    plotLights: [],
    conflictsSeen: [],
    activeConflict: null,
    activeQuests: [],
    stress: 0,
    affinities: {},
  };
};

const getNextConflict = (session: GameState["session"]): Conflict | null => {
  if (!session) return null;
  const nextIdx = session.currentStageIndex + 1;
  const nextStageKey = session.stages[nextIdx];
  const availableConflicts = CONFLICTS.filter(
    (c) => c.trigger === nextStageKey && !session.conflictsSeen.includes(c.id),
  );
  if (availableConflicts.length === 0 || Math.random() <= 0.5) return null;
  return availableConflicts[
    Math.floor(Math.random() * availableConflicts.length)
  ];
};

const addToSessionCounter = (
  session: GameState["session"],
  property: "score" | "cuesHit" | "cuesMissed",
  delta: number,
): GameState["session"] => {
  if (!session) return null;
  return { ...session, [property]: (Number(session[property]) || 0) + delta };
};

export function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case "LOAD_SAVE":
      return { ...state, ...action.payload };
    case "START_SESSION":
      return {
        ...state,
        session: createNewSession(
          action as GameAction & { type: "START_SESSION" },
        ),
      };
    case "SET_GEAR":
      return {
        ...state,
        session: state.session
          ? { ...state.session, gearId: action.gearId }
          : null,
      };
    case "NEXT_STAGE":
      if (!state.session) return state;
      return {
        ...state,
        session: {
          ...state.session,
          currentStageIndex: state.session.currentStageIndex + 1,
          activeConflict: getNextConflict(state.session),
        },
      };
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
      return {
        ...state,
        progress: {
          ...state.progress,
          [key]: {
            stars: Math.max(state.progress[key]?.stars ?? 0, action.stars),
            completed: true,
          },
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
    case "ADD_QUEST":
      return {
        ...state,
        session: state.session
          ? {
              ...state.session,
              activeQuests: [...state.session.activeQuests, action.questId],
            }
          : null,
      };
    case "UPDATE_STRESS": {
      if (!state.session) return state;
      return {
        ...state,
        session: {
          ...state.session,
          // Clamp stress between 0 and 100
          stress: Math.max(
            0,
            Math.min(100, state.session.stress + action.delta),
          ),
        },
      };
    }

    case "UPDATE_AFFINITY": {
      if (!state.session) return state;
      return {
        ...state,
        session: {
          ...state.session,
          affinities: {
            ...state.session.affinities,
            [action.npcId]:
              (state.session.affinities[action.npcId] || 0) + action.delta,
          },
        },
      };
    }

    case "CLEAR_SESSION":
      return { ...state, session: null };
    default:
      return state;
  }
}
