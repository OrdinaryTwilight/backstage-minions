import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../components/ui/Button";
import HardwarePanel from "../components/ui/HardwarePanel";
import { useGame } from "../context/GameContext";
import { NARRATIVE } from "../data/narrative";

const INTRO_SEQUENCE = NARRATIVE.bootSequence;

export default function HomePage() {
  const navigate = useNavigate();
  const { state } = useGame();

  const isNewPlayer = Object.keys(state.progress).length === 0;
  const [bootPhase, setBootPhase] = useState(
    isNewPlayer ? 0 : INTRO_SEQUENCE.length,
  );
  const [displayText, setDisplayText] = useState("");

  // Typewriter effect for the cinematic intro
  useEffect(() => {
    if (bootPhase >= INTRO_SEQUENCE.length) return;

    const fullText = INTRO_SEQUENCE[bootPhase];
    let charIndex = 0;

    const interval = setInterval(() => {
      setDisplayText(fullText.slice(0, charIndex));
      charIndex++;

      if (charIndex > fullText.length) {
        clearInterval(interval);
        setDisplayText(fullText); // ensure full render
      }
    }, 40);

    return () => clearInterval(interval);
  }, [bootPhase]);

  useEffect(() => {
    if (bootPhase >= INTRO_SEQUENCE.length) return;

    const fullText = INTRO_SEQUENCE[bootPhase];
    const isComplete = displayText === fullText;

    if (!isComplete) return;

    const delay = bootPhase === INTRO_SEQUENCE.length - 2 ? 3000 : 1000;

    const timeout = setTimeout(() => {
      setBootPhase((prev) => prev + 1);
      setDisplayText("");
    }, delay);

    return () => clearTimeout(timeout);
  }, [displayText, bootPhase]);

  // If still in the boot sequence, render the terminal
  if (bootPhase < INTRO_SEQUENCE.length) {
    return (
      <div
        className="page-container"
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          height: "100vh",
          background: "#050505",
        }}
      >
        <div style={{ maxWidth: "800px", margin: "0 auto", width: "100%" }}>
          {INTRO_SEQUENCE.slice(0, bootPhase).map((line, idx) => (
            <p
              key={`${line}-${idx}`}
              style={{
                color: "var(--bui-fg-info)",
                fontFamily: "var(--font-mono)",
                marginBottom: "1rem",
                opacity: 0.7,
              }}
            >
              {line}
            </p>
          ))}
          <p
            style={{
              color: "var(--bui-fg-success)",
              fontFamily: "var(--font-mono)",
              fontSize: "1.2rem",
              fontWeight: "bold",
            }}
          >
            {displayText}
            <span className="animate-flicker">_</span>
          </p>
          <Button
            onClick={() => setBootPhase(INTRO_SEQUENCE.length)}
            style={{
              marginTop: "3rem",
              background: "transparent",
              border: "1px solid #333",
              color: "#666",
              fontSize: "0.8rem",
            }}
          >
            [SKIP BOOT SEQUENCE]
          </Button>
        </div>
      </div>
    );
  }

  // Main Dashboard Render
  return (
    <div className="page-container animate-blueprint">
      <div
        style={{ textAlign: "center", marginBottom: "4rem", marginTop: "2rem" }}
      >
        <h1
          style={{
            fontSize: "3rem",
            fontFamily: "var(--font-mono)",
            color: "var(--bui-fg-warning)",
            margin: "0 0 1rem 0",
            textShadow: "0 0 20px rgba(251, 191, 36, 0.3)",
          }}
        >
          BACKSTAGE MINIONS
        </h1>
        <p
          className="annotation-text"
          style={{ fontSize: "1.2rem", opacity: 0.8 }}
        >
          Local 13 Technical Dispatch Dashboard
        </p>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap: "2rem",
          maxWidth: "900px",
          margin: "0 auto",
        }}
      >
        <HardwarePanel
          variant="clickable"
          onClick={() => navigate("/productions")}
          className="animate-pop"
          style={{ animationDelay: "0.1s" }}
        >
          <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>📋</div>
          <h2 className="annotation-text" style={{ fontSize: "1.5rem" }}>
            Active Contracts
          </h2>
          <p style={{ opacity: 0.7, marginTop: "0.5rem" }}>
            Review incoming shows and accept technical positions.
          </p>
        </HardwarePanel>

        <HardwarePanel
          variant="clickable"
          onClick={() => navigate("/networks")}
          className="animate-pop"
          style={{ animationDelay: "0.2s" }}
        >
          <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>📻</div>
          <h2 className="annotation-text" style={{ fontSize: "1.5rem" }}>
            Comms Network
          </h2>
          <p style={{ opacity: 0.7, marginTop: "0.5rem" }}>
            Check messages from department heads and crew.
          </p>
          {state.unreadContacts.length > 0 && (
            <div
              style={{
                marginTop: "1rem",
                display: "inline-block",
                background: "var(--bui-fg-danger)",
                color: "#fff",
                padding: "4px 12px",
                borderRadius: "20px",
                fontSize: "0.8rem",
                fontWeight: "bold",
              }}
            >
              {state.unreadContacts.length} UNREAD
            </div>
          )}
        </HardwarePanel>
      </div>
    </div>
  );
}
