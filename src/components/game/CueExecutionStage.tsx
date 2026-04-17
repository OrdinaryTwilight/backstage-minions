import { useEffect, useState } from "react";
import { useGame } from "../../context/GameContext";
import { CHARACTERS, Cue } from "../../data/gameData";
import CueStack from "../ui/CueStack";
import DepartmentMixer from "../ui/DepartmentMixer";
import HardwarePanel from "../ui/HardwarePanel";
import MasterControl from "../ui/MasterControl";
import SectionHeader from "../ui/SectionHeader";

interface CueExecutionStageProps {
  cueSheet: Cue[];
  onComplete: () => void;
}

export default function CueExecutionStage({
  cueSheet,
  onComplete,
}: CueExecutionStageProps) {
  const { state, dispatch } = useGame();
  const [currentIdx, setCurrentIdx] = useState(0);
  const [faderLevels, setFaderLevels] = useState([80, 80, 80, 80, 100]);

  const [elapsedMs, setElapsedMs] = useState(0);
  const [cueResults, setCueResults] = useState<
    Record<string, { hit: boolean }>
  >({});

  const char = state.session
    ? CHARACTERS.find((c) => c.id === state.session?.characterId)
    : null;
  const currentCue = cueSheet[currentIdx];
  const isLastCue = currentIdx >= cueSheet.length;

  const maxShowTime = (cueSheet[cueSheet.length - 1]?.targetMs || 10000) + 3000; // Adds 3 seconds of buffer after last cue

  useEffect(() => {
    if (isLastCue) return;
    const startTime = Date.now();
    const interval = setInterval(() => {
      setElapsedMs(Date.now() - startTime);
    }, 50);
    return () => clearInterval(interval);
  }, [isLastCue]);

  // AUTO-FAIL LOGIC: If elapsed time completely passes the target window, automatically miss the cue
  useEffect(() => {
    if (!currentCue || isLastCue) return;
    const expirationTime =
      currentCue.targetMs + (currentCue.windowMs || 1000) + 100;

    if (elapsedMs > expirationTime) {
      handleGo(true); // Force miss
    }
  }, [elapsedMs, currentCue, isLastCue]);

  const checkFaderAlignment = () => {
    const target = currentCue?.targetLevel || 80;
    const margin = 10;
    const masterOk = Math.abs(faderLevels[4] - 100) < margin;
    const channelsOk =
      faderLevels.slice(0, 4).filter((l) => Math.abs(l - target) < margin)
        .length >= 2;
    return masterOk && channelsOk;
  };

  // Added forceMiss parameter for the auto-fail mechanic
  function handleGo(forceMiss = false) {
    if (isLastCue) return;

    const targetMs = currentCue?.targetMs || 0;
    const windowMs = currentCue?.windowMs || 1000;

    const isTimedWell = Math.abs(elapsedMs - targetMs) <= windowMs;
    const isAligned = checkFaderAlignment();

    const isHit = !forceMiss && isAligned && isTimedWell;

    // Track result for the UI
    setCueResults((prev) => ({ ...prev, [currentCue.id]: { hit: isHit } }));

    if (isHit) {
      dispatch({ type: "CUE_HIT" });
      dispatch({ type: "ADD_SCORE", delta: 10 });
    } else {
      dispatch({ type: "CUE_MISSED" });
    }

    if (currentIdx === cueSheet.length - 1) {
      setTimeout(onComplete, 1000); // Wait 1 second after final cue before advancing
      setCurrentIdx((prev) => prev + 1);
    } else {
      setCurrentIdx((prev) => prev + 1);
    }
  }

  return (
    <div className="page-container animate-blueprint">
      <SectionHeader
        title="Booth Operations"
        subtitle="Coordinate the master clock and maintain fader precision."
        helpText="Watch the Playhead on the timeline. Ensure your faders match the Target Intensity, then hit GO!"
      />

      {/* --- NEW: SHOW TIMELINE TRACKER --- */}
      <div
        style={{
          marginBottom: "2rem",
          padding: "1rem",
          background: "var(--color-surface-translucent)",
          borderRadius: "8px",
          border: "1px solid var(--glass-border)",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "0.5rem",
          }}
        >
          <span className="annotation-text">Show Progress</span>
          <span style={{ color: "var(--bui-fg-info)", fontWeight: "bold" }}>
            {(elapsedMs / 1000).toFixed(1)}s
          </span>
        </div>

        <div
          style={{
            position: "relative",
            width: "100%",
            height: "40px",
            background: "#222",
            borderRadius: "4px",
            overflow: "hidden",
          }}
        >
          {/* Active Playhead */}
          <div
            style={{
              position: "absolute",
              left: `${(elapsedMs / maxShowTime) * 100}%`,
              top: 0,
              bottom: 0,
              width: "3px",
              background: "var(--bui-fg-info)",
              zIndex: 10,
              boxShadow: "0 0 10px var(--bui-fg-info)",
            }}
          />

          {/* Cue Indicators */}
          {cueSheet.map((cue, i) => {
            const isPast = i < currentIdx;
            const isCurrent = i === currentIdx;
            const leftPct = (cue.targetMs / maxShowTime) * 100;
            const windowWidthPct = ((cue.windowMs || 1000) / maxShowTime) * 100;

            return (
              <div
                key={cue.id}
                style={{
                  position: "absolute",
                  left: `${leftPct}%`,
                  top: "50%",
                  transform: "translate(-50%, -50%)",
                  zIndex: 5,
                }}
              >
                {/* Visual Tolerance Window */}
                <div
                  style={{
                    position: "absolute",
                    left: "50%",
                    top: "50%",
                    transform: "translate(-50%, -50%)",
                    width: `${windowWidthPct}vw`,
                    maxWidth: "40px",
                    height: "40px",
                    background: isCurrent
                      ? "rgba(251, 191, 36, 0.2)"
                      : "transparent",
                  }}
                />

                {/* The Cue Dot */}
                <div
                  style={{
                    width: isCurrent ? "14px" : "10px",
                    height: isCurrent ? "14px" : "10px",
                    borderRadius: "50%",
                    background: isPast
                      ? cueResults[cue.id]?.hit
                        ? "var(--bui-fg-success)"
                        : "var(--bui-fg-danger)"
                      : isCurrent
                        ? "var(--bui-fg-warning)"
                        : "#555",
                    border: isCurrent ? "2px solid #fff" : "none",
                    boxShadow: isCurrent
                      ? "0 0 10px var(--bui-fg-warning)"
                      : "none",
                  }}
                />
              </div>
            );
          })}
        </div>
      </div>

      <div className="desktop-two-column" role="main">
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
            />
            <div style={{ marginTop: "2rem" }}>
              <MasterControl
                onGo={() => handleGo(false)}
                disabled={isLastCue}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
