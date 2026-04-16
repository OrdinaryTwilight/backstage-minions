import { memo, useEffect, useRef, useState } from "react";
import { useGame } from "../../context/GameContext";

const TOTAL_DURATION_MS = 20000;

function RehearsalStage({ cues, onComplete, onFail }) {
  const { state, dispatch } = useGame();
  const [elapsed, setElapsed] = useState(0);
  const [cueResults, setCueResults] = useState({});
  const [active, setActive] = useState(false);
  const [done, setDone] = useState(false);
  const startRef = useRef(null);
  const rafRef = useRef(null);

  // The new failed state for the redo mechanic
  const [failed, setFailed] = useState(false);

  const lives = state.session?.lives ?? 3;
  const difficulty = state.session?.difficulty ?? "school";

  useEffect(() => {
    if (!active) return;
    startRef.current = performance.now();
    function tick() {
      const now = performance.now() - startRef.current;
      setElapsed(now);
      if (now >= TOTAL_DURATION_MS) {
        setElapsed(TOTAL_DURATION_MS);
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
  }, [done]);

  function fireCue(cue, event) {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }

    if (!active || cueResults[cue.id]) return;

    // Apply the penalty multiplier to the window!
    const timeDiff = Math.abs(elapsed - cue.targetMs);
    const hit = timeDiff <= cue.windowMs * penaltyMultiplier;

    setCueResults((r) => ({ ...r, [cue.id]: { hit } }));

    if (hit) {
      dispatch({ type: "CUE_HIT" });
      dispatch({ type: "ADD_SCORE", delta: 80 });

      // Dynamic Praise!
      const praise = isLiked
        ? '"Brilliant timing, you\'re saving us!"'
        : '"Good cue."';
      setSmLine(praise);
    } else {
      dispatch({ type: "CUE_MISSED" });
      dispatch({ type: "LOSE_LIFE" });

      // Dynamic Yell!
      const yell =
        (char?.stats?.social ?? 5) < 7
          ? '"Wake up at the board! We are dying out here!"'
          : '"Missed cue! Stay focused, you can do this."';
      setSmLine(yell);

      if ((state.session?.lives ?? 1) - 1 <= 0) {
        onFail();
      }
    }
  }

  const progress = Math.min((elapsed / TOTAL_DURATION_MS) * 100, 100);

  // 1. Conditional render for the Failed/Redo state
  if (failed) {
    return (
      <div className="card" style={{ padding: "1rem" }}>
        <h2>❌ Rehearsal Stopped</h2>
        <p>The Stage Manager called a hold. You missed too many cues.</p>
        <button
          onClick={() => {
            dispatch({ type: "ADD_SCORE", delta: -50 });
            dispatch({ type: "RESET_LIVES" }); // Restores the default 3 lives
            setFailed(false);
            setElapsed(0);
            setCueResults({});
          }}
          className="btn btn-primary"
        >
          Redo Rehearsal (-50 pts)
        </button>
      </div>
    );
  }

  // 2. Standard render for the active Rehearsal Stage
  return (
    <div style={{ padding: "1rem" }}>
      <h2>🎬 Rehearsal</h2>
      <p>
        Watch the progress bar and hit each cue at the right moment. A missed
        cue costs a life.
      </p>

      {/* HUD */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "1.5rem",
        }}
      >
        <div>
          {Array.from({ length: lives }).map((_, i) => (
            <span key={i} style={{ fontSize: "1.5rem" }}>
              ❤️
            </span>
          ))}
        </div>
        <div>
          <strong>
            {(elapsed / 1000).toFixed(1)}s / {TOTAL_DURATION_MS / 1000}s
          </strong>
        </div>
      </div>

      {/* Timeline bar */}
      <div
        style={{
          marginBottom: "1.5rem",
          background: "var(--surface2)",
          borderRadius: "8px",
          padding: "1rem",
          position: "relative",
        }}
      >
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
          ></div>
        </div>
        {cues.map((c) => (
          <div
            key={c.id}
            style={{
              position: "absolute",
              left: `calc(${(c.targetMs / TOTAL_DURATION_MS) * 100}% + 1rem)`,
              top: "50%",
              transform: "translateY(-50%)",
              width: "2px",
              height: "12px",
              background: "#fbbf24",
            }}
          ></div>
        ))}
      </div>

      {!active && !done && (
        <button
          onMouseDown={() => setActive(true)}
          onTouchStart={() => setActive(true)}
          style={{
            cursor: "pointer",
            marginBottom: "1rem",
            padding: "0.75rem 1.5rem",
            minWidth: "44px",
            minHeight: "44px",
            fontSize: "0.75rem",
            fontFamily: "'Press Start 2P', monospace",
            background: "var(--success, #40ff80)",
            border: "2px solid var(--success-border, #20ff60)",
            fontWeight: "bold",
            touchAction: "none",
          }}
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
            <div
              key={c.id}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "0.5rem",
                borderBottom: "1px solid var(--border)",
              }}
            >
              <div>
                <strong>{c.id}</strong> — {c.label}
              </div>
              <div>{result ? (result.hit ? "✅" : "❌") : "○"}</div>
              {active && !result && (
                <button
                  onMouseDown={(e) => fireCue(c, e)}
                  onTouchStart={(e) => fireCue(c, e)}
                  style={{
                    cursor: "pointer",
                    padding: "0.5rem 1rem",
                    minWidth: "44px",
                    minHeight: "44px",
                    fontSize: "0.75rem",
                    fontFamily: "'Press Start 2P', monospace",
                    background: "var(--accent)",
                    border: "2px solid var(--accent-border, #ff40ff)",
                    color: "#000",
                    fontWeight: "bold",
                    touchAction: "none",
                  }}
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
