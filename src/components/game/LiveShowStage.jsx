import { memo, useEffect, useRef, useState } from "react";
import { useGame } from "../../context/GameContext";
import { DURATIONS, SCORING } from "../../data/constants";
import { CHARACTERS } from "../../data/gameData";

function LiveShowStage({ cues, penaltyMultiplier = 1, onComplete, onFail }) {
  const { state, dispatch } = useGame();

  // Timing state
  const [elapsed, setElapsed] = useState(0);
  const [cueResults, setCueResults] = useState({});
  const [active, setActive] = useState(false);
  const [done, setDone] = useState(false);
  const [smLine, setSmLine] = useState(
    '"Places everyone. This is the real thing."',
  );

  // Refs for smooth animation timing
  const startRef = useRef(null);
  const rafRef = useRef(null);

  const char = CHARACTERS.find((c) => c.id === state.session.characterId);
  const isLiked = state.contacts.includes("Stage Manager");

  useEffect(() => {
    if (!active) return;

    startRef.current = performance.now();

    function tick() {
      const now = performance.now() - startRef.current;
      setElapsed(now);

      if (now >= DURATIONS.LIVE_SHOW_MS) {
        setElapsed(DURATIONS.LIVE_SHOW_MS);
        setDone(true);
        return;
      }
      rafRef.current = requestAnimationFrame(tick);
    }

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [active]);

  useEffect(() => {
    if (done) onComplete();
  }, [done, onComplete]);

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
      dispatch({ type: "ADD_SCORE", delta: SCORING.LIVE_SHOW_HIT });

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

      if ((state.session?.lives ?? 1) - 1 <= 0) {
        onFail();
      }
    }
  }

  const progress = Math.min((elapsed / DURATIONS.LIVE_SHOW_MS) * 100, 100);

  return (
    <div className="stage-container">
      {/* Headset Dialogue */}
      <div className="surface-panel" style={{ padding: "0.5rem" }}>
        <strong>🎙️ SM headset: {smLine}</strong>
      </div>

      <h2>🔴 Live Show</h2>
      <p>
        No second chances. Hit every cue on time. Missing a cue during a live
        show has consequences.
      </p>

      {/* HUD */}
      <div className="hud-container">
        <div>
          {Array.from({ length: state.session?.lives ?? 2 }).map((_, i) => (
            <span key={i} style={{ fontSize: "1.5rem" }}>
              ❤️
            </span>
          ))}
        </div>
        <div>
          <strong>LIVE ● {(elapsed / 1000).toFixed(1)}s</strong>
        </div>
      </div>

      {/* Timeline Bar */}
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
              left: `${(c.targetMs / DURATIONS.LIVE_SHOW_MS) * 100}%`,
              top: "0",
              height: "4px",
              width: "2px",
              background: "#fbbf24",
            }}
          />
        ))}
      </div>

      {/* Start Button */}
      {!active && !done && (
        <button
          className="action-button btn-success"
          onMouseDown={() => {
            setActive(true);
            setSmLine('"And... go!"');
          }}
          onTouchStart={() => {
            setActive(true);
            setSmLine('"And... go!"');
          }}
        >
          🔴 Go Live
        </button>
      )}

      {/* Cue Sheet */}
      <div style={{ marginTop: "2rem" }}>
        <h3>LIVE CUE SHEET</h3>
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
                  className="action-button btn-accent"
                  onMouseDown={(e) => fireCue(c, e)}
                  onTouchStart={(e) => fireCue(c, e)}
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

export default memo(LiveShowStage);
