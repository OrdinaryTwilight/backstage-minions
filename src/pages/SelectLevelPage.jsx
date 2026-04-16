import { useNavigate, useParams } from "react-router-dom";
import NavBar from "../components/NavBar";
import DifficultyPill from "../components/ui/DifficultyPill";
import HardwarePanel from "../components/ui/HardwarePanel";
import SectionHeader from "../components/ui/SectionHeader";
import { useGame } from "../context/GameContext";
import { PRODUCTIONS } from "../data/gameData";

export default function SelectLevelPage() {
  const { productionId } = useParams();
  const navigate = useNavigate();
  const { state } = useGame();
  const production = PRODUCTIONS.find((p) => p.id === productionId);

  if (!production)
    return <div className="page-container">Briefing not found.</div>;

  return (
    <div className="page-container">
      <NavBar />
      <SectionHeader
        title={`${production.poster} ${production.title}: Contract Tiers`}
        subtitle="Review venue requirements and select your gig."
      />

      <div className="bento-container" style={{ gridTemplateColumns: "1fr" }}>
        {Object.entries(production.levels).map(([diffKey, details]) => {
          const progress = state?.progress?.[`${productionId}_${diffKey}`];
          const isUnlocked = details.unlocked || progress?.completed;

          return (
            <HardwarePanel
              key={diffKey}
              variant={isUnlocked ? "clickable" : "locked"}
              onClick={() =>
                isUnlocked &&
                navigate(`/productions/${productionId}/${diffKey}/character`)
              }
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div style={{ flex: 1 }}>
                <h3
                  className="annotation-text"
                  style={{ fontSize: "1.5rem", margin: 0 }}
                >
                  {diffKey.toUpperCase()} CONTRACT
                </h3>
                <p
                  style={{
                    opacity: 0.6,
                    fontSize: "0.85rem",
                    marginTop: "4px",
                  }}
                >
                  Venue: {details.venueId.replace("_", " ")}
                </p>
              </div>
              <div style={{ minWidth: "140px" }}>
                <DifficultyPill
                  label="Status"
                  stars={progress?.stars || 0}
                  unlocked={isUnlocked}
                />
              </div>
            </HardwarePanel>
          );
        })}
      </div>
    </div>
  );
}
