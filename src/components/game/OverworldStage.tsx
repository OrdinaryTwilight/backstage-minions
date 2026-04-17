import { useEffect, useState } from "react";
import { CHARACTERS, OVERWORLD_ZONES } from "../../data/gameData";
import { useKeyPress } from "../../hooks/useKeyPress";
import DialogueBox from "./DialogueBox";

interface NPC {
  id: string;
  name: string;
  icon: string;
  dept: string;
  x: number;
  y: number;
  dx: number;
  dy: number;
  moveTimer: number;
  isHidden: boolean;
  hideTimer: number;
}

interface DialogueState {
  speaker: string;
  text: string;
  icon?: string;
  choices: {
    id: string;
    text: string;
    pointDelta?: number;
    contact?: string | null;
  }[];
}

interface OverworldStageProps {
  readonly onComplete: () => void;
  readonly department?: string;
  readonly charId?: string;
  readonly nextStageKey?: string; // <-- NEW: Tells the overworld where the player should go
}

export default function OverworldStage({
  onComplete,
  department,
  charId,
  nextStageKey,
}: OverworldStageProps) {
  const GAME_WIDTH = 800;
  const GAME_HEIGHT = 450;
  const PLAYER_SIZE = 32;

  const [pos, setPos] = useState({ x: GAME_WIDTH / 2, y: GAME_HEIGHT / 2 });
  const [targetPos, setTargetPos] = useState<{ x: number; y: number } | null>(
    null,
  );
  const [npcs, setNpcs] = useState<NPC[]>([]);

  const [activeZone, setActiveZone] = useState<string | null>(null);
  const [activeDialogue, setActiveDialogue] = useState<DialogueState | null>(
    null,
  );
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);
  const [bumpMsg, setBumpMsg] = useState<{ id: string; msg: string } | null>(
    null,
  );

  const up = useKeyPress(["w", "ArrowUp"]);
  const down = useKeyPress(["s", "ArrowDown"]);
  const left = useKeyPress(["a", "ArrowLeft"]);
  const right = useKeyPress(["d", "ArrowRight"]);
  const interactBtn = useKeyPress(["e", "Enter", " "]);

  const speed = 5;
  const DEPT_COLORS: Record<string, string> = {
    lighting: "var(--bui-fg-warning)",
    sound: "var(--bui-fg-info)",
    "Stage Manager": "var(--bui-fg-danger)",
    "Costume Designer": "#ec4899",
    Director: "#a855f7",
  };

  const playerChar = CHARACTERS.find((c) => c.id === charId);

  // --- DYNAMIC DESTINATION LOGIC ---
  let targetZoneId = "";
  let targetLabel = "";
  let instructionText = "";

  if (nextStageKey === "cable_coiling") {
    targetZoneId = "wings";
    targetLabel = "STAGE WINGS";
    instructionText =
      "Show's over! Report to the WINGS for Strike and Cable Coiling.";
  } else if (nextStageKey === "wrapup") {
    targetZoneId = "stageManager";
    targetLabel = "SM DESK";
    instructionText = "Strike is complete. Report to the SM DESK to sign out.";
  } else {
    targetZoneId = department === "lighting" ? "lightBooth" : "soundBooth";
    targetLabel = department === "lighting" ? "LX BOOTH" : "SOUND BOOTH";
    instructionText = `The house is open. Report to the ${targetLabel} immediately!`;
  }

  useEffect(() => {
    const available = CHARACTERS.filter((c) => c.id !== charId);
    const shuffled = [...available].sort(() => 0.5 - Math.random());
    const count = Math.floor(Math.random() * 3) + 3;

    const spawned = shuffled.slice(0, count).map((npc) => {
      let spawnX, spawnY;
      do {
        spawnX = Math.random() * (GAME_WIDTH - 200) + 100;
        spawnY = Math.random() * (GAME_HEIGHT - 200) + 100;
      } while (checkCollision(spawnX, spawnY));
      return {
        id: npc.id,
        name: npc.name,
        icon: npc.icon,
        dept: npc.department || npc.role,
        x: spawnX,
        y: spawnY,
        dx: (Math.random() - 0.5) * 2,
        dy: (Math.random() - 0.5) * 2,
        moveTimer: Math.floor(Math.random() * 100) + 50,
        isHidden: false,
        hideTimer: 0,
      };
    });
    setNpcs(spawned as any);
  }, [charId]);

  const handleStageClick = (e: React.MouseEvent<HTMLButtonElement>) => {
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

  const findActiveStaticZone = (
    playerX: number,
    playerY: number,
  ): string | null => {
    for (const [key, zone] of Object.entries(OVERWORLD_ZONES)) {
      if (
        playerX < zone.x + zone.w + 20 &&
        playerX + PLAYER_SIZE > zone.x - 20 &&
        playerY < zone.y + zone.h + 20 &&
        playerY + PLAYER_SIZE > zone.y - 20
      )
        return key;
    }
    return null;
  };

  useEffect(() => {
    if (activeDialogue) return;
    const interval = setInterval(() => {
      setPos((prev) => {
        let dx = 0;
        let dy = 0;
        if (targetPos) {
          const dist = Math.hypot(targetPos.x - prev.x, targetPos.y - prev.y);
          if (dist < speed) setTargetPos(null);
          else {
            dx = ((targetPos.x - prev.x) / dist) * speed;
            dy = ((targetPos.y - prev.y) / dist) * speed;
          }
        } else {
          if (up) dy -= speed;
          if (down) dy += speed;
          if (left) dx -= speed;
          if (right) dx += speed;
        }

        let newX = prev.x + dx;
        let newY = prev.y + dy;
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

        setNpcs((prevNpcs) =>
          prevNpcs.map((npc) => {
            if (npc.isHidden) {
              if (npc.hideTimer <= 0)
                return {
                  ...npc,
                  isHidden: false,
                  x: 600,
                  y: 100 + Math.random() * 100,
                  dx: -1,
                  dy: Math.random() - 0.5,
                };
              return { ...npc, hideTimer: npc.hideTimer - 1 };
            }
            const distToPlayer = Math.hypot(newX - npc.x, newY - npc.y);
            let stepX = npc.dx;
            let stepY = npc.dy;
            if (distToPlayer < 80 && (dx !== 0 || dy !== 0)) {
              stepX *= 0.3;
              stepY *= 0.3;
            }
            let nX = npc.x + stepX;
            let nY = npc.y + stepY;

            if (nX > 650 && Math.random() < 0.01)
              return {
                ...npc,
                isHidden: true,
                hideTimer: Math.floor(Math.random() * 180) + 120,
              };
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
          }),
        );

        // FIX: Proximity check correctly prioritizes NPCs or Zones without overwriting each other
        let currentActive = findActiveStaticZone(newX, newY);
        if (!currentActive) {
          const npcDistances = npcs.map((npc) => ({
            npc,
            distance: Math.hypot(newX - npc.x, newY - npc.y),
          }));
          if (npcDistances.length > 0) {
            const closestNpc = npcDistances.reduce((prev, current) =>
              current.distance < prev.distance ? current : prev,
            );
            if (closestNpc.distance < 40) currentActive = closestNpc.npc.id;

            if (
              closestNpc.distance < 32 &&
              (dx !== 0 || dy !== 0) &&
              Math.random() < 0.05 &&
              !bumpMsg
            ) {
              setBumpMsg({ id: closestNpc.npc.id, msg: "Watch it!" });
              setTimeout(() => setBumpMsg(null), 1500);
            }
          }
        }
        setActiveZone(currentActive);
        return { x: newX, y: newY };
      });
    }, 1000 / 60);
    return () => clearInterval(interval);
  }, [up, down, left, right, targetPos, activeDialogue, bumpMsg, npcs]);

  const triggerInteraction = () => {
    if (!activeZone || activeDialogue) return;
    setTargetPos(null);
    const staticZone = OVERWORLD_ZONES[activeZone];
    const activeNpc = npcs.find((n) => n.id === activeZone);

    if (staticZone) {
      if (activeZone === targetZoneId) {
        onComplete(); // Successfully advanced to the right place!
      } else if (
        activeZone === "lightBooth" ||
        activeZone === "soundBooth" ||
        activeZone === "wings" ||
        activeZone === "stageManager"
      ) {
        setFeedbackMsg(`Not here! Head to the ${targetLabel}!`);
        setTimeout(() => setFeedbackMsg(null), 2500);
      } else if (staticZone.dialogues) {
        setActiveDialogue(
          staticZone.dialogues[
            Math.floor(Math.random() * staticZone.dialogues.length)
          ],
        );
      } else if (staticZone.dialogue) {
        setActiveDialogue(staticZone.dialogue);
      }
    } else if (activeNpc) {
      setActiveDialogue({
        speaker: activeNpc.name,
        icon: activeNpc.icon,
        text: `Hey, I'm ${activeNpc.name}. We need to hurry!`,
        choices: [{ id: "ok", text: "Got it.", pointDelta: 0, contact: null }],
      });
    }
  };

  useEffect(() => {
    if (interactBtn) triggerInteraction();
  }, [interactBtn]);

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
      <div
        style={{
          textAlign: "center",
          background: "var(--color-surface-translucent)",
          padding: "1rem",
          borderRadius: "8px",
          border: `1px solid var(--bui-fg-warning)`,
        }}
      >
        <h2
          style={{
            color: "var(--bui-fg-warning)",
            margin: 0,
            fontFamily: "var(--font-mono)",
          }}
        >
          CURRENT OBJECTIVE
        </h2>
        <p
          style={{ margin: "0.5rem 0 0 0", color: "var(--color-pencil-light)" }}
        >
          <strong>{instructionText}</strong>
        </p>
      </div>

      <button
        onClick={handleStageClick}
        style={{
          position: "relative",
          width: "100%",
          aspectRatio: "16/9",
          background: "#1a1a2e",
          border: "4px solid #fff",
          overflow: "hidden",
          cursor: "crosshair",
          padding: 0,
        }}
      >
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
              fontFamily:
                "var(--font-sketch)" /* FIX: Architect's Daughter Font */,
            }}
          >
            {zone.label}
          </div>
        ))}

        {npcs
          .filter((n) => !n.isHidden)
          .map((npc) => (
            <div
              key={npc.id}
              style={{
                position: "absolute",
                left: `${(npc.x / GAME_WIDTH) * 100}%`,
                top: `${(npc.y / GAME_HEIGHT) * 100}%`,
                width: `${(PLAYER_SIZE / GAME_WIDTH) * 100}%`,
                height: `${(PLAYER_SIZE / GAME_HEIGHT) * 100}%`,
                background: "rgba(0,0,0,0.5)",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                border:
                  activeZone === npc.id
                    ? "2px solid #fbbf24"
                    : "1px solid #555",
                fontSize: "20px",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  top: "-22px",
                  fontFamily: "var(--font-mono)",
                  fontSize: "12px",
                  fontWeight: "bold",
                  color: DEPT_COLORS[npc.dept] || "#fff",
                  whiteSpace: "nowrap",
                  textShadow: "1px 1px 2px #000",
                }}
              >
                {npc.name}
              </div>
              {npc.icon}
            </div>
          ))}

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
              color: "#000",
              fontWeight: "bold",
              fontSize: "1.2rem",
              zIndex: 50,
              background: "#fbbf24",
              padding: "8px 16px",
              borderRadius: "4px",
              border: "2px solid #fff",
              fontFamily: "var(--font-mono)",
              boxShadow: "0 4px 10px rgba(0,0,0,0.5)",
              pointerEvents: "none",
            }}
          >
            [PRESS E] TO INTERACT
          </div>
        )}

        {/* FIX: Player Character is now their specific Emoji / Icon */}
        <div
          style={{
            position: "absolute",
            left: `${(pos.x / GAME_WIDTH) * 100}%`,
            top: `${(pos.y / GAME_HEIGHT) * 100}%`,
            width: `${(PLAYER_SIZE / GAME_WIDTH) * 100}%`,
            height: `${(PLAYER_SIZE / GAME_HEIGHT) * 100}%`,
            background: "rgba(0,0,0,0.7)",
            borderRadius: "50%",
            border: "2px solid #06d6a0",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "20px",
            zIndex: 100,
          }}
        >
          <div
            style={{
              position: "absolute",
              top: "-22px",
              fontFamily: "var(--font-mono)",
              fontSize: "12px",
              fontWeight: "bold",
              color: "#06d6a0",
              whiteSpace: "nowrap",
              textShadow: "1px 1px 2px #000",
            }}
          >
            YOU
          </div>
          {playerChar?.icon || "👤"}
        </div>
      </button>

      <div style={{ minHeight: "150px" }}>
        {activeDialogue && (
          <DialogueBox
            speaker={activeDialogue.speaker}
            text={activeDialogue.text}
            choices={activeDialogue.choices}
            icon={activeDialogue.icon}
            onChoice={() => setActiveDialogue(null)}
          />
        )}
      </div>
    </div>
  );
}
