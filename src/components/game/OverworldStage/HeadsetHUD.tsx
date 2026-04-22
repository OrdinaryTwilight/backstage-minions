import { useGame } from "../../../context/GameContext";
import { CHARACTERS, OVERWORLD_MAPS } from "../../../data/gameData";
import { QUEST_REGISTRY } from "../../../data/quests";

interface HeadsetHUDProps {
  headsetOn: boolean;
  setHeadsetOn: (val: boolean) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  commsLog: any[];
}

export default function HeadsetHUD({
  headsetOn,
  setHeadsetOn,
  commsLog,
}: Readonly<HeadsetHUDProps>) {
  const { state } = useGame();
  const completedQuests = state.session?.completedQuests || [];
  const activeQuests = state.session?.activeQuests || [];
  const inventory = state.session?.inventory || [];

  const getZoneLabel = (zoneId: string) => {
    for (const room of Object.values(OVERWORLD_MAPS)) {
      if (room[zoneId]) return room[zoneId].label;
    }
    return "Location";
  };

  return (
    <div
      style={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        gap: "10px",
      }}
    >
      <button
        onClick={(e) => {
          e.stopPropagation();
          setHeadsetOn(!headsetOn);
        }}
        style={{
          background: headsetOn ? "var(--bui-fg-success)" : "#555",
          color: "#000",
          border: "2px solid #fff",
          borderRadius: "8px",
          padding: "10px",
          cursor: "pointer",
          fontWeight: "bold",
          boxShadow: "0 4px 6px rgba(0,0,0,0.5)",
        }}
      >
        🎧 {headsetOn ? "COMMS LIVE" : "COMMS MUTED"}
      </button>

      <div
        style={{
          background: "rgba(15, 23, 42, 0.95)",
          border: "2px solid var(--bui-fg-info)",
          borderRadius: "8px",
          padding: "10px",
        }}
      >
        <h3
          className="annotation-text"
          style={{
            margin: "0 0 10px 0",
            fontSize: "0.85rem",
            color: "var(--bui-fg-info)",
          }}
        >
          📋 OBJECTIVES
        </h3>
        <ul
          style={{
            listStyle: "none",
            padding: 0,
            margin: 0,
            fontSize: "0.8rem",
            color: "var(--color-pencil-light)",
            display: "flex",
            flexDirection: "column",
            gap: "6px",
          }}
        >
          <li style={{ color: "var(--bui-fg-warning)" }}>
            [ ] Complete Department Tasks
          </li>

          {activeQuests.map((id) => {
            const q = QUEST_REGISTRY.find((r) => r.id === id);
            if (!q) return null;

            const targetChar = CHARACTERS.find((c) => c.id === q.targetNpcId);
            const targetName = targetChar
              ? targetChar.name
              : getZoneLabel(q.targetZoneId);
            const hasItem = inventory.includes(q.requiredItem);

            let taskDesc = `Assist ${targetName}`;
            if (q.requiredItem) {
              if (hasItem) {
                taskDesc = `Give ${q.requiredItem} to ${targetName}`;
              } else if (q.pickupNpcName) {
                taskDesc = `Get ${q.requiredItem} from ${q.pickupNpcName}`;
              } else {
                taskDesc = `Find ${q.requiredItem} for ${targetName}`;
              }
            }

            return (
              <li key={id} style={{ opacity: 0.9 }}>
                [ ] {taskDesc}
              </li>
            );
          })}

          {completedQuests.map((id) => {
            const q = QUEST_REGISTRY.find((r) => r.id === id);
            if (!q) return null;

            const targetChar = CHARACTERS.find((c) => c.id === q.targetNpcId);
            const targetName = targetChar
              ? targetChar.name
              : getZoneLabel(q.targetZoneId);
            const desc = q.requiredItem
              ? `Gave ${q.requiredItem} to ${targetName}`
              : "Task Complete";

            return (
              <li
                key={id}
                style={{
                  color: "var(--bui-fg-success)",
                  textDecoration: "line-through",
                  opacity: 0.6,
                }}
              >
                [✓] {desc}
              </li>
            );
          })}
        </ul>
      </div>

      {/* UX FIX: Priority 2 - Constrain comms log to prevent Map crush on mobile devices */}
      {headsetOn && (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "5px",
            maxHeight: "180px",
            overflowY: "auto",
            paddingRight: "5px",
          }}
        >
          {commsLog.map((log, index) => {
            const speakerName = log.speaker || log.sender || "System";
            const key = log.id ?? index;

            return (
              <div
                key={key}
                style={{
                  background: "rgba(0,0,0,0.7)",
                  borderLeft: "3px solid var(--bui-fg-info)",
                  padding: "8px",
                  color: "#fff",
                  fontSize: "0.8rem",
                  borderRadius: "4px",
                  animation: "slide-up-fade 0.3s ease-out",
                }}
              >
                <strong style={{ color: "var(--bui-fg-info)" }}>
                  [{speakerName}]:
                </strong>{" "}
                {log.text}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
