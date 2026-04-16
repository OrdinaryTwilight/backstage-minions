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

    // Centralized scoring logic from constants.js
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
    <div
      className="hardware-panel"
      style={{ background: "var(--surface2)", padding: "1.5rem" }}
    >
      <h2 style={{ marginBottom: "0.5rem" }}>🗺️ Planning stage</h2>
      <p
        style={{
          color: "var(--text-muted)",
          marginBottom: "1.5rem",
          lineHeight: "1.5",
        }}
      >
        Build your lighting plot. Select a fixture type, then tap the grid to
        place it.
        <br />
        <br />
        The Stage Preview on a real board would show you the effect — here, fill
        the plot before submitting to the Stage Manager.
      </p>

      {/* Fixture palette */}
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
            style={{
              padding: "0.5rem 1rem",
              borderRadius: "8px",
              fontSize: "0.85rem",
              border: `2px solid ${selectedType === l.id ? l.color : "var(--border)"}`,
              background:
                selectedType === l.id ? `${l.color}22` : "var(--surface1)",
              color: selectedType === l.id ? l.color : "var(--text-muted)",
              cursor: "pointer",
              fontWeight: 600,
              transition: "all 0.1s",
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
          gap: "0.25rem",
          marginBottom: "1.5rem",
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
              title={lt ? lt.label : "Empty"}
              style={{
                aspectRatio: "1",
                padding: "0",
                cursor: "pointer",
                background: lt ? `${lt.color}44` : "var(--surface1)",
                border: "1px solid var(--border)",
                fontSize: "1.5rem",
                borderRadius: "4px",
              }}
            >
              {lt ? lt.icon : "·"}
            </button>
          );
        })}
      </div>

      {/* Stage preview label */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
          marginBottom: "0.5rem",
        }}
      >
        <span
          style={{
            fontSize: "0.9rem",
            color: "var(--text-dim)",
            fontWeight: "bold",
          }}
        >
          🔭 STAGE PREVIEW
        </span>
        <span style={{ fontSize: "0.8rem", color: "var(--accent)" }}>
          {grid.filter(Boolean).length} fixtures placed
        </span>
      </div>

      {/* Visual Stage Preview */}
      <div
        className="console-screen"
        style={{
          height: "180px",
          marginBottom: "1.5rem",
          position: "relative",
          overflow: "hidden",
          padding: 0,
        }}
      >
        <div
          style={{
            position: "absolute",
            bottom: "10px",
            width: "100%",
            textAlign: "center",
            color: "#555",
            fontFamily: "monospace",
            zIndex: 10,
          }}
        >
          STAGE FRONT
        </div>

        {grid.map((cell, i) => {
          if (!cell) return null;
          const lt = LIGHT_TYPES.find((t) => t.id === cell.typeId);

          const x = ((i % PLOT_GRID_COLS) / (PLOT_GRID_COLS - 1)) * 90 + 5;
          const y =
            (Math.floor(i / PLOT_GRID_COLS) / Math.max(1, PLOT_GRID_ROWS - 1)) *
              80 +
            10;

          return (
            <div
              key={`preview-${i}`}
              style={{
                position: "absolute",
                left: `${x}%`,
                top: `${y}%`,
                width: "140px",
                height: "140px",
                background: `radial-gradient(circle, ${lt?.color} 0%, transparent 60%)`,
                transform: "translate(-50%, -50%)",
                opacity: 0.6,
                mixBlendMode: "screen",
                pointerEvents: "none",
              }}
            />
          );
        })}
      </div>

      {/* Submission & Report Card Container */}
      {!submitted ? (
        <button
          onClick={submit}
          className="action-button btn-success"
          style={{ width: "100%" }}
        >
          Submit to Stage Manager
        </button>
      ) : (
        <div
          className="surface-panel"
          style={{ borderLeft: "4px solid var(--accent)", background: "#111" }}
        >
          <h3 style={{ color: "var(--accent)", marginBottom: "1rem" }}>
            📊 SM Report Card
          </h3>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: "0.5rem",
            }}
          >
            <span>Fixtures placed:</span>
            <strong>{grid.filter(Boolean).length}</strong>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: "1rem",
            }}
          >
            <span>Score earned:</span>
            <strong style={{ color: "var(--success)" }}>
              +{reportScore} pts
            </strong>
          </div>

          <p
            style={{
              fontStyle: "italic",
              padding: "1rem",
              background: "var(--surface2)",
              borderRadius: "4px",
              color: "var(--text-muted)",
              marginBottom: "1.5rem",
            }}
          >
            {reportScore >= 80
              ? '"Solid plot — let\'s move to rehearsal."'
              : reportScore >= 40
                ? '"It\'ll do, but we need more coverage."'
                : '"We\'ll have to make do. Onwards."'}
          </p>
          <button
            onClick={onComplete}
            className="action-button btn-accent"
            style={{ width: "100%" }}
          >
            Continue to Rehearsal
          </button>
        </div>
      )}
    </div>
  );
}
