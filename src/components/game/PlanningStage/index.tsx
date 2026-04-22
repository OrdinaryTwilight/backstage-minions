import { useState } from "react";
import { useGame } from "../../../context/GameContext";
import {
  getStageHelpText,
  LIGHT_TYPES,
  PLOT_GRID_COLS,
  PLOT_GRID_ROWS,
} from "../../../data/gameData";
import type { LightPlotNode } from "../../../types/game";
import Button from "../../ui/Button";
import HardwarePanel from "../../ui/HardwarePanel";
import SectionHeader from "../../ui/SectionHeader";
import OpticalSimView from "./OpticalSimView";
import PlotPlanView from "./PlotPlanView";

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

  const [activeTool, setActiveTool] = useState<"fixture" | "gobo">("fixture");
  const [selectedType, setSelectedType] = useState(LIGHT_TYPES[0].id);
  const [selectedGobo, setSelectedGobo] = useState<string | null>(null);
  const [grid, setGrid] = useState<GridCell[]>(() =>
    new Array(PLOT_GRID_ROWS * PLOT_GRID_COLS).fill(null),
  );

  const [showGoboHelp, setShowGoboHelp] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [reportDetails, setReportDetails] = useState<ReportDetails | null>(
    null,
  );

  const difficulty = state.session?.difficulty || "school";

  const [requirements] = useState(() => {
    const getRandomInt = (min: number, max: number) =>
      Math.floor(Math.random() * (max - min + 1)) + min;

    const availableGobos = ["stars", "window", "leaves", "fire"];
    const randomGobo =
      availableGobos[Math.floor(Math.random() * availableGobos.length)];

    let spots, washes, bonusFixtures;

    switch (difficulty) {
      case "professional":
        spots = getRandomInt(5, 7);
        washes = getRandomInt(3, 5);
        bonusFixtures = 3;
        break;
      case "community":
        spots = getRandomInt(3, 5);
        washes = getRandomInt(2, 4);
        bonusFixtures = 3;
        break;
      case "school":
      default:
        spots = getRandomInt(2, 3);
        washes = getRandomInt(1, 2);
        bonusFixtures = 2;
        break;
    }

    return {
      targetSpots: spots,
      targetWashes: washes,
      requiredGobo: randomGobo,
      maxFixtures: spots + washes + bonusFixtures,
    };
  });

  function handleGridInteract(i: number) {
    if (submitted) return;

    setGrid((prevGrid) => {
      const newGrid = [...prevGrid];
      const currentCell = newGrid[i];

      if (activeTool === "fixture") {
        newGrid[i] =
          currentCell?.typeId === selectedType
            ? null
            : {
                typeId: selectedType,
                gobo:
                  selectedType === "spot" ? currentCell?.gobo || null : null,
              };
      } else if (activeTool === "gobo") {
        if (currentCell) {
          if (currentCell.typeId !== "spot" && selectedGobo !== null) {
            return prevGrid;
          }
          newGrid[i] = { ...currentCell, gobo: selectedGobo };
        } else {
          setActiveTool("fixture");
        }
      }

      return newGrid;
    });
  }

  function submit() {
    let score = 0;

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

    if (placedLights.length === 0) score = 0;

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
    dispatch({
      type: "SET_PLOT_LIGHTS",
      lights: grid
        .map((cell, idx) =>
          cell
            ? {
                id: `light_${idx}`,
                type: cell.typeId,
                gridX: idx % PLOT_GRID_COLS,
                gridY: Math.floor(idx / PLOT_GRID_COLS),
                intensity: 100,
                color: undefined,
                gobo: cell.gobo || undefined,
              }
            : null,
        )
        .filter(Boolean) as LightPlotNode[],
    });
    dispatch({ type: "ADD_SCORE", delta: reportDetails?.score || 0 });
    onComplete();
  };

  const renderFeedbackPanel = () => {
    if (!reportDetails) return null;

    const isFailLocal = reportDetails.score < 50;
    let feedbackHeader = "";
    let feedbackText = "";

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
          <strong>{requirements.targetSpots}</strong> Spots and{" "}
          <strong>{requirements.targetWashes}</strong> Washes. Make sure we have
          a <strong>{requirements.requiredGobo.toUpperCase()}</strong> gobo
          loaded for the dream sequence. Also, our dimmer racks are maxed out:
          Do not exceed <strong>{requirements.maxFixtures}</strong> total
          fixtures."
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
        <PlotPlanView grid={grid} placeLight={handleGridInteract} />
        <OpticalSimView grid={grid} />
      </div>

      <div className="animate-pop">
        <HardwarePanel style={{ borderTop: "2px solid var(--glass-border)" }}>
          <div style={{ display: "flex", gap: "2rem", flexWrap: "wrap" }}>
            <div style={{ flex: 1, minWidth: "250px" }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  marginBottom: "1rem",
                }}
              >
                <input
                  type="radio"
                  id="tool-fixture"
                  name="active-tool"
                  checked={activeTool === "fixture"}
                  onChange={() => setActiveTool("fixture")}
                  style={{ accentColor: "var(--bui-fg-accent)" }}
                />
                <label
                  htmlFor="tool-fixture"
                  className="annotation-text"
                  style={{
                    fontSize: "0.9rem",
                    textTransform: "uppercase",
                    color:
                      activeTool === "fixture"
                        ? "var(--bui-fg-accent)"
                        : "inherit",
                    opacity: activeTool === "fixture" ? 1 : 0.6,
                    cursor: "pointer",
                  }}
                >
                  Step 1: Rigging Matrix
                </label>
              </div>

              <fieldset
                style={{
                  display: "flex",
                  gap: "1rem",
                  flexWrap: "wrap",
                  opacity: activeTool === "fixture" ? 1 : 0.4,
                  pointerEvents: activeTool === "fixture" ? "auto" : "none",
                  border: "none",
                  padding: "0",
                  margin: "0",
                }}
              >
                <legend
                  id="tool-fixture"
                  style={{ position: "absolute", left: "-10000px" }}
                >
                  Fixture Selection
                </legend>
                {LIGHT_TYPES.map((l) => {
                  const isActive = selectedType === l.id;
                  return (
                    <Button
                      key={l.id}
                      type="button"
                      aria-pressed={isActive}
                      onClick={() => setSelectedType(l.id)}
                      style={{
                        flex: 1,
                        borderColor: isActive ? l.color : "",
                        background: isActive ? `${l.color}11` : "",
                        position: "relative",
                      }}
                    >
                      {l.icon} {l.label}
                      {isActive && (
                        <span
                          aria-hidden="true"
                          style={{
                            position: "absolute",
                            top: "4px",
                            right: "8px",
                            fontSize: "0.8rem",
                          }}
                        >
                          ✓
                        </span>
                      )}
                    </Button>
                  );
                })}
              </fieldset>
            </div>

            <div
              style={{
                width: "1px",
                background: "var(--glass-border)",
                alignSelf: "stretch",
              }}
            />

            <div style={{ flex: 1, minWidth: "250px" }}>
              {/* UX FIX: Tooltip shares flex row with Header but sits on the right */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: "1rem",
                  position: "relative",
                  zIndex: 50,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                  }}
                >
                  <input
                    type="radio"
                    id="tool-gobo"
                    name="active-tool"
                    checked={activeTool === "gobo"}
                    onChange={() => setActiveTool("gobo")}
                    style={{ accentColor: "var(--bui-fg-accent)" }}
                  />
                  <label
                    htmlFor="tool-gobo"
                    className="annotation-text"
                    style={{
                      fontSize: "0.9rem",
                      textTransform: "uppercase",
                      color:
                        activeTool === "gobo"
                          ? "var(--bui-fg-accent)"
                          : "inherit",
                      opacity: activeTool === "gobo" ? 1 : 0.6,
                      cursor: "pointer",
                    }}
                  >
                    Step 2: Gobo Insert
                  </label>
                </div>

                <div
                  style={{
                    fontSize: "0.75rem",
                    fontStyle: "italic",
                    opacity: 0.9,
                  }}
                >
                  <button
                    type="button"
                    onMouseEnter={() => setShowGoboHelp(true)}
                    onMouseLeave={() => setShowGoboHelp(false)}
                    onFocus={() => setShowGoboHelp(true)}
                    onBlur={() => setShowGoboHelp(false)}
                    aria-describedby="gobo-tooltip"
                    aria-expanded={showGoboHelp}
                    style={{
                      cursor: "help",
                      border: "none",
                      background: "none",
                      padding: 0,
                      font: "inherit",
                      borderBottom: "1px dotted var(--color-pencil-light)",
                    }}
                  >
                    What is a Gobo? 💡
                  </button>

                  {showGoboHelp && (
                    <div
                      id="gobo-tooltip"
                      role="tooltip"
                      className="tooltip-overlay"
                      style={{
                        opacity: 1,
                        pointerEvents: "auto",
                        top: "100%",
                        right: "0",
                        left: "auto",
                        marginTop: "8px",
                      }}
                    >
                      <strong>GOBO (Go-Between Optics)</strong>
                      <br />A metal stencil placed inside a Spotlight fixture to
                      project patterns (like windows, leaves, or stars) onto the
                      stage.
                    </div>
                  )}
                </div>
              </div>

              <fieldset
                style={{
                  display: "flex",
                  gap: "0.5rem",
                  flexWrap: "wrap",
                  opacity: activeTool === "gobo" ? 1 : 0.4,
                  pointerEvents: activeTool === "gobo" ? "auto" : "none",
                  border: "none",
                  padding: "0",
                  margin: "0",
                }}
              >
                <legend
                  id="tool-gobo"
                  style={{ position: "absolute", left: "-10000px" }}
                >
                  Gobo Selection
                </legend>
                {["none", "stars", "window", "leaves", "fire"].map((gobo) => {
                  const isActive =
                    selectedGobo === (gobo === "none" ? null : gobo);
                  return (
                    <Button
                      key={gobo}
                      type="button"
                      aria-pressed={isActive}
                      onClick={() =>
                        setSelectedGobo(gobo === "none" ? null : gobo)
                      }
                      style={{
                        flex: 1,
                        padding: "0.5rem",
                        borderColor: isActive ? "var(--bui-fg-accent)" : "",
                        position: "relative",
                      }}
                    >
                      {gobo.toUpperCase()}
                      {isActive && (
                        <span
                          aria-hidden="true"
                          style={{
                            position: "absolute",
                            top: "2px",
                            right: "4px",
                            fontSize: "0.6rem",
                            color: "var(--bui-fg-accent)",
                          }}
                        >
                          ✓
                        </span>
                      )}
                    </Button>
                  );
                })}
              </fieldset>
            </div>
          </div>
        </HardwarePanel>
      </div>

      <div style={{ marginTop: "2rem" }}>
        {submitted ? (
          renderFeedbackPanel()
        ) : (
          <Button
            type="button"
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
