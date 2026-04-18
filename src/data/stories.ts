import { Story } from "../types/game"; // Assuming Difficulty is exported from here or defined globally

// --- STORIES ---
export const STORIES: Story[] = [
  {
    id: "story_1",
    title: "The All-Black Uniform",
    content: `In professional theatre, your goal is to be a shadow. The tradition of wearing "theatre blacks" is a philosophy of "Invisible Excellence." When a stagehand moves a piano mid-scene or an electrician adjusts a side-light during a blackout, they must remain unseen to preserve the "Theatrical Illusion." If the audience notices the crew, the magic is broken. Historically, this camouflaged labor ensures focus remains on the art, though it often means technical crew only receive recognition when something goes wrong. To wear the black uniform is to accept that your greatest success is being completely forgotten by the audience.`,
    unlockedBy: { productionId: "phantom", difficulty: "school", minStars: 1 },
  },
  {
    id: "story_2",
    title: "The God Voice",
    content: `During a performance, the Stage Manager (SM) is the ultimate authority. From their position in the booth—surrounded by monitors and headsets—they watch the action with clinical precision. When the SM speaks over the "God Mic" (PA system) or the private comms channel, the crew listens. This isn't just about hierarchy; it's about safety. A show with a hundred moving parts requires a single "brain" to synchronize them. When you hear the SM call "Standby," your hand should be on the button. When they call "Go," you fire. In that moment, the SM isn't just a coworker; they are the rhythmic pulse of the entire production.`,
    unlockedBy: { productionId: "phantom", difficulty: "school", minStars: 2 },
  },
  {
    id: "story_3",
    title: "The Architecture of Sound",
    content: `Sound design isn't just about volume; it's about defining the physics of an imaginary space. A Sound Designer must account for the "Acoustic Signature" of the room—how high frequencies are absorbed by the audience's clothing and how low frequencies build up in the corners of the balcony. When mapping a stage for sound, you are placing "Foldback" speakers so actors can hear themselves and "Main Arrays" to ensure the person in the last row of the gallery hears the same clarity as the front row. It is a delicate balance of phase alignment and EQ carving, ensuring technology disappears so storytelling can take center stage.`,
    unlockedBy: {
      productionId: "midsummer",
      difficulty: "community",
      minStars: 2,
    },
  },
  {
    id: "story_4",
    title: "The Ghost Light",
    content: `When the theatre is empty and the 'Work Lights' are killed, a single bare bulb remains burning center stage: The Ghost Light. Practically, it’s a safety measure to keep the first person in the building from falling into the pit. Conceptually, it’s an offering to the 'Theatre Ghosts'—a promise that the stage is never truly dead. In the technical world, the Ghost Light is the silent sentinel of the workspace, marking the boundary between the chaos of tech week and the stillness of the night.`,
    unlockedBy: {
      productionId: "macbeth",
      difficulty: "professional",
      minStars: 3,
    },
  },
  {
    id: "story_5",
    title: "The 10-out-of-12",
    content: `In the final days before an opening, the crew enters the '10-out-of-12'—a grueling twelve-hour day with only a two-hour break. This is where 'Tech Fatigue' sets in. It is a test of stamina and social grace. You learn exactly how your colleagues take their coffee and who becomes a 'Grumpy Electrician' after hour eight. It’s during these long hours that the most creative 'Gaffer Tape' solutions are born, as the line between brilliance and exhaustion begins to blur.`,
    unlockedBy: {
      productionId: "crucible",
      difficulty: "professional",
      minStars: 1,
    },
  },
  {
    id: "story_6",
    title: "The Macbeth Incident of 2019",
    content: `Ask Owen about his eyebrows, and he’ll go quiet. It was closing night of the Scottish Play.\n\nThe director insisted on 'authentic' atmospherics. That meant real flash powder and a custom-built cauldron downstage center. What the director didn't account for was the draft from the loading dock doors being cracked open by a stagehand trying to catch a smoke.\n\nWhen the witches threw their 'ingredients' in, the draft caught the powder. A fireball the size of a Honda Civic engulfed the apron. Nobody died, but the front row lost their arm hair, and Owen hasn't trusted a director's 'artistic vision' since. The scorch mark is still there under the stage right marley.`,
    unlockedBy: {
      productionId: "macbeth",
      difficulty: "school",
      minStars: 3,
    },
  },
  {
    id: "story_7",
    title: "The Phantom of the Adelphi",
    content: `Every theatre has a ghost. Ours is named Arthur (no relation to the current director, though equally dramatic).\n\nThey say Arthur was a flyman in the 1920s who dropped a sandbag on a terrible lead tenor and was cursed to wander the grid forever. The truth? The 'footsteps' on the catwalks are just the thermal expansion of the old iron grid when the stage lights heat up.\n\nBut last year, during a blackout, the ghost light was found entirely unscrewed and placed neatly on the prompt desk. Nobody admitted to doing it. We leave a cup of terrible breakroom coffee out for Arthur on opening nights. Just in case.`,
    unlockedBy: {
      productionId: "prod_phantom_vengeance",
      difficulty: "professional",
      minStars: 2,
    },
  },
  {
    id: "story_8",
    title: "The Great Gaff Tape Famine",
    content: `It was tech week for a massive touring musical. The truck with all the expendables broke down three states away.\n\nBy Thursday, we had exhausted our supply of black gaff tape. By Friday afternoon, we were out of white, gray, and even the neon spike tape. In desperation, the crew resorted to using medical tape from the first aid kits, chewing gum, and a distressing amount of zip-ties to hold the set together.\n\nThe show went up. Nothing fell apart. But to this day, if you look closely at the back of the false proscenium, you can still see a piece of spearmint gum holding a DMX cable in place.`,
    unlockedBy: {
      productionId: "prod_les_mis_community",
      difficulty: "community",
      minStars: 2,
    },
  },
  {
    id: "story_9",
    title: "Why We Stay in the Dark",
    content: `Tech week is a meat grinder. You sleep under the console. You eat stale bagels. You hate the actors, you hate the director, you hate the art.\n\nBut then comes Opening Night. The house goes to half. The overture swells in the pit. You call 'Standby LX 1. Standby Sound 1.' The backstage goes dead silent. You can hear the actors breathing in the wings.\n\nYou say 'Go.' The stage is bathed in light. The audience gasps.\n\nIn that singular second, the exhaustion vanishes. You are the invisible god making the magic happen. And you know you'll come back and do it all over again tomorrow.`,
    unlockedBy: {
      productionId: "prod_corporate_keynote",
      difficulty: "professional",
      minStars: 3,
    },
  },
  {
    id: "story_10",
    title: "The Maestro's Meltdown",
    content: `The conductor for the holiday ballet was a tyrant. He demanded the pit be kept at exactly 68 degrees and would throw his baton if a trumpet was out of tune.\n\nDuring the Act 1 finale, his digital score tablet died. Instead of conducting from memory, he threw a tantrum, dropped his baton, and walked out of the pit.\n\nWithout missing a beat, Sam (A1) slammed the fader for the emergency backing tracks, perfectly beat-matching the live orchestra just as they fell apart. Sam conducted the rest of the show from the sound console using a pencil. The Maestro was fired. Sam got a standing ovation from the brass section.`,
    unlockedBy: {
      productionId: "prod_midsummer_musical",
      difficulty: "professional",
      minStars: 2,
    },
  },
];
