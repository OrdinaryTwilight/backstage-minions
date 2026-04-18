// src/pages/ProductionsPage.tsx
import { useNavigate, useParams } from "react-router-dom";
import NavBar from "../components/shared/layout/NavBar";
import Button from "../components/shared/ui/Button";
import { PRODUCTIONS } from "../data/gameData";

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

  const production = PRODUCTIONS.find((p) => p.id === productionId);

  if (!production) {
    return <div className="page-container">Production not found.</div>;
  }

  const availableLevels = ["school", "community", "professional"] as const;

  return (
    <div
      className="page-container animate-fade-in"
      style={{ paddingTop: "1rem" }}
    >
      <NavBar />
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          padding: "2rem 1rem",
        }}
      >
        <div
          className="animate-pop"
          style={{
            background: "rgba(15, 23, 42, 0.95)",
            border: "2px solid var(--bui-fg-info)",
            borderRadius: "var(--radius-md)",
            padding: "clamp(1.5rem, 5vw, 4rem)",
            maxWidth: "700px",
            width: "100%",
            boxShadow: "0 20px 50px rgba(0,0,0,0.6)",
            position: "relative",
          }}
        >
          {/* Blueprint Corner Brackets */}
          <div
            style={{
              position: "absolute",
              top: "10px",
              left: "10px",
              borderTop: "2px solid var(--bui-fg-warning)",
              borderLeft: "2px solid var(--bui-fg-warning)",
              width: "20px",
              height: "20px",
            }}
          />
          <div
            style={{
              position: "absolute",
              top: "10px",
              right: "10px",
              borderTop: "2px solid var(--bui-fg-warning)",
              borderRight: "2px solid var(--bui-fg-warning)",
              width: "20px",
              height: "20px",
            }}
          />
          <div
            style={{
              position: "absolute",
              bottom: "10px",
              left: "10px",
              borderBottom: "2px solid var(--bui-fg-warning)",
              borderLeft: "2px solid var(--bui-fg-warning)",
              width: "20px",
              height: "20px",
            }}
          />
          <div
            style={{
              position: "absolute",
              bottom: "10px",
              right: "10px",
              borderBottom: "2px solid var(--bui-fg-warning)",
              borderRight: "2px solid var(--bui-fg-warning)",
              width: "20px",
              height: "20px",
            }}
          />

          <div style={{ textAlign: "center", marginBottom: "3rem" }}>
            <div style={{ fontSize: "4rem", marginBottom: "1rem" }}>
              {production.poster}
            </div>
            <h2
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "1rem",
                textTransform: "uppercase",
                letterSpacing: "4px",
                color: "var(--color-pencil-light)",
                marginBottom: "0.5rem",
              }}
            >
              Backstage Minions Presents
            </h2>
            <h1
              style={{
                fontFamily: "var(--font-sketch)",
                fontSize: "clamp(2.5rem, 8vw, 4rem)",
                color: "var(--bui-fg-warning)",
                textShadow: "0 0 10px rgba(251, 191, 36, 0.2)",
                margin: "0",
              }}
            >
              {production.title}
            </h1>
            <p
              style={{
                fontSize: "1.1rem",
                color: "var(--text-muted)",
                marginTop: "1.5rem",
                lineHeight: "1.6",
                maxWidth: "90%",
                margin: "1.5rem auto 0",
              }}
            >
              {production.description}
            </p>
          </div>

          <div
            style={{
              borderTop: "1px dashed var(--bui-border)",
              paddingTop: "2rem",
            }}
          >
            <h3
              style={{
                fontFamily: "var(--font-sketch)",
                fontSize: "2rem",
                color: "var(--bui-fg-info)",
                marginBottom: "1.5rem",
                textAlign: "center",
              }}
            >
              Callboard: Select Gig
            </h3>

            <div
              style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
            >
              {availableLevels.map((levelKey) => {
                const levelData = production.levels[levelKey];
                const isUnlocked = !!levelData;

                return (
                  <div
                    key={levelKey}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: "1.25rem",
                      background: "rgba(0, 0, 0, 0.3)",
                      border: `1px solid ${isUnlocked ? "var(--bui-border)" : "rgba(255,255,255,0.1)"}`,
                      borderRadius: "8px",
                      opacity: isUnlocked ? 1 : 0.5,
                      cursor: isUnlocked ? "pointer" : "not-allowed",
                      transition: "all 0.2s ease",
                    }}
                    onClick={() => {
                      if (isUnlocked) {
                        sessionStorage.removeItem("minion_inventory");
                        sessionStorage.removeItem("minion_completed_quests");
                        sessionStorage.removeItem("minion_active_quests");
                        navigate(
                          `/productions/${productionId}/difficulty/${levelKey}/character`,
                        );
                      }
                    }}
                    className={isUnlocked ? "hover-lift" : ""}
                  >
                    <div>
                      <h4
                        style={{
                          fontFamily: "var(--font-sketch)",
                          fontSize: "1.4rem",
                          textTransform: "capitalize",
                          margin: "0 0 0.25rem 0",
                          color: isUnlocked ? "#fff" : "inherit",
                        }}
                      >
                        {levelKey} Theater
                      </h4>
                      <span
                        style={{
                          fontSize: "0.9rem",
                          fontFamily: "var(--font-mono)",
                          color: "var(--color-pencil-light)",
                        }}
                      >
                        {isUnlocked
                          ? "Positions Available"
                          : "Production Locked"}
                      </span>
                    </div>
                    {isUnlocked && (
                      <Button
                        variant="accent"
                        style={{
                          pointerEvents: "none",
                          fontFamily: "var(--font-sketch)",
                        }}
                      >
                        Apply →
                      </Button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
