import Button from "../../ui/Button";
import HardwarePanel from "../../ui/HardwarePanel";
import SectionHeader from "../../ui/SectionHeader";
import { useQuickChange } from "./useQuickChange";

export default function QuickChangeUI({
  difficulty,
  onComplete,
}: Readonly<{ difficulty: string; onComplete: () => void }>) {
  const {
    RACK_ITEMS,
    targetOutfit,
    equipped,
    toggleItem,
    timeLeft,
    isActive,
    setIsActive,
    isSuccess,
  } = useQuickChange(difficulty, onComplete);

  let statusText = `⏱️ 00:${timeLeft.toString().padStart(2, "0")}`;
  if (isSuccess) {
    statusText = "✅ OUTFIT PERFECT!";
  } else if (timeLeft === 0) {
    statusText = "❌ MISSED CUE!";
  }

  const START_TIME_BY_DIFFICULTY: Record<string, number> = {
    professional: 10,
    community: 15,
  };

  const startTime = START_TIME_BY_DIFFICULTY[difficulty] ?? 20;
  const hasStarted = timeLeft < startTime || isActive || isSuccess;
  return (
    <div
      className="page-container animate-blueprint"
      style={{ position: "relative" }}
    >
      <SectionHeader
        title="Execution: The Quick Change"
        subtitle={`The actor is here! You have limited time to equip the exact requested outfit before they run back to the stage.`}
      />

      {!hasStarted && (
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
            style={{
              fontSize: "3rem",
              color: "var(--bui-fg-warning)",
              fontFamily: "var(--font-sketch)",
            }}
          >
            ACTOR INBOUND
          </h1>
          <p
            style={{
              margin: "2rem 0",
              color: "#fff",
              maxWidth: "400px",
              textAlign: "center",
              fontFamily: "var(--font-sketch)",
            }}
          >
            Target Outfit:
            <br />
            <strong style={{ color: "var(--bui-fg-info)", fontSize: "1.2rem" }}>
              {targetOutfit
                .map((id) => RACK_ITEMS.find((r) => r.id === id)?.name)
                .join(" + ")}
            </strong>
            <br />
            <br />
            Equip the correct items. Do not equip extras!
          </p>
          <Button
            variant="success"
            className="animate-pulse-go"
            onClick={() => setIsActive(true)}
          >
            Start Timer
          </Button>
        </div>
      )}

      <div className="desktop-two-column" style={{ marginTop: "2rem" }}>
        {/* Silhouette / Actor */}
        <HardwarePanel
          style={{ textAlign: "center", position: "relative", height: "450px" }}
        >
          <h3
            className="annotation-text"
            style={{
              color: "var(--bui-fg-info)",
              fontFamily: "var(--font-sketch)",
            }}
          >
            {statusText}
          </h3>

          <div
            aria-hidden="true"
            style={{ position: "relative", height: "300px", marginTop: "2rem" }}
          >
            <div
              style={{
                fontSize: "10rem",
                filter:
                  "brightness(0) drop-shadow(0 0 10px rgba(255,255,255,0.2))",
              }}
            >
              👤
            </div>

            {/* Render Equipped Items on top of silhouette */}
            {equipped.map((id) => {
              const item = RACK_ITEMS.find((r) => r.id === id);
              if (!item) return null;

              let top = "50%";
              if (item.category === "HEAD") top = "10%";
              if (item.category === "BODY") top = "50%";
              if (item.category === "PROP") top = "70%";

              return (
                <div
                  key={`equipped-${id}`}
                  className="animate-pop"
                  style={{
                    position: "absolute",
                    top,
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    fontSize: "5rem",
                  }}
                >
                  {item.icon}
                </div>
              );
            })}
          </div>
        </HardwarePanel>

        {/* The Messy Rack */}
        <HardwarePanel>
          <h3
            className="annotation-text"
            style={{
              color: "var(--bui-fg-warning)",
              marginBottom: "1rem",
              fontFamily: "var(--font-sketch)",
            }}
          >
            The Costume Rack
          </h3>
          {/* SONARQUBE/WCAG FIX: S6819 - Replaced generic group role with semantic fieldset */}
          <fieldset
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "1rem",
              border: "none",
              padding: 0,
              margin: 0,
            }}
          >
            <legend
              className="sr-only"
              style={{ position: "absolute", left: "-10000px" }}
            >
              Available Clothes
            </legend>
            {RACK_ITEMS.map((item) => {
              const isEquipped = equipped.includes(item.id);
              return (
                <Button
                  key={item.id}
                  onClick={() => toggleItem(item.id)}
                  aria-pressed={isEquipped}
                  disabled={!isActive}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "0.5rem",
                    padding: "1rem",
                    background: isEquipped
                      ? "rgba(56, 189, 248, 0.2)"
                      : "transparent",
                    borderColor: isEquipped
                      ? "var(--bui-fg-info)"
                      : "var(--glass-border)",
                    fontFamily: "var(--font-sketch)", // UI Styling: Keep it feeling like a draft/sketch
                  }}
                >
                  <span style={{ fontSize: "2rem" }}>{item.icon}</span>
                  <span style={{ fontSize: "0.9rem" }}>{item.name}</span>
                </Button>
              );
            })}
          </fieldset>
        </HardwarePanel>
      </div>
    </div>
  );
}
