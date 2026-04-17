import { Navigate, useNavigate, useParams } from "react-router-dom";
import CueExecutionStage from "../components/game/CueExecutionStage";
import EquipmentStage from "../components/game/EquipmentStage";
import PlanningStage from "../components/game/PlanningStage";
import SoundDesignStage from "../components/game/SoundDesignStage";
import WrapUpScene from "../components/game/WrapUpScene";
import { useGame } from "../context/GameContext";
import { useCharacter, useCueSheet, useProduction } from "../hooks/useGameData";

// Define mapping once at the top
const STAGE_COMPONENTS = {
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

  // Use custom hooks for data fetching with case-insensitive lookup
  // NOTE: Must be called at top level, before refresh guard check
  const production = useProduction(productionId);
  const char = useCharacter(charId);
  const departmentCues = useCueSheet(production?.id, char?.department);

  // Refresh Guard
  if (!state.session) return <Navigate to="/" replace />;

  // Determine current component
  const currentStageKey =
    state.session.stages?.[state.session.currentStageIndex];
  const ActiveStage = currentStageKey ? STAGE_COMPONENTS[currentStageKey as keyof typeof STAGE_COMPONENTS] : undefined;

  // Unified data check
  if (!production || !char || !ActiveStage) {
    return (
      <div className="page-container animate-flicker">
        <h2 className="annotation-text">System Error</h2>
        <p className="console-screen">
          Missing data for stage: {currentStageKey || "UNKNOWN"}
        </p>
      </div>
    );
  }

  function nextStage() {
    if (state.session && state.session.currentStageIndex < state.session.stages.length - 1) {
      dispatch({ type: "NEXT_STAGE" });
    } else {
      handleComplete();
    }
  }

  function handleComplete() {
    const totalCues = departmentCues.length * 2;
    const hitRate = totalCues > 0 && state.session ? state.session.cuesHit / totalCues : 0;
    const stars = hitRate >= 0.9 ? 3 : hitRate >= 0.65 ? 2 : 1;

    navigate(`/level-complete/${production!.id}/${difficulty}/${char!.id}`, {
      state: { stars },
    });

    dispatch({
      type: "COMPLETE_LEVEL",
      productionId: production!.id,
      difficulty: difficulty as "school" | "community" | "professional",
      stars,
      unlockedStories: [], // Add story unlocking logic here if needed
    });
  }

  // if (state.session.activeConflict) {
  //   return <ConflictMinigame conflict={state.session.activeConflict} />;
  // }

  return <ActiveStage cueSheet={departmentCues} onComplete={nextStage} />;
}
