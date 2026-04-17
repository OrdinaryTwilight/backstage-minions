import { useEffect, useState } from "react";
import { useKeyPress } from "../../hooks/useKeyPress";

interface OverworldStageProps {
  onComplete: () => void;
  nextStageName?: string;
}

// Define our interactable zones
const ZONES = {
  booth: { x: 650, y: 50, w: 100, h: 100, label: "BOOTH", color: "#4a4e69" },
  stageManager: { x: 50, y: 250, w: 60, h: 60, label: "SM DESK", color: "#9a031e" },
  propsTable: { x: 400, y: 350, w: 120, h: 60, label: "PROPS", color: "#5f0f40" }
};

export default function OverworldStage({ onComplete, nextStageName }: OverworldStageProps) {
  // We use a fixed internal resolution, but CSS will scale it to fit the screen
  const GAME_WIDTH = 800;
  const GAME_HEIGHT = 450; 
  
  const [pos, setPos] = useState({ x: GAME_WIDTH / 2, y: GAME_HEIGHT / 2 });
  const [activeZone, setActiveZone] = useState<string | null>(null);
  
  const up = useKeyPress("w");
  const down = useKeyPress("s");
  const left = useKeyPress("a");
  const right = useKeyPress("d");
  const interact = useKeyPress("e");

  const speed = 6;

  useEffect(() => {
    const interval = setInterval(() => {
      setPos((prev) => {
        let newX = prev.x;
        let newY = prev.y;

        if (up) newY -= speed;
        if (down) newY += speed;
        if (left) newX -= speed;
        if (right) newX += speed;

        // Keep player inside bounds
        newX = Math.max(0, Math.min(newX, GAME_WIDTH - 32));
        newY = Math.max(0, Math.min(newY, GAME_HEIGHT - 32));

        // Check distance to all zones
        let currentZone = null;
        for (const [key, zone] of Object.entries(ZONES)) {
          // Simple AABB Collision box check with a little padding
          if (
            newX < zone.x + zone.w + 20 &&
            newX + 32 > zone.x - 20 &&
            newY < zone.y + zone.h + 20 &&
            newY + 32 > zone.y - 20
          ) {
            currentZone = key;
          }
        }
        setActiveZone(currentZone);

        return { x: newX, y: newY };
      });
    }, 1000 / 60);

    return () => clearInterval(interval);
  }, [up, down, left, right]);

  useEffect(() => {
    // Only advance to the minigame if they are at the correct zone!
    // Right now, we assume all next stages require the Booth, but you can adjust this logic.
    if (interact && activeZone === "booth") {
      onComplete();
    }
  }, [interact, activeZone, onComplete]);

  return (
    // Responsive container scaling
    <div style={{ width: "100%", maxWidth: "900px", margin: "0 auto", padding: "1rem" }}>
      <div style={{ 
        position: "relative", 
        width: "100%", 
        aspectRatio: "16/9", 
        background: "#1a1a2e", 
        border: "4px solid #fff", 
        overflow: "hidden" 
      }}>
        
        {/* Render Zones dynamically */}
        {Object.entries(ZONES).map(([key, zone]) => (
          <div key={key} style={{
            position: "absolute", left: `${(zone.x / GAME_WIDTH) * 100}%`, top: `${(zone.y / GAME_HEIGHT) * 100}%`,
            width: `${(zone.w / GAME_WIDTH) * 100}%`, height: `${(zone.h / GAME_HEIGHT) * 100}%`,
            background: zone.color, display: "flex", alignItems: "center", justifyContent: "center", color: "white",
            border: activeZone === key ? "3px solid #fbbf24" : "none",
            boxSizing: "border-box"
          }}>
            {zone.label}
          </div>
        ))}

        {/* Interaction Prompt */}
        {activeZone && (
          <div style={{ position: "absolute", top: "10%", left: "50%", transform: "translateX(-50%)", color: "#fbbf24", fontWeight: "bold", fontSize: "1.2rem", zIndex: 50 }}>
            Press [E] to interact with {ZONES[activeZone as keyof typeof ZONES].label}
          </div>
        )}

        {/* The Player Character - Fixed visibility using hardcoded colors and zIndex */}
        <div style={{
          position: "absolute",
          left: `${(pos.x / GAME_WIDTH) * 100}%`,
          top: `${(pos.y / GAME_HEIGHT) * 100}%`,
          width: "4%", height: "7%", // Percentage based on viewport
          background: "#06d6a0", // Bright visible green!
          borderRadius: "4px",
          zIndex: 100
        }} />
      </div>
    </div>
  );
}