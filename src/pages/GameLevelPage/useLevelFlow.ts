import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useGame } from "../../context/GameContext";
import { Cue, Difficulty } from "../../types/game";
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
      difficulty: (difficulty || "school") as Difficulty,
      stars,
      unlockedStories: [],
    });

    navigate("/productions");
  }

  function handleStageAdvance() {
    const session = state.session;
    if (!session) return;

    const currentIdx = session.currentStageIndex;
    const currentStageKey = session.stages[currentIdx];
    const noOverworldStages = ["wrapup"];

    if (currentStageKey === "wrapup") {
      handleComplete();
    } else if (noOverworldStages.includes(currentStageKey)) {
      if (currentIdx < session.stages.length - 1) {
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
    const session = state.session;
    if (!session) return;

    setIsInOverworld(false);
    if (session.currentStageIndex < session.stages.length - 1) {
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
