import { ZoneConfig } from "./types";

export const OVERWORLD_MAPS: Record<string, Record<string, ZoneConfig>> = {
  stage: {
    lightBooth: {
      x: 650,
      y: 40,
      w: 100,
      h: 90,
      label: "LX BOOTH",
      color: "#4a4e69",
      isSolid: true,
      targetDept: "lighting",
    },
    soundBooth: {
      x: 650,
      y: 170,
      w: 100,
      h: 90,
      label: "SND BOOTH",
      color: "#22223b",
      isSolid: true,
      targetDept: "sound",
    },
    stageManager: {
      x: 100,
      y: 250,
      w: 80,
      h: 60,
      label: "SM DESK",
      color: "#9a031e",
      isSolid: true,
      dialogues: [
        {
          speaker: "Stage Manager",
          text: "We hold in 5! Have you verified the signal routing yet?",
          choices: [{ id: "ok", text: "On my way!" }],
        },
        {
          speaker: "Stage Manager",
          text: "Standby all departments... I need eyes on the main curtain.",
          choices: [{ id: "ok", text: "Standing by." }],
        },
      ],
    },
    propsTable: {
      x: 400,
      y: 350,
      w: 120,
      h: 60,
      label: "PROPS",
      color: "#5f0f40",
      isSolid: true,
      dialogues: [
        {
          speaker: "Props Master",
          text: "Hey! Don't touch the prop swords. I just repainted the fake blood.",
          choices: [{ id: "ok", text: "Backing away slowly..." }],
        },
      ],
    },
    wings: {
      x: 0,
      y: 0,
      w: 80,
      h: 450,
      label: "WINGS",
      color: "rgba(0,0,0,0.3)",
      isSolid: false,
      dialogues: [
        {
          speaker: "Stage Hand",
          text: "Clear the wings! We have a massive set piece coming through in 2 minutes.",
          choices: [{ id: "ok", text: "Moving out of the way." }],
        },
      ],
    },
    // THE DOOR TO THE GREEN ROOM
    doorGreenRoom: {
      x: 350,
      y: 0,
      w: 100,
      h: 40,
      label: "EXIT TO GREEN ROOM ⬆",
      color: "#2f3e46",
      isSolid: false,
      isDoor: "greenRoom",
    },
  },
  greenRoom: {
    // THE DOOR BACK TO THE STAGE
    doorStage: {
      x: 350,
      y: 410,
      w: 100,
      h: 40,
      label: "⬇ BACK TO STAGE",
      color: "#2f3e46",
      isSolid: false,
      isDoor: "stage",
    },
    couch: {
      x: 100,
      y: 100,
      w: 200,
      h: 80,
      label: "COUCH",
      color: "#274c77",
      isSolid: true,
      dialogue: {
        speaker: "Exhausted Actor",
        text: "I can't remember my lines for Act II... Just let me sleep.",
        choices: [{ id: "ok", text: "Leave them alone." }],
      },
    },
    snackTable: {
      x: 600,
      y: 200,
      w: 120,
      h: 100,
      label: "CRAFT SERVICES",
      color: "#8b5a2b",
      isSolid: true,
      dialogues: [
        {
          speaker: "Snack Table",
          text: "It's just stale bagels and lukewarm coffee.",
          choices: [{ id: "ok", text: "Grab a coffee." }],
        },
        {
          speaker: "Snack Table",
          text: "Someone took all the good donuts.",
          choices: [{ id: "ok", text: "Typical." }],
        },
      ],
    },
  },
};
