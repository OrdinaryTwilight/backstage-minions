import HardwarePanel from "../../ui/HardwarePanel";

interface SoundConsoleProps {
  consoleChannels: number[];
  outputBuses: string[];
  deadChannels: number[];
  patch: Record<string, Record<string, number>>;
  handlePatch: (type: string, source: string, target: number) => void;
  channelLevels: Record<number, number>;
  setChannelLevels: React.Dispatch<
    React.SetStateAction<Record<number, number>>
  >;
}

export default function SoundConsole({
  consoleChannels,
  outputBuses,
  deadChannels,
  patch,
  handlePatch,
  channelLevels,
  setChannelLevels,
}: Readonly<SoundConsoleProps>) {
  return (
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
        Route Inputs to Channels. Route Channels to Buses. Push Faders above 0.
        Avoid Dead Channels!
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

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "6px",
                  flex: 1,
                }}
              >
                {outputBuses.map((bus, index) => {
                  const isActive = patch.outputs[bus] === ch;
                  let btnBg = "#718096";

                  if (isActive) btnBg = index === 0 ? "#e53e3e" : "#d69e2e";
                  if (isDead) btnBg = "#2d3748";

                  return (
                    <button
                      key={bus}
                      type="button"
                      disabled={isDead} // FIX: Prevents patching into dead channels
                      onClick={() => handlePatch("outputs", bus, ch)}
                      aria-label={`Route to ${bus}`}
                      style={{
                        width: "35px",
                        height: "18px",
                        borderRadius: "2px",
                        border: "none",
                        cursor: isDead ? "not-allowed" : "pointer",
                        background: btnBg,
                        boxShadow: isActive
                          ? "inset 0 2px 4px rgba(0,0,0,0.6)"
                          : "0 2px 4px rgba(0,0,0,0.4)",
                        opacity: isDead ? 0.3 : 1,
                      }}
                    />
                  );
                })}
              </div>

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
                  disabled={isDead} // FIX: Locks the physical fader on dead channels
                  value={isDead ? 0 : channelLevels[ch]}
                  onChange={(e) =>
                    setChannelLevels((prev) => ({
                      ...prev,
                      [ch]: Number.parseInt(e.target.value),
                    }))
                  }
                  style={{
                    writingMode: "vertical-lr",
                    direction: "rtl",
                    height: "90px",
                    width: "8px",
                    cursor: isDead ? "not-allowed" : "ns-resize",
                    opacity: isDead ? 0.3 : 1,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </HardwarePanel>
  );
}
