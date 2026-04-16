import { memo, useEffect, useRef, useState } from "react";
import { useGame } from "../../context/GameContext";
import { DURATIONS, SCORING } from "../../data/constants";
import { CHARACTERS } from "../../data/gameData";

// Import your new modular UI components!
import CueStack from "./ui/CueStack";
import DepartmentMixer from "./ui/DepartmentMixer";
import MasterControl from "./ui/MasterControl";

function LiveShowStage({ cues, penaltyMultiplier = 1, onComplete, onFail }) {
  const { state, dispatch } = useGame();

  const [elapsed, setElapsed] = useState(0);
  const [cueResults, setCueResults] = useState({});
  const [active, setActive] = useState(false);
  const [done, setDone] = useState(false);
  const [smLine, setSmLine] = useState("Standby. Places everyone.");

  const startRef = useRef(null);
  const rafRef = useRef(null);

  const char = CHARACTERS.find((c) => c.id === state.session?.characterId);
  const isLiked = state.contacts.includes("Stage Manager");
  const lives = state.session?.lives ?? 2;

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

  // Find the next cue the player needs to hit
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
      dispatch({ type: "ADD_SCORE", delta: SCORING.LIVE_SHOW_HIT });
      setSmLine(isLiked ? "Brilliant timing!" : "Good cue.");
    } else {
      dispatch({ type: "CUE_MISSED" });
      dispatch({ type: "LOSE_LIFE" });
      setSmLine(
        (char?.stats?.social ?? 5) < 7
          ? "Wake up at the board!"
          : "Missed cue! Stay focused.",
      );
      if (lives - 1 <= 0) onFail();
    }
  }

  const progress = Math.min((elapsed / DURATIONS.LIVE_SHOW_MS) * 100, 100);

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
        {/* LEFT COLUMN: The Interface */}
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
            duration={DURATIONS.LIVE_SHOW_MS}
          />
        </div>

        {/* RIGHT COLUMN: Master Hardware Controls */}
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

export default memo(LiveShowStage);
