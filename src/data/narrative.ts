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
      "I am running entirely on cold brew and anxiety.",
      "Did someone steal my gaff tape again?! I will end them.",
      "Break a leg out there! Actually, don't, we don't have the insurance.",
      "Excuse me, coming through! Heavy thing! Sharp corners!",
      "House opens in 10, why is the lead actor eating a powdered donut?",
      "If the director changes the blocking one more time...",
      "I swear the ghost light flickered earlier.",
      "Don't talk to me, I'm trying to memorize 40 cues.",
      "Is it too late to fake an injury?",
    ],
    // Context-aware chatter based on the current stage
    chatterByStage: {
      planning: [
        "Let's get this plot laid out before the SM yells at us.",
        "Who let the director see the 3D render? Now they want lasers.",
        "Where are my drafting pencils? I literally just put them down.",
        "If you block my sightline to the stage, we're going to have words.",
      ],
      equipment: [
        "Check that loadout. Double check it. Triple check it.",
        "This cable was coiled by a psychopath. Look at these knots!",
        "Who took the good crescent wrench? I know it was Wardrobe.",
        "Do we have any working gel frames left? Half of these are bent.",
      ],
      sound_design: [
        "Check 1, 2. Sibilance. Sibilance.",
        "Can we get more monitor mix? The bassist is complaining again.",
        "Frequencies are clear. For now. Don't jinx it.",
        "If the lead actor drops their mic pack one more time...",
      ],
      execution: [
        "Quiet backstage! I mean it!",
        "Standby cue 1... fingers on the GO button.",
        "Hold for applause. Assuming there is any.",
        "Stop pacing, you're making the floorboards creak.",
      ],
      cable_coiling: [
        "Over-under, people! If you wrap it around your elbow I will fire you.",
        "Strike is going smoothly. Which means something is about to explode.",
        "Get those empties to the truck before it rains.",
        "I can't feel my fingers anymore, but the truck is packed.",
      ],
      wrapup: [
        "Good show everyone. I need a twelve hour nap.",
        "Time for the local pub. First round is on the producers.",
        "Leave the ghost light on. Seriously, don't forget it.",
        "I'm never doing theater again. See you all tomorrow for the matinee.",
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
    {
      speaker: "SM",
      text: "Quiet on headset, please. We are holding for house.",
    },
    { speaker: "SM", text: "Standby all departments. Places, please." },
    {
      speaker: "SM",
      text: "Who is heavy breathing into the comms? Mute your mic.",
    },
    {
      speaker: "LX",
      text: "Spot 2 is drifting again, trying to lock it down.",
    },
    {
      speaker: "LX",
      text: "Board is lagging a bit, hold on. Rebooting network switch.",
    },
    {
      speaker: "LX",
      text: "Did someone unplug my monitor? I have no video feed.",
    },
    {
      speaker: "SND",
      text: "Mics 4 and 5 are hot, actors in Green Room watch your mouths.",
    },
    {
      speaker: "SND",
      text: "Getting some weird feedback from downstage left. Is there a cell phone near the wedge?",
    },
    {
      speaker: "SND",
      text: "Battery low on Mic 2, ASM please swap it at intermission.",
    },
    { speaker: "ASM", text: "Actors are at places. Mostly." },
    {
      speaker: "ASM",
      text: "We are missing the lead! ...Nevermind, found them in the bathroom.",
    },
    {
      speaker: "WARDROBE",
      text: "We have a ripped seam, holding actors in Green Room! Need two minutes!",
    },
    {
      speaker: "WARDROBE",
      text: "Need a flashlight in Dressing Room B, ASAP. We lost an earring.",
    },
    { speaker: "PROPS", text: "Who took my gaff tape?! I will find you." },
    {
      speaker: "PROPS",
      text: "The fake sword is bent again. Remind actors not to actually hit each other.",
    },
    {
      speaker: "DIRECTOR",
      text: "Can we make it brighter? It feels sad. Can we add more yellow?",
    },
    { speaker: "SM", text: "Ignore the director, LX. Keep the plot." },
  ],
} as const;
