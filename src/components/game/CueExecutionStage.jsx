import { memo, useEffect, useRef, useState } from "react";
import { useGame } from "../../context/GameContext";
import { DURATIONS, SCORING } from "../../data/constants";
import { CHARACTERS } from "../../data/gameData";

// Modular UI Components
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

  const startRef = useRef(null);
  const rafRef = useRef(null);

  // Dynamic values based on stageType
  const lives = state?.session?.lives ?? (stageType === "live" ? 2 : 3);
  const difficulty = state?.session?.difficulty ?? "school";
  const durationMs =
    stageType === "rehearsal" ? DURATIONS.REHEARSAL_MS : DURATIONS.LIVE_SHOW_MS;
  const scoreDelta =
    stageType === "rehearsal" ? SCORING.REHEARSAL_HIT : SCORING.LIVE_SHOW_HIT;

  // --- TIMER LOGIC ---
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

  // --- COMPLETION LOGIC ---
  useEffect(() => {
    if (!done) return;

    if (stageType === "rehearsal") {
      const missed = cues.filter((c) => !cueResults[c.id]?.hit).length;
      if (difficulty === "professional" && missed > 1) {
        onFail();
        return;
      }
    }

    onComplete();
  }, [done, cues, cueResults, difficulty, onComplete, onFail, stageType]);

  // --- CUE FIRING LOGIC ---
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

      if (lives - 1 <= 0) {
        if (stageType === "rehearsal") {
          setActive(false);
          setFailed(true); // Stop rehearsal, show Redo
        } else {
          onFail(); // Instant fail for Live Show
        }
      }
    }
  }

  const progress = Math.min((elapsed / durationMs) * 100, 100);

  // --- RENDER REHEARSAL REDO SCREEN ---
  if (failed && stageType === "rehearsal") {
    return (
      <div
        className="hardware-panel"
        style={{ textAlign: "center", padding: "3rem 1.5rem" }}
      >
        <h2
          style={{ color: "#ef4444", fontSize: "2rem", marginBottom: "1rem" }}
        >
          ❌ Rehearsal Stopped
        </h2>
        <p
          style={{
            color: "var(--text-muted)",
            marginBottom: "2rem",
            fontSize: "1.1rem",
          }}
        >
          The Stage Manager called a hold. You missed too many cues.
        </p>
        <button
          onClick={() => {
            dispatch({ type: "ADD_SCORE", delta: SCORING.REDO_PENALTY });
            dispatch({ type: "RESET_LIVES" });
            setFailed(false);
            setElapsed(0);
            setCueResults({});
            setSmLine("Let's take it from the top.");
          }}
          className="action-button btn-accent"
          style={{ width: "100%", maxWidth: "300px", padding: "1rem" }}
        >
          Redo Rehearsal ({SCORING.REDO_PENALTY} pts)
        </button>
      </div>
    );
  }

  // --- RENDER CONSOLE UI ---
  return (
    <div className="hardware-panel">
      {/* Top Comms Panel */}
      <div
        style={{
          background: "#111",
          padding: "1rem",
          borderRadius: "8px",
          marginBottom: "1.5rem",
          border: "1px solid #333",
          color: "#a3e635",
          fontFamily: "monospace",
        }}
      >
        <div
          style={{ fontSize: "0.8rem", color: "#666", marginBottom: "0.25rem" }}
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
            progress={progress}
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
            lives={lives}
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
