import { useState } from "react";
import { useGame } from "../../context/GameContext";
import DialogueBox from "./DialogueBox";

export default function ConflictMinigame({ conflict, onResolved }) {
  const { dispatch } = useGame();
  const [result, setResult] = useState(null);

  function handleChoice(choice) {
    dispatch({ type: "MARK_CONFLICT_SEEN", conflictId: conflict.id });
    dispatch({ type: "ADD_SCORE", delta: choice.pointDelta });

    if (choice.sideEffect === "ally_gained") {
      dispatch({ type: "ADD_CONTACT", name: conflict.npc });
    }

    // Instead of resolving immediately, show the aftermath
    setResult(choice);
  }

  if (result) {
    return (
      <div className="hardware-panel">
        <h2 style={{ color: "var(--bui-fg-info)" }}>⚡ CONFLICT RESOLVED</h2>
        <div className="pxbox">
          <h3
            style={{
              color:
                result.outcome === "resolved"
                  ? "var(--bui-fg-success)"
                  : "var(--bui-fg-danger)",
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
        text={conflict.description}
        choices={conflict.choices}
        onChoice={handleChoice}
      />
    </div>
  );
}
