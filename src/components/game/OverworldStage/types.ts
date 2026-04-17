export interface NPC {
  id: string;
  name: string;
  x: number;
  y: number;
  dx: number;
  dy: number;
  moveTimer: number;
  isHidden: boolean;
  hideTimer: number;
}

export interface DialogueState {
  speaker: string;
  text: string;
  choices: {
    id: string;
    text: string;
    pointDelta?: number;
    contact?: string | null;
  }[];
}

export interface GamePhysicsState {
  playerPos: { x: number; y: number };
  targetPos: { x: number; y: number } | null;
  npcs: NPC[];
  activeZone: string | null;
  activeDialogue: DialogueState | null;
  feedbackMsg: string | null;
  bumpMsg: { id: string; msg: string } | null;
}

export interface OverworldStageProps {
  readonly onComplete: () => void;
  readonly department?: string;
  readonly charId?: string;
}
