import { useState } from "react";
import { useGame } from "../../context/GameContext";
import DialogueBox from "./DialogueBox";

const WRAPUP_DIALOGUES = [
  {
    id: "sm_network",
    speaker: "Stage Manager",
    text: "Great show! I'd love to work with you again. Want to exchange contacts?",
    choices: [
      {
        id: "yes",
        text: '"Of course! Here\'s my number."',
        pointDelta: 30,
        contact: "Stage Manager",
      },
      {
        id: "no",
        text: '"Thanks — I\'ll find you on the board."',
        pointDelta: 0,
        contact: null,
      },
    ],
  },
];

export default function WrapUpScene({ onComplete }) {
  const { dispatch } = useGame();
  const [step, setStep] = useState(0);
  const [feedback, setFeedback] = useState(null);

  const dialogue = WRAPUP_DIALOGUES[step];

  function handleChoice(choice) {
    dispatch({ type: "ADD_SCORE", delta: choice.pointDelta });
    if (choice.contact) dispatch({ type: "ADD_CONTACT", name: choice.contact });
    setFeedback(
      choice.contact
        ? `📇 ${choice.contact}'s contact saved! +${choice.pointDelta} pts`
        : null,
    );
    if (step + 1 < WRAPUP_DIALOGUES.length) {
      setTimeout(() => {
        setFeedback(null);
        setStep((s) => s + 1);
      }, 1200);
    } else {
      setTimeout(() => onComplete(), 1400);
    }
  }

  return (
    <div style={{ padding: "1rem" }}>
      <h2>🥂 Wrap-up</h2>

      {feedback && (
        <div
          style={{
            padding: "1rem",
            background: "var(--surface2)",
            borderRadius: "8px",
            marginBottom: "1rem",
          }}
        >
          {feedback}
        </div>
      )}
      {dialogue && (
        <DialogueBox
          speaker={dialogue.speaker}
          text={dialogue.text}
          choices={dialogue.choices}
          onChoice={handleChoice}
        />
      )}
    </div>
  );
}
