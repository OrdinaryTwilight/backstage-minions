/**
 * @file Select Level / Difficulty Page
 * @description Allows player to select difficulty tier for a chosen production.
 *
 * Difficulty Selection:
 * - **School**: Easy mode with 4 lives, wider cue windows, lower technical requirements
 * - **Community**: Medium mode with 3 lives, standard cue windows
 * - **Professional**: Hard mode with 2 lives, narrower cue windows, high technical demand
 *
 * Each difficulty shows level-specific requirements and unlocked status.
 * Selecting difficulty navigates to character selection page.
 *
 * @page
 */

import { useNavigate, useParams } from "react-router-dom";
import DifficultyPill from "../components/ui/DifficultyPill";
import HardwarePanel from "../components/ui/HardwarePanel";
import NavBar from "../components/ui/NavBar";
import SectionHeader from "../components/ui/SectionHeader";
import { useGame } from "../context/GameContext";
import { PRODUCTIONS } from "../data/gameData";

export default function SelectLevelPage() {
  const { productionId } = useParams();
  const navigate = useNavigate();
  const { state } = useGame();

  // Find the specific production from gameData
  const production = PRODUCTIONS.find((p) => p.id === productionId);

  // Safety guard for invalid production IDs
  if (!production) {
    return (
      <div className="page-container animate-flicker">
        <HardwarePanel>Technical Briefing Not Found</HardwarePanel>
      </div>
    );
  }

  return (
    <div className="page-container">
      {/* NavBar is outside the animation wrapper to keep it floating/fixed */}
      <NavBar />

      <div className="animate-blueprint">
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
                /* CRITICAL FIX: Navigation path updated to include /difficulty/ 
                   to match the standardized route in App.jsx */
                onClick={() =>
                  isUnlocked &&
                  navigate(
                    `/productions/${productionId}/difficulty/${diffKey}/character`,
                  )
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

                {/* Visual Status Pill with animated star progress */}
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
    </div>
  );
}
