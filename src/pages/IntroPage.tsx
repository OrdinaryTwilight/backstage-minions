import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../components/ui/Button";
import HardwarePanel from "../components/ui/HardwarePanel";
import { useGame } from "../context/GameContext";

const INTRO_SEQUENCE = [
  "The house lights are at half. The audience is settling in.",
  "You slide your headset over your ears and power on the beltpack.",
  "Comms click on: 'Standby LX 1. Standby Sound 1.'",
  "The actors get the applause...",
  "...But we hold the power.",
  "Welcome to the shadows. Don't mess up.",
];

export default function IntroPage() {
  const navigate = useNavigate();
  const { dispatch } = useGame();
  const [currentLine, setCurrentLine] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  // Smooth fade-in effect for each text line
  useEffect(() => {
    setIsVisible(false);
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, [currentLine]);

  const handleNext = () => {
    if (currentLine < INTRO_SEQUENCE.length - 1) {
      setCurrentLine((prev) => prev + 1);
    } else {
      dispatch({ type: "MARK_INTRO_SEEN" });
      navigate("/productions");
    }
  };

  const handleSkip = () => {
    dispatch({ type: "MARK_INTRO_SEEN" });
    navigate("/productions");
  };

  return (
    <div
      className="page-container"
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        background: "var(--color-blueprint-bg)",
      }}
    >
      <HardwarePanel
        style={{
          maxWidth: "600px",
          width: "100%",
          padding: "4rem 2rem",
          textAlign: "center",
          border: "2px solid var(--bui-fg-info)",
        }}
      >
        <div
          aria-live="polite"
          style={{
            minHeight: "120px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: "3rem",
          }}
        >
          <p
            style={{
              fontFamily: "var(--font-sketch)",
              fontSize: "1.8rem",
              color: "var(--bui-fg-warning)",
              lineHeight: "1.5",
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? "translateY(0)" : "translateY(10px)",
              transition: "opacity 0.5s ease, transform 0.5s ease",
            }}
          >
            {INTRO_SEQUENCE[currentLine]}
          </p>
        </div>

        <div style={{ display: "flex", gap: "1rem", flexDirection: "column" }}>
          <Button
            variant="accent"
            onClick={handleNext}
            style={{ padding: "1rem", fontSize: "1.2rem", width: "100%" }}
          >
            {currentLine < INTRO_SEQUENCE.length - 1 ? "Next →" : "Clock In"}
          </Button>

          {currentLine < INTRO_SEQUENCE.length - 1 && (
            <button
              onClick={handleSkip}
              style={{
                background: "transparent",
                border: "none",
                color: "var(--color-pencil-light)",
                textDecoration: "underline",
                cursor: "pointer",
                fontFamily: "var(--font-mono)",
                marginTop: "1rem",
              }}
            >
              Skip Intro
            </button>
          )}
        </div>
      </HardwarePanel>
    </div>
  );
}
