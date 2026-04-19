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

  // Shuffle the choices once when the conflict loads so the correct answer moves around
  const shuffledChoices = useMemo(() => {
    return [...conflict.choices].sort(() => Math.random() - 0.5);
  }, [conflict.choices]);

  const handleChoice = (choice: ConflictChoice) => {
    dispatch({ type: "MARK_CONFLICT_SEEN", conflictId: conflict.id });
    dispatch({ type: "ADD_SCORE", delta: choice.pointDelta });

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
            <h3
              style={{
                color:
                  selectedChoice.outcome === "escalated"
                    ? "var(--bui-fg-danger)"
                    : "var(--bui-fg-success)",
                marginBottom: "1rem",
              }}
              role="status"
              aria-live="polite"
            >
              RESULT: {selectedChoice.outcome.toUpperCase()}
            </h3>

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
