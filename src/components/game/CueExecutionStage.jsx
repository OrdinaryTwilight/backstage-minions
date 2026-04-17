import { useState } from "react";
import { useGame } from "../../context/GameContext";
import { CHARACTERS } from "../../data/gameData";
import CueStack from "../ui/CueStack";
import DepartmentMixer from "../ui/DepartmentMixer";
import HardwarePanel from "../ui/HardwarePanel";
import MasterControl from "../ui/MasterControl";
import SectionHeader from "../ui/SectionHeader";

export default function CueExecutionStage({ cueSheet, onComplete }) {
  const { state, dispatch } = useGame();
  const [currentIdx, setCurrentIdx] = useState(0);
  const [faderLevels, setFaderLevels] = useState([80, 80, 80, 80, 100]); // 4 channels + Master

  const char = CHARACTERS.find((c) => c.id === state.session.characterId);
  const currentCue = cueSheet[currentIdx];
  const isLastCue = currentIdx === cueSheet.length - 1;

  // Hybrid Logic: Checks if faders are in the 'Safe Zone' for the current cue
  const checkFaderAlignment = () => {
    const target = currentCue?.targetLevel || 80;
    const margin = 10;
    // Check if Master and at least 2 channels are in range
    const masterOk = Math.abs(faderLevels[4] - 100) < margin;
    const channelsOk =
      faderLevels.slice(0, 4).filter((l) => Math.abs(l - target) < margin)
        .length >= 2;
    return masterOk && channelsOk;
  };

  function handleGo() {
    const isAligned = checkFaderAlignment();

    if (isAligned) {
      dispatch({ type: "HIT_CUE" });
      dispatch({ type: "ADD_SCORE", delta: 10 });
    } else {
      dispatch({ type: "MISS_CUE" });
    }

    if (isLastCue) {
      onComplete();
    } else {
      setCurrentIdx((prev) => prev + 1);
    }
  }

  return (
    <div className="page-container animate-blueprint">
      <SectionHeader
        title={`${char?.icon} Tech Booth: Session #${state.session.productionId.toUpperCase()}`}
        subtitle="Coordinate the master clock and maintain fader precision."
      />

      <div className="desktop-two-column">
        {/* Left: Console HUD */}
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
                  CMD: {currentCue?.action.toUpperCase()}
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

          <CueStack cues={cueSheet} currentIndex={currentIdx} />
        </div>

        {/* Right: Tactical Controls */}
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
