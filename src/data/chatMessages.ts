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
  default: {
    sender: "Crew Member",
    messages: [
      "Hey, are you free to help move a flat?",
      "Is the comms channel supposed to be buzzing?",
      "Let's grab drinks after strike.",
    ],
  },
};
