export interface NPC {
  id: string;
  name: string;
  icon: string;
  dept: string;
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
  icon?: string;
  choices: {
    id: string;
    text: string;
    pointDelta?: number;
    contact?: string | null;
  }[];
}

export interface OverworldStageProps {
  readonly onComplete: () => void;
  readonly department?: string;
  readonly charId?: string;
  readonly nextStageKey?: string;
}
