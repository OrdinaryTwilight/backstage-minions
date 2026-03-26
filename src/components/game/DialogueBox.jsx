import { memo } from "react";

export default memo(function DialogueBox({ speaker, text, choices, onChoice }) {
  return (
    <div style={{ padding: "1rem", background: "var(--surface2)", borderRadius: "8px", marginBottom: "1rem" }}>
      <h3>💬 {speaker}</h3>
      <p>{text}</p>
      {choices && (
        <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
          {choices.map((c, i) => (
            <button
              key={i}
              onClick={() => onChoice(c)}
              style={{ cursor: "pointer", padding: "0.5rem 1rem" }}
            >
              {c.text}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
