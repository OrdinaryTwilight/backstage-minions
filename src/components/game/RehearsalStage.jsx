import { memo, useEffect, useRef, useState } from "react";
import { useGame } from "../../context/GameContext";
import { DURATIONS, SCORING } from "../../data/constants";
import { CHARACTERS } from "../../data/gameData";

function RehearsalStage({ cues, penaltyMultiplier = 1, onComplete, onFail }) {
  const { state, dispatch } = useGame();
  const [elapsed, setElapsed] = useState(0);
  const [cueResults, setCueResults] = useState({});
  const [active, setActive] = useState(false);
  const [done, setDone] = useState(false);
  const [failed, setFailed] = useState(false);

  // ADDED: Missing state and variables from Live Show logic
  const [smLine, setSmLine] = useState('"Standby for rehearsal."');
  const char = CHARACTERS.find((c) => c.id === state.session.characterId);
  const isLiked = state.contacts.includes("Stage Manager");

  const startRef = useRef(null);
  const rafRef = useRef(null);

  const lives = state.session?.lives ?? 3;
  const difficulty = state.session?.difficulty ?? "school";

  useEffect(() => {
    if (!active) return;
    startRef.current = performance.now();
    function tick() {
      const now = performance.now() - startRef.current;
      setElapsed(now);
      if (now >= DURATIONS.REHEARSAL_MS) {
        setElapsed(DURATIONS.REHEARSAL_MS);
        setDone(true);
        return;
      }
      rafRef.current = requestAnimationFrame(tick);
    }
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [active]);

  useEffect(() => {
    if (!done) return;
    const missed = cues.filter((c) => !cueResults[c.id]?.hit).length;
    if (difficulty === "professional" && missed > 1) {
      onFail();
      return;
    }
    onComplete();
  }, [done, cues, cueResults, difficulty, onComplete, onFail]);

  function fireCue(cue, event) {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }

    if (!active || cueResults[cue.id]) return;

    const timeDiff = Math.abs(elapsed - cue.targetMs);
    const hit = timeDiff <= cue.windowMs * penaltyMultiplier;

    setCueResults((r) => ({ ...r, [cue.id]: { hit } }));

    if (hit) {
      dispatch({ type: "CUE_HIT" });
      dispatch({ type: "ADD_SCORE", delta: SCORING.REHEARSAL_HIT });

      const praise = isLiked
        ? '"Brilliant timing, you\'re saving us!"'
        : '"Good cue."';
      setSmLine(praise);
    } else {
      dispatch({ type: "CUE_MISSED" });
      dispatch({ type: "LOSE_LIFE" });

      const yell =
        (char?.stats?.social ?? 5) < 7
          ? '"Wake up at the board! We are dying out here!"'
          : '"Missed cue! Stay focused, you can do this."';
      setSmLine(yell);

      if (lives - 1 <= 0) {
        setActive(false);
        setFailed(true);
      }
    }
  }

  const progress = Math.min((elapsed / DURATIONS.REHEARSAL_MS) * 100, 100);

  // 1. Conditional render for the Failed/Redo state
  if (failed) {
    return (
      <div className="stage-container surface-panel">
        <h2>❌ Rehearsal Stopped</h2>
        <p>The Stage Manager called a hold. You missed too many cues.</p>
        <button
          onClick={() => {
            dispatch({ type: "ADD_SCORE", delta: SCORING.REDO_PENALTY });
            dispatch({ type: "RESET_LIVES" });
            setFailed(false);
            setElapsed(0);
            setCueResults({});
            setSmLine('"Let\'s take it from the top."');
          }}
          className="action-button btn-accent"
          style={{ width: "100%", marginTop: "1rem" }}
        >
          Redo Rehearsal ({SCORING.REDO_PENALTY} pts)
        </button>
      </div>
    );
  }

  // 2. Standard render
  return (
    <div className="stage-container">
      {/* Headset Dialogue */}
      <div className="surface-panel" style={{ padding: "0.5rem" }}>
        <strong>🎙️ SM headset: {smLine}</strong>
      </div>

      <h2>🎬 Rehearsal</h2>
      <p>
        Watch the progress bar and hit each cue at the right moment. A missed
        cue costs a life.
      </p>

      {/* HUD */}
      <div className="hud-container">
        <div>
          {Array.from({ length: lives }).map((_, i) => (
            <span key={i} style={{ fontSize: "1.5rem" }}>
              ❤️
            </span>
          ))}
        </div>
        <div>
          <strong>
            {(elapsed / 1000).toFixed(1)}s / {DURATIONS.REHEARSAL_MS / 1000}s
          </strong>
        </div>
      </div>

      {/* Timeline bar */}
      <div className="surface-panel">
        <div
          style={{
            height: "4px",
            background: "var(--surface1)",
            borderRadius: "2px",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              width: `${progress}%`,
              height: "100%",
              background: "#4ade80",
              transition: "width 0.1s",
            }}
          />
        </div>
        {cues.map((c) => (
          <div
            key={c.id}
            style={{
              position: "absolute",
              left: `calc(${(c.targetMs / DURATIONS.REHEARSAL_MS) * 100}% + 1rem)`,
              top: "50%",
              transform: "translateY(-50%)",
              width: "2px",
              height: "12px",
              background: "#fbbf24",
            }}
          />
        ))}
      </div>

      {!active && !done && (
        <button
          onMouseDown={() => {
            setActive(true);
            setSmLine('"And... go!"');
          }}
          onTouchStart={() => {
            setActive(true);
            setSmLine('"And... go!"');
          }}
          className="action-button btn-success"
        >
          🎬 Start Rehearsal
        </button>
      )}

      {/* Cue sheet */}
      <div>
        <h3>CUE SHEET</h3>
        {cues.map((c) => {
          const result = cueResults[c.id];
          return (
            <div key={c.id} className="list-item-row">
              <div>
                <strong>{c.id}</strong> — {c.label}
              </div>
              <div>{result ? (result.hit ? "✅" : "❌") : "○"}</div>
              {active && !result && (
                <button
                  onMouseDown={(e) => fireCue(c, e)}
                  onTouchStart={(e) => fireCue(c, e)}
                  className="action-button btn-accent"
                >
                  GO
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default memo(RehearsalStage);
