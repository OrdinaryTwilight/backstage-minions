/**
 * @typedef {('planning'|'rehearsal'|'liveshow'|'wrapup')} GameStage
 * @typedef {('school'|'community'|'professional')} DifficultyLevel
 */

/** * Core Game Progression Order
 * @type {GameStage[]} 
 */
export const STAGE_ORDER = ["planning", "rehearsal", "liveshow", "wrapup"];

/** * UI Display Labels for Stages
 * @type {Object.<GameStage, string>} 
 */
export const STAGE_LABELS = {
  planning: "Planning",
  rehearsal: "Rehearsal",
  liveshow: "Live Show",
  wrapup: "Wrap-up",
};

/** * Difficulty Settings 
 * Defined here to ensure consistency across Level Selection and Game Logic
 */
export const DIFFICULTIES = {
  SCHOOL: "school",
  COMMUNITY: "community",
  PROFESSIONAL: "professional",
};

/**
 * Difficulty Multipliers for Cues
 * Used to shrink timing windows as difficulty increases
 */
export const DIFFICULTY_MODIFIERS = {
  [DIFFICULTIES.SCHOOL]: 1.0,
  [DIFFICULTIES.COMMUNITY]: 0.8,
  [DIFFICULTIES.PROFESSIONAL]: 0.6,
};

/** * Initial Life Counts per Difficulty
 */
export const INITIAL_LIVES = {
  [DIFFICULTIES.SCHOOL]: 4,
  [DIFFICULTIES.COMMUNITY]: 3,
  [DIFFICULTIES.PROFESSIONAL]: 2,
};

/** * Timing and Durations (ms)
 */
export const DURATIONS = {
  REHEARSAL_MS: 20000,
  LIVE_SHOW_MS: 30000,
  FEEDBACK_DELAY_MS: 1200, // Used for Wrap-up dialogue transitions
};

/** * Scoring and Penalties
 */
export const SCORING = {
  REHEARSAL_HIT: 50,
  LIVE_SHOW_HIT: 80,
  REDO_PENALTY: -50,
  PLANNING_MAX: 100,
  PLANNING_PER_FIXTURE: 15,
  CONTACT_EXCHANGE_BONUS: 30,
};

/** * Departments
 */
export const DEPARTMENTS = {
  LIGHTING: "lighting",
  SOUND: "sound",
};

/**
 * UI Theme Constants
 * Useful for the dynamic "Master Go" button and Stage Preview
 */
export const COLORS = {
  SUCCESS: "#4ade80",
  ACCENT: "#ff40ff",
  DANGER: "#ef4444",
  WARNING: "#facc15",
  CONSOLE_BG: "#051014",
  HARDWARE_BG: "#1a1a1a",
};