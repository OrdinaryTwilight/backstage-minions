import { useGame } from "../../../context/GameContext";
import { CHARACTERS } from "../../../data/gameData";
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

  return (
    <div
      style={{
        width: "100%", // Adapts to parent column width
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

          {/* UX FIX: Dynamic Inventory Checking for accurate task state reflection */}
          {activeQuests.map((id) => {
            const q = QUEST_REGISTRY.find((r) => r.id === id);
            if (!q) return null;

            const targetChar = CHARACTERS.find((c) => c.id === q.targetNpcId);
            const targetName = targetChar ? targetChar.name : "Location";
            const hasItem = inventory.includes(q.requiredItem);

            let taskDesc = `Assist ${targetName}`;
            if (q.requiredItem) {
              taskDesc = hasItem
                ? `Give ${q.requiredItem} to ${targetName}`
                : `Get ${q.requiredItem} from ${q.pickupNpcName}`;
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
            const targetName = targetChar ? targetChar.name : "Location";
            const desc = q.requiredItem
              ? `Given ${q.requiredItem} to ${targetName}`
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

      {headsetOn && (
        <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
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
