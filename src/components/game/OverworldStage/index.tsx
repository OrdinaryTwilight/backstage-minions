/**
 * @file Overworld Stage (Navigation Puzzle)
 * @description Free-roam navigation stage between minigames and story moments.
 * Players navigate theater backstage areas to reach objectives.
 *
 * Stage Mechanics:
 * - **Player Movement**: WASD or arrow keys to move character
 * - **Objective**: Navigate to specific zone to advance to next stage
 * - **NPCs**: Interact with NPCs for dialogue and quests
 * - **Quests**: Side objectives to pick up/deliver items
 * - **Conflicts**: Random story encounters during navigation
 * - **Comms**: Background radio chatter and instructions
 *
 * Theater Locations (Zones):
 * - Light Booth, Sound Booth (department-specific)
 * - Green Room (actor area)
 * - Backstage (props, rigging)
 * - Stage Wings
 * - SM Desk (stage manager)
 *
 * Physics:
 * - Collision detection with solid objects
 * - Mobile-friendly with touch controls
 * - Keyboard support for desktop
 * - Headset HUD shows directions and time
 *
 * @component
 */

import { useEffect, useRef, useState } from "react";
import { useGame } from "../../../context/GameContext";
import { CHARACTERS, OVERWORLD_MAPS } from "../../../data/gameData";
import { useAnnouncement } from "../../../hooks/useAnnouncement";
import { useKeyPress } from "../../../hooks/useKeyPress";
import { getOverworldObjective } from "../../../utils/objectiveEngine";
import SectionHeader from "../../ui/SectionHeader";
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
}: Readonly<OverworldStageProps>) {
  const { state } = useGame();
  const { announce, AnnouncementRegion } = useAnnouncement();
  const [currentRoom, setCurrentRoom] = useState<string>("backstage");
  const [targetPos, setTargetPos] = useState<{ x: number; y: number } | null>(
    null,
  );

  const [isTransitioning, setIsTransitioning] = useState(false);
  const [transitionTarget, setTransitionTarget] = useState<string | null>(null);

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

  useEffect(() => {
    if (displayFeedback?.text) {
      announce(displayFeedback.text);
    }
  }, [displayFeedback, announce]);

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

  const handleRoomTransition = (newRoom: string) => {
    setTransitionTarget(newRoom);
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentRoom(newRoom);
      setIsTransitioning(false);
    }, 400);
  };

  const { pos, setPos, npcs, activeZone, bumpMsg } = useGameLoop({
    currentZones,
    currentRoom,
    charId,
    input: isTransitioning
      ? { up: false, down: false, left: false, right: false }
      : { up, down, left, right },
    targetPos: isTransitioning ? null : targetPos,
    setTargetPos,
    activeNpcId,
    activeQuests: state.session?.activeQuests || [],
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
    setCurrentRoom: handleRoomTransition,
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
    if (interactBtn && !isTransitioning) {
      interactRef.current();
    }
  }, [interactBtn, isTransitioning]);

  const handleStageClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (isTransitioning) return;
    const rect = e.currentTarget.getBoundingClientRect();
    setTargetPos({
      x: ((e.clientX - rect.left) / rect.width) * GAME_WIDTH - PLAYER_SIZE / 2,
      y: ((e.clientY - rect.top) / rect.height) * GAME_HEIGHT - PLAYER_SIZE / 2,
    });
  };

  return (
    <div className="overworld-container">
      <AnnouncementRegion />
      <div style={{ textAlign: "center", marginBottom: "1rem" }}>
        <SectionHeader
          title={`CURRENT LOCATION: ${formatRoomName(currentRoom).toUpperCase()}`}
          subtitle={instructionText}
          helpText="CONTROLS: Use W, A, S, D or the joystick to move. Press E or Space to interact with glowing zones and characters. If you get stuck, use the UNSTICK button."
        />
      </div>

      <div className="overworld-layout">
        <div className="overworld-column-left">
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

        <div className="overworld-column-center">
          <div style={{ position: "relative", width: "100%" }}>
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
              targetZoneId={targetZoneId}
            />

            <div
              aria-hidden="true"
              style={{
                position: "absolute",
                inset: 0,
                background: "#000",
                opacity: isTransitioning ? 1 : 0,
                transition: "opacity 0.3s ease-in-out",
                pointerEvents: "none",
                zIndex: 3000,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <span
                style={{
                  color: "#fff",
                  fontFamily: "var(--font-sketch)",
                  fontSize: "1.5rem",
                  opacity: isTransitioning ? 1 : 0,
                  transition: "opacity 0.2s ease-in-out",
                  transitionDelay: isTransitioning ? "0.1s" : "0s",
                }}
              >
                Loading {formatRoomName(transitionTarget || currentRoom)}...
              </span>
            </div>
          </div>

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
            style={{
              display: "flex",
              justifyContent: "center",
              marginTop: "1rem",
            }}
          >
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
                fontFamily: "var(--font-mono)",
                opacity: 0.8,
              }}
              title="Teleport to center of room if stuck inside a wall"
            >
              🚨 UNSTICK
            </button>
          </div>
        </div>

        <div className="overworld-column-right">
          <div style={{ position: "relative", zIndex: 100 }}>
            {activeQuestDialogue && (
              <DialogueBox
                speaker={activeQuestDialogue.speaker}
                text={activeQuestDialogue.text}
                choices={activeQuestDialogue.choices}
                icon={activeQuestDialogue.icon}
                onChoice={(choice) => {
                  const result = handleQuestChoice(choice.id, () =>
                    setActiveQuestDialogue(null),
                  );

                  if (result === "ignored" && activeZone === targetZoneId) {
                    onComplete();
                  } else if (result === "none") {
                    setActiveQuestDialogue(null);
                  }
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
        </div>
      </div>
    </div>
  );
}
