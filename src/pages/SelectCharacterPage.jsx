import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import NavBar from "../components/NavBar";
import { useGame } from "../context/GameContext";
import { CHARACTERS, CUE_SHEETS } from "../data/gameData";

/**
 * StatBar: Displays a skill stat as label + visual progress bar
 * @param {string} label - Stat name (e.g., "Charm", "Skill")
 * @param {number} value - Rating out of 10
 */
function StatBar({ label, value }) {
  return (
    <div style={{ marginBottom: "0.5rem" }}>
      <div>
        {label}: {value}/10
      </div>
      <div style={{ width: "100%", height: "0.5rem", background: "var(--surface2)", borderRadius: "4px" }}>
        {/* Visual bar fills proportionally to value */}
        <div style={{ width: `${(value/10)*100}%`, height: "100%", background: "var(--accent)", borderRadius: "4px" }}></div>
      </div>
    </div>
  );
}

/**
 * SelectCharacterPage: Character selection before gameplay
 * Route: /productions/:productionId/:difficulty/character
 * 
 * Flow:
 * 1. Show available characters for this production/role combo
 * 2. Player browses characters with Prev/Next buttons
 * 3. Player selects one and clicks "Start Show"
 * 4. Initializes game session and navigates to GameLevelPage
 */
export default function SelectCharacterPage() {
  const { productionId, difficulty } = useParams();
  const navigate = useNavigate();
  const { dispatch } = useGame();
  const [idx, setIdx] = useState(0); // Current character carousel index

  // Get available characters for this production
  // Characters must have a cue sheet entry for this production's department
  const cueSheet = CUE_SHEETS[productionId];
  const available = CHARACTERS.filter(c => cueSheet && cueSheet[c.department]);
  const char = available[idx];

  /**
   * Start gameplay with selected character
   * Dispatches START_SESSION to initialize game state
   */
  function startGame() {
    dispatch({ type:"START_SESSION", productionId, difficulty, characterId: char.id });
    navigate(`/play/${productionId}/${difficulty}/${char.id}`);
  }

  // Guard: no characters available for this production
  if (!char) return <div>No characters available.</div>;

  return (
    <>
      <NavBar />
      <main>
        <button onClick={() => navigate(`/productions/${productionId}`)} style={{ cursor: "pointer", marginBottom: "1rem" }}>← Back</button>
        <h1>🎭 Choose your role</h1>
        <p>Who will you be for this production?</p>

        <div style={{ marginBottom: "2rem", padding: "1rem", border: "1px solid var(--border)", borderRadius: "8px" }}>
          <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>{char.icon}</div>
          <h2>{char.name}</h2>
          <p style={{ color: "var(--text-dim)" }}>
            {char.role}
          </p>
          <p>{char.bio}</p>
          <div style={{ marginTop: "1rem" }}>
            <StatBar label="Charm" value={char.stats.charm} />
            <StatBar label="Skill" value={char.stats.skill} />
          </div>
        </div>

        <div style={{ display: "flex", gap: "1rem", alignItems: "center", justifyContent: "center", marginBottom: "2rem" }}>
          <button onClick={() => setIdx((idx - 1 + available.length) % available.length)} style={{ cursor: "pointer" }}>
            ← Prev
          </button>
          <div>
            {idx + 1} / {available.length}
          </div>
          <button onClick={() => setIdx((idx + 1) % available.length)} style={{ cursor: "pointer" }}>
            Next →
          </button>
        </div>

        <button
          onClick={startGame}
          style={{ cursor: "pointer", padding: "0.75rem 1.5rem", fontSize: "1rem" }}
        >
          🎬 Start Show
        </button>
      </main>
    </>
  );
}



function copyCode(id) {
  const el = document.getElementById(id);
  navigator.clipboard.writeText(el.textContent).then(() => {
    document.querySelectorAll('.copy-btn').forEach(b => {
      if(b.getAttribute('onclick')?.includes(`'${id}'`)) {
        b.textContent = 'Copied!';
        setTimeout(() => b.textContent = 'Copy', 1500);
      }
    });
  });
}

