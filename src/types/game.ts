/**
 * Centralized Game Type Definitions
 *
 * This file serves as the single source of truth for all game-related TypeScript interfaces.
 * Import from this file instead of scattered definitions across data/gameData.ts
 */

// ============================================================================
// CHARACTER & STATS
// ============================================================================

/**
 * StatBlock: Represents character performance metrics
 * Used to determine baseline difficulty modifiers and role-specific bonuses
 */
export interface StatBlock {
  technical: number; // Ability to handle equipment (0-10)
  social: number; // Communication and networking skill (0-10)
  stamina: number; // Resistance to stress and physical fatigue (0-10)
}

/**
 * Character: Represents a playable character in the game
 * Each character has unique stats that affect gameplay difficulty and dialogue outcomes
 */
export interface Character {
  id: string;
  name: string;
  role: string;
  department:
    | "lighting"
    | "sound"
    | "stage management"
    | "carpentry"
    | "wardrobe"
    | "props"
    | "video";
  bio: string;
  icon: string;
  stats: StatBlock;
}

// ============================================================================
// CUE & TECHNICAL EXECUTION
// ============================================================================

/**
 * Cue: Represents a technical cue (lighting or sound)
 * Each cue has a target time, a tolerance window, and an optional intensity target
 *
 * @example
 * { id: "LQ 1", label: "House to Half", targetMs: 2000, windowMs: 1500, targetLevel: 50 }
 */
export interface Cue {
  id: string;
  label: string;
  targetMs: number; // Target time in milliseconds from stage start
  windowMs: number; // Acceptable timing window in milliseconds (±tolerance)
  targetLevel?: number; // Optional intensity level (0-100) for fader alignment
}

// ============================================================================
// CONFLICTS & CHOICES
// ============================================================================

/**
 * ConflictChoice: Represents a player choice in a conflict scenario
 * Players select a response strategy that affects score and story progression
 */
export interface ConflictChoice {
  id: string;
  text: string; // The choice presented to the player
  outcome: "resolved" | "neutral" | "escalated"; // Result type
  pointDelta: number; // Impact on total score
  aftermathText: string; // NPC dialogue response shown after selection
  sideEffect?: string; // Special triggers like unlocking contacts
}

/**
 * Conflict: Represents a conflict scenario in the game
 * Triggered by specific stages to test player decision-making and interpersonal skills
 */
export interface Conflict {
  id: string;
  trigger: string; // The stage that triggers this conflict (e.g., "planning", "rehearsal")
  npc: string; // Name of the character involved
  description: string; // The opening dialogue or scenario
  choices: ConflictChoice[];
}

// ============================================================================
// VENUES & PRODUCTIONS
// ============================================================================

/**
 * Venue: Represents a performance venue
 * Different venues have different technical capabilities and backstage environments
 */
export interface Venue {
  name: string;
  description: string;
}

/**
 * LevelDetails: Details about a specific difficulty level of a production
 * Tracks whether a level is unlocked and links to the venue
 */
export interface LevelDetails {
  venueId: string;
  unlocked: boolean;
}

/**
 * Production: Represents a theatrical production
 * Productions contain multiple difficulty levels, each with different challenges
 */
export interface Production {
  id: string;
  title: string;
  poster: string; // Emoji or image URL
  description: string;
  learnMoreUrl: string;
  levels: Partial<
    Record<"school" | "community" | "professional", LevelDetails>
  >;
}

// ============================================================================
// GAME SESSION & STATE MANAGEMENT
// ============================================================================

/**
 * LightPlotNode: Represents a light fixture placed on the planning grid
 * Used to track the player's lighting plot design during the planning stage
 */
export interface LightPlotNode {
  id: string;
  type: string; // 'spot', 'wash', 'led'
  gridX: number;
  gridY: number;
  intensity: number; // 0-100
  color?: string; // Optional hex color
}

/**
 * GameSession: Represents the active game session
 * Contains all mutable state during active gameplay
 */
export interface GameSession {
  productionId: string;
  difficulty: "school" | "community" | "professional";
  characterId: string;
  stages: string[];
  currentStageIndex: number;
  gearId: string | null;
  score: number;
  lives: number;
  cuesHit: number;
  cuesMissed: number;
  plotLights: LightPlotNode[];
  conflictsSeen: string[];
  activeConflict: Conflict | null;
  activeQuests: string[];
}

/**
 * LevelProgress: Tracks completion status and score for a level
 * Stored in persistent progress data
 */
export interface LevelProgress {
  stars: number;
  completed: boolean;
}

/**
 * GameState: Root state container
 * Separates active session (ephemeral) from career progress (persistent)
 */
export interface GameState {
  session: GameSession | null;
  progress: Record<string, LevelProgress>;
  unlockedStories: string[];
  contacts: string[];
  unreadContacts: string[];
  inventory: string[];
}

// ============================================================================
// GAME ACTIONS (REDUCER DISPATCH)
// ============================================================================

export type Difficulty = "school" | "community" | "professional";

// ============================================================================
// STORY & LORE
// ============================================================================

/**
 * Story: Represents a story record unlocked through game progression
 * Stories are unlocked by completing levels with sufficient stars
 */
export interface Story {
  id: string;
  title: string;
  content: string;
  unlockedBy: {
    productionId: string;
    difficulty: Difficulty;
    minStars: number;
  };
}

/**
 * GameAction: Discriminated union of all possible reducer actions
 * Each action is strictly typed with its required payload
 *
 * Action Categories:
 * - Session Lifecycle: START_SESSION, CLEAR_SESSION, NEXT_STAGE
 * - Score & Progress: ADD_SCORE, LOSE_LIFE, CUE_HIT, CUE_MISSED, COMPLETE_LEVEL
 * - Stage State: SET_GEAR, SET_PLOT_LIGHTS
 * - Conflict & Contacts: MARK_CONFLICT_SEEN, ADD_CONTACT
 * - Persistence: LOAD_SAVE
 */
export type GameAction =
  | { type: "LOAD_SAVE"; payload: Partial<GameState> }
  | {
      type: "START_SESSION";
      productionId: string;
      difficulty: Difficulty;
      characterId: string;
    }
  | { type: "SET_GEAR"; gearId: string }
  | { type: "NEXT_STAGE" }
  | { type: "ADD_SCORE"; delta: number }
  | { type: "LOSE_LIFE" }
  | { type: "CUE_HIT" }
  | { type: "CUE_MISSED" }
  | { type: "SET_PLOT_LIGHTS"; lights: LightPlotNode[] }
  | { type: "MARK_CONFLICT_SEEN"; conflictId: string }
  | { type: "RESOLVE_CONFLICT"; conflictId: string }
  | {
      type: "COMPLETE_LEVEL";
      productionId: string;
      difficulty: Difficulty;
      stars: number;
      unlockedStories: string[];
    }
  | { type: "CLEAR_SESSION" }
  | { type: "ADD_CONTACT"; contactId: string }
  | { type: "MARK_CONTACT_READ"; contactId: string }
  | { type: "ADD_QUEST"; questId: string };
