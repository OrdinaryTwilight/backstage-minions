// src/data/quests.ts
import { NARRATIVE } from "./narrative";

export interface QuestDefinition {
  id: string;
  requiredItem: string;
  pickupZone: string;
  pickupNpcName: string;
  pickupIcon: string;
  targetNpcId?: string;
  targetZoneId?: string;
  scoreReward: number;
  narrativeRef: keyof typeof NARRATIVE.quests;
}

export const QUEST_REGISTRY: QuestDefinition[] = [
  {
    id: "actor_water",
    requiredItem: "Water Bottle",
    pickupZone: "snackTable",
    pickupNpcName: "Craft Services",
    pickupIcon: "🍩",
    targetNpcId: "npc_madeline",
    scoreReward: 20,
    narrativeRef: "water",
  },
  {
    id: "lx_tape",
    requiredItem: "Gaff Tape",
    pickupZone: "propsTable",
    pickupNpcName: "Maya (Props)",
    pickupIcon: "⚒️",
    targetZoneId: "lightBooth",
    targetNpcId: "char_alex",
    scoreReward: 20,
    narrativeRef: "tape",
  },
  {
    id: "director_script",
    requiredItem: "Director's Script",
    pickupZone: "stageManager",
    pickupNpcName: "Alex P. (SM)",
    pickupIcon: "📋",
    targetNpcId: "npc_arthur",
    scoreReward: 20,
    narrativeRef: "script",
  },
  {
    id: "audio_batteries",
    requiredItem: "AA Batteries",
    pickupZone: "storage",
    pickupNpcName: "Storage Bin",
    pickupIcon: "🔋",
    targetNpcId: "char_casey",
    scoreReward: 20,
    narrativeRef: "batteries",
  },
  {
    id: "spike_stairs",
    requiredItem: "Glow Tape",
    pickupZone: "propsTable",
    pickupNpcName: "Maya (Props)",
    pickupIcon: "⚒️",
    targetZoneId: "wings",
    scoreReward: 20,
    narrativeRef: "spikeTape",
  },
];
