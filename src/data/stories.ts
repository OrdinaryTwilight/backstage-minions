import { Story } from "../types/game";

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
];
