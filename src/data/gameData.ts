import { Story } from "../types/game";

/**
 * StatBlock - Represents character statistics
 */
export interface StatBlock {
  technical: number; // Ability to handle equipment
  social: number; // Communication and networking skill
  stamina: number; // Resistance to stress and physical fatigue
}

/**
 * Character - Represents a playable character in the game
 */
export interface Character {
  id: string;
  name: string;
  role: string;
  department: "lighting" | "sound";
  bio: string;
  icon: string;
  stats: StatBlock;
}

/**
 * Cue - Represents a technical cue (lighting or sound)
 */
export interface Cue {
  id: string;
  label: string;
  targetMs: number; // Target time in milliseconds
  windowMs: number; // Acceptable timing window in milliseconds
  targetLevel?: number; // Optional intensity level (0-100)
}

/**
 * ConflictChoice - Represents a choice in a conflict scenario
 */
export interface ConflictChoice {
  id: string;
  text: string; // The choice presented to the player
  outcome: "resolved" | "neutral" | "escalated";
  pointDelta: number; // Impact on total score
  aftermathText: string; // NPC dialogue response shown after selection
  sideEffect?: string; // Special triggers like unlocking contacts
}

/**
 * Conflict - Represents a conflict scenario in the game
 */
export interface Conflict {
  id: string;
  trigger: string; // The stage that triggers this conflict
  npc: string; // Name of the character involved
  description: string; // The opening dialogue or scenario
  choices: ConflictChoice[];
}

/**
 * Venue - Represents a performance venue
 */
export interface Venue {
  name: string;
  description: string;
}

/**
 * LevelDetails - Details about a specific difficulty level of a production
 */
export interface LevelDetails {
  venueId: string;
  unlocked: boolean;
}

/**
 * Production - Represents a theatrical production
 */
export interface Production {
  id: string;
  title: string;
  poster: string;
  description: string;
  learnMoreUrl: string;
  levels: Partial<Record<"school" | "community" | "professional", LevelDetails>>;
}

// --- PLANNING STAGE CONSTANTS ---
export const PLOT_GRID_COLS = 5;
export const PLOT_GRID_ROWS = 3;

export const LIGHT_TYPES = [
  { id: "spot", label: "Spotlight", color: "#fef08a", icon: "🔦" },
  { id: "wash", label: "Wash", color: "#38bdf8", icon: "💡" },
  { id: "led", label: "LED Par", color: "#f472b6", icon: "🚥" },
];

// --- VENUES ---
export const VENUES: Record<string, Venue> = {
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
export const PRODUCTIONS: Production[] = [
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

export const PRODUCTION_STAGES = [
  "equipment", 
  "planning", 
  "sound_design", 
  "execution", 
  "wrapup"
];

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

// --- CUE SHEETS ---
export const CUE_SHEETS: Record<string, Record<string, Cue[]>> = {
  phantom: {
    lighting: [
      { id: "LQ 1", label: "House to Half", targetMs: 2000, windowMs: 1500, targetLevel: 50 },
      { id: "LQ 2", label: "Chandelier Rise", targetMs: 11000, windowMs: 1000, targetLevel: 90 },
      { id: "LQ 3", label: "Blackout", targetMs: 26000, windowMs: 500, targetLevel: 0 },
    ],
    sound: [
      { id: "SQ 1", label: "Organ Stinger", targetMs: 6500, windowMs: 500, targetLevel: 85 },
      { id: "SQ 2", label: "Actor 1 Mic ON", targetMs: 14000, windowMs: 1000, targetLevel: 75 },
    ],
  },
  midsummer: {
    lighting: [
      { id: "LQ 10", label: "Forest Wash", targetMs: 4000, windowMs: 2000, targetLevel: 70 },
      { id: "LQ 11", label: "Moonlight Spot", targetMs: 27000, windowMs: 1000, targetLevel: 40 },
    ],
    sound: [
      { id: "SQ 10", label: "Fairy Chimes", targetMs: 10000, windowMs: 1000, targetLevel: 30 },
      { id: "SQ 11", label: "Donkey Bray FX", targetMs: 16500, windowMs: 800, targetLevel: 100 },
    ]
  },
  crucible: {
    lighting: [
      { id: "LQ 20", label: "Cold Morning Wash", targetMs: 3000, windowMs: 2000, targetLevel: 30 },
      { id: "LQ 21", label: "Courtroom Beam", targetMs: 18000, windowMs: 800, targetLevel: 85 },
    ],
    sound: [
      { id: "SQ 20", label: "Low Drone Start", targetMs: 1000, windowMs: 3000, targetLevel: 20 },
      { id: "SQ 21", label: "Gallows Clunk", targetMs: 22000, windowMs: 400, targetLevel: 100 },
    ]
  }
};

// --- CONFLICTS ---
export const CONFLICTS: Conflict[] = [
  {
    id: "costume_vs_lighting",
    trigger: "planning",
    npc: "Costume Designer",
    description: 'The Costume Designer storms into the booth: "Your warm amber wash is going to make the white dresses look YELLOW on stage. Did you even think about us before you drafted this?"',
    choices: [
      {
        id: "diplomatic",
        text: "Technical Fix: \"You're right—let's look at the plot together and find a cooler gel to compensate.\"",
        outcome: "resolved",
        pointDelta: 50,
        aftermathText: "The designer sighs, their tension visibly dropping. 'Thank you. I spent weeks on these silks; I’d hate for them to look like mud under the lights.'",
        sideEffect: "costume_contact_unlocked",
      },
      {
        id: "compromise",
        text: "Operational Fix: \"We can leave the color as is but dim the intensity during their solos.\"",
        outcome: "neutral",
        pointDelta: 20,
        aftermathText: "They cross their arms, still skeptical. 'It's a start, but I’m telling the Stage Manager we need a proper look at this during tech.'",
      },
      {
        id: "defensive",
        text: "The Hard Line: \"I'm the LD here. The wash stays as planned—the atmosphere is more important than a dress.\"",
        outcome: "escalated",
        pointDelta: -30,
        aftermathText: "They turn on their heel and storm out. You hear them muttering about 'arrogant designers' all the way down the hall.",
      },
    ],
  },
  {
    id: "late_cue",
    trigger: "rehearsal",
    npc: "Stage Manager",
    description: 'The headset crackles: "LX2 was four bars late again. The cast is losing confidence. What is happening at the board, people?"',
    choices: [
      {
        id: "honest",
        text: "Accountability: \"Sorry, I miscounted the measures. Can we take it from the top of the scene?\"",
        outcome: "resolved",
        pointDelta: 30,
        aftermathText: "'Copy that. Let's reset to places. Everyone, from the top—and let's stay sharp.'",
      },
      {
        id: "technical_fix",
        text: "Technical Solution: \"I'll set a visual mark in the wings to ensure I hit it before the music swells.\"",
        outcome: "resolved",
        pointDelta: 40,
        aftermathText: "'Good initiative. I’ll clear that with the ASM. Let's see it work this time.'",
      },
      {
        id: "blame",
        text: "Deflection: \"The conductor changed the tempo without telling the tech crew!\"",
        outcome: "escalated",
        pointDelta: -20,
        aftermathText: "A cold silence hangs on the comms for a moment. 'Blaming the pit won't fix your timing. Focus, or we're staying late tonight.'",
      },
    ],
  },
  {
    id: "broken_comms",
    trigger: "equipment",
    npc: "Senior Technician",
    description: "During load-in, the head of the venue hands you a box of tangled, dusty cables. 'Half of these don't work, and the other half are probably haunted. Good luck.'",
    choices: [
      {
        id: "repair",
        text: "Technical Grind: Spend an hour testing and soldering the leads yourself.",
        outcome: "resolved",
        pointDelta: 40,
        aftermathText: "The Senior Tech raises an eyebrow as you finish. 'Actually knowing which end of the iron is hot? Rare for a newcomer. Not bad.'",
        sideEffect: "ally_gained"
      },
      {
        id: "request",
        text: "Resourceful: 'I’m not risking the show on these. I’ll call the rental house for a rush delivery.'",
        outcome: "neutral",
        pointDelta: 10,
        aftermathText: "They shrug. 'It's your budget, kid. Hope the producer doesn't mind the line item.'",
      },
      {
        id: "ignore",
        text: "Lazy: Just use the cables and hope for the best during the show.",
        outcome: "escalated",
        pointDelta: -50,
        aftermathText: "The Tech mutters, 'Right. I'll make sure to have the fire extinguisher ready then.'",
      }
    ]
  }
];

// --- STORIES ---
export const STORIES: Story[] = [
  {
    id: "story_1",
    title: "The All-Black Uniform",
    content: `In professional theatre, your goal is to be a shadow. The tradition of wearing "theatre blacks" is a philosophy of "Invisible Excellence." When a stagehand moves a piano mid-scene or an electrician adjusts a side-light during a blackout, they must remain unseen to preserve the "Theatrical Illusion." If the audience notices the crew, the magic is broken. Historically, this camouflaged labor ensures focus remains on the art, though it often means technical crew only receive recognition when something goes wrong. To wear the black uniform is to accept that your greatest success is being completely forgotten by the audience.`,
    unlockedBy: { productionId: "phantom", difficulty: "school", minStars: 1 }
  },
  {
    id: "story_2",
    title: "The God Voice",
    content: `During a performance, the Stage Manager (SM) is the ultimate authority. From their position in the booth—surrounded by monitors and headsets—they watch the action with clinical precision. When the SM speaks over the "God Mic" (PA system) or the private comms channel, the crew listens. This isn't just about hierarchy; it's about safety. A show with a hundred moving parts requires a single "brain" to synchronize them. When you hear the SM call "Standby," your hand should be on the button. When they call "Go," you fire. In that moment, the SM isn't just a coworker; they are the rhythmic pulse of the entire production.`,
    unlockedBy: { productionId: "phantom", difficulty: "school", minStars: 2 }
  },
  {
    id: "story_3",
    title: "The Architecture of Sound",
    content: `Sound design isn't just about volume; it's about defining the physics of an imaginary space. A Sound Designer must account for the "Acoustic Signature" of the room—how high frequencies are absorbed by the audience's clothing and how low frequencies build up in the corners of the balcony. When mapping a stage for sound, you are placing "Foldback" speakers so actors can hear themselves and "Main Arrays" to ensure the person in the last row of the gallery hears the same clarity as the front row. It is a delicate balance of phase alignment and EQ carving, ensuring technology disappears so storytelling can take center stage.`,
    unlockedBy: { productionId: "midsummer", difficulty: "community", minStars: 2 }
  }
];

export const AUDIO_TYPES = [
  { id: "mic", label: "Wireless Mic", color: "#f87171", icon: "🎙️" },
  { id: "speaker", label: "Foldback", color: "#60a5fa", icon: "🔊" },
  { id: "di", label: "DI Box", color: "#a78bfa", icon: "📥" },
];

export const GEAR_PACKAGES = [
  { 
    id: "budget", 
    label: "Community Surplus", 
    description: "Old analog gear. Faders are sticky and comms are crackly.",
    multiplier: 0.8, // Harder: smaller hit windows
    bonus: 50 
  },
  { 
    id: "standard", 
    label: "Rental House Pro", 
    description: "Solid, reliable digital equipment. Standard industry windows.",
    multiplier: 1.0, 
    bonus: 0 
  },
  { 
    id: "premium", 
    label: "State-of-the-Art", 
    description: "Brand new grandMA3/CL5. Silky smooth response.",
    multiplier: 1.2, // Easier: wider hit windows
    bonus: -50 // Cost of luxury
  }
];

export const NPC_ICONS = {
  "Stage Manager": "📋",
  "Costume Designer": "🧵",
  "Senior Technician": "👨‍🔧",
  "Director": "🎬"
};