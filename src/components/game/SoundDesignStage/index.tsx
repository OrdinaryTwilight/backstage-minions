import { useEffect, useState } from "react";
import { useGame } from "../../../context/GameContext";
import { SOUND_CONSOLE_CONFIG } from "../../../data/gameData";
import Button from "../../ui/Button";
import HardwarePanel from "../../ui/HardwarePanel";
import SectionHeader from "../../ui/SectionHeader";
import SoundConsole from "./SoundConsole";

export default function SoundDesignStage({
  onComplete,
  difficulty = "school",
}: Readonly<{
  onComplete: () => void;
  difficulty?: string;
}>) {
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
  const [deadChannels, setDeadChannels] = useState<
    typeof SOUND_CONSOLE_CONFIG.channels
  >([]);

  const {
    sources,
    channels: consoleChannels,
    outputBuses,
  } = SOUND_CONSOLE_CONFIG;

  useEffect(() => {
    const getDeadCount = (diff: string): number => {
      if (diff === "professional") return 2;
      if (diff === "community") return 1;
      return 0;
    };
    const deadCount = getDeadCount(difficulty);
    if (deadCount === 0) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setDeadChannels([]);
      return;
    }

    // Fisher-Yates shuffle to select random channels
    const shuffled = [...consoleChannels];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    setDeadChannels(shuffled.slice(0, deadCount));
  }, [difficulty, consoleChannels]);

  const handlePatch = (type: string, source: string, target: number) => {
    setPatch((prev) => ({
      ...prev,
      [type]: { ...prev[type], [source]: target },
    }));
  };

  const validPaths = outputBuses.map((bus) => {
    const outChannel = patch.outputs[bus];
    if (!outChannel || deadChannels.includes(outChannel)) return false;
    return (
      Object.values(patch.inputs).includes(outChannel) &&
      channelLevels[outChannel] > 0
    );
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
        helpText="Careful! Backstage rumor says a channel strip on this board is blown out."
      />

      <div className="desktop-two-column">
        <div className="desktop-col-main">
          <HardwarePanel style={{ height: "100%" }}>
            <h3 className="annotation-text" style={{ marginBottom: "1rem" }}>
              🎤 Input Patchbay
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
                          patch.inputs[src] === ch
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

        <div className="desktop-col-side">
          <SoundConsole
            consoleChannels={consoleChannels}
            outputBuses={outputBuses}
            deadChannels={deadChannels}
            patch={patch}
            handlePatch={handlePatch}
            channelLevels={channelLevels}
            setChannelLevels={setChannelLevels}
          />
        </div>
      </div>

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
            const outChannel = patch.outputs[bus];
            const isPatchedToDead = outChannel
              ? deadChannels.includes(outChannel)
              : false;
            const signalColor = isPathValid
              ? "var(--bui-fg-success)"
              : isPatchedToDead
                ? "var(--bui-fg-danger)"
                : "var(--bui-fg-warning)";
            const signalStatus = isPathValid
              ? "SIGNAL OK"
              : isPatchedToDead
                ? "DEAD CHANNEL"
                : "NO SIGNAL";
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
                    color: signalColor,
                  }}
                >
                  {signalStatus}
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
