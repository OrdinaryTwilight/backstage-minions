import { useEffect, useState } from "react";
import { CHARACTERS, OVERWORLD_MAPS } from "../../../data/gameData";
import { useKeyPress } from "../../../hooks/useKeyPress";
import DialogueBox from "../DialogueBox";
import { GAME_HEIGHT, GAME_WIDTH, PLAYER_SIZE } from "./constants";
import { DialogueState, FeedbackMessage, OverworldStageProps } from "./types";
import { useComms } from "./useComms";
import { useGameLoop } from "./useGameLoop";
import { useQuests } from "./useQuests";

import HeadsetHUD from "./HeadsetHUD";
import MapViewport from "./MapViewport";

// Helper to format camelCase room names to Title Case (greenRoom -> Green Room)
const formatRoomName = (str: string) =>
  str.replace(/([A-Z])/g, " $1").replace(/^./, (s) => s.toUpperCase());

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
  const [feedbackMsg, setFeedbackMsg] = useState<FeedbackMessage | null>(null);

  const interactBtn = useKeyPress(["e", "Enter", " "]);
  const up = useKeyPress(["w", "ArrowUp"]);
  const down = useKeyPress(["s", "ArrowDown"]);
  const left = useKeyPress(["a", "ArrowLeft"]);
  const right = useKeyPress(["d", "ArrowRight"]);

  const { headsetOn, setHeadsetOn, commsLog } = useComms();

  // NEW: Initialize the Quest Hook
  const { inventory, checkQuestIntercept, handleQuestChoice, questFeedback } =
    useQuests();

  // Override local feedback with quest feedback if it exists
  const displayFeedback = questFeedback || feedbackMsg;

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

    // NEW: Check if a Quest intercepts this interaction first!
    const questDialogue = checkQuestIntercept(activeZone, activeNpc);
    if (questDialogue) {
      setActiveDialogue(questDialogue);
      return;
    }

    if (staticZone) {
      if (staticZone.isDoor) {
        setCurrentRoom(staticZone.isDoor);
        setPos({ x: GAME_WIDTH / 2, y: GAME_HEIGHT / 2 });
        // FIX: Beautiful Title Case formatting for room transitions
        setFeedbackMsg({
          text: `Entering ${formatRoomName(staticZone.isDoor)}...`,
          isError: false,
        });
        setTimeout(() => setFeedbackMsg(null), 1500);
      } else if (activeZone === targetZoneId && currentRoom === "stage") {
        onComplete();
      } else if (
        (activeZone === "lightBooth" && targetZoneId !== "lightBooth") ||
        (activeZone === "soundBooth" && targetZoneId !== "soundBooth")
      ) {
        setFeedbackMsg({
          text: `Not here! Head to the ${targetLabel}!`,
          isError: true,
        });
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
          CURRENT LOCATION: {formatRoomName(currentRoom).toUpperCase()}
        </h2>
        <p
          style={{ margin: "0.5rem 0 0 0", color: "var(--color-pencil-light)" }}
        >
          <strong>{instructionText}</strong>
        </p>
      </div>

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "1rem",
          alignItems: "flex-start",
          position: "relative",
        }}
      >
        {/* Left Side: Comms & Inventory HUD */}
        <div
          style={{
            flex: "1 1 200px",
            maxWidth: "250px",
            display: "flex",
            flexDirection: "column",
            gap: "1rem",
          }}
        >
          <HeadsetHUD
            headsetOn={headsetOn}
            setHeadsetOn={setHeadsetOn}
            commsLog={commsLog}
          />

          {/* NEW: RPG Inventory Display */}
          <div
            style={{
              background: "rgba(15, 23, 42, 0.95)",
              border: "2px solid var(--glass-border)",
              borderRadius: "8px",
              padding: "10px",
            }}
          >
            <h3
              style={{
                margin: "0 0 10px 0",
                fontSize: "0.9rem",
                color: "var(--bui-fg-warning)",
                fontFamily: "var(--font-mono)",
              }}
            >
              🎒 INVENTORY
            </h3>
            {inventory.length === 0 ? (
              <div
                style={{
                  color: "#666",
                  fontSize: "0.8rem",
                  fontStyle: "italic",
                }}
              >
                Empty
              </div>
            ) : (
              <ul
                style={{
                  margin: 0,
                  paddingLeft: "20px",
                  color: "var(--color-pencil-light)",
                  fontSize: "0.9rem",
                }}
              >
                {inventory.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Right Side: Map & Interactive Buttons */}
        <div
          style={{
            flex: "3 1 500px",
            display: "flex",
            flexDirection: "column",
            gap: "1rem",
          }}
        >
          <MapViewport
            currentRoom={currentRoom}
            currentZones={currentZones}
            npcs={npcs}
            pos={pos}
            playerChar={playerChar}
            activeZone={activeZone}
            activeDialogue={activeDialogue}
            feedbackMsg={displayFeedback?.text || null}
            bumpMsg={bumpMsg}
            handleStageClick={handleStageClick}
          />

          <div
            style={{
              minHeight: "60px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              width: "100%",
            }}
          >
            {displayFeedback && (
              <div
                className="animate-pop"
                style={{
                  background: displayFeedback.isError
                    ? "var(--bui-bg-danger)"
                    : "var(--bui-fg-info)",
                  color: displayFeedback.isError ? "white" : "#000",
                  padding: "12px 24px",
                  borderRadius: "8px",
                  fontWeight: "bold",
                  fontSize: "1.1rem",
                  marginBottom: "0.5rem",
                  width: "100%",
                  textAlign: "center",
                  boxShadow: "0 4px 10px rgba(0,0,0,0.5)",
                }}
              >
                {displayFeedback.text}
              </div>
            )}

            {activeZone && !activeDialogue && !displayFeedback && (
              <button
                onClick={triggerInteraction}
                className="animate-pop"
                style={{
                  background: "#fbbf24",
                  color: "#000",
                  border: "2px solid #fff",
                  padding: "12px 24px",
                  borderRadius: "8px",
                  fontWeight: "bold",
                  fontSize: "1.2rem",
                  cursor: "pointer",
                  fontFamily: "var(--font-mono)",
                  width: "100%",
                  boxShadow: "0 4px 10px rgba(0,0,0,0.5)",
                }}
              >
                [PRESS E] OR CLICK TO INTERACT WITH{" "}
                {currentZones[activeZone]?.label ||
                  npcs.find((n) => n.id === activeZone)?.name?.toUpperCase()}
              </button>
            )}
          </div>
        </div>
      </div>

      <div style={{ minHeight: "150px" }}>
        {activeDialogue && (
          <DialogueBox
            speaker={activeDialogue.speaker}
            text={activeDialogue.text}
            choices={activeDialogue.choices}
            icon={activeDialogue.icon}
            onChoice={(choice) => {
              // NEW: Hand off to Quest handler first. If it wasn't a quest, just close dialogue.
              const wasQuest = handleQuestChoice(choice.id, () =>
                setActiveDialogue(null),
              );
              if (!wasQuest) setActiveDialogue(null);
            }}
          />
        )}
      </div>
    </div>
  );
}
