import { useEffect, useState } from "react";
import Button from "../components/ui/Button";
import NavBar from "../components/ui/NavBar";
import { useGame } from "../context/GameContext";
import { AVAILABLE_NPCS, CHARACTERS, NPC_ICONS } from "../data/characters";
import { CHAT_CHOICES, CHAT_MESSAGES } from "../data/chatMessages";

export default function NetworksPage() {
  const { state, dispatch } = useGame();
  const [activeChat, setActiveChat] = useState<string | null>("sys_comms");

  const safeContacts = Array.isArray(state.contacts) ? state.contacts : [];
  const availableContacts = [
    "sys_comms",
    ...safeContacts.filter((id) => id !== "sys_comms"),
  ].map((id) => {
    if (id === "sys_comms") {
      return {
        id,
        name: "System Alerts",
        icon: "🤖",
        role: "Automated System",
      };
    }

    const mainChar = CHARACTERS.find((c) => c.id === id);
    if (mainChar) {
      return {
        id,
        name: mainChar.name,
        icon: mainChar.icon,
        role: mainChar.role,
      };
    }

    const npc = AVAILABLE_NPCS.find((c) => c.id === id);
    if (npc) {
      const iconKey = Object.keys(NPC_ICONS).find((k) => npc.role.includes(k));
      const icon = iconKey
        ? NPC_ICONS[iconKey as keyof typeof NPC_ICONS]
        : "👤";
      return { id, name: npc.name, icon, role: npc.role };
    }

    const chatData = CHAT_MESSAGES[id];
    if (chatData) {
      return { id, name: chatData.sender, icon: "📢", role: "Group Chat" };
    }

    return { id, name: "Unknown Contact", icon: "👤", role: "Crew" };
  });

  const activeContact = availableContacts.find((c) => c.id === activeChat);

  const [sessionChats, setSessionChats] = useState<
    Record<string, { sender: string; text: string }[]>
  >(() => JSON.parse(sessionStorage.getItem("minion_chats") || "{}"));

  useEffect(() => {
    if (activeChat && state.unreadContacts?.includes(activeChat)) {
      dispatch({ type: "MARK_CONTACT_READ", contactId: activeChat });
    }
  }, [activeChat, state.unreadContacts, dispatch]);

  const handleSendReply = (
    replyText: string,
    automatedResponse: string,
    sideEffect?: string,
  ) => {
    if (!activeContact) return;

    const newMsg = { sender: "You", text: replyText };
    setSessionChats((prev) => {
      const updated = { ...prev };
      if (!updated[activeContact.id]) updated[activeContact.id] = [];
      updated[activeContact.id] = [...updated[activeContact.id], newMsg];
      sessionStorage.setItem("minion_chats", JSON.stringify(updated));
      return updated;
    });

    setTimeout(() => {
      setSessionChats((prev) => {
        const replyChats = { ...prev };
        replyChats[activeContact.id] = [
          ...replyChats[activeContact.id],
          { sender: activeContact.name, text: automatedResponse },
        ];
        sessionStorage.setItem("minion_chats", JSON.stringify(replyChats));
        return replyChats;
      });
    }, 1200);
  };

  const getCombinedChat = (id: string) => {
    const staticChat =
      CHAT_MESSAGES[id]?.messages.map((m) => ({
        sender: CHAT_MESSAGES[id].sender,
        text: m,
      })) || [];
    const dynamicChat = sessionChats[id] || [];
    return [...staticChat, ...dynamicChat];
  };

  const currentMessages = activeContact
    ? getCombinedChat(activeContact.id)
    : [];

  const currentOptions =
    activeContact && CHAT_CHOICES[activeContact.id]
      ? CHAT_CHOICES[activeContact.id].filter(
          (choice) =>
            !currentMessages.some(
              (msg) => msg.sender === "You" && msg.text === choice.text,
            ),
        )
      : [];

  // UX FIX: Priority 1 - Ensure fonts are explicit and backgrounds use semantic CSS variables
  return (
    <div
      className="page-container animate-fade-in"
      style={{ paddingTop: "1rem" }}
    >
      <NavBar />
      <header
        style={{
          marginBottom: "2rem",
          marginTop: "2rem",
          fontFamily: "var(--font-sketch)",
        }}
      >
        <h1 style={{ fontSize: "2.5rem", color: "var(--color-pencil-light)" }}>
          Chat
        </h1>
        <p style={{ color: "var(--color-pencil-light)", fontSize: "1.1rem" }}>
          Stay in touch with your crew. Quick replies only, we're on headset!
        </p>
      </header>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap: "2rem",
        }}
      >
        {/* SIDEBAR DIRECTORY */}
        <div
          style={{
            background: "var(--color-surface-translucent)",
            borderRadius: "12px",
            border: "2px solid var(--glass-border)",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              padding: "1rem",
              background: "var(--color-blueprint-bg)",
              borderBottom: "1px solid var(--glass-border)",
            }}
          >
            <h2
              style={{
                fontSize: "1.2rem",
                fontFamily: "var(--font-mono)",
                color: "var(--color-pencil-light)",
                margin: 0,
              }}
            >
              Directory
            </h2>
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            {availableContacts.map((contact) => {
              const isUnread = state.unreadContacts?.includes(contact.id);
              return (
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
                        ? "var(--color-blueprint-bg)"
                        : "transparent",
                    border: "none",
                    borderBottom: "1px solid var(--glass-border)",
                    cursor: "pointer",
                    textAlign: "left",
                    color: "var(--color-pencil-light)",
                    width: "100%",
                    position: "relative",
                  }}
                >
                  <span style={{ fontSize: "2rem" }}>{contact.icon}</span>
                  <div>
                    <div
                      style={{
                        fontWeight: "bold",
                        fontFamily: "var(--font-sketch)",
                        fontSize: "1.1rem",
                      }}
                    >
                      {contact.name}
                    </div>
                    <div
                      style={{
                        fontSize: "0.9rem",
                        color: "var(--bui-fg-info)",
                        fontFamily: "var(--font-mono)",
                      }}
                    >
                      {contact.role}
                    </div>
                  </div>
                  {isUnread && (
                    <div
                      style={{
                        position: "absolute",
                        right: "1rem",
                        top: "50%",
                        transform: "translateY(-50%)",
                        width: "12px",
                        height: "12px",
                        borderRadius: "50%",
                        background: "var(--bui-fg-danger)",
                        boxShadow: "0 0 8px var(--bui-fg-danger)",
                      }}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* CHAT WINDOW */}
        <div
          style={{
            background: "var(--color-surface-translucent)",
            borderRadius: "12px",
            border: "2px solid var(--glass-border)",
            display: "flex",
            flexDirection: "column",
            height: "550px",
          }}
        >
          {activeContact ? (
            <>
              <div
                style={{
                  padding: "1rem",
                  background: "var(--color-blueprint-bg)",
                  borderBottom: "1px solid var(--glass-border)",
                  display: "flex",
                  alignItems: "center",
                  gap: "1rem",
                }}
              >
                <span style={{ fontSize: "1.5rem" }}>{activeContact.icon}</span>
                <h2
                  style={{
                    fontSize: "1.2rem",
                    fontFamily: "var(--font-sketch)",
                    color: "var(--color-pencil-light)",
                    margin: 0,
                  }}
                >
                  {activeContact.name}
                </h2>
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
                {currentMessages.length === 0 && (
                  <div
                    style={{
                      textAlign: "center",
                      color: "var(--color-pencil-light)",
                      margin: "auto",
                      fontFamily: "var(--font-mono)",
                    }}
                  >
                    No message history.
                  </div>
                )}
                {currentMessages.map((msg, i) => (
                  <div
                    key={`msg-${msg.sender}-${i}`}
                    style={{
                      alignSelf:
                        msg.sender === "You" ? "flex-end" : "flex-start",
                      background:
                        msg.sender === "You"
                          ? "var(--bui-fg-info)"
                          : "var(--color-blueprint-bg)",
                      color:
                        msg.sender === "You"
                          ? "#000"
                          : "var(--color-pencil-light)",
                      padding: "0.8rem 1.2rem",
                      borderRadius: "12px",
                      maxWidth: "80%",
                      fontFamily: "var(--font-mono)",
                      fontSize: "0.95rem",
                      border:
                        msg.sender === "You"
                          ? "none"
                          : "1px solid var(--glass-border)",
                    }}
                  >
                    {msg.sender !== "You" && (
                      <div
                        style={{
                          fontSize: "0.75rem",
                          opacity: 0.7,
                          marginBottom: "0.4rem",
                          color: "var(--bui-fg-warning)",
                        }}
                      >
                        {msg.sender}
                      </div>
                    )}
                    {msg.text}
                  </div>
                ))}
              </div>

              <div
                style={{
                  padding: "1rem",
                  borderTop: "1px solid var(--glass-border)",
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.5rem",
                  background: "var(--color-blueprint-bg)",
                }}
              >
                {currentOptions && currentOptions.length > 0 ? (
                  currentOptions.map((choice) => (
                    <Button
                      key={choice.text}
                      onClick={() =>
                        handleSendReply(
                          choice.text,
                          choice.response,
                          choice.sideEffect,
                        )
                      }
                      style={{
                        textAlign: "left",
                        justifyContent: "flex-start",
                        fontFamily: "var(--font-sketch)",
                        fontSize: "1rem",
                      }}
                    >
                      {choice.text}
                    </Button>
                  ))
                ) : (
                  <div
                    style={{
                      textAlign: "center",
                      color: "var(--bui-fg-warning)",
                      fontStyle: "italic",
                      fontSize: "0.9rem",
                      fontFamily: "var(--font-mono)",
                    }}
                  >
                    {activeContact.id === "sys_comms"
                      ? "Cannot reply to automated system."
                      : "Waiting for them to type..."}
                  </div>
                )}
              </div>
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
}
