import Button from "../../ui/Button";
import HardwarePanel from "../../ui/HardwarePanel";
import SectionHeader from "../../ui/SectionHeader";
import { useLaundrySort } from "./useLaundrySort";

// SONARQUBE FIX: S6759 - Props marked as Readonly
export default function LaundrySortUI({
  difficulty,
  onComplete,
}: Readonly<{ difficulty: string; onComplete: () => void }>) {
  const {
    items,
    timeLeft,
    isActive,
    setIsActive,
    isPaused,
    setIsPaused,
    handleSort,
    feedback,
  } = useLaundrySort(difficulty, onComplete);

  const hasStarted = timeLeft < 30 || isActive;

  return (
    <div
      className="page-container animate-blueprint"
      style={{ position: "relative" }}
    >
      <SectionHeader
        title="Pre-Show: The Laundry Sort"
        subtitle="Sort incoming garments before they hit the floor. Keep darks and lights separate!"
        helpText="Use Left Arrow for DARKS, Up Arrow for DRY CLEAN, and Right Arrow for LIGHTS."
      />

      {isPaused && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.9)",
            zIndex: 5000,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <h1
            className="annotation-text"
            style={{ fontSize: "3rem", color: "var(--bui-fg-warning)" }}
          >
            {hasStarted ? "SORTING PAUSED" : "LAUNDRY CHUTE READY"}
          </h1>
          <p
            style={{
              margin: "2rem 0",
              color: "#fff",
              maxWidth: "400px",
              textAlign: "center",
            }}
          >
            Sort the falling items. <br />
            <br />
            ⬅️ Left: Darks
            <br />
            ⬆️ Up: Dry Clean Only
            <br />
            ➡️ Right: Lights
          </p>
          <Button
            variant="success"
            className="animate-pulse-go"
            onClick={() => {
              setIsPaused(false);
              setIsActive(true);
            }}
          >
            {hasStarted ? "Resume Sorting" : "Start Sorting"}
          </Button>
        </div>
      )}

      <HardwarePanel
        style={{
          maxWidth: "600px",
          margin: "0 auto",
          height: "60vh",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "1rem",
          }}
        >
          <div
            className="annotation-text"
            style={{ color: "var(--bui-fg-info)", fontSize: "1.2rem" }}
          >
            ⏱️ 00:{timeLeft.toString().padStart(2, "0")}
          </div>
          <div
            aria-live="polite"
            style={{
              color:
                feedback?.type === "error"
                  ? "var(--bui-fg-danger)"
                  : "var(--bui-fg-success)",
              fontWeight: "bold",
            }}
          >
            {feedback?.msg}
          </div>
        </div>

        {/* Falling Area */}
        <div
          aria-hidden="true"
          style={{
            flex: 1,
            position: "relative",
            background: "rgba(0,0,0,0.4)",
            border: "2px solid var(--glass-border)",
            borderRadius: "8px",
            overflow: "hidden",
          }}
        >
          {items.map((item) => (
            <div
              key={item.id}
              style={{
                position: "absolute",
                top: `${item.y}%`,
                left: "50%",
                transform: "translate(-50%, -50%)",
                fontSize: "3rem",
              }}
            >
              {item.icon}
            </div>
          ))}
        </div>

        <div style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}>
          <Button
            style={{ flex: 1, background: "#111" }}
            onClick={() => handleSort("DARKS")}
            disabled={!isActive || isPaused}
          >
            ← DARKS
          </Button>
          <Button
            style={{
              flex: 1,
              background: "var(--bui-fg-warning)",
              color: "#000",
            }}
            onClick={() => handleSort("DRY_CLEAN")}
            disabled={!isActive || isPaused}
          >
            ↑ DRY CLEAN
          </Button>
          <Button
            style={{ flex: 1, background: "#eee", color: "#000" }}
            onClick={() => handleSort("LIGHTS")}
            disabled={!isActive || isPaused}
          >
            LIGHTS →
          </Button>
        </div>
      </HardwarePanel>
    </div>
  );
}
