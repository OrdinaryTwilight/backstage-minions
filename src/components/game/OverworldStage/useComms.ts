import { useEffect, useRef, useState } from "react";

const COMMS_CHATTER = [
  { speaker: "SM", text: "Quiet on headset, please." },
  { speaker: "LX", text: "Spot 2 is drifting, fixing it now." },
  { speaker: "SND", text: "Mics 4 and 5 are hot, actors watch your mouths." },
  { speaker: "ASM", text: "Actors are at places." },
  {
    speaker: "WARDROBE",
    text: "We have a ripped seam, holding actors in Green Room!",
  },
  { speaker: "PROPS", text: "Who took my gaff tape?!" },
];

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
          COMMS_CHATTER[Math.floor(Math.random() * COMMS_CHATTER.length)];
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
    }, 4000);

    return () => clearInterval(interval);
  }, [headsetOn]);

  return { headsetOn, setHeadsetOn, commsLog };
}
