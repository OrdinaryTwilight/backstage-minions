import Button from "../ui/Button";

/**
 * Base interface for any choice used in a DialogueBox.
 * Ensures the component can at least render the text and track the key.
 */
export interface DialogueBoxChoice {
  id: string;
  text: string;
}

interface DialogueBoxProps<T extends DialogueBoxChoice> {
  readonly speaker: string;
  readonly text: string;
  readonly choices: T[];
  readonly onChoice: (choice: T) => void;
  readonly icon?: string;
}

/**
 * DialogueBox: A generic technical terminal for NPC interactions.
 * Uses <T> to allow specialized choice objects to pass through.
 */
export default function DialogueBox<T extends DialogueBoxChoice>({
  speaker,
  text,
  choices,
  onChoice,
  icon,
}: DialogueBoxProps<T>) {
  return (
    <div style={{ display: "flex", gap: "2rem", alignItems: "flex-start" }}>
      <div
        style={{
          fontSize: "4rem",
          background: "var(--glass-bg)",
          padding: "1.5rem",
          borderRadius: "12px",
        }}
      >
        {icon || "👤"}
      </div>

      <div style={{ flex: 1 }}>
        <h3 style={{ color: "var(--bui-fg-info)", marginBottom: "0.5rem" }}>
          {speaker}
        </h3>
        <p
          style={{
            fontSize: "1.1rem",
            marginBottom: "2rem",
            fontStyle: "italic",
          }}
        >
          "{text}"
        </p>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "1rem",
          }}
        >
          {choices.map((choice) => (
            <Button
              key={choice.id}
              onClick={() => onChoice(choice)}
              style={{ textAlign: "left", justifyContent: "flex-start" }}
            >
              {choice.text}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}
