// src/components/game/OverworldStage/index.tsx
import { useEffect, useState } from "react";
import { useGame } from "../../../context/GameContext";
import { CHARACTERS, OVERWORLD_MAPS } from "../../../data/gameData";
import { useKeyPress } from "../../../hooks/useKeyPress";
import { getOverworldObjective } from "../../../utils/objectiveEngine";
import DialogueManager from "../DialogueManager"; // <-- CHANGED: Import the new Manager
import { GAME_HEIGHT, GAME_WIDTH, PLAYER_SIZE } from "./constants";
import HeadsetHUD from "./HeadsetHUD";
import MapViewport from "./MapViewport";
import MobileControls from "./MobileControls";
import { FeedbackMessage, OverworldStageProps } from "./types"; // Note: Removed DialogueState
import { useComms } from "./useComms";
import { useGameLoop } from "./useGameLoop";
import { useInteraction } from "./useInteraction";
import { useQuests } from "./useQuests";

const formatRoomName = (str: string) =>
  str.replaceAll(/([A-Z])/g, " $1").replace(/^./, (s) => s.toUpperCase());

export default function OverworldStage({
  onComplete,
  department,
  charId,
  nextStageKey,
}: OverworldStageProps) {
  const { state } = useGame();
  const [currentRoom, setCurrentRoom] = useState<string>("stage");
  const [targetPos, setTargetPos] = useState<{ x: number; y: number } | null>(
    null,
  );

  // CHANGED: Replaced activeDialogue object with activeNpcId string
  const [activeNpcId, setActiveNpcId] = useState<string | null>(null);
  const [feedbackMsg, setFeedbackMsg] = useState<FeedbackMessage | null>(null);

  const interactBtn = useKeyPress(["e", "Enter", " "]);
  const up = useKeyPress(["w", "ArrowUp"]);
  const down = useKeyPress(["s", "ArrowDown"]);
  const left = useKeyPress(["a", "ArrowLeft"]);
  const right = useKeyPress(["d", "ArrowRight"]);

  const { headsetOn, setHeadsetOn, commsLog } = useComms();

  // CHANGED: Quest logic handled by DialogueManager now, we only need inventory for the HUD
  const { inventory, questFeedback } = useQuests();
  const displayFeedback = questFeedback || feedbackMsg;

  const currentZones = OVERWORLD_MAPS[currentRoom] || OVERWORLD_MAPS["stage"];
  const playerChar = CHARACTERS.find((c) => c.id === charId);
  const { targetZoneId, targetLabel, instructionText } = getOverworldObjective(
    nextStageKey,
    department,
  );

  // CHANGED: Passed activeNpcId into useGameLoop
  const { pos, setPos, npcs, activeZone, bumpMsg } = useGameLoop({
    currentZones,
    currentRoom,
    charId,
    input: { up, down, left, right },
    targetPos,
    setTargetPos,
    activeNpcId,
  });

  // CHANGED: Passed activeNpcId and setActiveNpcId into useInteraction
  const triggerInteraction = useInteraction({
    activeZone,
    activeNpcId,
    currentZones,
    npcs,
    currentRoom,
    targetZoneId,
    targetLabel,
    state,
    setCurrentRoom,
    setPos,
    setTargetPos,
    setActiveNpcId,
    setFeedbackMsg,
    onComplete,
  });

  useEffect(() => {
    if (interactBtn) {
      triggerInteraction();
    }
  }, [interactBtn, triggerInteraction]);

  const handleStageClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setTargetPos({
      x: ((e.clientX - rect.left) / rect.width) * GAME_WIDTH - PLAYER_SIZE / 2,
      y: ((e.clientY - rect.top) / rect.height) * GAME_HEIGHT - PLAYER_SIZE / 2,
    });
  };

  return (
    <div className="overworld-container">
      <div className="overworld-header">
        <h2>CURRENT LOCATION: {formatRoomName(currentRoom).toUpperCase()}</h2>
        <p>
          <strong>{instructionText}</strong>
        </p>
      </div>

      <div className="overworld-layout">
        {/* Left Side: Comms & Inventory HUD */}
        <div className="overworld-sidebar">
          <HeadsetHUD
            headsetOn={headsetOn}
            setHeadsetOn={setHeadsetOn}
            commsLog={commsLog}
          />

          <div className="overworld-inventory">
            <h3>🎒 INVENTORY</h3>
            {inventory.length === 0 ? (
              <div className="overworld-inventory-empty">Empty</div>
            ) : (
              <ul className="overworld-inventory-list">
                {inventory.map((item, i) => (
                  <li key={`${item}-${i}`}>{item}</li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Right Side: Map & Interactive Buttons */}
        <div className="overworld-main">
          <MapViewport
            currentRoom={currentRoom}
            currentZones={currentZones}
            npcs={npcs}
            pos={pos}
            playerChar={playerChar}
            activeZone={activeZone}
            activeNpcId={activeNpcId} // <-- Updated to pass the string directly
            feedbackMsg={displayFeedback?.text || null}
            bumpMsg={bumpMsg}
            handleStageClick={handleStageClick}
          />

          <MobileControls
            onInteract={triggerInteraction}
            activeZoneLabel={
              activeZone
                ? (currentZones[activeZone]?.label ??
                  npcs.find((n) => n.id === activeZone)?.name ??
                  null)
                : null
            }
          />

          <div className="desktop-only overworld-interaction-bar"></div>

          <div className="overworld-interaction-bar">
            {displayFeedback && (
              <div
                className={`animate-pop feedback-banner ${displayFeedback.isError ? "feedback-error" : "feedback-success"}`}
              >
                {displayFeedback.text}
              </div>
            )}

            {/* CHANGED: Button visibility now checks !activeNpcId */}
            {activeZone && !activeNpcId && !displayFeedback && (
              <button
                onClick={triggerInteraction}
                className="animate-pop interaction-btn"
              >
                [PRESS E] OR CLICK TO INTERACT WITH{" "}
                {currentZones[activeZone]?.label ||
                  npcs.find((n) => n.id === activeZone)?.name?.toUpperCase()}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* CHANGED: Replaced DialogueBox with the new DialogueManager */}
      <div style={{ minHeight: "150px" }}>
        {activeNpcId && (
          <DialogueManager
            npcId={activeNpcId}
            onClose={() => setActiveNpcId(null)}
          />
        )}
      </div>
    </div>
  );
}
