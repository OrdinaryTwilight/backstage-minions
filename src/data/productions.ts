import { Production, Venue } from "./types";

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
      school: { venueId: "venue_highschool", unlocked: true },
      community: { venueId: "venue_community", unlocked: false },
      professional: { venueId: "venue_regional", unlocked: false },
    },
  },
];

export const PRODUCTION_STAGES = [
  "equipment",
  "planning",
  "sound_design",
  "execution",
  "cable_coiling",
  "wrapup",
];
