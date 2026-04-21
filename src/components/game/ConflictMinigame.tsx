import { useMemo, useState } from "react";
import { useGame } from "../../context/GameContext";
import { NPC_ICONS } from "../../data/gameData";
import { useAnnouncement } from "../../hooks/useAnnouncement";
import { Conflict, ConflictChoice } from "../../types/game";
import Button from "../ui/Button";
import HardwarePanel from "../ui/HardwarePanel";
import DialogueBox from "./DialogueBox";

interface ConflictMinigameProps {
  readonly conflict: Conflict;
  readonly onResolved: (outcome: string) => void;
}

export default function ConflictMinigame({
  conflict,
  onResolved,
}: ConflictMinigameProps) {
  const { dispatch } = useGame();
  const { announce, AnnouncementRegion } = useAnnouncement();
  const [selectedChoice, setSelectedChoice] = useState<ConflictChoice | null>(
    null,
  );

  const shuffledChoices = useMemo(() => {
    const shuffled = [...conflict.choices];

    // FIX: Replaced weak sum with a polynomial rolling hash to prevent anagram collisions
    let seed =
      conflict.id
        .split("")
        .reduce(
          (acc, char) => (acc * 31 + (char.codePointAt(0) || 0)) % 233280,
          0,
        ) || 0;

    for (let i = shuffled.length - 1; i > 0; i--) {
      seed = (seed * 9301 + 49297) % 233280;
      const j = Math.trunc((seed / 233280) * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }, [conflict.choices, conflict.id]);

  const handleChoice = (choice: ConflictChoice) => {
    dispatch({ type: "MARK_CONFLICT_SEEN", conflictId: conflict.id });

    // Apply Score
    dispatch({ type: "ADD_SCORE", delta: choice.pointDelta });

    // Apply Stress Consequences based on explicit outcome
    if (choice.outcome === "escalated") {
      dispatch({ type: "UPDATE_STRESS", delta: 25 });
    } else if (choice.outcome === "resolved") {
      dispatch({ type: "UPDATE_STRESS", delta: -15 });
    }

    if (choice.sideEffect === "ally_gained") {
      dispatch({ type: "ADD_CONTACT", contactId: conflict.npc });
    }

    announce(`Result: ${choice.outcome}. ${choice.aftermathText}`);
    setSelectedChoice(choice);
  };

  return (
    <div
      className="page-container content-reveal"
      style={{ paddingTop: "10vh" }}
    >
      <AnnouncementRegion />
      <HardwarePanel style={{ maxWidth: "800px", margin: "0 auto" }}>
        <h2 style={{ color: "var(--bui-fg-warning)", marginBottom: "1rem" }}>
          ⚡ Conflict
        </h2>

        {selectedChoice ? (
          <div className="animate-pop">
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "1rem",
              }}
            >
              <h3
                style={{
                  color:
                    selectedChoice.outcome === "escalated"
                      ? "var(--bui-fg-danger)"
                      : "var(--bui-fg-success)",
                }}
                aria-live="polite"
              >
                RESULT: {selectedChoice.outcome.toUpperCase()}
              </h3>

              <div style={{ display: "flex", gap: "1rem" }}>
                <span
                  style={{
                    background:
                      selectedChoice.pointDelta >= 0
                        ? "rgba(46, 204, 113, 0.2)"
                        : "rgba(231, 76, 60, 0.2)",
                    padding: "0.25rem 0.75rem",
                    borderRadius: "4px",
                    color:
                      selectedChoice.pointDelta >= 0
                        ? "var(--bui-fg-success)"
                        : "var(--bui-fg-danger)",
                  }}
                >
                  {selectedChoice.pointDelta >= 0
                    ? `+${selectedChoice.pointDelta}`
                    : selectedChoice.pointDelta}{" "}
                  PTS
                </span>
                {selectedChoice.outcome === "escalated" && (
                  <span
                    style={{
                      background: "rgba(231, 76, 60, 0.2)",
                      padding: "0.25rem 0.75rem",
                      borderRadius: "4px",
                      color: "var(--bui-fg-danger)",
                    }}
                  >
                    +25 STRESS
                  </span>
                )}
                {selectedChoice.outcome === "resolved" && (
                  <span
                    style={{
                      background: "rgba(46, 204, 113, 0.2)",
                      padding: "0.25rem 0.75rem",
                      borderRadius: "4px",
                      color: "var(--bui-fg-success)",
                    }}
                  >
                    -15 STRESS
                  </span>
                )}
              </div>
            </div>

            <article
              style={{
                fontSize: "1.1rem",
                lineHeight: 1.8,
                marginBottom: "2rem",
                padding: "1.5rem",
                background: "rgba(0,0,0,0.4)",
                borderRadius: "8px",
                border: "1px solid var(--glass-border)",
              }}
            >
              {selectedChoice.aftermathText}
            </article>

            <Button
              variant="accent"
              onClick={() => onResolved(selectedChoice.outcome)}
              style={{ width: "100%" }}
            >
              Continue show →
            </Button>
          </div>
        ) : (
          <div
            style={{
              fontSize: "1.1rem",
              lineHeight: 1.8,
              padding: "1rem",
              background: "rgba(0,0,0,0.3)",
              borderRadius: "8px",
            }}
          >
            <DialogueBox<ConflictChoice>
              speaker={conflict.npc}
              icon={NPC_ICONS[conflict.npc as keyof typeof NPC_ICONS]}
              text={conflict.description}
              choices={shuffledChoices}
              onChoice={handleChoice}
            />
          </div>
        )}
      </HardwarePanel>
    </div>
  );
}
