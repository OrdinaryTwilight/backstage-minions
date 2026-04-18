// src/data/dialogues.ts
import { DialogueTree } from "../types/dialogue";

// 1. GENERIC DIALOGUE: Automatically applied to anyone missing a custom script
export const GENERIC_DEPARTMENT_TREE: DialogueTree = {
  start: {
    id: "start",
    variants: [
      {
        condition: "high_stress",
        text: "WE ARE HOLDING THE HOUSE FOR YOUR {department} ISSUE. FIX IT NOW!",
      },
      {
        text: "Hey, I'm a bit swamped here in {department}. Did the SM send you?",
      },
    ],
    choices: [
      { id: "c1", text: "Just doing the rounds.", nextNodeId: "rounds" },
      { id: "c2", text: "Do you need a hand?", nextNodeId: "offer_help" },
    ],
  },
  rounds: {
    id: "rounds",
    variants: [
      {
        text: "Copy that. Stay clear of the {department} gear while we calibrate.",
      },
    ],
    choices: [{ id: "c1", text: "Will do.", nextNodeId: "end" }],
  },
  offer_help: {
    id: "offer_help",
    variants: [
      {
        text: "Actually, yes. We're short on gaff tape. If you find a roll, bring it to the {role} station.",
      },
    ],
    choices: [
      {
        id: "c1",
        text: "I'll keep an eye out.",
        nextNodeId: "end",
        sideEffect: "start_gaff_quest",
      },
    ],
  },
};

// 2. SPECIFIC DIALOGUE: Custom storylines for key characters (like Zainab)
export const ZAINAB_WARDROBE_TREE: DialogueTree = {
  start: {
    id: "start",
    variants: [
      {
        text: "Finally! The lead's mic pack is pulling on their costume. We need a smaller pouch.",
      },
    ],
    // Time-pressured choice example!
    timeLimitMs: 6000,
    timeoutNodeId: "go_find", // If they don't answer in 6 seconds, default to this
    choices: [
      {
        id: "c1",
        text: "I have a spare neoprene pouch right here.",
        nextNodeId: "hand_over",
        requiredItem: "mic_pouch",
      },
      {
        id: "c2",
        text: "I'll go find one from the Audio kit.",
        nextNodeId: "go_find",
      },
    ],
  },
  hand_over: {
    id: "hand_over",
    variants: [
      {
        text: "Lifesaver. I'll remember this when you need a costume stitched.",
      },
    ],
    choices: [
      {
        id: "c1",
        text: "Happy to help.",
        nextNodeId: "end",
        sideEffect: "ally_gained",
        pointDelta: 5,
      },
    ],
  },
  go_find: {
    id: "go_find",
    variants: [{ text: "Hurry up. We are holding for house open." }],
    choices: [{ id: "c1", text: "On it.", nextNodeId: "end" }],
  },
};

// Map character IDs to their specific trees
export const DIALOGUE_REGISTRY: Record<string, DialogueTree> = {
  npc_zainab: ZAINAB_WARDROBE_TREE,
};
