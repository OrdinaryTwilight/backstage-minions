// src/components/game/SoundDesignStage.jsx
import { useState } from "react";
import { useGame } from "../../context/GameContext";
import { CHARACTERS } from "../../data/gameData";
import Button from "../ui/Button";
import HardwarePanel from "../ui/HardwarePanel";
import SectionHeader from "../ui/SectionHeader";

export default function SoundDesignStage({ onComplete }) {
  const { state, dispatch } = useGame();
  const [patch, setPatch] = useState({ inputs: {}, outputs: {} });
  const [submitted, setSubmitted] = useState(false);

  const char = CHARACTERS.find((c) => c.id === state.session.characterId);

  const sources = ["Vocals 1", "Vocals 2", "Pit Orchestra", "SFX Playback"];
  const consoleChannels = [1, 2, 3, 4];
  const outputBuses = ["Main L/R", "Foldback (Stage)", "Subwoofers"];

  const handlePatch = (type, source, target) => {
    setPatch((prev) => ({
      ...prev,
      [type]: { ...prev[type], [source]: target },
    }));
  };

  const isFullyPatched =
    Object.keys(patch.inputs).length >= 3 &&
    Object.keys(patch.outputs).length >= 2;

  function submit() {
    dispatch({ type: "ADD_SCORE", delta: 50 });
    setSubmitted(true);
  }

  return (
    <div className="page-container animate-blueprint">
      <SectionHeader
        title="Signal Flow Patching"
        subtitle="Route inputs through the console to the destination buses."
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
                      className={`plot-cell ${patch.inputs[src] === ch ? "active" : ""}`}
                      style={{
                        width: "30px",
                        height: "30px",
                        borderRadius: "50%",
                        background:
                          patch.inputs[src] === ch
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
            {outputBuses.map((bus) => (
              <div key={bus} style={{ marginBottom: "1.5rem" }}>
                <div
                  className="annotation-text"
                  style={{
                    fontSize: "0.8rem",
                    opacity: 0.6,
                    marginBottom: "5px",
                  }}
                >
                  {bus}
                </div>
                <div style={{ display: "flex", gap: "8px" }}>
                  {consoleChannels.map((ch) => (
                    <Button
                      key={ch}
                      onClick={() => handlePatch("outputs", bus, ch)}
                      style={{
                        flex: 1,
                        fontSize: "0.7rem",
                        background:
                          patch.outputs[bus] === ch
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
      </div>

      <div style={{ marginTop: "2rem" }}>
        {!submitted ? (
          <Button
            variant="success"
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
