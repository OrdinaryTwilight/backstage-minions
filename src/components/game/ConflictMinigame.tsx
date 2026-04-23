/**
 * @file Conflict Minigame Component
 * @description Displays conflict resolution UI where players make dialogue choices with story/gameplay consequences.
 *
 * Conflict System Overview:
 * Conflicts are story moments that interrupt gameplay, allowing player choice with real consequences.
 * Each conflict shows an NPC's dialogue and presents 3 shuffled response options.
 *
 * Mechanics:
 * - **Shuffled Choices**: Choices are deterministically shuffled (seeded by conflictId) so every playthrough varies
 * - **Stress Impact**: Escalated outcomes +25 stress, Resolved outcomes -15 stress
 * - **Score Impact**: Player choices award/deduct points (affects final star rating)
 * - **Side Effects**: Some choices unlock new contacts or trigger special events
 * - **Outcome Types**: "resolved" (good), "neutral" (ok), "escalated" (bad)
 *
 * @component
 */

import { useMemo, useState } from "react";
import { useGame } from "../../context/GameContext";
import {
  AVAILABLE_NPCS,
  CHARACTERS,
  NPC_ICONS,
  parseDialogueTags,
  resolveCharacterName,
} from "../../data/characters";
import { useAnnouncement } from "../../hooks/useAnnouncement";
import { Conflict, ConflictChoice } from "../../types/game";
import Button from "../ui/Button";
import HardwarePanel from "../ui/HardwarePanel";
import DialogueBox from "./DialogueBox";

interface ConflictMinigameProps {
  /** The conflict scenario to display and resolve */
  readonly conflict: Conflict;
  /** Callback fired when player selects a choice - passes the outcome type */
  readonly onResolved: (outcome: string) => void;
}

/**
 * ConflictMinigame Component
 * Renders a conflict scenario with NPC dialogue and player response choices.
 * Applies consequences to game state (score, stress, contacts) and fires announcement feedback.
 */

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

    // Deterministic shuffle: seed PRNG with conflict ID so same conflict always
    // presents choices in same order, but different conflicts vary order
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

  /**
   * Handle player selecting a response choice.
   * Updates game state: score, stress, contacts (if applicable).
   * Announces outcome to player, displays aftermath text, enables continue button.
   */
  const handleChoice = (choice: ConflictChoice) => {
    dispatch({ type: "MARK_CONFLICT_SEEN", conflictId: conflict.id });
    dispatch({ type: "ADD_SCORE", delta: choice.pointDelta });

    if (choice.outcome === "escalated") {
      dispatch({ type: "UPDATE_STRESS", delta: 25 });
    } else if (choice.outcome === "resolved") {
      dispatch({ type: "UPDATE_STRESS", delta: -15 });
    }

    if (choice.sideEffect === "ally_gained") {
      dispatch({ type: "ADD_CONTACT", contactId: conflict.npc });
    }

    const parsedAftermath = parseDialogueTags(choice.aftermathText);
    announce(`Result: ${choice.outcome}. ${parsedAftermath}`);
    setSelectedChoice(choice);
  };

  const speakerName = resolveCharacterName(conflict.npc);

  let speakerIcon = "👤";
  const charMatch = CHARACTERS.find((c) => c.id === conflict.npc);
  const npcMatch = AVAILABLE_NPCS.find((c) => c.id === conflict.npc);

  if (charMatch) {
    speakerIcon = charMatch.icon;
  } else if (npcMatch) {
    const iconKey = Object.keys(NPC_ICONS).find((k) =>
      npcMatch.role.includes(k),
    );
    speakerIcon = iconKey ? NPC_ICONS[iconKey as keyof typeof NPC_ICONS] : "👤";
  }

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
                flexWrap: "wrap",
                gap: "1rem",
              }}
            >
              <h3
                style={{
                  color:
                    selectedChoice.outcome === "escalated"
                      ? "var(--bui-fg-danger)"
                      : "var(--bui-fg-success)",
                  margin: 0,
                }}
                aria-live="assertive"
              >
                RESULT: {selectedChoice.outcome.toUpperCase()}
              </h3>

              <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                <span
                  style={{
                    background:
                      selectedChoice.pointDelta >= 0
                        ? "var(--bui-fg-success)"
                        : "var(--bui-fg-danger)",
                    padding: "0.25rem 0.75rem",
                    borderRadius: "4px",
                    color: "#000",
                    fontWeight: "bold",
                    fontSize: "0.85rem",
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
                      background: "var(--bui-fg-danger)",
                      padding: "0.25rem 0.75rem",
                      borderRadius: "4px",
                      color: "#000",
                      fontWeight: "bold",
                      fontSize: "0.85rem",
                    }}
                  >
                    +25 STRESS
                  </span>
                )}

                {selectedChoice.outcome === "resolved" && (
                  <span
                    style={{
                      background: "var(--bui-fg-success)",
                      padding: "0.25rem 0.75rem",
                      borderRadius: "4px",
                      color: "#000",
                      fontWeight: "bold",
                      fontSize: "0.85rem",
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
              {parseDialogueTags(selectedChoice.aftermathText)}
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
              speaker={speakerName}
              icon={speakerIcon}
              text={parseDialogueTags(conflict.description)}
              choices={shuffledChoices}
              onChoice={handleChoice}
            />
          </div>
        )}
      </HardwarePanel>
    </div>
  );
}
