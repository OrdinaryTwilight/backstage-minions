import { useEffect, useState } from "react";
import { useGame } from "../../../context/GameContext";
import { NARRATIVE } from "../../../data/narrative";
import { getShowPhase } from "./useInteraction";

// Global counter ensures absolute uniqueness even if React double-invokes the hook
let commsMessageId = 0;

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

      // FIX: Removed the redundant chatterPool.length === 0 check.
      // TypeScript already knows the exact lengths of the statically defined arrays.
      if (!chatterPool) return;

      const randomChatter =
        chatterPool[Math.floor(Math.random() * chatterPool.length)];

      setCommsLog((prev) => {
        commsMessageId += 1;
        const newLog = [
          ...prev,
          {
            id: commsMessageId,
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
