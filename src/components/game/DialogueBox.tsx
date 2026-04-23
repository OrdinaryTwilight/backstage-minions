/**
 * @file Dialogue Box Component
 * @description Generic dialogue display with speaker, text, and player choice options.
 * Generic component used for both NPC dialogues and conflict resolutions.
 *
 * Features:
 * - **Speaker name and icon**: NPC identification
 * - **Dialogue text**: The dialogue message
 * - **Choice buttons**: Player response options
 * - **Optional timer**: Timed choices with visual countdown
 * - **Race condition protection**: Prevents simultaneous click+timer expiration bugs
 *
 * Generic component design: Works with any choice type (DialogueChoice, ConflictChoice)
 * Uses TypeScript generics to maintain type safety for different choice types.
 *
 * @component
 */

import { useEffect, useRef, useState } from "react";
import Button from "../ui/Button";

interface BaseChoice {
  id: string;
  text: string;
}

interface DialogueBoxProps<T extends BaseChoice> {
  readonly speaker: string;
  readonly text: string;
  readonly choices: T[];
  readonly onChoice: (choice: T) => void;
  readonly icon?: string;
  readonly timeLimitMs?: number;
}

export default function DialogueBox<T extends BaseChoice>({
  speaker,
  text,
  choices,
  onChoice,
  icon,
  timeLimitMs,
}: DialogueBoxProps<T>) {
  const [timeLeftWidth, setTimeLeftWidth] = useState(100);

  // UX/LOGIC FIX: Priority 3 - The 'isAnswered' ref prevents race conditions
  // where the player clicks a choice at the exact moment the timer expires.
  const isAnsweredRef = useRef(false);

  useEffect(() => {
    isAnsweredRef.current = false;
    setTimeLeftWidth(100);

    if (!timeLimitMs) return;

    const animationTimer = setTimeout(() => {
      setTimeLeftWidth(0);
    }, 50);

    const actionTimer = setTimeout(() => {
      if (choices.length > 0 && !isAnsweredRef.current) {
        isAnsweredRef.current = true;
        onChoice(choices[choices.length - 1]);
      }
    }, timeLimitMs);

    return () => {
      clearTimeout(animationTimer);
      clearTimeout(actionTimer);
    };
  }, [timeLimitMs, text, choices, onChoice]);

  const handleChoiceClick = (choice: T) => {
    if (isAnsweredRef.current) return;
    isAnsweredRef.current = true;
    onChoice(choice);
  };

  return (
    <div className="dialogue-box-container animate-pop">
      {icon && (
        <div className="dialogue-box-avatar" aria-hidden="true">
          <span className="text-4xl">{icon}</span>
        </div>
      )}
      <div className="dialogue-box-content flex-1 flex flex-col">
        <h3
          className="dialogue-box-speaker text-xl font-bold mb-2 text-bui-warning"
          style={{ fontFamily: "var(--font-sketch)" }}
        >
          {speaker}
        </h3>
        <p className="dialogue-box-text text-lg mb-4 leading-relaxed opacity-90">
          {text}
        </p>

        <div className="dialogue-box-choices flex flex-col gap-2 mt-auto">
          {choices.map((choice) => (
            <Button
              key={choice.id}
              variant="default"
              onClick={() => handleChoiceClick(choice)}
              style={{
                justifyContent: "flex-start",
                textAlign: "left",
                fontFamily: "var(--font-sketch)",
              }}
            >
              ▶ {choice.text}
            </Button>
          ))}
        </div>

        {timeLimitMs && (
          <div
            role="timer"
            aria-live="polite"
            style={{
              width: "100%",
              height: "6px",
              background: "rgba(0,0,0,0.5)",
              marginTop: "1rem",
              borderRadius: "3px",
              overflow: "hidden",
            }}
          >
            <span className="sr-only">
              Warning: You have a limited time to select a choice before one is
              selected for you.
            </span>
            <div
              aria-hidden="true"
              style={{
                height: "100%",
                background: "var(--bui-fg-danger)",
                width: `${timeLeftWidth}%`,
                transition: `width ${timeLimitMs}ms linear`,
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
