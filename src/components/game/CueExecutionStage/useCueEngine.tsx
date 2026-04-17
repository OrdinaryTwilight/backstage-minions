import { useEffect, useState } from "react";
import { useGame } from "../../../context/GameContext";
import { Cue } from "../../../data/types";

export function useCueEngine(cueSheet: Cue[], onComplete: () => void) {
  const { dispatch } = useGame();
  const [currentIdx, setCurrentIdx] = useState(0);
  const [faderLevels, setFaderLevels] = useState([80, 80, 80, 80, 100]);
  const [elapsedMs, setElapsedMs] = useState(0);
  const [cueResults, setCueResults] = useState<
    Record<string, { hit: boolean }>
  >({});
  const [isReady, setIsReady] = useState(false);
  const [smMessage, setSmMessage] = useState(
    "Standby. Lock in your faders and tell me when you are ready.",
  );

  const currentCue = cueSheet[currentIdx];
  const isLastCue = currentIdx >= cueSheet.length;
  const maxShowTime = (cueSheet[cueSheet.length - 1]?.targetMs || 10000) + 3000;

  // Master Clock
  useEffect(() => {
    if (isLastCue || !isReady) return;
    const startTime = Date.now() - elapsedMs; // Account for current elapsed if paused
    const interval = setInterval(
      () => setElapsedMs(Date.now() - startTime),
      50,
    );
    return () => clearInterval(interval);
  }, [isLastCue, isReady]);

  // Auto-fail logic
  useEffect(() => {
    if (!currentCue || isLastCue || !isReady) return;
    const expirationTime =
      currentCue.targetMs + (currentCue.windowMs || 1000) + 100;
    if (elapsedMs > expirationTime) handleGo(true);
  }, [elapsedMs, currentCue, isLastCue, isReady]);

  function handleGo(forceMiss = false) {
    if (isLastCue || !isReady) return;

    const targetMs = currentCue?.targetMs || 0;
    const windowMs = currentCue?.windowMs || 1000;
    const isTimedWell = Math.abs(elapsedMs - targetMs) <= windowMs;
    const targetLevel = currentCue?.targetLevel || 80;
    const margin = 10;

    const masterOk = Math.abs(faderLevels[4] - 100) <= margin;
    const acceptableChannels = faderLevels
      .slice(0, 4)
      .filter((l) => Math.abs(l - targetLevel) <= margin).length;
    const isAligned = masterOk && acceptableChannels >= 2;
    const tooHigh = faderLevels
      .slice(0, 4)
      .some((l) => l > targetLevel + margin);
    const isHit = !forceMiss && isAligned && isTimedWell;

    setCueResults((prev) => ({ ...prev, [currentCue.id]: { hit: isHit } }));

    if (isHit) {
      setSmMessage(`Good cue. Standby next.`);
      dispatch({ type: "CUE_HIT" });
      dispatch({ type: "ADD_SCORE", delta: 10 });
    } else {
      dispatch({ type: "CUE_MISSED" });
      dispatch({ type: "ADD_SCORE", delta: -10 });
      if (forceMiss)
        setSmMessage(`You missed ${currentCue.id}! Pay attention! (-10 pts)`);
      else if (!isTimedWell)
        setSmMessage(`Timing is way off on ${currentCue.id}! (-10 pts)`);
      else if (tooHigh)
        setSmMessage(
          `Whoa, levels are way too high for ${currentCue.id}! (-10 pts)`,
        );
      else
        setSmMessage(
          `Levels are too low for ${currentCue.id}! Push the faders! (-10 pts)`,
        );
    }

    if (currentIdx >= cueSheet.length - 1) {
      setTimeout(
        () => setSmMessage("And we are clear. Good show, everyone."),
        1000,
      );
      setTimeout(onComplete, 2500);
    }
    setCurrentIdx((prev) => prev + 1);
  }

  const handleReady = () => {
    setIsReady(true);
    setSmMessage("Copy that. House is closed. Standby for show... GO!");
  };

  return {
    currentIdx,
    faderLevels,
    setFaderLevels,
    elapsedMs,
    cueResults,
    isReady,
    smMessage,
    currentCue,
    isLastCue,
    maxShowTime,
    handleGo,
    handleReady,
  };
}
