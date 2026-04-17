import { memo } from "react";
import { Cue } from "../../data/gameData";

interface CueStackProps {
  cues: Cue[];
  cueResults?: Record<string, { hit: boolean }>;
  elapsed?: number;
  duration?: number;
  department?: string;
  currentIndex?: number; // Ensure this is received from parent
}

function CueStackComponent({
  cues = [],
  cueResults = {},
  elapsed = 0,
  duration = 30000,
  department,
  currentIndex = 0,
}: CueStackProps) {
  const progress = Math.min((elapsed / duration) * 100, 100);

  return (
    <div className="console-screen" style={{ marginBottom: "1.5rem" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          borderBottom: "2px solid #333",
          paddingBottom: "0.5rem",
          marginBottom: "1rem",
        }}
      >
        <span>CUE STACK — {department?.toUpperCase() || "DEPT"}</span>
        <span>SHOW T: {(elapsed / 1000).toFixed(1)}s</span>
      </div>

      {/* Progress Bar with Cue Markers */}
      <div
        style={{
          height: "4px",
          background: "#111",
          marginBottom: "1.5rem",
          position: "relative",
        }}
      >
        <div
          style={{
            width: `${progress}%`,
            height: "100%",
            background: "#38bdf8",
            transition: "width 0.1s linear"
          }}
        />
        {cues.map((c) => (
          <div
            key={`marker-${c.id}`}
            style={{
              position: "absolute",
              left: `${(c.targetMs / duration) * 100}%`,
              top: "-4px",
              height: "12px",
              width: "2px",
              background: "#facc15",
            }}
          />
        ))}
      </div>

      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.9rem" }}>
        <thead>
          <tr style={{ color: "#666", textAlign: "left", borderBottom: "1px solid #222" }}>
            <th style={{ padding: "0.5rem 0" }}>CUE</th>
            <th>LABEL</th>
            <th>TARGET</th>
            <th style={{ textAlign: "right" }}>STATUS</th>
          </tr>
        </thead>
        <tbody>
          {cues.map((cue, idx) => {
            // FIX 1: Use 'cue' (the map variable), not 'c'
            const result = cueResults[cue.id];
            
            // FIX 2: Use 'currentIndex' (passed from props) to determine the active row
            const isCurrent = currentIndex === idx;

            return (
              <tr
                key={cue.id}
                style={{
                  background: isCurrent ? "rgba(56, 189, 248, 0.15)" : "transparent",
                  color: isCurrent ? "#fff" : result ? "#666" : "inherit",
                  borderBottom: "1px solid #111",
                  transition: "background 0.3s ease"
                }}
              >
                <td style={{ padding: "0.75rem 0", fontWeight: "bold" }}>
                  {cue.id}
                </td>
                <td>{cue.label}</td>
                <td>{(cue.targetMs / 1000).toFixed(1)}s</td>
                <td style={{ textAlign: "right", fontWeight: "bold" }}>
                  {result ? (
                    result.hit ? (
                      <span style={{ color: "#4ade80" }}>DONE</span>
                    ) : (
                      <span style={{ color: "#ef4444" }}>FAIL</span>
                    )
                  ) : isCurrent ? (
                    <span className="animate-flicker" style={{ color: "var(--bui-fg-warning)" }}>
                      STANDBY
                    </span>
                  ) : (
                    "-"
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

/**
 * Custom Memo Comparison
 * This prevents the table from re-rendering 60 times per second during the timer
 * unless a cue is actually hit or the department changes.
 */
const CueStack = memo(CueStackComponent, (prev, next) => {
  return (
    prev.elapsed === next.elapsed &&
    prev.currentIndex === next.currentIndex &&
    prev.department === next.department &&
    JSON.stringify(prev.cueResults) === JSON.stringify(next.cueResults) &&
    prev.cues.length === next.cues.length
  );
});

CueStack.displayName = "CueStack";
export default CueStack;