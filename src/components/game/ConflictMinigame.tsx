import { useState } from "react";
import { useGame } from "../../context/GameContext";
import DialogueBox from "./DialogueBox";

export default function ConflictMinigame({ conflict, onResolved }) {
  const { dispatch } = useGame();
  const [result, setResult] = useState(null);

  function handleChoice(choice) {
    dispatch({ type: "MARK_CONFLICT_SEEN", conflictId: conflict.id });
    // Safety check for pointDelta to prevent NaN score bugs
    dispatch({ type: "ADD_SCORE", delta: Number(choice.pointDelta) || 0 });

    if (choice.sideEffect === "ally_gained") {
      dispatch({ type: "ADD_CONTACT", name: conflict.npc });
    }

    setResult(choice);
  }

  if (result) {
    const isEscalated = result.outcome === "escalated";
    return (
      <div className="hardware-panel">
        <h2
          style={{
            color: isEscalated ? "var(--bui-fg-danger)" : "var(--bui-fg-info)",
          }}
        >
          ⚡ CONFLICT {isEscalated ? "ESCALATED" : "RESOLVED"}
        </h2>
        <div className="pxbox">
          <h3
            style={{
              color: isEscalated
                ? "var(--bui-fg-danger)"
                : "var(--bui-fg-success)",
            }}
          >
            {result.outcome.toUpperCase()}
          </h3>
          <p style={{ margin: "1rem 0" }}>{result.aftermathText}</p>
          <button
            className="action-button btn-accent"
            onClick={() => onResolved(result.outcome)}
          >
            Continue Work
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h2 style={{ color: "var(--bui-fg-danger)" }}>⚡ CONFLICT</h2>
      <DialogueBox
        speaker={conflict.npc}
        icon={NPC_ICONS[conflict.npc]} // Look up NPC icon
        text={conflict.description}
        choices={conflict.choices}
        onChoice={handleChoice}
      />
    </div>
  );
}
