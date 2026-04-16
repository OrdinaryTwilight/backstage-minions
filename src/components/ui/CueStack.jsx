export default function CueStack({
  cues,
  cueResults,
  nextCue,
  elapsed,
  duration,
  department,
}) {
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
