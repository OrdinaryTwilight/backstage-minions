import { useCallback, useEffect, useState } from "react";
import { useGame } from "../../../context/GameContext";

export interface WardrobeItem {
  id: string;
  name: string;
  icon: string;
  category: "HEAD" | "BODY" | "PROP";
}

const RACK_ITEMS: WardrobeItem[] = [
  { id: "h_tophat", name: "Top Hat", icon: "🎩", category: "HEAD" },
  { id: "h_crown", name: "Crown", icon: "👑", category: "HEAD" },
  { id: "b_trench", name: "Trench Coat", icon: "🧥", category: "BODY" },
  { id: "b_dress", name: "Ballgown", icon: "👗", category: "BODY" },
  { id: "b_armor", name: "Chestplate", icon: "🪖", category: "BODY" },
  { id: "p_cane", name: "Cane", icon: "🦯", category: "PROP" },
  { id: "p_sword", name: "Sword", icon: "🗡️", category: "PROP" },
  { id: "p_shield", name: "Shield", icon: "🛡️", category: "PROP" },
];

export function useQuickChange(_difficulty: string, onComplete: () => void) {
  const { dispatch } = useGame();

  // UX/LOGIC: Time limits scale with difficulty
  const TIME_BY_DIFFICULTY: Record<string, number> = {
    professional: 10,
    community: 15,
  };

  const initialTime = TIME_BY_DIFFICULTY[_difficulty] ?? 20;
  const [timeLeft, setTimeLeft] = useState(initialTime);
  const [isActive, setIsActive] = useState(false);
  const [equipped, setEquipped] = useState<string[]>([]);
  const [isSuccess, setIsSuccess] = useState(false);

  const [targetOutfit] = useState(() => {
    const heads = RACK_ITEMS.filter((i) => i.category === "HEAD");
    const bodies = RACK_ITEMS.filter((i) => i.category === "BODY");
    const props = RACK_ITEMS.filter((i) => i.category === "PROP");

    const randomItem = (arr: WardrobeItem[]) =>
      arr[Math.floor(Math.random() * arr.length)].id;

    const selectedHead = randomItem(heads);
    const selectedBody = randomItem(bodies);

    // Generate two unique props safely without sorting bias
    const firstPropIndex = Math.floor(Math.random() * props.length);
    const firstProp = props[firstPropIndex].id;
    const remainingProps = props.filter((_, idx) => idx !== firstPropIndex);
    const secondProp = randomItem(remainingProps);

    if (_difficulty === "professional")
      return [selectedHead, selectedBody, firstProp, secondProp]; // 4 Items
    if (_difficulty === "community")
      return [selectedHead, selectedBody, firstProp]; // 3 Items
    return [selectedHead, selectedBody]; // School: 2 Items
  });

  // SONARQUBE FIX: S2004 - Extracted timer tick to reduce nested depth
  const tickTimer = useCallback(
    (prev: number) => {
      if (prev <= 1) {
        setIsActive(false);
        dispatch({ type: "ADD_SCORE", delta: -25 });
        dispatch({ type: "CUE_MISSED" }); // Scoring Integration
        setTimeout(() => onComplete(), 3000);
        return 0;
      }
      return prev - 1;
    },
    [dispatch, onComplete],
  );

  useEffect(() => {
    if (!isActive || isSuccess) return;
    const timer = setInterval(() => setTimeLeft(tickTimer), 1000);
    return () => clearInterval(timer);
  }, [isActive, isSuccess, tickTimer]);

  useEffect(() => {
    if (!isActive || isSuccess) return;

    const hasAll = targetOutfit.every((id) => equipped.includes(id));
    const hasNoExtras = equipped.every((id) => targetOutfit.includes(id));

    if (hasAll && hasNoExtras && equipped.length > 0) {
      setIsSuccess(true);
      setIsActive(false);
      const timeBonus = timeLeft * 5;
      dispatch({ type: "ADD_SCORE", delta: 50 + timeBonus });

      // Scoring Integration: Dispatch a hit for every item correctly equipped
      targetOutfit.forEach(() => dispatch({ type: "CUE_HIT" }));

      setTimeout(() => onComplete(), 3000);
    }
  }, [
    equipped,
    targetOutfit,
    isActive,
    isSuccess,
    timeLeft,
    dispatch,
    onComplete,
  ]);

  const toggleItem = useCallback(
    (id: string) => {
      if (!isActive || isSuccess) return;
      setEquipped((prev) =>
        prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
      );
    },
    [isActive, isSuccess],
  );

  return {
    RACK_ITEMS,
    targetOutfit,
    equipped,
    toggleItem,
    timeLeft,
    isActive,
    setIsActive,
    isSuccess,
  };
}
