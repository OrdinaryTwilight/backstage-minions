import { useState } from "react";
import Button from "../components/ui/Button";
import { useGame } from "../context/GameContext";
import { CHARACTERS } from "../data/characters";
import { CHAT_MESSAGES } from "../data/chatMessages";

export default function NetworksPage() {
  const { state } = useGame();
  const [activeChat, setActiveChat] = useState<string | null>("sys_comms");

  // Always show system, plus any accumulated contacts
  const availableContacts = [
    "sys_comms",
    ...(state.contacts?.filter((id) => id !== "sys_comms") || []),
  ].map((id) => {
    if (id === "sys_comms") {
      return {
        id,
        name: "System Alerts",
        icon: "🚨",
        role: "Automated System",
      };
    }
    const char = CHARACTERS.find((c) => c.id === id);
    return {
      id,
      name: char?.name || "Unknown Contact",
      icon: char?.icon || "👤",
      role: char?.role || "Crew",
    };
  });

  const activeContact = availableContacts.find((c) => c.id === activeChat);
  const chatData =
    activeChat && CHAT_MESSAGES[activeChat]
      ? CHAT_MESSAGES[activeChat].messages
      : CHAT_MESSAGES["default"].messages;

  return (
    <div
      className="page-container animate-fade-in"
      style={{ paddingTop: "2rem" }}
    >
      <header style={{ marginBottom: "2rem" }}>
        <h1 style={{ fontSize: "2.5rem", fontFamily: "var(--font-sketch)" }}>
          Friends & Contacts
        </h1>
        <p style={{ color: "var(--text-muted)", fontSize: "1.1rem" }}>
          Stay in touch with your crew. You never know when you'll need a favor.
        </p>
      </header>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap: "2rem",
        }}
      >
        <div
          style={{
            background: "var(--surface)",
            borderRadius: "12px",
            border: "1px solid var(--border)",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              padding: "1rem",
              background: "var(--surface2)",
              borderBottom: "1px solid var(--border)",
            }}
          >
            <h2 style={{ fontSize: "1.2rem" }}>Directory</h2>
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            {availableContacts.map((contact) => (
              <button
                key={contact.id}
                onClick={() => setActiveChat(contact.id)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "1rem",
                  padding: "1rem",
                  background:
                    activeChat === contact.id
                      ? "var(--surface2)"
                      : "transparent",
                  border: "none",
                  borderBottom: "1px solid var(--border)",
                  cursor: "pointer",
                  textAlign: "left",
                  color: "inherit",
                  width: "100%",
                }}
              >
                <span style={{ fontSize: "2rem" }}>{contact.icon}</span>
                <div>
                  <div style={{ fontWeight: "bold" }}>{contact.name}</div>
                  <div
                    style={{ fontSize: "0.9rem", color: "var(--text-muted)" }}
                  >
                    {contact.role}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div
          style={{
            background: "var(--surface)",
            borderRadius: "12px",
            border: "1px solid var(--border)",
            display: "flex",
            flexDirection: "column",
            height: "500px",
          }}
        >
          {activeContact ? (
            <>
              <div
                style={{
                  padding: "1rem",
                  background: "var(--surface2)",
                  borderBottom: "1px solid var(--border)",
                  display: "flex",
                  alignItems: "center",
                  gap: "1rem",
                }}
              >
                <span style={{ fontSize: "1.5rem" }}>{activeContact.icon}</span>
                <h2 style={{ fontSize: "1.2rem" }}>{activeContact.name}</h2>
              </div>
              <div
                style={{
                  flex: 1,
                  padding: "1rem",
                  overflowY: "auto",
                  display: "flex",
                  flexDirection: "column",
                  gap: "1rem",
                }}
              >
                {chatData.map((msg, i) => (
                  <div
                    key={i}
                    style={{
                      alignSelf: i % 2 === 0 ? "flex-start" : "flex-end",
                      background:
                        i % 2 === 0 ? "var(--surface2)" : "var(--primary)",
                      color: i % 2 === 0 ? "inherit" : "#fff",
                      padding: "0.8rem 1.2rem",
                      borderRadius: "12px",
                      maxWidth: "80%",
                    }}
                  >
                    {msg}
                  </div>
                ))}
              </div>
              <div
                style={{
                  padding: "1rem",
                  borderTop: "1px solid var(--border)",
                  display: "flex",
                  gap: "1rem",
                }}
              >
                <input
                  type="text"
                  placeholder="Send a message..."
                  style={{
                    flex: 1,
                    background: "var(--bg)",
                    border: "1px solid var(--border)",
                    borderRadius: "20px",
                    padding: "0.5rem 1rem",
                    color: "inherit",
                  }}
                  disabled
                />
                <Button variant="default" disabled>
                  Send
                </Button>
              </div>
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
}
