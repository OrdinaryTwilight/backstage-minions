import { getStageHelpText } from "../../../data/gameData";
import HardwarePanel from "../../ui/HardwarePanel";
import SectionHeader from "../../ui/SectionHeader";
import CoilVisualiser from "./CoilVisualiser";
import PauseOverlay from "./PauseOverlay";
import { useCableCoiling } from "./useCableCoiling";

export default function CableCoilingStage({
  onComplete,
  difficulty = "school",
}: Readonly<{
  onComplete: () => void;
  difficulty?: string;
}>) {
  const {
    coils,
    knots,
    expectedNext,
    isComplete,
    isPaused,
    setIsPaused,
    hasStarted,
    setHasStarted,
    feedback,
    timeLeft,
    TARGET_COILS,
    handleAction,
  } = useCableCoiling(difficulty, onComplete);

  let feedbackBg = "rgba(56, 189, 248, 0.2)";
  let feedbackBorder = "var(--bui-fg-info)";
  if (feedback.type === "success") {
    feedbackBg = "rgba(74, 222, 128, 0.2)";
    feedbackBorder = "var(--bui-fg-success)";
  } else if (feedback.type === "error") {
    feedbackBg = "rgba(248, 113, 113, 0.2)";
    feedbackBorder = "var(--bui-fg-danger)";
  }

  return (
    <div
      className="page-container animate-blueprint"
      style={{ position: "relative" }}
    >
      <button
        onClick={() => setIsPaused(true)}
        disabled={!hasStarted}
        style={{
          position: "absolute",
          top: "1rem",
          right: "1rem",
          zIndex: 2000,
          background: "transparent",
          border: "1px solid #fff",
          color: "#fff",
          cursor: hasStarted ? "pointer" : "not-allowed",
          padding: "4px 8px",
          borderRadius: "4px",
          fontFamily: "var(--font-sketch)",
          opacity: hasStarted ? 1 : 0.5,
        }}
      >
        ⏸ PAUSE
      </button>

      {isPaused && (
        <PauseOverlay
          hasStarted={hasStarted}
          setIsPaused={setIsPaused}
          setHasStarted={setHasStarted}
        />
      )}

      <SectionHeader
        title="Strike & Wrap"
        subtitle="Properly coil the XLR audio snake before the truck leaves."
        helpText={getStageHelpText("cable_coiling")}
      />

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "2rem",
          marginTop: "1rem",
          opacity: isPaused ? 0.3 : 1,
          pointerEvents: isPaused ? "none" : "auto",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            width: "100%",
            maxWidth: "500px",
          }}
        >
          <div
            className="annotation-text"
            style={{
              fontSize: "1.5rem",
              color:
                timeLeft <= 5 ? "var(--bui-fg-danger)" : "var(--bui-fg-info)",
            }}
          >
            ⏱️ 00:{timeLeft.toString().padStart(2, "0")}
          </div>
          <div
            className="annotation-text"
            style={{ fontSize: "1.5rem", color: "var(--bui-fg-warning)" }}
          >
            DIFFICULTY: {difficulty.toUpperCase()}
          </div>
        </div>

        <div
          aria-live="polite"
          style={{
            width: "100%",
            maxWidth: "500px",
            padding: "1rem 2rem",
            background: feedbackBg,
            border: `2px solid ${feedbackBorder}`,
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

        <CoilVisualiser
          coils={coils}
          knots={knots}
          targetCoils={TARGET_COILS}
        />

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
            type="button"
            onClick={() => handleAction("OVER")}
            disabled={isComplete || timeLeft <= 0 || isPaused}
            style={{
              flex: 1,
              padding: "1.5rem",
              fontSize: "1.5rem",
              fontWeight: "bold",
              fontFamily: "var(--font-mono)",
              background:
                expectedNext === "OVER" ? "var(--bui-fg-warning)" : "#4a5568",
              color: expectedNext === "OVER" ? "#000" : "#fff",
              border: "none",
              borderRadius: "8px",
              cursor: isComplete || timeLeft <= 0 ? "not-allowed" : "pointer",
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
            type="button"
            onClick={() => handleAction("UNDER")}
            disabled={isComplete || timeLeft <= 0 || isPaused}
            style={{
              flex: 1,
              padding: "1.5rem",
              fontSize: "1.5rem",
              fontWeight: "bold",
              fontFamily: "var(--font-mono)",
              background:
                expectedNext === "UNDER" ? "var(--bui-fg-info)" : "#4a5568",
              color: expectedNext === "UNDER" ? "#000" : "#fff",
              border: "none",
              borderRadius: "8px",
              cursor: isComplete || timeLeft <= 0 ? "not-allowed" : "pointer",
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
