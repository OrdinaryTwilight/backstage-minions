import { useState } from "react";
import { useGame } from "../../context/GameContext";
import { SCORING } from "../../data/constants";
import {
  LIGHT_TYPES,
  PLOT_GRID_COLS,
  PLOT_GRID_ROWS,
} from "../../data/gameData";

export default function PlanningStage({ onComplete }) {
  const { dispatch } = useGame();
  const [selectedType, setSelectedType] = useState(LIGHT_TYPES[0].id);
  const [grid, setGrid] = useState(() =>
    Array(PLOT_GRID_ROWS * PLOT_GRID_COLS).fill(null),
  );
  const [submitted, setSubmitted] = useState(false);
  const [reportScore, setReportScore] = useState(null);

  const placedCount = grid.filter(Boolean).length;
  // Stage Gating: Scores below 40 are considered a failure
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
    <div className="hardware-panel">
      <h2 style={{ marginBottom: "0.5rem", color: "var(--bui-fg-info)" }}>
        🗺️ Drafting: Lighting Plot
      </h2>

      {/* Grid UI - Enlarged for better visibility */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${PLOT_GRID_COLS}, 1fr)`,
          gap: "0.75rem",
          marginBottom: "1.5rem",
          width: "100%",
          maxWidth: "600px",
          margin: "0 auto 2rem",
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
                aspectRatio: "1.2",
                background: lt ? `${lt.color}33` : "rgba(0,0,0,0.1)",
                borderColor: lt ? lt.color : "var(--glass-border)",
                fontSize: "1.2rem",
              }}
            >
              {lt ? lt.icon : "·"}
            </button>
          );
        })}
      </div>

      {!submitted ? (
        <button
          onClick={submit}
          className="action-button btn-success"
          style={{ width: "100%", maxWidth: "none" }}
        >
          Submit Plot
        </button>
      ) : (
        <div
          className="surface-panel"
          style={{
            borderLeft: `4px solid ${isFail ? "var(--bui-fg-danger)" : "var(--bui-fg-success)"}`,
          }}
        >
          <h3
            style={{
              color: isFail ? "var(--bui-fg-danger)" : "var(--bui-fg-success)",
              marginBottom: "0.5rem",
            }}
          >
            {isFail ? "⚠️ REJECTED: Inadequate Coverage" : "✅ APPROVED"}
          </h3>
          <p
            style={{
              fontStyle: "italic",
              marginBottom: "1.5rem",
              fontSize: "0.9rem",
            }}
          >
            {isFail
              ? '"This stage is a dark pit. Add more fixtures."'
              : '"Clean plot. Let\'s get to rehearsal."'}
          </p>
          <div style={{ display: "flex", gap: "1rem" }}>
            <button
              onClick={() => setSubmitted(false)}
              className="action-button"
              style={{ flex: 1 }}
            >
              Revise Plot
            </button>
            {/* The Gate: Continue only appears if score is sufficient */}
            {!isFail && (
              <button
                onClick={onComplete}
                className="action-button btn-accent"
                style={{ flex: 1 }}
              >
                Continue
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
