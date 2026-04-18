import { useEffect, useRef } from "react";

interface BaseChoice {
  id: string;
  text: string;
}

interface DialogueBoxProps<T extends BaseChoice> {
  speaker: string;
  text: string;
  icon?: string;
  choices: T[];
  onChoice: (choice: T) => void;
}

export default function DialogueBox<T extends BaseChoice>({
  speaker,
  text,
  icon,
  choices,
  onChoice,
}: Readonly<DialogueBoxProps<T>>) {
  const firstChoiceRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (firstChoiceRef.current) {
      firstChoiceRef.current.focus();
    }
  }, [text]);

  return (
    <div className="dialogue-box-container">
      <div className="dialogue-box-icon" aria-hidden="true">
        {icon || "👤"}
      </div>

      <div className="dialogue-box-content">
        <h3 className="annotation-text dialogue-box-speaker">
          {speaker.toUpperCase()}
        </h3>

        <p className="dialogue-box-text">{text}</p>

        <fieldset className="dialogue-box-choices">
          <legend className="sr-only">{speaker}'s dialogue choices</legend>

          {choices.map((choice, idx) => (
            <button
              key={choice.id}
              ref={idx === 0 ? firstChoiceRef : null}
              onClick={() => onChoice(choice)}
              className="dialogue-box-btn"
            >
              {choice.text}
            </button>
          ))}
        </fieldset>
      </div>
    </div>
  );
}
