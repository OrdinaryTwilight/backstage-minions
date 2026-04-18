import { useState } from "react";
import { useGame } from "../../context/GameContext";
import { CHARACTERS, Cue } from "../../data/gameData";
import { calculateStars } from "../../utils/scoringEngine";
import Button from "../ui/Button";
import HardwarePanel from "../ui/HardwarePanel";
import SectionHeader from "../ui/SectionHeader";

interface WrapUpSceneProps {
  onComplete: () => void;
  cueSheet?: Cue[];
}

export default function WrapUpScene({
  onComplete,
  cueSheet = [],
}: Readonly<WrapUpSceneProps>) {
  const { state } = useGame();
  const [phase, setPhase] = useState<"dialogue" | "report">("dialogue");

  const char = CHARACTERS.find((c) => c.id === state.session?.characterId);
  const score = state.session?.score || 0;
  const cuesHit = state.session?.cuesHit || 0;
  const cuesMissed = state.session?.cuesMissed || 0;
  const totalCues = cueSheet.length;

  // Calculate final stars right here in the component
  const stars = calculateStars(totalCues, cuesHit, score);

  const getResultColor = (starCount: number): string => {
    if (starCount === 3) return "var(--bui-fg-success)";
    if (starCount === 2) return "var(--bui-fg-warning)";
    return "var(--bui-fg-danger)";
  };

  const getResultText = (starCount: number): string => {
    if (starCount === 3) return "FLAWLESS EXECUTION!";
    if (starCount === 2) return "SOLID RUN!";
    return "ABSOLUTE TRAINWRECK...";
  };

  if (phase === "report") {
    return (
      <div className="page-container animate-pop">
        <SectionHeader
          title="Post-Mortem Report"
          subtitle="Strike is complete. How did the show go?"
        />

        <HardwarePanel
          style={{
            textAlign: "center",
            padding: "3rem 2rem",
            maxWidth: "600px",
            margin: "0 auto",
          }}
        >
          <div
            style={{
              fontSize: "5rem",
              marginBottom: "1rem",
              letterSpacing: "10px",
            }}
          >
            {Array.from({ length: 3 }).map((_, i) => (
              <span
                key={`star-${i}`}
                style={{
                  color: i < stars ? "var(--bui-fg-warning)" : "#333",
                  textShadow:
                    i < stars ? "0 0 20px var(--bui-fg-warning)" : "none",
                }}
              >
                ★
              </span>
            ))}
          </div>

          <h2
            style={{
              fontSize: "2rem",
              marginBottom: "2rem",
              fontFamily: "var(--font-mono)",
              color: getResultColor(stars),
            }}
          >
            {getResultText(stars)}
          </h2>

          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "3rem",
              marginBottom: "3rem",
            }}
          >
            <div>
              <div
                style={{
                  fontSize: "2.5rem",
                  fontWeight: "bold",
                  color: "var(--bui-fg-success)",
                }}
              >
                {score}
              </div>
              <div className="annotation-text" style={{ opacity: 0.7 }}>
                Total Score
              </div>
            </div>
            {totalCues > 0 && (
              <div>
                <div
                  style={{
                    fontSize: "2.5rem",
                    fontWeight: "bold",
                    color:
                      cuesMissed > 0
                        ? "var(--bui-fg-danger)"
                        : "var(--bui-fg-info)",
                  }}
                >
                  {cuesHit}{" "}
                  <span style={{ fontSize: "1.5rem", opacity: 0.5 }}>
                    / {totalCues}
                  </span>
                </div>
                <div className="annotation-text" style={{ opacity: 0.7 }}>
                  Cues Hit
                </div>
              </div>
            )}
          </div>

          <Button
            onClick={onComplete}
            className="btn-xl"
            style={{
              width: "100%",
              background: "var(--bui-fg-info)",
              color: "#000",
            }}
          >
            Sign Out & Return to Dashboard
          </Button>
        </HardwarePanel>
      </div>
    );
  }

  // DIALOGUE PHASE
  return (
    <div
      className="page-container animate-blueprint"
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "60vh",
      }}
    >
      <div style={{ textAlign: "center", maxWidth: "600px" }}>
        <div
          style={{
            fontSize: "6rem",
            filter: "drop-shadow(0 10px 20px rgba(0,0,0,0.5))",
          }}
        >
          {char?.icon || "👤"}
        </div>
        <HardwarePanel
          style={{
            marginTop: "2rem",
            padding: "2rem",
            background: "rgba(15, 23, 42, 0.9)",
          }}
        >
          <h2
            className="annotation-text"
            style={{ color: "var(--bui-fg-warning)", marginBottom: "1rem" }}
          >
            Senior Technician
          </h2>
          <p
            style={{
              fontSize: "1.2rem",
              lineHeight: "1.6",
              color: "var(--color-pencil-light)",
            }}
          >
            "Alright, cables are coiled, board is covered, and the ghost light
            is on. Good hustle out there tonight. Let's go look at the SM's
            post-show report and head home."
          </p>
          <div style={{ marginTop: "2rem" }}>
            {/* Transition to Report Phase instead of instantly finishing! */}
            <Button
              onClick={() => setPhase("report")}
              style={{ width: "100%" }}
            >
              Review Post-Mortem Report →
            </Button>
          </div>
        </HardwarePanel>
      </div>
    </div>
  );
}
