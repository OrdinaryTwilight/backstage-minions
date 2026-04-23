/**
 * @file NPC Dialogue Trees
 * @description Branching dialogue conversations for all NPCs.
 *
 * Dialogue Architecture:
 * - **Dialogue Trees**: Maps of conversation nodes for each NPC
 * - **Variants**: Different text based on game state (stress, affinity, stage)
 * - **Generic Fallback**: GENERIC_DEPARTMENT_TREE used for NPCs without custom dialogue
 * - **Branching**: Player choices lead to different conversation paths
 *
 * Each NPC has their own dialogue tree unless they fall back to the generic tree.
 * Dialogues are context-aware and change based on game state.
 */

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
      { text: "Watch your step, {role}, we've got fresh spike marks down." },
      {
        condition: "post_show",
        text: "Great run today. My feet are killing me. You grabbing a broom for strike?",
      },
      {
        condition: "pre_show",
        text: "Is the house open yet? I'm still trying to track down a missing crescent wrench.",
      },
    ],
    choices: [
      { id: "c1", text: "Just doing the rounds.", nextNodeId: "rounds" },
      {
        id: "c2",
        text: "Do you need a hand with anything?",
        nextNodeId: "offer_help",
      },
      {
        id: "c3",
        text: "House isn't open yet, you have time.",
        nextNodeId: "reassure",
      },
    ],
  },
  rounds: {
    id: "rounds",
    variants: [
      {
        text: "Copy that. Stay clear of the {department} gear while we calibrate.",
      },
      { text: "Well, keep moving. We've got a show to put on." },
    ],
    choices: [{ id: "c1", text: "Will do.", nextNodeId: "end" }],
  },
  offer_help: {
    id: "offer_help",
    variants: [
      {
        text: "Actually, yes. We're short on gaff tape. If you find a roll on the props table, bring it to the {role} station.",
      },
      {
        text: "Could you check the basement storage for spare AA batteries? Audio is running dangerously low.",
      },
      {
        text: "The glow tape on the stairs peeled off. Can you grab some from props and re-spike it so nobody dies?",
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
  reassure: {
    id: "reassure",
    variants: [{ text: "Thank god. I'll get this sorted before places." }],
    choices: [{ id: "c1", text: "Good luck.", nextNodeId: "end" }],
  },
};

// 2. SPECIFIC DIALOGUE: Custom storylines for key characters
export const ZAINAB_WARDROBE_TREE: DialogueTree = {
  start: {
    id: "start",
    variants: [
      {
        text: "Finally! The lead's mic pack is pulling on their costume. We need a smaller pouch.",
      },
    ],
    timeLimitMs: 6000,
    timeoutNodeId: "go_find",
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

export const SHANE_LX_TREE: DialogueTree = {
  start: {
    id: "start",
    variants: [
      {
        text: "Who touched my gels? I had them perfectly ordered by wavelength and now there's an R02 mixed in with the CTOs!",
      },
    ],
    choices: [
      {
        id: "c1",
        text: "Wasn't me. I stick to my own department.",
        nextNodeId: "end",
      },
      {
        id: "c2",
        text: "Props might have borrowed some for a practical lamp.",
        nextNodeId: "blame",
      },
    ],
  },
  blame: {
    id: "blame",
    variants: [
      {
        text: "Typical. They think optical physics is just arts and crafts. I'll go have a word with Lia.",
      },
    ],
    choices: [{ id: "c1", text: "Good luck with that.", nextNodeId: "end" }],
  },
};

export const LIA_PROPS_TREE: DialogueTree = {
  start: {
    id: "start",
    variants: [
      {
        text: "If you are here to ask to borrow my good fabric scissors, the answer is immediately and aggressively NO.",
      },
    ],
    choices: [
      { id: "c1", text: "I just wanted to say hi.", nextNodeId: "end" },
      {
        id: "c2",
        text: "What if I need them for an absolute emergency?",
        nextNodeId: "scissors",
      },
    ],
  },
  scissors: {
    id: "scissors",
    variants: [{ text: "Then use your teeth. The scissors are sacred." }],
    choices: [
      { id: "c1", text: "Understood loud and clear.", nextNodeId: "end" },
    ],
  },
};

export const WYNN_AUDIO_TREE: DialogueTree = {
  start: {
    id: "start",
    variants: [
      {
        text: "I'm picking up massive RF interference on channel 4... is your phone in airplane mode?",
      },
    ],
    choices: [
      { id: "c1", text: "Yes, fully off.", nextNodeId: "end" },
      { id: "c2", text: "Oops, let me turn that off.", nextNodeId: "oops" },
    ],
  },
  oops: {
    id: "oops",
    variants: [
      {
        text: "Thank you. We can't afford a total signal dropout during the big solo.",
      },
    ],
    choices: [{ id: "c1", text: "Won't happen again.", nextNodeId: "end" }],
  },
};

export const NIKI_ME_TREE: DialogueTree = {
  start: {
    id: "start",
    variants: [
      {
        text: "Circuit 4 on the first electric just tripped again. Did someone plug a kettle into the stage relays?",
      },
    ],
    choices: [
      { id: "c1", text: "Probably the actors brewing tea.", nextNodeId: "tea" },
      {
        id: "c2",
        text: "I'll go check the distro rack.",
        nextNodeId: "end",
        pointDelta: 5,
      },
    ],
  },
  tea: {
    id: "tea",
    variants: [
      {
        text: "If I find chamomile leaves near my 20-amp breakers, I'm cutting the dressing room power entirely.",
      },
    ],
    choices: [{ id: "c1", text: "A fair response.", nextNodeId: "end" }],
  },
};

export const SM_EMERGENCY_TREE: DialogueTree = {
  start: {
    id: "start",
    variants: [
      {
        text: "Headset check. Whoever is operating the deck audio, the Director just decided to cut the entire intro monologue. We are jumping straight to musical cue 4. Can you adapt?",
      },
    ],
    timeLimitMs: 5000,
    timeoutNodeId: "too_late",
    choices: [
      {
        id: "c1",
        text: "Copy. Repatching cues on the fly. Give me 10 seconds.",
        nextNodeId: "repatching",
      },
      {
        id: "c2",
        text: "We can't! The console is locked to SMPTE timecode!",
        nextNodeId: "panic",
      },
    ],
  },
  repatching: {
    id: "repatching",
    variants: [
      {
        text: "Good. Bypassing cues 1 through 3. Standby to fire Cue 4 on my mark.",
      },
    ],
    choices: [
      {
        id: "c1",
        text: "Standing by on 4.",
        nextNodeId: "end",
        pointDelta: 15,
        sideEffect: "sm_trust_gained",
      },
    ],
  },
  panic: {
    id: "panic",
    variants: [
      { text: "Well figure it out! I am calling the cue in 5, 4, 3..." },
    ],
    choices: [
      {
        id: "c1",
        text: "Hit the GO button and pray.",
        nextNodeId: "end",
        pointDelta: -10,
      },
    ],
  },
  too_late: {
    id: "too_late",
    variants: [
      {
        text: "No response? Fine, I'm calling it anyway. Standby sound... GO.",
      },
    ],
    choices: [
      { id: "c1", text: "(Missed Cue)", nextNodeId: "end", pointDelta: -20 },
    ],
  },
};

export const DIALOGUE_REGISTRY: Record<string, DialogueTree> = {
  npc_zainab: ZAINAB_WARDROBE_TREE,
  npc_stage_manager_emergency: SM_EMERGENCY_TREE,
  char_shane: SHANE_LX_TREE,
  char_lia: LIA_PROPS_TREE,
  char_wynn: WYNN_AUDIO_TREE,
  char_nikki: NIKI_ME_TREE,
};
