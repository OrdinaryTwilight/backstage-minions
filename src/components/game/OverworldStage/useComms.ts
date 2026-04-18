import { useEffect, useRef, useState } from "react";
import { NARRATIVE } from "../../../data/narrative";

export function useComms() {
  const [headsetOn, setHeadsetOn] = useState(true);
  const [commsLog, setCommsLog] = useState<
    { id: number; speaker: string; text: string }[]
  >([]);
  const nextCommsId = useRef(0);

  useEffect(() => {
    if (!headsetOn) return;
    const interval = setInterval(() => {
      if (Math.random() > 0.6) {
        const chatter =
          NARRATIVE.commsChatter[
            Math.floor(Math.random() * NARRATIVE.commsChatter.length)
          ];
        const newMessage = {
          id: nextCommsId.current++,
          speaker: chatter.speaker,
          text: chatter.text,
        };

        setCommsLog((prev) => {
          const updated = [...prev, newMessage];
          if (updated.length > 4) updated.shift();
          return updated;
        });
      }
    }, 4500); // Slightly longer delay to reduce spam

    return () => clearInterval(interval);
  }, [headsetOn]);

  return { headsetOn, setHeadsetOn, commsLog };
}
