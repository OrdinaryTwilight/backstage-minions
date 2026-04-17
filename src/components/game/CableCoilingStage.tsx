import { useEffect, useState } from "react";
import { useGame } from "../../context/GameContext";
import HardwarePanel from "../ui/HardwarePanel";
import SectionHeader from "../ui/SectionHeader";

interface CableCoilingStageProps {
  onComplete: () => void;
}

export default function CableCoilingStage({
  onComplete,
}: CableCoilingStageProps) {
  const { dispatch } = useGame();
  const [coils, setCoils] = useState(0);
  const [knots, setKnots] = useState(0);
  const [expectedNext, setExpectedNext] = useState<"OVER" | "UNDER">("OVER");
  const [feedback, setFeedback] = useState<{
    msg: string;
    type: "success" | "error" | "neutral";
  }>({
    msg: "Grab the XLR cable. Start with an OVER loop.",
    type: "neutral",
  });
  const [isComplete, setIsComplete] = useState(false);

  // Reduced target for better pacing
  const TARGET_COILS = 8;

  // Keyboard support for fast coiling
  useEffect(() => {
    if (isComplete) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        handleAction("OVER");
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        handleAction("UNDER");
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [expectedNext, isComplete]);

  const handleAction = (action: "OVER" | "UNDER") => {
    if (action === expectedNext) {
      // SUCCESS: Correct technique
      const newCoils = coils + 1;
      setCoils(newCoils);
      setExpectedNext(action === "OVER" ? "UNDER" : "OVER");
      setFeedback({
        msg: `Nice ${action}! Now go ${action === "OVER" ? "UNDER" : "OVER"}.`,
        type: "success",
      });
      dispatch({ type: "ADD_SCORE", delta: 5 });

      if (newCoils >= TARGET_COILS) {
        setIsComplete(true);
        setFeedback({
          msg: "Perfect coil! Securing with tie-line...",
          type: "success",
        });
        dispatch({ type: "ADD_SCORE", delta: 50 }); // Completion bonus
        setTimeout(() => onComplete(), 1500);
      }
    } else {
      // FAIL: Cable knots!
      setKnots((k) => k + 1);
      setFeedback({
        msg: `KNOTTED! You went ${action} twice. Untangling...`,
        type: "error",
      });
      dispatch({ type: "ADD_SCORE", delta: -10 }); // Penalty

      setExpectedNext("OVER"); // Reset the pattern logic
    }
  };

  return (
    <div className="page-container animate-blueprint">
      <SectionHeader
        title="Strike & Wrap"
        subtitle="Properly coil the 100ft XLR audio snake."
        helpText="Alternate between OVER and UNDER loops. Use [Left Arrow] for OVER, [Right Arrow] for UNDER."
      />

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "2rem",
          marginTop: "2rem",
        }}
      >
        {/* Feedback Display */}
        <div
          style={{
            padding: "1rem 2rem",
            background:
              feedback.type === "success"
                ? "rgba(74, 222, 128, 0.2)"
                : feedback.type === "error"
                  ? "rgba(248, 113, 113, 0.2)"
                  : "rgba(56, 189, 248, 0.2)",
            border: `2px solid ${feedback.type === "success" ? "var(--bui-fg-success)" : feedback.type === "error" ? "var(--bui-fg-danger)" : "var(--bui-fg-info)"}`,
            borderRadius: "8px",
            color: "#fff",
            fontWeight: "bold",
            fontSize: "1.2rem",
            fontFamily: "var(--font-mono)",
            textAlign: "center",
            transition: "all 0.2s ease",
          }}
        >
          {feedback.msg}
        </div>

        {/* Visual Cable Coil (Upgraded 3D Ellipse Drawing) */}
        <div style={{ position: "relative", width: "250px", height: "250px" }}>
          {Array.from({ length: coils }).map((_, i) => (
            <svg
              key={i}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                // Creates a 3D overlapping pile effect by slightly offsetting and rotating
                transform: `translate(${(i % 2) * 5}px, ${(i % 3) * 5}px) rotate(${i * 35}deg) scale(${1 - i * 0.03})`,
                opacity: 0.9,
              }}
            >
              {/* Thicker shadow/outline for depth */}
              <ellipse
                cx="125"
                cy="125"
                rx="85"
                ry="110"
                fill="none"
                stroke="#1a202c"
                strokeWidth="10"
              />
              {/* Inner cable core with slight dash to look like twists */}
              <ellipse
                cx="125"
                cy="125"
                rx="85"
                ry="110"
                fill="none"
                stroke="#e2e8f0"
                strokeWidth="4"
                strokeDasharray="30 5"
              />
            </svg>
          ))}

          {/* Progress Text in the center */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "column",
              zIndex: 10,
            }}
          >
            <span
              style={{
                fontSize: "4rem",
                fontWeight: "bold",
                color: "var(--bui-fg-warning)",
                textShadow: "2px 2px 10px #000",
              }}
            >
              {coils}/{TARGET_COILS}
            </span>
            {knots > 0 && (
              <span
                style={{
                  color: "var(--bui-fg-danger)",
                  fontSize: "1rem",
                  fontWeight: "bold",
                  background: "#000",
                  padding: "2px 8px",
                  borderRadius: "4px",
                }}
              >
                Knots: {knots}
              </span>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <HardwarePanel
          style={{
            display: "flex",
            gap: "2rem",
            justifyContent: "center",
            width: "100%",
            maxWidth: "500px",
            background: "#1a1c23",
          }}
        >
          <button
            onClick={() => handleAction("OVER")}
            disabled={isComplete}
            style={{
              flex: 1,
              padding: "1.5rem",
              fontSize: "1.5rem",
              fontWeight: "bold",
              background:
                expectedNext === "OVER" ? "var(--bui-fg-warning)" : "#4a5568",
              color: expectedNext === "OVER" ? "#000" : "#fff",
              border: "none",
              borderRadius: "8px",
              cursor: isComplete ? "not-allowed" : "pointer",
              boxShadow:
                expectedNext === "OVER"
                  ? "0 0 15px var(--bui-fg-warning)"
                  : "none",
              transition: "all 0.1s ease",
            }}
          >
            ← OVER
          </button>

          <button
            onClick={() => handleAction("UNDER")}
            disabled={isComplete}
            style={{
              flex: 1,
              padding: "1.5rem",
              fontSize: "1.5rem",
              fontWeight: "bold",
              background:
                expectedNext === "UNDER" ? "var(--bui-fg-info)" : "#4a5568",
              color: expectedNext === "UNDER" ? "#000" : "#fff",
              border: "none",
              borderRadius: "8px",
              cursor: isComplete ? "not-allowed" : "pointer",
              boxShadow:
                expectedNext === "UNDER"
                  ? "0 0 15px var(--bui-fg-info)"
                  : "none",
              transition: "all 0.1s ease",
            }}
          >
            UNDER →
          </button>
        </HardwarePanel>
      </div>
    </div>
  );
}
