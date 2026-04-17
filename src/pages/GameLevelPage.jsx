import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ConflictMinigame from "../components/game/ConflictMinigame";
import CueExecutionStage from "../components/game/CueExecutionStage";
import EquipmentStage from "../components/game/EquipmentStage";
import PlanningStage from "../components/game/PlanningStage";
import SoundDesignStage from "../components/game/SoundDesignStage";
import WrapUpScene from "../components/game/WrapUpScene";
import { useGame } from "../context/GameContext";
import { STAGE_ORDER } from "../data/constants";
import { CHARACTERS, CONFLICTS, CUE_SHEETS, STORIES } from "../data/gameData";

export default function GameLevelPage() {
  const { productionId, difficulty, charId } = useParams();
  const { state, dispatch } = useGame();
  const navigate = useNavigate();

  const [stage, setStage] = useState("equipment");
  const [conflict, setConflict] = useState(null);
  const [gearMultiplier, setGearMultiplier] = useState(1);
  const [penaltyMultiplier, setPenaltyMultiplier] = useState(1);

  const char = CHARACTERS.find((c) => c.id === charId);
  const isLighting = char?.department === "lighting";
  const isSound = char?.department === "sound";
  const cueSheet = CUE_SHEETS[productionId]?.[char?.department] ?? [];

  useEffect(() => {
    if (!state?.session) navigate("/");
  }, [state?.session, navigate]);

  if (!state?.session) return null;

  function advanceTo(nextStage) {
    const eligible = CONFLICTS.filter(
      (c) =>
        c.trigger === nextStage && !state.session.conflictsSeen.includes(c.id),
    );
    if (eligible.length && Math.random() > 0.6) {
      setConflict(eligible[Math.floor(Math.random() * eligible.length)]);
      return;
    }

    // Role-based logic: Skip irrelevant stages
    if (nextStage === "planning" && !isLighting) {
      advanceTo("sound_design");
      return;
    }
    if (nextStage === "sound_design" && !isSound) {
      advanceTo("rehearsal");
      return;
    }

    setStage(nextStage);
    dispatch({ type: "ADVANCE_STAGE" });
  }

  function handleComplete() {
    const totalCues = cueSheet.length * 2;
    const hitRate = totalCues > 0 ? state.session.cuesHit / totalCues : 0;
    const stars = hitRate >= 0.9 ? 3 : hitRate >= 0.65 ? 2 : 1;

    const newStories = STORIES.filter(
      (s) =>
        s.unlockedBy.productionId === productionId &&
        stars >= s.unlockedBy.minStars,
    ).map((s) => s.id);

    // 1. Navigate FIRST while session still exists
    navigate(`/level-complete/${productionId}/${difficulty}/${charId}`, {
      state: { stars, newStories },
    });

    // 2. Record the completion
    dispatch({
      type: "COMPLETE_LEVEL",
      productionId,
      difficulty,
      stars,
      unlockedStories: newStories,
    });

    // Clear the session only when the player chooses to exit the results screen.
  }

  return (
    <div className="page-container">
      {/* HUD and Progress UI */}
      <div
        className="surface-panel"
        style={{
          textAlign: "center",
          borderBottom: "2px solid var(--glass-border)",
        }}
      >
        <h3 style={{ color: "var(--bui-fg-info)" }}>
          SCORE: {state.session.score}
        </h3>
      </div>

      {conflict ? (
        <ConflictMinigame
          conflict={conflict}
          onResolved={(outcome) => {
            setConflict(null);
            if (outcome === "escalated") setPenaltyMultiplier(0.7);
            const next =
              STAGE_ORDER[STAGE_ORDER.indexOf(stage) + 1] ?? "wrapup";
            advanceTo(next);
          }}
        />
      ) : (
        <>
          {stage === "equipment" && (
            <EquipmentStage
              onSelect={(pkg) => {
                setGearMultiplier(pkg.multiplier);
                dispatch({ type: "ADD_SCORE", delta: pkg.bonus });
                advanceTo("planning");
              }}
            />
          )}
          {stage === "planning" && isLighting && (
            <PlanningStage onComplete={() => advanceTo("rehearsal")} />
          )}
          {stage === "sound_design" && isSound && (
            <SoundDesignStage onComplete={() => advanceTo("rehearsal")} />
          )}
          {stage === "rehearsal" && (
            <CueExecutionStage
              stageType="rehearsal"
              cues={cueSheet}
              penaltyMultiplier={penaltyMultiplier * gearMultiplier}
              onComplete={() => advanceTo("liveshow")}
              onFail={() => navigate("/level-failed")}
            />
          )}
          {stage === "liveshow" && (
            <CueExecutionStage
              stageType="live"
              cues={cueSheet}
              penaltyMultiplier={penaltyMultiplier * gearMultiplier}
              onComplete={() => advanceTo("wrapup")}
              onFail={() => navigate("/level-failed")}
            />
          )}
          {stage === "wrapup" && <WrapUpScene onComplete={handleComplete} />}
        </>
      )}
    </div>
  );
}
