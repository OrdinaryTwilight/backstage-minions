// src/pages/ProductionsPage.jsx
import { useNavigate, useParams } from "react-router-dom";
import Button from "../components/ui/Button";
import DifficultyPill from "../components/ui/DifficultyPill";
import HardwarePanel from "../components/ui/HardwarePanel";
import NavBar from "../components/ui/NavBar";
import SectionHeader from "../components/ui/SectionHeader";
import { useGame } from "../context/GameContext";
import { PRODUCTIONS, VENUES } from "../data/gameData";

export default function ProductionsPage() {
  const { productionId } = useParams();
  const navigate = useNavigate();
  const { state } = useGame();

  const production = PRODUCTIONS.find((p) => p.id === productionId);

  if (!production)
    return <div className="page-container">Briefing not found.</div>;

  return (
    <div className="page-container">
      <NavBar />

      <Button
        onClick={() => navigate("/productions")}
        style={{
          marginBottom: "2rem",
          minWidth: "auto",
          border: "none",
          background: "transparent",
        }}
      >
        ‹ Back to Archives
      </Button>

      <SectionHeader
        title={production.title}
        subtitle="Production Specification"
      />

      <HardwarePanel
        style={{ padding: "2.5rem", textAlign: "center", marginBottom: "3rem" }}
      >
        <div style={{ fontSize: "5rem", marginBottom: "1.5rem" }}>
          {production.poster}
        </div>
        <p
          style={{
            fontSize: "1.1rem",
            maxWidth: "600px",
            margin: "0 auto 1.5rem",
          }}
        >
          {production.description}
        </p>
        <a
          href={production.learnMoreUrl}
          target="_blank"
          rel="noreferrer"
          className="annotation-text"
          style={{ textDecoration: "underline" }}
        >
          Reference Technical Manual ↗
        </a>
      </HardwarePanel>

      <h2 className="annotation-text" style={{ marginBottom: "1.5rem" }}>
        Deploy to Venue
      </h2>

      <div className="bento-container">
        {Object.entries(production.levels).map(([diff, lvl]) => {
          const prog = state?.progress?.[`${productionId}_${diff}`];
          const venue = VENUES[lvl.venueId];
          const isUnlocked = lvl.unlocked || prog?.completed;

          return (
            <HardwarePanel
              key={diff}
              variant={isUnlocked ? "clickable" : "locked"}
              onClick={() =>
                isUnlocked &&
                navigate(`/productions/${productionId}/difficulty/${diff}`)
              }
            >
              <h3
                className="annotation-text"
                style={{
                  fontSize: "1.2rem",
                  color: "var(--color-pencil-light)",
                }}
              >
                {diff.toUpperCase()}
              </h3>
              <p style={{ fontSize: "0.85rem", opacity: 0.6, margin: "8px 0" }}>
                📍 {venue.name}
              </p>

              <DifficultyPill
                label={isUnlocked ? "Available" : "Locked"}
                stars={prog?.stars || 0}
                unlocked={isUnlocked}
              />
            </HardwarePanel>
          );
        })}
      </div>
    </div>
  );
}
