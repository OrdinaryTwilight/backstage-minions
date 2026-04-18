import { Navigate, useParams } from "react-router-dom";
import { useGame } from "../../context/GameContext";
import { useGameData } from "../../hooks/useGameData";
import { ConflictChoice } from "../../types/game";

// Components
import CableCoilingStage from "../../components/game/CableCoilingStage";
import ConflictMinigame from "../../components/game/ConflictMinigame";
import CueExecutionStage from "../../components/game/CueExecutionStage";
import DialogueBox from "../../components/game/DialogueBox";
import EquipmentStage from "../../components/game/EquipmentStage";
import OverworldStage from "../../components/game/OverworldStage";
import PlanningStage from "../../components/game/PlanningStage";
import SoundDesignStage from "../../components/game/SoundDesignStage";
import WrapUpScene from "../../components/game/WrapUpScene";

// Extracted Sub-Components and Hooks
import ShowControlNav from "./ShowControlNav";
import { SkipChoice, useLevelFlow } from "./useLevelFlow";

const STAGE_COMPONENTS: Record<string, any> = {
  equipment: EquipmentStage,
  planning: PlanningStage,
  sound_design: SoundDesignStage,
  execution: CueExecutionStage,
  cable_coiling: CableCoilingStage,
  wrapup: WrapUpScene,
};

export default function GameLevelPage() {
  const { productionId, difficulty, charId } = useParams();
  const { state, dispatch } = useGame();
  const { production, char, departmentCues } = useGameData(
    productionId,
    charId,
  );

  const {
    isInOverworld,
    strikeSkipMessage,
    handleStageAdvance,
    handleDismissSkip,
    handleOverworldComplete,
  } = useLevelFlow(productionId, difficulty, departmentCues);

  if (!state.session) return <Navigate to="/" replace />;

  const currentStageKey = state.session.stages[state.session.currentStageIndex];
  const nextStageKey =
    state.session.stages[state.session.currentStageIndex + 1];
  const ActiveStage = STAGE_COMPONENTS[currentStageKey];

  if (state.session.activeConflict) {
    return (
      <ConflictMinigame
        conflict={state.session.activeConflict}
        onResolved={(choice: any) => {
          const resolvedChoice = choice as ConflictChoice;
          dispatch({ type: "ADD_SCORE", delta: resolvedChoice.pointDelta });
          dispatch({
            type: "RESOLVE_CONFLICT",
            conflictId: state.session!.activeConflict!.id,
          });
          const contactToUnlock = (resolvedChoice as any).contactId;
          if (contactToUnlock)
            dispatch({ type: "ADD_CONTACT", contactId: contactToUnlock });
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

  if (strikeSkipMessage) {
    return (
      <div
        className="page-container"
        style={{ display: "flex", alignItems: "center", height: "100vh" }}
      >
        <DialogueBox
          speaker={strikeSkipMessage.speaker}
          text={strikeSkipMessage.text}
          choices={strikeSkipMessage.choices}
          onChoice={(choice: SkipChoice) => {
            dispatch({ type: "ADD_SCORE", delta: choice.pointDelta });
            handleDismissSkip();
          }}
        />
      </div>
    );
  }

  return (
    <div
      style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}
    >
      <div style={{ flex: 1, paddingBottom: "80px" }}>
        {isInOverworld ? (
          <div
            className="page-container"
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "100vh",
            }}
          >
            <OverworldStage
              onComplete={handleOverworldComplete}
              department={char?.department}
              charId={char?.id}
              nextStageKey={nextStageKey}
            />
          </div>
        ) : (
          <ActiveStage
            cueSheet={departmentCues}
            onComplete={handleStageAdvance}
            difficulty={difficulty}
          />
        )}
      </div>
      <ShowControlNav />
    </div>
  );
}
