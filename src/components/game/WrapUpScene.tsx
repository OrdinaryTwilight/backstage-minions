import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useGame } from "../../context/GameContext";
import { CHARACTERS, Cue } from "../../data/gameData";
import { NARRATIVE } from "../../data/narrative"; // <-- Imported Narrative Data
import { calculateStars } from "../../utils/scoringEngine";
import HardwarePanel from "../shared/panels/HardwarePanel";
import Button from "../shared/ui/Button";
import SectionHeader from "../shared/ui/SectionHeader";

interface WrapUpSceneProps {
  cueSheet?: Cue[];
}

export default function WrapUpScene({
  cueSheet = [],
}: Readonly<WrapUpSceneProps>) {
  const { state } = useGame();
  const [phase, setPhase] = useState<"dialogue" | "report">("dialogue");

  const char = CHARACTERS.find((c) => c.id === state.session?.characterId);
  const score = state.session?.score || 0;
  const cuesHit = state.session?.cuesHit || 0;
  const cuesMissed = state.session?.cuesMissed || 0;
  const totalCues = cueSheet.length;
  const navigate = useNavigate();
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
            padding: "clamp(1.5rem, 5vw, 3rem) clamp(1rem, 4vw, 2rem)",
            maxWidth: "600px",
            margin: "0 auto",
          }}
        >
          <div
            style={{
              fontSize: "clamp(3rem, 10vw, 5rem)", // Responsive star sizing
              marginBottom: "1rem",
              letterSpacing: "clamp(2px, 2vw, 10px)",
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
              fontSize: "clamp(1.5rem, 5vw, 2rem)",
              marginBottom: "2rem",
              fontFamily: "var(--font-mono)",
              color: getResultColor(stars),
            }}
          >
            {getResultText(stars)}
          </h2>

          {/* Responsive flexbox for score stats */}
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              flexWrap: "wrap",
              gap: "clamp(1.5rem, 5vw, 3rem)",
              marginBottom: "3rem",
            }}
          >
            <div>
              <div
                style={{
                  fontSize: "clamp(2rem, 6vw, 2.5rem)",
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
                    fontSize: "clamp(2rem, 6vw, 2.5rem)",
                    fontWeight: "bold",
                    color:
                      cuesMissed > 0
                        ? "var(--bui-fg-danger)"
                        : "var(--bui-fg-info)",
                  }}
                >
                  {cuesHit}{" "}
                  <span
                    style={{
                      fontSize: "clamp(1rem, 3vw, 1.5rem)",
                      opacity: 0.5,
                    }}
                  >
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
            onClick={() => {
              // Clear level session storage so quests reset for next run
              sessionStorage.removeItem("minion_inventory");
              sessionStorage.removeItem("minion_completed_quests");
              navigate("/"); // Route home instead of calling onComplete()
            }}
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
      <div style={{ textAlign: "center", maxWidth: "600px", width: "100%" }}>
        <div
          style={{
            fontSize: "clamp(4rem, 15vw, 6rem)",
            filter: "drop-shadow(0 10px 20px rgba(0,0,0,0.5))",
          }}
        >
          {char?.icon || "👤"}
        </div>
        <HardwarePanel
          style={{
            marginTop: "2rem",
            padding: "clamp(1rem, 4vw, 2rem)",
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
              fontSize: "clamp(1rem, 3vw, 1.2rem)",
              lineHeight: "1.6",
              color: "var(--color-pencil-light)",
            }}
          >
            {/* Decoupled narrative string injected here */}"
            {NARRATIVE.wrapUp.seniorTechText}"
          </p>
          <div style={{ marginTop: "2rem" }}>
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
