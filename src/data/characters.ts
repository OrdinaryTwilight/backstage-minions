import { Character } from "../types/game";

// --- CHARACTERS ---
export const CHARACTERS: Character[] = [
  {
    id: "char_ben",
    name: "Ben",
    role: "Lighting Designer",
    department: "lighting",
    bio: "A seasoned designer who moved from architectural lighting to theatre. Prefers the company of their console over humans but has a hidden talent for networking during interval drinks.",
    icon: "🧑‍💻",
    stats: { technical: 9, social: 4, stamina: 6 },
  },
  {
    id: "char_sam",
    name: "Sam",
    role: "A1 (Lead Audio)",
    department: "sound",
    bio: "Cool under pressure. Sam found their start mixing in large community spaces and can handle a 40-piece orchestra without breaking a sweat, though archaic analog gear still proves a challenge.",
    icon: "🎧",
    stats: { technical: 7, social: 8, stamina: 5 },
  },
  {
    id: "char_alex",
    name: "Alex",
    role: "Master Electrician",
    department: "lighting",
    bio: "The muscle and brains of the lighting crew. Alex has a background in electrical engineering and is more concerned with circuit loads than 'artistic vibes'.",
    icon: "👷",
    stats: { technical: 8, social: 5, stamina: 10 },
  },
  {
    id: "char_jordan",
    name: "Jordan",
    role: "Sound Designer",
    department: "sound",
    bio: "A perfectionist who transitioned from a career in studio production to live performance. Jordan spends hours EQing a single footstep and has little patience for mic-dropping divas.",
    icon: "🎛️",
    stats: { technical: 8, social: 3, stamina: 6 },
  },
  {
    id: "char_priya",
    name: "Priya",
    role: "Head of Lighting",
    department: "lighting",
    bio: "Highly respected for her efficiency and focus. Priya worked her way up through regional touring and knows every quirk of the Grand Adelphi’s rig. She doesn't tolerate communication breakdowns.",
    icon: "👩🏾‍🔧",
    stats: { technical: 8, social: 7, stamina: 8 },
  },
  {
    id: "char_casey",
    name: "Casey",
    role: "Audio Systems Engineer",
    department: "sound",
    bio: "A wizard with digital protocols and signal routing. Casey is non-binary and spent years working on international festival tours before finding a home in the musical theatre world.",
    icon: "🧑🏻‍🚀",
    stats: { technical: 10, social: 5, stamina: 7 },
  }
];
export const NPC_ICONS = {
  "Stage Manager": "📋",
  "Costume Designer": "🧵",
  "Senior Technician": "👨‍🔧",
  "Director": "🎬"
};