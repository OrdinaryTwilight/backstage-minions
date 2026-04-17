export type GameStage = "equipment" | "planning" | "sound_design" | "rehearsal" | "liveshow" | "wrapup";
export type DifficultyLevel = "school" | "community" | "professional";
export type Department = "lighting" | "sound";

/** Core Game Progression Order */
export const STAGE_ORDER: GameStage[] = [
  "equipment",
  "planning",
  "sound_design",
  "rehearsal",
  "liveshow",
  "wrapup",
];

/** UI Display Labels for Stages */
export const STAGE_LABELS: Record<GameStage, string> = {
  equipment: "Load-In",
  planning: "Lighting Plot",
  sound_design: "Sound Map",
  rehearsal: "Rehearsal",
  liveshow: "Live Show",
  wrapup: "Wrap-up",
};

/** Difficulty Settings */
export const DIFFICULTIES = {
  SCHOOL: "school" as const,
  COMMUNITY: "community" as const,
  PROFESSIONAL: "professional" as const,
} as const;

export type Difficulty = typeof DIFFICULTIES[keyof typeof DIFFICULTIES];

/** Difficulty Multipliers for Cues */
export const DIFFICULTY_MODIFIERS: Record<Difficulty, number> = {
  [DIFFICULTIES.SCHOOL]: 1.0,
  [DIFFICULTIES.COMMUNITY]: 0.8,
  [DIFFICULTIES.PROFESSIONAL]: 0.6,
};

/** Initial Life Counts per Difficulty */
export const INITIAL_LIVES: Record<Difficulty, number> = {
  [DIFFICULTIES.SCHOOL]: 4,
  [DIFFICULTIES.COMMUNITY]: 3,
  [DIFFICULTIES.PROFESSIONAL]: 2,
};

/** Timing and Durations (ms) */
export const DURATIONS = {
  REHEARSAL_MS: 20000,
  LIVE_SHOW_MS: 30000,
  FEEDBACK_DELAY_MS: 1200, // Used for Wrap-up dialogue transitions
} as const;

/** Scoring and Penalties */
export const SCORING = {
  REHEARSAL_HIT: 50,
  LIVE_SHOW_HIT: 80,
  REDO_PENALTY: -50,
  EQUIPMENT_BONUS: 20,
  PLANNING_MAX: 100,
  PLANNING_PER_FIXTURE: 15,
  CONTACT_EXCHANGE_BONUS: 30,
} as const;

/** Departments */
export const DEPARTMENTS = {
  LIGHTING: "lighting" as const,
  SOUND: "sound" as const,
} as const;

/** UI Theme Constants */
export const COLORS = {
  SUCCESS: "#4ade80",
  ACCENT: "#ff40ff",
  DANGER: "#ef4444",
  WARNING: "#facc15",
  CONSOLE_BG: "#051014",
  HARDWARE_BG: "#1a1a1a",
} as const;