// src/components/game/SoundDesignStage.jsx
import { useMemo, useState } from "react";
import { useGame } from "../../context/GameContext";
import { CHARACTERS } from "../../data/gameData";
import Button from "../ui/Button";
import HardwarePanel from "../ui/HardwarePanel";
import SectionHeader from "../ui/SectionHeader";

interface SoundDesignStageProps {
  onComplete: () => void;
}

export default function SoundDesignStage({ onComplete }: SoundDesignStageProps) {
  const { state, dispatch } = useGame();
  const [patch, setPatch] = useState<Record<string, Record<string, number>>>({ inputs: {}, outputs: {} });
  const [submitted, setSubmitted] = useState(false);
  

  // Character data available but not used in current implementation
  const char = state.session ? CHARACTERS.find((c) => c.id === state.session?.characterId) : null;
  void char; // Mark as intentionally unused

  // Generate random target values for your EQ or Faders at the start of the stage
  const [targets, setTargets] = useState({
    mic1: Math.floor(Math.random() * 80) + 10,
    mic2: Math.floor(Math.random() * 80) + 10,
    playback: Math.floor(Math.random() * 80) + 10,
  });

// Current player slider states
const [levels, setLevels] = useState({ mic1: 0, mic2: 0, playback: 0 });

function checkWinCondition() {
  // Check if player's levels are within a margin of error (+/- 5) of the targets
  const isMic1Good = Math.abs(levels.mic1 - targets.mic1) <= 5;
  const isMic2Good = Math.abs(levels.mic2 - targets.mic2) <= 5;
  const isPlaybackGood = Math.abs(levels.playback - targets.playback) <= 5;

  if (isMic1Good && isMic2Good && isPlaybackGood) {
    onComplete(); // Call the prop function to move to the next stage!
  }
}

  const sources = ["Vocals 1", "Vocals 2", "Pit Orchestra", "SFX Playback"];
  const consoleChannels = [1, 2, 3, 4];
  const outputBuses = ["Main L/R", "Foldback (Stage)", "Subwoofers"];
  const deadChannels = useMemo(() => {
    const shuffled = [...consoleChannels].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 1); // 1 random channel is broken
  }, []);

  const handlePatch = (type: string, source: string, target: number) => {
    setPatch((prev) => ({
      ...prev,
      [type]: { ...prev[type], [source]: target },
    }));
  };

  // Puzzle Logic: A path is only complete if an Input matches an Output AND the channel isn't dead
  const validPaths = outputBuses.map(bus => {
    const outChannel = (patch.outputs as Record<string, number>)[bus];
    if (!outChannel || deadChannels.includes(outChannel)) return false;
    
    // Check if any input is routed to this same channel
    const hasInput = Object.values(patch.inputs).includes(outChannel);
    return hasInput;
  });

  // Level is complete if all required outputs are receiving a valid signal
  const isFullyPatched = validPaths.filter(Boolean).length >= 2; // Require at least 2 complete paths
  function submit() {
    dispatch({ type: "ADD_SCORE", delta: 50 });
    setSubmitted(true);
  }

  return (
    <div className="page-container animate-blueprint">
     <SectionHeader
        title="Signal Flow Patching"
        subtitle="Route inputs through the console to output buses."
        helpText="Careful! Backstage rumor says a channel strip on this board is blown out. If an output isn't receiving signal, try patching around it."
      />

      <div className="desktop-two-column">
        {/* Input to Console Patching */}
        <div className="desktop-col-main">
          <HardwarePanel style={{ borderLeft: "4px solid var(--bui-fg-info)" }}>
            <h3 className="annotation-text" style={{ marginBottom: "1rem" }}>
              🔌 Input Patch Bay
            </h3>
            {sources.map((src) => (
              <div
                key={src}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: "10px",
                }}
              >
                <span
                  className="annotation-text"
                  style={{ fontSize: "0.9rem" }}
                >
                  {src}
                </span>
                <div style={{ display: "flex", gap: "5px" }}>
                  {consoleChannels.map((ch) => (
                    <button
                      key={ch}
                      onClick={() => handlePatch("inputs", src, ch)}
                      className={`plot-cell ${(patch.inputs as Record<string, number>)[src] === ch ? "active" : ""}`}
                      style={{
                        width: "30px",
                        height: "30px",
                        borderRadius: "50%",
                        background:
                          (patch.inputs as Record<string, number>)[src] === ch
                            ? "var(--bui-fg-info)"
                            : "rgba(255,255,255,0.05)",
                      }}
                    >
                      {ch}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </HardwarePanel>
        </div>

        {/* Console to Output Patching */}
        <div className="desktop-col-side">
          <HardwarePanel style={{ height: "100%" }}>
            <h3 className="annotation-text" style={{ marginBottom: "1rem" }}>
              🔊 Output Routing
            </h3>
            {outputBuses.map((bus, index) => {
              const currentOutChannel = (patch.outputs as Record<string, number>)[bus];
              const isPatchedToDead = deadChannels.includes(currentOutChannel);
              const isPathValid = validPaths[index];

              return (
                <div key={bus} style={{ marginBottom: "1.5rem" }}>
                  <div className="annotation-text" style={{ fontSize: "0.8rem", opacity: 0.6, marginBottom: "5px", display: "flex", justifyContent: "space-between" }}>
                    <span>{bus}</span>
                    {/* ENHANCEMENT: Signal Status Indicator */}
                    <span style={{ 
                      color: isPathValid ? "var(--bui-fg-success)" : isPatchedToDead ? "var(--bui-fg-danger)" : "var(--bui-fg-warning)" 
                    }}>
                      {isPathValid ? "SIGNAL OK" : isPatchedToDead ? "DEAD CHANNEL" : "NO SIGNAL"}
                    </span>
                  </div>
                  
                  <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                    {consoleChannels.map((ch) => (
                      <Button
                        key={ch}
                        onClick={() => handlePatch("outputs", bus, ch)}
                        style={{
                          flex: "1 0 20%",
                          fontSize: "0.7rem",
                          background: (patch.outputs as Record<string, number>)[bus] === ch ? "var(--bui-fg-info)" : "",
                        }}
                      >
                        CH {ch}
                      </Button>
                    ))}
                  </div>
                </div>
              );
            })}
          </HardwarePanel>
        </div>
      </div>

      <div style={{ marginTop: "2rem" }}>
        {!submitted ? (
          <Button
            variant="success"
            className="btn-xl" // NEW: Makes it taller and more prominent
            onClick={submit}
            disabled={!isFullyPatched}
            style={{ width: "100%" }}
          >
            {isFullyPatched
              ? "Initialize Signal Chain"
              : "[ AWAITING PATCH COMPLETION ]"}
          </Button>
        ) : (
          <HardwarePanel className="animate-pop">
            <h3
              className="annotation-text"
              style={{ color: "var(--bui-fg-success)" }}
            >
              ✅ SIGNAL PATH VERIFIED
            </h3>
            <p style={{ fontStyle: "italic", margin: "0.5rem 0" }}>
              "Signal strength is nominal. Routing is bit-perfect."
            </p>
            <Button
              variant="accent"
              onClick={onComplete}
              style={{ width: "100%", marginTop: "1rem" }}
            >
              Enter the Booth
            </Button>
          </HardwarePanel>
        )}
      </div>
    </div>
  );
}
