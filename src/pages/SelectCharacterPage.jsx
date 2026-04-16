import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import NavBar from "../components/NavBar";
import StatBar from "../components/ui/StatBar"; // Reusable UI component
import { useGame } from "../context/GameContext"; //
import { CHARACTERS, CUE_SHEETS } from "../data/gameData"; //

export default function SelectCharacterPage() {
  const { productionId, difficulty } = useParams();
  const navigate = useNavigate();
  const { dispatch } = useGame();
  const [idx, setIdx] = useState(0);

  // Filter characters based on relevant department for the production
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
    }); //
    navigate(`/game/${productionId}/${difficulty}/${char.id}`);
  }

  if (!char) {
    return (
      <div className="page-container hardware-panel">
        <h2 className="annotation-text">No crew available for this rig.</h2>
        <button className="action-button" onClick={() => navigate("/")}>
          Return Home
        </button>
      </div>
    );
  }

  return (
    <div className="page-container">
      <NavBar />

      <button
        onClick={() =>
          navigate(`/productions/${productionId}/difficulty/${difficulty}`)
        }
        className="action-button"
        style={{
          marginBottom: "1.5rem",
          padding: "0.5rem 1rem",
          minWidth: "auto",
        }}
      >
        ‹ Back to Contracts
      </button>

      <header style={{ marginBottom: "2rem" }}>
        <h1
          className="annotation-text"
          style={{ fontSize: "2rem", color: "var(--bui-fg-info)" }}
        >
          Assemble the Crew
        </h1>
        <p className="annotation-text" style={{ opacity: 0.7 }}>
          Select a specialist for this shift:
        </p>
      </header>

      {/* Main Character Identity Card */}
      <div
        className="hardware-panel"
        style={{ padding: "2rem", textAlign: "center" }}
      >
        <div style={{ fontSize: "5rem", marginBottom: "1rem" }}>
          {char.icon}
        </div>

        <h2
          className="annotation-text"
          style={{ fontSize: "1.8rem", margin: "0 0 0.25rem 0" }}
        >
          {char.name}
        </h2>

        <div className="problem-highlight" style={{ marginBottom: "1.5rem" }}>
          <span
            style={{
              fontFamily: "var(--font-sketch)",
              textTransform: "uppercase",
              fontSize: "0.9rem",
            }}
          >
            {char.role}
          </span>
        </div>

        <p
          style={{
            fontSize: "1rem",
            color: "var(--color-pencil-light)",
            lineHeight: "1.6",
            marginBottom: "2rem",
            maxWidth: "500px",
            margin: "0 auto 2rem",
          }}
        >
          "{char.bio}"
        </p>

        {/* Utilizing the reusable StatBar component */}
        <div style={{ textAlign: "left", maxWidth: "400px", margin: "0 auto" }}>
          <h3
            className="annotation-text"
            style={{ fontSize: "1.1rem", marginBottom: "1rem", opacity: 0.6 }}
          >
            Personnel Stats:
          </h3>
          <StatBar label="Technical" value={char.stats.technical} />
          <StatBar label="Social" value={char.stats.social} />
          <StatBar label="Stamina" value={char.stats.stamina} />
        </div>
      </div>

      {/* Tactile Carousel Controls */}
      <div
        style={{
          display: "flex",
          gap: "1rem",
          alignItems: "center",
          justifyContent: "center",
          margin: "2rem 0",
        }}
      >
        <button
          className="action-button"
          style={{ minWidth: "60px" }}
          onClick={() =>
            setIdx((idx - 1 + available.length) % available.length)
          }
        >
          ‹
        </button>

        <div
          className="annotation-text"
          style={{ fontSize: "1.2rem", color: "var(--color-architect-blue)" }}
        >
          File {idx + 1} / {available.length}
        </div>

        <button
          className="action-button"
          style={{ minWidth: "60px" }}
          onClick={() => setIdx((idx + 1) % available.length)}
        >
          ›
        </button>
      </div>

      <button
        onClick={startGame}
        className="action-button btn-success"
        style={{
          width: "100%",
          maxWidth: "none",
          fontSize: "1.2rem",
          height: "60px",
        }}
      >
        Sign Contract & Start Show
      </button>
    </div>
  );
}
