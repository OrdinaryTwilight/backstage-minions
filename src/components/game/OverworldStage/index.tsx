// src/components/game/OverworldStage/index.tsx
import { useEffect, useRef, useState } from "react";
import { useGame } from "../../../context/GameContext";
import { CHARACTERS, OVERWORLD_MAPS } from "../../../data/gameData";
import { useAnnouncement } from "../../../hooks/useAnnouncement";
import { useKeyPress } from "../../../hooks/useKeyPress";
import { getOverworldObjective } from "../../../utils/objectiveEngine";
import DialogueBox from "../DialogueBox";
import DialogueManager from "../DialogueManager";
import { GAME_HEIGHT, GAME_WIDTH, PLAYER_SIZE } from "./constants";
import HeadsetHUD from "./HeadsetHUD";
import MapViewport from "./MapViewport";
import MobileControls from "./MobileControls";
import { DialogueState, FeedbackMessage, OverworldStageProps } from "./types";
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
  const { announce, AnnouncementRegion } = useAnnouncement();
  const [currentRoom, setCurrentRoom] = useState<string>("backstage");
  const [targetPos, setTargetPos] = useState<{ x: number; y: number } | null>(
    null,
  );

  const [activeNpcId, setActiveNpcId] = useState<string | null>(null);
  const [feedbackMsg, setFeedbackMsg] = useState<FeedbackMessage | null>(null);

  const interactBtn = useKeyPress(["e", "Enter", " "]);
  const up = useKeyPress(["w", "ArrowUp"]);
  const down = useKeyPress(["s", "ArrowDown"]);
  const left = useKeyPress(["a", "ArrowLeft"]);
  const right = useKeyPress(["d", "ArrowRight"]);

  const { headsetOn, setHeadsetOn, commsLog } = useComms();

  const [activeQuestDialogue, setActiveQuestDialogue] =
    useState<DialogueState | null>(null);

  const { inventory, questFeedback, checkQuestIntercept, handleQuestChoice } =
    useQuests();
  const displayFeedback = questFeedback || feedbackMsg;

  // Announce dynamic feedback to screen readers immediately
  useEffect(() => {
    if (displayFeedback?.text) {
      announce(displayFeedback.text);
    }
  }, [displayFeedback, announce]);

  // Announce room transitions
  useEffect(() => {
    announce(`Entered ${formatRoomName(currentRoom)}`);
  }, [currentRoom, announce]);

  const currentZones =
    OVERWORLD_MAPS[currentRoom] || OVERWORLD_MAPS["backstage"];
  const playerChar = CHARACTERS.find((c) => c.id === charId);
  const { targetZoneId, targetLabel, instructionText } = getOverworldObjective(
    nextStageKey,
    department,
  );

  const { pos, setPos, npcs, activeZone, bumpMsg } = useGameLoop({
    currentZones,
    currentRoom,
    charId,
    input: { up, down, left, right },
    targetPos,
    setTargetPos,
    activeNpcId,
    activeQuests: state.session?.activeQuests || [], // <-- PASSED IN HERE
  });

  const triggerInteraction = useInteraction({
    activeZone,
    activeNpcId,
    activeQuestDialogue,
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
    setActiveQuestDialogue,
    setFeedbackMsg,
    checkQuestIntercept,
    onComplete,
  });

  const interactRef = useRef(triggerInteraction);

  useEffect(() => {
    interactRef.current = triggerInteraction;
  }, [triggerInteraction]);

  useEffect(() => {
    if (interactBtn) {
      interactRef.current();
    }
  }, [interactBtn]);

  const handleStageClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setTargetPos({
      x: ((e.clientX - rect.left) / rect.width) * GAME_WIDTH - PLAYER_SIZE / 2,
      y: ((e.clientY - rect.top) / rect.height) * GAME_HEIGHT - PLAYER_SIZE / 2,
    });
  };

  return (
    <div className="overworld-container">
      <AnnouncementRegion />
      <div className="overworld-header">
        <h2>CURRENT LOCATION: {formatRoomName(currentRoom).toUpperCase()}</h2>
        <p>
          <strong>{instructionText}</strong>
        </p>
      </div>

      <button
        className="help-btn animate-pop"
        onClick={() =>
          setFeedbackMsg({
            text: "CONTROLS: Use W, A, S, D or Arrows to move. Press E or Space to interact with glowing zones and characters.",
            isError: false,
          })
        }
        style={{ position: "absolute", top: "1rem", right: "1rem" }}
      >
        ?
      </button>

      <div className="overworld-layout">
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

        <div className="overworld-main">
          <MapViewport
            currentRoom={currentRoom}
            currentZones={currentZones}
            npcs={npcs}
            pos={pos}
            playerChar={playerChar}
            activeZone={activeZone}
            activeNpcId={activeNpcId}
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
          <div
            style={{ marginTop: "0.25rem", position: "relative", zIndex: 100 }}
          >
            {activeQuestDialogue && (
              <DialogueBox
                speaker={activeQuestDialogue.speaker}
                text={activeQuestDialogue.text}
                choices={activeQuestDialogue.choices}
                icon={activeQuestDialogue.icon}
                onChoice={(choice) => {
                  const wasQuest = handleQuestChoice(choice.id, () =>
                    setActiveQuestDialogue(null),
                  );
                  if (!wasQuest) setActiveQuestDialogue(null);
                }}
              />
            )}

            {!activeQuestDialogue && activeNpcId && (
              <DialogueManager
                npcId={activeNpcId}
                onClose={() => setActiveNpcId(null)}
              />
            )}
          </div>

          <div className="overworld-interaction-bar">
            {displayFeedback && (
              <div
                className={`animate-pop feedback-banner ${displayFeedback.isError ? "feedback-error" : "feedback-success"}`}
              >
                {displayFeedback.text}
              </div>
            )}

            {activeZone &&
              !activeNpcId &&
              !activeQuestDialogue &&
              !displayFeedback && (
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

          <button
            onClick={() => {
              setPos({ x: GAME_WIDTH / 2, y: GAME_HEIGHT / 2 });
              setTargetPos(null);
            }}
            style={{
              padding: "0.5rem 1rem",
              background: "var(--bui-fg-danger)",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              fontWeight: "bold",
              fontSize: "0.8rem",
              opacity: 0.8,
            }}
            title="Teleport to center of room if stuck inside a wall"
          >
            🚨 UNSTICK
          </button>
        </div>
      </div>
    </div>
  );
}
