import { Conflict } from "../types/game";

// --- CONFLICTS ---
export const CONFLICTS: Conflict[] = [
  {
    id: "costume_vs_lighting",
    trigger: "planning",
    npc: "Costume Designer",
    description: 'The Costume Designer storms into the booth: "Your warm amber wash is going to make the white dresses look YELLOW on stage. Did you even think about us before you drafted this?"',
    choices: [
      {
        id: "diplomatic",
        text: "Technical Fix: \"You're right—let's look at the plot together and find a cooler gel to compensate.\"",
        outcome: "resolved",
        pointDelta: 50,
        aftermathText: "The designer sighs, their tension visibly dropping. 'Thank you. I spent weeks on these silks; I’d hate for them to look like mud under the lights.'",
        sideEffect: "costume_contact_unlocked",
      },
      {
        id: "compromise",
        text: "Operational Fix: \"We can leave the color as is but dim the intensity during their solos.\"",
        outcome: "neutral",
        pointDelta: 20,
        aftermathText: "They cross their arms, still skeptical. 'It's a start, but I’m telling the Stage Manager we need a proper look at this during tech.'",
      },
      {
        id: "defensive",
        text: "The Hard Line: \"I'm the LD here. The wash stays as planned—the atmosphere is more important than a dress.\"",
        outcome: "escalated",
        pointDelta: -30,
        aftermathText: "They turn on their heel and storm out. You hear them muttering about 'arrogant designers' all the way down the hall.",
      },
    ],
  },
  {
    id: "late_cue",
    trigger: "execution",
    npc: "Stage Manager",
    description: 'The headset crackles: "LX2 was four bars late again. The cast is losing confidence. What is happening at the board, people?"',
    choices: [
      {
        id: "honest",
        text: "Accountability: \"Sorry, I miscounted the measures. Can we take it from the top of the scene?\"",
        outcome: "resolved",
        pointDelta: 30,
        aftermathText: "'Copy that. Let's reset to places. Everyone, from the top—and let's stay sharp.'",
      },
      {
        id: "technical_fix",
        text: "Technical Solution: \"I'll set a visual mark in the wings to ensure I hit it before the music swells.\"",
        outcome: "resolved",
        pointDelta: 40,
        aftermathText: "'Good initiative. I’ll clear that with the ASM. Let's see it work this time.'",
      },
      {
        id: "blame",
        text: "Deflection: \"The conductor changed the tempo without telling the tech crew!\"",
        outcome: "escalated",
        pointDelta: -20,
        aftermathText: "A cold silence hangs on the comms for a moment. 'Blaming the pit won't fix your timing. Focus, or we're staying late tonight.'",
      },
    ],
  },
  {
    id: "broken_comms",
    trigger: "equipment",
    npc: "Senior Technician",
    description: "During load-in, the head of the venue hands you a box of tangled, dusty cables. 'Half of these don't work, and the other half are probably haunted. Good luck.'",
    choices: [
      {
        id: "repair",
        text: "Technical Grind: Spend an hour testing and soldering the leads yourself.",
        outcome: "resolved",
        pointDelta: 40,
        aftermathText: "The Senior Tech raises an eyebrow as you finish. 'Actually knowing which end of the iron is hot? Rare for a newcomer. Not bad.'",
        sideEffect: "ally_gained"
      },
      {
        id: "request",
        text: "Resourceful: 'I’m not risking the show on these. I’ll call the rental house for a rush delivery.'",
        outcome: "neutral",
        pointDelta: 10,
        aftermathText: "They shrug. 'It's your budget, kid. Hope the producer doesn't mind the line item.'",
      },
      {
        id: "ignore",
        text: "Lazy: Just use the cables and hope for the best during the show.",
        outcome: "escalated",
        pointDelta: -50,
        aftermathText: "The Tech mutters, 'Right. I'll make sure to have the fire extinguisher ready then.'",
      }
    ]
  }
];