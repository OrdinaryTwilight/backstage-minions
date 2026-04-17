import { useEffect, useState } from "react";
import { CHARACTERS, OVERWORLD_ZONES } from "../../data/gameData";
import { useKeyPress } from "../../hooks/useKeyPress";
import DialogueBox from "./DialogueBox";

interface OverworldStageProps {
  onComplete: () => void;
  department?: string;
  charId?: string; // Pass the player's charId so we don't spawn them as an NPC
}

export default function OverworldStage({
  onComplete,
  department,
  charId,
}: OverworldStageProps) {
  const GAME_WIDTH = 800;
  const GAME_HEIGHT = 450;
  const PLAYER_SIZE = 32;

  const [pos, setPos] = useState({ x: GAME_WIDTH / 2, y: GAME_HEIGHT / 2 });
  const [targetPos, setTargetPos] = useState<{ x: number; y: number } | null>(
    null,
  ); // Click-to-move state
  const [npcs, setNpcs] = useState<any[]>([]);

  const [activeZone, setActiveZone] = useState<string | null>(null);
  const [activeDialogue, setActiveDialogue] = useState<any | null>(null);
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);
  const [bumpMsg, setBumpMsg] = useState<{ id: string; msg: string } | null>(
    null,
  );

  // Bind both WASD and Arrows
  const up = useKeyPress(["w", "ArrowUp"]);
  const down = useKeyPress(["s", "ArrowDown"]);
  const left = useKeyPress(["a", "ArrowLeft"]);
  const right = useKeyPress(["d", "ArrowRight"]);
  const interact = useKeyPress(["e", "Enter", " "]);

  const speed = 5;

  // INITIALIZE NPCs
  useEffect(() => {
    // Get all characters EXCEPT the player
    const available = CHARACTERS.filter((c) => c.id !== charId);
    // Shuffle and pick at least 2, up to 4
    const shuffled = available.sort(() => 0.5 - Math.random());
    const count = Math.floor(Math.random() * 3) + 2;

    const spawned = shuffled.slice(0, count).map((npc) => ({
      ...npc,
      x: Math.random() * (GAME_WIDTH - 200) + 100,
      y: Math.random() * (GAME_HEIGHT - 200) + 100,
      dx: (Math.random() - 0.5) * 2,
      dy: (Math.random() - 0.5) * 2,
      moveTimer: Math.floor(Math.random() * 100) + 50,
    }));
    setNpcs(spawned);
  }, [charId]);

  // Handle Click to Move
  const handleStageClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x =
      ((e.clientX - rect.left) / rect.width) * GAME_WIDTH - PLAYER_SIZE / 2;
    const y =
      ((e.clientY - rect.top) / rect.height) * GAME_HEIGHT - PLAYER_SIZE / 2;
    setTargetPos({ x, y });
  };

  const checkCollision = (newX: number, newY: number) => {
    for (const zone of Object.values(OVERWORLD_ZONES)) {
      if (zone.isSolid) {
        if (
          newX < zone.x + zone.w &&
          newX + PLAYER_SIZE > zone.x &&
          newY < zone.y + zone.h &&
          newY + PLAYER_SIZE > zone.y
        )
          return true;
      }
    }
    return false;
  };

  // Main Game Loop
  useEffect(() => {
    if (activeDialogue) return; // Pause while talking

    const interval = setInterval(() => {
      setPos((prev) => {
        let dx = 0;
        let dy = 0;

        // Click-to-move logic
        if (targetPos) {
          const dist = Math.hypot(targetPos.x - prev.x, targetPos.y - prev.y);
          if (dist < speed) setTargetPos(null);
          else {
            dx = ((targetPos.x - prev.x) / dist) * speed;
            dy = ((targetPos.y - prev.y) / dist) * speed;
          }
        } else {
          // Keyboard logic
          if (up) dy -= speed;
          if (down) dy += speed;
          if (left) dx -= speed;
          if (right) dx += speed;
        }

        let newX = prev.x + dx;
        let newY = prev.y + dy;

        // Boundaries and Collisions
        newX = Math.max(0, Math.min(newX, GAME_WIDTH - PLAYER_SIZE));
        newY = Math.max(0, Math.min(newY, GAME_HEIGHT - PLAYER_SIZE));
        if (checkCollision(newX, prev.y)) {
          newX = prev.x;
          setTargetPos(null);
        }
        if (checkCollision(prev.x, newY)) {
          newY = prev.y;
          setTargetPos(null);
        }

        // Interactions and NPC Proximity
        let currentZone = null;
        for (const [key, zone] of Object.entries(OVERWORLD_ZONES)) {
          if (
            newX < zone.x + zone.w + 20 &&
            newX + PLAYER_SIZE > zone.x - 20 &&
            newY < zone.y + zone.h + 20 &&
            newY + PLAYER_SIZE > zone.y - 20
          )
            currentZone = key;
        }

        // NPC Logic (Stop when near player, trigger bump dialog)
        setNpcs((prevNpcs) =>
          prevNpcs.map((npc) => {
            const distToPlayer = Math.hypot(newX - npc.x, newY - npc.y);

            if (distToPlayer < 40) currentZone = npc.id; // Near enough to talk

            if (distToPlayer < 32 && (dx !== 0 || dy !== 0)) {
              // Bump collision!
              setBumpMsg({ id: npc.id, msg: "Watch it!" });
              setTimeout(() => setBumpMsg(null), 1000);
            }

            // Move NPC if player is far away
            if (distToPlayer > 80) {
              let nX = npc.x + npc.dx;
              let nY = npc.y + npc.dy;
              if (
                nX <= 0 ||
                nX >= GAME_WIDTH - PLAYER_SIZE ||
                checkCollision(nX, npc.y)
              )
                npc.dx *= -1;
              if (
                nY <= 0 ||
                nY >= GAME_HEIGHT - PLAYER_SIZE ||
                checkCollision(npc.x, nY)
              )
                npc.dy *= -1;

              let nTimer = npc.moveTimer - 1;
              if (nTimer <= 0) {
                npc.dx = (Math.random() - 0.5) * 2;
                npc.dy = (Math.random() - 0.5) * 2;
                nTimer = Math.floor(Math.random() * 120) + 60;
              }
              return { ...npc, x: nX, y: nY, moveTimer: nTimer };
            }
            return npc; // Stand still
          }),
        );

        setActiveZone(currentZone);
        return { x: newX, y: newY };
      });
    }, 1000 / 60);

    return () => clearInterval(interval);
  }, [up, down, left, right, targetPos, activeDialogue]);

  // Interaction key processing...
  useEffect(() => {
    if (interact && activeZone && !activeDialogue) {
      const staticZone = OVERWORLD_ZONES[activeZone];
      const activeNpc = npcs.find((n) => n.id === activeZone);
      setTargetPos(null); // Stop moving if talking

      if (staticZone) {
        if (activeZone === "lightBooth" || activeZone === "soundBooth") {
          if (staticZone.targetDept === department) onComplete();
          else {
            setFeedbackMsg("Wrong booth!");
            setTimeout(() => setFeedbackMsg(null), 2500);
          }
        } else if (staticZone.dialogue) setActiveDialogue(staticZone.dialogue);
      } else if (activeNpc) {
        setActiveDialogue({
          speaker: activeNpc.name,
          text: `Hey, I'm ${activeNpc.name}. Break a leg out there!`,
          choices: [
            { id: "ok", text: "Thanks!", pointDelta: 0, contact: null },
          ],
        });
      }
    }
  }, [interact, activeZone, activeDialogue, onComplete, department, npcs]);

  return (
    <div
      style={{
        width: "100%",
        maxWidth: "900px",
        margin: "0 auto",
        padding: "1rem",
        display: "flex",
        flexDirection: "column",
        gap: "1rem",
      }}
    >
      {/* Header Info */}
      <div
        style={{
          textAlign: "center",
          background: "var(--color-surface-translucent)",
          padding: "1rem",
          borderRadius: "8px",
          border: "1px solid var(--bui-fg-warning)",
        }}
      >
        <h2
          style={{
            color: "var(--bui-fg-warning)",
            margin: 0,
            fontFamily: "var(--font-mono)",
          }}
        >
          SYSTEM STANDBY: BACKSTAGE AREA
        </h2>
        <p
          style={{ margin: "0.5rem 0 0 0", color: "var(--color-pencil-light)" }}
        >
          Report to your designated console immediately. Hurry!
        </p>
      </div>

      {/* The Stage */}
      <div
        onClick={handleStageClick}
        style={{
          position: "relative",
          width: "100%",
          aspectRatio: "16/9",
          background: "#1a1a2e",
          border: "4px solid #fff",
          overflow: "hidden",
          cursor: "crosshair",
        }}
      >
        {/* Render Zones */}
        {Object.entries(OVERWORLD_ZONES).map(([key, zone]) => (
          <div
            key={key}
            style={{
              position: "absolute",
              left: `${(zone.x / GAME_WIDTH) * 100}%`,
              top: `${(zone.y / GAME_HEIGHT) * 100}%`,
              width: `${(zone.w / GAME_WIDTH) * 100}%`,
              height: `${(zone.h / GAME_HEIGHT) * 100}%`,
              background: zone.color,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              border: activeZone === key ? "3px solid #fbbf24" : "none",
              boxSizing: "border-box",
              fontWeight: "bold",
            }}
          >
            {zone.label}
          </div>
        ))}

        {/* Render NPCs */}
        {npcs.map((npc) => (
          <div
            key={npc.id}
            style={{
              position: "absolute",
              left: `${(npc.x / GAME_WIDTH) * 100}%`,
              top: `${(npc.y / GAME_HEIGHT) * 100}%`,
              width: `${(PLAYER_SIZE / GAME_WIDTH) * 100}%`,
              height: `${(PLAYER_SIZE / GAME_HEIGHT) * 100}%`,
              background: "var(--color-architect-blue)",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              fontSize: "12px",
              border: activeZone === npc.id ? "2px solid #fbbf24" : "none",
            }}
          >
            {npc.name[0]}
            {bumpMsg?.id === npc.id && (
              <span
                style={{
                  position: "absolute",
                  top: "-25px",
                  background: "white",
                  color: "black",
                  padding: "2px 6px",
                  borderRadius: "4px",
                  fontSize: "10px",
                  whiteSpace: "nowrap",
                }}
              >
                {bumpMsg?.msg}
              </span>
            )}
          </div>
        ))}

        {/* Interaction Prompts */}
        {feedbackMsg && (
          <div
            style={{
              position: "absolute",
              top: "15%",
              left: "50%",
              transform: "translateX(-50%)",
              background: "var(--bui-bg-danger, #b91c1c)",
              color: "white",
              padding: "10px 20px",
              borderRadius: "8px",
              fontWeight: "bold",
              zIndex: 300,
            }}
          >
            {feedbackMsg}
          </div>
        )}
        {activeZone && !activeDialogue && !feedbackMsg && (
          <div
            style={{
              position: "absolute",
              bottom: "10%",
              left: "50%",
              transform: "translateX(-50%)",
              color: "#fbbf24",
              fontWeight: "bold",
              fontSize: "1.2rem",
              zIndex: 50,
              background: "rgba(0,0,0,0.8)",
              padding: "8px 16px",
              borderRadius: "4px",
            }}
          >
            [E] or Click to Interact
          </div>
        )}
        {targetPos && (
          <div
            style={{
              position: "absolute",
              left: `${(targetPos.x / GAME_WIDTH) * 100}%`,
              top: `${(targetPos.y / GAME_HEIGHT) * 100}%`,
              width: "10px",
              height: "10px",
              background: "rgba(255,255,255,0.5)",
              borderRadius: "50%",
              transform: "translate(11px, 11px)",
            }}
          />
        )}

        {/* Player */}
        <div
          style={{
            position: "absolute",
            left: `${(pos.x / GAME_WIDTH) * 100}%`,
            top: `${(pos.y / GAME_HEIGHT) * 100}%`,
            width: `${(PLAYER_SIZE / GAME_WIDTH) * 100}%`,
            height: `${(PLAYER_SIZE / GAME_HEIGHT) * 100}%`,
            background: "#06d6a0",
            borderRadius: "4px",
            zIndex: 100,
          }}
        />
      </div>

      {/* Dialogue Box NOW BELOW THE STAGE */}
      <div style={{ minHeight: "150px" }}>
        {activeDialogue && (
          <DialogueBox
            speaker={activeDialogue.speaker}
            text={activeDialogue.text}
            choices={activeDialogue.choices}
            onChoice={() => setActiveDialogue(null)}
          />
        )}
      </div>
    </div>
  );
}
