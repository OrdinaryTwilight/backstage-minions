import { useState } from "react";
import { useGame } from "../../context/GameContext";
import { SCORING } from "../../data/constants";
import {
  LIGHT_TYPES,
  PLOT_GRID_COLS,
  PLOT_GRID_ROWS,
} from "../../data/gameData";
import HardwarePanel from "../ui/HardwarePanel";

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
      <div className="desktop-two-column">
        {/* LEFT PANEL: The Technical Grid */}
        <div className="desktop-col-main">
          <HardwarePanel style={{ borderLeft: "4px solid var(--bui-fg-info)" }}>
            <h2 className="annotation-text" style={{ marginBottom: "1rem" }}>
              🗺️ Technical Plot
            </h2>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: `repeat(${PLOT_GRID_COLS}, 1fr)`,
                gap: "0.5rem",
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
                      background: lt ? `${lt.color}22` : "rgba(0,0,0,0.2)",
                      borderColor: lt ? lt.color : "var(--glass-border)",
                      aspectRatio: "1",
                    }}
                  >
                    {lt ? lt.icon : ""}
                  </button>
                );
              })}
            </div>
          </HardwarePanel>

          <div
            style={{
              marginTop: "1.5rem",
              display: "flex",
              gap: "0.5rem",
              flexWrap: "wrap",
            }}
          >
            {LIGHT_TYPES.map((l) => (
              <button
                key={l.id}
                onClick={() => setSelectedType(l.id)}
                className="action-button"
                style={{
                  flex: 1,
                  minWidth: "100px",
                  borderColor: selectedType === l.id ? l.color : "",
                }}
              >
                {l.icon} {l.label}
              </button>
            ))}
          </div>
        </div>

        {/* RIGHT PANEL: The Stage Visualization (Coverage Box) */}
        <div className="desktop-col-side">
          <HardwarePanel
            style={{
              height: "100%",
              background: "#050505",
              overflow: "hidden",
            }}
          >
            <h3
              className="annotation-text"
              style={{ fontSize: "0.9rem", opacity: 0.6 }}
            >
              LIVE STAGE PREVIEW
            </h3>
            <div
              className="stage-area"
              style={{
                position: "relative",
                width: "100%",
                height: "250px",
                background: "rgba(255,255,255,0.02)",
                marginTop: "1rem",
                borderRadius: "8px",
              }}
            >
              {/* Architectural Stage Markers */}
              <div
                style={{
                  position: "absolute",
                  bottom: 0,
                  width: "100%",
                  height: "2px",
                  background: "var(--color-architect-blue)",
                  opacity: 0.3,
                }}
              />

              {/* Simulated Light Beams */}
              {grid.map((cell, i) => {
                if (!cell) return null;
                const lt = LIGHT_TYPES.find((t) => t.id === cell.typeId);
                const col = i % PLOT_GRID_COLS;
                const row = Math.floor(i / PLOT_GRID_COLS);
                return (
                  <div
                    key={i}
                    className="animate-flicker"
                    style={{
                      position: "absolute",
                      left: `${(col / (PLOT_GRID_COLS - 1)) * 80 + 10}%`,
                      top: `${(row / (PLOT_GRID_ROWS - 1)) * 60 + 10}%`,
                      width: "60px",
                      height: "60px",
                      borderRadius: "50%",
                      background: `radial-gradient(circle, ${lt.color}88 0%, transparent 70%)`,
                      filter: "blur(8px)",
                      transform: "translate(-50%, -50%)",
                      zIndex: 2,
                    }}
                  />
                );
              })}
            </div>
            {placedCount < 3 && (
              <p
                style={{
                  fontSize: "0.75rem",
                  opacity: 0.5,
                  marginTop: "1rem",
                  textAlign: "center",
                }}
              >
                [ INSOLATED COVERAGE DETECTED ]
              </p>
            )}
          </HardwarePanel>
        </div>
      </div>

      <div style={{ marginTop: "2rem" }}>
        {!submitted ? (
          <button
            onClick={submit}
            className="action-button btn-success"
            style={{ width: "100%" }}
          >
            Finalize Drafting
          </button>
        ) : (
          <div className="surface-panel animate-pop">
            <h3
              style={{
                color: isFail
                  ? "var(--bui-fg-danger)"
                  : "var(--bui-fg-success)",
              }}
            >
              {isFail ? "⚠️ INADEQUATE PLOT" : "✅ PLOT APPROVED"}
            </h3>
            <p style={{ fontStyle: "italic", margin: "0.5rem 0 1.5rem" }}>
              {isFail
                ? '"The director says it looks like a cave. Add more wash."'
                : '"Clean coverage. Proceed to rehearsal."'}
            </p>
            <div style={{ display: "flex", gap: "1rem" }}>
              <button
                onClick={() => setSubmitted(false)}
                className="action-button"
              >
                Revise Plot
              </button>
              {!isFail && (
                <button
                  onClick={onComplete}
                  className="action-button btn-accent"
                >
                  Continue
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
