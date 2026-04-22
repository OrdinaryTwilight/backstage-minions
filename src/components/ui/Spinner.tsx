import { useEffect, useState } from "react";
import "../../styles/animations.css";

const BOOT_MESSAGES = [
  "Reticulating splines...",
  "Taping down cables...",
  "Looking for the 10mm wrench...",
  "Waking up the lighting console...",
  "Telling the actors to quiet down...",
  "Brewing more coffee...",
  "Finding missing props...",
  "Calibrating audio feedback...",
  "Un-tangling the comms headsets...",
];

interface SpinnerProps {
  label?: string;
}

export default function Spinner({ label }: Readonly<SpinnerProps>) {
  const [msg, setMsg] = useState(BOOT_MESSAGES[0]);

  useEffect(() => {
    const interval = setInterval(() => {
      setMsg(BOOT_MESSAGES[Math.floor(Math.random() * BOOT_MESSAGES.length)]);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      role="status"
      aria-live="polite"
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "1rem",
        padding: "2rem",
        width: "100%",
        minHeight: "60vh" /* Centers vertically on the page */,
        margin: "0 auto",
      }}
    >
      <div
        aria-hidden="true"
        style={{
          fontSize: "3rem",
          display: "inline-block",
          animation: "spin 2s linear infinite",
        }}
      >
        ⏳
      </div>

      <div
        style={{
          fontFamily: "var(--font-mono)",
          color: "var(--bui-fg-warning)",
          fontSize: "1.1rem",
          textAlign: "center",
        }}
        className="animate-pulse-go"
      >
        <span className="sr-only">Loading...</span>
        <span aria-hidden="true">{label || msg}</span>
      </div>

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          50% { transform: rotate(180deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
