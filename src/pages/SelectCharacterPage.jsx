import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import NavBar from "../components/NavBar";
import Button from "../components/ui/Button";
import DepartmentBadge from "../components/ui/DepartmentBadge";
import HardwarePanel from "../components/ui/HardwarePanel";
import SectionHeader from "../components/ui/SectionHeader";
import StatBar from "../components/ui/StatBar";
import { useGame } from "../context/GameContext";
import { CHARACTERS, CUE_SHEETS } from "../data/gameData";

export default function SelectCharacterPage() {
  const { productionId, difficulty } = useParams();
  const navigate = useNavigate();
  const { dispatch } = useGame();
  const [idx, setIdx] = useState(0);

  // Data Safety: Ensure we have characters for the selected production
  const available = CHARACTERS.filter(
    (c) => CUE_SHEETS[productionId]?.[c.department],
  );
  const char = available[idx];

  function startGame() {
    dispatch({
      type: "START_SESSION",
      productionId,
      difficulty,
      characterId: char.id,
    });
    navigate(`/game/${productionId}/${difficulty}/${char.id}`);
  }

  if (!char)
    return (
      <div className="page-container animate-flicker">No Personnel Found</div>
    );

  return (
    <div className="page-container animate-blueprint">
      <NavBar />

      <Button
        onClick={() => navigate(`/productions/${productionId}/${difficulty}`)}
        style={{
          marginBottom: "1.5rem",
          minWidth: "auto",
          border: "none",
          background: "transparent",
        }}
      >
        ‹ Back to Contract
      </Button>

      <SectionHeader
        title="Personnel Selection"
        subtitle="Review specialist files for the upcoming rig."
      />

      <HardwarePanel
        className="animate-pop"
        style={{ textAlign: "center", padding: "2.5rem" }}
      >
        {/* Character Icon with Flicker Effect */}
        <div
          className="animate-flicker"
          style={{ fontSize: "5.5rem", marginBottom: "1rem" }}
        >
          {char.icon}
        </div>

        <h2
          className="annotation-text"
          style={{ fontSize: "1.8rem", margin: "0 0 0.5rem 0" }}
        >
          {char.name}
        </h2>

        <DepartmentBadge department={char.department} />

        <p
          className="console-screen"
          style={{
            margin: "2rem auto",
            maxWidth: "550px",
            fontStyle: "italic",
            borderStyle: "dashed",
          }}
        >
          "{char.bio}"
        </p>

        {/* Stats with dynamic fill animations */}
        <div style={{ textAlign: "left", maxWidth: "400px", margin: "0 auto" }}>
          <h3
            className="annotation-text"
            style={{ fontSize: "1rem", marginBottom: "1.5rem", opacity: 0.5 }}
          >
            Aptitude Diagnostics:
          </h3>
          <StatBar label="Technical" value={char.stats.technical} />
          <StatBar label="Social" value={char.stats.social} />
          <StatBar label="Stamina" value={char.stats.stamina} />
        </div>
      </HardwarePanel>

      {/* Carousel Controls */}
      <div
        style={{
          display: "flex",
          gap: "1.5rem",
          alignItems: "center",
          justifyContent: "center",
          margin: "2.5rem 0",
        }}
      >
        <Button
          onClick={() =>
            setIdx((idx - 1 + available.length) % available.length)
          }
          style={{ minWidth: "60px" }}
        >
          ‹
        </Button>
        <div className="annotation-text" style={{ fontSize: "1.2rem" }}>
          Record {idx + 1} of {available.length}
        </div>
        <Button
          onClick={() => setIdx((idx + 1) % available.length)}
          style={{ minWidth: "60px" }}
        >
          ›
        </Button>
      </div>

      {/* Pulsing Start Button */}
      <Button
        variant="success"
        className="animate-pulse-go"
        onClick={startGame}
        style={{ width: "100%", height: "70px", fontSize: "1.4rem" }}
      >
        Sign Contract & Initialize
      </Button>
    </div>
  );
}
