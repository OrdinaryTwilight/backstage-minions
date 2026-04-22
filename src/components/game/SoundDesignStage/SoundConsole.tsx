import HardwarePanel from "../../ui/HardwarePanel";
import ChannelStrip from "./ChannelStrip";

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
      {/* Header */}
      <h3
        className="annotation-text"
        style={{ marginBottom: "0.5rem", color: "#e2e8f0" }}
      >
        🎛️ Output Routing
      </h3>

      {/* Instructions */}
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

      {/* Channel Strip Area */}
      <fieldset
        aria-label="Audio mixing console channels"
        style={{
          display: "flex",
          gap: "4px",
          justifyContent: "center",
          height: "100%",
          border: "none",
          padding: 0,
          margin: 0,
          minWidth: 0,
        }}
      >
        {consoleChannels.map((ch) => {
          const isDead = deadChannels.includes(ch);

          // Determine which input is routed into this channel
          const inputSource = Object.keys(patch.inputs).find(
            (src) => patch.inputs[src] === ch,
          );

          return (
            <ChannelStrip
              key={ch}
              ch={ch}
              isDead={isDead}
              inputSource={inputSource}
              outputBuses={outputBuses}
              patch={patch}
              handlePatch={handlePatch}
              level={channelLevels[ch] ?? 0}
              setLevel={(value) =>
                setChannelLevels((prev) => ({
                  ...prev,
                  [ch]: value,
                }))
              }
            />
          );
        })}
      </fieldset>
    </HardwarePanel>
  );
}
