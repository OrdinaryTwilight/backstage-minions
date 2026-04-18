import { useState } from "react";
import NavBar from "../components/shared/layout/NavBar";
import SectionHeader from "../components/shared/ui/SectionHeader";
import { useGame } from "../context/GameContext";
import { CHARACTERS } from "../data/gameData";

// Simple predefined chat scripts
const CHAT_SCRIPTS: Record<
  string,
  { sender: "npc" | "player"; text: string }[]
> = {
  char_ben: [
    {
      sender: "npc",
      text: "Hey, did you grab the gel swatch book from the booth?",
    },
    { sender: "player", text: "Yeah, I left it on the SM's desk." },
    { sender: "npc", text: "Lifesaver. See you at call time." },
  ],
  char_sam: [
    {
      sender: "npc",
      text: "Mics are patched. Can you run a line check on channel 4?",
    },
    { sender: "player", text: "Check 1, 2. Getting signal?" },
    { sender: "npc", text: "Loud and clear. We're holding for doors." },
  ],
  sys_comms: [
    { sender: "npc", text: "AUTOMATED ALERT: Show report submitted." },
    { sender: "npc", text: "0 Injuries, 2 Broken Props, 1 Crying Director." },
    { sender: "player", text: "Standard Tuesday." },
  ],
};

export default function NetworksPage() {
  const { state, dispatch } = useGame();
  const [activeChat, setActiveChat] = useState<string | null>(null);

  const availableContacts = [
    "sys_comms",
    ...state.contacts.filter((id) => id !== "sys_comms"),
  ]
    .map((id) => {
      if (id === "sys_comms") {
        return { id, name: "System Alerts", icon: "🤖" };
      }
      const character = CHARACTERS.find((c) => c.id === id);
      return character || null;
    })
    .filter(
      (
        c,
      ): c is
        | (typeof CHARACTERS)[0]
        | { id: string; name: string; icon: string } => c !== null,
    );

  const handleOpenChat = (id: string) => {
    setActiveChat(id);
    if (state.unreadContacts.includes(id)) {
      dispatch({ type: "MARK_CONTACT_READ", contactId: id });
    }
  };

  const activeData = availableContacts.find((c) => c.id === activeChat);
  const script = activeChat
    ? CHAT_SCRIPTS[activeChat] || [{ sender: "npc", text: "User is offline." }]
    : [];

  return (
    <div className="page-container animate-blueprint">
      <NavBar />
      <SectionHeader
        title="Network"
        subtitle="Crew comms and direct messaging."
      />

      <div
        style={{
          display: "flex",
          gap: "1rem",
          height: "60vh",
          background: "rgba(15, 23, 42, 0.8)",
          border: "2px solid var(--glass-border)",
          borderRadius: "8px",
          overflow: "hidden",
        }}
      >
        {/* CONTACTS LIST */}
        <div
          style={{
            width: activeChat ? "30%" : "100%",
            background: "#111",
            borderRight: "1px solid #333",
            overflowY: "auto",
            transition: "width 0.3s ease",
          }}
        >
          {availableContacts.map((contact) => {
            const isUnread = state.unreadContacts.includes(contact.id);
            return (
              <button
                key={contact.id}
                onClick={() => handleOpenChat(contact.id)}
                style={{
                  padding: "15px",
                  borderBottom: "1px solid #222",
                  cursor: "pointer",
                  background:
                    activeChat === contact.id ? "#222" : "transparent",
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  width: "100%",
                  border: "none",
                  textAlign: "left",
                }}
              >
                <div style={{ fontSize: "1.5rem" }}>{contact.icon}</div>
                <div
                  style={{ flex: 1, display: activeChat ? "none" : "block" }}
                >
                  <div
                    style={{
                      fontWeight: "bold",
                      color: isUnread ? "white" : "#aaa",
                    }}
                  >
                    {contact.name}
                  </div>
                  {isUnread && (
                    <span
                      style={{
                        fontSize: "0.7rem",
                        color: "var(--bui-fg-danger)",
                        fontWeight: "bold",
                      }}
                    >
                      ● NEW
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* ACTIVE CHAT AREA */}
        {activeChat && (
          <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
            <div
              style={{
                padding: "15px",
                background: "#222",
                borderBottom: "1px solid #333",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div style={{ fontWeight: "bold" }}>
                {activeData?.icon} {activeData?.name}
              </div>
              <button
                onClick={() => setActiveChat(null)}
                style={{
                  background: "transparent",
                  border: "none",
                  color: "#888",
                  cursor: "pointer",
                }}
              >
                ✖ Close
              </button>
            </div>

            <div
              style={{
                flex: 1,
                padding: "15px",
                overflowY: "auto",
                display: "flex",
                flexDirection: "column",
                gap: "10px",
              }}
            >
              {script.map((msg, idx) => (
                <div
                  key={`${msg.sender}-${idx}-${msg.text}`}
                  style={{
                    alignSelf:
                      msg.sender === "player" ? "flex-end" : "flex-start",
                    background:
                      msg.sender === "player" ? "var(--bui-fg-info)" : "#333",
                    color: msg.sender === "player" ? "#000" : "#fff",
                    padding: "10px 15px",
                    borderRadius: "18px",
                    maxWidth: "70%",
                  }}
                >
                  {msg.text}
                </div>
              ))}
            </div>

            {/* Input Mockup (Disabled since it's pre-scripted) */}
            <div
              style={{
                padding: "15px",
                borderTop: "1px solid #333",
                background: "#111",
              }}
            >
              <input
                type="text"
                disabled
                placeholder="User is offline..."
                style={{
                  width: "100%",
                  padding: "10px",
                  background: "#222",
                  border: "1px solid #444",
                  borderRadius: "20px",
                  color: "#888",
                }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
