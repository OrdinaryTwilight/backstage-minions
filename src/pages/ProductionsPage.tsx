import { useNavigate, useParams } from "react-router-dom";
import NavBar from "../components/shared/layout/NavBar";
import Button from "../components/shared/ui/Button";
import DifficultyPill from "../components/shared/ui/DifficultyPill";
import { useGame } from "../context/GameContext";
import { PRODUCTIONS, VENUES } from "../data/gameData";

// Helper array to easily check the preceding difficulty tier
const DIFFICULTY_ORDER = ["school", "community", "professional"];

// FIX: Extracted map to resolve the nested ternary linting error
const ACT_MAP: Record<string, string> = {
  school: "I",
  community: "II",
  professional: "III",
};

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
            <div style={{ display: "flex", flexDirection: "column" }}>
              {Object.entries(production.levels || {}).map(([diff, lvl]) => {
                const prog = state?.progress?.[`${productionId}_${diff}`];
                const venue = VENUES[lvl.venueId];

                // --- NEW DYNAMIC UNLOCK LOGIC ---
                const diffIndex = DIFFICULTY_ORDER.indexOf(diff);
                const prevDiff =
                  diffIndex > 0 ? DIFFICULTY_ORDER[diffIndex - 1] : null;
                const prevProg = prevDiff
                  ? state?.progress?.[`${productionId}_${prevDiff}`]
                  : null;

                // FIX: Explicitly cast to boolean to fix the TS 'boolean | undefined' error
                const isUnlocked = Boolean(
                  lvl.unlocked || prog?.completed || prevProg?.completed,
                );

                // Fetch the mapped Act number
                const actNumber = ACT_MAP[diff] || "I";

                return (
                  <button
                    key={diff}
                    className="playbill-act-item"
                    style={{
                      opacity: isUnlocked ? 1 : 0.5,
                      cursor: isUnlocked ? "pointer" : "not-allowed",
                      padding: "1.5rem",
                      borderBottom: "1px solid #eaeaea",
                      background: "none",
                      border: "none",
                      width: "100%",
                      textAlign: "left",
                    }}
                    disabled={!isUnlocked}
                    onClick={() => {
                      if (isUnlocked) {
                        navigate(
                          `/productions/${productionId}/difficulty/${diff}`,
                        );
                      }
                    }}
                  >
                    <div>
                      <h3
                        style={{
                          fontSize: "1.4rem",
                          fontWeight: "bold",
                          textTransform: "uppercase",
                        }}
                      >
                        ACT {actNumber}: {diff}
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

                      {isUnlocked ? (
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
                      ) : (
                        <p
                          style={{
                            fontSize: "0.9rem",
                            color: "var(--bui-fg-danger)",
                            marginTop: "4px",
                            fontWeight: "bold",
                          }}
                        >
                          🔒 Clear Act {diffIndex} ({prevDiff}) to unlock.
                        </p>
                      )}
                    </div>

                    <div style={{ alignSelf: "center" }}>
                      <DifficultyPill
                        label={isUnlocked ? "Ready" : "Locked"}
                        stars={prog?.stars || 0}
                        unlocked={isUnlocked}
                      />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
