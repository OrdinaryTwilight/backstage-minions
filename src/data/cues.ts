export interface Cue {
  id: string;
  name: string;
  targetLevel: number;
  timeWindow: number;
}

export const CUE_SHEETS: Record<string, Cue[]> = {
  lighting: [
    { id: "lx_1", name: "House to Half", targetLevel: 50, timeWindow: 5 },
    { id: "lx_2", name: "House Out / Preshow", targetLevel: 0, timeWindow: 4 },
    { id: "lx_3", name: "Act 1 Opening", targetLevel: 80, timeWindow: 3 },
    {
      id: "lx_4",
      name: "Special: Downstage Center",
      targetLevel: 100,
      timeWindow: 2,
    },
    { id: "lx_5", name: "Blackout", targetLevel: 0, timeWindow: 1.5 },
  ],
  sound: [
    { id: "snd_1", name: "Preshow Music Fade", targetLevel: 30, timeWindow: 5 },
    { id: "snd_2", name: "Mic 1 (Lead) UP", targetLevel: 85, timeWindow: 2 },
    {
      id: "snd_3",
      name: "SFX: Thunderclap",
      targetLevel: 100,
      timeWindow: 1.5,
    },
    { id: "snd_4", name: "Chorus Mics UP", targetLevel: 75, timeWindow: 3 },
    { id: "snd_5", name: "All Mics MUTE", targetLevel: 0, timeWindow: 2 },
  ],
  // UX/LOGIC FIX: Added Scenic Cues so the Flyman can run the execution stage
  scenic: [
    {
      id: "scn_1",
      name: "Fly In: Act 1 Portal",
      targetLevel: 100,
      timeWindow: 4,
    },
    { id: "scn_2", name: "Fly Out: Chandelier", targetLevel: 0, timeWindow: 3 },
    {
      id: "scn_3",
      name: "Wagon: Downstage Center",
      targetLevel: 80,
      timeWindow: 2.5,
    },
    {
      id: "scn_4",
      name: "Fly In: Forest Backdrop",
      targetLevel: 100,
      timeWindow: 3,
    },
    {
      id: "scn_5",
      name: "Fly Out: All Scenery (Strike)",
      targetLevel: 0,
      timeWindow: 2,
    },
  ],
  // UX/LOGIC FIX: Added Management Cues so the SM can run the execution stage
  management: [
    { id: "sm_1", name: "Call: House to Half", targetLevel: 50, timeWindow: 5 },
    { id: "sm_2", name: "Call: LX Blackout", targetLevel: 100, timeWindow: 2 },
    {
      id: "sm_3",
      name: "Call: Sound SFX GO",
      targetLevel: 80,
      timeWindow: 2.5,
    },
    {
      id: "sm_4",
      name: "Call: Standby Fly Rail",
      targetLevel: 60,
      timeWindow: 4,
    },
    {
      id: "sm_5",
      name: "Call: Fly Rail GO",
      targetLevel: 100,
      timeWindow: 1.5,
    },
  ],
};
