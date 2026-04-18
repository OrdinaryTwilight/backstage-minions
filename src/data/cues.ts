import { Cue } from "../types/game";

// --- CUE SHEETS ---
export const CUE_SHEETS: Record<string, Record<string, Cue[]>> = {
  phantom: {
    lighting: [
      {
        id: "LQ 1",
        label: "House to Half",
        targetMs: 12000,
        windowMs: 1500,
        targetLevel: 50,
      },
      {
        id: "LQ 2",
        label: "Chandelier Rise",
        targetMs: 21000,
        windowMs: 1000,
        targetLevel: 90,
      },
      {
        id: "LQ 3",
        label: "Blackout",
        targetMs: 36000,
        windowMs: 500,
        targetLevel: 0,
      },
      // The high-stakes drop sequence
      {
        id: "LQ 101",
        label: "Strobe Impact",
        targetMs: 42000,
        windowMs: 400,
        targetLevel: 100,
      },
    ],
    sound: [
      {
        id: "SQ 1",
        label: "Organ Stinger",
        targetMs: 12000,
        windowMs: 500,
        targetLevel: 85,
      },
      {
        id: "SQ 2",
        label: "Actor 1 Mic ON",
        targetMs: 24000,
        windowMs: 1000,
        targetLevel: 75,
      },
      {
        id: "SQ 45",
        label: "Glass Shatter FX",
        targetMs: 41500,
        windowMs: 300,
        targetLevel: 100,
      },
    ],
    scenic: [
      {
        id: "FLY 12",
        label: "Chandelier Freefall",
        targetMs: 41700,
        windowMs: 200,
        targetLevel: 0,
      }, // Very tight window!
    ],
  },
  midsummer: {
    lighting: [
      {
        id: "LQ 10",
        label: "Forest Wash",
        targetMs: 12000,
        windowMs: 2000,
        targetLevel: 70,
      },
      {
        id: "LQ 11",
        label: "Moonlight Spot",
        targetMs: 35000,
        windowMs: 1000,
        targetLevel: 40,
      },
      {
        id: "LQ 44",
        label: "Moonrise Fade (10s)",
        targetMs: 45000,
        windowMs: 1500,
        targetLevel: 60,
      },
    ],
    sound: [
      {
        id: "SQ 10",
        label: "Fairy Chimes",
        targetMs: 12000,
        windowMs: 1000,
        targetLevel: 30,
      },
      {
        id: "SQ 11",
        label: "Donkey Bray FX",
        targetMs: 26500,
        windowMs: 800,
        targetLevel: 100,
      },
      {
        id: "SQ 12",
        label: "Crickets Ambience",
        targetMs: 46000,
        windowMs: 1000,
        targetLevel: 45,
      },
    ],
  },
  crucible: {
    lighting: [
      {
        id: "LQ 20",
        label: "Cold Morning Wash",
        targetMs: 12000,
        windowMs: 2000,
        targetLevel: 30,
      },
      {
        id: "LQ 21",
        label: "Courtroom Beam",
        targetMs: 28000,
        windowMs: 800,
        targetLevel: 85,
      },
    ],
    sound: [
      {
        id: "SQ 20",
        label: "Low Drone Start",
        targetMs: 12000,
        windowMs: 3000,
        targetLevel: 20,
      },
      {
        id: "SQ 21",
        label: "Gallows Clunk",
        targetMs: 32000,
        windowMs: 400,
        targetLevel: 100,
      },
    ],
  },
  macbeth: {
    lighting: [
      {
        id: "LQ 30",
        label: "Witches' Heath Wash",
        targetMs: 12000,
        windowMs: 2000,
        targetLevel: 25,
      },
      {
        id: "LQ 31",
        label: "Lightning Flash",
        targetMs: 24000,
        windowMs: 300,
        targetLevel: 100,
      }, // Fast reaction needed
      {
        id: "LQ 32",
        label: "Banquo's Ghost Spot",
        targetMs: 36000,
        windowMs: 1500,
        targetLevel: 60,
      },
    ],
    sound: [
      {
        id: "SQ 30",
        label: "Thunderclap FX",
        targetMs: 24000,
        windowMs: 300,
        targetLevel: 95,
      }, // Syncs with lightning
      {
        id: "SQ 31",
        label: "Ominous Drone",
        targetMs: 28000,
        windowMs: 2000,
        targetLevel: 40,
      },
      {
        id: "SQ 32",
        label: "Battle Drums",
        targetMs: 45000,
        windowMs: 1000,
        targetLevel: 85,
      },
    ],
  },
  prod_corporate_keynote: {
    lighting: [
      {
        id: "LQ 1",
        label: "Walk-on Rock Strobe",
        targetMs: 5000,
        windowMs: 200,
        targetLevel: 100,
      }, // Brutal corporate timing
      {
        id: "LQ 2",
        label: "CEO Keylight (Smooth)",
        targetMs: 10000,
        windowMs: 1000,
        targetLevel: 80,
      },
    ],
    sound: [
      {
        id: "SQ 1",
        label: "Walk-on Rock Anthem",
        targetMs: 5000,
        windowMs: 200,
        targetLevel: 90,
      },
      {
        id: "SQ 2",
        label: "CEO Lav Mic Unmute",
        targetMs: 10000,
        windowMs: 300,
        targetLevel: 75,
      }, // Don't miss this or CEO is muted!
    ],
  },
};
