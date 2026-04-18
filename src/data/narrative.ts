// src/data/narrative.ts

export const NARRATIVE = {
  bootSequence: [
    "Flipping off the ghost light...",
    "Sweeping the stage...",
    "Checking the callboard...",
    "Taping down the cable runs...",
    "Brewing the SM's coffee...",
    "Ready for places.",
  ],
  overworld: {
    npcChatter: [
      "Hope you've checked your cables.",
      "I'm so nervous for this run.",
      "Did someone steal my gaff tape again?!",
      "Break a leg out there!",
      "Excuse me, coming through!",
      "House opens in 10, let's go!",
    ],
    // Context-aware chatter based on the current stage
    chatterByStage: {
      planning: [
        "Let's get this plot laid out.",
        "Where are my drafting pencils?",
        "SM needs the ground plan ASAP.",
      ],
      equipment: [
        "Check that loadout.",
        "Who took the good wrenches?",
        "We need more DMX cables.",
      ],
      sound_design: [
        "Check 1, 2.",
        "Can we get more monitor mix?",
        "Frequencies are clear.",
      ],
      execution: ["Quiet backstage!", "Standby cue 1...", "Hold for applause."],
      cable_coiling: [
        "Over-under, people!",
        "Strike is going smoothly so far.",
        "Get those empties to the truck.",
      ],
      wrapup: [
        "Good show everyone.",
        "Time for the local pub.",
        "Leave the ghost light on.",
      ],
    },
    commsChatter: [
      { speaker: "SM", text: "Quiet on headset, please." },
      { speaker: "SM", text: "Standby all departments." },
      {
        speaker: "SM",
        text: "Who is eating chips on the comms? Mute your mic.",
      },
      { speaker: "LX", text: "Spot 2 is drifting, fixing it now." },
      { speaker: "LX", text: "Board is lagging a bit, hold on." },
      {
        speaker: "SND",
        text: "Mics 4 and 5 are hot, actors watch your mouths.",
      },
      {
        speaker: "SND",
        text: "Battery low on Mic 2, swap it at intermission.",
      },
      { speaker: "ASM", text: "Actors are at places." },
      {
        speaker: "WARDROBE",
        text: "We have a ripped seam, holding actors in Green Room!",
      },
      { speaker: "PROPS", text: "Who took my gaff tape?!" },
      { speaker: "DIRECTOR", text: "Can we make it brighter? It feels sad." },
    ],
  },
  quests: {
    water: {
      pickupText:
        "Just stale bagels left... but there is one fresh Water Bottle.",
      pickupAction: "Take Water Bottle",
      actorNeedText:
        "I can't go on stage like this... my throat is so dry. I need water...",
      actorThanksText:
        "Oh my gosh, water! My throat was so dry, I thought I'd die out there. Thank you so much!",
      giveAction: "Give Water Bottle (+20 pts)",
      searchAction: "I'll see if Craft Services has any.",
      feedbackAcquired: "Acquired: Water Bottle!",
      feedbackComplete: "Quest Complete! +20 Pts",
    },
    tape: {
      pickupText:
        "Hey, since you're walking around... Can you bring this Gaff Tape to the LX Booth?",
      pickupAction: "Take Gaff Tape",
      lxThanksText:
        "Yes! Gaff tape! You just saved the show. Lock in, we're starting soon.",
      giveAction: "Give Gaff Tape (+20 pts)",
      feedbackAcquired: "Acquired: Gaff Tape!",
      feedbackComplete: "Quest Complete! +20 Pts",
    },
    script: {
      pickupText:
        "The Director left their script on my desk again. Can you run this to the Green Room before house opens?",
      pickupAction: "Take Director's Script",
      directorNeedText:
        "I've completely lost my blocking notes... Have you seen my script?",
      directorThanksText:
        "Ah, my script! The SM found it? Excellent work, let's get ready for places.",
      giveAction: "Give Script (+20 pts)",
      searchAction: "I'll ask the SM.",
      ignoreAction: "Maybe later.",
      feedbackAcquired: "Acquired: Director's Script!",
      feedbackComplete: "Quest Complete! +20 Pts",
    },
  },
  networks: {
    char_ben: [
      {
        sender: "npc",
        text: "Hey, did you grab the gel swatch book from the booth?",
      },
      { sender: "player", text: "Yeah, I left it on the SM's desk." },
      { sender: "npc", text: "Lifesaver. See you at call time." },
    ],
    char_sam: [
      {
        sender: "npc",
        text: "Mics are patched. Can you run a line check on channel 4?",
      },
      { sender: "player", text: "Check 1, 2. Getting signal?" },
      { sender: "npc", text: "Loud and clear. We're holding for doors." },
    ],
    sys_comms: [
      { sender: "npc", text: "AUTOMATED ALERT: Show report submitted." },
      { sender: "npc", text: "0 Injuries, 2 Broken Props, 1 Crying Director." },
      { sender: "player", text: "Standard Tuesday." },
    ],
  },
  levelFlow: {
    strikeSkipText:
      "Hey, take a breather. The locals have the strike handled tonight. Head straight to the SM desk and sign off.",
    strikeSkipAction: '"Copy that. Thanks for the help!"',
  },
  wrapUp: {
    seniorTechText:
      "Alright, cables are coiled, board is covered, and the ghost light is on. Good hustle out there tonight. Let's go look at the SM's post-show report and head home.",
  },
  commsChatter: [
    { speaker: "SM", text: "Quiet on headset, please." },
    { speaker: "SM", text: "Standby all departments." },
    { speaker: "SM", text: "Who is eating chips on the comms? Mute your mic." },
    { speaker: "LX", text: "Spot 2 is drifting, fixing it now." },
    { speaker: "LX", text: "Board is lagging a bit, hold on." },
    { speaker: "LX", text: "Did someone unplug my monitor?" },
    { speaker: "SND", text: "Mics 4 and 5 are hot, actors watch your mouths." },
    { speaker: "SND", text: "Getting some feedback from downstage left." },
    { speaker: "SND", text: "Battery low on Mic 2, swap it at intermission." },
    { speaker: "ASM", text: "Actors are at places." },
    {
      speaker: "ASM",
      text: "We are missing the lead! Found them in the bathroom.",
    },
    {
      speaker: "WARDROBE",
      text: "We have a ripped seam, holding actors in Green Room!",
    },
    {
      speaker: "WARDROBE",
      text: "Need a flashlight in Dressing Room B, ASAP.",
    },
    { speaker: "PROPS", text: "Who took my gaff tape?!" },
    { speaker: "PROPS", text: "The fake sword is bent again." },
    { speaker: "DIRECTOR", text: "Can we make it brighter? It feels sad." },
  ],
} as const;
