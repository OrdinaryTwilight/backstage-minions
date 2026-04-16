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
    const placed = grid.filter(Boolean).length;
    const score = Math.min(
      placed * SCORING.PLANNING_PER_FIXTURE,
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
        🗺️ Planning stage
      </h2>
      <p
        style={{
          color: "var(--color-pencil-light)",
          marginBottom: "1.5rem",
          lineHeight: "1.5",
        }}
      >
        Build your lighting plot. Select a fixture type, then tap the grid to
        place it.
      </p>

      {/* Fixture palette */}
      <div
        style={{
          marginBottom: "1.5rem",
          display: "flex",
          gap: "0.75rem",
          flexWrap: "wrap",
          justifyContent: "center",
        }}
      >
        {LIGHT_TYPES.map((l) => (
          <button
            key={l.id}
            onClick={() => setSelectedType(l.id)}
            className="action-button"
            style={{
              minWidth: "120px",
              borderColor:
                selectedType === l.id ? l.color : "var(--glass-border)",
              color:
                selectedType === l.id ? l.color : "var(--color-pencil-light)",
              background:
                selectedType === l.id
                  ? `${l.color}11`
                  : "var(--color-surface-translucent)",
            }}
          >
            {l.icon} {l.label}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${PLOT_GRID_COLS}, 1fr)`,
          gap: "0.5rem",
          marginBottom: "1.5rem",
          maxWidth: "400px",
          margin: "0 auto 1.5rem",
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
                background: lt ? `${lt.color}33` : "rgba(0,0,0,0.2)",
                borderColor: lt ? lt.color : "var(--glass-border)",
                color: lt ? lt.color : "transparent",
              }}
            >
              {lt ? lt.icon : ""}
            </button>
          );
        })}
      </div>

      {/* Stage Preview Window */}
      <div
        className="console-screen"
        style={{
          height: "160px",
          marginBottom: "1.5rem",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            bottom: "5px",
            width: "100%",
            textAlign: "center",
            color: "var(--color-pencil-light)",
            opacity: 0.4,
            fontSize: "0.7rem",
          }}
        >
          STAGE FRONT
        </div>
        {grid.map((cell, i) => {
          if (!cell) return null;
          const lt = LIGHT_TYPES.find((t) => t.id === cell.typeId);
          const x = ((i % PLOT_GRID_COLS) / (PLOT_GRID_COLS - 1)) * 80 + 10;
          const y =
            (Math.floor(i / PLOT_GRID_COLS) / Math.max(1, PLOT_GRID_ROWS - 1)) *
              70 +
            10;
          return (
            <div
              key={`pre-${i}`}
              style={{
                position: "absolute",
                left: `${x}%`,
                top: `${y}%`,
                width: "100px",
                height: "100px",
                background: `radial-gradient(circle, ${lt?.color} 0%, transparent 70%)`,
                transform: "translate(-50%, -50%)",
                opacity: 0.5,
                mixBlendMode: "screen",
              }}
            />
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
          Submit to Stage Manager
        </button>
      ) : (
        <div
          className="surface-panel"
          style={{
            borderLeft: "4px solid var(--bui-fg-info)",
            background: "rgba(0,0,0,0.3)",
          }}
        >
          <h3 style={{ color: "var(--bui-fg-info)", marginBottom: "1rem" }}>
            📊 SM Report Card
          </h3>
          <p
            style={{
              fontStyle: "italic",
              marginBottom: "1.5rem",
              color: "var(--color-pencil-light)",
            }}
          >
            {reportScore >= 80
              ? '"Solid plot — let\'s move to rehearsal."'
              : '"It\'ll do, but we need more coverage."'}
          </p>
          <div style={{ display: "flex", gap: "1rem" }}>
            <button
              onClick={() => setSubmitted(false)}
              className="action-button"
              style={{ flex: 1, minWidth: "0" }}
            >
              Revise Plot
            </button>
            <button
              onClick={onComplete}
              className="action-button btn-accent"
              style={{ flex: 1, minWidth: "0" }}
            >
              Continue
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
