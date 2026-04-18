import { useMemo, useState } from "react";
import { useGame } from "../../../context/GameContext";
import { SCORING } from "../../../data/constants";
import {
  LIGHT_TYPES,
  PLOT_GRID_COLS,
  PLOT_GRID_ROWS,
} from "../../../data/gameData";
import Button from "../../ui/Button";
import HardwarePanel from "../../ui/HardwarePanel";
import SectionHeader from "../../ui/SectionHeader";
import OpticalSimView from "./OpticalSimView";
import PlotPlanView from "./PlotPlanView";

export default function PlanningStage({
  onComplete,
}: Readonly<{
  onComplete: () => void;
}>) {
  const { dispatch } = useGame();
  const [selectedType, setSelectedType] = useState(LIGHT_TYPES[0].id);
  const [grid, setGrid] = useState(() =>
    new Array(PLOT_GRID_ROWS * PLOT_GRID_COLS).fill(null),
  );
  const [submitted, setSubmitted] = useState(false);
  const [reportScore, setReportScore] = useState<number | null>(null);

  const { placedCount, isFail } = useMemo(
    () => ({
      placedCount: grid.filter(Boolean).length,
      isFail: reportScore !== null && reportScore < 40,
    }),
    [grid, reportScore],
  );

  function placeLight(i: number) {
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
        title="Lighting Plot Drafting"
        subtitle="Map the rig and verify coverage symmetry."
        helpText="Toggle fixtures on the technical plot (left) to see real-time beam simulation (right)."
      />

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
          gap: "2rem",
          marginBottom: "2rem",
        }}
      >
        <PlotPlanView grid={grid} placeLight={placeLight} />
        <OpticalSimView grid={grid} />
      </div>

      <div className="animate-pop">
        <HardwarePanel style={{ borderTop: "2px solid var(--glass-border)" }}>
          <h3
            className="annotation-text"
            style={{
              fontSize: "0.8rem",
              marginBottom: "1rem",
              textTransform: "uppercase",
              opacity: 0.8,
            }}
          >
            Fixture Selection Matrix
          </h3>
          <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
            {LIGHT_TYPES.map((l) => (
              <Button
                key={l.id}
                onClick={() => setSelectedType(l.id)}
                style={{
                  flex: 1,
                  minWidth: "150px",
                  borderColor: selectedType === l.id ? l.color : "",
                  background: selectedType === l.id ? `${l.color}11` : "",
                }}
              >
                {l.icon} {l.label}
              </Button>
            ))}
          </div>
        </HardwarePanel>
      </div>

      <div style={{ marginTop: "2rem" }}>
        {!submitted ? (
          <Button
            variant="success"
            onClick={submit}
            className="btn-xl"
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
            <div style={{ marginTop: "0.5rem", fontSize: "0.9rem" }}>
              Score: {reportScore} / {Math.max(placedCount * 5, 100)}
            </div>
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
