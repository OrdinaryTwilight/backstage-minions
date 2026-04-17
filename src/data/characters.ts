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
  },
  {
    id: "char_river",
    name: "River",
    role: "Video Programmer",
    department: "video",
    bio: "A trans-masc digital artist who views the stage as a 3D canvas. River is known for solving complex signal-flow issues with a 'don't panic' attitude and a bag of specialized adapters.",
    icon: "📹",
    stats: { technical: 10, social: 6, stamina: 4 },
  },
  {
    id: "char_maya",
    name: "Maya",
    role: "Properties Master",
    department: "props",
    bio: "An expert in 'Theatrical Alchemy'—turning foam into iron and glue into gourmet meals. Maya has worked in every major house in the city and has a story for every scar on her work gloves.",
    icon: "⚒️",
    stats: { technical: 8, social: 9, stamina: 7 },
  },
];

export const NPC_ICONS = {
  "Stage Manager": "📋",
  "Costume Designer": "🧵",
  "Senior Technician": "👨‍🔧",
  Director: "🎬",
};

export const AVAILABLE_NPCS = [
  {
    id: "npc_zainab",
    name: "Zainab",
    role: "Wardrobe Sup.",
    color: "#e63946",
    dialogue: (dept?: string) => ({
      speaker: "Zainab (Wardrobe)",
      text:
        dept === "lighting"
          ? "Please tell me you aren't using that ghastly green gel for the finale. It ruins the silks!"
          : "Hey! The lead's mic pack is pulling on their costume. We need a smaller pouch.",
      choices: [
        {
          id: "ok",
          text: "I'll look into it right now.",
          pointDelta: 0,
          contact: null,
        },
      ],
    }),
  },
  {
    id: "npc_mateo",
    name: "Mateo",
    role: "Head Rigger",
    color: "#f9a826",
    dialogue: (dept?: string) => ({
      speaker: "Mateo (Rigging)",
      text:
        dept === "lighting"
          ? "I just hung the new movers on the first electric. Safety cables are tight!"
          : "Watch your step! I just routed a massive audio snake across the deck.",
      choices: [
        {
          id: "ok",
          text: "Thanks for the heads up.",
          pointDelta: 0,
          contact: null,
        },
      ],
    }),
  },
  {
    id: "npc_sam",
    name: "Sam",
    role: "ASM",
    color: "#457b9d",
    dialogue: () => ({
      speaker: "Sam (Assistant Stage Manager)",
      text: "I'm looking for a missing prop sword... Have you seen a giant piece of foam painted silver?",
      choices: [
        {
          id: "ok",
          text: "Haven't seen it, sorry!",
          pointDelta: 0,
          contact: null,
        },
      ],
    }),
  },
  {
    id: "npc_elara",
    name: "Elara",
    role: "Production Manager",
    color: "#8338ec",
    dialogue: (dept?: string) => {
      const responses = {
        lighting:
          "The lighting plot is missing three overhead washes. We're ten minutes from the designer arriving—make it happen.",
        sound:
          "I'm hearing a 60Hz hum in the center cluster. If we don't find the ground loop now, it’s going to be a long night.",
        default:
          "We’re behind schedule. Focus on the 'Must-Haves' and leave the 'Nice-to-Haves' for tomorrow.",
      };
      return {
        speaker: "Elara (Production Manager)",
        text: responses[dept as keyof typeof responses] || responses.default,
        choices: [
          {
            id: "hustle",
            text: "Understood. I'll get the crew moving.",
            pointDelta: 2,
            contact: null,
          },
          {
            id: "reality",
            text: "We need more hands if you want it done safely.",
            pointDelta: 0,
            contact: "char_alex",
          },
        ],
      };
    },
  },
];
