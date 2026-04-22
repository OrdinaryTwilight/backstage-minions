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

// UX FIX: Maps vibrant backgrounds to safe foreground text colors for WCAG compliance
const BADGE_TEXT_COLORS: Record<string, string> = {
  "var(--bui-fg-warning)": "#000",
  "var(--bui-fg-info)": "#000",
  "var(--bui-fg-danger)": "#fff",
  "#ec4899": "#fff",
  "#a855f7": "#fff",
};

interface MapViewportProps {
  readonly currentRoom: string;
  readonly currentZones: Record<string, ZoneConfig>;
  readonly npcs: NPC[];
  readonly pos: { x: number; y: number };
  readonly playerChar: Character | undefined | null;
  readonly activeZone: string | null;
  readonly activeNpcId: string | null;
  readonly feedbackMsg: string | null;
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
        const activeTextColor = BADGE_TEXT_COLORS[baseColor] || "#000";

        return (
          <div
            key={key}
            style={{
              position: "absolute",
              left: `${(zone.x / GAME_WIDTH) * 100}%`,
              top: `${(zone.y / GAME_HEIGHT) * 100}%`,
              width: `${(zone.w / GAME_WIDTH) * 100}%`,
              height: `${(zone.h / GAME_HEIGHT) * 100}%`,
              background: isActive ? `${baseColor}55` : `${baseColor}33`,
              border: isActive
                ? `3px solid ${baseColor}`
                : `1px solid ${baseColor}88`,
              boxShadow: isActive
                ? `0 0 20px ${baseColor}, inset 0 0 15px ${baseColor}`
                : "none",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              textAlign: "center",
              padding: "4px",
              pointerEvents: "none",
              transition: "all 0.2s ease",
            }}
          >
            {/* UX FIX: Badges smoothly invert to solid colors when glowing, avoiding the dark slate clash */}
            <span
              style={{
                fontFamily: "var(--font-sketch)",
                fontWeight: "bold",
                fontSize: isActive
                  ? "clamp(0.85rem, 3vw, 1.2rem)"
                  : "clamp(0.65rem, 2vw, 0.9rem)",
                color: isActive ? activeTextColor : "#fff",
                background: isActive ? baseColor : "rgba(0, 0, 0, 0.6)",
                border: `1px solid ${isActive ? "transparent" : baseColor}`,
                padding: "4px 8px",
                borderRadius: "6px",
                lineHeight: "1.2",
                zIndex: isActive ? 10 : 1,
                transition: "all 0.2s ease",
              }}
            >
              {zone.label}
            </span>

            {isTarget && (
              <div
                className="animate-ping"
                aria-hidden="true"
                style={{
                  position: "absolute",
                  top: "-15px",
                  width: "15px",
                  height: "15px",
                  borderRadius: "50%",
                  background: "var(--bui-fg-warning)",
                  boxShadow: "0 0 10px var(--bui-fg-warning)",
                }}
              />
            )}
          </div>
        );
      })}

      {npcs.map((npc) => {
        if (npc.isHidden) return null;
        const isNpcActive = npc.id === activeNpcId;
        const npcColor = DEPT_COLORS[npc.dept] || "var(--bui-fg-info)";
        const activeTextColor = BADGE_TEXT_COLORS[npcColor] || "#000";

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
                color: isNpcActive ? activeTextColor : npcColor,
                whiteSpace: "nowrap",
                textShadow: isNpcActive ? "none" : "1px 1px 2px #000",
                background: isNpcActive ? npcColor : "rgba(0,0,0,0.8)",
                padding: "2px 6px",
                borderRadius: "4px",
                marginTop: "4px",
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
            textShadow: "1px 1px 2px #000",
            background: "rgba(0,0,0,0.8)",
            padding: "2px 6px",
            borderRadius: "4px",
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
            }}
          >
            {bumpMsg.msg}
          </div>
        )}
      </div>
    </div>
  );
}
