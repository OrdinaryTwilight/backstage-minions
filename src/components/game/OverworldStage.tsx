import { useEffect, useState } from "react";
import { CHARACTERS, OVERWORLD_ZONES } from "../../data/gameData";
import { useKeyPress } from "../../hooks/useKeyPress";
import DialogueBox from "./DialogueBox";

interface NPC {
  id: string;
  name: string;
  icon: string;
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

  useEffect(() => {
    const available = CHARACTERS.filter((c) => c.id !== charId);
    const shuffled = [...available].sort(() => 0.5 - Math.random());
    const count = Math.floor(Math.random() * 3) + 3; // Spawn 3 to 5 NPCs

    const spawned = shuffled.slice(0, count).map(
      (npc): NPC => ({
        id: npc.id,
        name: npc.name,
        icon: npc.icon,
        x: Math.random() * (GAME_WIDTH - 200) + 100,
        y: Math.random() * (GAME_HEIGHT - 200) + 100,
        dx: (Math.random() - 0.5) * 2,
        dy: (Math.random() - 0.5) * 2,
        moveTimer: Math.floor(Math.random() * 100) + 50,
        isHidden: false,
        hideTimer: 0,
      }),
    );
    setNpcs(spawned);
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

  const calculatePlayerMovement = (
    prev: typeof pos,
    targetPos: typeof pos | null,
  ) => {
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

    return { dx, dy };
  };

  const updateNPCPosition = (
    npc: NPC,
    playerX: number,
    playerY: number,
  ): NPC => {
    if (npc.isHidden) {
      if (npc.hideTimer <= 0) {
        return {
          ...npc,
          isHidden: false,
          x: 600,
          y: 100 + Math.random() * 100,
          dx: -1,
          dy: Math.random() - 0.5,
        };
      }
      return { ...npc, hideTimer: npc.hideTimer - 1 };
    }

    const distToPlayer = Math.hypot(playerX - npc.x, playerY - npc.y);
    let stepX = npc.dx;
    let stepY = npc.dy;

    if (distToPlayer < 80 && (up || down || left || right)) {
      stepX *= 0.3;
      stepY *= 0.3;
    }

    let nX = npc.x + stepX;
    let nY = npc.y + stepY;

    if (nX > 650 && Math.random() < 0.01) {
      return {
        ...npc,
        isHidden: true,
        hideTimer: Math.floor(Math.random() * 180) + 120,
      };
    }

    if (
      nX <= 0 ||
      nX >= GAME_WIDTH - PLAYER_SIZE ||
      checkCollision(nX, npc.y)
    ) {
      npc.dx *= -1;
    }
    if (
      nY <= 0 ||
      nY >= GAME_HEIGHT - PLAYER_SIZE ||
      checkCollision(npc.x, nY)
    ) {
      npc.dy *= -1;
    }

    let nTimer = npc.moveTimer - 1;
    if (nTimer <= 0) {
      npc.dx = (Math.random() - 0.5) * 2;
      npc.dy = (Math.random() - 0.5) * 2;
      nTimer = Math.floor(Math.random() * 120) + 60;
    }
    return { ...npc, x: nX, y: nY, moveTimer: nTimer };
  };

  const findActiveZone = (playerX: number, playerY: number): string | null => {
    for (const [key, zone] of Object.entries(OVERWORLD_ZONES)) {
      if (
        playerX < zone.x + zone.w + 20 &&
        playerX + PLAYER_SIZE > zone.x - 20 &&
        playerY < zone.y + zone.h + 20 &&
        playerY + PLAYER_SIZE > zone.y - 20
      ) {
        return key;
      }
    }
    return null;
  };

  useEffect(() => {
    if (activeDialogue) return;

    const interval = setInterval(() => {
      setPos((prev) => {
        const { dx, dy } = calculatePlayerMovement(prev, targetPos);

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
          prevNpcs.map((npc) => updateNPCPosition(npc, newX, newY)),
        );

        // Calculate distances for all NPCs
        const npcDistances = npcs.map((npc) => ({
          npc,
          distance: Math.hypot(newX - npc.x, newY - npc.y),
        }));

        if (npcDistances.length > 0) {
          // Find closest NPC
          const closestNpc = npcDistances.reduce((prev, current) =>
            current.distance < prev.distance ? current : prev,
          );

          if (closestNpc.distance < 40) {
            setActiveZone(closestNpc.npc.id);
          }

          // Check for bump collision
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

        const zone = findActiveZone(newX, newY);
        setActiveZone(zone);
        return { x: newX, y: newY };
      });
    }, 1000 / 60);

    return () => clearInterval(interval);
  }, [up, down, left, right, targetPos, activeDialogue, bumpMsg]);

  // Centralized interaction handler
  const triggerInteraction = () => {
    if (!activeZone || activeDialogue) return;
    setTargetPos(null);
    const staticZone = OVERWORLD_ZONES[activeZone];
    const activeNpc = npcs.find((n) => n.id === activeZone);

    if (staticZone) {
      if (activeZone === "lightBooth" || activeZone === "soundBooth") {
        if (staticZone.targetDept === department) onComplete();
        else {
          setFeedbackMsg("Wrong booth!");
          setTimeout(() => setFeedbackMsg(null), 2500);
        }
      } else if (staticZone.dialogues) {
        // Randomly pick a dialogue line
        const randomDiag =
          staticZone.dialogues[
            Math.floor(Math.random() * staticZone.dialogues.length)
          ];
        setActiveDialogue(randomDiag);
      } else if (staticZone.dialogue) {
        setActiveDialogue(staticZone.dialogue);
      }
    } else if (activeNpc) {
      setActiveDialogue({
        speaker: activeNpc.name,
        icon: activeNpc.icon,
        text: `Hey, I'm ${activeNpc.name}. Break a leg out there!`,
        choices: [{ id: "ok", text: "Thanks!", pointDelta: 0, contact: null }],
      });
    }
  };

  // Trigger on Key press
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
          Report to your designated console immediately. Hurry! The show is
          about to begin.
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

        {/* Clickable Action Button */}
        {activeZone && !activeDialogue && !feedbackMsg && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              triggerInteraction();
            }}
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
              cursor: "pointer",
              border: "1px solid #fbbf24",
            }}
          >
            [E] or Click to Interact
          </button>
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
