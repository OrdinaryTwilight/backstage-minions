import { Cue } from "../types/game";

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
        targetLevel: 100,
      },
      {
        id: "LQ 3",
        label: "Creepy Dim",
        targetMs: 36000,
        windowMs: 500,
        targetLevel: 15,
      }, // Volatile
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
        label: "Actor 1 Mic ON (Whisper)",
        targetMs: 24000,
        windowMs: 1000,
        targetLevel: 35,
      }, // Volatile
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
        label: "Moonlight Spot (Dim)",
        targetMs: 35000,
        windowMs: 1000,
        targetLevel: 25,
      }, // Volatile
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
        windowMs: 500,
        targetLevel: 100,
      },
      {
        id: "LQ 32",
        label: "Banquo's Ghost Spot",
        targetMs: 36000,
        windowMs: 1500,
        targetLevel: 45,
      }, // Volatile
    ],
    sound: [
      {
        id: "SQ 30",
        label: "Thunderclap FX",
        targetMs: 12000,
        windowMs: 500,
        targetLevel: 95,
      },
      {
        id: "SQ 31",
        label: "Ominous Drone",
        targetMs: 28000,
        windowMs: 2000,
        targetLevel: 40,
      },
      {
        id: "SQ 32",
        label: "Battle Drums (Fade In)",
        targetMs: 45000,
        windowMs: 1000,
        targetLevel: 65,
      }, // Volatile
    ],
  },
  prod_hamlet_space: {
    lighting: [
      {
        id: "LQ 1",
        label: "Flickering Worklight",
        targetMs: 12000,
        windowMs: 2000,
        targetLevel: 30,
      },
      {
        id: "LQ 2",
        label: "Alien Laser Effect",
        targetMs: 25000,
        windowMs: 1500,
        targetLevel: 80,
      },
    ],
    sound: [
      {
        id: "SQ 1",
        label: "Theremin Intro",
        targetMs: 12000,
        windowMs: 2000,
        targetLevel: 60,
      },
    ],
  },
  prod_les_mis_community: {
    lighting: [
      {
        id: "LQ 1",
        label: "Barricade Wash",
        targetMs: 15000,
        windowMs: 1000,
        targetLevel: 75,
      },
    ],
    sound: [
      {
        id: "SQ 1",
        label: "Ensemble Mic Unmute (All 50)",
        targetMs: 15000,
        windowMs: 500,
        targetLevel: 85,
      },
    ],
    scenic: [
      {
        id: "FLY 1",
        label: "Push the Trash Barricade",
        targetMs: 30000,
        windowMs: 5000,
        targetLevel: 0,
      },
    ],
  },
  prod_midsummer_musical: {
    lighting: [
      {
        id: "LQ 1",
        label: "Synth-Pop Strobe",
        targetMs: 10000,
        windowMs: 500,
        targetLevel: 100,
      },
    ],
    sound: [
      {
        id: "SQ 1",
        label: "Drop the Bass",
        targetMs: 10000,
        windowMs: 300,
        targetLevel: 95,
      },
    ],
  },
  prod_phantom_vengeance: {
    lighting: [
      {
        id: "LQ 101",
        label: "Strobe Impact",
        targetMs: 12000,
        windowMs: 400,
        targetLevel: 100,
      },
    ],
    sound: [
      {
        id: "SQ 45",
        label: "Glass Shatter FX",
        targetMs: 11500,
        windowMs: 300,
        targetLevel: 100,
      },
    ],
    scenic: [
      {
        id: "FLY 12",
        label: "Chandelier Freefall",
        targetMs: 11700,
        windowMs: 200,
        targetLevel: 0,
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
      },
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
      },
    ],
  },
};
