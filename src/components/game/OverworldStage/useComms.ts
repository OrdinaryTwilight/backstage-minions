// src/components/game/OverworldStage/useComms.ts
import { useEffect, useState } from "react";
import { useGame } from "../../../context/GameContext";
import { NARRATIVE } from "../../../data/narrative";
import { getShowPhase } from "./useInteraction";

export function useComms() {
  const { state } = useGame();
  const [headsetOn, setHeadsetOn] = useState(true);
  const [commsLog, setCommsLog] = useState<
    { id: number; speaker: string; text: string }[]
  >([]);

  useEffect(() => {
    if (!headsetOn) return;

    const triggerChatter = () => {
      // Filter chatter dynamically by phase of show progression
      const phase = getShowPhase(state.session);
      const chatterPool = NARRATIVE.commsChatter[phase];

      const randomChatter =
        chatterPool[Math.floor(Math.random() * chatterPool.length)];

      setCommsLog((prev) => {
        const newLog = [
          ...prev,
          {
            id: Date.now(),
            speaker: randomChatter.speaker,
            text: randomChatter.text,
          },
        ];
        // Keep the array short so it doesn't flood the UI memory
        return newLog.slice(-4);
      });
    };

    // Trigger one immediately on load so the player knows it works
    triggerChatter();

    const interval = setInterval(() => {
      // Roll the dice (60% chance to broadcast every 5 seconds)
      if (Math.random() > 0.4) {
        triggerChatter();
      }
    }, 5000);

    // Cleanup function to prevent memory leaks
    return () => clearInterval(interval);
  }, [headsetOn, state.session]);

  return { headsetOn, setHeadsetOn, commsLog };
}
