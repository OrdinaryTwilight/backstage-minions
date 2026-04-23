import { ZoneConfig } from "../../../data/types";
import { Character } from "../../../types/game";
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
  readonly currentRoom: string;
  readonly currentZones: Record<string, ZoneConfig>;
  readonly npcs: NPC[];
  readonly pos: { x: number; y: number };
  readonly playerChar: Character | undefined | null;
  readonly activeZone: string | null;
  readonly activeNpcId: string | null;
  // SONAR FIX S6767: Removed unused 'feedbackMsg' prop
  readonly bumpMsg: { id: string; msg: string } | null;
  readonly handleStageClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
  readonly targetZoneId: string | null;
}

export default function MapViewport({
  currentRoom,
  currentZones,
  npcs,
  pos,
  playerChar,
  activeZone,
  activeNpcId,
  bumpMsg,
  handleStageClick,
  targetZoneId,
}: MapViewportProps) {
  const textStrokeShadow =
    "1px 1px 0 #000, -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 0 4px 8px rgba(0,0,0,0.8)";

  return (
    <div
      style={{
        flex: 1,
        position: "relative",
        width: "100%",
        minWidth: "300px",
        aspectRatio: `${GAME_WIDTH} / ${GAME_HEIGHT}`,
        background: currentRoom === "backstage" ? "#1a1a2e" : "#1e293b",
        border: "4px solid var(--glass-border)",
        borderRadius: "var(--radius-md)",
        overflow: "hidden",
        boxShadow: "inset 0 0 50px rgba(0,0,0,0.8)",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          opacity: 0.15,
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.8) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
          pointerEvents: "none",
        }}
      />

      <button
        type="button"
        aria-label={`Interactive map of ${currentRoom}`}
        onClick={handleStageClick}
        style={{
          position: "absolute",
          inset: 0,
          background: "transparent",
          border: "none",
          cursor: "crosshair",
          width: "100%",
          height: "100%",
          zIndex: 5,
        }}
      />

      {Object.entries(currentZones).map(([key, zone]) => {
        const isActive = key === activeZone;
        const isTarget = key === targetZoneId;
        const baseColor = zone.color || "var(--bui-fg-info)";

        // SONAR FIX S3358: Extracted nested ternaries into independent conditional statements
        // Default styling (inactive)
        let currentBackground = `${baseColor}22`;
        let currentBorder = `2px dashed ${baseColor}88`;
        let currentBoxShadow = "none";
        let currentZIndex = 1;

        if (isTarget) {
          // Target zone styling overrides
          currentBackground = `${baseColor}66`;
          currentBorder = `3px solid var(--bui-fg-warning)`;
          currentBoxShadow = `0 0 30px 5px var(--bui-fg-warning), inset 0 0 20px var(--bui-fg-warning)`;
          currentZIndex = 15;
        } else if (isActive) {
          // Active (hovered/clicked) zone styling overrides
          currentBackground = `${baseColor}44`;
          currentBorder = `3px solid ${baseColor}`;
          currentBoxShadow = `0 0 30px 5px ${baseColor}, inset 0 0 30px ${baseColor}`;
          currentZIndex = 10;
        }

        return (
          <div
            key={key}
            style={{
              position: "absolute",
              left: `${(zone.x / GAME_WIDTH) * 100}%`,
              top: `${(zone.y / GAME_HEIGHT) * 100}%`,
              width: `${(zone.w / GAME_WIDTH) * 100}%`,
              height: `${(zone.h / GAME_HEIGHT) * 100}%`,
              background: currentBackground,
              border: currentBorder,
              boxShadow: currentBoxShadow,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              pointerEvents: "none",
              transition: "all 0.2s ease",
              zIndex: currentZIndex,
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "6px",
              }}
            >
              {isTarget && (
                <div
                  className="animate-ping"
                  aria-hidden="true"
                  style={{
                    width: "14px",
                    height: "14px",
                    borderRadius: "50%",
                    background: "var(--bui-fg-warning)",
                    boxShadow: "0 0 10px var(--bui-fg-warning)",
                  }}
                />
              )}

              <span
                style={{
                  fontFamily: "var(--font-sketch)",
                  fontWeight: "bold",
                  fontSize: "clamp(0.75rem, 2.5vw, 1rem)",
                  color: "#fff",
                  textShadow: textStrokeShadow,
                  textAlign: "center",
                  lineHeight: "1.2",
                  transition: "all 0.2s ease",
                }}
              >
                {zone.label}
              </span>
            </div>
          </div>
        );
      })}

      {npcs.map((npc) => {
        if (npc.isHidden) return null;
        const isNpcActive = npc.id === activeNpcId;
        const npcColor = DEPT_COLORS[npc.dept] || "var(--bui-fg-info)";

        return (
          <div
            key={`npc-${npc.id}`}
            style={{
              position: "absolute",
              left: `${(npc.x / GAME_WIDTH) * 100}%`,
              top: `${(npc.y / GAME_HEIGHT) * 100}%`,
              width: `${(PLAYER_SIZE / GAME_WIDTH) * 100}%`,
              height: `${(PLAYER_SIZE / GAME_HEIGHT) * 100}%`,
              background: "rgba(0,0,0,0.6)",
              borderRadius: "50%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              border: isNpcActive ? `3px solid ${npcColor}` : "2px solid #555",
              boxShadow: isNpcActive
                ? `0 0 20px ${npcColor}, inset 0 0 10px ${npcColor}`
                : "none",
              pointerEvents: "none",
              transition: "all 0.1s linear",
              zIndex: 10,
            }}
          >
            <div
              style={{
                fontSize: "1.5rem",
                transform: isNpcActive ? "scale(1.2)" : "scale(1)",
                transition: "all 0.2s ease",
              }}
            >
              {npc.icon}
            </div>

            <div
              style={{
                position: "absolute",
                top: "-22px",
                fontFamily: "var(--font-mono)",
                fontSize: "12px",
                fontWeight: "bold",
                color: npcColor,
                textShadow: textStrokeShadow,
                whiteSpace: "nowrap",
                transition: "all 0.2s ease",
              }}
            >
              {npc.name}
            </div>

            {bumpMsg?.id === npc.id && (
              <div
                className="animate-pop"
                style={{
                  position: "absolute",
                  top: "-42px",
                  background: "white",
                  color: "black",
                  padding: "2px 6px",
                  borderRadius: "4px",
                  fontSize: "10px",
                  fontWeight: "bold",
                  whiteSpace: "nowrap",
                  zIndex: 100,
                  pointerEvents: "none",
                }}
              >
                {bumpMsg.msg}
              </div>
            )}
          </div>
        );
      })}

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
          fontSize: "1.8rem",
          pointerEvents: "none",
          transition: "left 0.05s linear, top 0.05s linear",
          zIndex: 20,
          boxShadow: "0 4px 10px rgba(0,0,0,0.6)",
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
            textShadow: textStrokeShadow,
          }}
        >
          YOU
        </div>
        {playerChar?.icon || "👤"}

        {bumpMsg?.id === "player" && (
          <div
            className="animate-pop"
            style={{
              position: "absolute",
              top: "-42px",
              background: "var(--bui-fg-danger)",
              color: "#fff",
              padding: "2px 6px",
              borderRadius: "4px",
              fontSize: "10px",
              fontWeight: "bold",
              whiteSpace: "nowrap",
              boxShadow: "0 2px 5px rgba(0,0,0,0.5)",
              pointerEvents: "none",
            }}
          >
            {bumpMsg.msg}
          </div>
        )}
      </div>
    </div>
  );
}
