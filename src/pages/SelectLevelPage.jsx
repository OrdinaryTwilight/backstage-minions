import { useNavigate, useParams } from "react-router-dom";
import NavBar from "../components/NavBar";
import DifficultyPill from "../components/ui/DifficultyPill";
import { useGame } from "../context/GameContext";
import { PRODUCTIONS } from "../data/gameData";

export default function SelectLevelPage() {
  const { productionId } = useParams();
  const navigate = useNavigate();
  const { state } = useGame();

  const production = PRODUCTIONS.find((p) => p.id === productionId);

  // Fallback for refresh/direct navigation errors
  if (!production) {
    return (
      <div className="page-container hardware-panel">
        <h2 className="annotation-text">Production Not Found</h2>
        <button className="action-button" onClick={() => navigate("/")}>
          Return Home
        </button>
      </div>
    );
  }

  return (
    <div className="page-container">
      <NavBar />

      <header style={{ marginBottom: "2rem" }}>
        <h1
          className="annotation-text"
          style={{ fontSize: "2rem", color: "var(--bui-fg-info)" }}
        >
          {production.poster} {production.title}
        </h1>
        <p className="annotation-text" style={{ opacity: 0.7 }}>
          Select your contract difficulty:
        </p>
      </header>

      <div className="bento-container" style={{ gridTemplateColumns: "1fr" }}>
        {Object.entries(production.levels).map(([diffKey, details]) => {
          const progress = state?.progress?.[`${productionId}_${diffKey}`];
          const isUnlocked = details.unlocked || progress?.completed;

          return (
            <div
              key={diffKey}
              className={`hardware-panel ${isUnlocked ? "clickable" : "locked"}`}
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "1.5rem",
                cursor: isUnlocked ? "pointer" : "not-allowed",
              }}
              onClick={() =>
                isUnlocked &&
                navigate(
                  `/productions/${productionId}/${diffKey}/select-character`,
                )
              }
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                }}
              >
                <div>
                  <h3
                    className="annotation-text"
                    style={{ fontSize: "1.4rem", margin: 0 }}
                  >
                    {diffKey.toUpperCase()} LEVEL
                  </h3>
                  <p
                    style={{
                      fontSize: "0.85rem",
                      opacity: 0.6,
                      marginTop: "4px",
                    }}
                  >
                    Location: {details.venueId.replace("_", " ")}
                  </p>
                </div>
                {/* Unified Star Display using DifficultyPill */}
                <div style={{ minWidth: "120px" }}>
                  <DifficultyPill
                    label="Contract Status"
                    stars={progress?.stars || 0}
                    unlocked={isUnlocked}
                  />
                </div>
              </div>

              {!isUnlocked && (
                <div
                  style={{
                    color: "var(--bui-fg-danger)",
                    fontSize: "0.8rem",
                    fontStyle: "italic",
                  }}
                >
                  * This level is currently locked. Complete the previous tier
                  to unlock.
                </div>
              )}
            </div>
          );
        })}
      </div>

      <button
        className="action-button"
        style={{ marginTop: "2rem", width: "100%" }}
        onClick={() => navigate("/")}
      >
        ‹ Back to Production List
      </button>
    </div>
  );
}
