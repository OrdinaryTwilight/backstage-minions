import { useNavigate, useParams } from "react-router-dom";
import NavBar from "../components/NavBar";
import { useGame } from "../context/GameContext";
import { PRODUCTIONS, VENUES } from "../data/gameData";

const DIFF_LABELS = {
  school: "School 🏫",
  community: "Community 🏛️",
  professional: "Professional ✨",
};

export default function ProductionsPage() {
  const { productionId } = useParams();
  const navigate = useNavigate();
  const { state } = useGame();

  const production = PRODUCTIONS.find((p) => p.id === productionId);

  if (!production) {
    return (
      <div className="page-container">
        <NavBar />
        <div
          className="surface-panel"
          style={{ textAlign: "center", marginTop: "2rem" }}
        >
          <h1>❌ Production Not Found</h1>
          <button
            onClick={() => navigate("/productions")}
            className="action-button btn-accent"
            style={{ marginTop: "1rem" }}
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <NavBar />
      <div className="surface-panel">
        <button
          onClick={() => navigate("/productions")}
          className="action-button"
          style={{
            marginBottom: "1.5rem",
            background: "transparent",
            color: "white",
            padding: 0,
          }}
        >
          ← Back to Productions
        </button>

        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <div style={{ fontSize: "4rem", marginBottom: "1rem" }}>
            {production.poster}
          </div>
          <h1 style={{ fontSize: "1.5rem", margin: "0 0 0.5rem 0" }}>
            {production.title}
          </h1>
          <p style={{ lineHeight: "1.6", color: "var(--text-muted)" }}>
            {production.description}
          </p>
          <a
            href={production.learnMoreUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: "#4ade80",
              textDecoration: "underline",
              fontSize: "0.9rem",
            }}
          >
            Learn more about this production ↗
          </a>
        </div>

        <h2 style={{ marginBottom: "1rem", textAlign: "center" }}>
          Select Difficulty
        </h2>

        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {Object.entries(production.levels).map(([diff, lvl]) => {
            const prog = state?.progress?.[`${productionId}_${diff}`];
            const venue = VENUES[lvl.venueId];
            const isLocked = !lvl.unlocked;

            return (
              <button
                key={diff}
                onClick={() =>
                  !isLocked &&
                  navigate(`/productions/${productionId}/difficulty/${diff}`)
                }
                disabled={isLocked}
                className={`action-button ${isLocked ? "" : "btn-success"}`}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "0.5rem",
                  opacity: isLocked ? 0.5 : 1,
                  cursor: isLocked ? "not-allowed" : "pointer",
                  background: isLocked ? "var(--surface1)" : undefined,
                  border: isLocked ? "2px solid var(--border)" : undefined,
                  color: isLocked ? "var(--text-muted)" : "#000",
                }}
              >
                <div style={{ fontSize: "1.1rem" }}>{DIFF_LABELS[diff]}</div>
                <div style={{ fontSize: "0.8rem", opacity: 0.8 }}>
                  📍 {venue.name}
                </div>
                <div style={{ fontSize: "0.8rem", fontWeight: "normal" }}>
                  {prog?.completed
                    ? "✓ Completed"
                    : lvl.unlocked
                      ? "▶ Play"
                      : "🔒 Locked"}
                </div>
                {prog?.completed && (
                  <div style={{ fontSize: "1rem", color: "#fbbf24" }}>
                    {"★".repeat(prog.stars || 0)}
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
