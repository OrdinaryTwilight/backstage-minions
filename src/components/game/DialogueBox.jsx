export default function DialogueBox({ speaker, text, choices, onChoice }) {
  return (
    <div className="pxbox">
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
            style={{
              width: "100%",
              maxWidth: "none",
              textAlign: "left",
              justifyContent: "flex-start",
            }}
          >
            {c.text}
          </button>
        ))}
      </div>
    </div>
  );
}
