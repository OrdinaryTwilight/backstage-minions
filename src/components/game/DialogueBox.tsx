
/**
 * Base interface for any choice used in a DialogueBox.
 * Ensures the component can at least render the text and track the key.
 */
export interface DialogueBoxChoice {
  id: string;
  text: string;
}

interface DialogueBoxProps<T extends DialogueBoxChoice> {
  speaker: string;
  text: string;
  choices: T[];
  onChoice: (choice: T) => void;
  icon?: string;
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
    <div
      className="pxbox"
      style={{ display: "flex", gap: "1.5rem", alignItems: "flex-start" }}
    >
      <div
        style={{
          fontSize: "3rem",
          background: "var(--glass-bg)",
          padding: "1rem",
          borderRadius: "var(--radius-md)",
          border: "1px solid var(--glass-border)",
        }}
      >
        {icon || "👤"}
      </div>

      <div style={{ flex: 1 }}>
        <h3 style={{ color: "var(--bui-fg-info)", marginBottom: "0.5rem" }}>
          {speaker}
        </h3>
        <p style={{ color: "var(--color-pencil-light)", marginBottom: "1.5rem" }}>
          {text}
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          {choices.map((c) => (
            <button
              key={c.id}
              onClick={() => onChoice(c)}
              className="action-button"
            >
              {c.text}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}