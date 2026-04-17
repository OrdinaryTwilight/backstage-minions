import { useMemo, useState } from "react";
import { useGame } from "../../context/GameContext";
import { SOUND_CONSOLE_CONFIG } from "../../data/gameData";
import Button from "../ui/Button";
import HardwarePanel from "../ui/HardwarePanel";
import SectionHeader from "../ui/SectionHeader";

interface SoundDesignStageProps {
  onComplete: () => void;
}

export default function SoundDesignStage({
  onComplete,
}: SoundDesignStageProps) {
  const { dispatch } = useGame();
  const [patch, setPatch] = useState<Record<string, Record<string, number>>>({
    inputs: {},
    outputs: {},
  });
  const [channelLevels, setChannelLevels] = useState<Record<number, number>>({
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    5: 0,
  });
  const [submitted, setSubmitted] = useState(false);

  const {
    sources,
    channels: consoleChannels,
    outputBuses,
  } = SOUND_CONSOLE_CONFIG;

  // Randomly select one channel to be "Dead" at the start of the level
  const deadChannels = useMemo(() => {
    const shuffled = [...consoleChannels].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 1);
  }, [consoleChannels]);

  const handlePatch = (type: string, source: string, target: number) => {
    setPatch((prev) => ({
      ...prev,
      [type]: { ...prev[type], [source]: target },
    }));
  };

  // Puzzle Logic
  const validPaths = outputBuses.map((bus) => {
    const outChannel = (patch.outputs as Record<string, number>)[bus];
    if (!outChannel || deadChannels.includes(outChannel)) return false;

    // Check if any input is routed to this channel
    const hasInput = Object.values(patch.inputs).includes(outChannel);
    // NEW: Check if the fader is actually pushed up!
    const faderIsUp = channelLevels[outChannel] > 0;

    return hasInput && faderIsUp;
  });

  const isFullyPatched = validPaths.filter(Boolean).length >= 2;

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
        {/* INPUT ROUTING (Left Column) */}
        <div className="desktop-col-main">
          <HardwarePanel style={{ height: "100%" }}>
            <h3 className="annotation-text" style={{ marginBottom: "1rem" }}>
              🎤 Input Patchbay (Stage to Console)
            </h3>
            {sources.map((src) => (
              <div key={src} style={{ marginBottom: "1.5rem" }}>
                <div
                  className="annotation-text"
                  style={{
                    fontSize: "0.8rem",
                    opacity: 0.6,
                    marginBottom: "5px",
                  }}
                >
                  {src}
                </div>
                <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                  {consoleChannels.map((ch) => (
                    <Button
                      key={ch}
                      onClick={() => handlePatch("inputs", src, ch)}
                      style={{
                        flex: "1 0 15%",
                        fontSize: "0.8rem",
                        background:
                          (patch.inputs as Record<string, number>)[src] === ch
                            ? "var(--bui-fg-success)"
                            : "",
                      }}
                    >
                      CH {ch}
                    </Button>
                  ))}
                </div>
              </div>
            ))}
          </HardwarePanel>
        </div>

        {/* OUTPUT ROUTING - (Right Column) */}
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
            <p
              style={{
                fontSize: "0.8rem",
                color: "var(--bui-fg-warning)",
                marginBottom: "1rem",
                fontFamily: "var(--font-mono)",
                lineHeight: "1.4",
              }}
            >
              PUZZLE: Route Inputs to Channels. Route Channels to Buses. Push
              Faders above 0. Avoid Dead Channels!
            </p>

            <div
              style={{
                display: "flex",
                gap: "4px",
                justifyContent: "center",
                height: "100%",
              }}
            >
              {consoleChannels.map((ch) => {
                const isDead = deadChannels.includes(ch);

                return (
                  <div
                    key={ch}
                    style={{
                      position: "relative",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      width: "50px",
                      background: isDead ? "#3b2121" : "#2d3748",
                      padding: "15px 4px 10px 4px",
                      borderRadius: "4px",
                      border: isDead
                        ? "2px solid var(--bui-fg-danger)"
                        : "1px solid #4a5568",
                    }}
                  >
                    {/* DEAD CHANNEL LABEL */}
                    {isDead && (
                      <div
                        style={{
                          position: "absolute",
                          top: "-10px",
                          background: "var(--bui-fg-danger)",
                          color: "#fff",
                          fontSize: "0.6rem",
                          fontWeight: "bold",
                          padding: "2px 4px",
                          borderRadius: "2px",
                          zIndex: 10,
                        }}
                      >
                        DEAD
                      </div>
                    )}

                    <div
                      style={{
                        fontSize: "0.7rem",
                        fontWeight: "bold",
                        marginBottom: "10px",
                        color: isDead ? "var(--bui-fg-danger)" : "#fff",
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

                    {/* Interactive Faders */}
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
                );
              })}
            </div>

            {/* Bus Legends */}
            <div
              style={{
                display: "flex",
                gap: "1rem",
                marginTop: "1.5rem",
                fontSize: "0.7rem",
                color: "#a0aec0",
                flexWrap: "wrap",
                justifyContent: "center",
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

      {/* Completion Section */}
      <div
        style={{
          marginTop: "2rem",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          background: "var(--color-surface-translucent)",
          padding: "1rem",
          borderRadius: "var(--radius-md)",
          border: "1px solid var(--glass-border)",
        }}
      >
        <div style={{ display: "flex", gap: "1rem" }}>
          {outputBuses.map((bus, index) => {
            const isPathValid = validPaths[index];
            const currentOutChannel = (patch.outputs as Record<string, number>)[
              bus
            ];
            const isPatchedToDead = currentOutChannel
              ? deadChannels.includes(currentOutChannel)
              : false;

            return (
              <div
                key={bus}
                className="annotation-text"
                style={{
                  fontSize: "0.8rem",
                  display: "flex",
                  flexDirection: "column",
                  gap: "4px",
                }}
              >
                <span>{bus}</span>
                <span
                  style={{
                    color: isPathValid
                      ? "var(--bui-fg-success)"
                      : isPatchedToDead
                        ? "var(--bui-fg-danger)"
                        : "var(--bui-fg-warning)",
                  }}
                >
                  {isPathValid
                    ? "SIGNAL OK"
                    : isPatchedToDead
                      ? "DEAD CHANNEL"
                      : "NO SIGNAL"}
                </span>
              </div>
            );
          })}
        </div>

        <Button
          onClick={() => {
            submit();
            setTimeout(onComplete, 1500);
          }}
          disabled={!isFullyPatched || submitted}
          style={{
            background: isFullyPatched ? "var(--bui-fg-success)" : "",
            color: isFullyPatched ? "#000" : "",
          }}
        >
          {submitted ? "Verification Complete" : "Verify Signal Flow"}
        </Button>
      </div>
    </div>
  );
}
