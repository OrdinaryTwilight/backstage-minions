// src/data/chatMessages.ts

export interface ChatChoice {
  text: string;
  response: string;
  sideEffect?: string;
}

export const CHAT_MESSAGES: Record<
  string,
  { sender: string; messages: string[] }
> = {
  sys_comms: {
    sender: "System Alerts",
    messages: [],
  },
  npc_zainab: {
    sender: "Zainab (Wardrobe)",
    messages: [
      "Thanks for the mic pouch earlier! Lifesaver.",
      "The lead's zipper is stuck. I'm panicking.",
      "Do we have any more gaff tape back there?",
    ],
  },
  npc_yg: {
    sender: "The Director",
    messages: [
      "Where is my script?!",
      "I need the lighting to be more... moody. Can we do moody?",
      "Great run today everyone, despite the tech issues.",
    ],
  },
  npc_jd: {
    sender: "JD (Production Manager)",
    messages: [
      "Places in 5, people. Places in 5.",
      "Tech, are we ready for the blackout cue?",
      "Hold the house! We have a set piece stuck.",
    ],
  },
  char_shane: {
    sender: "Shane (LX)",
    messages: [],
  },
  char_wynn: {
    sender: "Wynn (Audio)",
    messages: [],
  },

  // --- GROUP CHATS ---
  group_tech_survivors: {
    sender: "📱 Group: Tech Survivors",
    messages: [
      "Lia (Props): Who took my good fabric scissors? I am not asking nicely.",
      "Nikki (LX): Check Wardrobe. They were looking for something to cut wire with earlier.",
      "Lia (Props): IF THEY CUT WIRE WITH MY SCISSORS I WILL BURN THIS THEATRE DOWN.",
      "River (Video): Bring me a Red Bull if you pass the vending machine.",
    ],
  },
  group_official: {
    sender: "📱 OFFICIAL: Cast & Crew",
    messages: [
      "Alex (SM): Call time is 6:00 PM. Not 6:05. If you are late, you are dead to me.",
      "Zainab (Wardrobe): Cast, please stop eating Cheetos in costume. The stains are permanent.",
      "YG (Director): Art cannot be bound by the hands of a clock, Alex.",
      "Alex (SM): Art pays union fines when it goes into overtime, YG. 6:00 PM.",
    ],
  },
  group_audio_only: {
    sender: "📱 Sound Dept (No LX Allowed)",
    messages: [
      "Young Zen (Sound): The lead singer just asked me to add more 'talent' to their monitor mix.",
      "Wynn (Audio): Just turn up the reverb and tell them you boosted the 'vibe' frequencies.",
      "Sam (A1): Standard protocol. Did it work?",
      "Young Zen (Sound): Yes. They said it sounds 'much more authentic'. I hate it here.",
    ],
  },
  default: {
    sender: "Crew Member",
    messages: [
      "Hey, are you free to help move a flat?",
      "Is the comms channel supposed to be buzzing?",
      "Let's grab drinks after strike.",
    ],
  },
};

export const CHAT_CHOICES: Record<string, ChatChoice[]> = {
  npc_des: [
    {
      text: "I'm ready for my shift.",
      response:
        "Great. Click into the Phantom of the Opera callboard and select 'School' difficulty.",
      sideEffect: "unlock_phantom",
    },
    {
      text: "What am I supposed to do?",
      response:
        "We need an extra set of hands on Phantom. Look for the poster on the productions page.",
    },
  ],
  npc_zainab: [
    {
      text: "I've got some extra gaff tape for you.",
      response:
        "You are a literal lifesaver. Bring it to the quick-change booth!",
    },
    {
      text: "Try rubbing soap on the stuck zipper.",
      response: "Wait, that's actually a great trick. It worked! Thank you!",
    },
  ],
  npc_jd: [
    {
      text: "Tech is standing by for blackout.",
      response: "Copy that. Prepare to execute on my GO.",
    },
    {
      text: "Set piece is clear. We are good to proceed.",
      response: "Thank god. Releasing the hold. House lights going down.",
    },
  ],
  char_shane: [
    {
      text: "I didn't touch your gels, ask Props.",
      response: "Typical. I'll go have a word with Lia.",
    },
    {
      text: "Worklight coming up on stage left now.",
      response: "Much appreciated. I can finally see my cable runs.",
    },
  ],
  char_wynn: [
    {
      text: "I'll tape the comms packs to their belts.",
      response: "Please do. We can't afford to lose another transmitter.",
    },
    {
      text: "Lead definitely sounds muddy. Check the capsule?",
      response:
        "Good call. I think they sweat through the mic element again. Swapping it.",
    },
  ],
  npc_yg: [
    {
      text: "I found your script, it's on the SM desk.",
      response: "Ah! The sacred texts! Thank you.",
    },
    {
      text: "Working on making the lighting more 'moody'.",
      response: "Yes! More shadows! Let the darkness speak!",
    },
  ],
  group_tech_survivors: [
    {
      text: "I have the fabric scissors. They were left on the prop table.",
      response: "Lia (Props): BRING THEM TO ME IMMEDIATELY.",
    },
  ],
};
