/**
 * @file Game Session Reducer Helpers
 * @description Pure helper functions for creating and updating game sessions.
 * These functions encapsulate the core game logic for session initialization,
 * conflict generation, and counter management.
 */

import { CHARACTERS, Conflict, CONFLICTS } from "../data/gameData";
import { Difficulty, GameSession } from "../types/game";
import { generateStageSequence } from "../utils/levelFlowEngine";

/**
 * Creates a new game session for a given production and character.
 * Initializes all session state: stages, lives, score, stress, conflicts tracking, etc.
 * 
 * Session initialization process:
 * 1. Determine department from selected character
 * 2. Generate stage sequence based on department (e.g., lighting -> planning + cue_execution)
 * 3. Set lives based on difficulty (professional=2, community=3, school=4)
 * 4. Initialize empty counters: score=0, cuesHit=0, stress=0, etc.
 * 
 * @param productionId - ID of the production being played
 * @param difficulty - Selected difficulty level (affects lives, stage sequence, scoring)
 * @param characterId - Selected playable character
 * @returns Complete initialized GameSession ready to start gameplay
 */
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

/**
 * Selects the next random conflict for the upcoming stage.
 * 
 * Conflict Selection Logic:
 * 1. Look at the NEXT stage in the sequence (not current)
 * 2. Filter available conflicts by stage trigger
 * 3. Exclude conflicts already seen in this session (no repeats)
 * 4. Special case: "rehearsal" conflicts can appear in planning/equipment phases
 * 5. Pick randomly from available conflicts (guarantees at least one if available)
 * 
 * Game Mechanic: Conflicts are story/dialogue moments that interrupt gameplay,
 * allowing players to make choices that affect stress and score.
 * 
 * @param session - Current game session
 * @returns Next conflict to display, or null if no conflicts available for next stage
 */
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

/**
 * Helper to increment or add to a numeric counter in the session.
 * Used for score, cuesHit, cuesMissed tracking during gameplay.
 * 
 * @param session - Current game session
 * @param property - Which counter to update (score, cuesHit, or cuesMissed)
 * @param delta - Amount to add (can be negative for score penalties)
 * @returns New session object with updated counter
 */
export const updateCounter = (
  session: GameSession,
  property: "score" | "cuesHit" | "cuesMissed",
  delta: number,
): GameSession => {
  return { ...session, [property]: (session[property] || 0) + delta };
};
