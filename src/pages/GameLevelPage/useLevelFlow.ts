import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useGame } from "../../context/GameContext";
import { Cue } from "../../types/game";
import { calculateStars } from "../../utils/scoringEngine";

export interface SkipChoice {
  id: string;
  text: string;
  pointDelta: number;
}

export function useLevelFlow(
  productionId?: string,
  difficulty?: string,
  departmentCues: Cue[] = [],
) {
  const { state, dispatch } = useGame();
  const navigate = useNavigate();

  const [isInOverworld, setIsInOverworld] = useState(false);
  const [strikeSkipMessage, setStrikeSkipMessage] = useState<{
    speaker: string;
    text: string;
    choices: SkipChoice[];
  } | null>(null);

  function handleComplete() {
    const totalCues = departmentCues.length;
    const currentScore = state.session?.score || 0;
    const cuesHit = state.session?.cuesHit || 0;

    const stars = calculateStars(totalCues, cuesHit, currentScore);

    dispatch({
      type: "COMPLETE_LEVEL",
      productionId: productionId || "",
      difficulty: (difficulty as any) || "school",
      stars,
      unlockedStories: [],
    });

    navigate("/productions");
  }

  function handleStageAdvance() {
    const currentIdx = state.session!.currentStageIndex;
    const nextStage = state.session!.stages[currentIdx + 1];

    // Dynamic Story Event interceptor
    if (nextStage === "cable_coiling" && Math.random() > 0.5) {
      setStrikeSkipMessage({
        speaker: "Senior Technician",
        text: "Hey, take a breather. The locals have the strike handled tonight. Head straight to the SM desk and sign off.",
        choices: [
          {
            id: "skip_strike",
            text: '"Copy that. Thanks for the help!"',
            pointDelta: 5,
          },
        ],
      });
      return;
    }

    const currentStageKey = state.session!.stages[currentIdx];
    const noOverworldStages = ["wrapup"];

    if (currentStageKey === "wrapup") {
      handleComplete();
    } else if (noOverworldStages.includes(currentStageKey)) {
      if (currentIdx < state.session!.stages.length - 1) {
        dispatch({ type: "NEXT_STAGE" });
      } else {
        handleComplete();
      }
    } else {
      setIsInOverworld(true);
    }
  }

  function handleDismissSkip() {
    setStrikeSkipMessage(null);
    dispatch({ type: "NEXT_STAGE" }); // Skips the skipped stage
    dispatch({ type: "NEXT_STAGE" }); // Moves to the stage after
  }

  function handleOverworldComplete() {
    setIsInOverworld(false);
    if (state.session!.currentStageIndex < state.session!.stages.length - 1) {
      dispatch({ type: "NEXT_STAGE" });
    } else {
      handleComplete();
    }
  }

  return {
    isInOverworld,
    strikeSkipMessage,
    handleStageAdvance,
    handleDismissSkip,
    handleOverworldComplete,
  };
}
