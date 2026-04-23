import { useEffect } from "react";
import Button from "../../ui/Button";
import HardwarePanel from "../../ui/HardwarePanel";
import SectionHeader from "../../ui/SectionHeader";
import { useFlyPhysics } from "./useFlyPhysics";

export default function FlySystemExecution({
  difficulty = "school",
  onComplete,
}: Readonly<{ difficulty?: string; onComplete: () => void }>) {
  const {
    tension,
    targetPos,
    timeLeft,
    score,
    isActive,
    startGame,
    setHolding,
  } = useFlyPhysics(difficulty, onComplete);

  const handleStart = () => {
    if (document.activeElement instanceof HTMLElement)
      document.activeElement.blur();
    startGame();
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === "Space" && isActive && !e.repeat) {
        e.preventDefault();
        setHolding(true);
      }
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === "Space" && isActive) {
        e.preventDefault();
        setHolding(false);
      }
    };

    globalThis.addEventListener("keydown", handleKeyDown);
    globalThis.addEventListener("keyup", handleKeyUp);
    return () => {
      globalThis.removeEventListener("keydown", handleKeyDown);
      globalThis.removeEventListener("keyup", handleKeyUp);
    };
  }, [isActive, setHolding]);

  const isAligned = Math.abs(tension - targetPos) < 15;

  let controlSection;
  if (!isActive && timeLeft > 0) {
    controlSection = (
      <Button
        variant="accent"
        className="btn-xl animate-pulse-go"
        onClick={handleStart}
      >
        Unlock the Rail (Start)
      </Button>
    );
  } else if (timeLeft > 0) {
    controlSection = (
      <button
        type="button"
        onPointerDown={() => setHolding(true)}
        onPointerUp={() => setHolding(false)}
        onPointerLeave={() => setHolding(false)}
        style={{
          width: "100%",
          padding: "2rem",
          fontSize: "1.5rem",
          fontWeight: "bold",
          fontFamily: "var(--font-sketch)",
          background: "var(--bui-fg-warning)",
          color: "#000",
          border: "none",
          borderRadius: "8px",
          cursor: "pointer",
          boxShadow: "0 10px 20px rgba(0,0,0,0.5)",
          touchAction: "none",
        }}
        aria-label="Hold to apply tension. Release to drop."
      >
        HOLD TO PULL (Or press Spacebar)
      </button>
    );
  } else {
    controlSection = (
      <div
        className="annotation-text"
        style={{ color: "var(--bui-fg-success)", fontSize: "1.5rem" }}
      >
        Scene Complete. Securing the line...
      </div>
    );
  }

  return (
    <div className="page-container animate-blueprint">
      <SectionHeader
        title="Execution: The Fly Rail"
        subtitle="Match the pace of the scene! Hold SPACE to pull the scenery UP (white line). Release to let gravity pull it DOWN. Try to keep it inside the moving Green Target Zone!"
      />

      <HardwarePanel
        style={{ maxWidth: "600px", margin: "0 auto", textAlign: "center" }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "2rem",
          }}
        >
          <div
            className="annotation-text"
            style={{ fontSize: "1.5rem", color: "var(--bui-fg-info)" }}
          >
            Time: 00:{timeLeft.toString().padStart(2, "0")}
          </div>
          <div
            className="annotation-text"
            style={{ fontSize: "1.2rem", color: "var(--bui-fg-warning)" }}
          >
            Target Accuracy: {Math.floor(score / 5)} pts
          </div>
        </div>

        <div
          aria-hidden="true"
          style={{
            position: "relative",
            width: "100px",
            height: "400px",
            background: "#111",
            margin: "0 auto",
            border: "2px solid var(--glass-border)",
            borderRadius: "8px",
            overflow: "hidden",
          }}
        >
          {/* Target Zone */}
          <div
            style={{
              position: "absolute",
              bottom: `${targetPos}%`,
              left: 0,
              width: "100%",
              height: "60px",
              background: "rgba(74, 222, 128, 0.3)",
              borderTop: "2px solid var(--bui-fg-success)",
              borderBottom: "2px solid var(--bui-fg-success)",
              transform: "translateY(50%)",
              transition: "bottom 0.1s linear",
            }}
          />
          <div
            style={{
              position: "absolute",
              bottom: `${tension}%`,
              left: "10%",
              width: "80%",
              height: "8px",
              background: isAligned ? "var(--bui-fg-success)" : "#fff",
              borderRadius: "4px",
              transform: "translateY(50%)",
              boxShadow: isAligned
                ? "0 0 15px var(--bui-fg-success)"
                : "0 0 10px rgba(255,255,255,0.5)",
            }}
          />
        </div>

        <div style={{ marginTop: "2rem" }}>{controlSection}</div>
      </HardwarePanel>
    </div>
  );
}
