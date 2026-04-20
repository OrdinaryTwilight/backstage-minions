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

    const interval = setInterval(() => {
      // 2. Roll the dice (50% chance to broadcast)
      if (Math.random() > 0.5) {
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
          // 3. Keep the array short so it doesn't flood the UI memory
          return newLog.slice(-4);
        });
      }
    }, 5000);

    // 4. Cleanup function to prevent memory leaks when the component unmounts
    return () => clearInterval(interval);
  }, [headsetOn]); // Re-run this hook whenever the player toggles the headset

  return { headsetOn, setHeadsetOn, commsLog };
}
