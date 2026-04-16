import { useLocation, useNavigate } from "react-router-dom";
import { STORIES } from "../data/gameData";

export default function LevelCompletePage() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const stars = state?.stars ?? 1;
  const newStories = state?.newStories ?? [];

  return (
    <div
      className="page-container"
      style={{ textAlign: "center", paddingTop: "4rem" }}
    >
      <h1 style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>🎉 Complete!</h1>

      <div
        style={{ marginBottom: "2.5rem", fontSize: "3rem", color: "#fbbf24" }}
      >
        {[1, 2, 3].map((i) => (
          <span key={i} style={{ opacity: i <= stars ? 1 : 0.3 }}>
            ★
          </span>
        ))}
      </div>

      {newStories.length > 0 && (
        <div
          className="surface-panel"
          style={{ textAlign: "left", marginBottom: "2rem" }}
        >
          <h2
            style={{
              fontSize: "1.1rem",
              marginBottom: "1rem",
              color: "var(--accent)",
            }}
          >
            📖 New stories unlocked!
          </h2>
          {newStories.map((id) => {
            const s = STORIES.find((st) => st.id === id);
            return s ? (
              <div key={id} style={{ marginBottom: "0.5rem" }}>
                ✦ {s.title}
              </div>
            ) : null;
          })}
        </div>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        {newStories.length > 0 && (
          <button
            onClick={() => navigate("/stories")}
            className="action-button btn-accent"
          >
            Read new stories →
          </button>
        )}
        <button
          onClick={() => navigate("/productions")}
          className="action-button"
          style={{ background: "var(--surface2)", color: "white" }}
        >
          Back to productions
        </button>
      </div>
    </div>
  );
}
