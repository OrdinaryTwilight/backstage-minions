/**
 * @file Cue Execution Stage (Main Game Minigame)
 * @description The timing-based minigame where players execute technical cues.
 * Core gameplay mechanic: set faders to target levels and press GO exactly when cues arrive.
 * 
 * Stage Mechanics:
 * - **Fader Control**: Adjust channel levels to match target positions
 * - **Timeline**: Visual timeline shows when each cue should fire
 * - **Hit Window**: Player must press GO within tolerance window of target time
 * - **Scoring**: Hits = +10 points, accuracy affects star rating
 * - **Scoring**: Misses = stress penalty, no points
 * - **Real-time**: Shows current elapsed time, fader positions, and cue status
 * 
 * Difficulty Affects:
 * - Cue window size (school=wider, professional=narrower)
 * - Number of simultaneous faders to manage
 * - Cue complexity and speed
 * 
 * Departments: Lighting and Sound both use this stage with different cue sheets.
 * 
 * @component
 */

import { useEffect, useMemo } from "react";
import { useGame } from "../../../context/GameContext";
import { CHARACTERS, getStageHelpText } from "../../../data/gameData";
import { Cue } from "../../../data/types";
import { useAnnouncement } from "../../../hooks/useAnnouncement";
import CueStack from "../../ui/CueStack";
import DepartmentMixer from "../../ui/DepartmentMixer";
import HardwarePanel from "../../ui/HardwarePanel";
import MasterControl from "../../ui/MasterControl";
import SectionHeader from "../../ui/SectionHeader";
import CueTimelineHUD from "./CueTimelineHUD";
import { useCueEngine } from "./useCueEngine";

interface CueExecutionStageProps {
  cueSheet: Cue[];
  onComplete: () => void;
  difficulty?: string;
}

export default function CueExecutionStage({
  cueSheet,
  onComplete,
  difficulty = "school",
}: Readonly<CueExecutionStageProps>) {
  const { state } = useGame();
  const { announce, AnnouncementRegion } = useAnnouncement();

  const char = state.session
    ? CHARACTERS.find((c) => c.id === state.session?.characterId)
    : null;

  const {
    currentIdx,
    faderLevels,
    setFaderLevels,
    elapsedMs,
    cueResults,
    isReady,
    smMessage,
    currentCue,
    currentTargets,
    isCueImminent,
    isLastCue,
    maxShowTime,
    handleGo,
    handleReady,
  } = useCueEngine(cueSheet, onComplete, difficulty);

  // Generates the labels for the specific character's department
  const channelNames = useMemo(
    () =>
      char?.department === "lighting"
        ? ["WASH", "CYC", "SPOT", "KEYS"]
        : ["VOX", "PIT", "SFX", "BAND"],
    [char?.department],
  );

  // UX FIX: Renders a clean 2x2 grid explicitly detailing the channels and their levels
  const targetDisplay = useMemo(() => {
    if (isLastCue) return <span style={{ fontSize: "1.8rem" }}>--</span>;
    if (currentTargets.every((t) => t === 0))
      return <span style={{ fontSize: "1.8rem" }}>0%</span>;
    if (currentTargets.every((t) => t === currentTargets[0]))
      return <span style={{ fontSize: "1.8rem" }}>{currentTargets[0]}%</span>;

    return (
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "6px",
          fontSize: "0.85rem",
          textAlign: "left",
        }}
      >
        {currentTargets.map((t, i) => (
          <div
            key={channelNames[i]}
            style={{
              background: "rgba(0,0,0,0.5)",
              padding: "4px 8px",
              borderRadius: "4px",
              border: "1px solid #444",
            }}
          >
            <span style={{ opacity: 0.7, fontFamily: "var(--font-mono)" }}>
              {channelNames[i]}:
            </span>{" "}
            <strong style={{ color: "#fff" }}>{t}%</strong>
          </div>
        ))}
      </div>
    );
  }, [isLastCue, currentTargets, channelNames]);

  // Audio/Accessibility string for screen readers
  const screenReaderTargetText = useMemo(() => {
    if (currentTargets.every((t) => t === currentTargets[0]))
      return `${currentTargets[0]} percent`;
    return "Mixed levels. Check console.";
  }, [currentTargets]);

  useEffect(() => {
    if (isLastCue) {
      announce("Show complete. All stop.");
    } else if (currentCue) {
      announce(
        `Standby ${currentCue.id}. Target intensity ${screenReaderTargetText}.`,
      );
    }
  }, [currentCue, isLastCue, screenReaderTargetText, announce]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.code === "Space" && isReady && !isLastCue) {
        e.preventDefault();
        handleGo(false);
      }
    };
    globalThis.addEventListener("keydown", handler);
    return () => globalThis.removeEventListener("keydown", handler);
  }, [handleGo, isReady, isLastCue]);

  return (
    <div
      className="page-container animate-blueprint"
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        fontFamily: "var(--font-sketch)",
      }}
    >
      <AnnouncementRegion />

      <SectionHeader
        title="Booth Operations"
        subtitle="It's show time! Balance your channel faders and use the Master fader to scale your output!"
        helpText={getStageHelpText("cue_execution")}
      />

      <div
        style={{
          position: "sticky",
          top: 0,
          zIndex: 50,
          background: "var(--color-blueprint-bg)",
        }}
      >
        <CueTimelineHUD
          smMessage={smMessage}
          elapsedMs={elapsedMs}
          maxShowTime={maxShowTime}
          cueSheet={cueSheet}
          currentIdx={currentIdx}
          cueResults={cueResults}
          isReady={isReady}
          handleReady={handleReady}
        />
      </div>

      <div
        className="desktop-two-column"
        style={{
          opacity: isReady ? 1 : 0.5,
          pointerEvents: isReady ? "auto" : "none",
        }}
      >
        <div className="desktop-col-main">
          <HardwarePanel
            className="grandma-panel"
            style={{ marginBottom: "1.5rem" }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div>
                <h2 className="annotation-text" style={{ fontSize: "1.4rem" }}>
                  {isLastCue ? "SHOW COMPLETE" : `Next Cue: ${currentCue?.id}`}
                </h2>
                <div
                  className="console-screen"
                  style={{
                    marginTop: "0.8rem",
                    background: "transparent",
                    padding: 0,
                  }}
                >
                  CMD:{" "}
                  {isLastCue
                    ? "ALL STOP"
                    : currentCue?.label?.toUpperCase() || "STANDBY"}
                </div>
              </div>
              <div
                style={{
                  textAlign: "right",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-end",
                }}
              >
                <span
                  className="annotation-text"
                  style={{
                    fontSize: "0.7rem",
                    opacity: 0.5,
                    marginBottom: "0.5rem",
                  }}
                >
                  TARGET INTENSITY
                </span>
                <div style={{ color: "var(--bui-fg-warning)" }}>
                  {targetDisplay}
                </div>
              </div>
            </div>
          </HardwarePanel>
          <CueStack
            cues={cueSheet}
            currentIndex={currentIdx}
            cueResults={cueResults}
          />
        </div>
        <div className="desktop-col-side">
          <div className="animate-pop">
            <DepartmentMixer
              department={char?.department}
              levels={faderLevels}
              setLevels={setFaderLevels}
              targetLevels={currentTargets}
              showTargetHint={isCueImminent} // Passes the fade-in trigger!
            />
            <div style={{ marginTop: "2rem" }}>
              <MasterControl
                onGo={() => handleGo(false)}
                disabled={isLastCue || !isReady}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
