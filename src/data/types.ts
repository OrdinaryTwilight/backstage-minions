/**
 * StatBlock - Represents character statistics
 */
export interface StatBlock {
  technical: number; // Ability to handle equipment
  social: number; // Communication and networking skill
  stamina: number; // Resistance to stress and physical fatigue
}

/**
 * Character - Represents a playable character in the game
 */
export interface Character {
  id: string;
  name: string;
  role: string;
  department: "lighting" | "sound";
  bio: string;
  icon: string;
  stats: StatBlock;
}

/**
 * Cue - Represents a technical cue (lighting or sound)
 */
export interface Cue {
  id: string;
  label: string;
  targetMs: number; // Target time in milliseconds
  windowMs: number; // Acceptable timing window in milliseconds
  targetLevel?: number; // Optional intensity level (0-100)
}

/**
 * ConflictChoice - Represents a choice in a conflict scenario
 */
export interface ConflictChoice {
  id: string;
  text: string; // The choice presented to the player
  outcome: "resolved" | "neutral" | "escalated";
  pointDelta: number; // Impact on total score
  aftermathText: string; // NPC dialogue response shown after selection
  sideEffect?: string; // Special triggers like unlocking contacts
}

/**
 * Conflict - Represents a conflict scenario in the game
 */
export interface Conflict {
  id: string;
  trigger: string; // The stage that triggers this conflict
  npc: string; // Name of the character involved
  description: string; // The opening dialogue or scenario
  choices: ConflictChoice[];
}

/**
 * Venue - Represents a performance venue
 */
export interface Venue {
  name: string;
  description: string;
}

/**
 * LevelDetails - Details about a specific difficulty level of a production
 */
export interface LevelDetails {
  venueId: string;
  unlocked: boolean;
}

/**
 * Production - Represents a theatrical production
 */
export interface Production {
  id: string;
  title: string;
  poster: string;
  description: string;
  learnMoreUrl: string;
  levels: Partial<
    Record<"school" | "community" | "professional", LevelDetails>
  >;
}

export interface ZoneConfig {
  x: number;
  y: number;
  w: number;
  h: number;
  label: string;
  color: string;
  isSolid: boolean;
  targetDept?: string;
  dialogue?: any;
  dialogues?: any[];
  isDoor?: string;
}
