import { useCallback, useEffect, useRef, useState } from "react";
import { useGame } from "../../../context/GameContext";

export type LaundryCategory = "LIGHTS" | "DARKS" | "DRY_CLEAN";

export interface LaundryItem {
  id: string;
  category: LaundryCategory;
  icon: string;
  y: number;
  speed: number;
}

const SPAWN_ICONS: Record<LaundryCategory, string[]> = {
  LIGHTS: ["🥼", "🧦", "🤍"],
  DARKS: ["👖", "🧥", "🖤"],
  DRY_CLEAN: ["👗", "👔", "🧣"],
};

const getSpawnRate = (diff: string) => {
  if (diff === "professional") return 800;
  if (diff === "community") return 1200;
  return 1800;
};

const getFallSpeed = (diff: string) => {
  if (diff === "professional") return 25;
  if (diff === "community") return 20;
  return 15;
};

export function useLaundrySort(
  difficulty: string,
  onPhaseComplete: () => void,
) {
  const { dispatch } = useGame();

  const [items, setItems] = useState<LaundryItem[]>([]);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [isActive, setIsActive] = useState(false);
  const [isPaused, setIsPaused] = useState(true);
  const [feedback, setFeedback] = useState<{
    msg: string;
    type: "success" | "error";
  } | null>(null);

  const itemsRef = useRef<LaundryItem[]>([]);
  const frameRef = useRef<number | null>(null);
  const lastSpawnRef = useRef(0);

  useEffect(() => {
    const handleGlobalPause = () => setIsPaused(true);
    const handleGlobalResume = () => {
      if (isActive) setIsPaused(false);
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
  }, [isActive]);

  useEffect(() => {
    if (!isActive || isPaused) return;

    let lastTime = performance.now();
    const fallSpeed = getFallSpeed(difficulty);
    const spawnRate = getSpawnRate(difficulty);

    const loop = (time: number) => {
      const delta = Math.min((time - lastTime) / 1000, 0.1);
      lastTime = time;

      let currentItems = itemsRef.current.map((item) => ({
        ...item,
        y: item.y + item.speed * delta,
      }));

      const missed = currentItems.filter((i) => i.y >= 100);
      if (missed.length > 0) {
        setFeedback({ msg: "Garment hit the floor! (-5 pts)", type: "error" });
        dispatch({ type: "ADD_SCORE", delta: -5 });
        dispatch({ type: "CUE_MISSED" });
      }

      currentItems = currentItems.filter((i) => i.y < 100);

      if (time - lastSpawnRef.current > spawnRate) {
        const categories: LaundryCategory[] = ["LIGHTS", "DARKS", "DRY_CLEAN"];
        const cat = categories[Math.floor(Math.random() * categories.length)];
        const icons = SPAWN_ICONS[cat];
        const icon = icons[Math.floor(Math.random() * icons.length)];

        currentItems.push({
          id: `item_${Math.random().toString(36).substring(2, 9)}`,
          category: cat,
          icon,
          y: 0,
          speed: fallSpeed + (Math.random() * 10 - 5),
        });
        lastSpawnRef.current = time;
      }

      itemsRef.current = currentItems;
      setItems(currentItems);

      frameRef.current = requestAnimationFrame(loop);
    };

    frameRef.current = requestAnimationFrame(loop);
    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
  }, [isActive, isPaused, difficulty, dispatch]);

  const handleTimeTick = useCallback(
    (prev: number) => {
      if (prev <= 1) {
        setIsActive(false);
        setTimeout(() => onPhaseComplete(), 2000);
        return 0;
      }
      return prev - 1;
    },
    [onPhaseComplete],
  );

  useEffect(() => {
    if (!isActive || isPaused) return;
    const timer = setInterval(() => setTimeLeft(handleTimeTick), 1000);
    return () => clearInterval(timer);
  }, [isActive, isPaused, handleTimeTick]);

  const handleSort = useCallback(
    (targetCategory: LaundryCategory) => {
      if (!isActive || isPaused || itemsRef.current.length === 0) return;

      const sorted = [...itemsRef.current].sort((a, b) => b.y - a.y);
      const targetItem = sorted[0];

      if (targetItem.category === targetCategory) {
        setScore((s) => s + 1);
        dispatch({ type: "ADD_SCORE", delta: 10 });
        dispatch({ type: "CUE_HIT" });
        setFeedback({
          msg: `Correct: ${targetCategory} sorted!`,
          type: "success",
        });
      } else {
        dispatch({ type: "ADD_SCORE", delta: -10 });
        dispatch({ type: "CUE_MISSED" });
        setFeedback({
          msg: `Ruined Garment: Was ${targetItem.category}! (-10 pts)`,
          type: "error",
        });
      }

      itemsRef.current = itemsRef.current.filter((i) => i.id !== targetItem.id);
      setItems(itemsRef.current);
    },
    [isActive, isPaused, dispatch],
  );

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isActive || isPaused) return;
      if (["ArrowLeft", "ArrowUp", "ArrowRight"].includes(e.key)) {
        e.preventDefault();
      }
      if (e.key === "ArrowLeft") handleSort("DARKS");
      if (e.key === "ArrowUp") handleSort("DRY_CLEAN");
      if (e.key === "ArrowRight") handleSort("LIGHTS");
    };
    globalThis.addEventListener("keydown", handleKeyDown);
    return () => globalThis.removeEventListener("keydown", handleKeyDown);
  }, [isActive, isPaused, handleSort]);

  return {
    items,
    score,
    timeLeft,
    isActive,
    setIsActive,
    isPaused,
    setIsPaused,
    handleSort,
    feedback,
  };
}
