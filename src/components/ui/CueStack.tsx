import { memo } from "react";
import { Cue } from "../../data/gameData";

interface CueStackProps {
  cues: Cue[];
  cueResults?: Record<string, string>;
  nextCue?: string;
  elapsed?: number;
  duration?: number;
  department?: string;
  currentIndex?: number;
}

/**
 * CueStack: Displays the active cue list and timing progress
 * Wrapped in React.memo to prevent unnecessary re-renders when parent GameContext updates
 * but cue data hasn't actually changed. This is important since CueExecutionStage
 * updates frequently (every animation frame) from the game timer.
 */
function CueStackComponent({
  cues,
  cueResults,
  nextCue,
  elapsed = 0,
  duration = 30000,
  department,
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

      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          fontSize: "0.9rem",
        }}
      >
        <thead>
          <tr
            style={{
              color: "#666",
              textAlign: "left",
              borderBottom: "1px solid #222",
            }}
          >
            <th style={{ padding: "0.5rem 0" }}>CUE</th>
            <th>LABEL</th>
            <th>TARGET</th>
            <th style={{ textAlign: "right" }}>STATUS</th>
          </tr>
        </thead>
        <tbody>
          {cues.map((c) => {
            const result = cueResults[c.id];
            const isNext = nextCue?.id === c.id;

            return (
              <tr
                key={c.id}
                style={{
                  background: isNext ? "#082f49" : "transparent",
                  color: isNext ? "#fff" : result ? "#666" : "inherit",
                  borderBottom: "1px solid #111",
                }}
              >
                <td style={{ padding: "0.75rem 0", fontWeight: "bold" }}>
                  {c.id}
                </td>
                <td>{c.label}</td>
                <td>{(c.targetMs / 1000).toFixed(1)}s</td>
                <td style={{ textAlign: "right", fontWeight: "bold" }}>
                  {result ? (
                    result.hit ? (
                      <span style={{ color: "#4ade80" }}>DONE</span>
                    ) : (
                      <span style={{ color: "#ef4444" }}>FAIL</span>
                    )
                  ) : isNext ? (
                    "STANDBY"
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

// Export memoized component to prevent unnecessary re-renders
// Custom comparison: deep-equal cues array by length and IDs
const CueStack = memo(CueStackComponent, (prev, next) => {
  // Return true if props are equal (skip re-render)
  // Return false if props differ (allow re-render)
  
  // Check basic props
  if (
    prev.elapsed !== next.elapsed ||
    prev.duration !== next.duration ||
    prev.department !== next.department
  ) {
    return false; // Props differ, re-render
  }

  // Deep compare cues array (by length and element structure)
  if (prev.cues.length !== next.cues.length) {
    return false;
  }
  for (let i = 0; i < prev.cues.length; i++) {
    if (prev.cues[i].id !== next.cues[i].id) {
      return false;
    }
  }

  // Compare cueResults object
  if (JSON.stringify(prev.cueResults) !== JSON.stringify(next.cueResults)) {
    return false;
  }

  // Compare nextCue
  if (prev.nextCue !== next.nextCue) {
    return false;
  }

  return true; // Props are equal, skip re-render
});

CueStack.displayName = "CueStack";

export default CueStack;
