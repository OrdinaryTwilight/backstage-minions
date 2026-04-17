// src/components/game/WrapUpScene.tsx
import { useMemo, useState } from "react";
import { useGame } from "../../context/GameContext";
import DialogueBox from "./DialogueBox";

export default function WrapUpScene({
  onComplete,
}: {
  onComplete: () => void;
}) {
  const { state, dispatch } = useGame();
  const [step, setStep] = useState(0);
  const [feedback, setFeedback] = useState<string | null>(null);

  // Calculate performance tier
  const score = state.session?.score || 0;
  const isHighScorer = score >= 100;
  const isLowScorer = score < 50;

  // Dynamic dialogue based on performance
  const dialogues = useMemo(() => {
    const speaker = "Stage Manager";

    if (isLowScorer) {
      return [
        {
          id: "sm_disappointed",
          speaker,
          text: "Well... the curtain stayed up, I guess. But we've got a lot of notes for tomorrow. Try to keep your head in the game.",
          choices: [
            {
              id: "sorry",
              text: '"My bad. I\'ll do better next time."',
              pointDelta: 0,
              contact: null,
            },
            {
              id: "defend",
              text: '"It was a tough rig, okay?"',
              pointDelta: -5,
              contact: null,
            },
          ],
        },
      ];
    }

    if (isHighScorer) {
      return [
        {
          id: "sm_impressed",
          speaker,
          text: "Absolutely flawless execution! I haven't seen a board op hit those timings that cleanly in years. You're going places.",
          choices: [
            {
              id: "yes",
              text: '"Thanks! I\'d love to stay in the loop."',
              pointDelta: 30,
              contact: "npc_stage_manager", // Updated to use a proper ID
            },
            {
              id: "humble",
              text: '"Just doing my job."',
              pointDelta: 10,
              contact: "npc_stage_manager",
            },
          ],
        },
      ];
    }

    // Default Neutral Dialogue
    return [
      {
        id: "sm_neutral",
        speaker,
        text: "Good hustle out there. A few missed cues, but you kept your cool. Want to trade info for future gigs?",
        choices: [
          {
            id: "yes",
            text: '"Sure thing!"',
            pointDelta: 20,
            contact: "npc_stage_manager",
          },
          {
            id: "no",
            text: '"I\'ll catch you later."',
            pointDelta: 0,
            contact: null,
          },
        ],
      },
    ];
  }, [isHighScorer, isLowScorer]);

  const currentDialogue = dialogues[step];

  function handleChoice(choice: any) {
    dispatch({ type: "ADD_SCORE", delta: choice.pointDelta });

    // Fix: Using contactId to match the updated GameAction type
    if (choice.contact) {
      dispatch({ type: "ADD_CONTACT", contactId: choice.contact });
    }

    setFeedback(
      choice.contact
        ? `📇 ${choice.id === "humble" ? "Respected" : "Connected"}! +${choice.pointDelta} pts`
        : choice.pointDelta < 0
          ? "📉 Ouch... Rough strike."
          : null,
    );

    if (step + 1 < dialogues.length) {
      setTimeout(() => {
        setFeedback(null);
        setStep((s) => s + 1);
      }, 1200);
    } else {
      setTimeout(() => onComplete(), 1400);
    }
  }

  return (
    <div className="stage-container animate-reveal">
      <div className="surface-panel header-panel">
        <h2>
          🥂 Wrap-up:{" "}
          {isHighScorer
            ? "Standing Ovation"
            : isLowScorer
              ? "Ghost Light"
              : "Intermission"}
        </h2>
        <p className="annotation-text">FINAL SCORE: {score}</p>
      </div>

      {feedback && (
        <div
          className="surface-panel feedback-toast"
          style={{ marginBottom: "1rem" }}
        >
          {feedback}
        </div>
      )}

      {currentDialogue && (
        <DialogueBox
          speaker={currentDialogue.speaker}
          text={currentDialogue.text}
          choices={currentDialogue.choices}
          onChoice={handleChoice}
        />
      )}
    </div>
  );
}
