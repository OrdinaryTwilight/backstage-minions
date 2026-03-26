import { useEffect, useRef, useState } from "react";
import { useGame } from "../../context/GameContext";

// Total duration of simulated live show (30 seconds)
const TOTAL_DURATION_MS = 30000;

/**
 * LiveShowStage: High-pressure cue execution mini-game
 * 
 * Player must click cues at precise moments within a time window.
 * This is the most critical stage - missing cues costs lives.
 * One life lost = end of show.
 * 
 * Key mechanics:
 * - Cues have targetMs (ideal time) and windowMs (tolerance)
 * - Uses requestAnimationFrame for smooth 60fps timing
 * - Real-time feedback via Stage Manager headset line
 * - Shows visual progress bar with cue markers
 */
export default function LiveShowStage({ cues, onComplete, onFail }) {
  const { state, dispatch } = useGame();
  
  // Timing state
  const [elapsed, setElapsed] = useState(0);           // Current playback time in ms
  const [cueResults, setCueResults] = useState({});    // Track hit/miss per cue: { [cueId]: { hit: boolean } }
  const [active, setActive] = useState(false);         // Show running?
  const [done, setDone] = useState(false);             // Show completed?
  const [smLine, setSmLine] = useState("\"Places everyone. This is the real thing.\""); // Stage manager dialogue
  
  // Refs for smooth animation timing
  const startRef = useRef(null);  // performance.now() when show started
  const rafRef = useRef(null);    // requestAnimationFrame ID for cleanup

  /**
   * Main animation loop - updates elapsed time 60fps
   * Uses requestAnimationFrame for smooth, efficient timing
   */
  useEffect(() => {
    if (!active) return; // Loop only runs during show
    
    startRef.current = performance.now();
    
    function tick() {
      const now = performance.now() - startRef.current;
      setElapsed(now);
      
      // Stop when time runs out
      if (now >= TOTAL_DURATION_MS) {
        setElapsed(TOTAL_DURATION_MS);
        setDone(true);
        return;
      }
      
      rafRef.current = requestAnimationFrame(tick);
    }
    
    rafRef.current = requestAnimationFrame(tick);
    
    // Cleanup: cancel animation frame if component unmounts
    return () => cancelAnimationFrame(rafRef.current);
  }, [active]);

  /**
   * Auto-complete when show finishes
   */
  useEffect(() => {
    if (done) onComplete();
  }, [done]);

  /**
   * Player clicks "GO" for a cue
   * Determines if timing was accurate (within window)
   * Updates score and life count accordingly
   */
  function fireCue(cue) {
    // Guard: only fire once per cue, only during active show
    if (!active || cueResults[cue.id]) return;
    
    // Check if time is within acceptable window
    const timeDiff = Math.abs(elapsed - cue.targetMs);
    const hit = timeDiff <= cue.windowMs;
    
    // Record result
    setCueResults(r => ({ ...r, [cue.id]: { hit } }));
    
    if (hit) {
      // ✅ Successful cue execution
      dispatch({ type: "CUE_HIT" });
      dispatch({ type: "ADD_SCORE", delta: 80 });
      setSmLine("\"Good cue!\"");
    } else {
      // ❌ Missed cue
      dispatch({ type: "CUE_MISSED" });
      dispatch({ type: "LOSE_LIFE" });
      setSmLine("\"MISSED CUE — stay focused!\"");
      
      // Check if this was the final life
      if ((state.session?.lives ?? 1) - 1 <= 0) {
        onFail(); // End show early
      }
    }
  }

  // Calculate progress bar width (0-100%)
  const progress = Math.min((elapsed / TOTAL_DURATION_MS) * 100, 100);

  return (
    <div style={{ padding: "1rem" }}>
      <div style={{ marginBottom: "1rem", padding: "0.5rem", background: "var(--surface2)", borderRadius: "4px" }}>
        <strong>🎙️ SM headset: {smLine}</strong>
      </div>

      <h2>🔴 Live Show</h2>
      <p>
        No second chances. Hit every cue on time. Missing a cue during a live show has consequences.
      </p>

      <div style={{ marginBottom: "1rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          {Array.from({ length: state.session?.lives ?? 2 }).map((_, i) => (
            <span key={i} style={{ fontSize: "1.5rem" }}>❤️</span>
          ))}
        </div>
        <div>
          <strong>LIVE ● {(elapsed / 1000).toFixed(1)}s</strong>
        </div>
      </div>

      <div style={{ marginBottom: "1rem", background: "var(--surface2)", borderRadius: "8px", padding: "1rem" }}>
        <div style={{ height: "4px", background: "var(--surface1)", borderRadius: "2px", overflow: "hidden" }}>
          <div style={{ width: `${progress}%`, height: "100%", background: "#4ade80", transition: "width 0.1s" }}></div>
        </div>
        {cues.map(c => (
          <div key={c.id} style={{ position: "absolute", left: `${(c.targetMs / TOTAL_DURATION_MS) * 100}%`, top: "0", height: "4px", width: "2px", background: "#fbbf24" }}></div>
        ))}
      </div>

      {!active && !done && (
        <button
          onClick={() => { setActive(true); setSmLine("\"And... go!\""); }}
          style={{ cursor: "pointer", padding: "0.75rem 1.5rem", marginBottom: "1rem" }}
        >
          🔴 Go Live
        </button>
      )}

      <div style={{ marginTop: "2rem" }}>
        <h3>LIVE CUE SHEET</h3>
        {cues.map(c => {
          const result = cueResults[c.id];
          return (
            <div key={c.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0.5rem", borderBottom: "1px solid var(--border)" }}>
              <div>
                <strong>{c.id}</strong> — {c.label}
              </div>
              <div>
                {result ? (result.hit ? "✅" : "❌") : "○"}
              </div>
              {active && !result && (
                <button onClick={() => fireCue(c)} style={{ cursor: "pointer" }}>
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

