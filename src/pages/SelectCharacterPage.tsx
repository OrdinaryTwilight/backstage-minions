/**
 * @file Character Selection Page
 * @description Allows player to select a playable character before starting a level.
 * 
 * Gameplay:
 * - Player sees all available characters with their stats and bios
 * - Character selection determines: department, difficulty modifier, dialogue availability
 * - Each character has unique technical, social, and stamina stats
 * - Selecting a character initializes a new game session
 * - Redirects to game level page to begin gameplay
 * 
 * Character Stats Impact:
 * - **Technical**: Affects cue window difficulty multiplier
 * - **Social**: Affects dialogue branching and affinity gains
 * - **Stamina**: Affects stress resilience and max stress capacity
 * 
 * @page
 */

import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Button from "../components/ui/Button";
import DepartmentBadge from "../components/ui/DepartmentBadge";
import NavBar from "../components/ui/NavBar";
import SectionHeader from "../components/ui/SectionHeader";
import StatBar from "../components/ui/StatBar";
import { useGame } from "../context/GameContext";
import { CHARACTERS } from "../data/characters";

export default function SelectCharacterPage() {
  const { productionId, difficulty } = useParams<{
    productionId: string;
    difficulty: string;
  }>();
  const navigate = useNavigate();
  const { dispatch } = useGame();
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const selectedChar = CHARACTERS.find((c) => c.id === selectedId);

  function startGame() {
    if (!productionId || !difficulty || !selectedChar) return;
    dispatch({
      type: "START_SESSION",
      productionId,
      difficulty: difficulty as "school" | "community" | "professional",
      characterId: selectedChar.id,
    });
    navigate(`/game/${productionId}/${difficulty}/${selectedChar.id}`);
  }

  return (
    <div className="page-container" style={{ paddingBottom: "180px" }}>
      <NavBar />

      <style>{`
        .character-grid {
          display: grid;
          /* UX FIX: Priority 2 - Added min(100%, 260px) to prevent horizontal scroll on ultra-narrow phones */
          grid-template-columns: repeat(auto-fill, minmax(min(100%, 260px), 1fr));
          gap: 1.5rem;
          margin: 2rem 0;
        }
        
        .char-card-button {
          background: transparent;
          border: none;
          cursor: pointer;
          width: 100%;
          padding: 0;
          text-align: inherit;
          border-radius: 12px;
          perspective: 1000px;
        }

        .char-card-button:focus-visible {
          outline: 3px solid var(--bui-fg-info);
          outline-offset: 4px;
        }

        .char-card-inner {
          position: relative;
          width: 100%;
          height: 380px;
          transition: transform 0.6s cubic-bezier(0.4, 0.2, 0.2, 1);
          transform-style: preserve-3d;
          border-radius: 12px;
        }

        .char-card-button.selected .char-card-inner {
          transform: rotateY(180deg);
        }

        .char-card-front, .char-card-back {
          position: absolute;
          inset: 0;
          backface-visibility: hidden;
          border-radius: 12px;
          background: var(--color-surface-translucent);
          border: 2px solid var(--glass-border);
          box-shadow: 0 4px 15px rgba(0,0,0,0.3);
          display: flex;
          flex-direction: column;
          align-items: center;
          transition: border-color 0.3s ease, box-shadow 0.3s ease;
          color: var(--color-pencil-light);
        }

        .char-card-button.selected .char-card-front,
        .char-card-button.selected .char-card-back {
          border-color: var(--bui-fg-warning);
          box-shadow: 0 0 20px rgba(251, 191, 36, 0.3);
        }

        .char-card-button:hover:not(.selected) .char-card-front {
          border-color: var(--bui-fg-info);
        }

        .char-card-front {
          justify-content: center;
          padding: 1.5rem;
        }

        .char-card-back {
          transform: rotateY(180deg);
          background: var(--color-blueprint-bg);
          justify-content: flex-start;
          padding: 1.5rem;
          overflow-y: auto;
        }
        
        .char-card-back::-webkit-scrollbar {
          width: 4px;
        }
        .char-card-back::-webkit-scrollbar-thumb {
          background: var(--glass-border);
          border-radius: 4px;
        }
        
        .sticky-action-bar {
          position: fixed;
          bottom: 80px;
          left: 0;
          right: 0;
          padding: 1rem 1.5rem;
          z-index: 100;
          display: flex;
          justify-content: center;
          pointer-events: none; /* Let clicks pass through the gradient */
        }
      `}</style>

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
          subtitle="Select a specialist for the upcoming rig."
        />

        <div
          className="character-grid"
          role="radiogroup"
          aria-label="Available Characters"
        >
          {CHARACTERS.map((char) => {
            const isSelected = selectedId === char.id;
            return (
              <button
                key={char.id}
                type="button"
                role="radio"
                aria-checked={isSelected}
                className={`char-card-button animate-pop ${isSelected ? "selected" : ""}`}
                onClick={() => setSelectedId(isSelected ? null : char.id)}
                aria-label={`Select ${char.name}, ${char.role}`}
              >
                <div className="char-card-inner">
                  {/* FRONT FACE: Name, Icon, Dept */}
                  <div className="char-card-front">
                    <div
                      style={{ fontSize: "5rem", marginBottom: "1rem" }}
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
                    <div
                      style={{
                        marginTop: "1rem",
                        fontFamily: "var(--font-mono)",
                        fontSize: "0.9rem",
                        color: "var(--bui-fg-info)",
                      }}
                    >
                      {char.role}
                    </div>
                  </div>

                  {/* BACK FACE: Bio & Stats */}
                  <div className="char-card-back">
                    <h3
                      className="annotation-text"
                      style={{
                        fontSize: "1.4rem",
                        margin: "0 0 0.5rem 0",
                        color: "var(--bui-fg-warning)",
                      }}
                    >
                      {char.name}
                    </h3>
                    <p
                      style={{
                        fontSize: "0.85rem",
                        fontStyle: "italic",
                        opacity: 0.9,
                        marginBottom: "1.5rem",
                        lineHeight: "1.5",
                      }}
                    >
                      "{char.bio}"
                    </p>

                    <div style={{ width: "100%", textAlign: "left" }}>
                      <h4
                        className="annotation-text"
                        style={{
                          fontSize: "0.9rem",
                          marginBottom: "0.75rem",
                          opacity: 0.6,
                        }}
                      >
                        Aptitude Diagnostics:
                      </h4>
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: "0.5rem",
                        }}
                      >
                        <StatBar
                          label="Technical"
                          value={char.stats.technical}
                        />
                        <StatBar label="Social" value={char.stats.social} />
                        <StatBar label="Stamina" value={char.stats.stamina} />
                      </div>
                    </div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* Sticky Action Bar */}
      <div className="sticky-action-bar">
        <Button
          variant={selectedChar ? "success" : "default"}
          className={selectedChar ? "animate-pulse-go" : ""}
          onClick={startGame}
          disabled={!selectedChar}
          style={{
            width: "100%",
            maxWidth: "600px",
            height: "70px",
            fontSize: "1.4rem",
            fontFamily: "inherit",
            opacity: selectedChar ? 1 : 0.5,
            cursor: selectedChar ? "pointer" : "not-allowed",
            boxShadow: selectedChar ? "0 10px 30px rgba(0,0,0,0.5)" : "none",
            transition: "all 0.3s ease",
            pointerEvents:
              "auto" /* Restore pointer events specifically for the button */,
          }}
          aria-label={
            selectedChar
              ? `Sign contract and start show as ${selectedChar.name}`
              : "Select Personnel to continue"
          }
        >
          {selectedChar
            ? `Start show as ${selectedChar.name}`
            : "Select Personnel"}
        </Button>
      </div>
    </div>
  );
}
