import { useEffect, useRef } from "react";

/* ---------------- BASE TYPE ---------------- */

interface BaseChoice {
  id: string;
  text: string;
}

/* ---------------- GENERIC PROPS ---------------- */

interface DialogueBoxProps<T extends BaseChoice> {
  speaker: string;
  text: string;
  icon?: string;
  choices: T[];
  onChoice: (choice: T) => void;
}

/* ---------------- COMPONENT ---------------- */

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
    <div
      style={{
        position: "fixed",
        bottom: "20px",
        left: "50%",
        transform: "translateX(-50%)",
        width: "90%",
        maxWidth: "800px",
        background: "rgba(15, 23, 42, 0.95)",
        border: "2px solid var(--bui-fg-info)",
        borderRadius: "8px",
        padding: "1.5rem",
        display: "flex",
        gap: "1.5rem",
        boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
        zIndex: 9999,
        backdropFilter: "blur(10px)",
      }}
    >
      <div
        style={{
          fontSize: "4rem",
          display: "flex",
          alignItems: "center",
          filter: "drop-shadow(0 0 10px rgba(255,255,255,0.2))",
        }}
        aria-hidden="true"
      >
        {icon || "👤"}
      </div>

      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <h3
          className="annotation-text"
          style={{
            margin: "0 0 0.5rem 0",
            color: "var(--bui-fg-info)",
            fontSize: "1.2rem",
          }}
        >
          {speaker.toUpperCase()}
        </h3>

        <p
          style={{
            fontSize: "1.1rem",
            lineHeight: "1.5",
            margin: "0 0 1.5rem 0",
            color: "#fff",
            flex: 1,
          }}
        >
          {text}
        </p>

        <fieldset
          style={{
            border: "none",
            padding: 0,
            margin: 0,
            display: "flex",
            gap: "10px",
            flexWrap: "wrap",
          }}
        >
          <legend
            style={{
              position: "absolute",
              width: 1,
              height: 1,
              overflow: "hidden",
              clip: "rect(0 0 0 0)",
            }}
          >
            {speaker}'s dialogue choices
          </legend>

          {choices.map((choice, idx) => (
            <button
              key={choice.id}
              ref={idx === 0 ? firstChoiceRef : null}
              onClick={() => onChoice(choice)}
              style={{
                background: "#1e293b",
                color: "#fff",
                border: "1px solid #3b82f6",
                borderRadius: "4px",
                padding: "8px 16px",
                fontSize: "0.95rem",
                cursor: "pointer",
                fontWeight: "bold",
                transition: "all 0.2s ease",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = "#3b82f6")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background = "#1e293b")
              }
              onFocus={(e) =>
                (e.currentTarget.style.boxShadow = "0 0 0 2px #fff")
              }
              onBlur={(e) => (e.currentTarget.style.boxShadow = "none")}
            >
              {choice.text}
            </button>
          ))}
        </fieldset>
      </div>
    </div>
  );
}
