// src/data/conflicts.ts
import { Conflict } from "../types/game";

export const CONFLICTS: Conflict[] = [
  {
    id: "conf_the_vanishing_prop",
    trigger: "planning",
    npc: "Sam (ASM)",
    description:
      "Sam is frantically rummaging through a prop bin, hair disheveled. 'The lead's lucky pocket watch is gone! They refuse to go on stage without it, and the house opens in five minutes. I think I saw a stagehand take it to the sound booth for some reason... help me!'",
    choices: [
      {
        id: "heroic_search",
        text: "Don't panic. I'll check the sound booth while you distract the lead.",
        outcome: "resolved",
        pointDelta: 10,
        aftermathText:
          "You find the watch being used as a paperweight for a sound plot. Sam hugs you. 'You're a lifesaver! I owe you a coffee—no, a whole bag of beans!'",
        sideEffect: "add_contact_sam",
      },
      {
        id: "harsh_truth",
        text: "Tell the lead to grow up. It's just a watch, and we have a show to run.",
        outcome: "escalated",
        pointDelta: -15,
        aftermathText:
          "Sam looks horrified. 'You can't say that to them! Now they're locked in their dressing room crying. This is a disaster.'",
      },
    ],
  },
  {
    id: "conf_the_aesthetic_clash",
    trigger: "rehearsal",
    npc: "Zainab (Wardrobe)",
    description:
      "Zainab blocks your path to the lighting console, arms crossed. 'I see what you're doing with those side-lights. That harsh blue is washing out the delicate lace on the protagonist’s cape! It looks like cheap plastic under your lights. You're ruining the vision!'",
    choices: [
      {
        id: "artistic_compromise",
        text: "Let's try a lavender gel instead. It'll keep the mood but preserve your textures.",
        outcome: "resolved",
        pointDelta: 12,
        aftermathText:
          "Zainab squinted at the stage, then nodded. '...It's acceptable. You actually have an eye for detail, don't you? Fine. Lavender it is.'",
        sideEffect: "unlock_story_wardrobe",
      },
      {
        id: "tech_priority",
        text: "The blue is for visibility, Zainab. People need to actually see the actors.",
        outcome: "neutral",
        pointDelta: 2,
        aftermathText:
          "She scoffs. 'Visibility at the cost of beauty? How typical of the tech department.'",
      },
    ],
  },
  {
    id: "conf_comms_etiquette",
    trigger: "execution",
    npc: "Elara (Production Manager)",
    description:
      "Mid-show, Elara's voice crackles over your headset, sounding exhausted. 'Who is eating chips over an open mic? We're in the middle of a delicate soliloquy and all the Stage Manager can hear is CRUNCHING. Own up now.'",
    choices: [
      {
        id: "own_it",
        text: "It was me. My blood sugar was tanking. I'll stay off-mic from now on.",
        outcome: "resolved",
        pointDelta: 5,
        aftermathText:
          "Elara sighs. 'At least you're honest. Just... be more professional. We're a troupe, not a cafeteria.'",
      },
      {
        id: "deflect",
        text: "I think it's coming from the follow-spot position in the balcony.",
        outcome: "escalated",
        pointDelta: -10,
        aftermathText:
          "The chip eating continues. Now the SM is yelling at the spot operators, and the whole crew is distracted. The vibes are officially rancid.",
      },
    ],
  },
  {
    id: "conf_the_gaffer_hoarder",
    trigger: "wrapup",
    npc: "Mateo (Head Rigger)",
    description:
      "Strike has begun, and everyone is out of gaffer tape. You see Mateo tucking a fresh roll into his personal bag. When you ask for some, he grunts. 'This is my personal stash. I’ve seen how you lot waste tape. Use tie-line or find your own.'",
    choices: [
      {
        id: "the_bribe",
        text: "I've got a spare energy drink in the fridge with your name on it for that roll.",
        outcome: "resolved",
        pointDelta: 8,
        aftermathText:
          "Mateo’s eyes light up. 'The one with the extra caffeine? Deal. Don't let the others see you using this.'",
        sideEffect: "add_contact_mateo",
      },
      {
        id: "guilt_trip",
        text: "If we don't tape down these cables, someone is going to trip and sue the company.",
        outcome: "neutral",
        pointDelta: 0,
        aftermathText:
          "He throws you a half-used roll of duct tape instead. 'Fine, but don't expect me to be happy about it.'",
      },
    ],
  },
];
