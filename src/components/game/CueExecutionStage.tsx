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
  readonly onFail?: () => void;
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

  useEffect(() => {
    if (isLastCue || !isReady) return;
    const startTime = Date.now();
    const interval = setInterval(() => {
      setElapsedMs(Date.now() - startTime);
    }, 50);
    return () => clearInterval(interval);
  }, [isLastCue, isReady]);

  // Auto-fail logic if the playhead passes the cue entirely
  useEffect(() => {
    if (!currentCue || isLastCue || !isReady) return;
    const expirationTime =
      currentCue.targetMs + (currentCue.windowMs || 1000) + 100;
    if (elapsedMs > expirationTime) {
      handleGo(true); // Force miss, but keep the show going!
    }
  }, [elapsedMs, currentCue, isLastCue, isReady]);

  function handleGo(forceMiss = false) {
    if (isLastCue || !isReady) return;

    const targetMs = currentCue?.targetMs || 0;
    const windowMs = currentCue?.windowMs || 1000;
    const isTimedWell = Math.abs(elapsedMs - targetMs) <= windowMs;

    const targetLevel = currentCue?.targetLevel || 80;
    const margin = 10;
    const masterOk = Math.abs(faderLevels[4] - 100) < margin;
    const channelsOk =
      faderLevels.slice(0, 4).filter((l) => Math.abs(l - targetLevel) < margin)
        .length >= 2;

    const isAligned = masterOk && channelsOk;
    const tooHigh = faderLevels
      .slice(0, 4)
      .some((l) => l > targetLevel + margin);

    const isHit = !forceMiss && isAligned && isTimedWell;

    setCueResults((prev) => ({ ...prev, [currentCue.id]: { hit: isHit } }));

    if (isHit) {
      setSmMessage(`Good cue. Standby next.`);
      dispatch({ type: "CUE_HIT" });
      dispatch({ type: "ADD_SCORE", delta: 10 });
    } else {
      dispatch({ type: "CUE_MISSED" });
      dispatch({ type: "ADD_SCORE", delta: -10 });

      if (forceMiss) {
        setSmMessage(`You missed ${currentCue.id}! Pay attention! (-10 pts)`);
      } else if (!isTimedWell) {
        setSmMessage(
          `Timing is way off on ${currentCue.id}! Watch the playhead! (-10 pts)`,
        );
      } else if (tooHigh) {
        setSmMessage(
          `Whoa, levels are way too high for ${currentCue.id}! (-10 pts)`,
        );
      } else {
        setSmMessage(`Levels are too low for ${currentCue.id}! (-10 pts)`);
      }
    }

    if (currentIdx >= cueSheet.length - 1) {
      setTimeout(
        () => setSmMessage("And we are clear. Good show, everyone."),
        1000,
      );
      setTimeout(onComplete, 2500);
      setCurrentIdx((prev) => prev + 1);
    } else {
      setCurrentIdx((prev) => prev + 1);
    }
  }

  const handleReady = () => {
    setIsReady(true);
    setSmMessage("Copy that. House is closed. Standby for show... GO!");
  };

  return (
    <div className="page-container animate-blueprint">
      <SectionHeader
        title="Booth Operations"
        subtitle="Coordinate the master clock and maintain fader precision."
        helpText="Watch the Playhead on the timeline. Ensure your faders match the Target Intensity, then hit GO!"
      />

      <div
        style={{
          position: "sticky",
          top: "0px",
          zIndex: 1000,
          marginBottom: "2rem",
          padding: "1rem",
          background: "rgba(15, 23, 42, 0.95)",
          borderRadius: "0 0 8px 8px",
          borderBottom: "2px solid var(--bui-fg-info)",
          borderLeft: "2px solid var(--bui-fg-info)",
          borderRight: "2px solid var(--bui-fg-info)",
          backdropFilter: "blur(10px)",
          boxShadow: "0 10px 20px rgba(0,0,0,0.5)",
        }}
      >
        {/* FIX: Start Show button moved inline with the SM Comms */}
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

          {!isReady ? (
            <Button
              onClick={handleReady}
              style={{
                padding: "6px 16px",
                background: "var(--bui-fg-success)",
                color: "#000",
                fontSize: "0.9rem",
                fontWeight: "bold",
              }}
            >
              Start Show
            </Button>
          ) : (
            <div
              style={{
                color: "var(--bui-fg-info)",
                fontWeight: "bold",
                fontFamily: "var(--font-mono)",
                minWidth: "60px",
                textAlign: "right",
              }}
            >
              {(elapsedMs / 1000).toFixed(1)}s
            </div>
          )}
        </div>

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
            {/* FIX: Passed targetLevel down to the Mixer to inform the Green Bar calculation */}
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
