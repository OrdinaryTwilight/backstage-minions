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
  PRODUCTIONS.forEach(p => {
    const hasAny = Object.keys(p.levels).some(
      d => state.progress[`${p.id}_${d}`]?.completed
    );
    if (!hasAny) todos.push({ text: `Play your first level in "${p.title}"`, cta: () => navigate(`/productions/${p.id}`) });
  });
  if (state.unlockedStories.length === 0)
    todos.push({ text: "Unlock your first Story by completing a level", cta: null });

  return (
    <>
      <NavBar />
      <main>
        <h1>🎬 A3! Backstage</h1>
        <p>Technical theatre simulation</p>

        {todos.length > 0 && (
          <section>
            <h2>📋 To-Do</h2>
            {todos.map((t, i) => (
              <div key={i}>
                {t.text}
                {t.cta && (
                  <button onClick={t.cta}>Go!</button>
                )}
              </div>
            ))}
          </section>
        )}

        <h2>Your progress</h2>
        {PRODUCTIONS.map(p => (
          <div key={p.id} onClick={() => navigate(`/productions/${p.id}`)} style={{ cursor:"pointer", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
            <div>
              {p.poster} {p.title}
              <div>
                {Object.entries(p.levels).map(([diff]) => {
                  const prog = state.progress[`${p.id}_${diff}`];
                  return (
                    <div key={diff}>
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
      </main>
    </>
  );
}
