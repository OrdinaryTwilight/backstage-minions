import { useState } from "react";
import { useGame } from "../../context/GameContext";
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
    const score = Math.min(placed * 15, 100);
    setReportScore(score);
    setSubmitted(true);
    dispatch({ type: "SET_PLOT_LIGHTS", lights: grid });
    dispatch({ type: "ADD_SCORE", delta: score });
  }

  function proceed() {
    onComplete();
  }

  const lightMap = Object.fromEntries(LIGHT_TYPES.map((l) => [l.id, l]));

  return (
    <div>
      <h2>🗺️ Planning stage</h2>
      <p>
        Build your lighting plot. Select a fixture type, then tap the grid to
        place it.
        <br />
        The Stage Preview on a real board would show you the effect — here, fill
        the plot before submitting to the Stage Manager.
      </p>

      {/* Fixture palette */}
      <div
        style={{
          marginBottom: "1rem",
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
              padding: "0.4rem 0.8rem",
              borderRadius: "8px",
              fontSize: "0.82rem",
              border: `2px solid ${selectedType === l.id ? l.color : "var(--border)"}`,
              background:
                selectedType === l.id ? `${l.color}22` : "var(--surface2)",
              color: selectedType === l.id ? l.color : "var(--text-muted)",
              cursor: "pointer",
              fontWeight: 600,
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
          marginBottom: "1rem",
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
                background: lt ? `${lt.color}44` : "var(--surface2)",
                border: "1px solid var(--border)",
                fontSize: "1.2rem",
              }}
            >
              {lt ? lt.icon : "·"}
            </button>
          );
        })}
      </div>

      {/* Stage preview label */}
      <p style={{ fontSize: "0.9rem", color: "var(--text-dim)" }}>
        🔭 Stage Preview — {grid.filter(Boolean).length} fixtures placed
      </p>

      {!submitted ? (
        <button
          onClick={submit}
          style={{
            cursor: "pointer",
            padding: "0.75rem 1.5rem",
            marginTop: "1rem",
          }}
        >
          Submit to Stage Manager
        </button>
      ) : (
        <div
          style={{
            marginTop: "1rem",
            padding: "1rem",
            background: "var(--surface2)",
            borderRadius: "8px",
          }}
        >
          <h3>📊 SM Report Card</h3>
          <div>Fixtures placed: {grid.filter(Boolean).length}</div>
          <div>Score earned: +{reportScore} pts</div>
          <p>
            {reportScore >= 80
              ? '"Solid plot — let\'s move to rehearsal."'
              : reportScore >= 40
                ? '"It\'ll do, but we need more coverage."'
                : '"We\'ll have to make do. Onwards."'}
          </p>
          <button
            onClick={onComplete}
            style={{ cursor: "pointer", marginTop: "1rem" }}
          >
            Continue
          </button>
        </div>
      )}
    </div>
  );
}
