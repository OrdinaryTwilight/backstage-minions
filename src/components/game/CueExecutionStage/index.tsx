import { useEffect } from "react";
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
    isLastCue,
    maxShowTime,
    handleGo,
    handleReady,
  } = useCueEngine(cueSheet, onComplete, difficulty);

  useEffect(() => {
    if (isLastCue) {
      announce("Show complete. All stop.");
    } else if (currentCue) {
      announce(
        `Standby ${currentCue.id}. Target intensity ${currentCue.targetLevel || 80} percent.`,
      );
    }
  }, [currentCue, isLastCue, announce]);

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

      {/* =========================
          HEADER
      ========================== */}
      <SectionHeader
        title="Booth Operations"
        subtitle="It's show time! Execute cues accurately to keep the production running smoothly."
        helpText={getStageHelpText("execution" as any)}
      />

      {/* =========================
          STICKY HUD
      ========================== */}
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

      {/* =========================
          MAIN CONTENT
      ========================== */}
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
              <div style={{ textAlign: "right" }}>
                <span
                  className="annotation-text"
                  style={{ fontSize: "0.7rem", opacity: 0.5 }}
                >
                  TARGET INTENSITY
                </span>
                <div
                  style={{ fontSize: "1.8rem", color: "var(--bui-fg-warning)" }}
                >
                  {isLastCue ? "--" : `${currentCue?.targetLevel || 80}%`}
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
              targetLevel={currentCue?.targetLevel || 80}
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
