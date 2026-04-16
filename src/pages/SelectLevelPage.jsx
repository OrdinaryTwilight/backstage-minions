import { useNavigate, useParams } from "react-router-dom";
import NavBar from "../components/NavBar";
import { useGame } from "../context/GameContext";
import { PRODUCTIONS, VENUES } from "../data/gameData";

const DIFF_LABELS = {
  school: "School 🏫",
  community: "Community 🏛️",
  professional: "Professional ✨",
};
const LIVES = { school: 4, community: 3, professional: 2 };

function Stars({ n }) {
  return (
    <div style={{ color: "#fbbf24", fontSize: "1.2rem", marginTop: "0.5rem" }}>
      {Array.from({ length: 3 }).map((_, i) => (
        <span key={i} style={{ opacity: i < n ? 1 : 0.3 }}>
          ★
        </span>
      ))}
    </div>
  );
}

export default function SelectLevelPage() {
  const { productionId } = useParams();
  const navigate = useNavigate();
  const { state } = useGame();

  const production = PRODUCTIONS.find((p) => p.id === productionId);
  if (!production)
    return <div className="page-container">Production not found.</div>;

  return (
    <div className="page-container">
      <NavBar />
      <button
        onClick={() => navigate(`/productions/${productionId}`)}
        className="action-button"
        style={{
          marginBottom: "1rem",
          background: "transparent",
          color: "white",
          padding: 0,
        }}
      >
        ← Back
      </button>

      <h1 style={{ marginBottom: "0.5rem", fontSize: "1.5rem" }}>
        {production.poster} {production.title}
      </h1>
      <p style={{ color: "var(--text-muted)", marginBottom: "2rem" }}>
        Select your difficulty.
      </p>

      {Object.entries(production.levels).map(([diff, lvl]) => {
        const prog = state?.progress?.[`${productionId}_${diff}`];
        const venue = VENUES[lvl.venueId];
        const debut = !prog?.completed;

        return (
          <div
            key={diff}
            className="surface-panel"
            style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
              }}
            >
              <div>
                <h3 style={{ margin: "0 0 0.25rem 0" }}>
                  {DIFF_LABELS[diff]}{" "}
                  {debut && lvl.unlocked && (
                    <span
                      style={{ color: "var(--accent)", fontSize: "0.8rem" }}
                    >
                      ✦ Debut!
                    </span>
                  )}
                </h3>
                <div
                  style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}
                >
                  {venue.name}
                </div>
              </div>
              <Stars n={prog?.completed ? prog.stars || 3 : 0} />
            </div>

            <p style={{ fontSize: "0.85rem", margin: "0.5rem 0" }}>
              {venue.description}
            </p>
            <div style={{ fontSize: "0.9rem", marginBottom: "1rem" }}>
              ❤️ Lives: {LIVES[diff]}
            </div>

            <button
              onClick={() =>
                navigate(
                  `/productions/${productionId}/difficulty/${diff}/character`,
                )
              }
              className="action-button btn-success"
              style={{ width: "100%" }}
            >
              {prog?.completed ? "Play again" : "Start"}
            </button>
          </div>
        );
      })}
    </div>
  );
}
