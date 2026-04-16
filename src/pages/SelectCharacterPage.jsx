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

  const available = CHARACTERS.filter(
    (c) => CUE_SHEETS[productionId]?.[c.department],
  );
  const char = available[idx];

  const startGame = () => {
    dispatch({
      type: "START_SESSION",
      productionId,
      difficulty,
      characterId: char.id,
    });
    navigate(`/game/${productionId}/${difficulty}/${char.id}`);
  };

  return (
    <div className="page-container">
      <NavBar />
      <SectionHeader
        title="Assemble the Crew"
        subtitle="Select a specialist for this shift."
      />

      <HardwarePanel style={{ textAlign: "center", padding: "2rem" }}>
        <div style={{ fontSize: "5rem", marginBottom: "1rem" }}>
          {char.icon}
        </div>
        <h2 className="annotation-text" style={{ fontSize: "1.8rem" }}>
          {char.name}
        </h2>
        <DepartmentBadge department={char.department} />

        <p style={{ marginTop: "1.5rem", fontStyle: "italic", opacity: 0.8 }}>
          "{char.bio}"
        </p>

        <div
          style={{ textAlign: "left", maxWidth: "400px", margin: "2rem auto" }}
        >
          <StatBar label="Technical" value={char.stats.technical} />
          <StatBar label="Social" value={char.stats.social} />
          <StatBar label="Stamina" value={char.stats.stamina} />
        </div>
      </HardwarePanel>

      <div
        style={{
          display: "flex",
          gap: "1rem",
          alignItems: "center",
          justifyContent: "center",
          margin: "2rem 0",
        }}
      >
        <Button
          onClick={() =>
            setIdx((idx - 1 + available.length) % available.length)
          }
        >
          ‹
        </Button>
        <span className="annotation-text">
          Record {idx + 1} of {available.length}
        </span>
        <Button onClick={() => setIdx((idx + 1) % available.length)}>›</Button>
      </div>

      <Button
        variant="success"
        onClick={startGame}
        style={{ width: "100%", height: "64px" }}
      >
        Authorize Personnel & Start Shift
      </Button>
    </div>
  );
}
