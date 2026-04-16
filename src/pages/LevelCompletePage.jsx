import { useLocation, useNavigate } from "react-router-dom";
import { STORIES } from "../data/gameData";

export default function LevelCompletePage() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const stars = state?.stars ?? 1;
  const newStories = state?.newStories ?? [];

  return (
    <>
      <h1>🎉 Level Complete!</h1>
      <div style={{ marginBottom: "1.5rem", fontSize: "1.5rem" }}>
        {[1, 2, 3].map((i) => (
          <span key={i} style={{ opacity: i <= stars ? 1 : 0.3 }}>
            ★
          </span>
        ))}
      </div>

      {newStories.length > 0 && (
        <div
          style={{
            marginBottom: "1.5rem",
            padding: "1rem",
            background: "var(--surface2)",
            borderRadius: "8px",
          }}
        >
          <h2>📖 New stories unlocked!</h2>
          {newStories.map((id) => {
            const s = STORIES.find((st) => st.id === id);
            return s ? <div key={id}>✦ {s.title}</div> : null;
          })}
        </div>
      )}

      <button
        onClick={() => navigate("/productions")}
        style={{
          cursor: "pointer",
          padding: "0.75rem 1.5rem",
          marginRight: "1rem",
        }}
      >
        Back to productions
      </button>
      {newStories.length > 0 && (
        <button
          onClick={() => navigate("/stories")}
          style={{ cursor: "pointer", padding: "0.75rem 1.5rem" }}
        >
          Read new stories →
        </button>
      )}
    </>
  );
}
