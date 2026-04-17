import { memo } from "react";
import { Cue } from "../../data/gameData";

interface CueStackProps {
  readonly cues: Cue[];
  readonly currentIndex: number;
  readonly cueResults?: Record<string, { hit: boolean }>;
}

function CueStackComponent({
  cues = [],
  currentIndex,
  cueResults = {},
}: CueStackProps) {
  return (
    <div className="console-screen">
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
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
            <th style={{ textAlign: "right" }}>STATUS</th>
          </tr>
        </thead>
        <tbody>
          {cues.map((cue, idx) => {
            const result = cueResults[cue.id];
            const isCurrent = currentIndex === idx;

            // Determine row-level flash class
            let flashClass = "";
            if (result)
              flashClass = result.hit ? "row-flash-hit" : "row-flash-miss";

            return (
              <tr
                key={cue.id}
                className={flashClass}
                style={{
                  background: isCurrent
                    ? "rgba(56, 189, 248, 0.1)"
                    : "transparent",
                  transition: "background 0.4s ease",
                }}
              >
                <td style={{ padding: "0.75rem 0" }}>{cue.id}</td>
                <td>{cue.label}</td>
                <td style={{ textAlign: "right", fontWeight: "bold" }}>
                  {(() => {
                    if (result) {
                      return (
                        <span
                          style={{
                            color: result.hit
                              ? "var(--bui-fg-success)"
                              : "var(--bui-fg-danger)",
                          }}
                        >
                          {result.hit ? "DONE" : "FAIL"}
                        </span>
                      );
                    }
                    if (isCurrent) {
                      return <span className="animate-flicker">STANDBY</span>;
                    }
                    return "-";
                  })()}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default memo(CueStackComponent);
