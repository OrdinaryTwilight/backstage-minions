import { useEffect, useState } from "react";
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

  useEffect(() => {
    if (!timeLimitMs) return;

    // Animate the bar visually
    const animationTimer = setTimeout(() => {
      setTimeLeftWidth(0);
    }, 50);

    // FIXED: Actually enforce the timeout mechanically
    const actionTimer = setTimeout(() => {
      if (choices.length > 0) {
        // Auto-select the final choice to penalize inaction
        onChoice(choices[choices.length - 1]);
      }
    }, timeLimitMs);

    return () => {
      clearTimeout(animationTimer);
      clearTimeout(actionTimer);
    };
  }, [timeLimitMs, text, choices, onChoice]);

  return (
    <div className="dialogue-box-container animate-pop">
      {icon && (
        <div className="dialogue-box-avatar">
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
              onClick={() => onChoice(choice)}
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

        {/* TIME LIMIT PROGRESS BAR */}
        {timeLimitMs && (
          <div
            style={{
              width: "100%",
              height: "6px",
              background: "rgba(0,0,0,0.5)",
              marginTop: "1rem",
              borderRadius: "3px",
              overflow: "hidden",
            }}
          >
            <div
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
