/**
 * @file Cue Sheets Data
 * @description Technical cue timing data for each production and department.
 * 
 * Cue System:
 * - **Cues**: Specific technical operations (lighting, sound, fly effects) at precise times
 * - **Cue Sheets**: Production-specific timing data organized by department
 * - **Departments**: Lighting, Sound, Scenic, Stage Management each have unique cues
 * - **Cue Execution**: Players must hit cues within their timing window (+/- tolerance)
 * 
 * Cue Mechanics:
 * - `targetMs`: Ideal time to execute cue (from start of show)
 * - `windowMs`: Acceptable timing tolerance (player must be within ±windowMs/2)
 * - `targetLevel`: Optional intensity level (0-100) for fader alignment
 * 
 * Example: A cue with targetMs=5000, windowMs=2000 can be hit anytime from 4000-6000ms.
 */

import { Cue } from "../types/game";

const DEFAULT_SCENIC_CUES: Cue[] = [
  {
    id: "scn_1",
    label: "Fly In: Act 1 Portal",
    targetMs: 10000,
    windowMs: 4000,
    targetLevel: 100,
  },
  {
    id: "scn_2",
    label: "Fly Out: Chandelier",
    targetMs: 22000,
    windowMs: 3000,
    targetLevel: 0,
  },
  {
    id: "scn_3",
    label: "Wagon: Downstage Center",
    targetMs: 35000,
    windowMs: 2500,
    targetLevel: 80,
  },
  {
    id: "scn_4",
    label: "Fly In: Forest Backdrop",
    targetMs: 48000,
    windowMs: 3000,
    targetLevel: 100,
  },
  {
    id: "scn_5",
    label: "Fly Out: All (Strike)",
    targetMs: 58000,
    windowMs: 2000,
    targetLevel: 0,
  },
];

const DEFAULT_MANAGEMENT_CUES: Cue[] = [
  {
    id: "sm_1",
    label: "Call: House to Half",
    targetMs: 8000,
    windowMs: 5000,
    targetLevel: 50,
  },
  {
    id: "sm_2",
    label: "Call: LX Blackout",
    targetMs: 20000,
    windowMs: 2000,
    targetLevel: 100,
  },
  {
    id: "sm_3",
    label: "Call: Sound SFX GO",
    targetMs: 32000,
    windowMs: 2500,
    targetLevel: 80,
  },
  {
    id: "sm_4",
    label: "Call: Standby Fly Rail",
    targetMs: 45000,
    windowMs: 4000,
    targetLevel: 60,
  },
  {
    id: "sm_5",
    label: "Call: Fly Rail GO",
    targetMs: 55000,
    windowMs: 1500,
    targetLevel: 100,
  },
];

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
        label: "Actor 1 Mic ON (Whisper)",
        targetMs: 24000,
        windowMs: 1000,
        targetLevel: 35,
      },
    ],
    scenic: DEFAULT_SCENIC_CUES,
    management: DEFAULT_MANAGEMENT_CUES,
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
    scenic: DEFAULT_SCENIC_CUES,
    management: DEFAULT_MANAGEMENT_CUES,
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
    scenic: DEFAULT_SCENIC_CUES,
    management: DEFAULT_MANAGEMENT_CUES,
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
      },
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
      },
    ],
    scenic: DEFAULT_SCENIC_CUES,
    management: DEFAULT_MANAGEMENT_CUES,
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
    scenic: DEFAULT_SCENIC_CUES,
    management: DEFAULT_MANAGEMENT_CUES,
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
