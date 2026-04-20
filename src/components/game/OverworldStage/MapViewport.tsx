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
  playerChar: { icon?: string } | null | undefined;
  activeZone: string | null;
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
        aria-label="Interactive Map Area. Click or tap to move the character."
        style={{
          position: "relative",
          width: "100%",
          aspectRatio: "16/9",
          background: currentRoom === "backstage" ? "#1a1a2e" : "#2d3748",
          border: "4px solid #fff",
          overflow: "hidden",
          cursor: "crosshair",
          padding: 0,
          display: "block",
        }}
      >
        {Object.entries(currentZones).map(([key, zone]) => {
          const isActive = activeZone === key;

          return (
            <div
              key={key}
              style={{
                position: "absolute",
                left: `${(zone.x / GAME_WIDTH) * 100}%`,
                top: `${(zone.y / GAME_HEIGHT) * 100}%`,
                width: `${(zone.w / GAME_WIDTH) * 100}%`,
                height: `${(zone.h / GAME_HEIGHT) * 100}%`,
                background: isActive ? zone.color : `${zone.color}99`, // Dim inactive zones slightly
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                border: isActive
                  ? "3px solid var(--bui-fg-warning)"
                  : "1px solid rgba(255,255,255,0.15)",
                boxSizing: "border-box",
                transition: "all 0.2s ease",
              }}
            >
              <span
                style={{
                  fontFamily: "var(--font-sketch)",
                  fontWeight: "bold",
                  // Scale up slightly when active, but clamp the sizes so they remain readable
                  fontSize: isActive
                    ? "clamp(0.8rem, 3vw, 1.2rem)"
                    : "clamp(0.6rem, 2vw, 0.9rem)",
                  color: key === "spotTower" && isActive ? "#000" : "#fff",
                  whiteSpace: "nowrap", // Force single line
                  background: isActive ? "transparent" : "rgba(0, 0, 0, 0.13)", // Badge background for readability when overflowing
                  padding: "2px 6px",
                  borderRadius: "4px",
                  textShadow:
                    isActive && key !== "spotTower"
                      ? "1px 1px 3px rgba(0, 0, 0, 0)"
                      : "none",
                  pointerEvents: "none", // Ensure the overflowing text doesn't intercept clicks meant for adjacent zones
                  zIndex: isActive ? 10 : 1, // Bring active label to the front
                  transition: "all 0.2s ease",
                }}
              >
                {zone.label}
              </span>
            </div>
          );
        })}

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
                transition: "all 0.1s linear",
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
                  background: "rgba(0,0,0,0.6)",
                  padding: "1px 4px",
                  borderRadius: "3px",
                  pointerEvents: "none",
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
                    pointerEvents: "none",
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
            transition: "all 0.1s linear",
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
              background: "rgba(0,0,0,0.6)",
              padding: "1px 4px",
              borderRadius: "3px",
              pointerEvents: "none",
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
