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

export default function CueExecutionStage({ cueSheet, onComplete }: CueExecutionStageProps) {
  const { state, dispatch } = useGame();
  const [currentIdx, setCurrentIdx] = useState(0);
  const [faderLevels, setFaderLevels] = useState([80, 80, 80, 80, 100]);
  const [lastResult, setLastResult] = useState<"hit" | "miss" | null>(null);
  
  // NEW: Add a show clock that runs continuously
  const [elapsedMs, setElapsedMs] = useState(0);

  const char = state.session ? CHARACTERS.find((c) => c.id === state.session?.characterId) : null;
  const currentCue = cueSheet[currentIdx];
  const isLastCue = currentIdx === cueSheet.length - 1;
  const [cueResults] = useState<Record<string, { hit: boolean }>>({});

  // NEW: Start the timer when the component mounts
  useEffect(() => {
    const startTime = Date.now();
    const interval = setInterval(() => {
      setElapsedMs(Date.now() - startTime);
    }, 50); // Update every 50ms for a smooth clock

    return () => clearInterval(interval);
  }, []);

  const checkFaderAlignment = () => {
    const target = currentCue?.targetLevel || 80;
    const margin = 10;
    const masterOk = Math.abs(faderLevels[4] - 100) < margin;
    const channelsOk = faderLevels.slice(0, 4).filter((l) => Math.abs(l - target) < margin).length >= 2;
    return masterOk && channelsOk;
  };

  function handleGo() {
    const targetMs = currentCue?.targetMs || 0;
    const windowMs = currentCue?.windowMs || 1000;
    
    // NEW: Check if the button was pressed within the acceptable time window!
    const isTimedWell = Math.abs(elapsedMs - targetMs) <= windowMs;
    const isAligned = checkFaderAlignment();

    // The cue is only a hit if BOTH the faders are right AND the timing is right
    const isHit = isAligned && isTimedWell;
    const result = isHit ? "hit" : "miss";

    setLastResult(result);
    setTimeout(() => setLastResult(null), 400);

    if (isHit) {
      dispatch({ type: "CUE_HIT" });
      dispatch({ type: "ADD_SCORE", delta: 10 });
    } else {
      dispatch({ type: "CUE_MISSED" });
    }

    if (isLastCue) {
      onComplete();
    } else {
      setCurrentIdx((prev) => prev + 1);
    }
  }

  return (
    <div className="page-container animate-blueprint">
      <div 
        className={`feedback-overlay ${lastResult ? `flash-${lastResult}` : ""}`}
        role="status"
        aria-live="polite"
        aria-label={lastResult ? `Cue ${lastResult === 'hit' ? 'successful' : 'missed'}` : undefined}
      />
      <SectionHeader
        title="Booth Operations"
        subtitle="Coordinate the master clock and maintain fader precision."
        helpText="Wait for the SHOW CLOCK to approach the Target Time. Ensure your faders match the Target Intensity, then hit GO!"
      />

      <div className="desktop-two-column" role="main">
        <div className="desktop-col-main">
          <HardwarePanel style={{ borderTop: "4px solid var(--bui-fg-warning)", marginBottom: "1.5rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <h2 className="annotation-text" style={{ fontSize: "1.4rem" }}>
                  Next Cue: {currentCue?.id}
                </h2>
                <div className="console-screen" style={{ marginTop: "0.8rem", background: "transparent", padding: 0 }}>
                  CMD: {currentCue?.label?.toUpperCase() || "STANDBY"}
                </div>
                
                {/* Display the active show clock and target time */}
                <div style={{ marginTop: "1rem", display: "flex", gap: "2rem", fontWeight: "bold" }}>
                  <div 
                    style={{ color: "var(--bui-fg-info)" }}
                    role="status"
                    aria-live="polite"
                    aria-label={`Show clock: ${(elapsedMs / 1000).toFixed(1)} seconds`}
                  >
                    ⏱ SHOW CLOCK: {(elapsedMs / 1000).toFixed(1)}s
                  </div>
                  <div 
                    style={{ color: "var(--bui-fg-warning)" }}
                    aria-label={`Target time: ${(currentCue?.targetMs / 1000).toFixed(1)} seconds`}
                  >
                    🎯 TARGET TIME: {(currentCue?.targetMs / 1000).toFixed(1)}s
                  </div>
                </div>

              </div>
              <div style={{ textAlign: "right" }}>
                <span className="annotation-text" style={{ fontSize: "0.7rem", opacity: 0.5 }}>TARGET INTENSITY</span>
                <div style={{ fontSize: "1.8rem", color: "var(--bui-fg-warning)" }}>
                  {currentCue?.targetLevel || 80}%
                </div>
              </div>
            </div>
          </HardwarePanel>
          <CueStack cues={cueSheet} currentIndex={currentIdx} cueResults={cueResults || {}} />
        </div>

        <div className="desktop-col-side">
          <div className="animate-pop">
            <DepartmentMixer department={char?.department} levels={faderLevels} setLevels={setFaderLevels} />
            <div style={{ marginTop: "2rem" }}>
              <MasterControl onGo={handleGo} disabled={false} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}