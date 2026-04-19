import { useMemo, useState } from "react";
import { useGame } from "../../../context/GameContext";
import { LEVEL_REQUIREMENTS } from "../../../data/constants";
import {
  getStageHelpText,
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
  const [selectedGobo, setSelectedGobo] = useState<string | null>(null);
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
      // Store both type and gobo
      copy[i] =
        copy[i]?.typeId === selectedType && copy[i]?.gobo === selectedGobo
          ? null
          : { typeId: selectedType, gobo: selectedGobo };
      return copy;
    });
  }

  function submit() {
    let score = 0;
    const spots = grid.filter((l) => l?.typeId === "spot").length;
    const washes = grid.filter((l) => l?.typeId === "wash").length;
    const hasRequiredGobo = grid.some(
      (l) => l?.gobo === LEVEL_REQUIREMENTS.requiredGobo,
    );

    // Score based on requirements match instead of just placed count
    if (spots >= LEVEL_REQUIREMENTS.targetSpots) score += 40;
    if (washes >= LEVEL_REQUIREMENTS.targetWashes) score += 30;
    if (hasRequiredGobo) score += 30;

    setReportScore(score);
    setSubmitted(true);
    dispatch({ type: "SET_PLOT_LIGHTS", lights: grid });
    dispatch({ type: "ADD_SCORE", delta: score });
  }

  return (
    <div className="page-container animate-blueprint">
      <SectionHeader
        title="Lighting Plot Drafting"
        subtitle="Review the SM's requirements and draft the rig accordingly."
        helpText={getStageHelpText("planning")}
      />

      {/* SM Comms Request Box */}
      <HardwarePanel
        style={{ marginBottom: "1rem", borderColor: "var(--bui-fg-info)" }}
      >
        <h3
          className="annotation-text"
          style={{
            color: "var(--bui-fg-info)",
            fontFamily: "var(--font-sketch)",
          }}
        >
          📥 INCOMING: SM NOTES
        </h3>
        <p style={{ fontFamily: "var(--font-sketch)" }}>
          "Director wants good coverage. We need at least{" "}
          <strong>{LEVEL_REQUIREMENTS.targetSpots} Spots</strong> and{" "}
          <strong>{LEVEL_REQUIREMENTS.targetWashes} Washes</strong>. Oh, and
          make sure we have a{" "}
          <strong>{LEVEL_REQUIREMENTS.requiredGobo.toUpperCase()}</strong> gobo
          loaded somewhere for the dream sequence."
        </p>
      </HardwarePanel>

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
          {/* Gobo Selection Matrix */}
          <h3
            className="annotation-text"
            style={{ fontSize: "0.8rem", margin: "1rem 0", opacity: 0.8 }}
          >
            Gobo Selection Matrix
          </h3>
          <div style={{ display: "flex", gap: "1rem" }}>
            {["none", "stars", "window"].map((gobo) => (
              <Button
                key={gobo}
                onClick={() => setSelectedGobo(gobo === "none" ? null : gobo)}
                style={{
                  borderColor:
                    selectedGobo === gobo ? "var(--bui-fg-accent)" : "",
                }}
              >
                {gobo.toUpperCase()}
              </Button>
            ))}
          </div>
        </HardwarePanel>
      </div>

      <div style={{ marginTop: "2rem" }}>
        {submitted ? (
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
        ) : (
          <Button
            variant="success"
            onClick={submit}
            className="btn-xl"
            style={{ width: "100%" }}
          >
            Commit Technical Plot
          </Button>
        )}
      </div>
    </div>
  );
}
