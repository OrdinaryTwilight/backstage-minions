import { useEffect, useState } from "react";
import { useGame } from "../../context/GameContext";
import { CHARACTERS, Cue } from "../../data/gameData";
import Button from "../ui/Button";
import CueStack from "../ui/CueStack";
import DepartmentMixer from "../ui/DepartmentMixer";
import HardwarePanel from "../ui/HardwarePanel";
import MasterControl from "../ui/MasterControl";
import SectionHeader from "../ui/SectionHeader";

interface CueExecutionStageProps {
  readonly cueSheet: Cue[];
  readonly onComplete: () => void;
  readonly onFail?: () => void; // NEW: Triggers level failure
}

export default function CueExecutionStage({
  cueSheet,
  onComplete,
  onFail,
}: CueExecutionStageProps) {
  const { state, dispatch } = useGame();
  const [currentIdx, setCurrentIdx] = useState(0);
  const [faderLevels, setFaderLevels] = useState([80, 80, 80, 80, 100]);

  const [elapsedMs, setElapsedMs] = useState(0);
  const [cueResults, setCueResults] = useState<
    Record<string, { hit: boolean }>
  >({});

  // NEW: Ready State and SM Comms
  const [isReady, setIsReady] = useState(false);
  const [smMessage, setSmMessage] = useState(
    "Standby. Lock in your faders and tell me when you are ready.",
  );

  const char = state.session
    ? CHARACTERS.find((c) => c.id === state.session?.characterId)
    : null;
  const currentCue = cueSheet[currentIdx];
  const isLastCue = currentIdx >= cueSheet.length;
  const maxShowTime = (cueSheet[cueSheet.length - 1]?.targetMs || 10000) + 3000;

  const getIndicatorColor = (
    cue: Cue,
    isPast: boolean,
    isCurrent: boolean,
  ): string => {
    if (isPast) {
      return cueResults[cue.id]?.hit
        ? "var(--bui-fg-success)"
        : "var(--bui-fg-danger)";
    }
    if (isCurrent) {
      return "var(--bui-fg-warning)";
    }
    return "#555";
  };

  // Clock only runs if the player has told the SM they are ready
  useEffect(() => {
    if (isLastCue || !isReady) return;
    const startTime = Date.now();
    const interval = setInterval(() => {
      setElapsedMs(Date.now() - startTime);
    }, 50);
    return () => clearInterval(interval);
  }, [isLastCue, isReady]);

  // Auto-fail logic
  useEffect(() => {
    if (!currentCue || isLastCue || !isReady) return;
    const expirationTime =
      currentCue.targetMs + (currentCue.windowMs || 1000) + 100;
    if (elapsedMs > expirationTime) {
      handleGo(true); // Force miss
    }
  }, [elapsedMs, currentCue, isLastCue, isReady]);

  const checkFaderAlignment = () => {
    const target = currentCue?.targetLevel || 80;
    const margin = 10;
    const masterOk = Math.abs(faderLevels[4] - 100) < margin;
    const channelsOk =
      faderLevels.slice(0, 4).filter((l) => Math.abs(l - target) < margin)
        .length >= 2;
    return masterOk && channelsOk;
  };

  function handleGo(forceMiss = false) {
    if (isLastCue || !isReady) return;

    const targetMs = currentCue?.targetMs || 0;
    const windowMs = currentCue?.windowMs || 1000;
    const isTimedWell = Math.abs(elapsedMs - targetMs) <= windowMs;
    const isAligned = checkFaderAlignment();
    const isHit = !forceMiss && isAligned && isTimedWell;

    setCueResults((prev) => ({ ...prev, [currentCue.id]: { hit: isHit } }));

    if (isHit) {
      setSmMessage(`Good cue. Standby next.`);
      dispatch({ type: "CUE_HIT" });
      dispatch({ type: "ADD_SCORE", delta: 10 });

      if (currentIdx === cueSheet.length - 1) {
        setSmMessage("And we are clear. Good show, everyone.");
        setTimeout(onComplete, 1500);
        setCurrentIdx((prev) => prev + 1);
      } else {
        setCurrentIdx((prev) => prev + 1);
      }
    } else {
      // NEW: Failing a cue kicks you out!
      setSmMessage(`WHAT ARE YOU DOING?! You missed the cue! Trainwreck!`);
      dispatch({ type: "CUE_MISSED" });

      // Delay slightly so the player can read the angry SM message before failing
      setTimeout(() => {
        if (onFail) onFail();
      }, 2000);
    }
  }

  const handleReady = () => {
    setIsReady(true);
    setSmMessage(
      "Copy that. House is closed. Lighting and Sound, standby for show... GO!",
    );
  };

  return (
    <div className="page-container animate-blueprint">
      <SectionHeader
        title="Booth Operations"
        subtitle="Coordinate the master clock and maintain fader precision."
        helpText="Watch the Playhead on the timeline. Ensure your faders match the Target Intensity, then hit GO!"
      />

      {/* --- NEW: STICKY SHOW TIMELINE & SM COMMS --- */}
      <div
        style={{
          position: "sticky",
          top: "10px",
          zIndex: 1000,
          marginBottom: "2rem",
          padding: "1rem",
          background: "rgba(15, 23, 42, 0.95)",
          borderRadius: "8px",
          border: "2px solid var(--bui-fg-info)",
          backdropFilter: "blur(10px)",
          boxShadow: "0 10px 20px rgba(0,0,0,0.5)",
        }}
      >
        {/* SM COMMS HUD */}
        <div
          style={{
            display: "flex",
            gap: "10px",
            alignItems: "center",
            marginBottom: "1rem",
            background: "#000",
            padding: "8px",
            borderRadius: "4px",
            border: "1px solid #333",
          }}
        >
          <div
            style={{
              background: "var(--bui-fg-danger)",
              color: "#fff",
              padding: "2px 6px",
              borderRadius: "4px",
              fontSize: "0.8rem",
              fontWeight: "bold",
            }}
          >
            SM COMMS
          </div>
          <div
            style={{
              color: "var(--color-pencil-light)",
              fontFamily: "var(--font-mono)",
              flex: 1,
            }}
          >
            {smMessage}
          </div>
          <div
            style={{
              color: "var(--bui-fg-info)",
              fontWeight: "bold",
              fontFamily: "var(--font-mono)",
            }}
          >
            {(elapsedMs / 1000).toFixed(1)}s
          </div>
        </div>

        {/* PROGRESS BAR */}
        <div
          style={{
            position: "relative",
            width: "100%",
            height: "20px",
            background: "#222",
            borderRadius: "4px",
            overflow: "hidden",
          }}
        >
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
                <div
                  style={{
                    position: "absolute",
                    left: "50%",
                    top: "50%",
                    transform: "translate(-50%, -50%)",
                    width: `${windowWidthPct}vw`,
                    maxWidth: "40px",
                    height: "20px",
                    background: isCurrent
                      ? "rgba(251, 191, 36, 0.2)"
                      : "transparent",
                  }}
                />
                <div
                  style={{
                    width: isCurrent ? "12px" : "8px",
                    height: isCurrent ? "12px" : "8px",
                    borderRadius: "50%",
                    background: getIndicatorColor(cue, isPast, isCurrent),
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

      {/* START SHOW OVERLAY */}
      {!isReady && (
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <Button
            onClick={handleReady}
            style={{
              fontSize: "1.2rem",
              padding: "1rem 2rem",
              background: "var(--bui-fg-success)",
              color: "#000",
            }}
          >
            "I'm Patched and Ready, SM." (Start Show)
          </Button>
        </div>
      )}

      {/* Hardware UI (Disabled until Ready) */}
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
