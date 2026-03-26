import { useNavigate, useParams } from "react-router-dom";
import NavBar from "../components/ui/NavBar";
import { useGame } from "../context/GameContext";
import { PRODUCTIONS, VENUES } from "../data/gameData";

const DIFF_LABELS = { school:"School 🏫", community:"Community 🏛️", professional:"Professional ✨" };
const LIVES = { school:4, community:3, professional:2 };

function Stars({ n }) {
  return (
    <div>
      {Array.from({ length: n }).map((_, i) => (
        <span key={i}>★</span>
      ))}
    </div>
  );
}

export default function SelectLevelPage() {
  const { productionId } = useParams();
  const navigate = useNavigate();
  const { state } = useGame();
  const production = PRODUCTIONS.find(p => p.id === productionId);
  if (!production) return <div>Production not found.</div>;

  return (
    <>
      <NavBar />
      <main>
        <button onClick={() => navigate("/productions")} style={{ cursor: "pointer", marginBottom: "1rem" }}>← Back</button>
        <h1>
          {production.poster} {production.title}
        </h1>
        <p>{production.description}</p>
        <a href="#" style={{ display: "inline-block", marginBottom: "1.5rem" }}>
          Learn more about this production ↗
        </a>

        <h2>Select difficulty</h2>
        {Object.entries(production.levels).map(([diff, lvl]) => {
          const prog = state.progress[`${productionId}_${diff}`];
          const venue = VENUES[lvl.venueId];
          const debut = !prog?.completed;
          return (
            <div key={diff} style={{ marginBottom: "1.5rem", border: "1px solid var(--border)", padding: "1rem", borderRadius: "8px" }}>
              <div>
                <h3>{DIFF_LABELS[diff]}</h3>
                {debut && lvl.unlocked && (
                  <span>✦ Debut!</span>
                )}
                <h4>{venue.name}</h4>
                <p>
                  {venue.description}
                </p>
                <div>
                  ❤️ Lives: {LIVES[diff]}
                </div>
              </div>
              <div>
                <Stars n={prog?.completed ? 3 : 0} />
              </div>
              <button
                onClick={() => navigate(`/productions/${productionId}/${diff}`)}
                style={{ cursor: "pointer", marginTop: "1rem" }}
              >
                {prog?.completed ? "Play again" : "Start"}
              </button>
            </div>
          );
        })}
      </main>
    </>
  );
}
