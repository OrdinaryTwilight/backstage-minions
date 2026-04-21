import { useNavigate, useParams } from "react-router-dom";
import NavBar from "../components/ui/NavBar";
import { useGame } from "../context/GameContext";
import { PRODUCTIONS } from "../data/gameData";

export default function ProductionsPage() {
  const { productionId } = useParams();
  const navigate = useNavigate();
  const { state } = useGame();

  const production = PRODUCTIONS.find((p) => p.id === productionId);

  if (!production) {
    return <div className="page-container">Production not found.</div>;
  }

  const availableLevels = ["school", "community", "professional"] as const;

  const handleSelectLevel = (levelKey: string) => {
    sessionStorage.removeItem("minion_inventory");
    sessionStorage.removeItem("minion_completed_quests");
    sessionStorage.removeItem("minion_active_quests");
    navigate(`/productions/${productionId}/difficulty/${levelKey}/character`);
  };

  return (
    <div
      className="page-container animate-fade-in"
      style={{ paddingTop: "1rem" }}
    >
      <NavBar />

      <section
        style={{
          display: "flex",
          justifyContent: "center",
          padding: "2rem 1rem",
        }}
        aria-label="Production details and level selection"
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
          <button
            type="button"
            onClick={() => navigate("/productions")}
            aria-label="Close playbill and return to productions list"
            style={{
              position: "absolute",
              top: "1rem",
              right: "1rem",
              background: "transparent",
              border: "none",
              color: "var(--color-pencil-light)",
              fontSize: "2rem",
              cursor: "pointer",
              zIndex: 10,
            }}
          >
            ×
          </button>

          {["top-left", "top-right", "bottom-left", "bottom-right"].map(
            (pos) => {
              const baseStyle: React.CSSProperties = {
                position: "absolute",
                width: "20px",
                height: "20px",
              };

              const styles: Record<string, React.CSSProperties> = {
                "top-left": {
                  top: "10px",
                  left: "10px",
                  borderTop: "2px solid var(--bui-fg-warning)",
                  borderLeft: "2px solid var(--bui-fg-warning)",
                },
                "top-right": {
                  top: "10px",
                  right: "10px",
                  borderTop: "2px solid var(--bui-fg-warning)",
                  borderRight: "2px solid var(--bui-fg-warning)",
                },
                "bottom-left": {
                  bottom: "10px",
                  left: "10px",
                  borderBottom: "2px solid var(--bui-fg-warning)",
                  borderLeft: "2px solid var(--bui-fg-warning)",
                },
                "bottom-right": {
                  bottom: "10px",
                  right: "10px",
                  borderBottom: "2px solid var(--bui-fg-warning)",
                  borderRight: "2px solid var(--bui-fg-warning)",
                },
              };

              return <div key={pos} style={{ ...baseStyle, ...styles[pos] }} />;
            },
          )}

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

            <nav
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "1rem",
              }}
              aria-label="Level selection"
            >
              {availableLevels.map((levelKey) => {
                const levelData = production.levels[levelKey];
                const isUnlocked = !!levelData;

                const stars =
                  state.progress?.[`${productionId}_${levelKey}`]?.stars || 0;

                return (
                  <button
                    key={levelKey}
                    type="button"
                    disabled={!isUnlocked}
                    onClick={() => handleSelectLevel(levelKey)}
                    aria-disabled={!isUnlocked}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: "1.25rem",
                      background: "rgba(0, 0, 0, 0.3)",
                      border: `1px solid ${
                        isUnlocked
                          ? "var(--bui-border)"
                          : "rgba(255,255,255,0.1)"
                      }`,
                      borderRadius: "8px",
                      opacity: isUnlocked ? 1 : 0.5,
                      cursor: isUnlocked ? "pointer" : "not-allowed",
                      transition: "all 0.2s ease",
                      textAlign: "left",
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
                        {stars > 0 && (
                          <span
                            style={{
                              marginLeft: "1rem",
                              color: "var(--bui-fg-warning)",
                              textShadow: "0 0 5px rgba(251, 191, 36, 0.5)",
                              letterSpacing: "4px",
                            }}
                          >
                            {Array.from({ length: stars })
                              .map(() => "★")
                              .join("")}
                          </span>
                        )}
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
                      <span
                        aria-hidden="true"
                        style={{
                          fontFamily: "var(--font-sketch)",
                          color: "var(--bui-fg-warning)",
                        }}
                      >
                        Apply →
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>
      </section>
    </div>
  );
}
