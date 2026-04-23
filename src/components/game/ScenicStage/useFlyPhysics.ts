import { useCallback, useEffect, useRef, useState } from "react";
import { useGame } from "../../../context/GameContext";

const getDifficultyParams = (diff: string) => {
  switch (diff) {
    case "professional":
      return { speed: 2.8, amplitude: 45, pullRate: 50, gravRate: 50 };
    case "community":
      return { speed: 1.8, amplitude: 35, pullRate: 60, gravRate: 45 };
    case "school":
    default:
      return { speed: 0.8, amplitude: 25, pullRate: 80, gravRate: 40 };
  }
};

export function useFlyPhysics(difficulty: string, onComplete: () => void) {
  const { dispatch } = useGame();

  const [tension, setTension] = useState(0);
  const [targetPos, setTargetPos] = useState(50);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(20);
  const [isActive, setIsActive] = useState(false);

  const isHoldingRef = useRef(false);
  const tensionRef = useRef(0);
  const timeElapsedRef = useRef(0);
  // TS FIX: 2554 - Initialized useRef with a default value of 0 to satisfy React 18 strict types
  const animationFrameRef = useRef<number>(0);
  const lastScoreTickRef = useRef(0);

  const startGame = useCallback(() => setIsActive(true), []);
  const setHolding = useCallback((holding: boolean) => {
    isHoldingRef.current = holding;
  }, []);

  useEffect(() => {
    if (!isActive) return;

    let lastTime = performance.now();
    const { speed, amplitude, pullRate, gravRate } =
      getDifficultyParams(difficulty);

    const loop = (time: number) => {
      const delta = Math.min((time - lastTime) / 1000, 0.1);
      lastTime = time;
      timeElapsedRef.current += delta;

      let currentTension = tensionRef.current;
      if (isHoldingRef.current) {
        currentTension += pullRate * delta;
      } else {
        currentTension -= gravRate * delta;
      }

      currentTension = Math.max(0, Math.min(100, currentTension));
      tensionRef.current = currentTension;
      setTension(currentTension);

      const newTarget =
        50 + Math.sin(timeElapsedRef.current * speed) * amplitude;
      setTargetPos(newTarget);

      if (Math.abs(currentTension - newTarget) < 15) {
        setScore((s) => s + 1);
        if (time - lastScoreTickRef.current > 1000) {
          dispatch({ type: "CUE_HIT" });
          lastScoreTickRef.current = time;
        }
      } else if (time - lastScoreTickRef.current > 1500) {
        dispatch({ type: "CUE_MISSED" });
        lastScoreTickRef.current = time;
      }

      animationFrameRef.current = requestAnimationFrame(loop);
    };

    animationFrameRef.current = requestAnimationFrame(loop);
    return () => {
      if (animationFrameRef.current)
        cancelAnimationFrame(animationFrameRef.current);
    };
  }, [isActive, difficulty, dispatch]);

  useEffect(() => {
    if (!isActive) return;
    if (timeLeft <= 0) {
      setIsActive(false);
      const finalScoreDelta = Math.floor(score / 5);
      dispatch({ type: "ADD_SCORE", delta: finalScoreDelta });
      setTimeout(() => onComplete(), 2500);
      return;
    }
    const timer = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearInterval(timer);
  }, [isActive, timeLeft, score, dispatch, onComplete]);

  return {
    tension,
    targetPos,
    timeLeft,
    score,
    isActive,
    startGame,
    setHolding,
  };
}
