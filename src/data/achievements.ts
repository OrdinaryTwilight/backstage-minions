/**
 * @file Achievements & Badges System
 * @description Achievement definitions for skill-based challenges.
 * 
 * Achievement Categories:
 * - **Cues**: Perfect timing challenges ("Ghost Light" - 100% perfect cues)
 * - **Social**: Relationship and dialogue challenges ("Gaffer God" - find items)
 * - **Stamina**: Stress management challenges
 * - **Secret**: Hidden easter eggs and special challenges
 * 
 * Currently defined but not fully integrated into gameplay.
 * Framework for future expansion of progression systems.
 */

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  conditionType: "cues" | "social" | "stamina" | "secret";
}

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: "ach_ghost_light",
    title: "The Ghost Light",
    description:
      "Complete a professional-level show with 100% Perfect cue timing. You are invisible, you are flawless.",
    icon: "💡",
    conditionType: "cues",
  },
  {
    id: "ach_gaffer_god",
    title: "Gaffer God",
    description:
      "Resolve 5 Conflicts using only items found in the Expendables category.",
    icon: "⬛",
    conditionType: "social",
  },
  {
    id: "ach_the_macbeth_curse",
    title: "The Scottish Curse",
    description:
      "Miss three critical cues in a row, causing a stage manager meltdown.",
    icon: "🩸",
    conditionType: "cues",
  },
  {
    id: "ach_caffeine_drip",
    title: "Intravenous Caffeine",
    description:
      "Consume 10 coffees during a single '10-out-of-12' tech rehearsal stage to keep your Stamina above 0.",
    icon: "☕",
    conditionType: "stamina",
  },
  {
    id: "ach_sm_whisperer",
    title: "The SM Whisperer",
    description:
      "Successfully de-escalate a furiously angry Stage Manager using social skills and a Venti Iced Americano.",
    icon: "📋",
    conditionType: "social",
  },
  {
    id: "ach_dark_arts",
    title: "The Dark Arts",
    description:
      "Fix a piece of broken audio equipment by hitting it with a crescent wrench.",
    icon: "🔧",
    conditionType: "secret",
  },
  {
    id: "ach_10_out_of_12",
    title: "I Survived Tech Week",
    description:
      "Complete your first full production from Load-In to Wrap-Up without quitting.",
    icon: "🎖️",
    conditionType: "stamina",
  },
];
