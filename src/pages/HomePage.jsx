import { useNavigate } from "react-router-dom";
import NavBar from "../components/NavBar";
import { useGame } from "../context/GameContext";
import { PRODUCTIONS } from "../data/gameData";

function Stars({ n }) {
  return (
    <div style={{ color: "#fbbf24", fontSize: "1rem" }}>
      {Array.from({ length: 3 }).map((_, i) => (
        <span key={i} style={{ opacity: i < n ? 1 : 0.3 }}>
          ★
        </span>
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
      (d) => state?.progress?.[`${p.id}_${d}`]?.completed,
    );
    if (!hasAny)
      todos.push({
        text: `Play your first level in "${p.title}"`,
        cta: () => navigate(`/productions/${p.id}`),
      });
  });

  if (state?.unlockedStories?.length === 0)
    todos.push({
      text: "Unlock your first Story by completing a level",
      cta: null,
    });

  return (
    <div className="page-container">
      <NavBar />

      <h1 style={{ textAlign: "center", marginBottom: "0.5rem" }}>
        🎬 Backstage Minions
      </h1>
      <p
        style={{
          textAlign: "center",
          marginBottom: "2rem",
          color: "var(--text-muted)",
        }}
      >
        Technical theatre simulation
      </p>

      {todos.length > 0 && (
        <section style={{ marginBottom: "2rem" }}>
          <h2>📋 To-Do</h2>
          {todos.map((t, i) => (
            <div
              key={i}
              className="surface-panel"
              style={{ borderLeft: "4px solid var(--accent)" }}
            >
              <p style={{ marginBottom: t.cta ? "1rem" : "0" }}>{t.text}</p>
              {t.cta && (
                <button className="action-button btn-accent" onClick={t.cta}>
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
          className="surface-panel"
          style={{
            cursor: "pointer",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div>
            <strong style={{ fontSize: "1.1rem" }}>
              {p.poster} {p.title}
            </strong>
            <div style={{ marginTop: "0.5rem", display: "flex", gap: "1rem" }}>
              {Object.entries(p.levels).map(([diff]) => {
                const prog = state?.progress?.[`${p.id}_${diff}`];
                return (
                  <div key={diff} style={{ fontSize: "0.75rem" }}>
                    {diff[0].toUpperCase()}
                    <Stars n={prog?.completed ? prog.stars || 0 : 0} />
                  </div>
                );
              })}
            </div>
          </div>
          <span style={{ fontSize: "1.5rem", color: "var(--text-muted)" }}>
            ›
          </span>
        </div>
      ))}
    </div>
  );
}
