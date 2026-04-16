import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import NavBar from "../components/NavBar";
import { useGame } from "../context/GameContext";
import { CHARACTERS, CUE_SHEETS } from "../data/gameData";

function StatBar({ label, value }) {
  return (
    <div style={{ marginBottom: "0.75rem", fontSize: "0.85rem" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "0.25rem",
        }}
      >
        <span>{label}</span>
        <span>{value}/10</span>
      </div>
      <div
        style={{
          width: "100%",
          height: "8px",
          background: "var(--surface1)",
          borderRadius: "4px",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: `${(value / 10) * 100}%`,
            height: "100%",
            background: "var(--accent)",
          }}
        />
      </div>
    </div>
  );
}

export default function SelectCharacterPage() {
  const { productionId, difficulty } = useParams();
  const navigate = useNavigate();
  const { dispatch } = useGame();
  const [idx, setIdx] = useState(0);

  const cueSheet = CUE_SHEETS[productionId];
  const available = CHARACTERS.filter(
    (c) => cueSheet && cueSheet[c.department],
  );
  const char = available[idx];

  function startGame() {
    dispatch({
      type: "START_SESSION",
      productionId,
      difficulty,
      characterId: char.id,
    });
    // FIX: Match the route in App.jsx!
    navigate(`/game/${productionId}/${difficulty}/${char.id}`);
  }

  if (!char)
    return <div className="page-container">No characters available.</div>;

  return (
    <div className="page-container">
      <NavBar />
      <button
        onClick={() =>
          navigate(`/productions/${productionId}/difficulty/${difficulty}`)
        }
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

      <h1 style={{ marginBottom: "0.5rem" }}>🎭 Choose your role</h1>
      <p style={{ color: "var(--text-muted)", marginBottom: "2rem" }}>
        Who will you be for this production?
      </p>

      <div className="surface-panel" style={{ textAlign: "center" }}>
        <div style={{ fontSize: "4rem", marginBottom: "1rem" }}>
          {char.icon}
        </div>
        <h2 style={{ margin: "0 0 0.25rem 0" }}>{char.name}</h2>
        <p
          style={{
            color: "var(--accent)",
            fontSize: "0.9rem",
            marginBottom: "1rem",
            fontWeight: "bold",
          }}
        >
          {char.role}
        </p>

        <p
          style={{
            fontSize: "0.9rem",
            color: "var(--text-muted)",
            lineHeight: "1.5",
            marginBottom: "1.5rem",
          }}
        >
          {char.bio}
        </p>

        <div style={{ textAlign: "left" }}>
          {/* FIX: Use the actual stats from gameData.js! */}
          <StatBar label="Technical" value={char.stats.technical} />
          <StatBar label="Social" value={char.stats.social} />
          <StatBar label="Stamina" value={char.stats.stamina} />
        </div>
      </div>

      <div
        style={{
          display: "flex",
          gap: "1rem",
          alignItems: "center",
          justifyContent: "space-between",
          margin: "2rem 0",
        }}
      >
        <button
          className="action-button"
          style={{ background: "var(--surface2)", color: "white" }}
          onClick={() =>
            setIdx((idx - 1 + available.length) % available.length)
          }
        >
          ← Prev
        </button>
        <div style={{ fontWeight: "bold", color: "var(--text-muted)" }}>
          {idx + 1} / {available.length}
        </div>
        <button
          className="action-button"
          style={{ background: "var(--surface2)", color: "white" }}
          onClick={() => setIdx((idx + 1) % available.length)}
        >
          Next →
        </button>
      </div>

      <button
        onClick={startGame}
        className="action-button btn-success"
        style={{ width: "100%" }}
      >
        🎬 Start Show
      </button>
    </div>
  );
}
