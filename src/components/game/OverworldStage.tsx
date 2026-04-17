import { useEffect, useState } from "react";
import { useKeyPress } from "../../hooks/useKeyPress";

interface OverworldStageProps {
  onComplete: () => void;
  nextStageName?: string;
}

export default function OverworldStage({ onComplete, nextStageName }: OverworldStageProps) {
  // Player Position
  const [pos, setPos] = useState({ x: 100, y: 100 });
  const [isNearConsole, setIsNearConsole] = useState(false);
  
  // Movement Keys
  const up = useKeyPress("w");
  const down = useKeyPress("s");
  const left = useKeyPress("a");
  const right = useKeyPress("d");
  const interact = useKeyPress("e");

  // Console Hitbox Configuration (The Control Booth)
  const consoleBox = { x: 300, y: 50, width: 80, height: 80 };
  const speed = 5;

  // Game Loop for Movement
  useEffect(() => {
    const interval = setInterval(() => {
      setPos((prev) => {
        let newX = prev.x;
        let newY = prev.y;

        if (up) newY -= speed;
        if (down) newY += speed;
        if (left) newX -= speed;
        if (right) newX += speed;

        // Basic bounds checking (assuming a 600x400 container)
        newX = Math.max(0, Math.min(newX, 550));
        newY = Math.max(0, Math.min(newY, 350));

        // Check distance to console
        const distance = Math.hypot(newX - consoleBox.x, newY - consoleBox.y);
        setIsNearConsole(distance < 60);

        return { x: newX, y: newY };
      });
    }, 1000 / 60); // 60 FPS

    return () => clearInterval(interval);
  }, [up, down, left, right]);

  // Handle Interaction
  useEffect(() => {
    if (isNearConsole && interact) {
      onComplete(); // Triggers the next minigame!
    }
  }, [interact, isNearConsole, onComplete]);

  return (
    <div className="stage-container" style={{ position: "relative", width: "600px", height: "400px", background: "#1a1a2e", border: "4px solid #fff", overflow: "hidden", margin: "0 auto" }}>
      
      {/* HUD */}
      <div style={{ position: "absolute", top: 10, left: 10, color: "white", zIndex: 10 }}>
        <p>Use W,A,S,D to move.</p>
        <p>Head to the Control Booth for: {nextStageName || "Showtime"}</p>
      </div>

      {/* The Control Booth (Interactable) */}
      <div style={{
        position: "absolute",
        left: consoleBox.x,
        top: consoleBox.y,
        width: consoleBox.width,
        height: consoleBox.height,
        background: "#4a4e69",
        border: isNearConsole ? "2px solid #fbbf24" : "2px solid #22223b",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "white"
      }}>
        BOOTH
      </div>

      {/* Interaction Prompt */}
      {isNearConsole && (
        <div style={{ position: "absolute", left: consoleBox.x - 20, top: consoleBox.y - 30, color: "#fbbf24", fontWeight: "bold" }}>
          [Press E]
        </div>
      )}

      {/* The Player Character */}
      <div style={{
        position: "absolute",
        left: pos.x,
        top: pos.y,
        width: "32px",
        height: "32px",
        background: "var(--accent)", // Use your CSS variables
        borderRadius: "4px",
        transition: "none", // Prevent CSS smoothing so it feels like crisp 8-bit movement
      }}>
        {/* You can replace this div with an actual 8-bit sprite img tag later */}
      </div>
    </div>
  );
}