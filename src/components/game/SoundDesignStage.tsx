// src/components/game/SoundDesignStage.jsx
import { useMemo, useState } from "react";
import { useGame } from "../../context/GameContext";
import { CHARACTERS, SOUND_CONSOLE_CONFIG } from "../../data/gameData";
import Button from "../ui/Button";
import HardwarePanel from "../ui/HardwarePanel";
import SectionHeader from "../ui/SectionHeader";

interface SoundDesignStageProps {
  onComplete: () => void;
}

export default function SoundDesignStage({
  onComplete,
}: SoundDesignStageProps) {
  const { state, dispatch } = useGame();
  const [patch, setPatch] = useState<Record<string, Record<string, number>>>({
    inputs: {},
    outputs: {},
  });
  const [submitted, setSubmitted] = useState(false);

  // Character data available but not used in current implementation
  const char = state.session
    ? CHARACTERS.find((c) => c.id === state.session?.characterId)
    : null;
  void char; // Mark as intentionally unused

  // Generate random target values for your EQ or Faders at the start of the stage
  const [targets] = useState({
    mic1: Math.floor(Math.random() * 80) + 10,
    mic2: Math.floor(Math.random() * 80) + 10,
    playback: Math.floor(Math.random() * 80) + 10,
  });
  void targets; // Mark as intentionally unused

  // Current player slider states
  const [levels] = useState({ mic1: 0, mic2: 0, playback: 0 });
  void levels; // Mark as intentionally unused

  const [channelLevels, setChannelLevels] = useState<Record<number, number>>({
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    5: 0,
  });

  // Win condition check (reserved for future use)
  const checkWinCondition = () => {
    // Check if player's levels are within a margin of error (+/- 5) of the targets
    const isMic1Good = Math.abs(levels.mic1 - targets.mic1) <= 5;
    const isMic2Good = Math.abs(levels.mic2 - targets.mic2) <= 5;
    const isPlaybackGood = Math.abs(levels.playback - targets.playback) <= 5;

    if (isMic1Good && isMic2Good && isPlaybackGood) {
      onComplete(); // Call the prop function to move to the next stage!
    }
  };

  const {
    sources,
    channels: consoleChannels,
    outputBuses,
  } = SOUND_CONSOLE_CONFIG;
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
  const validPaths = outputBuses.map((bus) => {
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
          <HardwarePanel
            style={{
              height: "100%",
              background: "#1a1c23",
              border: "2px solid #333",
              borderRadius: "8px",
            }}
          >
            <h3
              className="annotation-text"
              style={{ marginBottom: "0.5rem", color: "#e2e8f0" }}
            >
              🎛️ Output Routing
            </h3>
            {/* NEW: UX Help text to explain puzzle */}
            <p
              style={{
                fontSize: "0.8rem",
                color: "var(--bui-fg-warning)",
                marginBottom: "1rem",
                fontFamily: "var(--font-mono)",
              }}
            >
              PUZZLE: Route Inputs to Channels. Route Channels to Buses. Push
              Faders above 0. Avoid Dead Channels!
            </p>

            {/* FIX: Channels closer together via gap reduction */}
            <div
              style={{
                display: "flex",
                gap: "4px",
                justifyContent: "center",
                height: "100%",
              }}
            >
              {consoleChannels.map((ch) => (
                <div
                  key={ch}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    width: "50px",
                    background: "#2d3748",
                    padding: "10px 4px",
                    borderRadius: "4px",
                    border: "1px solid #4a5568",
                  }}
                >
                  <div
                    style={{
                      fontSize: "0.7rem",
                      fontWeight: "bold",
                      marginBottom: "10px",
                      color: "#fff",
                    }}
                  >
                    CH {ch}
                  </div>

                  {/* Vertical Bus Buttons */}
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "6px",
                      flex: 1,
                    }}
                  >
                    {outputBuses.map((bus, index) => {
                      const isActive =
                        (patch.outputs as Record<string, number>)[bus] === ch;
                      return (
                        <button
                          key={bus}
                          onClick={() => handlePatch("outputs", bus, ch)}
                          title={`Route to ${bus}`}
                          style={{
                            width: "35px",
                            height: "18px",
                            borderRadius: "2px",
                            border: "none",
                            cursor: "pointer",
                            background: isActive
                              ? index === 0
                                ? "#e53e3e"
                                : "#d69e2e"
                              : "#718096",
                            boxShadow: isActive
                              ? "inset 0 2px 4px rgba(0,0,0,0.6)"
                              : "0 2px 4px rgba(0,0,0,0.4)",
                          }}
                        />
                      );
                    })}
                  </div>

                  {/* NEW: Working Interactive Faders */}
                  <div
                    style={{
                      marginTop: "15px",
                      height: "100px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={channelLevels[ch]}
                      onChange={(e) =>
                        setChannelLevels((prev) => ({
                          ...prev,
                          [ch]: parseInt(e.target.value),
                        }))
                      }
                      style={{
                        writingMode: "vertical-lr", // Makes standard slider vertical
                        direction: "rtl",
                        height: "90px",
                        width: "8px",
                        accentColor: "var(--color-pencil-light)",
                        cursor: "ns-resize",
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Bus Legends */}
            <div
              style={{
                display: "flex",
                gap: "1rem",
                marginTop: "1rem",
                fontSize: "0.7rem",
                color: "#a0aec0",
                flexWrap: "wrap",
              }}
            >
              <span
                style={{ display: "flex", alignItems: "center", gap: "4px" }}
              >
                <div
                  style={{
                    width: "10px",
                    height: "10px",
                    background: "#e53e3e",
                  }}
                ></div>{" "}
                Main L/R
              </span>
              <span
                style={{ display: "flex", alignItems: "center", gap: "4px" }}
              >
                <div
                  style={{
                    width: "10px",
                    height: "10px",
                    background: "#d69e2e",
                  }}
                ></div>{" "}
                Foldback
              </span>
            </div>
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
