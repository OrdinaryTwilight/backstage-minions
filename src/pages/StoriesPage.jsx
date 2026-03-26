import { useState } from "react";
import NavBar from "../components/NavBar";
import { useGame } from "../context/GameContext";
import { STORIES } from "../data/gameData";

export default function StoriesPage() {
  const { state } = useGame();
  const [selected, setSelected] = useState(null);

  const unlocked = STORIES.filter(s => state.unlockedStories.includes(s.id));
  const locked   = STORIES.filter(s => !state.unlockedStories.includes(s.id));

  if (selected) {
    return (
      <>
        <NavBar />
        <main>
          <button onClick={() => setSelected(null)} style={{ cursor: "pointer", marginBottom: "1rem" }}>← Back</button>
          <h1>{selected.title}</h1>
          <div style={{ whiteSpace: "pre-wrap", lineHeight: "1.6" }}>
            {selected.content}
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <NavBar />
      <main>
        <h1>📖 Stories</h1>
        <p>
          Deep dives into the world of technical theatre. Unlock more by completing levels.
        </p>

        {unlocked.length > 0 && (
          <section>
            <h2>Unlocked</h2>
            {unlocked.map(s => (
              <div key={s.id} onClick={() => setSelected(s)} style={{ cursor: "pointer", padding: "1rem", border: "1px solid var(--border)", borderRadius: "8px", marginBottom: "0.5rem" }}>
                <h3>{s.title}</h3>
                <p>{s.content.slice(0, 80)}…</p>
              </div>
            ))}
          </section>
        )}

        {locked.length > 0 && (
          <section>
            <h2>Locked</h2>
            {locked.map(s => (
              <div key={s.id} style={{ padding: "1rem", border: "1px solid var(--border)", borderRadius: "8px", marginBottom: "0.5rem", opacity: "0.6" }}>
                <h3>🔒 {s.title}</h3>
                <p>
                  Complete {s.unlockedBy.difficulty} difficulty
                  in "{s.unlockedBy.productionId}" with {s.unlockedBy.minStars}+ stars
                </p>
              </div>
            ))}
          </section>
        )}
      </main>
    </>
  );
}
