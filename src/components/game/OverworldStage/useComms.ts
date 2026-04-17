import { useEffect, useRef, useState } from "react";

const COMMS_CHATTER = [
  { speaker: "SM", text: "Quiet on headset, please." },
  { speaker: "SM", text: "Standby all departments." },
  { speaker: "SM", text: "Who is eating chips on the comms? Mute your mic." },
  { speaker: "LX", text: "Spot 2 is drifting, fixing it now." },
  { speaker: "LX", text: "Board is lagging a bit, hold on." },
  { speaker: "LX", text: "Did someone unplug my monitor?" },
  { speaker: "SND", text: "Mics 4 and 5 are hot, actors watch your mouths." },
  { speaker: "SND", text: "Getting some feedback from downstage left." },
  { speaker: "SND", text: "Battery low on Mic 2, swap it at intermission." },
  { speaker: "ASM", text: "Actors are at places." },
  {
    speaker: "ASM",
    text: "We are missing the lead! Found them in the bathroom.",
  },
  {
    speaker: "WARDROBE",
    text: "We have a ripped seam, holding actors in Green Room!",
  },
  { speaker: "WARDROBE", text: "Need a flashlight in Dressing Room B, ASAP." },
  { speaker: "PROPS", text: "Who took my gaff tape?!" },
  { speaker: "PROPS", text: "The fake sword is bent again." },
  { speaker: "DIRECTOR", text: "Can we make it brighter? It feels sad." },
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
    }, 4500); // Slightly longer delay to reduce spam

    return () => clearInterval(interval);
  }, [headsetOn]);

  return { headsetOn, setHeadsetOn, commsLog };
}
