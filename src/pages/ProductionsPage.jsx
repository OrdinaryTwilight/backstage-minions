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
      <>
        <NavBar />
        <div className="game-window">
          <div className="vn-panel">
            <h1>❌ Production Not Found</h1>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <NavBar />
      <div className="game-window">
        <div className="vn-panel">
          <button
            onClick={() => navigate("/productions")}
            className="btn btn-secondary"
            style={{ marginBottom: "1.5rem" }}
          >
            ← Back to Productions
          </button>

          <div style={{ textAlign: "center", marginBottom: "2rem" }}>
            <div style={{ fontSize: "4rem", marginBottom: "1rem" }}>
              {production.poster}
            </div>
            <h1 style={{ fontSize: "1.1rem" }}>{production.title}</h1>
          </div>

          <p
            style={{
              textAlign: "center",
              marginBottom: "1.5rem",
              lineHeight: "2.2",
            }}
          >
            {production.description}
          </p>

          <a
            href={production.learnMoreUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "inline-block",
              marginBottom: "2rem",
              color: "var(--accent2)",
              textDecoration: "underline",
              fontSize: "0.55rem",
            }}
          >
            Learn more about this production ↗
          </a>

          <h2 style={{ marginBottom: "1rem" }}>Select Difficulty</h2>

          <div
            style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
          >
            {Object.entries(production.levels).map(([diff, lvl]) => {
              const prog = state.progress[`${productionId}_${diff}`];
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
                  className="btn btn-primary"
                  style={{
                    padding: "1rem",
                    minHeight: "80px",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "0.5rem",
                    fontSize: "0.65rem",
                    opacity: isLocked ? 0.5 : 1,
                    cursor: isLocked ? "not-allowed" : "pointer",
                  }}
                >
                  <div>{DIFF_LABELS[diff]}</div>
                  <div
                    style={{ fontSize: "0.5rem", color: "var(--text-muted)" }}
                  >
                    {prog?.completed
                      ? "✓ Completed"
                      : lvl.unlocked
                        ? "▶ Play"
                        : "🔒 Locked"}
                  </div>
                  {prog?.completed && (
                    <div style={{ fontSize: "0.55rem" }}>
                      {"★".repeat(prog.stars || 0)}
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}
