import { useEffect, useState } from "react";
import { CHARACTERS, OVERWORLD_MAPS } from "../../../data/gameData";
import { useKeyPress } from "../../../hooks/useKeyPress";
import DialogueBox from "../DialogueBox";
import { GAME_HEIGHT, GAME_WIDTH, PLAYER_SIZE } from "./constants";
import { DialogueState, OverworldStageProps } from "./types";
import { useComms } from "./useComms";
import { useGameLoop } from "./useGameLoop";

const DEPT_COLORS: Record<string, string> = {
  lighting: "var(--bui-fg-warning)",
  sound: "var(--bui-fg-info)",
  "Stage Manager": "var(--bui-fg-danger)",
  "Costume Designer": "#ec4899",
  Director: "#a855f7",
};

export default function OverworldStage({
  onComplete,
  department,
  charId,
  nextStageKey,
}: OverworldStageProps) {
  const [currentRoom, setCurrentRoom] = useState<string>("stage");
  const currentZones = OVERWORLD_MAPS[currentRoom] || OVERWORLD_MAPS["stage"];

  const [targetPos, setTargetPos] = useState<{ x: number; y: number } | null>(
    null,
  );
  const [activeDialogue, setActiveDialogue] = useState<DialogueState | null>(
    null,
  );
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);

  const up = useKeyPress(["w", "ArrowUp"]);
  const down = useKeyPress(["s", "ArrowDown"]);
  const left = useKeyPress(["a", "ArrowLeft"]);
  const right = useKeyPress(["d", "ArrowRight"]);
  const interactBtn = useKeyPress(["e", "Enter", " "]);

  const { headsetOn, setHeadsetOn, commsLog } = useComms();
  const { pos, setPos, npcs, activeZone, bumpMsg } = useGameLoop(
    currentZones,
    currentRoom,
    charId,
    up,
    down,
    left,
    right,
    targetPos,
    setTargetPos,
    activeDialogue,
  );

  const playerChar = CHARACTERS.find((c) => c.id === charId);

  // Determine Objectives
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

  const handleStageClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x =
      ((e.clientX - rect.left) / rect.width) * GAME_WIDTH - PLAYER_SIZE / 2;
    const y =
      ((e.clientY - rect.top) / rect.height) * GAME_HEIGHT - PLAYER_SIZE / 2;
    setTargetPos({ x, y });
  };

  const handleDoorInteraction = (isDoor: string) => {
    setCurrentRoom(isDoor);
    setPos({ x: GAME_WIDTH / 2, y: GAME_HEIGHT / 2 });
    setFeedbackMsg(`Entering ${isDoor}...`);
    setTimeout(() => setFeedbackMsg(null), 1000);
  };

  const triggerInteraction = () => {
    if (!activeZone || activeDialogue) return;
    setTargetPos(null);

    const staticZone = currentZones[activeZone];
    const activeNpc = npcs.find((n) => n.id === activeZone);

    if (staticZone) {
      if (staticZone.isDoor) {
        handleDoorInteraction(staticZone.isDoor);
      } else if (activeZone === targetZoneId && currentRoom === "stage") {
        onComplete();
      } else if (
        ["lightBooth", "soundBooth", "wings", "stageManager"].includes(
          activeZone,
        )
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
      // FIX: Used the variable properly here
      const npcChatter = [
        "Hope you've checked your cables.",
        "I'm so nervous for this run.",
        "Did someone steal my gaff tape again?!",
        "Break a leg out there!",
      ];
      const randomLine =
        npcChatter[Math.floor(Math.random() * npcChatter.length)];
      setActiveDialogue({
        speaker: activeNpc.name,
        icon: activeNpc.icon,
        text: `Hey, I'm ${activeNpc.name}. ${randomLine}`,
        choices: [{ id: "ok", text: "Got it." }],
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
      {/* Headset HUD */}
      <div
        style={{
          position: "absolute",
          top: "100px",
          left: "20px",
          zIndex: 1000,
          pointerEvents: "none",
        }}
      >
        <button
          onClick={(e) => {
            e.stopPropagation();
            setHeadsetOn(!headsetOn);
          }}
          style={{
            pointerEvents: "auto",
            background: headsetOn ? "var(--bui-fg-success)" : "#555",
            color: "#000",
            border: "2px solid #fff",
            borderRadius: "50%",
            width: "40px",
            height: "40px",
            cursor: "pointer",
          }}
        >
          🎧
        </button>
        {headsetOn && (
          <div
            style={{
              marginTop: "10px",
              display: "flex",
              flexDirection: "column",
              gap: "5px",
              width: "200px",
            }}
          >
            {commsLog.map((log) => (
              <div
                key={log.id}
                style={{
                  background: "rgba(0,0,0,0.7)",
                  borderLeft: "3px solid var(--bui-fg-info)",
                  padding: "5px",
                  color: "#fff",
                  fontSize: "0.8rem",
                }}
              >
                <strong style={{ color: "var(--bui-fg-info)" }}>
                  [{log.speaker}]:
                </strong>{" "}
                {log.text}
              </div>
            ))}
          </div>
        )}
      </div>

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
          CURRENT LOCATION: {currentRoom.toUpperCase()}
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
        {/* Render Zones */}
        {Object.entries(currentZones).map(([key, zone]) => (
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
              fontWeight: "bold",
              fontFamily: "var(--font-sketch)",
            }}
          >
            {zone.label}
          </div>
        ))}

        {/* Render NPCs */}
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
                  fontSize: "12px",
                  fontWeight: "bold",
                  color: DEPT_COLORS[npc.dept] || "#fff",
                }}
              >
                {npc.name}
              </div>
              {npc.icon}
              {bumpMsg?.id === npc.id && (
                <span
                  style={{
                    position: "absolute",
                    top: "-40px",
                    background: "white",
                    color: "black",
                    padding: "2px 6px",
                    borderRadius: "4px",
                    fontSize: "10px",
                    whiteSpace: "nowrap",
                    zIndex: 200,
                  }}
                >
                  {bumpMsg.msg}
                </span>
              )}
            </div>
          ))}

        {/* Render Player */}
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
              fontSize: "12px",
              fontWeight: "bold",
              color: "#06d6a0",
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
