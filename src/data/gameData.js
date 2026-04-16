/**
 * @typedef {Object} StatBlock
 * @property {number} technical - Ability to handle equipment
 * @property {number} social - Communication and networking skill
 * @property {number} stamina - Resistance to stress and physical fatigue
 */

/**
 * @typedef {Object} Character
 * @property {string} id
 * @property {string} name
 * @property {string} role
 * @property {'lighting' | 'sound'} department
 * @property {string} bio
 * @property {string} icon
 * @property {StatBlock} stats
 */

/**
 * @typedef {Object} Cue
 * @property {string} id
 * @property {string} label
 * @property {number} targetMs
 * @property {number} windowMs
 */

// --- PLANNING STAGE CONSTANTS ---
export const PLOT_GRID_COLS = 5;
export const PLOT_GRID_ROWS = 3;

export const LIGHT_TYPES = [
  { id: "spot", label: "Spotlight", color: "#fef08a", icon: "🔦" },
  { id: "wash", label: "Wash", color: "#38bdf8", icon: "💡" },
  { id: "led", label: "LED Par", color: "#f472b6", icon: "🚥" },
];

// --- VENUES ---
export const VENUES = {
  high_school: {
    name: "Westview High Auditorium",
    description: "Dusty curtains and a flickering lighting board from 1998. It builds character.",
  },
  church: {
    name: "Grace Community Sanctuary",
    description: "State-of-the-art digital soundboards, but absolutely zero backstage space.",
  },
  regional: {
    name: "Downtown Repertory Theatre",
    description: "A professional crew. The stakes are high, and the space is notoriously quirky.",
  },
  broadway: {
    name: "The Grand Adelphi",
    description: "The pinnacle. Massive scale, unforgiving timelines, and zero room for error.",
  },
};

// --- PRODUCTIONS ---
export const PRODUCTIONS = [
  {
    id: "phantom",
    title: "Phantom of the Opera",
    poster: "🎭",
    description: "A technically complex musical requiring precise timing for fog and falling chandeliers.",
    learnMoreUrl: "https://en.wikipedia.org/wiki/The_Phantom_of_the_Opera_(1986_musical)",
    levels: {
      school: { venueId: "high_school", unlocked: true },
      community: { venueId: "regional", unlocked: false },
      professional: { venueId: "broadway", unlocked: false },
    },
  },
  {
    id: "midsummer",
    title: "A Midsummer Night's Dream",
    poster: "🧚",
    description: "A whimsical play relying on atmospheric lighting and subtle ambient soundscapes.",
    learnMoreUrl: "https://en.wikipedia.org/wiki/A_Midsummer_Night%27s_Dream",
    levels: {
      school: { venueId: "high_school", unlocked: true },
      community: { venueId: "church", unlocked: false },
      professional: { venueId: "regional", unlocked: false },
    },
  },
  {
    id: "crucible",
    title: "The Crucible",
    poster: "🔥",
    description: "A heavy drama. Stark, high-contrast lighting and oppressive audio are required.",
    learnMoreUrl: "https://en.wikipedia.org/wiki/The_Crucible",
    levels: {
      school: { venueId: "high_school", unlocked: true },
      community: { venueId: "regional", unlocked: false },
      professional: { venueId: "broadway", unlocked: false },
    },
  }
];

// --- CHARACTERS ---
/** @type {Character[]} */
export const CHARACTERS = [
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

// --- CUE SHEETS ---
/** @type {Object.<string, Object.<string, Cue[]>>} */
export const CUE_SHEETS = {
  phantom: {
    lighting: [
      { id: "LQ 1", label: "House to Half", targetMs: 2000, windowMs: 1500 },
      { id: "LQ 2", label: "Chandelier Rise", targetMs: 11000, windowMs: 1000 },
      { id: "LQ 3", label: "Blackout", targetMs: 26000, windowMs: 500 },
    ],
    sound: [
      { id: "SQ 1", label: "Organ Stinger", targetMs: 6500, windowMs: 500 },
      { id: "SQ 2", label: "Actor 1 Mic ON", targetMs: 14000, windowMs: 1000 },
    ],
  },
  midsummer: {
    lighting: [
      { id: "LQ 10", label: "Forest Wash", targetMs: 4000, windowMs: 2000 },
      { id: "LQ 11", label: "Moonlight Spot", targetMs: 27000, windowMs: 1000 },
    ],
    sound: [
      { id: "SQ 10", label: "Fairy Chimes", targetMs: 10000, windowMs: 1000 },
      { id: "SQ 11", label: "Donkey Bray FX", targetMs: 16500, windowMs: 800 },
    ]
  },
};

// --- CONFLICTS ---
export const CONFLICTS = [
  {
    id: "director_yell",
    trigger: "rehearsal",
    title: "Creative Differences",
    description: "The Director storms up to the tech booth. 'Fix it right now!'",
    choices: [
      { 
        id: "c1", text: "Politely ask for specifics.", stat: "social", threshold: 6, 
        pass: { outcome: "resolved", pointDelta: 50, text: "The Director calms down." }, 
        fail: { outcome: "escalated", pointDelta: -20, text: "The Director thinks you are rude." } 
      },
    ]
  },
  {
    id: "broken_comms",
    trigger: "liveshow",
    title: "Headset Static",
    description: "Your headset fills with static. You can barely hear the Stage Manager.",
    choices: [
      { 
        id: "c1", text: "Swap the XLR cable blind.", stat: "technical", threshold: 6, 
        pass: { outcome: "resolved", pointDelta: 60, text: "Clean audio restores." }, 
        fail: { outcome: "fail", pointDelta: -100, text: "You unplugged the main feed." } 
      },
    ]
  }
];

// --- STORIES ---
export const STORIES = [
  {
    id: "story_1",
    title: "The All-Black Uniform",
    content: "Backstage workers wear all black as camouflage for 'invisible excellence'.",
    unlockedBy: { productionId: "phantom", difficulty: "school", minStars: 1 }
  },
  {
    id: "story_2",
    title: "The God Voice",
    content: "The Stage Manager (SM) is the ultimate authority during a run.",
    unlockedBy: { productionId: "crucible", difficulty: "professional", minStars: 2 }
  }
];