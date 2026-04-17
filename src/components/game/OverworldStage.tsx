import { useEffect, useRef, useState } from "react";
import { useKeyPress } from "../../hooks/useKeyPress";
import DialogueBox from "./DialogueBox";

interface OverworldStageProps {
  onComplete: () => void;
  department?: string; 
  // Removed unused nextStageName to satisfy the TS linter
}

// 1. Define an Interface to satisfy TypeScript's strict type checking
interface ZoneConfig {
  x: number;
  y: number;
  w: number;
  h: number;
  label: string;
  color: string;
  isSolid: boolean;
  targetDept?: string; // Optional property
  dialogue?: {         // Optional property
    speaker: string;
    text: string;
    choices: { id: string; text: string; pointDelta: number; contact: null; }[];
  };
}

// 2. Apply the interface to the ZONES object
const ZONES: Record<string, ZoneConfig> = {
  lightBooth: { x: 650, y: 40, w: 100, h: 90, label: "LX BOOTH", color: "#4a4e69", isSolid: true, targetDept: "lighting" },
  soundBooth: { x: 650, y: 170, w: 100, h: 90, label: "SND BOOTH", color: "#22223b", isSolid: true, targetDept: "sound" },
  stageManager: { 
    x: 100, y: 250, w: 80, h: 60, label: "SM DESK", color: "#9a031e", isSolid: true,
    dialogue: {
      speaker: "Stage Manager",
      text: "We hold in 5! Have you verified the signal routing yet?",
      choices: [{ id: "ok", text: "On my way!", pointDelta: 0, contact: null }]
    }
  },
  propsTable: { x: 400, y: 350, w: 120, h: 60, label: "PROPS", color: "#5f0f40", isSolid: true },
  wings: { x: 0, y: 0, w: 80, h: 450, label: "WINGS", color: "rgba(0,0,0,0.3)", isSolid: false }
};

export default function OverworldStage({ onComplete, department }: OverworldStageProps) {
  const GAME_WIDTH = 800;
  const GAME_HEIGHT = 450; 
  const PLAYER_SIZE = 32;
  
  const [pos, setPos] = useState({ x: GAME_WIDTH / 2, y: GAME_HEIGHT / 2 });
  const [activeZone, setActiveZone] = useState<string | null>(null);
  const [activeDialogue, setActiveDialogue] = useState<any | null>(null); 
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);
  
  const up = useKeyPress("w");
  const down = useKeyPress("s");
  const left = useKeyPress("a");
  const right = useKeyPress("d");
  const interact = useKeyPress("e");

  // AUDIO STATE
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [audioStarted, setAudioStarted] = useState(false);

  const speed = 5;

  // Set up the background audio track
  useEffect(() => {
    // You will need to place a dummy mp3 in your public folder!
    audioRef.current = new Audio("/stage-muffled.mp3"); 
    audioRef.current.loop = true;
    audioRef.current.volume = 0; // Start at 0 volume
    
    return () => {
      // Cleanup audio when stage unmounts
      audioRef.current?.pause();
      audioRef.current = null;
    };
  }, []);

  // Browsers require a user interaction before playing audio. 
  // We trigger it on the first key press.
  useEffect(() => {
    if (!audioStarted && (up || down || left || right || interact)) {
      audioRef.current?.play().catch(e => console.log("Audio play prevented:", e));
      setAudioStarted(true);
    }
  }, [up, down, left, right, interact, audioStarted]);

  // Dynamic Spatial Volume Logic
  useEffect(() => {
    if (audioRef.current && audioStarted) {
      // Calculate how close the player is to the Left edge (x: 0)
      const distanceRatio = pos.x / GAME_WIDTH;
      
      // When at the Wings (ratio 0), volume is 1.0. 
      // When at the Booths (ratio 1), volume drops to 0.1.
      const dynamicVolume = 1.0 - (distanceRatio * 0.9);
      
      // Clamp between 0.05 and 1.0 to prevent it from going totally silent or too loud
      audioRef.current.volume = Math.max(0.05, Math.min(1.0, dynamicVolume));
    }
  }, [pos.x, audioStarted]);


  // Physics & Movement Loop
  const checkCollision = (newX: number, newY: number) => {
    for (const zone of Object.values(ZONES)) {
      if (zone.isSolid) {
        if (newX < zone.x + zone.w && newX + PLAYER_SIZE > zone.x &&
            newY < zone.y + zone.h && newY + PLAYER_SIZE > zone.y) {
          return true;
        }
      }
    }
    return false;
  };

  useEffect(() => {
    if (activeDialogue) return;

    const interval = setInterval(() => {
      setPos((prev) => {
        let dx = 0; let dy = 0;

        if (up) dy -= speed;
        if (down) dy += speed;
        if (left) dx -= speed;
        if (right) dx += speed;

        let newX = prev.x + dx;
        let newY = prev.y + dy;

        newX = Math.max(0, Math.min(newX, GAME_WIDTH - PLAYER_SIZE));
        newY = Math.max(0, Math.min(newY, GAME_HEIGHT - PLAYER_SIZE));

        if (checkCollision(newX, prev.y)) newX = prev.x;
        if (checkCollision(prev.x, newY)) newY = prev.y;

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

  // Interaction Loop
  useEffect(() => {
    if (interact && activeZone) {
      const zone = ZONES[activeZone]; // TS is happy now!

      if (activeZone === "lightBooth" || activeZone === "soundBooth") {
        if (zone.targetDept === department) {
          onComplete();
        } else {
          const msg = zone.targetDept === "lighting" 
            ? "Wrong booth! The LX crew is glaring at you." 
            : "This is Sound! Don't touch those faders!";
          setFeedbackMsg(msg);
          setTimeout(() => setFeedbackMsg(null), 2500);
        }
      } else if (activeZone === "stageManager" && !activeDialogue) {
        // TS knows dialogue exists but might be undefined, so we pass it safely
        if (zone.dialogue) setActiveDialogue(zone.dialogue);
      }
    }
  }, [interact, activeZone, activeDialogue, onComplete, department]);

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
            boxSizing: "border-box", fontWeight: "bold"
          }}>
            {zone.label}
          </div>
        ))}

        {/* Playful Rejection Feedback Popup */}
        {feedbackMsg && (
          <div style={{
            position: "absolute", top: "15%", left: "50%", transform: "translateX(-50%)",
            background: "var(--bui-bg-danger, #b91c1c)", color: "white", padding: "10px 20px",
            borderRadius: "8px", fontWeight: "bold", zIndex: 300, textAlign: "center",
            boxShadow: "0 4px 6px rgba(0,0,0,0.3)"
          }}>
            {feedbackMsg}
          </div>
        )}

        {/* Interaction Prompt */}
        {activeZone && !activeDialogue && !feedbackMsg && (
          <div style={{ position: "absolute", top: "5%", left: "50%", transform: "translateX(-50%)", color: "#fbbf24", fontWeight: "bold", fontSize: "1.2rem", zIndex: 50, background: "rgba(0,0,0,0.7)", padding: "6px 12px", borderRadius: "4px" }}>
            [E] {ZONES[activeZone].label}
          </div>
        )}

        {/* The Player Character */}
        <div style={{
          position: "absolute", left: `${(pos.x / GAME_WIDTH) * 100}%`, top: `${(pos.y / GAME_HEIGHT) * 100}%`,
          width: `${(PLAYER_SIZE / GAME_WIDTH) * 100}%`, height: `${(PLAYER_SIZE / GAME_HEIGHT) * 100}%`,
          background: "#06d6a0", borderRadius: "4px", zIndex: 100
        }} />
      </div>

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