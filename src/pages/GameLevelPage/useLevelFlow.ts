import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useGame } from "../../context/GameContext";
import { Cue, Difficulty } from "../../types/game";
import { calculateStars } from "../../utils/scoringEngine";

export function useLevelFlow(
  productionId?: string,
  difficulty?: string,
  departmentCues: Cue[] = [],
) {
  const { state, dispatch } = useGame();
  const navigate = useNavigate();

  const [isInOverworld, setIsInOverworld] = useState(false);

  useEffect(() => {
    const session = state.session;
    if (!session) return;

    const currentStageKey = session.stages[session.currentStageIndex];
    const noOverworldStages = ["wrapup"];

    if (noOverworldStages.includes(currentStageKey) && isInOverworld) {
      setIsInOverworld(false);
    }
  }, [state.session, isInOverworld]);

  function handleComplete() {
    const totalCues = departmentCues.length;
    const stars = calculateStars(state.session, totalCues);

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
    handleStageAdvance,
    handleOverworldComplete,
  };
}
