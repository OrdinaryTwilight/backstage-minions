import { useState } from "react";
import NavBar from "../components/NavBar";
import { useGame } from "../context/GameContext";
import { STORIES } from "../data/gameData";

export default function StoriesPage() {
  const { state } = useGame();
  const [selected, setSelected] = useState(null);

  const unlocked = STORIES.filter((s) => state.unlockedStories.includes(s.id));
  const locked = STORIES.filter((s) => !state.unlockedStories.includes(s.id));

  if (selected) {
    return (
      <div className="page-container">
        <NavBar />
        <button
          onClick={() => setSelected(null)}
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

        <div className="surface-panel">
          <h1
            style={{
              fontSize: "1.5rem",
              color: "var(--accent)",
              marginBottom: "1.5rem",
            }}
          >
            {selected.title}
          </h1>
          <div
            style={{
              whiteSpace: "pre-wrap",
              lineHeight: "1.6",
              color: "var(--text-muted)",
            }}
          >
            {selected.content}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <NavBar />
      <h1 style={{ textAlign: "center", marginBottom: "0.5rem" }}>
        📖 Stories
      </h1>
      <p
        style={{
          textAlign: "center",
          color: "var(--text-muted)",
          marginBottom: "2rem",
        }}
      >
        Deep dives into the world of technical theatre. Unlock more by
        completing levels.
      </p>

      {unlocked.length > 0 && (
        <section style={{ marginBottom: "2rem" }}>
          <h2
            style={{
              fontSize: "1.1rem",
              marginBottom: "1rem",
              color: "var(--success)",
            }}
          >
            Unlocked
          </h2>
          {unlocked.map((s) => (
            <div
              key={s.id}
              onClick={() => setSelected(s)}
              className="surface-panel"
              style={{
                cursor: "pointer",
                border: "2px solid transparent",
                transition: "border 0.2s",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.borderColor = "var(--success)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.borderColor = "transparent")
              }
            >
              <h3 style={{ margin: "0 0 0.5rem 0", fontSize: "1.1rem" }}>
                {s.title}
              </h3>
              <p
                style={{
                  color: "var(--text-muted)",
                  fontSize: "0.85rem",
                  margin: 0,
                }}
              >
                {s.content.slice(0, 80)}…
              </p>
            </div>
          ))}
        </section>
      )}

      {locked.length > 0 && (
        <section>
          <h2
            style={{
              fontSize: "1.1rem",
              marginBottom: "1rem",
              color: "var(--text-muted)",
            }}
          >
            Locked
          </h2>
          {locked.map((s) => (
            <div
              key={s.id}
              className="surface-panel"
              style={{ opacity: "0.5" }}
            >
              <h3 style={{ margin: "0 0 0.5rem 0", fontSize: "1rem" }}>
                🔒 {s.title}
              </h3>
              <p
                style={{
                  color: "var(--text-muted)",
                  fontSize: "0.8rem",
                  margin: 0,
                }}
              >
                Complete {s.unlockedBy.difficulty} difficulty in "
                {s.unlockedBy.productionId}" with {s.unlockedBy.minStars}+ stars
              </p>
            </div>
          ))}
        </section>
      )}
    </div>
  );
}
