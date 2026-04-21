import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Button from "../components/ui/Button";
import DepartmentBadge from "../components/ui/DepartmentBadge";
import HardwarePanel from "../components/ui/HardwarePanel";
import NavBar from "../components/ui/NavBar";
import SectionHeader from "../components/ui/SectionHeader";
import StatBar from "../components/ui/StatBar";
import { useGame } from "../context/GameContext";
import { CHARACTERS } from "../data/gameData";

export default function SelectCharacterPage() {
  const { productionId, difficulty } = useParams<{
    productionId: string;
    difficulty: string;
  }>();
  const navigate = useNavigate();
  const { dispatch } = useGame();
  const [idx, setIdx] = useState(0);

  const available = CHARACTERS;
  const char = available[idx];

  function startGame() {
    if (!productionId || !difficulty || !char) return;
    dispatch({
      type: "START_SESSION",
      productionId,
      difficulty: difficulty as "school" | "community" | "professional",
      characterId: char.id,
    });
    navigate(`/game/${productionId}/${difficulty}/${char.id}`);
  }

  if (!char)
    return (
      <div className="page-container animate-flicker">No Personnel Found</div>
    );

  return (
    <div className="page-container">
      <NavBar />

      <section className="animate-blueprint" aria-label="Character Selection">
        <Button
          onClick={() => navigate(`/productions/${productionId}`)}
          style={{
            marginBottom: "1.5rem",
            minWidth: "auto",
            border: "none",
            background: "transparent",
            fontFamily: "inherit",
          }}
        >
          ‹ Back to Production
        </Button>

        <SectionHeader
          title="Personnel Selection"
          subtitle="Review specialist files for the upcoming rig."
        />

        <HardwarePanel
          className="animate-pop"
          style={{ textAlign: "center", padding: "2.5rem" }}
        >
          <section aria-live="polite" aria-label="Character profile">
            <div
              className="animate-flicker"
              style={{ fontSize: "5.5rem", marginBottom: "1rem" }}
              aria-hidden="true"
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

            <div
              style={{ textAlign: "left", maxWidth: "400px", margin: "0 auto" }}
            >
              <h3
                className="annotation-text"
                style={{
                  fontSize: "1rem",
                  marginBottom: "1.5rem",
                  opacity: 0.5,
                }}
              >
                Aptitude Diagnostics:
              </h3>
              <StatBar label="Technical" value={char.stats.technical} />
              <StatBar label="Social" value={char.stats.social} />
              <StatBar label="Stamina" value={char.stats.stamina} />
            </div>
          </section>
        </HardwarePanel>

        <nav
          style={{
            display: "flex",
            gap: "1.5rem",
            alignItems: "center",
            justifyContent: "center",
            margin: "2.5rem 0",
          }}
          aria-label="Character carousel navigation"
        >
          <Button
            onClick={() =>
              setIdx((idx - 1 + available.length) % available.length)
            }
            style={{ minWidth: "60px" }}
            aria-label={`Previous character, currently viewing ${idx + 1} of ${available.length}`}
          >
            ‹
          </Button>
          <div
            className="annotation-text"
            style={{ fontSize: "1.2rem" }}
            aria-live="polite"
            aria-atomic="true"
          >
            Record {idx + 1} of {available.length}
          </div>
          <Button
            onClick={() => setIdx((idx + 1) % available.length)}
            style={{ minWidth: "60px" }}
            aria-label={`Next character, currently viewing ${idx + 1} of ${available.length}`}
          >
            ›
          </Button>
        </nav>

        <Button
          variant="success"
          className="animate-pulse-go"
          onClick={startGame}
          style={{
            width: "100%",
            maxWidth: "600px",
            margin: "0 auto",
            display: "block",
            height: "70px",
            fontSize: "1.4rem",
            fontFamily: "inherit",
          }}
          aria-label={`Sign contract and start show as ${char.name}`}
        >
          Start show as {char.name}
        </Button>
      </section>
    </div>
  );
}
