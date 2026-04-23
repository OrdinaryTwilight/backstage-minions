/**
 * @file Chat Messages & NPC Communications
 * @description NPC dialogue for the comms terminal messaging system.
 *
 * Chat System:
 * - **System Alerts**: Information channel for game notifications
 * - **NPC Chats**: Individual message threads with NPCs
 * - **Chat Choices**: Player responses with outcomes and side effects
 * - **Integration**: Accessed through CommsTerminal UI component
 *
 * Each NPC has pre-written messages simulating ongoing communication.
 * Players can respond with choices that affect affinity and story progression.
 */

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
    sender: "{npc_zainab} (Wardrobe)",
    messages: [
      "Thanks for the mic pouch earlier! Lifesaver.",
      "The lead's zipper is stuck. I'm panicking.",
      "Do we have any more gaff tape back there?",
    ],
  },
  npc_yg: {
    sender: "{npc_yg} (Director)",
    messages: [
      "Where is my script?!",
      "I need the lighting to be more... moody. Can we do moody?",
      "Great run today everyone, despite the tech issues.",
    ],
  },
  npc_elara: {
    sender: "{npc_elara} (Production Manager)",
    messages: [
      "Places in 5, people. Places in 5.",
      "Tech, are we ready for the blackout cue?",
      "Hold the house! We have a set piece stuck.",
    ],
  },
  npc_des: {
    sender: "{npc_des} (Stage Manager)",
    messages: [
      "Standby all departments. House is at half.",
      "Has anyone seen my glow tape?",
    ],
  },
  npc_bryan: {
    sender: "{npc_bryan} (Head Rigger)",
    messages: [
      "I swear to god if someone touches my rigging line...",
      "The motors on the first electric are running hot.",
      "Lunch in 10 minutes or I'm calling the union.",
    ],
  },
  char_jay: {
    sender: "{char_jay} (A2)",
    messages: [
      "Actor 3 just walked past me carrying an open cup of coffee near their mic pack.",
      "I am out of surgical tape. Send help.",
    ],
  },
  char_leo: {
    sender: "{char_leo} (Head Flyman)",
    messages: [
      "Weight is secured. Waiting for the go.",
      "Tell the lighting designer their new mover is blocking my drop.",
    ],
  },
  char_angel: {
    sender: "{char_angel} (Hair & Makeup)",
    messages: [
      "The lead is crying again. I need 5 minutes to fix the mascara.",
      "Whoever is using spirit gum to stick cables to the floor needs to stop.",
    ],
  },
  char_richmond: {
    sender: "{char_richmond} (House Manager)",
    messages: [
      "Lobby is clear. Ready to close the doors.",
      "We have a medical emergency in row K. Holding the show.",
      "Why is there a cast member trying to buy snacks at my concession stand?",
    ],
  },
  char_shane: {
    sender: "{char_shane} (LX)",
    messages: [
      "Just blew another lamp on the front wash. Need a spare.",
      "If the director asks for 'more blue' one more time, I'm quitting.",
      "Who left their half-empty coffee on my lighting console?!",
    ],
  },
  char_wynn: {
    sender: "{char_wynn} (Audio)",
    messages: [
      "Actor 4 dropped their mic pack in the toilet. Again.",
      "Can we please get some fresh AA batteries? These are all dead.",
      "The wireless interference today is going to give me an aneurysm.",
    ],
  },

  // --- GROUP CHATS ---
  group_tech_survivors: {
    sender: "📱 Group: Tech Survivors",
    messages: [
      "{char_lia} (Props): Who took my good fabric scissors? I am not asking nicely.",
      "{char_niki} (Audio): Check Wardrobe. They were looking for something to cut wire with earlier.",
      "{char_lia} (Props): IF THEY CUT WIRE WITH MY SCISSORS I WILL BURN THIS THEATRE DOWN.",
      "{char_river} (Video): Bring me a Red Bull if you pass the vending machine.",
    ],
  },
  group_official: {
    sender: "📱 OFFICIAL: Cast & Crew",
    messages: [
      "{npc_des} (SM): Call time is 6:00 PM. Not 6:05. If you are late, you are dead to me.",
      "{npc_zainab} (Wardrobe): Cast, please stop eating Cheetos in costume. The stains are permanent.",
      "{npc_yg} (Director): Art cannot be bound by the hands of a clock.",
      "{npc_des} (SM): Art pays union fines when it goes into overtime, {npc_yg}. 6:00 PM.",
    ],
  },
};

// Expanded the interactive choices for the new characters
export const CHAT_CHOICES: Record<string, ChatChoice[]> = {
  npc_des: [
    {
      text: "I'm ready for my shift.",
      response: "Great. Verify your equipment and standby.",
      sideEffect: "unlock_phantom",
    },
    {
      text: "What am I supposed to do?",
      response: "Look at the callboard, we have a show to run.",
    },
  ],
  npc_zainab: [
    {
      text: "I've got some extra gaff tape for you.",
      response: "You are a literal lifesaver. Bring it to the booth!",
    },
  ],
  npc_elara: [
    {
      text: "Tech is standing by for blackout.",
      response: "Copy that. Prepare to execute on my GO.",
    },
  ],
  npc_bryan: [
    {
      text: "I'll grab you a sandwich from catering.",
      response: "Make it two and I'll owe you a favor.",
    },
    {
      text: "Motors look fine from the booth.",
      response:
        "You can't feel the heat from the booth. I'm keeping an eye on it.",
    },
  ],
  char_jay: [
    {
      text: "Take my extra roll of tape.",
      response: "I'm naming my firstborn after you.",
    },
    {
      text: "Tell Actor 3 to dump the coffee.",
      response: "I did. They looked at me like I was speaking Greek.",
    },
  ],
  char_leo: [
    {
      text: "Moving the light now, you have clearance.",
      response: "Copy. Scenery is dropping.",
    },
  ],
  char_angel: [
    {
      text: "Need me to stall the SM?",
      response: "Please. Just give me two minutes for the setting spray.",
    },
  ],
  char_richmond: [
    {
      text: "Holding the show for medical. Keep us posted.",
      response: "Copy. Medics are en route.",
    },
    {
      text: "Send the actor back stage immediately.",
      response: "I'm physically shoving them through the stage door now.",
    },
  ],
  char_shane: [
    {
      text: "I'll grab a lamp from the basement.",
      response: "You're a lifesaver. Be careful on the ladder.",
      sideEffect: "ally_gained",
    },
    {
      text: "Tell the director no.",
      response: "I wish I had your confidence.",
    },
  ],
  char_wynn: [
    {
      text: "I have a stash of AAs in my bag.",
      response: "Thank god. Bring them to the booth ASAP.",
      sideEffect: "ally_gained",
    },
    {
      text: "Make Actor 4 pay for it.",
      response: "I'm sending the invoice to management right now.",
    },
  ],
};
