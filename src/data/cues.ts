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
};
