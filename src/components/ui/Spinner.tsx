import { useEffect, useState } from "react";
import { NARRATIVE } from "../../data/narrative";

/**
 * Loading Spinner Component
 * Displays while lazy-loaded routes are being fetched
 */
export function Spinner() {
  const [textIndex, setTextIndex] = useState(() =>
    Math.floor(Math.random() * NARRATIVE.bootSequence.length),
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setTextIndex((prev) => (prev + 1) % NARRATIVE.bootSequence.length);
    }, 1200);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column", // Stacks children vertically
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        background: "var(--bg)",
        color: "var(--text)",
      }}
    >
      {/* Existing Hourglass Spinner */}
      <div
        style={{
          fontSize: "2rem",
          animation: "spin 1s linear infinite",
        }}
      >
        ⏳
      </div>

      {/* Dynamic Narrative Text */}
      <p
        className="annotation-text animate-flicker"
        style={{
          marginTop: "1.5rem",
          opacity: 0.8,
          fontSize: "1.1rem",
          fontFamily: "var(--font-sketch)",
          color: "var(--bui-fg-info)",
        }}
      >
        {NARRATIVE.bootSequence[textIndex]}
      </p>

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
