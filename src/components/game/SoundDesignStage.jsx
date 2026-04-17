import { useState } from "react";
import { useGame } from "../../context/GameContext";
import { SCORING } from "../../data/constants";
import {
  AUDIO_TYPES,
  CHARACTERS,
  PLOT_GRID_COLS,
  PLOT_GRID_ROWS,
} from "../../data/gameData";
import Button from "../ui/Button";
import HardwarePanel from "../ui/HardwarePanel";
import SectionHeader from "../ui/SectionHeader";

export default function SoundDesignStage({ onComplete }) {
  const { state, dispatch } = useGame();
  const [selectedType, setSelectedType] = useState(AUDIO_TYPES[0].id);
  const [grid, setGrid] = useState(() =>
    Array(PLOT_GRID_ROWS * PLOT_GRID_COLS).fill(null),
  );
  const [submitted, setSubmitted] = useState(false);

  // Personalization: Get the current specialist's icon
  const char = CHARACTERS.find((c) => c.id === state.session.characterId);
  const placedCount = grid.filter(Boolean).length;
  const isFail = submitted && placedCount < 3;

  function placeNode(i) {
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
    dispatch({ type: "ADD_SCORE", delta: score });
    setSubmitted(true);
  }

  return (
    <div className="page-container animate-blueprint">
      <SectionHeader
        title="Audio Mapping"
        subtitle="Configure the acoustic signature and signal routing."
      />

      <div className="desktop-two-column">
        {/* LEFT: The Audio Patch Grid */}
        <div className="desktop-col-main">
          <HardwarePanel style={{ borderLeft: "6px solid var(--bui-fg-info)" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "1rem",
              }}
            >
              <h2 className="annotation-text">🎛️ Signal Plot</h2>
              <div style={{ fontSize: "1.5rem" }}>{char?.icon}</div>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: `repeat(${PLOT_GRID_COLS}, 1fr)`,
                gap: "0.6rem",
              }}
            >
              {grid.map((cell, i) => {
                const at = cell
                  ? AUDIO_TYPES.find((t) => t.id === cell.typeId)
                  : null;
                return (
                  <button
                    key={i}
                    onClick={() => placeNode(i)}
                    className="plot-cell"
                    style={{
                      background: at ? `${at.color}33` : "rgba(0,0,0,0.15)",
                      borderColor: at ? at.color : "var(--glass-border)",
                      aspectRatio: "1.1",
                    }}
                  >
                    {at ? at.icon : "·"}
                  </button>
                );
              })}
            </div>

            <div
              style={{ display: "flex", gap: "0.5rem", marginTop: "1.5rem" }}
            >
              {AUDIO_TYPES.map((t) => (
                <Button
                  key={t.id}
                  onClick={() => setSelectedType(t.id)}
                  style={{
                    flex: 1,
                    borderColor: selectedType === t.id ? t.color : "",
                  }}
                >
                  {t.icon} {t.label}
                </Button>
              ))}
            </div>
          </HardwarePanel>
        </div>

        {/* RIGHT: Acoustic Simulation Box */}
        <div className="desktop-col-side">
          <HardwarePanel
            style={{
              height: "100%",
              background: "#080808",
              position: "relative",
            }}
          >
            <h3
              className="annotation-text"
              style={{ fontSize: "0.8rem", opacity: 0.5 }}
            >
              ACOUSTIC HEATMAP
            </h3>
            <div
              style={{
                position: "relative",
                height: "280px",
                marginTop: "1rem",
              }}
            >
              {/* Stage markers */}
              <div
                style={{
                  position: "absolute",
                  bottom: "10px",
                  left: "10%",
                  right: "10%",
                  height: "2px",
                  background: "var(--color-architect-blue)",
                  opacity: 0.2,
                }}
              />

              {/* Pulse Animation Simulation */}
              {grid.map((cell, i) => {
                if (!cell) return null;
                const at = AUDIO_TYPES.find((t) => t.id === cell.typeId);
                const col = i % PLOT_GRID_COLS;
                const row = Math.floor(i / PLOT_GRID_COLS);
                return (
                  <div
                    key={i}
                    className="animate-pulse-go"
                    style={{
                      position: "absolute",
                      left: `${(col / (PLOT_GRID_COLS - 1)) * 80 + 10}%`,
                      top: `${(row / (PLOT_GRID_ROWS - 1)) * 60 + 10}%`,
                      width: "50px",
                      height: "50px",
                      borderRadius: "50%",
                      background: `radial-gradient(circle, ${at.color}66 0%, transparent 80%)`,
                      transform: "translate(-50%, -50%)",
                      zIndex: 2,
                    }}
                  />
                );
              })}
            </div>
            {placedCount < 3 && (
              <p
                className="annotation-text"
                style={{
                  textAlign: "center",
                  fontSize: "0.7rem",
                  color: "var(--bui-fg-danger)",
                }}
              >
                [ PHASE MISMATCH: INSUFFICIENT NODES ]
              </p>
            )}
          </HardwarePanel>
        </div>
      </div>

      <div style={{ marginTop: "2rem" }}>
        {!submitted ? (
          <Button variant="success" onClick={submit} style={{ width: "100%" }}>
            Commit Audio Patch
          </Button>
        ) : (
          <div className="surface-panel animate-pop">
            <h3
              className="annotation-text"
              style={{
                color: isFail
                  ? "var(--bui-fg-danger)"
                  : "var(--bui-fg-success)",
              }}
            >
              {isFail ? "⚠️ SYSTEM REJECTED" : "✅ AUDIO LINK ESTABLISHED"}
            </h3>
            <p style={{ fontStyle: "italic", margin: "0.5rem 0 1.5rem" }}>
              {isFail
                ? '"The Stage Manager says they can\'t hear a thing. Check your cable runs."'
                : '"Signal is crystal clear. The pit is ready."'}
            </p>
            <div style={{ display: "flex", gap: "1rem" }}>
              <Button onClick={() => setSubmitted(false)}>Re-patch Gear</Button>
              {!isFail && (
                <Button variant="accent" onClick={onComplete}>
                  Initialize Rehearsal
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
