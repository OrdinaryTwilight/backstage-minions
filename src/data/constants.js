// src/data/constants.js

export const STAGE_ORDER = ["planning", "rehearsal", "liveshow", "wrapup"];

export const STAGE_LABELS = {
  planning: "Planning",
  rehearsal: "Rehearsal",
  liveshow: "Live Show",
  wrapup: "Wrap-up",
};

export const DURATIONS = {
  REHEARSAL_MS: 20000,
  LIVE_SHOW_MS: 30000,
};

export const SCORING = {
  REHEARSAL_HIT: 50,
  LIVE_SHOW_HIT: 80,
  REDO_PENALTY: -50,
  PLANNING_MAX: 100,
  PLANNING_PER_FIXTURE: 15,
};