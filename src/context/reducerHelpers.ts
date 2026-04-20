// src/context/reducerHelpers.ts

import { CHARACTERS, Conflict, CONFLICTS } from "../data/gameData";
import { Difficulty, GameSession } from "../types/game";
import { generateStageSequence } from "../utils/levelFlowEngine";

/** session creation logic */
export const createNewSession = (
  productionId: string,
  difficulty: Difficulty,
  characterId: string,
): GameSession => {
  const char = CHARACTERS.find((c) => c.id === characterId);
  const dept = char?.department?.toLowerCase() || "lighting";

  const livesMap: Record<Difficulty, number> = {
    professional: 2,
    community: 3,
    school: 4,
  };

  return {
    productionId,
    difficulty,
    characterId,
    stages: generateStageSequence(dept),
    currentStageIndex: 0,
    gearId: null,
    score: 0,
    lives: livesMap[difficulty],
    cuesHit: 0,
    cuesMissed: 0,
    plotLights: [],
    conflictsSeen: [],
    activeConflict: null,
    activeQuests: [],
    completedQuests: [],
    stress: 0,
    affinities: {},
    inventory: [],
  };
};

/** Logic for determining the next random conflict */
export const getNextConflict = (session: GameSession): Conflict | null => {
  const nextIdx = session.currentStageIndex + 1;
  const nextStageKey = session.stages[nextIdx];
  const availableConflicts = CONFLICTS.filter((c) => {
    // Map stage strings to allow "rehearsal" conflicts to appear in the planning/equipment phases
    const trigger = c.trigger === "rehearsal" ? "planning" : c.trigger;
    return trigger === nextStageKey && !session.conflictsSeen.includes(c.id);
  });

  // Guarantee the conflict fires if one is available, rather than dropping 50% of them
  if (availableConflicts.length === 0) return null;

  return availableConflicts[
    Math.floor(Math.random() * availableConflicts.length)
  ];
};

/** Domain helper for session counters */
export const updateCounter = (
  session: GameSession,
  property: "score" | "cuesHit" | "cuesMissed",
  delta: number,
): GameSession => {
  return { ...session, [property]: (session[property] || 0) + delta };
};
