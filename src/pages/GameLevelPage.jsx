import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ConflictMinigame from "../components/game/ConflictMinigame";
import CueExecutionStage from "../components/game/CueExecutionStage";
import EquipmentStage from "../components/game/EquipmentStage"; // New Stage
import PlanningStage from "../components/game/PlanningStage";
import SoundDesignStage from "../components/game/SoundDesignStage"; // New Stage
import WrapUpScene from "../components/game/WrapUpScene";
import { useGame } from "../context/GameContext";
import { STAGE_LABELS, STAGE_ORDER } from "../data/constants";
import { CHARACTERS, CONFLICTS, CUE_SHEETS } from "../data/gameData";

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
  const seen = state?.session?.conflictsSeen ?? [];

  useEffect(() => {
    if (!state?.session) navigate("/");
  }, [state?.session, navigate]);

  if (!state?.session) return null;

  function advanceTo(nextStage) {
    const c = pickConflict(nextStage, seen);
    if (c) {
      setConflict(c);
      return;
    }

    // Role-based logic: Skip planning stages that don't match the department
    if (nextStage === "planning" && !isLighting) {
      setStage("sound_design");
      return;
    }
    if (nextStage === "sound_design" && !isSound) {
      setStage("rehearsal");
      return;
    }

    setStage(nextStage);
    dispatch({ type: "ADVANCE_STAGE" });
  }

  function pickConflict(trigger, seenIds) {
    const eligible = CONFLICTS.filter(
      (c) => c.trigger === trigger && !seenIds.includes(c.id),
    );
    if (!eligible.length || Math.random() > 0.6) return null;
    return eligible[Math.floor(Math.random() * eligible.length)];
  }

  function onConflictResolved(outcome) {
    setConflict(null);
    if (outcome === "escalated") setPenaltyMultiplier(0.7);
    if (outcome === "fail") {
      handleFail();
      return;
    }

    const currentIndex = STAGE_ORDER.indexOf(stage);
    const nextStage = STAGE_ORDER[currentIndex + 1] ?? "wrapup";
    advanceTo(nextStage);
  }

  function handleFail() {
    dispatch({ type: "FAIL_LEVEL" });
    navigate(`/level-failed/${productionId}/${difficulty}/${charId}`);
  }

  function handleComplete() {
    const stars = starsFromSession(state.session, cueSheet.length * 2);
    const newStories = STORIES.filter(
      (s) =>
        s.unlockedBy.productionId === productionId &&
        (difficulty === "professional" ||
          s.unlockedBy.difficulty === difficulty) &&
        stars >= s.unlockedBy.minStars,
    ).map((s) => s.id);

    // Navigate FIRST, then dispatch completion to avoid the "Crash Guard" redirect
    navigate(`/level-complete/${productionId}/${difficulty}/${charId}`, {
      state: { stars, newStories },
    });

    dispatch({
      type: "COMPLETE_LEVEL",
      productionId,
      difficulty,
      stars,
      unlockedStories: newStories,
    });
  }

  return (
    <div className="page-container">
      {/* Stage Progress Header */}
      <div style={{ marginBottom: "1rem", display: "flex", gap: "0.5rem" }}>
        {STAGE_ORDER.map((s, i) => {
          const current = STAGE_ORDER.indexOf(stage);
          const isHidden =
            (s === "planning" && !isLighting) ||
            (s === "sound_design" && !isSound);
          if (isHidden) return null;

          return (
            <div
              key={s}
              style={{
                flex: 1,
                padding: "0.5rem",
                borderRadius: "4px",
                textAlign: "center",
                fontSize: "0.7rem",
                background:
                  i <= current
                    ? "var(--bui-fg-success)"
                    : "var(--color-surface-2)",
                color: i <= current ? "#000" : "#888",
              }}
            >
              {STAGE_LABELS[s]}
            </div>
          );
        })}
      </div>

      {conflict ? (
        <ConflictMinigame conflict={conflict} onResolved={onConflictResolved} />
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
            <PlanningStage onComplete={() => advanceTo("sound_design")} />
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
              onFail={handleFail}
            />
          )}

          {stage === "liveshow" && (
            <CueExecutionStage
              stageType="live"
              cues={cueSheet}
              penaltyMultiplier={penaltyMultiplier * gearMultiplier}
              onComplete={() => advanceTo("wrapup")}
              onFail={handleFail}
            />
          )}

          {stage === "wrapup" && <WrapUpScene onComplete={handleComplete} />}
        </>
      )}
    </div>
  );
}
