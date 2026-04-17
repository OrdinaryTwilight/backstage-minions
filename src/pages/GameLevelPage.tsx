import { useState } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { useGame } from "../context/GameContext";
import { useGameData } from "../hooks/useGameData";

// Components
import CableCoilingStage from "../components/game/CableCoilingStage";
import ConflictMinigame from "../components/game/ConflictMinigame";
import CueExecutionStage from "../components/game/CueExecutionStage";
import EquipmentStage from "../components/game/EquipmentStage";
import OverworldStage from "../components/game/OverworldStage";
import PlanningStage from "../components/game/PlanningStage";
import SoundDesignStage from "../components/game/SoundDesignStage";
import WrapUpScene from "../components/game/WrapUpScene";

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

  // Change this state to represent if we are in the Overworld walking around
  const [isInOverworld, setIsInOverworld] = useState(false);
  // Quit confirmation state
  const [showQuitConfirm, setShowQuitConfirm] = useState(false);

  if (!state.session) return <Navigate to="/" replace />;

  const currentStageKey = state.session.stages[state.session.currentStageIndex];
  const nextStageKey =
    state.session.stages[state.session.currentStageIndex + 1];
  const ActiveStage = STAGE_COMPONENTS[currentStageKey];

  function handleStageAdvance() {
    // Determine if the *current* stage and the *next* stage happen in the same place
    const noOverworldStages = ["wrapup"]; // Add any stages that shouldn't trigger an overworld walk
    if (currentStageKey === "wrapup") {
      handleComplete();
    } else {
      setIsInOverworld(true);
    }

    if (noOverworldStages.includes(currentStageKey)) {
      // Skip overworld, go straight to the next UI
      if (state.session!.currentStageIndex < state.session!.stages.length - 1) {
        dispatch({ type: "NEXT_STAGE" });
      } else {
        handleComplete();
      }
    } else {
      // Drop player into the overworld to walk to the next destination
      setIsInOverworld(true);
    }
  }

  function handleOverworldComplete() {
    // The player reached the booth and hit 'E'
    setIsInOverworld(false);
    if (state.session!.currentStageIndex < state.session!.stages.length - 1) {
      dispatch({ type: "NEXT_STAGE" });
    } else {
      handleComplete();
    }
  }

  function handleComplete() {
    const totalCues = departmentCues.length;
    let stars = 3;
    if (totalCues > 0) {
      const hitRate = state.session!.cuesHit / totalCues;
      stars = hitRate >= 0.9 ? 3 : hitRate >= 0.65 ? 2 : 1;
    } else {
      const currentScore = state.session?.score || 0;
      stars = currentScore >= 100 ? 3 : currentScore >= 50 ? 2 : 1;
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
  if (state.session.activeConflict) {
    return (
      <ConflictMinigame
        conflict={state.session.activeConflict}
        onResolved={() =>
          dispatch({
            type: "RESOLVE_CONFLICT",
            conflictId: state.session!.activeConflict!.id,
          })
        }
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

      <div
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          background: "var(--color-surface-translucent)",
          borderTop: "1px solid var(--glass-border)",
          padding: "10px",
          display: "flex",
          justifyContent: "center",
          zIndex: 5000,
          backdropFilter: "blur(10px)",
        }}
      >
        {showQuitConfirm ? (
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <span style={{ color: "var(--bui-fg-danger)", fontWeight: "bold" }}>
              Abandon show? You will fail!
            </span>
            <button
              onClick={() => navigate("/")}
              style={{
                background: "var(--bui-fg-danger)",
                color: "#fff",
                padding: "5px 15px",
                border: "none",
                borderRadius: "4px",
                fontWeight: "bold",
                cursor: "pointer",
              }}
            >
              Yes, Quit
            </button>
            <button
              onClick={() => setShowQuitConfirm(false)}
              style={{
                background: "#444",
                color: "#fff",
                padding: "5px 15px",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              Cancel
            </button>
          </div>
        ) : (
          <button
            onClick={() => setShowQuitConfirm(true)}
            style={{
              background: "transparent",
              color: "var(--color-pencil-light)",
              padding: "5px 15px",
              border: "1px solid var(--glass-border)",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            ⏏ Leave Show (Home)
          </button>
        )}
      </div>
    </div>
  );
}
