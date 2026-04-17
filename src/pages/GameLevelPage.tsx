import { useState } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { useGame } from "../context/GameContext";
import { useGameData } from "../hooks/useGameData";

// Components
import ConflictMinigame from "../components/game/ConflictMinigame";
import CueExecutionStage from "../components/game/CueExecutionStage";
import EquipmentStage from "../components/game/EquipmentStage";
import PlanningStage from "../components/game/PlanningStage";
import SoundDesignStage from "../components/game/SoundDesignStage";
import WrapUpScene from "../components/game/WrapUpScene";

const STAGE_COMPONENTS: Record<string, any> = {
  equipment: EquipmentStage,
  planning: PlanningStage,
  sound_design: SoundDesignStage,
  execution: CueExecutionStage,
  wrapup: WrapUpScene,
};

export default function GameLevelPage() {
  const { productionId, difficulty, charId } = useParams();
  const { state, dispatch } = useGame();
  const navigate = useNavigate();
  const { production, char, departmentCues } = useGameData(productionId, charId);
  
  const [isTransiting, setIsTransiting] = useState(false);

  if (!state.session) return <Navigate to="/" replace />;

  const currentStageKey = state.session.stages[state.session.currentStageIndex];
  const ActiveStage = STAGE_COMPONENTS[currentStageKey];

  function handleStageAdvance() {
    setIsTransiting(true);
    // Visual delay for the walking animation
    setTimeout(() => {
      setIsTransiting(false);
      if (state.session!.currentStageIndex < state.session!.stages.length - 1) {
        dispatch({ type: "NEXT_STAGE" });
      } else {
        handleComplete();
      }
    }, 1500);
  }

  function handleComplete() {
    const totalCues = departmentCues.length * 2;
    const hitRate = totalCues > 0 ? state.session!.cuesHit / totalCues : 0;
    const stars = hitRate >= 0.9 ? 3 : hitRate >= 0.65 ? 2 : 1;

    navigate(`/level-complete/${production?.id}/${difficulty}/${char?.id}`, {
      state: { stars }
    });

    dispatch({
      type: "COMPLETE_LEVEL",
      productionId: production?.id || "",
      difficulty: (difficulty as any) || "school",
      stars,
      unlockedStories: []
    });
  }

  if (isTransiting) {
    return (
      <div className="character-transit">
        <span className="walking-icon">{char?.icon}</span>
        <h2 className="annotation-text" style={{ marginTop: "2rem" }}>
          MOVING TO: {state.session.stages[state.session.currentStageIndex + 1]?.toUpperCase()}
        </h2>
      </div>
    );
  }

  if (state.session.activeConflict) {
    return <ConflictMinigame 
      conflict={state.session.activeConflict} 
      onResolved={() => dispatch({ type: "RESOLVE_CONFLICT", conflictId: state.session!.activeConflict!.id })}
    />;
  }

  if (!production || !char || !ActiveStage) {
    return (
      <div className="page-container animate-flicker">
        <h2 className="annotation-text">System Error</h2>
        <p className="console-screen">Missing data for stage: {currentStageKey || "UNKNOWN"}</p>
      </div>
    );
  }

  return (
    <ActiveStage 
      cueSheet={departmentCues} 
      onComplete={handleStageAdvance} 
    />
  );
}