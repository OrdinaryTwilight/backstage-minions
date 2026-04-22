import { Conflict } from "../types/game";

export const CONFLICTS: Conflict[] = [
  {
    id: "conf_the_vanishing_prop",
    trigger: "planning",
    npc: "npc_des",
    description:
      "{npc_des} is frantically rummaging through a prop bin, hair disheveled. 'The lead's lucky pocket watch is gone! They refuse to go on stage without it, and the house opens in five minutes. I think I saw a stagehand take it to the sound booth for some reason... help me!'",
    choices: [
      {
        id: "heroic_search",
        text: "Don't panic. I'll check the sound booth while you distract the lead.",
        outcome: "resolved",
        pointDelta: 10,
        aftermathText:
          "You find the watch being used as a paperweight for a sound plot. {npc_des} hugs you. 'You're a lifesaver! I owe you big time!'",
        sideEffect: "ally_gained",
      },
      {
        id: "harsh_truth",
        text: "Tell the lead to grow up. It's just a watch, and we have a show to run.",
        outcome: "escalated",
        pointDelta: -15,
        aftermathText:
          "{npc_des} looks horrified. 'You can't say that to them! Now they're locked in their dressing room crying. This is a disaster.'",
      },
    ],
  },
  {
    id: "conf_the_aesthetic_clash",
    trigger: "rehearsal",
    npc: "npc_zainab",
    description:
      "{npc_zainab} blocks your path to the lighting console, arms crossed. 'I see what you're doing with those side-lights. That harsh blue is washing out the delicate lace on the protagonist’s cape! It looks like cheap plastic under your lights. You're ruining the vision!'",
    choices: [
      {
        id: "artistic_compromise",
        text: "Let's try a lavender gel instead. It'll keep the mood but preserve your textures.",
        outcome: "resolved",
        pointDelta: 12,
        aftermathText:
          "{npc_zainab} squinted at the stage, then nodded. '...It's acceptable. You actually have an eye for detail, don't you? Fine. Lavender it is.'",
        sideEffect: "ally_gained",
      },
      {
        id: "tech_priority",
        text: "The blue is for visibility. People need to actually see the actors.",
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
    npc: "npc_jd",
    description:
      "Mid-show, {npc_jd}'s voice crackles over your headset, sounding exhausted. 'Who is eating chips over an open mic? We're in the middle of a delicate soliloquy and all the Stage Manager can hear is CRUNCHING. Own up now.'",
    choices: [
      {
        id: "own_it",
        text: "It was me. My blood sugar was tanking. I'll stay off-mic from now on.",
        outcome: "resolved",
        pointDelta: 5,
        aftermathText:
          "{npc_jd} sighs. 'At least you're honest. Just... be more professional. We're a troupe, not a cafeteria.'",
      },
      {
        id: "deflect",
        text: "I think it's coming from the follow-spot position in the balcony.",
        outcome: "escalated",
        pointDelta: -10,
        aftermathText:
          "The chip eating continues. Now {npc_stage_manager} is yelling at the spot operators, and the whole crew is distracted. The vibes are officially rancid.",
      },
    ],
  },
  {
    id: "conf_the_gaffer_hoarder",
    trigger: "wrapup",
    npc: "npc_bryan",
    description:
      "Strike has begun, and everyone is out of gaffer tape. You see {npc_bryan} tucking a fresh roll into his personal bag. When you ask for some, he grunts. 'This is my personal stash. I’ve seen how you lot waste tape. Use tie-line or find your own.'",
    choices: [
      {
        id: "the_bribe",
        text: "I've got a spare energy drink in the fridge with your name on it for that roll.",
        outcome: "resolved",
        pointDelta: 8,
        aftermathText:
          "{npc_bryan}’s eyes light up. 'The one with the extra caffeine? Deal. Don't let the others see you using this.'",
        sideEffect: "ally_gained",
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
  {
    id: "conf_the_rogue_director",
    trigger: "rehearsal",
    npc: "npc_yg",
    description:
      "{npc_yg} walks up to your console during a tech run. 'I know we locked the cues, but what if right here, all the lights go completely red and we hear a massive heartbeat? It symbolizes their inner turmoil. Can you build that right now?'",
    choices: [
      {
        id: "diplomatic_stall",
        text: "That's a bold idea. Let me build it in the blind and we'll look at it during notes, so we don't stop the run.",
        outcome: "resolved",
        pointDelta: 15,
        aftermathText:
          "{npc_yg} beams. 'Yes! Protect the momentum of the run! I love working with artists.' {npc_stage_manager} gives you a thumbs up from the desk.",
      },
      {
        id: "hard_no",
        text: "We are in a run. The SM controls the flow, not me. Talk to {npc_stage_manager}.",
        outcome: "escalated",
        pointDelta: -5,
        aftermathText:
          "{npc_yg} scowls. 'You technicians have no soul.' He stomps over to the SM desk, halting the entire rehearsal to complain.",
      },
      {
        id: "do_it_live",
        text: "Sure, let's just busk it right now. I'll drop a heartbeat track.",
        outcome: "neutral",
        pointDelta: 0,
        aftermathText:
          "You throw up red lights. The actors are blinded and stop their lines. {npc_stage_manager} yells at you on comms for changing cues unprompted.",
      },
    ],
  },
  {
    id: "conf_the_rf_nightmare",
    trigger: "planning",
    npc: "char_jay",
    description:
      "{char_jay} runs up to you with a handful of mic transmitters. 'The local TV station just fired up a new broadcast tower and it's stepping all over our RF frequencies. Half the cast mics sound like radio static!'",
    choices: [
      {
        id: "re_scan",
        text: "Let's do a fresh frequency sweep of the venue and re-sync the packs. Tell the cast to hold.",
        outcome: "resolved",
        pointDelta: 20,
        aftermathText:
          "It takes 15 minutes, but you find clean airwaves. {char_jay} high-fives you. 'Clean audio is godliness.'",
      },
      {
        id: "turn_it_up",
        text: "Just boost the gain, it'll overpower the static once they start singing.",
        outcome: "escalated",
        pointDelta: -20,
        aftermathText:
          "During the opening number, the lead's mic blasts a local traffic report into the theater. It's a disaster.",
      },
    ],
  },
  {
    id: "conf_the_fly_rail_traffic",
    trigger: "execution",
    npc: "char_leo",
    description:
      "You're on comms. {char_leo}'s deep voice comes over: 'Lighting, you hung the new moving head too far upstage. If I drop the Act 2 backdrop right now, it's going to snag on your fixture and tear the canvas.'",
    choices: [
      {
        id: "compromise_fly",
        text: "Understood. Hold the drop halfway. I'll pan the fixture out of the way, then give you the clear.",
        outcome: "resolved",
        pointDelta: 15,
        aftermathText:
          "'Copy that. Awaiting your clear,' {char_leo} replies. You move the light, the drop comes in safely, and disaster is averted.",
      },
      {
        id: "blame_game",
        text: "That's where the plot said to hang it! Just drop the scenery carefully.",
        outcome: "escalated",
        pointDelta: -25,
        aftermathText:
          "{char_leo} drops it. *RIIIP.* The sound of tearing canvas echoes through the house. Scenic is going to murder you.",
      },
    ],
  },
  {
    id: "conf_the_quick_change",
    trigger: "execution",
    npc: "char_angel",
    description:
      "In the pitch-black wings, {char_angel} grabs your arm. 'The lead's wig is caught in their zipper! They are supposed to be on stage in twenty seconds! I need light, NOW!'",
    choices: [
      {
        id: "bite_light",
        text: "Turn on your mouth-held mini flashlight and use your hands to help unjam the zipper.",
        outcome: "resolved",
        pointDelta: 10,
        aftermathText:
          "With your light, {char_angel} frees the wig. The actor sprints on stage precisely on cue. 'You're my hero,' she whispers.",
      },
      {
        id: "phone_light",
        text: "Pull out your phone and turn on the flashlight at maximum brightness.",
        outcome: "neutral",
        pointDelta: -5,
        aftermathText:
          "You provide light, but the glaring LED phone beam spills out onto the stage, ruining the lighting designer's dark transition.",
      },
    ],
  },
  {
    id: "conf_front_of_house_delay",
    trigger: "execution",
    npc: "char_richmond",
    description:
      "{char_richmond} pages you. 'We have a massive line at the women's restroom and a VIP patron who just spilled wine on their shirt. I need a five-minute hold on the start of Act 2.'",
    choices: [
      {
        id: "grant_hold",
        text: "Relay to SM: 'FOH requests a five-minute hold.' Keep the house lights up.",
        outcome: "resolved",
        pointDelta: 10,
        aftermathText:
          "The SM sighs but agrees. {char_richmond} handles the VIP. The audience is seated calmly. Good communication.",
      },
      {
        id: "push_forward",
        text: "Tell FOH: 'We are on a strict union clock. We are going in two minutes regardless.'",
        outcome: "escalated",
        pointDelta: -10,
        aftermathText:
          "Act 2 starts while 50 people are still flooding down the aisles, blocking sightlines and shining phone flashlights. Chaos.",
      },
    ],
  },
];
