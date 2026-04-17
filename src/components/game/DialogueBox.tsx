import { useEffect, useState } from "react";
import Button from "../ui/Button";

export interface DialogueBoxChoice {
  id: string;
  text: string;
}

interface DialogueBoxProps<T extends DialogueBoxChoice> {
  readonly speaker: string;
  readonly text: string;
  readonly choices: T[];
  readonly onChoice: (choice: T) => void;
  readonly icon?: string; // Fallback giant emoji portrait
  readonly portraitUrl?: string; // Optional: High-res 2D sprite image URL
}

export default function DialogueBox<T extends DialogueBoxChoice>({
  speaker,
  text,
  choices,
  onChoice,
  icon,
  portraitUrl,
}: DialogueBoxProps<T>) {
  const [cooldown, setCooldown] = useState(true);

  // Add a slight cooldown so holding Enter doesn't skip 5 boxes instantly
  useEffect(() => {
    const timer = setTimeout(() => setCooldown(false), 300);
    return () => clearTimeout(timer);
  }, [text]);

  // Press Enter/Space to advance
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        (e.key === "Enter" || e.key === " ") &&
        !cooldown &&
        choices.length > 0
      ) {
        e.preventDefault();
        onChoice(choices[0]); // Auto-selects the first choice
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.addEventListener("keydown", handleKeyDown);
  }, [choices, onChoice, cooldown]);

  return (
    <div className="vn-dialogue-container" style={{ marginTop: "120px" }}>
      {/* --- CHARACTER PORTRAIT LAYER --- */}
      <div
        style={{
          position: "absolute",
          bottom: "100%", // Anchors the portrait to the top edge of the text box
          left: "5%",
          width: "30%",
          maxWidth: "200px",
          zIndex: 1, // Behind the speaker tag and text box
          pointerEvents: "none",
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "center",
        }}
      >
        {portraitUrl ? (
          <img
            src={portraitUrl}
            alt={speaker}
            style={{
              width: "100%",
              height: "auto",
              objectFit: "contain",
              filter: "drop-shadow(0 0 10px rgba(0,0,0,0.5))",
            }}
          />
        ) : (
          <div
            style={{
              fontSize: "8rem", // Giant emoji fallback
              lineHeight: "1",
              filter: "drop-shadow(0 10px 10px rgba(0,0,0,0.5))",
              transform: "translateY(10px)", // Slight tuck behind the box
            }}
          >
            {icon || "👤"}
          </div>
        )}
        <div
          style={{
            position: "absolute",
            bottom: "10px",
            right: "15px",
            fontSize: "0.8rem",
            color: "var(--color-pencil-light)",
            opacity: 0.5,
            fontFamily: "var(--font-mono)",
          }}
        >
          [Press Enter to continue]
        </div>
      </div>

      {/* --- VN SPEAKER TAG --- */}
      <div className="vn-speaker-tag">{speaker}</div>

      {/* --- MAIN VN TEXT BOX --- */}
      <div className="vn-text-box" style={{ position: "relative", zIndex: 5 }}>
        <p
          style={{
            fontSize: "1.25rem",
            color: "var(--color-pencil-light)",
            lineHeight: "1.6",
            margin: 0,
          }}
        >
          "{text}"
        </p>

        {/* Vertical VN-style Choices List */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "0.8rem",
            marginTop: "1rem",
          }}
        >
          {choices.map((choice) => (
            <Button
              key={choice.id}
              onClick={() => onChoice(choice)}
              style={{
                textAlign: "left",
                justifyContent: "flex-start",
                background: "rgba(255,255,255,0.05)",
                border: "1px solid var(--bui-fg-info)",
                padding: "0.8rem 1.5rem",
              }}
            >
              ▶ {choice.text}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}
