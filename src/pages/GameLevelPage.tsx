// src/pages/GameLevelPage.tsx
import { useState } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { useGame } from "../context/GameContext";
import { useGameData } from "../hooks/useGameData";
import { ConflictChoice } from "../types/game"; //

// Components
import CableCoilingStage from "../components/game/CableCoilingStage";
import ConflictMinigame from "../components/game/ConflictMinigame";
import CueExecutionStage from "../components/game/CueExecutionStage";
import DialogueBox from "../components/game/DialogueBox";
import EquipmentStage from "../components/game/EquipmentStage";
import OverworldStage from "../components/game/OverworldStage";
import PlanningStage from "../components/game/PlanningStage";
import SoundDesignStage from "../components/game/SoundDesignStage";
import WrapUpScene from "../components/game/WrapUpScene";

// Define a specific type for the skip dialogue choice to avoid 'any'
interface SkipChoice {
  id: string;
  text: string;
  pointDelta: number;
}

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
  const navigate = useNavigate();
  const { production, char, departmentCues } = useGameData(
    productionId,
    charId,
  );

  const [isInOverworld, setIsInOverworld] = useState(false);
  const [strikeSkipMessage, setStrikeSkipMessage] = useState<{
    speaker: string;
    text: string;
    choices: SkipChoice[];
  } | null>(null);

  if (!state.session) return <Navigate to="/" replace />;

  const currentStageKey = state.session.stages[state.session.currentStageIndex];
  const nextStageKey =
    state.session.stages[state.session.currentStageIndex + 1];
  const ActiveStage = STAGE_COMPONENTS[currentStageKey];

  function handleComplete() {
    const totalCues = departmentCues.length;
    const currentScore = state.session?.score || 0;
    let stars: number;

    // Fixed: Extracted nested ternaries into independent if/else statements
    // Fixed: Removed useless initial assignment to 'stars'
    if (totalCues > 0) {
      const hitRate = state.session!.cuesHit / totalCues;
      if (hitRate >= 0.9) stars = 3;
      else if (hitRate >= 0.65) stars = 2;
      else stars = 1;
    } else {
      if (currentScore >= 100) stars = 3;
      else if (currentScore >= 50) stars = 2;
      else stars = 1;
    }

    navigate(`/level-complete/${production?.id}/${difficulty}/${char?.id}`, {
      state: { stars },
    });

    dispatch({
      type: "COMPLETE_LEVEL",
      productionId: production?.id || "",
      difficulty: (difficulty as any) || "school",
      stars,
      unlockedStories: [],
    });
  }

  function handleStageAdvance() {
    const currentIdx = state.session!.currentStageIndex;
    const nextStage = state.session!.stages[currentIdx + 1];

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

    const noOverworldStages = ["wrapup"];
    if (currentStageKey === "wrapup") {
      handleComplete();
    } else if (noOverworldStages.includes(currentStageKey)) {
      if (state.session!.currentStageIndex < state.session!.stages.length - 1) {
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
    dispatch({ type: "NEXT_STAGE" });
    dispatch({ type: "NEXT_STAGE" });
  }

  function handleOverworldComplete() {
    setIsInOverworld(false);
    if (state.session!.currentStageIndex < state.session!.stages.length - 1) {
      dispatch({ type: "NEXT_STAGE" });
    } else {
      handleComplete();
    }
  }

  // Fixed: Cast choice to ConflictChoice to resolve pointDelta and contactId errors
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

          if (resolvedChoice.sideEffect === "unlock_casey_contact") {
            // Handle specific side effects if needed
          }

          // Check for contactId or specific contact strings from data
          const contactToUnlock = (resolvedChoice as any).contactId;
          if (contactToUnlock) {
            dispatch({ type: "ADD_CONTACT", contactId: contactToUnlock });
          }
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
          />
        )}
      </div>
      {/* Footer / Quit UI remains unchanged */}
    </div>
  );
}
