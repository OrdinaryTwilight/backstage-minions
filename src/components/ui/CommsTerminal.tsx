/**
 * @file Comms Terminal Component
 * @description Displays simulated radio/headset chatter during gameplay.
 * Shows realistic backstage communication that reinforces theater atmosphere.
 *
 * Functionality:
 * - Cycles through pool of pre-written radio messages
 * - New message every 8 seconds
 * - Keeps last 4 messages in buffer
 * - Low opacity to not distract from main gameplay
 *
 * Atmospheric Element: Provides ambient sound designer/stage manager dialogue
 * to enhance immersion in the theater setting.
 *
 * @component
 */

import { useEffect, useState } from "react";

interface Chatter {
  id: number;
  sender: string;
  text: string;
}

const CHATTER_POOL = [
  { sender: "ASM", text: "Clear stage left, moving the piano now." },
  { sender: "LD", text: "LX 45 looks a bit warm, check the gel." },
  { sender: "MD", text: "Pit is tuned and ready." },
  { sender: "SM", text: "Check your headsets, going to standby in 5." },
];

export default function CommsTerminal() {
  const [messages, setMessages] = useState<Chatter[]>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      const randomMsg =
        CHATTER_POOL[Math.floor(Math.random() * CHATTER_POOL.length)];
      setMessages((prev) => [
        ...prev.slice(-3),
        { ...randomMsg, id: Date.now() },
      ]);
    }, 8000); // New chatter every 8 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className="console-screen tech-glow"
      style={{ fontSize: "0.7rem", height: "100px", opacity: 0.6 }}
    >
      <div
        className="annotation-text"
        style={{ borderBottom: "1px solid #333", marginBottom: "5px" }}
      >
        [ COMMS_CHANNEL_01 ]
      </div>
      {messages.map((m) => (
        <div key={m.id} style={{ marginBottom: "2px" }}>
          <b style={{ color: "var(--bui-fg-info)" }}>{m.sender}:</b> {m.text}
        </div>
      ))}
    </div>
  );
}
