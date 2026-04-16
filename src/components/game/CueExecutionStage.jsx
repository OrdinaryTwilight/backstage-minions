import { memo, useEffect, useRef, useState } from "react";
import { useGame } from "../../context/GameContext";
import { DURATIONS, SCORING } from "../../data/constants";
import { CHARACTERS } from "../../data/gameData";

import CueStack from "../ui/CueStack";
import DepartmentMixer from "../ui/DepartmentMixer";
import MasterControl from "../ui/MasterControl";

function CueExecutionStage({
  stageType,
  cues,
  penaltyMultiplier = 1,
  onComplete,
  onFail,
}) {
  const { state, dispatch } = useGame();
  const [elapsed, setElapsed] = useState(0);
  const [cueResults, setCueResults] = useState({});
  const [active, setActive] = useState(false);
  const [done, setDone] = useState(false);
  const [failed, setFailed] = useState(false);

  const [smLine, setSmLine] = useState(
    stageType === "live"
      ? "Places everyone. This is the real thing."
      : "Standby for rehearsal.",
  );

  const char = CHARACTERS.find((c) => c.id === state?.session?.characterId);
  const isLiked = state?.contacts?.includes("Stage Manager") ?? false;
  const currentLives = state?.session?.lives; // Direct reference for heart tracking

  const startRef = useRef(null);
  const rafRef = useRef(null);

  const durationMs =
    stageType === "rehearsal" ? DURATIONS.REHEARSAL_MS : DURATIONS.LIVE_SHOW_MS;
  const scoreDelta =
    stageType === "rehearsal" ? SCORING.REHEARSAL_HIT : SCORING.LIVE_SHOW_HIT;

  useEffect(() => {
    if (!active) return;
    startRef.current = performance.now();
    function tick() {
      const now = performance.now() - startRef.current;
      setElapsed(now);
      if (now >= durationMs) {
        setElapsed(durationMs);
        setDone(true);
        return;
      }
      rafRef.current = requestAnimationFrame(tick);
    }
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [active, durationMs]);

  useEffect(() => {
    if (!done) return;
    if (stageType === "rehearsal") {
      const missed = cues.filter((c) => !cueResults[c.id]?.hit).length;
      if (state.session.difficulty === "professional" && missed > 1) {
        onFail();
        return;
      }
    }
    onComplete();
  }, [
    done,
    cues,
    cueResults,
    onComplete,
    onFail,
    stageType,
    state.session.difficulty,
  ]);

  const nextCue = cues.find((c) => !cueResults[c.id]);

  function handleMasterGo(event) {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    if (!active && !done) {
      setActive(true);
      setSmLine("And... go!");
      return;
    }
    if (!active || !nextCue) return;

    const timeDiff = Math.abs(elapsed - nextCue.targetMs);
    const hit = timeDiff <= nextCue.windowMs * penaltyMultiplier;
    setCueResults((r) => ({ ...r, [nextCue.id]: { hit } }));

    if (hit) {
      dispatch({ type: "CUE_HIT" });
      dispatch({ type: "ADD_SCORE", delta: scoreDelta });
      setSmLine(isLiked ? "Brilliant timing!" : "Good cue.");
    } else {
      dispatch({ type: "CUE_MISSED" });
      dispatch({ type: "LOSE_LIFE" });
      setSmLine(
        (char?.stats?.social ?? 5) < 7
          ? "Wake up at the board!"
          : "Missed cue! Stay focused.",
      );

      // BUG FIX: Check context state directly to catch immediate life loss
      if ((state.session?.lives || 1) - 1 <= 0) {
        if (stageType === "rehearsal") {
          setActive(false);
          setFailed(true);
        } else {
          onFail();
        }
      }
    }
  }

  if (failed && stageType === "rehearsal") {
    return (
      <div
        className="hardware-panel"
        style={{ textAlign: "center", padding: "3rem 1.5rem" }}
      >
        <h2 style={{ color: "var(--bui-fg-danger)", marginBottom: "1rem" }}>
          ❌ Rehearsal Stopped
        </h2>
        <p style={{ color: "var(--color-pencil-light)", marginBottom: "2rem" }}>
          The Stage Manager called a hold. You missed too many cues.
        </p>
        <button
          onClick={() => {
            dispatch({ type: "ADD_SCORE", delta: SCORING.REDO_PENALTY });
            dispatch({ type: "RESET_LIVES" });
            setFailed(false);
            setElapsed(0);
            setCueResults({});
          }}
          className="action-button btn-accent"
        >
          Redo Rehearsal ({SCORING.REDO_PENALTY} pts)
        </button>
      </div>
    );
  }

  return (
    <div className="hardware-panel">
      <div className="comms-panel" style={{ color: "var(--bui-fg-success)" }}>
        <div
          style={{ fontSize: "0.7rem", opacity: 0.6, marginBottom: "0.25rem" }}
        >
          CH 1 - SM COMMS
        </div>
        <div>
          <span className={`status-led ${active ? "on" : ""}`}></span> {smLine}
        </div>
      </div>

      <div className="desktop-two-column">
        <div className="desktop-col-main">
          <DepartmentMixer
            department={char?.department}
            active={active}
            progress={(elapsed / durationMs) * 100}
          />
          <CueStack
            department={char?.department}
            cues={cues}
            cueResults={cueResults}
            nextCue={nextCue}
            elapsed={elapsed}
            duration={durationMs}
          />
        </div>
        <div className="desktop-col-side">
          <MasterControl
            lives={currentLives}
            active={active}
            done={done}
            onGo={handleMasterGo}
          />
        </div>
      </div>
    </div>
  );
}

export default memo(CueExecutionStage);
