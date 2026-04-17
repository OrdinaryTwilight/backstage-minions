import { useEffect, useState } from "react";
import { CHARACTERS, OVERWORLD_MAPS } from "../../../data/gameData";
import { useKeyPress } from "../../../hooks/useKeyPress";
import DialogueBox from "../DialogueBox";
import { GAME_HEIGHT, GAME_WIDTH, PLAYER_SIZE } from "./constants";
import { DialogueState, OverworldStageProps } from "./types";
import { useComms } from "./useComms";
import { useGameLoop } from "./useGameLoop";

// Import our newly extracted sub-components
import HeadsetHUD from "./HeadsetHUD";
import MapViewport from "./MapViewport";

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

  const interactBtn = useKeyPress(["e", "Enter", " "]);
  const up = useKeyPress(["w", "ArrowUp"]);
  const down = useKeyPress(["s", "ArrowDown"]);
  const left = useKeyPress(["a", "ArrowLeft"]);
  const right = useKeyPress(["d", "ArrowRight"]);

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
    instructionText = "Show's over! Report to the WINGS for Strike.";
  } else if (nextStageKey === "wrapup") {
    targetZoneId = "stageManager";
    targetLabel = "SM DESK";
    instructionText = "Strike is complete. Report to the SM DESK to sign out.";
  } else {
    targetZoneId = department === "lighting" ? "lightBooth" : "soundBooth";
    targetLabel = department === "lighting" ? "LX BOOTH" : "SOUND BOOTH";
    instructionText = `Report to the ${targetLabel} immediately!`;
  }

  const handleStageClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setTargetPos({
      x: ((e.clientX - rect.left) / rect.width) * GAME_WIDTH - PLAYER_SIZE / 2,
      y: ((e.clientY - rect.top) / rect.height) * GAME_HEIGHT - PLAYER_SIZE / 2,
    });
  };

  const triggerInteraction = () => {
    if (!activeZone || activeDialogue) return;
    setTargetPos(null);

    const staticZone = currentZones[activeZone];
    const activeNpc = npcs.find((n) => n.id === activeZone);

    if (staticZone) {
      if (staticZone.isDoor) {
        setCurrentRoom(staticZone.isDoor);
        setPos({ x: GAME_WIDTH / 2, y: GAME_HEIGHT / 2 });
        setFeedbackMsg(`Entering ${staticZone.isDoor}...`);
        setTimeout(() => setFeedbackMsg(null), 1000);
      } else if (activeZone === targetZoneId && currentRoom === "stage") {
        onComplete();
      } else if (
        (activeZone === "lightBooth" && targetZoneId !== "lightBooth") ||
        (activeZone === "soundBooth" && targetZoneId !== "soundBooth")
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
        maxWidth: "1100px",
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
          CURRENT LOCATION: {currentRoom.toUpperCase().replace("ROOM", " ROOM")}
        </h2>
        <p
          style={{ margin: "0.5rem 0 0 0", color: "var(--color-pencil-light)" }}
        >
          <strong>{instructionText}</strong>
        </p>
      </div>

      {/* FIX: Layout splits the HUD and the Map so they never overlap! */}
      <div
        style={{
          display: "flex",
          gap: "1rem",
          alignItems: "flex-start",
          position: "relative",
        }}
      >
        <HeadsetHUD
          headsetOn={headsetOn}
          setHeadsetOn={setHeadsetOn}
          commsLog={commsLog}
        />

        <MapViewport
          currentRoom={currentRoom}
          currentZones={currentZones}
          npcs={npcs}
          pos={pos}
          playerChar={playerChar}
          activeZone={activeZone}
          activeDialogue={activeDialogue}
          feedbackMsg={feedbackMsg}
          bumpMsg={bumpMsg}
          handleStageClick={handleStageClick}
        />
      </div>

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
