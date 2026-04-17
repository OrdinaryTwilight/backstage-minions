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
      <SectionHeader
        title="Optical Drafting"
        subtitle="Rig the house and simulate beam dispersion."
        helpText="Use the grid to place fixtures. The top-down plot shows the spatial rig, while the live simulation shows floor coverage."
      />

      {/* Grid Layout: Main console + Side Diagnostics */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 320px",
          gap: "2rem",
        }}
      >
        {/* LEFT COLUMN: Drafting Boards */}
        <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
          {/* 1. The Interaction Grid */}
          <HardwarePanel style={{ borderLeft: "4px solid var(--bui-fg-info)" }}>
            <h3
              className="annotation-text"
              style={{ fontSize: "0.9rem", marginBottom: "1rem" }}
            >
              [ INPUT_GRID_V2 ]
            </h3>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: `repeat(${PLOT_GRID_COLS}, 1fr)`,
                gap: "10px",
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

          {/* 2. NEW: Top-Down Technical Plot */}
          <HardwarePanel
            style={{
              height: "300px",
              background: "rgba(0,0,0,0.3)",
              position: "relative",
              overflow: "hidden",
            }}
          >
            <h3
              className="annotation-text"
              style={{ fontSize: "0.8rem", opacity: 0.5 }}
            >
              PLAN VIEW: RIGGING SCHEMATIC
            </h3>

            <div
              style={{
                position: "relative",
                width: "100%",
                height: "100%",
                padding: "20px",
              }}
            >
              {/* Proscenium Arch & Stage Lines */}
              <div
                style={{
                  position: "absolute",
                  top: "10%",
                  left: "10%",
                  right: "10%",
                  bottom: "10%",
                  border: "1px dashed var(--glass-border)",
                  opacity: 0.4,
                }}
              />
              <div
                style={{
                  position: "absolute",
                  top: "10%",
                  left: "50%",
                  height: "80%",
                  width: "1px",
                  background: "var(--color-architect-blue)",
                  opacity: 0.2,
                }}
              />{" "}
              {/* CL (Center Line) */}
              {/* Plot Markers */}
              {grid.map((cell, i) => {
                if (!cell) return null;
                const lt = LIGHT_TYPES.find((t) => t.id === cell.typeId);
                const col = i % PLOT_GRID_COLS;
                const row = Math.floor(i / PLOT_GRID_COLS);

                return (
                  <div
                    key={`plot-${i}`}
                    style={{
                      position: "absolute",
                      left: `${(col / (PLOT_GRID_COLS - 1)) * 80 + 10}%`,
                      top: `${(row / (PLOT_GRID_ROWS - 1)) * 60 + 15}%`,
                      transform: "translate(-50%, -50%)",
                      textAlign: "center",
                      zIndex: 10,
                    }}
                  >
                    <div
                      style={{
                        fontSize: "1.2rem",
                        filter: `drop-shadow(0 0 5px ${lt.color})`,
                      }}
                    >
                      {lt.icon}
                    </div>
                    <div
                      style={{
                        fontSize: "0.5rem",
                        color: lt.color,
                        textTransform: "uppercase",
                        whiteSpace: "nowrap",
                      }}
                    >
                      LX_{i + 1}
                    </div>
                  </div>
                );
              })}
              {/* Stage Edge (DS) */}
              <div
                style={{
                  position: "absolute",
                  bottom: "10%",
                  left: "5%",
                  right: "5%",
                  height: "4px",
                  background: "#333",
                  borderRadius: "4px",
                }}
              />
            </div>
          </HardwarePanel>
        </div>

        {/* RIGHT COLUMN: Live Diagnostics */}
        <div className="desktop-col-side">
          <HardwarePanel
            style={{
              height: "100%",
              background: "#050505",
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
                    }}
                  />
                );
              })}
              {/* Floor Pools */}
              <div
                style={{
                  position: "absolute",
                  bottom: 0,
                  width: "100%",
                  height: "20%",
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
                      }}
                    />
                  );
                })}
              </div>
            </div>
          </HardwarePanel>
        </div>
      </div>

      <div style={{ marginTop: "2rem" }}>
        {!submitted ? (
          <Button
            variant="success"
            className="btn-xl"
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
