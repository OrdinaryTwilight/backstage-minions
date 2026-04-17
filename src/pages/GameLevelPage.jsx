import { Navigate, useNavigate, useParams } from "react-router-dom";
import ConflictMinigame from "../components/game/ConflictMinigame";
import CueExecutionStage from "../components/game/CueExecutionStage";
import EquipmentStage from "../components/game/EquipmentStage";
import PlanningStage from "../components/game/PlanningStage";
import SoundDesignStage from "../components/game/SoundDesignStage";
import WrapUpScene from "../components/game/WrapUpScene";
import { useGame } from "../context/GameContext";
import { CHARACTERS, CUE_SHEETS, PRODUCTIONS } from "../data/gameData";

// Defensive Stage Mapping
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

  // 1. Session Persistence Guard: Redirect if session is missing (e.g. on refresh)
  if (!state.session) {
    return <Navigate to="/" replace />;
  }

  const char = CHARACTERS.find((c) => c.id === charId);
  const production = PRODUCTIONS.find((p) => p.id === productionId);

  // 2. Data Integrity Guard: Ensure production and character exist
  if (!production || !char) {
    return (
      <div className="page-container animate-flicker">
        Critical Error: System Data Missing
      </div>
    );
  }

  // 3. Stage Logic: Determine which component to show
  const currentStageKey = state.session.stages[state.session.currentStageIndex];
  const CurrentStageComponent = STAGE_COMPONENTS[currentStageKey];

  // 4. Cue Sheet Guard: Fixes the potential "reading '0'" error
  const departmentCues = CUE_SHEETS[productionId]?.[char.department] || [];

  function nextStage() {
    if (state.session.currentStageIndex < state.session.stages.length - 1) {
      dispatch({ type: "NEXT_STAGE" });
    } else {
      handleComplete();
    }
  }

  function handleComplete() {
    const totalCues = departmentCues.length * 2;
    const hitRate = totalCues > 0 ? state.session.cuesHit / totalCues : 0;
    const stars = hitRate >= 0.9 ? 3 : hitRate >= 0.65 ? 2 : 1;

    // Navigate to results BEFORE clearing data
    navigate(`/level-complete/${productionId}/${difficulty}/${charId}`, {
      state: { stars },
    });

    dispatch({
      type: "COMPLETE_LEVEL",
      productionId,
      difficulty,
      stars,
    });
  }

  // Conflict Interruption Logic
  if (state.session.activeConflict) {
    return <ConflictMinigame conflict={state.session.activeConflict} />;
  }

  if (!CurrentStageComponent) {
    return (
      <div className="page-container">
        Error: Component {currentStageKey} not found.
      </div>
    );
  }

  return (
    <CurrentStageComponent cueSheet={departmentCues} onComplete={nextStage} />
  );
}
