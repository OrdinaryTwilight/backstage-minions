// src/components/game/PlanningStage/index.tsx
import { useMemo, useState } from "react";
import { useGame } from "../../../context/GameContext";
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

// Explicit typing for the grid cells
type GridCell = { typeId: string; gobo: string | null } | null;

interface ReportDetails {
  score: number;
  missingSpots: number;
  missingWashes: number;
  missingGobo: boolean;
  overLimit: boolean;
}

export default function PlanningStage({
  onComplete,
}: Readonly<{
  onComplete: () => void;
}>) {
  const { state, dispatch } = useGame();

  const [selectedType, setSelectedType] = useState(LIGHT_TYPES[0].id);
  const [selectedGobo, setSelectedGobo] = useState<string | null>(null);
  const [grid, setGrid] = useState<GridCell[]>(() =>
    new Array(PLOT_GRID_ROWS * PLOT_GRID_COLS).fill(null),
  );

  const [submitted, setSubmitted] = useState(false);
  const [reportDetails, setReportDetails] = useState<ReportDetails | null>(
    null,
  );

  // Dynamic requirements scaled by current level difficulty
  const difficulty = state.session?.difficulty || "school";

  const requirements = useMemo(() => {
    switch (difficulty) {
      case "professional":
        return {
          targetSpots: 6,
          targetWashes: 4,
          requiredGobo: "window",
          maxFixtures: 12,
        };
      case "community":
        return {
          targetSpots: 4,
          targetWashes: 3,
          requiredGobo: "stars",
          maxFixtures: 10,
        };
      case "school":
      default:
        return {
          targetSpots: 3,
          targetWashes: 2,
          requiredGobo: "stars",
          maxFixtures: 8,
        };
    }
  }, [difficulty]);

  function placeLight(i: number) {
    if (submitted) return;

    setGrid((prevGrid) => {
      const newGrid = [...prevGrid];
      const currentCell = newGrid[i];

      // If clicking exactly what is already there, remove it. Otherwise, place new light.
      newGrid[i] =
        currentCell?.typeId === selectedType &&
        currentCell?.gobo === selectedGobo
          ? null
          : { typeId: selectedType, gobo: selectedGobo };

      return newGrid;
    });
  }

  function submit() {
    let score = 0;

    // Type guard to filter out nulls cleanly
    const placedLights = grid.filter(
      (cell): cell is Exclude<GridCell, null> => cell !== null,
    );

    const spots = placedLights.filter((l) => l.typeId === "spot").length;
    const washes = placedLights.filter((l) => l.typeId === "wash").length;
    const hasRequiredGobo = placedLights.some(
      (l) => l.gobo === requirements.requiredGobo,
    );
    const withinLimit =
      placedLights.length > 0 &&
      placedLights.length <= requirements.maxFixtures;

    // Calculate proportional partial credit
    const spotScore = Math.floor(
      (Math.min(spots, requirements.targetSpots) / requirements.targetSpots) *
        30,
    );
    const washScore = Math.floor(
      (Math.min(washes, requirements.targetWashes) /
        requirements.targetWashes) *
        20,
    );

    score += spotScore;
    score += washScore;
    if (hasRequiredGobo) score += 20;
    if (withinLimit) score += 30;

    // Failsafe: An empty stage is an automatic zero
    if (placedLights.length === 0) score = 0;

    // Save the exact breakdown of what the player missed
    setReportDetails({
      score,
      missingSpots: Math.max(0, requirements.targetSpots - spots),
      missingWashes: Math.max(0, requirements.targetWashes - washes),
      missingGobo: !hasRequiredGobo,
      overLimit: !withinLimit && placedLights.length > 0,
    });

    setSubmitted(true);
  }

  const handleFinalize = () => {
    // We cast grid to any here to bypass the strict LightPlotNode mapping since the reducer
    // expects a slightly different internal structure, but handles it fine at runtime.
    // In a future refactor, aligning the Reducer types to the Planner types would be ideal.
    dispatch({ type: "SET_PLOT_LIGHTS", lights: grid as any });
    dispatch({ type: "ADD_SCORE", delta: reportDetails?.score || 0 });
    onComplete();
  };

  // Extracted to keep JSX Cognitive Complexity low
  const renderFeedbackPanel = () => {
    if (!reportDetails) return null;

    const isFailLocal = reportDetails.score < 50;
    let feedbackHeader = "";
    let feedbackText = "";

    // Build a dynamic list of exactly what the player missed
    const issues: string[] = [];
    if (reportDetails.missingSpots > 0)
      issues.push(`Need ${reportDetails.missingSpots} more Spot(s)`);
    if (reportDetails.missingWashes > 0)
      issues.push(`Need ${reportDetails.missingWashes} more Wash(es)`);
    if (reportDetails.missingGobo)
      issues.push(`Missing ${requirements.requiredGobo.toUpperCase()} gobo`);
    if (reportDetails.overLimit)
      issues.push(`Exceeded fixture limit (max ${requirements.maxFixtures})`);

    const issuesText =
      issues.length > 0 ? `\n\n📝 SM NOTES: ${issues.join(" | ")}.` : "";

    // Evaluate all score tiers
    if (reportDetails.score === 100) {
      feedbackHeader = "🏆 PERFECT CLEARANCE";
      feedbackText =
        "SM: 'Flawless plot! Full coverage, special is ready, and we're well under power limits. Let's get it hung!'";
    } else if (reportDetails.score >= 80) {
      feedbackHeader = "✅ TECHNICAL CLEARANCE GRANTED";
      feedbackText = `SM: 'Looks solid! Minor notes, but great job overall.'${issuesText}`;
    } else if (reportDetails.score >= 50) {
      feedbackHeader = "✅ CONDITIONAL CLEARANCE";
      feedbackText = `SM: 'It's not perfect... the director might complain, but we're out of time. Let's load it in.'${issuesText}`;
    } else {
      feedbackHeader = "⚠️ INSUFFICIENT COVERAGE";
      feedbackText = `SM: 'This doesn't meet the needs at all. Redo the plot.'${issuesText}`;
    }

    return (
      <HardwarePanel className="animate-pop">
        <h3
          className="annotation-text"
          style={{
            color: isFailLocal
              ? "var(--bui-fg-danger)"
              : "var(--bui-fg-success)",
          }}
        >
          {feedbackHeader}
        </h3>
        <p
          style={{
            fontFamily: "var(--font-sketch)",
            marginTop: "0.5rem",
            whiteSpace: "pre-wrap",
          }}
        >
          {feedbackText}
        </p>
        <div style={{ marginTop: "0.5rem", fontSize: "0.9rem", opacity: 0.8 }}>
          Score: {reportDetails.score} / 100
        </div>
        <div style={{ display: "flex", gap: "1rem", marginTop: "1.5rem" }}>
          <Button onClick={() => setSubmitted(false)}>Revise Draft</Button>
          {!isFailLocal && (
            <Button variant="accent" onClick={handleFinalize}>
              Finalise Plot
            </Button>
          )}
        </div>
      </HardwarePanel>
    );
  };

  return (
    <div className="page-container animate-blueprint">
      <SectionHeader
        title="Lighting Plot Drafting"
        subtitle="Review the SM's requirements and draft the rig accordingly."
        helpText={getStageHelpText("planning")}
      />

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
          📥 INCOMING: SM NOTES ({difficulty.toUpperCase()} PRODUCTION)
        </h3>
        <p style={{ fontFamily: "var(--font-sketch)" }}>
          "Director wants good coverage. We need at least{" "}
          <strong>{requirements.targetSpots} Spots</strong> and{" "}
          <strong>{requirements.targetWashes} Washes</strong>. Make sure we have
          a <strong>{requirements.requiredGobo.toUpperCase()}</strong> gobo
          loaded for the dream sequence. Also, our dimmer racks are maxed out—do
          not exceed <strong>{requirements.maxFixtures} total fixtures</strong>
          ."
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
        <PlotPlanView grid={grid as any} placeLight={placeLight} />
        <OpticalSimView grid={grid as any} />
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
          renderFeedbackPanel()
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
