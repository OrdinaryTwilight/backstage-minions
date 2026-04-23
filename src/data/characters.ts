/**
 * @file Characters & NPC Data
 * @description Defines all playable characters, NPCs, and character-related utilities.
 *
 * Character System:
 * - **Playable Characters** (10): Players select one at game start, affects department and stat-based difficulty
 * - **NPCs** (non-playable): Side characters for dialogue and conflicts
 * - **Available NPCs**: Subset of NPCs with explicit dialogue trees
 *
 * Character Stats (0-10 scale):
 * - **Technical**: Ability with equipment (affects failure thresholds in minigames)
 * - **Social**: Communication skill (affects dialogue choices and affinity)
 * - **Stamina**: Stress resistance (affects max stress capacity)
 *
 * Utility Functions:
 * - `resolveCharacterName`: Convert ID to display name
 * - `parseDialogueTags`: Replace {char_id} tags with live character names
 */

import { Character } from "../types/game";

// --- DYNAMIC PARSING UTILITIES ---
/**
 * Resolves a character or NPC ID to their display name.
 * Searches both CHARACTERS and AVAILABLE_NPCS arrays.
 *
 * @param id - Character or NPC ID
 * @returns Display name, or original ID if not found
 */
export const resolveCharacterName = (id: string): string => {
  const c =
    CHARACTERS.find((c) => c.id === id) ||
    AVAILABLE_NPCS.find((c) => c.id === id);
  return c ? c.name : id;
};

/**
 * Parses dialogue text and replaces {char_id} placeholders with live character names.
 * Used in dialogue and conflict text to personalize messages dynamically.
 *
 * @param text - Text containing {char_id} placeholders
 * @returns Text with placeholders replaced by character names
 * @example
 * parseDialogueTags("Help {char_shane} with the rig!")
 * // Returns: "Help Shane with the rig!"
 */
export const parseDialogueTags = (text: string): string => {
  if (!text) return text;
  return text.replaceAll(/\{([^}]+)\}/g, (match, id) => {
    const name = resolveCharacterName(id);
    return name === id ? match : name;
  });
};

// --- CHARACTERS ---
/**
 * All playable characters in the game.
 * Each character represents a different theater department with unique stats and department-specific gameplay.
 * Player selects one character at game start, which determines available minigames and difficulty.
 */
export const CHARACTERS: Character[] = [
  {
    id: "char_shane",
    name: "Shane",
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
    id: "char_nikki",
    name: "Nikki",
    role: "Master Electrician",
    department: "lighting",
    bio: "The muscle and brains of the lighting crew. Nikki has a background in electrical engineering and is more concerned with circuit loads than 'artistic vibes'.",
    icon: "👷",
    stats: { technical: 8, social: 5, stamina: 10 },
  },
  {
    id: "char_zen",
    name: "Young Zen",
    role: "Sound Designer",
    department: "sound",
    bio: "A perfectionist who transitioned from a career in studio production to live performance. Zen spends hours EQing a single footstep and has little patience for mic-dropping divas.",
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
    id: "char_wynn",
    name: "Wynn",
    role: "Audio Systems Engineer",
    department: "sound",
    bio: "A wizard with digital protocols and signal routing. Wynn spent years working on international festival tours before finding a home in the musical theatre world.",
    icon: "🧑🏻‍🚀",
    stats: { technical: 10, social: 5, stamina: 7 },
  },
  {
    id: "char_river",
    name: "River",
    role: "Video Programmer",
    department: "video",
    bio: "A brilliant digital artist who views the stage as a 3D canvas. River is known for solving complex signal-flow issues with a 'don't panic' attitude and a bag of specialized adapters.",
    icon: "📹",
    stats: { technical: 10, social: 6, stamina: 4 },
  },
  {
    id: "char_lia",
    name: "Lia",
    role: "Properties Master",
    department: "props",
    bio: "An expert in 'Theatrical Alchemy'... aka turning foam into iron and glue into gourmet meals. Lia has worked in every major house in the city and has a story for every scar on her work gloves.",
    icon: "⚒️",
    stats: { technical: 8, social: 9, stamina: 7 },
  },
  {
    id: "char_leo",
    name: "Leo",
    role: "Head Flyman",
    department: "scenic",
    bio: "Spends his life 60 feet in the air on the fly rail. Speaks in cryptic nautical terms and possesses an uncanny, sixth-sense timing for dropping scenery exactly on the musical downbeat.",
    icon: "🏗️",
    stats: { technical: 6, social: 5, stamina: 10 },
  },
  {
    id: "char_karishma",
    name: "Karishma",
    role: "Lead Followspot",
    department: "lighting",
    bio: "Operates Spot 1 from the catwalks. Subsists on sour candy and adrenaline. Karishma knows every actor's blocking better than the director does and has an eerie ability to track a dancer in pitch darkness.",
    icon: "🔦",
    stats: { technical: 7, social: 6, stamina: 8 },
  },
  {
    id: "char_sylvester",
    name: "Sylvester",
    role: "Master Carpenter",
    department: "scenic",
    bio: "Loves sawdust more than oxygen. Sylvester is grumpy on the surface but will stay until 3 AM to make sure a stair unit is mathematically flawless and perfectly silent to walk on.",
    icon: "🪚",
    stats: { technical: 9, social: 4, stamina: 9 },
  },
  {
    id: "char_angel",
    name: "Angel",
    role: "Hair & Makeup Head",
    department: "wardrobe",
    bio: "Part therapist, part artist. Angel spends preshow gluing on wigs and talking actors off emotional ledges. Moves with terrifying speed during a 30-second quick change.",
    icon: "💄",
    stats: { technical: 7, social: 10, stamina: 6 },
  },
  {
    id: "char_richmond",
    name: "Richmond",
    role: "House Manager",
    department: "foh",
    bio: "The velvet rope between the chaos of backstage and the paying public. Richmond wears an impeccable suit, has a soothing voice, and can de-escalate a furious patron in under a minute.",
    icon: "🎟️",
    stats: { technical: 3, social: 10, stamina: 7 },
  },
  {
    id: "char_jay",
    name: "Jay",
    role: "A2 (Deck Audio)",
    department: "sound",
    bio: "The unsung hero of the audio world. Jay lives in the wings, wrangling sweating actors into mic belts and fixing snapped cables with surgical tape in total darkness.",
    icon: "🎙️",
    stats: { technical: 8, social: 7, stamina: 9 },
  },
  {
    id: "char_shaun",
    name: "Shaun",
    role: "Special Effects Tech",
    department: "props",
    bio: "Licensed pyrotechnician and fog machine whisperer. Shaun's eyebrows haven't fully grown back since the 'Macbeth Incident of 2019', but his dry ice waterfalls are legendary.",
    icon: "💨",
    stats: { technical: 9, social: 4, stamina: 5 },
  },
  {
    id: "char_jasper",
    name: "Jasper",
    role: "Assistant Stage Manager",
    department: "management",
    bio: "Armed with an iPad, three rolls of glow tape, and an encyclopedic knowledge of everyone's coffee order. Jasper is the connective tissue holding the deck together.",
    icon: "📱",
    stats: { technical: 5, social: 9, stamina: 10 },
  },
];

export const NPC_ICONS = {
  "Stage Manager": "📋",
  "Costume Designer": "🧵",
  "Senior Technician": "👨‍🔧",
  Director: "🎬",
  Choreographer: "🕺",
  "Lead Actor": "🎭",
  "Music Director": "🎼",
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
    id: "npc_bryan",
    name: "Bryan",
    role: "Head Rigger",
    color: "#f9a826",
    dialogue: (dept?: string) => ({
      speaker: "Bryan (Rigging)",
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
    id: "npc_des",
    name: "Des",
    role: "ASM",
    color: "#457b9d",
    dialogue: () => ({
      speaker: "Des (Assistant Stage Manager)",
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
    id: "npc_jd",
    name: "JD",
    role: "Production Manager",
    color: "#8338ec",
    dialogue: (dept?: string) => {
      const responses = {
        lighting:
          "The lighting plot is missing three overhead washes. We're ten minutes from the designer arriving — make it happen.",
        sound:
          "I'm hearing a 60Hz hum in the center cluster. If we don't find the ground loop now, it’s going to be a long night.",
        default:
          "We’re behind schedule. Focus on the 'Must-Haves' and leave the 'Nice-to-Haves' for tomorrow.",
      };
      return {
        speaker: "JD (Production Manager)",
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
            contact: "char_nikki",
          },
        ],
      };
    },
  },
  {
    id: "npc_yg",
    name: "YG",
    role: "Director",
    color: "#ff0066",
    dialogue: (dept?: string) => {
      const responses = {
        lighting:
          "It's just too... literal. Can we make the light look more like a memory of a Tuesday?",
        sound:
          "The rain effect is great, but can it sound more... emotionally devastating?",
        default:
          "Why is everyone walking so loudly? The stage must be a sacred void before we begin.",
      };
      return {
        speaker: "YG (Director)",
        text: responses[dept as keyof typeof responses] || responses.default,
        choices: [
          {
            id: "nod",
            text: "I'll see what I can do to translate that into tech.",
            pointDelta: 1,
            contact: null,
          },
          {
            id: "confuse",
            text: "...Right. I'll just adjust the fader.",
            pointDelta: -1,
            contact: null,
          },
        ],
      };
    },
  },
  {
    id: "npc_bethany",
    name: "Bethany",
    role: "Lead Actor",
    color: "#ffcc00",
    dialogue: () => ({
      speaker: "Bethany (Lead)",
      text: "Is there an unnatural draft in here? My vocal cords are seizing up. And I can't find my specific honey-lemon tea.",
      choices: [
        {
          id: "tea",
          text: "I think Props has your tea. I'll call them.",
          pointDelta: 2,
          contact: "char_lia",
        },
      ],
    }),
  },
  {
    id: "npc_viola",
    name: "Viola",
    role: "Music Director",
    color: "#3399ff",
    dialogue: () => ({
      speaker: "Viola (MD)",
      text: "The pit monitor is picking up the click track. If the front row hears a metronome during the ballad, I'm walking out.",
      choices: [
        {
          id: "fix",
          text: "On it. Re-routing the aux send to your in-ears only.",
          pointDelta: 3,
          contact: "char_sam",
        },
      ],
    }),
  },
  {
    id: "npc_stage_manager",
    name: "Alex",
    role: "Stage Manager",
    color: "#ffffff",
    dialogue: () => ({
      speaker: "Alex (Stage Manager)",
      text: "Is the headset loop clear? We're 2 minutes from curtain.",
      choices: [
        { id: "copy", text: "Copy that.", pointDelta: 0, contact: null },
      ],
    }),
  },
  {
    id: "sys_comms",
    name: "Headset Hub",
    role: "System Admin",
    color: "#00ff00",
    dialogue: () => ({
      speaker: "System",
      text: "Comms link established. Signal strength: 100%.",
      choices: [],
    }),
  },
];
