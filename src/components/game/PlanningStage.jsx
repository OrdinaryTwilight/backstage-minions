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
  const isFail = reportScore !== null && reportScore < 40; // Threshold for "More Coverage Needed"

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
      <p
        style={{
          color: "var(--color-pencil-light)",
          marginBottom: "1.5rem",
          fontSize: "0.9rem",
        }}
      >
        {submitted
          ? "Awaiting Stage Manager approval..."
          : "Select a fixture and map the stage coverage."}
      </p>

      {/* Fixture palette - More compact to balance the screen */}
      <div
        style={{
          marginBottom: "1.5rem",
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
              minWidth: "80px", // Smaller buttons
              padding: "0.5rem",
              fontSize: "0.75rem",
              borderColor:
                selectedType === l.id ? l.color : "var(--glass-border)",
              color:
                selectedType === l.id ? l.color : "var(--color-pencil-light)",
              background:
                selectedType === l.id ? `${l.color}11` : "transparent",
            }}
          >
            {l.icon}
          </button>
        ))}
      </div>

      {/* Grid - Enlarged for better touch/click targets */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${PLOT_GRID_COLS}, 1fr)`,
          gap: "0.75rem",
          marginBottom: "1.5rem",
          width: "100%",
          maxWidth: "600px", // Larger grid
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
                aspectRatio: "1.2", // Slightly wider cells
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

      {/* Reporting Logic */}
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
              ? '"This stage is a dark pit. Add more fixtures or the actors will be invisible."'
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
            {/* Logic: Only show/allow Continue if coverage is sufficient */}
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
