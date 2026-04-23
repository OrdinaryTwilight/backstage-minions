import { Navigate, useParams } from "react-router-dom";
import { useGame } from "../../context/GameContext";
import { useGameData } from "../../hooks/useGameData";

// Components
import CableCoilingStage from "../../components/game/CableCoilingStage/CableCoilingStage";
import ConflictMinigame from "../../components/game/ConflictMinigame";
import CueExecutionStage from "../../components/game/CueExecutionStage";
import EquipmentStage from "../../components/game/EquipmentStage";
import OverworldStage from "../../components/game/OverworldStage";
import PlanningStage from "../../components/game/PlanningStage";
import SoundDesignStage from "../../components/game/SoundDesignStage";
import WrapUpScene from "../../components/game/WrapUpScene";
import Button from "../../components/ui/Button";

// UX FIX: Priority 1 - Import the new stages
import FlySystemExecution from "../../components/game/ScenicStage/FlySystemExecution";
import CallboardPuzzle from "../../components/game/StageManagementStage/CallboardPuzzle";
import WardrobeStage from "../../components/game/WardrobeStage";

// Extracted Sub-Components and Hooks
import ShowControlNav from "./ShowControlNav";
import { useLevelFlow } from "./useLevelFlow";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const STAGE_COMPONENTS: Record<string, any> = {
  equipment: EquipmentStage,
  planning: PlanningStage,
  sound_design: SoundDesignStage,
  cue_execution: CueExecutionStage,
  cable_coiling: CableCoilingStage,
  stage_management: CallboardPuzzle, // Wired!
  scenic: FlySystemExecution, // Wired!
  wardrobe: WardrobeStage, // Wired!
  wrapup: WrapUpScene,
};

export default function GameLevelPage() {
  const { productionId, difficulty, charId } = useParams();
  const { state, dispatch } = useGame();
  const { production, char, departmentCues } = useGameData(
    productionId,
    charId,
  );

  const { isInOverworld, handleStageAdvance, handleOverworldComplete } =
    useLevelFlow(productionId, difficulty, departmentCues);

  if (!state.session) return <Navigate to="/" replace />;

  const session = state.session;
  const currentStageKey = session.stages[session.currentStageIndex];
  const nextStageKey = session.stages[session.currentStageIndex + 1];
  const ActiveStage = STAGE_COMPONENTS[currentStageKey];

  if (session.activeConflict) {
    return (
      <ConflictMinigame
        conflict={session.activeConflict}
        onResolved={() => {
          dispatch({
            type: "RESOLVE_CONFLICT",
            conflictId: session.activeConflict?.id ?? "",
            pointDelta: 0,
          });
        }}
      />
    );
  }

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

  let stageContent;

  if (isInOverworld) {
    stageContent = (
      <div
        className="page-container"
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "flex-start",
          paddingTop: "var(--space-xl)",
          minHeight: "100vh",
        }}
      >
        <OverworldStage
          onComplete={handleOverworldComplete}
          department={char?.department}
          charId={char?.id}
          nextStageKey={nextStageKey}
        />
      </div>
    );
  } else if (
    currentStageKey === "cue_execution" &&
    (!departmentCues || departmentCues.length === 0)
  ) {
    stageContent = (
      <div
        style={{
          flex: 1,
          paddingBottom: "80px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "80vh",
        }}
      >
        <div
          className="page-container animate-pop"
          style={{
            textAlign: "center",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "2rem",
          }}
        >
          <h2
            style={{
              color: "var(--bui-fg-warning)",
              fontSize: "2rem",
              fontFamily: "var(--font-sketch)",
            }}
          >
            🚧 Under Construction 🚧
          </h2>
          <p
            style={{
              fontSize: "1.2rem",
              color: "var(--color-pencil-light)",
              maxWidth: "600px",
              lineHeight: "1.6",
            }}
          >
            The <strong>{char.department.toUpperCase()}</strong> department's
            execution phase is currently being built in the shop. Check back in
            a future update!
          </p>
          <Button
            variant="accent"
            onClick={handleStageAdvance}
            style={{ padding: "1rem 2rem", fontSize: "1.2rem" }}
          >
            Skip to Post-Show →
          </Button>
        </div>
      </div>
    );
  } else {
    stageContent = (
      <ActiveStage
        cueSheet={departmentCues}
        onComplete={handleStageAdvance}
        difficulty={difficulty}
      />
    );
  }

  return (
    <div
      style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}
    >
      <div style={{ flex: 1, paddingBottom: "80px" }}>{stageContent}</div>
      <ShowControlNav />
    </div>
  );
}
