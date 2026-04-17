import { useEffect, useState } from "react";
import { useKeyPress } from "../../hooks/useKeyPress";
import DialogueBox from "./DialogueBox"; // Import your existing dialogue component

interface OverworldStageProps {
  onComplete: () => void;
  nextStageName?: string;
}

// 1. Define zones. Added an "isSolid" flag and dialogue data!
const ZONES = {
  booth: { x: 650, y: 50, w: 100, h: 100, label: "BOOTH", color: "#4a4e69", isSolid: true },
  stageManager: { 
    x: 50, y: 250, w: 60, h: 60, label: "SM DESK", color: "#9a031e", isSolid: true,
    dialogue: {
      speaker: "Stage Manager",
      text: "We hold in 5! Have you verified the signal routing in the sound booth yet?",
      choices: [{ id: "ok", text: "On my way!", pointDelta: 0, contact: null }]
    }
  },
  propsTable: { x: 400, y: 350, w: 120, h: 60, label: "PROPS", color: "#5f0f40", isSolid: true },
  wings: { x: 0, y: 0, w: 80, h: 450, label: "STAGE WINGS", color: "rgba(0,0,0,0.3)", isSolid: false } // Non-solid ambient zone
};

export default function OverworldStage({ onComplete, nextStageName }: OverworldStageProps) {
  const GAME_WIDTH = 800;
  const GAME_HEIGHT = 450; 
  const PLAYER_SIZE = 32;
  
  const [pos, setPos] = useState({ x: GAME_WIDTH / 2, y: GAME_HEIGHT / 2 });
  const [activeZone, setActiveZone] = useState<string | null>(null);
  const [activeDialogue, setActiveDialogue] = useState<any | null>(null); // State for NPC talking
  
  const up = useKeyPress("w");
  const down = useKeyPress("s");
  const left = useKeyPress("a");
  const right = useKeyPress("d");
  const interact = useKeyPress("e");

  const speed = 5;

  // Collision Helper Function
  const checkCollision = (newX: number, newY: number) => {
    for (const zone of Object.values(ZONES)) {
      if (zone.isSolid) {
        if (newX < zone.x + zone.w && newX + PLAYER_SIZE > zone.x &&
            newY < zone.y + zone.h && newY + PLAYER_SIZE > zone.y) {
          return true; // Hit a solid object!
        }
      }
    }
    return false;
  };

  useEffect(() => {
    // Stop movement if dialogue is open
    if (activeDialogue) return;

    const interval = setInterval(() => {
      setPos((prev) => {
        let dx = 0;
        let dy = 0;

        if (up) dy -= speed;
        if (down) dy += speed;
        if (left) dx -= speed;
        if (right) dx += speed;

        let newX = prev.x + dx;
        let newY = prev.y + dy;

        // Keep inside screen bounds
        newX = Math.max(0, Math.min(newX, GAME_WIDTH - PLAYER_SIZE));
        newY = Math.max(0, Math.min(newY, GAME_HEIGHT - PLAYER_SIZE));

        // Slide Collision: Check X and Y independently
        if (checkCollision(newX, prev.y)) newX = prev.x; // Revert X if hitting a wall
        if (checkCollision(prev.x, newY)) newY = prev.y; // Revert Y if hitting a wall

        // Interaction Proximity Check (using a slightly larger box than the solid collision)
        let currentZone = null;
        for (const [key, zone] of Object.entries(ZONES)) {
          if (
            newX < zone.x + zone.w + 20 && newX + PLAYER_SIZE > zone.x - 20 &&
            newY < zone.y + zone.h + 20 && newY + PLAYER_SIZE > zone.y - 20
          ) { currentZone = key; }
        }
        setActiveZone(currentZone);

        return { x: newX, y: newY };
      });
    }, 1000 / 60);

    return () => clearInterval(interval);
  }, [up, down, left, right, activeDialogue]);

  useEffect(() => {
    if (interact && activeZone) {
      if (activeZone === "booth") {
        onComplete();
      } else if (activeZone === "stageManager" && !activeDialogue) {
        // Trigger Dialogue
        setActiveDialogue(ZONES.stageManager.dialogue);
      }
    }
  }, [interact, activeZone, activeDialogue, onComplete]);

  return (
    <div style={{ width: "100%", maxWidth: "900px", margin: "0 auto", padding: "1rem", position: "relative" }}>
      <div style={{ position: "relative", width: "100%", aspectRatio: "16/9", background: "#1a1a2e", border: "4px solid #fff", overflow: "hidden" }}>
        
        {/* Render Zones */}
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

        {/* Interaction Prompt (Hide if talking) */}
        {activeZone && !activeDialogue && (
          <div style={{ position: "absolute", top: "10%", left: "50%", transform: "translateX(-50%)", color: "#fbbf24", fontWeight: "bold", fontSize: "1.2rem", zIndex: 50, background: "rgba(0,0,0,0.5)", padding: "4px 8px", borderRadius: "4px" }}>
            [E] {ZONES[activeZone as keyof typeof ZONES].label}
          </div>
        )}

        {/* The Player Character */}
        <div style={{
          position: "absolute", left: `${(pos.x / GAME_WIDTH) * 100}%`, top: `${(pos.y / GAME_HEIGHT) * 100}%`,
          width: `${(PLAYER_SIZE / GAME_WIDTH) * 100}%`, height: `${(PLAYER_SIZE / GAME_HEIGHT) * 100}%`,
          background: "var(--accent)", zIndex: 100
        }} />
      </div>

      {/* RENDER DIALOGUE BOX ON TOP OF THE SCREEN */}
      {activeDialogue && (
        <div style={{ position: "absolute", bottom: "20px", left: "10%", right: "10%", zIndex: 200 }}>
          <DialogueBox 
            speaker={activeDialogue.speaker} 
            text={activeDialogue.text} 
            choices={activeDialogue.choices} 
            onChoice={() => setActiveDialogue(null)} 
          />
        </div>
      )}
    </div>
  );
}