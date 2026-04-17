import { useState } from "react";
import { useGame } from "../../context/GameContext";
import { SCORING } from "../../data/constants";
import {
  LIGHT_TYPES,
  PLOT_GRID_COLS,
  PLOT_GRID_ROWS,
} from "../../data/gameData";
import Button from "../ui/Button";
import HardwarePanel from "../ui/HardwarePanel";
import SectionHeader from "../ui/SectionHeader";

/**
 * PlanningStage: A technical drafting console for lighting designers.
 * Features dynamic beam simulation and optical diagnostics.
 */
export default function PlanningStage({ onComplete }) {
  const { dispatch } = useGame();
  const [selectedType, setSelectedType] = useState(LIGHT_TYPES[0].id);
  const [grid, setGrid] = useState(() =>
    Array(PLOT_GRID_ROWS * PLOT_GRID_COLS).fill(null),
  );
  const [submitted, setSubmitted] = useState(false);
  const [reportScore, setReportScore] = useState(null);

  const placedCount = grid.filter(Boolean).length;
  const isFail = reportScore !== null && reportScore < 40;

  function placeLight(i) {
    if (submitted) return;
    setGrid((g) => {
      const copy = [...g];
      // Toggle logic: if same type, remove; if different, replace.
      copy[i] =
        copy[i]?.typeId === selectedType ? null : { typeId: selectedType };
      return copy;
    });
  }

  function submit() {
    const score = Math.min(
      placedCount * SCORING.PLANNING_PER_FIXTURE,
      SCORING.PLANNING_MAX,
    );
    setReportScore(score);
    setSubmitted(true);
    dispatch({ type: "SET_PLOT_LIGHTS", lights: grid });
    dispatch({ type: "ADD_SCORE", delta: score });
  }

  return (
    <div className="page-container animate-blueprint">
      <SectionHeader
        title="Optical Drafting"
        subtitle="Configure the rig and simulate beam dispersion on the stage floor."
      />

      <div className="desktop-two-column">
        {/* LEFT PANEL: Technical Drafting Grid */}
        <div className="desktop-col-main">
          <HardwarePanel style={{ borderLeft: "4px solid var(--bui-fg-info)" }}>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: `repeat(${PLOT_GRID_COLS}, 1fr)`,
                gap: "8px",
              }}
            >
              {grid.map((cell, i) => {
                const lt = cell
                  ? LIGHT_TYPES.find((t) => t.id === cell.typeId)
                  : null;
                return (
                  <button
                    key={i}
                    onClick={() => placeLight(i)}
                    className="plot-cell"
                    style={{
                      background: lt ? `${lt.color}22` : "rgba(0,0,0,0.1)",
                      borderColor: lt ? lt.color : "var(--glass-border)",
                      aspectRatio: "1",
                    }}
                  >
                    {lt ? lt.icon : ""}
                  </button>
                );
              })}
            </div>

            {/* Fixture Palette */}
            <div style={{ marginTop: "1.5rem", display: "flex", gap: "8px" }}>
              {LIGHT_TYPES.map((l) => (
                <Button
                  key={l.id}
                  onClick={() => setSelectedType(l.id)}
                  style={{
                    flex: 1,
                    borderColor: selectedType === l.id ? l.color : "",
                  }}
                >
                  {l.icon} {l.label}
                </Button>
              ))}
            </div>
          </HardwarePanel>
        </div>

        {/* RIGHT PANEL: Dynamic Stage Simulation */}
        <div className="desktop-col-side">
          <HardwarePanel
            style={{
              height: "100%",
              background: "#050505",
              position: "relative",
              overflow: "hidden",
            }}
          >
            <div
              className="annotation-text"
              style={{ fontSize: "0.7rem", opacity: 0.5 }}
            >
              [OPTICAL_SIMULATION_LIVE]
            </div>

            <div
              style={{
                position: "relative",
                height: "320px",
                marginTop: "1rem",
                background: "rgba(255,255,255,0.02)",
                borderRadius: "4px",
              }}
            >
              {/* Volumetric Beams */}
              {grid.map((cell, i) => {
                if (!cell) return null;
                const type = LIGHT_TYPES.find((t) => t.id === cell.typeId);
                const col = i % PLOT_GRID_COLS;
                const isSpot = type.id === "spot";

                return (
                  <div
                    key={i}
                    style={{
                      position: "absolute",
                      left: `${(col / (PLOT_GRID_COLS - 1)) * 100}%`,
                      top: "0",
                      width: isSpot ? "25%" : "50%",
                      height: "100%",
                      background: `linear-gradient(to bottom, ${type.color}66, transparent)`,
                      clipPath: "polygon(50% 0%, 0% 100%, 100% 100%)",
                      transform: "translateX(-50%)",
                      opacity: 0.5,
                      filter: `blur(${isSpot ? "1px" : "12px"})`,
                      zIndex: 1,
                      transition: "all 0.3s ease",
                    }}
                  />
                );
              })}

              {/* Floor Illumination Pools */}
              <div
                style={{
                  position: "absolute",
                  bottom: 0,
                  width: "100%",
                  height: "20%",
                  zIndex: 2,
                }}
              >
                {grid.map((cell, i) => {
                  if (!cell) return null;
                  const type = LIGHT_TYPES.find((t) => t.id === cell.typeId);
                  const col = i % PLOT_GRID_COLS;
                  return (
                    <div
                      key={i}
                      style={{
                        position: "absolute",
                        left: `${(col / (PLOT_GRID_COLS - 1)) * 100}%`,
                        bottom: "25%",
                        width: type.id === "spot" ? "12px" : "45px",
                        height: "8px",
                        background: type.color,
                        borderRadius: "50%",
                        filter: "blur(5px)",
                        transform: "translateX(-50%)",
                        boxShadow: `0 0 20px ${type.color}`,
                        transition: "all 0.3s ease",
                      }}
                    />
                  );
                })}
              </div>
            </div>
          </HardwarePanel>
        </div>
      </div>

      {/* Control Footer */}
      <div style={{ marginTop: "2rem" }}>
        {!submitted ? (
          <Button
            variant="success"
            className="btn-xl" // NEW: Makes it taller and more prominent
            onClick={submit}
            style={{ width: "100%" }}
          >
            Commit Technical Plot
          </Button>
        ) : (
          <HardwarePanel className="animate-pop">
            <h3
              className="annotation-text"
              style={{
                color: isFail
                  ? "var(--bui-fg-danger)"
                  : "var(--bui-fg-success)",
              }}
            >
              {isFail
                ? "⚠️ INSUFFICIENT COVERAGE"
                : "✅ TECHNICAL CLEARANCE GRANTED"}
            </h3>
            <div style={{ display: "flex", gap: "1rem", marginTop: "1.5rem" }}>
              <Button onClick={() => setSubmitted(false)}>Revise Draft</Button>
              {!isFail && (
                <Button variant="accent" onClick={onComplete}>
                  Initialize Stage
                </Button>
              )}
            </div>
          </HardwarePanel>
        )}
      </div>
    </div>
  );
}
