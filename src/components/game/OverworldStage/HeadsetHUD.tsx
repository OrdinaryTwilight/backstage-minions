interface HeadsetHUDProps {
  headsetOn: boolean;
  setHeadsetOn: (val: boolean) => void;
  commsLog: { id: number; speaker: string; text: string }[];
}

export default function HeadsetHUD({
  headsetOn,
  setHeadsetOn,
  commsLog,
}: HeadsetHUDProps) {
  return (
    <div
      style={{
        width: "250px",
        display: "flex",
        flexDirection: "column",
        gap: "10px",
        flexShrink: 0,
      }}
    >
      <button
        onClick={(e) => {
          e.stopPropagation();
          setHeadsetOn(!headsetOn);
        }}
        style={{
          background: headsetOn ? "var(--bui-fg-success)" : "#555",
          color: "#000",
          border: "2px solid #fff",
          borderRadius: "8px",
          padding: "10px",
          cursor: "pointer",
          fontWeight: "bold",
          boxShadow: "0 4px 6px rgba(0,0,0,0.5)",
        }}
      >
        🎧 {headsetOn ? "COMMS LIVE" : "COMMS MUTED"}
      </button>

      {headsetOn && (
        <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
          {commsLog.map((log) => (
            <div
              key={log.id}
              style={{
                background: "rgba(0,0,0,0.7)",
                borderLeft: "3px solid var(--bui-fg-info)",
                padding: "8px",
                color: "#fff",
                fontSize: "0.8rem",
                borderRadius: "4px",
                animation: "slide-up-fade 0.3s ease-out",
              }}
            >
              <strong style={{ color: "var(--bui-fg-info)" }}>
                [{log.speaker}]:
              </strong>{" "}
              {log.text}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
