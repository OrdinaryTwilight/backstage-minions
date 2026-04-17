import { Navigate, useNavigate, useParams } from "react-router-dom";
import { useGame } from "../context/GameContext";
import { CHARACTERS, CUE_SHEETS, PRODUCTIONS } from "../data/gameData";

// Game Stage Components
import ConflictMinigame from "../components/game/ConflictMinigame";
import CueExecutionStage from "../components/game/CueExecutionStage";
import EquipmentStage from "../components/game/EquipmentStage";
import PlanningStage from "../components/game/PlanningStage";
import SoundDesignStage from "../components/game/SoundDesignStage";
import WrapUpScene from "../components/game/WrapUpScene";

/**
 * 1. Unified Stage Mapping
 * Defined outside the component to prevent redundant re-declarations on every render.
 */
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

  /**
   * 2. Refresh Guard
   * Prevents crashes by redirecting to home if the game context (state.session)
   * is lost during a browser refresh.
   */
  if (!state.session) return <Navigate to="/" replace />;

  /**
   * 3. Case-Insensitive Data Lookups
   * Ensures production and character data are found even if URL parameters
   * differ in casing from the source data.
   */
  const production = PRODUCTIONS.find(
    (p) => p.id.toLowerCase() === productionId?.toLowerCase(),
  );
  const char = CHARACTERS.find(
    (c) => c.id.toLowerCase() === charId?.toLowerCase(),
  );

  /**
   * 4. State & Stage Initialization
   * Retrieves the current stage component based on the session progress.
   */
  const currentStageKey =
    state.session.stages?.[state.session.currentStageIndex];
  const ActiveStage = STAGE_COMPONENTS[currentStageKey];

  /**
   * Use normalized production.id for CUE_SHEETS lookup to ensure
   * the correct data is retrieved even if the URL param is varied.
   */
  const departmentCues =
    production && char
      ? CUE_SHEETS[production.id]?.[char.department] || []
      : [];

  /**
   * 5. Conflict Interruption
   * Displays the conflict minigame immediately if an active conflict exists.
   */
  if (state.session.activeConflict) {
    return <ConflictMinigame conflict={state.session.activeConflict} />;
  }

  /**
   * 6. Critical Data Integrity Check
   * Replaces the multiple redundant checks with a single guard to ensure
   * the component has everything it needs to render.
   */
  if (!production || !char || !ActiveStage) {
    return (
      <div className="page-container animate-flicker">
        <h2
          className="annotation-text"
          style={{ color: "var(--bui-fg-danger)" }}
        >
          Initialization Error
        </h2>
        <p className="console-screen">
          System data missing for stage: {currentStageKey || "UNKNOWN"}
        </p>
      </div>
    );
  }

  function nextStage() {
    if (state.session.currentStageIndex < state.session.stages.length - 1) {
      dispatch({ type: "NEXT_STAGE" });
    } else {
      handleComplete();
    }
  }

  function handleComplete() {
    // Final score calculation
    const totalCues = departmentCues.length * 2;
    const hitRate = totalCues > 0 ? state.session.cuesHit / totalCues : 0;
    const stars = hitRate >= 0.9 ? 3 : hitRate >= 0.65 ? 2 : 1;

    // Standardized navigation to the results screen
    navigate(`/level-complete/${production.id}/${difficulty}/${char.id}`, {
      state: { stars },
    });

    dispatch({
      type: "COMPLETE_LEVEL",
      productionId: production.id,
      difficulty,
      stars,
    });
  }

  // 7. Dynamic Rendering of the Current Stage Component
  return (
    <ActiveStage
      cueSheet={departmentCues}
      onComplete={nextStage}
      productionId={production.id}
      difficulty={difficulty}
      charId={char.id}
    />
  );
}
