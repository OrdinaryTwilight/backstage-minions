import { useGame } from "../../context/GameContext";
import DialogueBox from "./DialogueBox";

export default function ConflictMinigame({ conflict, onResolved }) {
  const { dispatch } = useGame();

  function handleChoice(choice) {
    dispatch({ type: "MARK_CONFLICT_SEEN", conflictId: conflict.id });
    dispatch({ type: "ADD_SCORE", delta: choice.pointDelta });
    if (
      choice.sideEffect === "costume_contact_unlocked" ||
      choice.sideEffect === "ally_gained"
    ) {
      dispatch({ type: "ADD_CONTACT", name: conflict.npc });
    }
    onResolved(choice.outcome);
  }

  return (
    <div>
      <h2>⚡ CONFLICT — resolve before continuing</h2>
      <DialogueBox
        speaker={conflict.npc}
        text={conflict.description}
        choices={conflict.choices}
        onChoice={handleChoice}
      />
    </div>
  );
}
