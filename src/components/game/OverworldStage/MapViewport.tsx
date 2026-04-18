import { ZoneConfig } from "../../../data/types";
import { GAME_HEIGHT, GAME_WIDTH, PLAYER_SIZE } from "./constants";
import { NPC } from "./types";

const DEPT_COLORS: Record<string, string> = {
  lighting: "var(--bui-fg-warning)",
  sound: "var(--bui-fg-info)",
  "Stage Manager": "var(--bui-fg-danger)",
  "Costume Designer": "#ec4899",
  Director: "#a855f7",
};

interface MapViewportProps {
  currentRoom: string;
  currentZones: Record<string, ZoneConfig>;
  npcs: NPC[];
  pos: { x: number; y: number };
  // FIX: Allow undefined to match what CHARACTERS.find() returns
  playerChar: { icon?: string } | null | undefined;
  activeZone: string | null;
  // FIX: Change DialogueState object to the simple string ID we use now
  activeNpcId: string | null;
  feedbackMsg: string | null;
  bumpMsg: { id: string; msg: string } | null;
  handleStageClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

export default function MapViewport({
  currentRoom,
  currentZones,
  npcs,
  pos,
  playerChar,
  activeZone,
  bumpMsg,
  handleStageClick,
}: Readonly<MapViewportProps>) {
  return (
    <div
      style={{
        flex: 1,
        position: "relative",
        width: "100%",
        minWidth: "300px",
      }}
    >
      <button
        onClick={handleStageClick}
        style={{
          position: "relative",
          width: "100%",
          aspectRatio: "16/9",
          background: currentRoom === "stage" ? "#1a1a2e" : "#2d3748",
          border: "4px solid #fff",
          overflow: "hidden",
          cursor: "crosshair",
          padding: 0,
        }}
      >
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
              boxSizing: "border-box",
              fontWeight: "bold",
              fontFamily: "var(--font-sketch)",
              opacity: zone.isSolid || zone.isDoor ? 1 : 0.6,
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
    </div>
  );
}
