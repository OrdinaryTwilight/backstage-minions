import { Production, Venue } from "../types/game";

// --- VENUES ---
export const VENUES: Record<string, Venue> = {
  high_school: {
    name: "Westview High Auditorium",
    description:
      "Dusty curtains and a flickering lighting board from 1998. It builds character.",
  },
  church: {
    name: "Grace Community Sanctuary",
    description:
      "State-of-the-art digital soundboards, but absolutely zero backstage space.",
  },
  regional: {
    name: "Downtown Repertory Theatre",
    description:
      "A professional crew. The stakes are high, and the space is notoriously quirky.",
  },
  broadway: {
    name: "The Grand Adelphi",
    description:
      "The pinnacle. Massive scale, unforgiving timelines, and zero room for error.",
  },
  convention_center: {
    name: "Moscone North Hall",
    description:
      "Cold, massive, and echoing. You have 24 hours to load in a stadium-sized rig.",
  },
};

// --- PRODUCTIONS ---
export const PRODUCTIONS: Production[] = [
  {
    id: "phantom",
    title: "Phantom of the Opera",
    poster: "🎭",
    description:
      "A technically complex musical requiring precise timing for fog and falling chandeliers.",
    learnMoreUrl:
      "https://en.wikipedia.org/wiki/The_Phantom_of_the_Opera_(1986_musical)",
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
    description:
      "A whimsical play relying on atmospheric lighting and subtle ambient soundscapes.",
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
    description:
      "A heavy drama. Stark, high-contrast lighting and oppressive audio are required.",
    learnMoreUrl: "https://en.wikipedia.org/wiki/The_Crucible",
    levels: {
      school: { venueId: "high_school", unlocked: true },
      community: { venueId: "regional", unlocked: false },
      professional: { venueId: "broadway", unlocked: false },
    },
  },
  {
    id: "macbeth",
    title: "Macbeth",
    poster: "🗡️",
    description:
      "A cursed production. Everything that can go wrong, will go wrong. Hope you brought gaffer tape.",
    learnMoreUrl: "https://en.wikipedia.org/wiki/Macbeth",
    levels: {
      school: { venueId: "high_school", unlocked: true },
      community: { venueId: "regional", unlocked: false },
      professional: { venueId: "broadway", unlocked: false },
    },
  },
  {
    id: "prod_hamlet_space",
    title: "Hamlet: In Space",
    poster: "🌌",
    description:
      "A local high school's deeply misguided attempt to modernize Shakespeare. Expect aluminum foil costumes, laser pointers, and actors forgetting their lines.",
    learnMoreUrl: "https://en.wikipedia.org/wiki/Hamlet",
    levels: {
      school: { venueId: "high_school", unlocked: true },
    },
  },
  {
    id: "prod_les_mis_community",
    title: "Les Misérables (Non-Equity)",
    poster: "🇫🇷",
    description:
      "The community theatre has bitten off more than it can chew. Fifty cast members, only twelve working wireless mics. A barricade made of actual trash that takes five minutes to push onstage.",
    learnMoreUrl: "https://en.wikipedia.org/wiki/Les_Misérables_(musical)",
    levels: {
      community: { venueId: "church", unlocked: false },
    },
  },
  {
    id: "prod_corporate_keynote",
    title: "TechCorp Annual Keynote",
    poster: "📊",
    description:
      "Not art, but it pays the bills. A billionaire CEO needs to walk out to blinding rock-show lights to announce a slightly thinner smartphone. Zero margin for error.",
    learnMoreUrl: "https://en.wikipedia.org/wiki/Keynote",
    levels: {
      professional: { venueId: "convention_center", unlocked: false },
    },
  },
];
