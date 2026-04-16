import { useNavigate } from "react-router-dom";

export default function LevelFailedPage() {
  const navigate = useNavigate();
  return (
    <div
      className="page-container"
      style={{ textAlign: "center", paddingTop: "4rem" }}
    >
      <h1
        style={{ fontSize: "2.5rem", color: "#ef4444", marginBottom: "1rem" }}
      >
        💔 Show stopped
      </h1>

      <p
        style={{
          color: "var(--text-muted)",
          fontSize: "1.1rem",
          lineHeight: "1.6",
          marginBottom: "3rem",
        }}
      >
        The show couldn't go on this time. Review the cue sheet, brush up on
        your technique, and try again.
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        <button
          onClick={() => navigate("/productions")}
          className="action-button btn-success"
        >
          Try Again
        </button>
        <button
          onClick={() => navigate("/")}
          className="action-button"
          style={{ background: "var(--surface2)", color: "white" }}
        >
          Back to Home
        </button>
      </div>
    </div>
  );
}
