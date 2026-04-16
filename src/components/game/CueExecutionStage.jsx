// src/components/game/CueExecutionStage.jsx
import { memo, useEffect, useRef, useState } from "react";
import { useGame } from "../../context/GameContext";

const TOTAL_DURATION_MS = 20000; // Or pass this as a prop if it varies!

function CueExecutionStage({
  cues,
  penaltyMultiplier = 1,
  onComplete,
  onFail,
  stageType, // "rehearsal" or "live"
}) {
  const { state, dispatch } = useGame();
  const [elapsed, setElapsed] = useState(0);
  const [cueResults, setCueResults] = useState({});
  const [active, setActive] = useState(false);
  const [done, setDone] = useState(false);
  const [failed, setFailed] = useState(false);
  const [smLine, setSmLine] = useState(
    stageType === "live"
      ? '"Places everyone. This is the real thing."'
      : '"Standby for rehearsal."',
  );

  const startRef = useRef(null);
  const rafRef = useRef(null);

  const char = CHARACTERS.find((c) => c.id === state.session.characterId);
  const isLiked = state.contacts.includes("Stage Manager");
  const lives = state.session?.lives ?? 3;
  const difficulty = state.session?.difficulty ?? "school";

  // ... (Timer useEffect remains the same) ...

  // ... (Completion useEffect needs slight modification for the Live Show) ...
  useEffect(() => {
    if (!done) return;
    const missed = cues.filter((c) => !cueResults[c.id]?.hit).length;

    if (stageType === "rehearsal") {
      if (difficulty === "professional" && missed > 1) {
        onFail();
        return;
      }
    } else if (stageType === "live") {
      // Live show logic is simpler: if you didn't fail during the run, you completed it
    }

    onComplete();
  }, [done]);

  function fireCue(cue, event) {
    // ... (Event prevention, early returns, and hit calculation remain the same) ...

    if (hit) {
      dispatch({ type: "CUE_HIT" });
      dispatch({ type: "ADD_SCORE", delta: stageType === "live" ? 80 : 50 });

      const praise = isLiked ? '"Brilliant timing!"' : '"Good cue."';
      setSmLine(praise);
    } else {
      dispatch({ type: "CUE_MISSED" });
      dispatch({ type: "LOSE_LIFE" });

      const yell =
        (char?.stats?.social ?? 5) < 7 ? '"Wake up!"' : '"Missed cue!"';
      setSmLine(yell);

      if (lives - 1 <= 0) {
        if (stageType === "rehearsal") {
          setActive(false);
          setFailed(true); // Trigger Redo screen
        } else {
          onFail(); // Instant fail for live show
        }
      }
    }
  }

  // ... (Progress calculation) ...

  // Conditional render for Rehearsal Redo
  if (failed && stageType === "rehearsal") {
    // ... (Return your redo screen UI here) ...
  }

  // Standard render
  return (
    <div style={{ padding: "1rem" }}>
      {/* Dynamic Header based on stageType */}
      <h2>{stageType === "live" ? "🔴 Live Show" : "🎬 Rehearsal"}</h2>

      {/* ... (The rest of your UI: HUD, Timeline, Cue Sheet) ... */}
    </div>
  );
}

export default memo(CueExecutionStage);
