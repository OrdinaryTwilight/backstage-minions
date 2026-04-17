// src/components/game/DialogueBox.jsx updates
export default function DialogueBox({
  speaker,
  text,
  choices,
  onChoice,
  icon,
}) {
  return (
    <div
      className="pxbox"
      style={{ display: "flex", gap: "1.5rem", alignItems: "flex-start" }}
    >
      {/* Visual Portrait */}
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
        <p
          style={{ color: "var(--color-pencil-light)", marginBottom: "1.5rem" }}
        >
          {text}
        </p>
        <div
          style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}
        >
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
