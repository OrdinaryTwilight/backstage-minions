import HardwarePanel from "./HardwarePanel";

interface FaderTrackProps {
  label: string;
  color: string;
  onLevelChange: (level: number) => void;
  currentLevel: number;
  masterLevel: number;
  targetLevel?: number;
  isMaster?: boolean;
  isMobile?: boolean;
}

function FaderTrack({
  label,
  color,
  onLevelChange,
  currentLevel,
  masterLevel,
  targetLevel = 80,
  isMaster = false,
  isMobile = false,
}: Readonly<FaderTrackProps>) {
  // UX FIX: Calculate exactly what output is hitting the console based on the Master throttle
  const effectiveLevel = isMaster
    ? currentLevel
    : Math.round(currentLevel * (masterLevel / 100));

  const target = isMaster ? 100 : targetLevel;
  const margin = 10;
  const isAcceptable = Math.abs(effectiveLevel - target) <= margin;

  let barColor = "#eab308";
  if (isAcceptable) {
    barColor = "#22c55e";
  } else if (effectiveLevel > target) {
    barColor = "#ef4444";
  }

  const trackHeight = isMobile ? 140 : 220;
  const containerHeight = isMobile ? 220 : 350;
  const faderWidth = isMobile ? 45 : 70;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        width: `${faderWidth}px`,
        height: `${containerHeight}px`,
        gap: isMobile ? "6px" : "12px",
        padding: "10px 0",
        background: "rgba(0,0,0,0.2)",
        borderRadius: "4px",
        border: "1px solid var(--glass-border)",
      }}
    >
      <meter
        min={0}
        max={100}
        value={effectiveLevel}
        aria-label={`${label} signal level`}
        style={{
          position: "absolute",
          width: "1px",
          height: "1px",
          padding: 0,
          margin: "-1px",
          overflow: "hidden",
          clip: "rect(0,0,0,0)",
          whiteSpace: "nowrap",
          border: 0,
        }}
      />

      <div
        style={{
          width: "8px",
          height: isMobile ? "30px" : "50px",
          background: "#000",
          border: "1px solid #333",
          position: "relative",
        }}
        aria-hidden="true"
      >
        <div
          style={{
            position: "absolute",
            bottom: 0,
            width: "100%",
            height: `${effectiveLevel}%`,
            background: barColor,
            transition: "height 0.1s ease, background 0.2s ease",
          }}
        />
      </div>

      <div
        style={{
          position: "relative",
          height: `${trackHeight}px`,
          width: "6px",
          background: "#111",
          border: "1px solid #444",
          borderRadius: "3px",
        }}
      >
        <input
          type="range"
          min="0"
          max="100"
          value={currentLevel}
          aria-label={`${label} fader`}
          onChange={(e) => onLevelChange(Number.parseInt(e.target.value))}
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            width: `${trackHeight}px`,
            transform: "translate(-50%, -50%) rotate(-90deg)",
            cursor: "ns-resize",
            appearance: "none",
            background: "transparent",
            zIndex: 10,
            touchAction: "none",
            WebkitUserSelect: "none",
            userSelect: "none",
          }}
          onTouchStart={(e) => e.stopPropagation()}
        />
        <div
          style={{
            position: "absolute",
            left: "50%",
            bottom: `${currentLevel}%`,
            width: isMobile ? "24px" : "30px",
            height: isMobile ? "24px" : "40px",
            background: "#444",
            border: "2px solid #666",
            borderRadius: "3px",
            transform: "translate(-50%, 50%)",
            pointerEvents: "none",
            boxShadow: "0 4px 8px rgba(0,0,0,0.5)",
          }}
        />
      </div>

      {/* UX FIX: Display Output to clarify multiplication math */}
      {!isMaster && (
        <div
          style={{
            fontSize: "0.6rem",
            fontFamily: "var(--font-mono)",
            color: "var(--bui-fg-success)",
            background: "rgba(0,0,0,0.6)",
            padding: "2px 4px",
            borderRadius: "2px",
            marginTop: "-4px",
          }}
        >
          OUT: {effectiveLevel}
        </div>
      )}

      <span
        className="annotation-text"
        style={{
          fontSize: isMobile ? "0.55rem" : "0.65rem",
          color,
          textAlign: "center",
        }}
      >
        {label}
      </span>
    </div>
  );
}

interface DepartmentMixerProps {
  department?: string;
  levels: number[];
  setLevels: (levels: number[]) => void;
  targetLevel?: number;
  isMobile?: boolean;
}

export default function DepartmentMixer({
  department,
  levels,
  setLevels,
  targetLevel,
  isMobile = false,
}: Readonly<DepartmentMixerProps>) {
  const channels =
    department === "lighting"
      ? ["WASH", "CYC", "SPOT", "KEYS"]
      : ["VOX", "PIT", "SFX", "BAND"];

  return (
    <HardwarePanel
      style={{
        display: "flex",
        justifyContent: "space-around",
        padding: isMobile ? "15px 5px" : "25px 15px",
        background: "linear-gradient(180deg, #151515, #0a0a0a)",
        borderTop: "4px solid var(--color-architect-blue)",
      }}
    >
      {channels.map((ch, i) => (
        <FaderTrack
          key={ch}
          label={ch}
          color="var(--color-architect-blue)"
          currentLevel={levels[i]}
          masterLevel={levels[4]}
          targetLevel={targetLevel}
          isMobile={isMobile}
          onLevelChange={(val) => {
            const newLevels = [...levels];
            newLevels[i] = val;
            setLevels(newLevels);
          }}
        />
      ))}
      <div
        style={{
          borderLeft: "1px solid #333",
          paddingLeft: isMobile ? "5px" : "15px",
        }}
      >
        <FaderTrack
          label="MASTER"
          color="var(--bui-fg-success)"
          currentLevel={levels[4]}
          masterLevel={levels[4]}
          isMaster={true}
          isMobile={isMobile}
          onLevelChange={(val) => {
            const newLevels = [...levels];
            newLevels[4] = val;
            setLevels(newLevels);
          }}
        />
      </div>
    </HardwarePanel>
  );
}
