export const STAGE_INSTRUCTIONS = {
  cable_coiling:
    "Grab the cable and use the buttons/W and D keys to coil it with the over-under method. Alternate directions to avoid twists!",
  planning: "Review the SM's requirements and draft the rig accordingly.",
  sound_console:
    "Mix the channels to match the target levels. Watch out for feedback spikes!",
  cue_execution:
    "Set all the faders so that the output is green, then hit the GO button exactly when the timeline reaches the cue marker.",
  equipment:
    "Review the plot and pack your gig bag. Don't forget the essentials.",
  conflict: "Conflict! Choose the best response to keep the show moving.",
};

export const TUTORIALS = [
  {
    id: "tut_welcome_to_hell",
    title: "Welcome to the Dark",
    steps: [
      {
        speaker: "System Comms",
        text: "Read the SM Notes carefully. You must place at least the required number of Spot and Wash fixtures without exceeding the maximum total limit. Additionally, you must apply the specified Gobo pattern to at least one placed fixture. Select 'Rigging' to place lights, or 'Gobo Insert' to apply patterns to existing lights.",
      },
      {
        speaker: "Senior Tech",
        text: "Listen up, newbie. The actors get the applause, but if we screw up, the show stops. Your job is to make sure nobody ever notices you're here.",
      },
      {
        speaker: "Senior Tech",
        text: "Look at your HUD. You have Technical, Social, and Stamina stats. You'll need all three. Fixing a broken light is Technical. Stopping the director from crying is Social. Surviving a 16-hour tech day is Stamina.",
      },
    ],
  },
  {
    id: "tut_comms_etiquette",
    title: "Headset Discipline",
    steps: [
      {
        speaker: "Stage Manager",
        text: "I control the comms. When I say 'Standby', you stop breathing and put your finger on the GO button.",
      },
      {
        speaker: "Stage Manager",
        text: "Do not eat on headset. Do not gossip on the main channel. If you miss my 'Go' because you were talking about lunch, I will replace you with a very small rock.",
      },
    ],
  },
  {
    id: "tut_cable_coiling",
    title: "Over/Under Coiling",
    steps: [
      {
        speaker: "Audio Lead",
        text: "If you wrap my expensive XLR cables around your elbow like an extension cord, I will hunt you down.",
      },
      {
        speaker: "Audio Lead",
        text: "It's Over, then Under. Follow the natural twist of the copper. A properly coiled cable can be thrown across the stage without tangling. Respect the gear.",
      },
    ],
  },
  {
    id: "tut_the_quick_fix",
    title: "The Art of the Band-Aid",
    steps: [
      {
        speaker: "Props Master",
        text: "We don't have time to fix things perfectly during a show. We have time to make it survive until the curtain drops.",
      },
      {
        speaker: "Props Master",
        text: "Gaff tape, zip-ties, and sheer willpower. If it's stupid but it works, it ain't stupid. Just don't let the audience see it.",
      },
    ],
  },
];

// Add this to the bottom of src/data/tutorials.ts

export const STAGE_TUTORIAL_MAP: Record<string, string> = {
  equipment: "tut_the_quick_fix",
  planning: "tut_welcome_to_hell",
  sound_design: "tut_comms_etiquette",
  execution: "tut_comms_etiquette",
  cable_coiling: "tut_cable_coiling",
  conflict: "tut_the_quick_fix",
};

export function getStageHelpText(
  stageKey: keyof typeof STAGE_INSTRUCTIONS,
): string {
  // 1. Get the quick instruction
  let combinedText = STAGE_INSTRUCTIONS[stageKey] || "";

  // 2. Find the mapped narrative tutorial
  const tutorialId = STAGE_TUTORIAL_MAP[stageKey];
  const tutorial = TUTORIALS.find((t) => t.id === tutorialId);

  // 3. Append the narrative text if it exists
  if (tutorial) {
    combinedText += `\n\n--- VETERAN'S NOTES: ${tutorial.title.toUpperCase()} ---\n`;
    tutorial.steps.forEach((step) => {
      combinedText += `[${step.speaker}]: "${step.text}"\n`;
    });
  }

  return combinedText;
}
