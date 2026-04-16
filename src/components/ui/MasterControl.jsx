export default function MasterControl({ lives, active, done, onGo }) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        background: "#1a1a1a",
        padding: "1.5rem",
        borderRadius: "8px",
        border: "1px solid #222",
        height: "100%",
      }}
    >
      <div style={{ textAlign: "center", marginBottom: "2rem" }}>
        <div
          style={{ fontSize: "0.8rem", color: "#666", marginBottom: "0.5rem" }}
        >
          SYSTEM LIVES
        </div>
        <div style={{ fontSize: "2rem", letterSpacing: "5px" }}>
          {Array.from({ length: lives }).map((_, i) => (
            <span key={i}>❤️</span>
          ))}
        </div>
      </div>

      <button
        className="btn-master-go"
        onMouseDown={onGo}
        onTouchStart={onGo}
        disabled={done || (!active && done)}
      >
        {active ? "GO" : "START"}
      </button>

      <div
        style={{
          textAlign: "center",
          marginTop: "1rem",
          color: "#555",
          fontSize: "0.8rem",
          fontWeight: "bold",
        }}
      >
        MASTER PLAYBACK
      </div>
    </div>
  );
}
