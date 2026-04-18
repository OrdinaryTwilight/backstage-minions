export const CHAT_MESSAGES: Record<
  string,
  { sender: string; messages: string[] }
> = {
  sys_comms: {
    sender: "System Alerts",
    messages: [
      "ALERT: Cue 12 is approaching. Stand by.",
      "UPDATE: Cast is at 5 minutes to places.",
      "WARNING: Audio spike detected on Channel 4.",
      "REMINDER: Strike props after act 1.",
    ],
  },
  npc_zainab: {
    sender: "Zainab (Wardrobe)",
    messages: [
      "Thanks for the mic pouch earlier! Lifesaver.",
      "The lead's zipper is stuck. I'm panicking.",
      "Do we have any more gaff tape back there?",
    ],
  },
  npc_director: {
    sender: "The Director",
    messages: [
      "Where is my script?!",
      "I need the lighting to be more... moody. Can we do moody?",
      "Great run today everyone, despite the tech issues.",
    ],
  },
  npc_elara: {
    sender: "Elara (SM)",
    messages: [
      "Places in 5, people. Places in 5.",
      "Tech, are we ready for the blackout cue?",
      "Hold the house! We have a set piece stuck.",
    ],
  },
  npc_ben: {
    sender: "Ben (LX)",
    messages: [
      "Who touched my gels?",
      "Can we get a worklight on stage left? I can't see my cable run.",
      "Just patched the new moving lights. Looking sharp.",
      "Tell the actors to stop leaning on the booms.",
    ],
  },
  npc_casey: {
    sender: "Casey (Audio)",
    messages: [
      "Batteries are charged and mics are swept.",
      "Can everyone please stop dropping the comms packs?",
      "I'm picking up RF interference from someone's phone... turn them off!",
      "Does the lead sound muddy to you, or is it just me?",
    ],
  },
  // --- GROUP CHATS ---
  group_tech_survivors: {
    sender: "📱 Group: Tech Survivors",
    messages: [
      "Maya (Props): Who took my good fabric scissors? I am not asking nicely.",
      "Alex (LX): Check Wardrobe. They were looking for something to cut wire with earlier.",
      "Maya (Props): IF THEY CUT WIRE WITH MY SCISSORS I WILL BURN THIS THEATRE DOWN.",
      "River (Video): Bring me a Red Bull if you pass the vending machine.",
    ],
  },
  group_official: {
    sender: "📱 OFFICIAL: Cast & Crew",
    messages: [
      "Alex P. (SM): Call time is 6:00 PM. Not 6:05. If you are late, you are dead to me.",
      "Zainab (Wardrobe): Cast, please stop eating Cheetos in costume. The stains are permanent.",
      "Arthur (Director): Art cannot be bound by the hands of a clock, Alex.",
      "Alex P. (SM): Art pays union fines when it goes into overtime, Arthur. 6:00 PM.",
    ],
  },
  group_audio_only: {
    sender: "📱 Sound Dept (No LX Allowed)",
    messages: [
      "Jordan (Sound): The lead singer just asked me to add more 'talent' to their monitor mix.",
      "Casey (Audio): Just turn up the reverb and tell them you boosted the 'vibe' frequencies.",
      "Sam (A1): Standard protocol. Did it work?",
      "Jordan (Sound): Yes. They said it sounds 'much more authentic'. I hate it here.",
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
