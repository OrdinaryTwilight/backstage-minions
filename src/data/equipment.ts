/**
 * @file Equipment Configuration
 * @description Game stage constants and equipment definitions.
 *
 * Equipment System:
 * - **Gear Packages**: Player selects equipment at start, affects difficulty (wider/narrower cue windows)
 * - **Light Types**: Different stage lighting fixture types with unique visual representation
 * - **Audio Types**: Different audio/sound equipment with unique mechanics
 * - **Planning Grid**: Grid layout for Planning stage lighting plot exercise
 * - **Console Config**: Audio console channel/bus configuration for Sound Design stage
 *
 * Mechanics:
 * - Premium gear: Easier (wider windows, but costly)
 * - Budget gear: Harder (narrower windows, less reliable)
 * - Equipment choice affects entire session difficulty multiplier
 */

// --- PLANNING STAGE CONSTANTS ---
/**
 * Planning stage grid dimensions for lighting plot exercise.
 * Players arrange light fixtures in a grid representing stage positions.
 */
export const PLOT_GRID_COLS = 5;
export const PLOT_GRID_ROWS = 3;

/**
 * Available stage lighting fixture types.
 * Each type has unique properties and represents different technical functions.
 * Used in Planning and Cue Execution stages for visual feedback.
 */
export const LIGHT_TYPES = [
  { id: "spot", label: "Spotlight", color: "#fef08a", icon: "🔦" },
  { id: "wash", label: "Wash", color: "#38bdf8", icon: "💡" },
  { id: "led", label: "LED Par", color: "#f472b6", icon: "🚥" },
];

/**
 * Available audio equipment types.
 * Each type represents different audio routing and mixing challenges.
 * Used in Sound Design stage for selecting audio patching configuration.
 */
export const AUDIO_TYPES = [
  { id: "mic", label: "Wireless Mic", color: "#f87171", icon: "🎙️" },
  { id: "speaker", label: "Foldback", color: "#60a5fa", icon: "🔊" },
  { id: "di", label: "DI Box", color: "#a78bfa", icon: "📥" },
];

/**
 * Equipment packages available for selection at game start.
 * Affects cue window multiplier (difficulty) and scoring bonus/penalty.
 * - Budget: Harder (0.8x multiplier, +50 bonus for challenge)
 * - Standard: Normal difficulty (1.0x multiplier)
 * - Premium: Easier (1.2x multiplier, -50 cost penalty)
 */
export const GEAR_PACKAGES = [
  {
    id: "budget",
    label: "Community Surplus",
    description: "Old analog gear. Faders are sticky and comms are crackly.",
    multiplier: 0.8, // Harder: smaller hit windows
    bonus: 50,
  },
  {
    id: "standard",
    label: "Rental House Pro",
    description:
      "Solid, reliable digital equipment. Standard industry windows.",
    multiplier: 1,
    bonus: 0,
  },
  {
    id: "premium",
    label: "State-of-the-Art",
    description: "Brand new grandMA3/CL5. Silky smooth response.",
    multiplier: 1.2, // Easier: wider hit windows
    bonus: -50, // Cost of luxury
  },
];

export const SOUND_CONSOLE_CONFIG = {
  sources: ["Vocals 1", "Vocals 2", "Pit Orchestra", "SFX Playback"],
  channels: [1, 2, 3, 4, 5],
  outputBuses: ["Main L/R", "Foldback (Stage)", "Subwoofers"],
};
