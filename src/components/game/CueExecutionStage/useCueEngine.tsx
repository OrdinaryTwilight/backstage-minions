import { useCallback, useEffect, useRef, useState } from "react";
import { useGame } from "../../../context/GameContext";
import { Cue } from "../../../data/types";

export function useCueEngine(
  cueSheet: Cue[],
  onComplete: () => void,
  difficulty = "school",
) {
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

  // FIXED: Priority 6 - Prevent NaN soft-lock on empty cue sheets
  const maxShowTime =
    cueSheet.length > 0
      ? (cueSheet[cueSheet.length - 1]?.targetMs || 10000) + 3000
      : 5000;

  const expiredRef = useRef(false);

  // ==========================================
  // FIXED: Priority 4 - Refs to prevent event listener thrashing
  // ==========================================
  const elapsedMsRef = useRef(elapsedMs);
  const faderLevelsRef = useRef(faderLevels);

  useEffect(() => {
    elapsedMsRef.current = elapsedMs;
  }, [elapsedMs]);

  useEffect(() => {
    faderLevelsRef.current = faderLevels;
  }, [faderLevels]);

  // ==========================================
  // FIXED: Priority 5 - Shared difficulty window logic
  // ==========================================
  const difficultyMultiplierMap: Record<string, number> = {
    professional: 0.5,
    community: 0.75,
  };
  const difficultyMultiplier = difficultyMultiplierMap[difficulty] ?? 1;

  const effectiveWindowMs = currentCue
    ? (currentCue.windowMs || 1000) * difficultyMultiplier
    : 1000;

  const handleGo = useCallback(
    (forceMiss = false) => {
      if (isLastCue || !isReady || !currentCue) return;

      const targetMs = currentCue.targetMs || 0;
      // Read from refs instead of state to avoid dependency updates
      const currentElapsed = elapsedMsRef.current;
      const currentFaders = faderLevelsRef.current;

      const isTimedWell =
        Math.abs(currentElapsed - targetMs) <= effectiveWindowMs;
      const targetLevel = currentCue.targetLevel || 80;
      const margin = 10;

      // MASTER FADER LOGIC: Master linearly scales the physical sub-faders
      const masterValue = currentFaders[4] / 100;
      const effectiveLevels = currentFaders
        .slice(0, 4)
        .map((l) => l * masterValue);

      const acceptableChannels = effectiveLevels.filter(
        (l) => Math.abs(l - targetLevel) <= margin,
      ).length;

      const isAligned = acceptableChannels >= 2;
      const tooHigh = effectiveLevels.some((l) => l > targetLevel + margin);
      const isHit = !forceMiss && isAligned && isTimedWell;

      setCueResults((prev) => ({ ...prev, [currentCue.id]: { hit: isHit } }));

      if (isHit) {
        setSmMessage(`Good cue. Standby next.`);
        dispatch({ type: "CUE_HIT" });
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
    },
    [
      isLastCue,
      isReady,
      currentCue,
      effectiveWindowMs,
      currentIdx,
      cueSheet.length,
      onComplete,
      dispatch,
    ],
  );

  // Master Clock
  useEffect(() => {
    if (isLastCue || !isReady) return;
    const startTime = Date.now() - elapsedMs;
    const interval = setInterval(
      () => setElapsedMs(Date.now() - startTime),
      50,
    );
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLastCue, isReady]);

  // Reset expired flag when cue changes
  useEffect(() => {
    expiredRef.current = false;
  }, [currentCue?.id]);

  // Auto-fail logic
  useEffect(() => {
    if (!currentCue || isLastCue || !isReady) {
      expiredRef.current = false;
      return;
    }

    // FIXED: Auto-fail now uses the synced, difficulty-adjusted window
    const expirationTime = currentCue.targetMs + effectiveWindowMs + 100;

    if (elapsedMs > expirationTime && !expiredRef.current) {
      expiredRef.current = true;
      handleGo(true);
    }
  }, [elapsedMs, currentCue, isLastCue, isReady, effectiveWindowMs, handleGo]);

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
