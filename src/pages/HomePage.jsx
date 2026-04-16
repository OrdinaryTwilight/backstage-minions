import { useNavigate } from "react-router-dom";
import NavBar from "../components/NavBar";
import { useGame } from "../context/GameContext";
import { PRODUCTIONS } from "../data/gameData";

function Stars({ n }) {
  return (
    <div>
      {Array.from({ length: n }).map((_, i) => (
        <span key={i}>★</span>
      ))}
    </div>
  );
}

export default function HomePage() {
  const navigate = useNavigate();
  const { state } = useGame();

  const todos = [];
  PRODUCTIONS.forEach((p) => {
    const hasAny = Object.keys(p.levels).some(
      (d) => state.progress[`${p.id}_${d}`]?.completed,
    );
    if (!hasAny)
      todos.push({
        text: `Play your first level in "${p.title}"`,
        cta: () => navigate(`/productions/${p.id}`),
      });
  });
  if (state.unlockedStories.length === 0)
    todos.push({
      text: "Unlock your first Story by completing a level",
      cta: null,
    });

  return (
    <>
      <NavBar />
      <div className="game-window">
        <div className="vn-panel">
          <h1>🎬 Backstage Minions</h1>
          <p style={{ textAlign: "center", marginBottom: "2rem" }}>
            Technical theatre simulation
          </p>

          {todos.length > 0 && (
            <section style={{ marginBottom: "2rem" }}>
              <h2>📋 To-Do</h2>
              {todos.map((t, i) => (
                <div
                  key={i}
                  style={{
                    marginBottom: "1rem",
                    padding: "1rem",
                    background: "var(--surface2)",
                    border: "3px solid var(--border)",
                    borderRadius: "0",
                  }}
                >
                  <p style={{ marginBottom: "0.5rem" }}>{t.text}</p>
                  {t.cta && (
                    <button className="btn btn-primary" onClick={t.cta}>
                      ▶ Go!
                    </button>
                  )}
                </div>
              ))}
            </section>
          )}

          <h2>Your progress</h2>
          {PRODUCTIONS.map((p) => (
            <div
              key={p.id}
              onClick={() => navigate(`/productions/${p.id}`)}
              style={{
                cursor: "pointer",
                padding: "1rem",
                background: "var(--surface2)",
                border: "3px solid var(--border2)",
                marginBottom: "0.75rem",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                boxShadow: "4px 4px 0 var(--shadow)",
                transition: "all 0.1s",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.boxShadow = "2px 2px 0 var(--shadow)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.boxShadow = "4px 4px 0 var(--shadow)")
              }
            >
              <div>
                {p.poster} {p.title}
                <div>
                  {Object.entries(p.levels).map(([diff]) => {
                    const prog = state.progress[`${p.id}_${diff}`];
                    return (
                      <div
                        key={diff}
                        style={{ fontSize: "0.5rem", marginTop: "0.25rem" }}
                      >
                        {diff[0].toUpperCase()}{" "}
                        <Stars n={prog?.completed ? 3 : 0} />
                      </div>
                    );
                  })}
                </div>
              </div>
              ›
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
