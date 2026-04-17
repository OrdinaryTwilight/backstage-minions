import { useState } from "react";
import HardwarePanel from "./HardwarePanel";

/**
 * ChannelStrip: A single fader track for a mixer.
 * Simulates a professional console with VU meters and tactical buttons.
 */
function ChannelStrip({ label, color, initialValue = 80 }) {
  const [value, setValue] = useState(initialValue);
  const [isMuted, setIsMuted] = useState(false);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "8px",
        padding: "10px",
        background: "rgba(0,0,0,0.2)",
        borderRadius: "4px",
        border: "1px solid var(--glass-border)",
      }}
    >
      <div
        className="vu-meter"
        style={{
          width: "8px",
          height: "60px",
          background: "#111",
          position: "relative",
          overflow: "hidden",
          borderRadius: "1px",
        }}
      >
        <div
          style={{
            position: "absolute",
            bottom: 0,
            width: "100%",
            height: `${value}%`,
            background:
              value > 90 ? "var(--bui-fg-danger)" : "var(--bui-fg-success)",
            opacity: 0.8,
            transition: "height 0.1s ease",
          }}
        />
      </div>

      {/* Tactical Fader */}
      <div
        style={{
          position: "relative",
          height: "180px",
          width: "30px",
          background: "linear-gradient(to bottom, #222, #111)",
          borderRadius: "15px",
          border: "1px solid #444",
        }}
      >
        <input
          type="range"
          min="0"
          max="100"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          style={{
            appearance: "none",
            background: "transparent",
            width: "180px",
            height: "30px",
            transform: "rotate(-90deg) translate(-75px, 0)",
            cursor: "ns-resize",
          }}
        />
      </div>

      <div style={{ display: "flex", gap: "4px" }}>
        <button
          onClick={() => setIsMuted(!isMuted)}
          style={{
            fontSize: "0.6rem",
            padding: "4px",
            background: isMuted ? "var(--bui-fg-danger)" : "#333",
            border: "none",
            borderRadius: "2px",
            color: "#fff",
          }}
        >
          MUTE
        </button>
      </div>

      <span className="annotation-text" style={{ fontSize: "0.65rem", color }}>
        {label}
      </span>
    </div>
  );
}

export default function DepartmentMixer({ department, activeCues }) {
  const channels =
    department === "lighting"
      ? ["FOH WASH", "CYC LIGHTS", "MOVERS", "SPECIALS"]
      : ["MICS", "PIT", "SFX", "FOLDBACK"];

  return (
    <HardwarePanel
      style={{
        display: "flex",
        gap: "12px",
        padding: "15px",
        background: "linear-gradient(180deg, #1a1a1a, #0a0a0a)",
        borderTop: "4px solid var(--color-architect-blue)",
      }}
    >
      {channels.map((ch, i) => (
        <ChannelStrip key={i} label={ch} color="var(--color-architect-blue)" />
      ))}

      {/* Master Section */}
      <div
        style={{
          marginLeft: "auto",
          paddingLeft: "15px",
          borderLeft: "1px solid #444",
        }}
      >
        <ChannelStrip
          label="MASTER"
          color="var(--bui-fg-success)"
          initialValue={100}
        />
      </div>
    </HardwarePanel>
  );
}
