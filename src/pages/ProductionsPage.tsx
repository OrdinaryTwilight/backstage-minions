import { useNavigate, useParams } from "react-router-dom";
import Button from "../components/ui/Button";
import DifficultyPill from "../components/ui/DifficultyPill";
import NavBar from "../components/ui/NavBar";
import { useGame } from "../context/GameContext";
import { PRODUCTIONS, VENUES } from "../data/gameData";

export default function ProductionsPage() {
  const { productionId } = useParams();
  const navigate = useNavigate();
  const { state } = useGame();

  const production = PRODUCTIONS.find((p) => p.id === productionId);

  if (!production)
    return <div className="page-container">Briefing not found.</div>;

  return (
    <div className="page-container">
      <NavBar />

      <Button
        onClick={() => navigate("/productions")}
        style={{
          marginBottom: "2rem",
          minWidth: "auto",
          border: "none",
          background: "transparent",
          color: "var(--bui-fg-info)",
        }}
      >
        ‹ Back to Archives
      </Button>

      {/* --- PLAYBILL DESIGN --- */}
      <div className="playbill-wrapper animate-reveal">
        <div className="playbill-header">PLAYBILL</div>

        <div className="playbill-content">
          <div style={{ fontSize: "6rem", marginBottom: "1rem" }}>
            {production.poster}
          </div>

          <h1 className="playbill-title">{production.title}</h1>
          <p
            style={{
              fontSize: "1.2rem",
              fontStyle: "italic",
              marginBottom: "2rem",
              color: "#444",
            }}
          >
            {production.description}
          </p>

          <a
            href={production.learnMoreUrl}
            target="_blank"
            rel="noreferrer"
            style={{
              display: "inline-block",
              marginBottom: "3rem",
              color: "#000",
              fontWeight: "bold",
            }}
          >
            Read the Director's Note ↗
          </a>

          <div
            style={{
              borderTop: "4px solid #000",
              borderBottom: "4px solid #000",
              padding: "1rem 0",
              marginBottom: "2rem",
            }}
          >
            <h2
              style={{
                fontSize: "1.5rem",
                textTransform: "uppercase",
                letterSpacing: "2px",
              }}
            >
              Select Your Call Time
            </h2>
          </div>

          <div style={{ display: "flex", flexDirection: "column" }}>
            {Object.entries(production.levels).map(([diff, lvl]) => {
              const prog = state?.progress?.[`${productionId}_${diff}`];
              const venue = VENUES[lvl.venueId];
              const isUnlocked = lvl.unlocked || prog?.completed;

              return (
                <div style={{ display: "flex", flexDirection: "column" }}>
                  {Object.entries(production.levels || {}).map(
                    ([diff, lvl]) => {
                      const prog = state?.progress?.[`${productionId}_${diff}`];
                      const venue = VENUES[lvl.venueId];
                      const isUnlocked = lvl.unlocked || prog?.completed;

                      return (
                        <div
                          key={diff}
                          className="playbill-act-item"
                          style={{
                            opacity: isUnlocked ? 1 : 0.5,
                            cursor: isUnlocked ? "pointer" : "not-allowed",
                          }}
                          onClick={() =>
                            isUnlocked &&
                            navigate(
                              `/productions/${productionId}/difficulty/${diff}`,
                            )
                          }
                        >
                          <div>
                            <h3
                              style={{
                                fontSize: "1.4rem",
                                fontWeight: "bold",
                                textTransform: "uppercase",
                              }}
                            >
                              ACT{" "}
                              {diff === "school"
                                ? "I"
                                : diff === "community"
                                  ? "II"
                                  : "III"}
                              : {diff}
                            </h3>
                            <p
                              style={{
                                fontSize: "1.1rem",
                                color: "#222",
                                marginTop: "4px",
                                fontWeight: "bold",
                              }}
                            >
                              📍 {venue?.name || "Unknown Venue"}
                            </p>
                            {/* NEW: Display Venue Description */}
                            <p
                              style={{
                                fontSize: "0.9rem",
                                color: "#666",
                                marginTop: "4px",
                                fontStyle: "italic",
                              }}
                            >
                              {venue?.description}
                            </p>
                          </div>
                          <div>
                            <DifficultyPill
                              label={isUnlocked ? "Ready" : "Locked"}
                              stars={prog?.stars || 0}
                              unlocked={isUnlocked}
                            />
                          </div>
                        </div>
                      );
                    },
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
