import { useEffect, useState } from "react";
import { useGame } from "../../../context/GameContext";
import { getStageHelpText, SOUND_CONSOLE_CONFIG } from "../../../data/gameData";
import Button from "../../ui/Button";
import HardwarePanel from "../../ui/HardwarePanel";
import SectionHeader from "../../ui/SectionHeader";
import SoundConsole from "./SoundConsole";

interface ReportDetails {
  score: number;
  validCount: number;
  totalOuts: number;
}

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
  const [reportDetails, setReportDetails] = useState<ReportDetails | null>(
    null,
  );
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
      setDeadChannels([]);
      return;
    }

    const shuffled = [...consoleChannels];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    setDeadChannels(shuffled.slice(0, deadCount));
  }, [difficulty, consoleChannels]);

  const handlePatch = (
    type: "inputs" | "outputs",
    source: string,
    target: number,
  ) => {
    setPatch((prev) => {
      const isCurrentlyPatched = prev[type][source] === target;
      if (isCurrentlyPatched) {
        const { [source]: _removed, ...rest } = prev[type];
        return { ...prev, [type]: rest as Record<string, number> };
      }

      const cleanedType = Object.entries(prev[type]).reduce(
        (acc, [srcKey, tgtVal]) => {
          if (tgtVal !== target) acc[srcKey] = tgtVal;
          return acc;
        },
        {} as Record<string, number>,
      );

      return { ...prev, [type]: { ...cleanedType, [source]: target } };
    });
  };

  const validPaths = outputBuses.map((bus) => {
    const outChannel = patch.outputs[bus];
    if (!outChannel || deadChannels.includes(outChannel)) return false;
    return (
      Object.values(patch.inputs).includes(outChannel) &&
      channelLevels[outChannel] > 0
    );
  });

  // FIX: Priority 28 - Dynamically check against the actual number of buses required
  const isFullyPatched =
    validPaths.filter(Boolean).length === outputBuses.length;

  function submit() {
    const validCount = validPaths.filter(Boolean).length;
    const totalOuts = outputBuses.length;

    let maxScore = 100;
    if (difficulty === "community") maxScore = 120;
    if (difficulty === "professional") maxScore = 150;

    const finalScore = Math.floor((validCount / totalOuts) * maxScore);

    dispatch({ type: "ADD_SCORE", delta: finalScore });
    setReportDetails({ score: finalScore, validCount, totalOuts });
    setSubmitted(true);
  }

  // FIX: Added SM Parity for Sound Design
  const renderFeedbackPanel = () => {
    if (!reportDetails) return null;
    const { score, validCount, totalOuts } = reportDetails;
    const isFailLocal = validCount === 0;

    let feedbackHeader = "";
    let feedbackText = "";

    if (validCount === totalOuts) {
      feedbackHeader = "🏆 PERFECT PATCH";
      feedbackText =
        "SM: 'Sound check is crystal clear across all buses. Great job avoiding the dead channels. Let's open the house!'";
    } else if (validCount >= totalOuts / 2) {
      feedbackHeader = "✅ CONDITIONAL CLEARANCE";
      feedbackText = `SM: 'We're missing some monitors, but the mains are working. We'll have to make do. (${validCount}/${totalOuts} buses active)'`;
    } else {
      feedbackHeader = "⚠️ CRITICAL AUDIO FAILURE";
      feedbackText = `SM: 'Barely anything is coming through the console! The actors are going to be flying blind out there. (${validCount}/${totalOuts} buses active)'`;
    }

    return (
      <HardwarePanel
        className="animate-pop"
        style={{ marginTop: "1rem", width: "100%" }}
      >
        <h3
          className="annotation-text"
          style={{
            color: isFailLocal
              ? "var(--bui-fg-danger)"
              : "var(--bui-fg-success)",
          }}
        >
          {feedbackHeader}
        </h3>
        <p
          style={{
            fontFamily: "var(--font-sketch)",
            marginTop: "0.5rem",
            whiteSpace: "pre-wrap",
          }}
        >
          {feedbackText}
        </p>
        <div style={{ marginTop: "0.5rem", fontSize: "0.9rem", opacity: 0.8 }}>
          Score Awarded: +{score} pts
        </div>
        <div style={{ display: "flex", gap: "1rem", marginTop: "1.5rem" }}>
          <Button
            variant="accent"
            onClick={onComplete}
            style={{ width: "100%" }}
          >
            Sign Off & Continue Show
          </Button>
        </div>
      </HardwarePanel>
    );
  };

  return (
    <div className="page-container animate-blueprint">
      <SectionHeader
        title="Signal Flow Patching"
        subtitle="Route inputs through the console to output buses."
        helpText={getStageHelpText("sound_console")}
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
                  {consoleChannels.map((ch) => {
                    const isPatched = patch.inputs[src] === ch;
                    return (
                      <Button
                        key={ch}
                        type="button"
                        variant={isPatched ? "success" : "default"}
                        onClick={() => handlePatch("inputs", src, ch)}
                        style={{ flex: "1 0 15%", fontSize: "0.8rem" }}
                        disabled={submitted}
                      >
                        CH {ch}
                      </Button>
                    );
                  })}
                </div>
              </div>
            ))}
          </HardwarePanel>
        </div>

        <div
          className="desktop-col-side"
          style={{ pointerEvents: submitted ? "none" : "auto" }}
        >
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
          flexDirection: "column",
          gap: "1rem",
          background: "var(--color-surface-translucent)",
          padding: "1rem",
          borderRadius: "var(--radius-md)",
          border: "1px solid var(--glass-border)",
        }}
      >
        <div
          style={{
            display: "flex",
            gap: "1rem",
            flexWrap: "wrap",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
            {outputBuses.map((bus, index) => {
              const isPathValid = validPaths[index];
              const currentOutChannel = patch.outputs[bus];
              const isPatchedToDead = currentOutChannel
                ? deadChannels.includes(currentOutChannel)
                : false;

              let statusColor = "var(--bui-fg-warning)";
              let statusText = "NO SIGNAL";
              if (isPathValid) {
                statusColor = "var(--bui-fg-success)";
                statusText = "SIGNAL OK";
              } else if (isPatchedToDead) {
                statusColor = "var(--bui-fg-danger)";
                statusText = "DEAD CHANNEL";
              }

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
                  <span style={{ color: statusColor }}>{statusText}</span>
                </div>
              );
            })}
          </div>

          {!submitted && (
            <Button
              type="button"
              onClick={submit}
              style={{
                background: isFullyPatched ? "var(--bui-fg-success)" : "",
                color: isFullyPatched ? "#000" : "",
              }}
            >
              {isFullyPatched ? "Verify Signal Flow" : "Submit Partial Patch"}
            </Button>
          )}
        </div>

        {submitted && renderFeedbackPanel()}
      </div>
    </div>
  );
}
