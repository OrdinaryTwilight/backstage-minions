import { useCallback, useEffect, useRef, useState } from "react";
import { useGame } from "../../context/GameContext";
import { getStageHelpText } from "../../data/gameData";
import HardwarePanel from "../ui/HardwarePanel";
import SectionHeader from "../ui/SectionHeader";

export default function CableCoilingStage({
  onComplete,
  difficulty = "school",
}: Readonly<{
  onComplete: () => void;
  difficulty?: string;
}>) {
  const { dispatch } = useGame();

  // Use refs for lightning-fast, synchronous tracking independent of renders
  const coilsRef = useRef(0);
  const expectedNextRef = useRef<"OVER" | "UNDER">("OVER");

  // UI State
  const [coils, setCoils] = useState(0);
  const [knots, setKnots] = useState(0);
  const [expectedNext, setExpectedNext] = useState<"OVER" | "UNDER">("OVER");
  const [isComplete, setIsComplete] = useState(false);
  const [feedback, setFeedback] = useState<{
    msg: string;
    type: "success" | "error" | "neutral";
  }>({
    msg: "Grab the XLR cable. Start with an OVER loop.",
    type: "neutral",
  });

  // Difficulty scaling
  const getTargetCoils = (diff: string): number => {
    if (diff === "professional") return 12;
    if (diff === "community") return 8;
    return 6;
  };

  const getInitialTime = (diff: string): number => {
    if (diff === "professional") return 15;
    if (diff === "community") return 20;
    return 30;
  };

  const TARGET_COILS = getTargetCoils(difficulty);
  const [timeLeft, setTimeLeft] = useState(getInitialTime(difficulty));

  // Timer countdown
  useEffect(() => {
    if (isComplete || timeLeft <= 0) return;
    const timer = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearInterval(timer);
  }, [isComplete, timeLeft]);

  // Timeout failsafe
  useEffect(() => {
    if (timeLeft <= 0 && !isComplete) {
      const timer = setTimeout(() => {
        setIsComplete(true);
        setFeedback({
          msg: "Time's up! The senior techs had to take over.",
          type: "error",
        });
        setTimeout(() => onComplete(), 2500);
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [timeLeft, isComplete, onComplete]);

  const handleAction = useCallback(
    (action: "OVER" | "UNDER") => {
      if (isComplete || timeLeft <= 0) return;

      // Check against synchronous ref to prevent double-tap penalties
      if (action === expectedNextRef.current) {
        // SUCCESS
        coilsRef.current += 1;
        const newCoils = coilsRef.current;
        const nextReq = action === "OVER" ? "UNDER" : "OVER";

        expectedNextRef.current = nextReq;

        setCoils(newCoils);
        setExpectedNext(nextReq);
        setFeedback({
          msg: `Nice ${action}! Now go ${nextReq}.`,
          type: "success",
        });
        dispatch({ type: "ADD_SCORE", delta: 5 });

        if (newCoils >= TARGET_COILS) {
          setIsComplete(true);
          const timeBonus = timeLeft * 3;
          setFeedback({
            msg: `Perfect coil! Time Bonus: +${timeBonus} pts`,
            type: "success",
          });
          dispatch({ type: "ADD_SCORE", delta: 50 + timeBonus });
          setTimeout(() => onComplete(), 2000);
        }
      } else {
        // FAIL
        setKnots((k) => k + 1);
        coilsRef.current = Math.max(0, coilsRef.current - 1); // Lose a coil

        expectedNextRef.current = "OVER"; // Reset pattern logic

        setCoils(coilsRef.current);
        setExpectedNext("OVER");

        setFeedback({
          msg: `KNOTTED! You went ${action} twice. Untangling... (-1 Coil)`,
          type: "error",
        });
        dispatch({ type: "ADD_SCORE", delta: -10 });
      }
    },
    [TARGET_COILS, isComplete, timeLeft, dispatch, onComplete],
  );

  // Keyboard support for fast coiling
  useEffect(() => {
    if (isComplete || timeLeft <= 0) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        handleAction("OVER");
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        handleAction("UNDER");
      }
    };

    globalThis.addEventListener("keydown", handleKeyDown);
    return () => globalThis.removeEventListener("keydown", handleKeyDown);
  }, [handleAction, isComplete, timeLeft]);

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
    <div className="page-container animate-blueprint">
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
            TIER: {difficulty.toUpperCase()}
          </div>
        </div>

        {/* Feedback Display */}
        <div
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

        {/* Visual Cable Coil */}
        <div style={{ position: "relative", width: "250px", height: "250px" }}>
          {Array.from({ length: coils }).map((_, i) => (
            <svg
              key={`coil-${coils}-${i}`}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                transform: `translate(${(i % 2) * 5}px, ${(i % 3) * 5}px) rotate(${i * 35}deg) scale(${1 - i * 0.03})`,
                opacity: 0.9,
              }}
            >
              <ellipse
                cx="125"
                cy="125"
                rx="85"
                ry="110"
                fill="none"
                stroke="#1a202c"
                strokeWidth="10"
              />
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
            disabled={isComplete || timeLeft <= 0}
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
            onClick={() => handleAction("UNDER")}
            disabled={isComplete || timeLeft <= 0}
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
