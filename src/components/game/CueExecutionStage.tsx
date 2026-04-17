import { useState } from "react";
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
  const char = state.session ? CHARACTERS.find((c) => c.id === state.session?.characterId) : null;
  const currentCue = cueSheet[currentIdx];
  const isLastCue = currentIdx === cueSheet.length - 1;
  const [cueResults] = useState<Record<string, { hit: boolean }>>({});
  /**
   * checkFaderAlignment: Core scoring logic for booth execution
   *
   * MECHANICAL DESIGN:
   * - A successful cue execution requires:
   *   1. Master fader at or near 100% (±10 tolerance)
   *   2. At least 2 of 4 channel faders within ±10 of the target intensity
   *
   * RATIONALE:
   * - Master fader controls overall output level (technical requirement)
   * - Channel faders require a minimum of 2/4 at target to simulate:
   *   a) Realistic backstage team coordination (2+ people on the rig)
   *   b) Graceful degradation (partial success if setup isn't perfect)
   * - ±10 tolerance reflects real-world equipment accuracy
   *
   * EDGE CASES:
   * - If targetLevel is missing from gameData (fallback: 80%), allows execution
   * - If fewer than 2 channels are at target, execution fails (score: 0)
   * - Master fader below 90% or above 110% also fails (safety mechanism)
   *
   * @returns true if fader alignment meets criteria, false otherwise
   */
  const checkFaderAlignment = () => {
    // Fallback to 80 if targetLevel is missing in gameData.js
    const target = currentCue?.targetLevel || 80;
    const margin = 10; // ±10% tolerance window

    // Check master fader: must be 100% (within ±10%)
    const masterOk = Math.abs(faderLevels[4] - 100) < margin;

    // Check channel faders: need at least 2 of 4 at target level
    const channelsOk =
      faderLevels.slice(0, 4).filter((l) => Math.abs(l - target) < margin)
        .length >= 2;

    return masterOk && channelsOk;
  };

  /**
   * handleGo: Unified dispatch handler for booth operations
   *
   * IMPORTANT: This function uses a SINGLE check before dispatch to prevent
   * the triple-dispatch bug where multiple dispatch calls in rapid succession
   * caused score increments to stack (e.g., +30 instead of +10).
   *
   * FIXED FLOW (Correct):
   * 1. checkFaderAlignment() → true/false
   * 2. One dispatch call based on result
   * 3. Next cue or complete
   *
   * BROKEN FLOW (Previous):
   * 1. Check master → dispatch CUE_HIT
   * 2. Check channels → dispatch CUE_HIT again
   * 3. Unified check → dispatch ADD_SCORE
   * Result: +30 instead of +10
   */
  function handleGo() {
    const isAligned = checkFaderAlignment();
    const result = isAligned ? "hit" : "miss";

    // Trigger visual feedback (CSS animation)
    setLastResult(result);
    setTimeout(() => setLastResult(null), 400);

    // Unified dispatch: single result determines all state changes
    if (isAligned) {
      dispatch({ type: "CUE_HIT" });
      dispatch({ type: "ADD_SCORE", delta: 10 });
    } else {
      dispatch({ type: "CUE_MISSED" });
    }

    // Stage progression
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
      />
      <SectionHeader
        title="Booth Operations"
        subtitle="Coordinate the master clock and maintain fader precision."
        helpText="Wait for the clock to approach the Target Time. Ensure at least 2 faders match the 'Target Intensity' shown in the HUD, then hit GO. Timing and precision both affect your score."
      />

      <div className="desktop-two-column">
        <div className="desktop-col-main">
          <HardwarePanel
            style={{
              borderTop: "4px solid var(--bui-fg-warning)",
              marginBottom: "1.5rem",
            }}
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
                  Next Cue: {currentCue?.id}
                </h2>
                <div
                  className="console-screen"
                  style={{
                    marginTop: "0.8rem",
                    background: "transparent",
                    padding: 0,
                  }}
                >
                  {/* FIX: Changed .action to .label to match gameData.js */}
                  CMD: {currentCue?.label?.toUpperCase() || "STANDBY"}
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
                  {currentCue?.targetLevel || 80}%
                </div>
              </div>
            </div>
          </HardwarePanel>
          <CueStack
            cues={cueSheet}
            currentIndex={currentIdx}
            cueResults={cueResults || {}}
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
              <MasterControl onGo={handleGo} disabled={false} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
