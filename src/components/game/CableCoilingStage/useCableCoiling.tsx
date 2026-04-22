import { useCallback, useEffect, useRef, useState } from "react";
import { useGame } from "../../../context/GameContext";

export function useCableCoiling(difficulty: string, onComplete: () => void) {
  const { dispatch } = useGame();

  const coilsRef = useRef(0);
  const expectedNextRef = useRef<"OVER" | "UNDER">("OVER");

  const [coils, setCoils] = useState(0);
  const [knots, setKnots] = useState(0);
  const [expectedNext, setExpectedNext] = useState<"OVER" | "UNDER">("OVER");
  const [isComplete, setIsComplete] = useState(false);
  const [isPaused, setIsPaused] = useState(true);
  const [hasStarted, setHasStarted] = useState(false);

  const [feedback, setFeedback] = useState<{
    msg: string;
    type: "success" | "error" | "neutral";
  }>({
    msg: "Grab the XLR cable. Start with an OVER loop.",
    type: "neutral",
  });

  const getTargetCoils = (diff: string): number => {
    if (diff === "professional") return 12;
    if (diff === "community") return 8;
    return 6;
  };

  const getInitialTime = (diff: string): number => {
    if (diff === "professional") return 15;
    if (diff === "community") return 20;
    return 30;
  };

  const TARGET_COILS = getTargetCoils(difficulty);
  const [timeLeft, setTimeLeft] = useState(getInitialTime(difficulty));

  useEffect(() => {
    const handleGlobalPause = () => setIsPaused(true);
    const handleGlobalResume = () => {
      if (hasStarted && !isComplete) setIsPaused(false);
    };

    globalThis.addEventListener("global_pause_request", handleGlobalPause);
    globalThis.addEventListener("global_resume_request", handleGlobalResume);

    return () => {
      globalThis.removeEventListener("global_pause_request", handleGlobalPause);
      globalThis.removeEventListener(
        "global_resume_request",
        handleGlobalResume,
      );
    };
  }, [hasStarted, isComplete]);

  useEffect(() => {
    if (isComplete || isPaused) return;
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => Math.max(0, prevTime - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, [isComplete, isPaused]);

  useEffect(() => {
    if (timeLeft === 0 && !isComplete && !isPaused) {
      setIsComplete(true);
      setFeedback({
        msg: "Time's up! The senior techs had to take over.",
        type: "error",
      });
      const timer = setTimeout(() => onComplete(), 2500);
      return () => clearTimeout(timer);
    }
  }, [timeLeft, isComplete, isPaused, onComplete]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !isComplete && timeLeft > 0 && hasStarted) {
        setIsPaused((prev) => !prev);
      }
    };
    globalThis.addEventListener("keydown", handleKey);
    return () => globalThis.removeEventListener("keydown", handleKey);
  }, [isComplete, timeLeft, hasStarted]);

  const processCorrectAction = useCallback(
    (action: "OVER" | "UNDER") => {
      coilsRef.current += 1;
      const newCoils = coilsRef.current;
      const nextReq = action === "OVER" ? "UNDER" : "OVER";

      expectedNextRef.current = nextReq;
      setCoils(newCoils);
      setExpectedNext(nextReq);
      dispatch({ type: "ADD_SCORE", delta: 5 });

      if (newCoils >= TARGET_COILS) {
        setIsComplete(true);
        const timeBonus = timeLeft * 3;
        setFeedback({
          msg: `Perfect coil! Time Bonus: +${timeBonus} pts`,
          type: "success",
        });
        dispatch({ type: "ADD_SCORE", delta: 50 + timeBonus });
        setTimeout(() => onComplete(), 2000);
      } else {
        setFeedback({
          msg: `Nice ${action}! Now go ${nextReq}.`,
          type: "success",
        });
      }
    },
    [TARGET_COILS, timeLeft, dispatch, onComplete],
  );

  const processIncorrectAction = useCallback(
    (action: "OVER" | "UNDER") => {
      setKnots((k) => k + 1);
      coilsRef.current = Math.max(0, coilsRef.current - 1);
      expectedNextRef.current = "OVER";

      setCoils(coilsRef.current);
      setExpectedNext("OVER");

      setFeedback({
        msg: `KNOTTED! You went ${action} twice. Untangling... (-1 Coil)`,
        type: "error",
      });
      dispatch({ type: "ADD_SCORE", delta: -10 });
    },
    [dispatch],
  );

  const handleAction = useCallback(
    (action: "OVER" | "UNDER") => {
      if (isComplete || timeLeft <= 0 || isPaused) return;

      if (action === expectedNextRef.current) {
        processCorrectAction(action);
      } else {
        processIncorrectAction(action);
      }
    },
    [
      isComplete,
      timeLeft,
      isPaused,
      processCorrectAction,
      processIncorrectAction,
    ],
  );

  useEffect(() => {
    if (isComplete || timeLeft <= 0 || isPaused) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.repeat) return;
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        handleAction("OVER");
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        handleAction("UNDER");
      }
    };

    globalThis.addEventListener("keydown", handleKeyDown);
    return () => globalThis.removeEventListener("keydown", handleKeyDown);
  }, [handleAction, isComplete, timeLeft, isPaused]);

  return {
    coils,
    knots,
    expectedNext,
    isComplete,
    isPaused,
    setIsPaused,
    hasStarted,
    setHasStarted,
    feedback,
    timeLeft,
    TARGET_COILS,
    handleAction,
  };
}
