import { ZoneConfig } from "./types";

export const OVERWORLD_ZONES: Record<string, ZoneConfig> = {
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
        choices: [
          { id: "ok", text: "On my way!", pointDelta: 0, contact: null },
        ],
      },
      {
        speaker: "Stage Manager",
        text: "Standby all departments... I need eyes on the main curtain.",
        choices: [
          { id: "ok", text: "Standing by.", pointDelta: 0, contact: null },
        ],
      },
      {
        speaker: "Stage Manager",
        text: "Where is the spotlight operator? We are going to miss the opening cue!",
        choices: [
          { id: "ok", text: "I'll page them.", pointDelta: 0, contact: null },
        ],
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
        choices: [
          {
            id: "ok",
            text: "Backing away slowly...",
            pointDelta: 0,
            contact: null,
          },
        ],
      },
      {
        speaker: "Props Master",
        text: "Have you seen a rubber chicken? I swear I left it right here.",
        choices: [
          {
            id: "ok",
            text: "I'll keep an eye out.",
            pointDelta: 0,
            contact: null,
          },
        ],
      },
      {
        speaker: "Props Master",
        text: "Careful around the table, the glass props are highly fragile!",
        choices: [
          { id: "ok", text: "Understood.", pointDelta: 0, contact: null },
        ],
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
        speaker: "Nervous Actor",
        text: "Psst! Did I miss my entrance? Oh wait... I'm not even in this scene.",
        choices: [
          {
            id: "ok",
            text: "Shh! Quiet in the wings!",
            pointDelta: 0,
            contact: null,
          },
        ],
      },
      {
        speaker: "Stage Hand",
        text: "Clear the wings! We have a massive set piece coming through in 2 minutes.",
        choices: [
          {
            id: "ok",
            text: "Moving out of the way.",
            pointDelta: 0,
            contact: null,
          },
        ],
      },
      {
        speaker: "Lead Actor",
        text: "My throat is so dry... where is my water bottle?",
        choices: [
          {
            id: "ok",
            text: "Check the green room.",
            pointDelta: 0,
            contact: null,
          },
        ],
      },
    ],
  },
};
