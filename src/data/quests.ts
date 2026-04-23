/**
 * @file Quests & Side Objectives
 * @description Side missions players can complete for bonus score.
 * 
 * Quest System:
 * - **Quest Chain**: Pick up item from source location → deliver to target NPC
 * - **Mechanics**: Affects score, inventory, and NPC affinity
 * - **Rewards**: Bonus points (+20) and relationship building
 * - **Integration**: Can be triggered by dialogue choices or encountered during gameplay
 * 
 * Examples:
 * - Get water bottle from craft services, deliver to lead actor
 * - Pick up gaff tape, deliver to master electrician
 * - Fetch director's script from SM, deliver to director
 */

// src/data/quests.ts
import { NARRATIVE } from "./narrative";

export interface QuestDefinition {
  id: string;
  requiredItem: string;
  pickupZone: string;
  pickupNpcName: string;
  pickupIcon: string;
  // Enforcing that ALL quests must provide both pathways
  targetNpcId: string;
  targetZoneId: string;
  scoreReward: number;
  narrativeRef: keyof typeof NARRATIVE.quests;
}

export const QUEST_REGISTRY: QuestDefinition[] = [
  {
    id: "actor_water",
    requiredItem: "Water Bottle",
    pickupZone: "snackTable", // Green Room
    pickupNpcName: "Craft Services",
    pickupIcon: "🍩",
    targetNpcId: "npc_bethany", // Bethany (Lead Actor)
    targetZoneId: "couch", // Green Room
    scoreReward: 20,
    narrativeRef: "water",
  },
  {
    id: "lx_tape",
    requiredItem: "Gaff Tape",
    pickupZone: "propsTable", // Backstage
    pickupNpcName: "Props Table",
    pickupIcon: "⚒️",
    targetNpcId: "char_nikki", // Alex (Master Electrician)
    targetZoneId: "lightBooth", // Backstage
    scoreReward: 20,
    narrativeRef: "tape",
  },
  {
    id: "director_script",
    requiredItem: "Director's Script",
    pickupZone: "npc_stage_manager", // Backstage (NPC Interaction)
    pickupNpcName: "Alex (SM)",
    pickupIcon: "📋",
    targetNpcId: "npc_yg", // YG (Director)
    targetZoneId: "orchestraPit", // Backstage
    scoreReward: 20,
    narrativeRef: "script",
  },
  {
    id: "audio_batteries",
    requiredItem: "AA Batteries",
    pickupZone: "storage", // Basement
    pickupNpcName: "Storage Bin",
    pickupIcon: "🔋",
    targetNpcId: "char_wynn", // Wynn (Audio Systems)
    targetZoneId: "soundBooth", // Backstage
    scoreReward: 20,
    narrativeRef: "batteries",
  },
  {
    id: "spike_stairs",
    requiredItem: "Glow Tape",
    pickupZone: "loadingDock", // Basement
    pickupNpcName: "Road Case",
    pickupIcon: "📦",
    targetNpcId: "npc_des", // Des (Assistant Stage Manager)
    targetZoneId: "wings", // Backstage
    scoreReward: 20,
    narrativeRef: "spikeTape",
  },
];
