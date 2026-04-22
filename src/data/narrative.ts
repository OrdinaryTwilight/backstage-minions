// src/data/narrative.ts

export const NARRATIVE = {
  bootSequence: [
    "Flipping off the ghost light...",
    "Sweeping the stage...",
    "Checking the callboard...",
    "Taping down the cable runs...",
    "Brewing the SM's coffee...",
    "Checking the callboard...",
    "Glow-taping the spike marks...",
    "Ready for places.",
  ],
  overworld: {
    npcChatter: {
      preShow: [
        "Hope you've checked your cables. The dancers wear heels tonight.",
        "I am running entirely on cold brew and anxiety.",
        "House opens in 10, why is the lead actor eating a powdered donut?",
        "If the director changes the blocking one more time...",
        "Are we holding for house? I need to use the bathroom terribly.",
        "Where are my drafting pencils? I literally just put them down.",
        "We are down to three functioning comms headsets. Fight to the death for them.",
      ],
      duringShow: [
        "Quiet backstage! I mean it!",
        "Stop pacing, you're making the floorboards creak.",
        "I can't see the conductor on my monitor. Who bumped the camera?",
        "If I hear that musical number one more time, I'm going to scream.",
        "Just nod when the director speaks. Then do what we planned anyway.",
        "Deep breaths. It's just a show. We're not saving lives.",
      ],
      postShow: [
        "Strike is going smoothly. Which means something is about to explode.",
        "I can't feel my fingers anymore, but the truck is packed.",
        "I need a shower to get this stage dust off me.",
        "Time for the local pub. First round is on the producers.",
        "Leave the ghost light on. Seriously, don't forget it.",
        "I'm never doing theater again. See you all tomorrow for the matinee.",
        "The show report is going to be a novel tonight.",
      ],
    },
  },
  commsChatter: {
    preShow: [
      {
        speaker: "SM",
        text: "Quiet on headset, please. We are holding for house.",
      },
      {
        speaker: "FOH",
        text: "House is at 90%. We have a patron demanding a refund because the stage is 'too high'.",
      },
      {
        speaker: "SM",
        text: "Tell them to write a letter. House to half, please.",
      },
      {
        speaker: "ASM",
        text: "We are missing the lead! ...Nevermind, found them in the bathroom.",
      },
      {
        speaker: "PROPS",
        text: "The fake sword is bent again. Remind actors not to actually hit each other.",
      },
    ],
    duringShow: [
      { speaker: "SM", text: "Standby LX 42 and Sound 12. Go." },
      {
        speaker: "LX",
        text: "Spot 2, you're lagging. Pick up the pace on the cross-stage cross.",
      },
      {
        speaker: "SPOT 2",
        text: "Sorry, I had a sneeze coming. Locking on now.",
      },
      {
        speaker: "SND",
        text: "Mics 4 and 5 are hot, actors in Green Room watch your mouths.",
      },
      {
        speaker: "SND",
        text: "Getting weird RF interference downstage left. Is there a cell phone near the wedge?",
      },
      {
        speaker: "WARDROBE",
        text: "Zipper stuck on quick change! Need 10 more seconds!",
      },
      { speaker: "SM", text: "Vamp the music. MD, vamp please!" },
      {
        speaker: "MD",
        text: "Vamping. We can do this progression about four more times before it gets sad.",
      },
      {
        speaker: "DIRECTOR",
        text: "Can we make it brighter? It feels sad. Can we add more yellow?",
      },
      { speaker: "SM", text: "YG, please get off the technical channel." },
      {
        speaker: "FLY",
        text: "Standby to fly the chandelier. It's heavy today.",
      },
      { speaker: "SM", text: "Chandelier is a go. Make it majestic, Leo." },
    ],
    postShow: [
      {
        speaker: "SM",
        text: "House is clear. Great run, folks. Begin strike.",
      },
      {
        speaker: "PROPS",
        text: "Who took the tape off my table? Bring it back.",
      },
      {
        speaker: "SND",
        text: "Mics are secured. I'm going home to sleep for a week.",
      },
    ],
  },
  quests: {
    water: {
      pickupText:
        "Just stale bagels left at Craft Services... but there is one fresh Water Bottle.",
      pickupAction: "Take Water Bottle",
      targetNeedText:
        "I can't go on stage like this... my throat is so dry. I need water...",
      targetThanksText:
        "Oh my gosh, water! My throat was so dry, I thought I'd die out there. Thank you so much!",
      giveAction: "Give Water Bottle (+20 pts)",
      searchAction: "I'll see if Craft Services has any in the Green Room.",
      feedbackAcquired: "Acquired: Water Bottle!",
      feedbackComplete: "Quest Complete! +20 Pts",
    },
    tape: {
      pickupText:
        "Hey, since you're walking around... Can you bring this Gaff Tape to Nikki or drop it off at the LX Booth?",
      pickupAction: "Take Gaff Tape",
      targetNeedText:
        "I've got cables snaking everywhere and no gaff tape to secure them. This is a disaster waiting to happen.",
      targetThanksText:
        "Yes! Gaff tape! You just saved the show. Lock in, we're starting soon.",
      giveAction: "Hand over Gaff Tape (+20 pts)",
      searchAction: "I'll ask Props if they have a spare roll.",
      feedbackAcquired: "Acquired: Gaff Tape!",
      feedbackComplete: "Quest Complete! +20 Pts",
    },
    script: {
      pickupText:
        "The Director left their script on my desk again. Can you run this to YG or leave it at his setup in the Orchestra Pit?",
      pickupAction: "Take Director's Script",
      targetNeedText:
        "I've completely lost my blocking notes... Have you seen my script anywhere?",
      targetThanksText:
        "Ah, my script! The SM found it? Excellent work, let's get ready for places.",
      giveAction: "Return Script (+20 pts)",
      searchAction: "I'll ask the SM if they've seen it.",
      ignoreAction: "Maybe later.",
      feedbackAcquired: "Acquired: Director's Script!",
      feedbackComplete: "Quest Complete! +20 Pts",
    },
    batteries: {
      pickupText:
        "You rummage through the basement Storage Bin and find a sealed pack of AA Batteries.",
      pickupAction: "Take AA Batteries",
      targetNeedText:
        "We are completely out of batteries at the sound booth. If my mics die, it's game over.",
      targetThanksText:
        "Oh, fresh batteries! You saved my solo. I owe you one.",
      giveAction: "Swap Batteries (+20 pts)",
      searchAction: "I'll check the basement storage bin.",
      feedbackAcquired: "Acquired: 8-pack of AA Batteries!",
      feedbackComplete: "Quest Complete! Crisis Averted.",
    },
    spikeTape: {
      pickupText:
        "You spot a fresh roll of Glow Tape sitting on an open road case at the loading dock.",
      pickupAction: "Grab Glow Tape",
      targetNeedText:
        "The glow tape peeled off the wings. Someone is going to break their neck in the dark. Have you seen the spare roll?",
      targetThanksText:
        "Good find! Let's get these spike marks laid down before the cast starts wandering around.",
      giveAction: "Re-spike stairs (+20 pts)",
      searchAction: "I'll look around the loading dock.",
      feedbackAcquired: "Acquired: Roll of Glow Tape!",
      feedbackComplete: "Quest Complete! Stage is safe.",
    },
  },
  networks: {
    char_shane: [
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
} as const;
