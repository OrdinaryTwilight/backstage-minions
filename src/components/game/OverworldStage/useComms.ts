import { useEffect, useState } from "react";
import { NARRATIVE } from "../../../data/narrative";

export function useComms() {
  // Default to true so players hear chatter immediately
  const [headsetOn, setHeadsetOn] = useState(true);
  const [commsLog, setCommsLog] = useState<
    { id: number; speaker: string; text: string }[]
  >([]);

  useEffect(() => {
    // 1. Guard Clause: If the headset is off, don't even start the interval
    if (!headsetOn) return;

    // Helper to trigger a message
    const triggerChatter = () => {
      const randomChatter =
        NARRATIVE.commsChatter[
          Math.floor(Math.random() * NARRATIVE.commsChatter.length)
        ];

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
  }, [headsetOn]);

  return { headsetOn, setHeadsetOn, commsLog };
}
