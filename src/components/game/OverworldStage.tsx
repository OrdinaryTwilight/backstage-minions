import { useEffect, useRef, useState } from "react";
import { AVAILABLE_NPCS } from "../../data/characters";
import { useKeyPress } from "../../hooks/useKeyPress";
import DialogueBox from "./DialogueBox";

interface OverworldStageProps {
  onComplete: () => void;
  department?: string; 
}

interface ZoneConfig {
  x: number; y: number; w: number; h: number;
  label: string; color: string; isSolid: boolean;
  targetDept?: string;
  dialogue?: any;
}

const ZONES: Record<string, ZoneConfig> = {
  lightBooth: { x: 650, y: 40, w: 100, h: 90, label: "LX BOOTH", color: "#4a4e69", isSolid: true, targetDept: "lighting" },
  soundBooth: { x: 650, y: 170, w: 100, h: 90, label: "SND BOOTH", color: "#22223b", isSolid: true, targetDept: "sound" },
  stageManager: { 
    x: 100, y: 250, w: 80, h: 60, label: "SM DESK", color: "#9a031e", isSolid: true,
    dialogue: { speaker: "Stage Manager", text: "We hold in 5! Have you verified the signal routing yet?", choices: [{ id: "ok", text: "On my way!", pointDelta: 0, contact: null }] }
  },
  propsTable: { 
    x: 400, y: 350, w: 120, h: 60, label: "PROPS", color: "#5f0f40", isSolid: true,
    dialogue: { speaker: "Props Master", text: "Hey! Don't touch the prop swords. I just repainted the fake blood.", choices: [{ id: "ok", text: "Backing away slowly...", pointDelta: 0, contact: null }] }
  },
  wings: { 
    x: 0, y: 0, w: 80, h: 450, label: "WINGS", color: "rgba(0,0,0,0.3)", isSolid: false,
    dialogue: { speaker: "Nervous Actor", text: "Psst! Did I miss my entrance? Oh wait... I'm not even in this scene.", choices: [{ id: "ok", text: "Shh! Quiet in the wings!", pointDelta: 0, contact: null }] }
  }
};

export default function OverworldStage({ onComplete, department }: OverworldStageProps) {
  const GAME_WIDTH = 800;
  const GAME_HEIGHT = 450; 
  const PLAYER_SIZE = 32;
  
  const [pos, setPos] = useState({ x: GAME_WIDTH / 2, y: GAME_HEIGHT / 2 });
  const [npcs, setNpcs] = useState<any[]>([]); // Dynamic NPC state
  
  const [activeZone, setActiveZone] = useState<string | null>(null);
  const [activeDialogue, setActiveDialogue] = useState<any | null>(null); 
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);
  
  const up = useKeyPress("w");
  const down = useKeyPress("s");
  const left = useKeyPress("a");
  const right = useKeyPress("d");
  const interact = useKeyPress("e");

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [audioStarted, setAudioStarted] = useState(false);

  const speed = 5;

  // SPAWN NPCs (Run Once)
  useEffect(() => {
    // 70% chance for each NPC to spawn, making the backstage feel alive and varied
    const spawnedNpcs = AVAILABLE_NPCS.filter(() => Math.random() > 0.3).map(npc => ({
      ...npc,
      x: Math.random() * (GAME_WIDTH - 200) + 100, // Spawn away from edges
      y: Math.random() * (GAME_HEIGHT - 200) + 100,
      dx: (Math.random() - 0.5) * 2, // Random starting velocity
      dy: (Math.random() - 0.5) * 2,
      moveTimer: Math.floor(Math.random() * 100) + 50
    }));
    setNpcs(spawnedNpcs);
  }, []);

  // Spatial Audio
  useEffect(() => {
    audioRef.current = new Audio("/stage-muffled.mp3"); 
    audioRef.current.loop = true;
    audioRef.current.volume = 0; 
    return () => { audioRef.current?.pause(); audioRef.current = null; };
  }, []);

  useEffect(() => {
    if (!audioStarted && (up || down || left || right || interact)) {
      audioRef.current?.play().catch(() => {});
      setAudioStarted(true);
    }
  }, [up, down, left, right, interact, audioStarted]);

  useEffect(() => {
    if (audioRef.current && audioStarted) {
      const distanceRatio = pos.x / GAME_WIDTH;
      const dynamicVolume = 1.0 - (distanceRatio * 0.9);
      audioRef.current.volume = Math.max(0.05, Math.min(1.0, dynamicVolume));
    }
  }, [pos.x, audioStarted]);

  const checkCollision = (newX: number, newY: number) => {
    for (const zone of Object.values(ZONES)) {
      if (zone.isSolid) {
        if (newX < zone.x + zone.w && newX + PLAYER_SIZE > zone.x &&
            newY < zone.y + zone.h && newY + PLAYER_SIZE > zone.y) return true;
      }
    }
    return false;
  };

  // Main Movement & Interaction Loop
  useEffect(() => {
    if (activeDialogue) return; // Freeze game while talking

    const interval = setInterval(() => {
      // 1. Move Player
      setPos((prev) => {
        let dx = 0; let dy = 0;
        if (up) dy -= speed; if (down) dy += speed;
        if (left) dx -= speed; if (right) dx += speed;

        let newX = prev.x + dx; let newY = prev.y + dy;
        newX = Math.max(0, Math.min(newX, GAME_WIDTH - PLAYER_SIZE));
        newY = Math.max(0, Math.min(newY, GAME_HEIGHT - PLAYER_SIZE));

        if (checkCollision(newX, prev.y)) newX = prev.x;
        if (checkCollision(prev.x, newY)) newY = prev.y;

        // Check Zone Interactions
        let currentZone = null;
        for (const [key, zone] of Object.entries(ZONES)) {
          if (newX < zone.x + zone.w + 20 && newX + PLAYER_SIZE > zone.x - 20 &&
              newY < zone.y + zone.h + 20 && newY + PLAYER_SIZE > zone.y - 20) currentZone = key;
        }

        // Check NPC Interactions
        for (const npc of npcs) {
          if (Math.abs(newX - npc.x) < 40 && Math.abs(newY - npc.y) < 40) currentZone = npc.id;
        }

        setActiveZone(currentZone);
        return { x: newX, y: newY };
      });

      // 2. Move NPCs
      setNpcs((prev) => prev.map(npc => {
        let newX = npc.x + npc.dx;
        let newY = npc.y + npc.dy;
        let newDx = npc.dx;
        let newDy = npc.dy;
        let newTimer = npc.moveTimer - 1;

        // Bounce off screen edges
        if (newX <= 0 || newX >= GAME_WIDTH - PLAYER_SIZE) newDx *= -1;
        if (newY <= 0 || newY >= GAME_HEIGHT - PLAYER_SIZE) newDy *= -1;

        // Bounce off solid objects
        if (checkCollision(newX, npc.y)) newDx *= -1;
        if (checkCollision(npc.x, newY)) newDy *= -1;

        // Pick a new random direction when timer ends
        if (newTimer <= 0) {
          newDx = (Math.random() - 0.5) * 2;
          newDy = (Math.random() - 0.5) * 2;
          newTimer = Math.floor(Math.random() * 120) + 60; // Walk for 1-2 seconds
        }

        return { ...npc, x: newX, y: newY, dx: newDx, dy: newDy, moveTimer: newTimer };
      }));
    }, 1000 / 60);

    return () => clearInterval(interval);
  }, [up, down, left, right, activeDialogue, npcs]); // Need npcs in dependency array so interaction checks latest positions

  // Interaction Handling
  useEffect(() => {
    if (interact && activeZone && !activeDialogue) {
      const staticZone = ZONES[activeZone];
      const activeNpc = npcs.find(n => n.id === activeZone);

      if (staticZone) {
        if (activeZone === "lightBooth" || activeZone === "soundBooth") {
          if (staticZone.targetDept === department) onComplete();
          else {
            setFeedbackMsg(staticZone.targetDept === "lighting" ? "Wrong booth! The LX crew is glaring at you." : "This is Sound! Don't touch those faders!");
            setTimeout(() => setFeedbackMsg(null), 2500);
          }
        } else if (staticZone.dialogue) {
          setActiveDialogue(staticZone.dialogue);
        }
      } else if (activeNpc) {
        // Trigger the dynamic department-based dialogue!
        setActiveDialogue(activeNpc.dialogue(department));
      }
    }
  }, [interact, activeZone, activeDialogue, onComplete, department, npcs]);

  return (
    <div style={{ width: "100%", maxWidth: "900px", margin: "0 auto", padding: "1rem", position: "relative" }}>
      <div style={{ position: "relative", width: "100%", aspectRatio: "16/9", background: "#1a1a2e", border: "4px solid #fff", overflow: "hidden" }}>
        
        {/* Render Zones */}
        {Object.entries(ZONES).map(([key, zone]) => (
          <div key={key} style={{
            position: "absolute", left: `${(zone.x / GAME_WIDTH) * 100}%`, top: `${(zone.y / GAME_HEIGHT) * 100}%`,
            width: `${(zone.w / GAME_WIDTH) * 100}%`, height: `${(zone.h / GAME_HEIGHT) * 100}%`,
            background: zone.color, display: "flex", alignItems: "center", justifyContent: "center", color: "white",
            border: activeZone === key ? "3px solid #fbbf24" : "none", boxSizing: "border-box", fontWeight: "bold"
          }}>{zone.label}</div>
        ))}

        {/* Render Moving NPCs */}
        {npcs.map((npc) => (
          <div key={npc.id} style={{
            position: "absolute", left: `${(npc.x / GAME_WIDTH) * 100}%`, top: `${(npc.y / GAME_HEIGHT) * 100}%`,
            width: `${(PLAYER_SIZE / GAME_WIDTH) * 100}%`, height: `${(PLAYER_SIZE / GAME_HEIGHT) * 100}%`,
            background: npc.color, borderRadius: "50%", zIndex: 90, 
            border: activeZone === npc.id ? "3px solid #fbbf24" : "none",
            display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontSize: "10px"
          }}>
            {npc.name[0]} {/* First letter of their name */}
          </div>
        ))}

        {/* Rejection Msg */}
        {feedbackMsg && (
          <div style={{ position: "absolute", top: "15%", left: "50%", transform: "translateX(-50%)", background: "var(--bui-bg-danger, #b91c1c)", color: "white", padding: "10px 20px", borderRadius: "8px", fontWeight: "bold", zIndex: 300, textAlign: "center", boxShadow: "0 4px 6px rgba(0,0,0,0.3)" }}>
            {feedbackMsg}
          </div>
        )}

        {/* Prompt */}
        {activeZone && !activeDialogue && !feedbackMsg && (
          <div style={{ position: "absolute", top: "5%", left: "50%", transform: "translateX(-50%)", color: "#fbbf24", fontWeight: "bold", fontSize: "1.2rem", zIndex: 50, background: "rgba(0,0,0,0.7)", padding: "6px 12px", borderRadius: "4px" }}>
            [E] Talk / Interact
          </div>
        )}

        {/* Player */}
        <div style={{ position: "absolute", left: `${(pos.x / GAME_WIDTH) * 100}%`, top: `${(pos.y / GAME_HEIGHT) * 100}%`, width: `${(PLAYER_SIZE / GAME_WIDTH) * 100}%`, height: `${(PLAYER_SIZE / GAME_HEIGHT) * 100}%`, background: "#06d6a0", borderRadius: "4px", zIndex: 100 }} />
      </div>

      {activeDialogue && (
        <div style={{ position: "absolute", bottom: "20px", left: "10%", right: "10%", zIndex: 200 }}>
          <DialogueBox speaker={activeDialogue.speaker} text={activeDialogue.text} choices={activeDialogue.choices} onChoice={() => setActiveDialogue(null)} />
        </div>
      )}
    </div>
  );
}