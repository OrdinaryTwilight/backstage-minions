import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ConflictMinigame from "../components/game/ConflictMinigame";
import LiveShowStage from "../components/game/LiveShowStage";
import PlanningStage from "../components/game/PlanningStage";
import RehearsalStage from "../components/game/RehearsalStage";
import WrapUpScene from "../components/game/WrapUpScene";
import { useGame } from "../context/GameContext";
import { STAGE_LABELS, STAGE_ORDER } from "../data/constants";
import { CHARACTERS, CONFLICTS, CUE_SHEETS, STORIES } from "../data/gameData";

function starsFromSession(session, totalCues) {
  if (!session) return 0;
  const hitRate = totalCues > 0 ? session.cuesHit / totalCues : 0;
  if (hitRate >= 0.9) return 3;
  if (hitRate >= 0.65) return 2;
  return 1;
}

function pickConflict(trigger, seen) {
  const eligible = CONFLICTS.filter(
    (c) => c.trigger === trigger && !seen.includes(c.id),
  );
  if (!eligible.length || Math.random() > 0.6) return null;
  return eligible[Math.floor(Math.random() * eligible.length)];
}

export default function GameLevelPage() {
  const { productionId, difficulty, charId } = useParams();
  const { state, dispatch } = useGame();
  const navigate = useNavigate();

  const [stage, setStage] = useState("planning");
  const [conflict, setConflict] = useState(null);
  const [penaltyMultiplier, setPenaltyMultiplier] = useState(1);

  // Crash guard: redirects user safely if page is refreshed mid-game
  useEffect(() => {
    if (!state?.session) navigate("/");
  }, [state?.session, navigate]);

  // Prevent fatal render errors before redirect kicks in
  if (!state?.session) return null;

  const char = CHARACTERS.find((c) => c.id === charId);
  const cueSheet = CUE_SHEETS[productionId]?.[char?.department] ?? [];
  const seen = state?.session?.conflictsSeen ?? [];

  function advanceTo(nextStage) {
    const c = pickConflict(nextStage, seen);
    if (c) {
      setConflict(c);
      return;
    }
    setStage(nextStage);
    dispatch({ type: "ADVANCE_STAGE" });
  }

  function onConflictResolved(outcome) {
    setConflict(null);
    if (outcome === "escalated") {
      setPenaltyMultiplier(0.7);
    } else if (outcome === "fail") {
      handleFail();
      return;
    }

    dispatch({ type: "ADVANCE_STAGE" });
    setStage((prev) => STAGE_ORDER[STAGE_ORDER.indexOf(prev) + 1] ?? "wrapup");
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

    dispatch({
      type: "COMPLETE_LEVEL",
      productionId,
      difficulty,
      stars,
      unlockedStories: newStories,
    });
    navigate(`/level-complete/${productionId}/${difficulty}/${charId}`, {
      state: { stars, newStories },
    });
  }

  return (
    <div className="stage-container">
      <div style={{ marginBottom: "1rem", display: "flex", gap: "0.5rem" }}>
        {STAGE_ORDER.map((s, i) => {
          const current = STAGE_ORDER.indexOf(stage);
          return (
            <div
              key={s}
              style={{
                flex: 1,
                padding: "0.5rem",
                background: i <= current ? "var(--accent)" : "var(--surface2)",
                borderRadius: "4px",
                textAlign: "center",
                fontSize: "0.8rem",
                fontWeight: i <= current ? "bold" : "normal",
              }}
            >
              {i < current ? "✓ " : ""}
              {STAGE_LABELS[s]}
            </div>
          );
        })}
      </div>

      <div className="surface-panel" style={{ padding: "0.5rem" }}>
        <strong>Score: {state?.session?.score ?? 0}</strong>
      </div>

      {conflict ? (
        <ConflictMinigame conflict={conflict} onResolved={onConflictResolved} />
      ) : (
        <>
          {stage === "planning" && (
            <PlanningStage onComplete={() => advanceTo("rehearsal")} />
          )}
          {stage === "rehearsal" && (
            <RehearsalStage
              cues={cueSheet}
              penaltyMultiplier={penaltyMultiplier}
              onComplete={() => advanceTo("liveshow")}
              onFail={handleFail}
            />
          )}
          {stage === "liveshow" && (
            <LiveShowStage
              cues={cueSheet}
              penaltyMultiplier={penaltyMultiplier}
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
