import { useMemo, useState } from "react";
import { useGame } from "../../context/GameContext";
import Button from "../ui/Button";
import HardwarePanel from "../ui/HardwarePanel";
import SectionHeader from "../ui/SectionHeader";

interface SoundDesignStageProps {
  onComplete: () => void;
}

export default function SoundDesignStage({ onComplete }: SoundDesignStageProps) {
  const { dispatch } = useGame();
  const [patch, setPatch] = useState<Record<string, Record<string, number>>>({ inputs: {}, outputs: {} });
  const [submitted, setSubmitted] = useState(false);

  const sources = ["Vocals 1", "Vocals 2", "Pit Orchestra", "SFX Playback"];
  const consoleChannels = [1, 2, 3, 4, 5]; // Added a 5th channel for puzzle flexibility
  const outputBuses = ["Main L/R", "Foldback (Stage)", "Subwoofers"];

  // ENHANCEMENT: Randomly select one or two channels to be "Dead" at the start of the level
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
        {/* ... (Keep your Input Patching UI exactly the same) ... */}
        
        {/* Update your Output Routing UI to show feedback! */}
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
      
      {/* ... (Keep your submit button exactly the same) ... */}
    </div>
  );
}