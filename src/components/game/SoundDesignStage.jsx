import { useState } from "react";
import { useGame } from "../../context/GameContext";
import {
  AUDIO_TYPES,
  PLOT_GRID_COLS,
  PLOT_GRID_ROWS,
} from "../../data/gameData";

export default function SoundDesignStage({ onComplete }) {
  const { dispatch } = useGame();
  const [grid, setGrid] = useState(
    Array(PLOT_GRID_ROWS * PLOT_GRID_COLS).fill(null),
  );
  const [selected, setSelected] = useState(AUDIO_TYPES?.[0]?.id || "mic");
  const [submitted, setSubmitted] = useState(false);
  const [reportScore, setReportScore] = useState(null);

  const placedCount = grid.filter(Boolean).length;
  const isFail = reportScore !== null && reportScore < 30; // Audio gating threshold

  function toggle(i) {
    if (submitted) return;
    const copy = [...grid];
    copy[i] =
      copy[i]?.id === selected
        ? null
        : AUDIO_TYPES.find((t) => t.id === selected);
    setGrid(copy);
  }

  function submit() {
    const score = Math.min(placedCount * 10, 100);
    setReportScore(score);
    setSubmitted(true);
    dispatch({ type: "ADD_SCORE", delta: score });
  }

  return (
    <div className="hardware-panel">
      <h2 style={{ color: "var(--bui-fg-info)" }}>🎚️ Sound Mapping</h2>
      {/* Grid and Palette UI... */}
      {!submitted ? (
        <button
          onClick={submit}
          className="action-button btn-success"
          style={{ width: "100%" }}
        >
          Finalize Map
        </button>
      ) : (
        <div
          className="surface-panel"
          style={{
            borderLeft: `4px solid ${isFail ? "var(--bui-fg-danger)" : "var(--bui-fg-success)"}`,
          }}
        >
          <h3>{isFail ? "⚠️ Audio Issues" : "✅ Systems Ready"}</h3>
          <div style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}>
            <button
              onClick={() => setSubmitted(false)}
              className="action-button"
            >
              Revise
            </button>
            {!isFail && (
              <button onClick={onComplete} className="action-button btn-accent">
                Continue
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
