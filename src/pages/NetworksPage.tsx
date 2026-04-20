// src/pages/NetworksPage.tsx
import { useEffect, useState } from "react";
import Button from "../components/ui/Button";
import NavBar from "../components/ui/NavBar";
import { useGame } from "../context/GameContext";
import { CHARACTERS } from "../data/characters";
import { CHAT_MESSAGES } from "../data/chatMessages";

export default function NetworksPage() {
  const { state, dispatch } = useGame();
  const [activeChat, setActiveChat] = useState<string | null>("sys_comms");

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

  const [sessionChats, setSessionChats] = useState<
    Record<string, { sender: string; text: string }[]>
  >(() => JSON.parse(sessionStorage.getItem("minion_chats") || "{}"));

  // Mocking standard Dialogue Choices for the Chat
  const [activeChoices, setActiveChoices] = useState<
    Record<string, { text: string; response: string; sideEffect?: string }[]>
  >({
    sam: [
      {
        text: "I'm ready for my shift.",
        response:
          "Great. Click into the Phantom of the Opera callboard and select 'School' difficulty.",
      },
      {
        text: "What am I supposed to do?",
        response:
          "We need an extra set of hands on Phantom. Look for the poster on the productions page.",
      },
    ],
  });

  // Clear unread dot for active chat
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

    // 1. Add Player's Message
    const newMsg = { sender: "You", text: replyText };
    setSessionChats((prev) => {
      const updated = { ...prev };
      if (!updated[activeContact.id]) updated[activeContact.id] = [];
      updated[activeContact.id] = [...updated[activeContact.id], newMsg];
      sessionStorage.setItem("minion_chats", JSON.stringify(updated));
      return updated;
    });

    // 2. Clear choices once answered
    setActiveChoices((prev) => {
      const updated = { ...prev };
      delete updated[activeContact.id];
      return updated;
    });

    // 3. Automated delayed response
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

      // Handle side effects (like unlocking a level) if defined
      if (sideEffect === "unlock_phantom") {
        // Here you would dispatch to your progress state if needed
      }
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
  const currentOptions = activeContact ? activeChoices[activeContact.id] : [];

  return (
    <div
      className="page-container animate-fade-in"
      style={{ paddingTop: "1rem", fontFamily: "var(--font-sketch)" }}
    >
      <NavBar />
      <header style={{ marginBottom: "2rem", marginTop: "2rem" }}>
        <h1 style={{ fontSize: "2.5rem" }}>Networks & Comms</h1>
        <p style={{ color: "var(--color-pencil-light)", fontSize: "1.1rem" }}>
          Stay in touch with your crew. Quick replies only—we're on headset!
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
            background: "rgba(15, 23, 42, 0.8)",
            borderRadius: "12px",
            border: "1px solid var(--bui-border)",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              padding: "1rem",
              background: "rgba(30, 41, 59, 0.9)",
              borderBottom: "1px solid var(--bui-border)",
            }}
          >
            <h2 style={{ fontSize: "1.2rem" }}>Directory</h2>
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
                        ? "rgba(30, 41, 59, 0.9)"
                        : "transparent",
                    border: "none",
                    borderBottom: "1px solid var(--bui-border)",
                    cursor: "pointer",
                    textAlign: "left",
                    color: "inherit",
                    width: "100%",
                    position: "relative",
                  }}
                >
                  <span style={{ fontSize: "2rem" }}>{contact.icon}</span>
                  <div>
                    <div style={{ fontWeight: "bold" }}>{contact.name}</div>
                    <div
                      style={{
                        fontSize: "0.9rem",
                        color: "var(--color-pencil-light)",
                      }}
                    >
                      {contact.role}
                    </div>
                  </div>

                  {/* UNREAD DOT FOR DIRECTORY ITEM */}
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
            background: "rgba(15, 23, 42, 0.8)",
            borderRadius: "12px",
            border: "1px solid var(--bui-border)",
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
                  background: "rgba(30, 41, 59, 0.9)",
                  borderBottom: "1px solid var(--bui-border)",
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
                {currentMessages.length === 0 && (
                  <div
                    style={{
                      textAlign: "center",
                      color: "var(--color-pencil-light)",
                      margin: "auto",
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
                          : "rgba(30, 41, 59, 0.9)",
                      color: msg.sender === "You" ? "#000" : "inherit",
                      fontWeight: msg.sender === "You" ? "bold" : "normal",
                      padding: "0.8rem 1.2rem",
                      borderRadius: "12px",
                      maxWidth: "80%",
                      fontFamily:
                        msg.sender === "You" ? "inherit" : "var(--font-mono)",
                      fontSize: msg.sender !== "You" ? "0.95rem" : "1rem",
                    }}
                  >
                    {msg.sender !== "You" && (
                      <div
                        style={{
                          fontSize: "0.75rem",
                          opacity: 0.7,
                          marginBottom: "0.4rem",
                        }}
                      >
                        {msg.sender}
                      </div>
                    )}
                    {msg.text}
                  </div>
                ))}
              </div>

              {/* QUICK REPLIES / DIALOGUE CHOICES */}
              <div
                style={{
                  padding: "1rem",
                  borderTop: "1px solid var(--bui-border)",
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.5rem",
                  background: "rgba(0,0,0,0.2)",
                }}
              >
                {currentOptions && currentOptions.length > 0 ? (
                  currentOptions.map((choice, idx) => (
                    <Button
                      key={idx}
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
                      color: "var(--color-pencil-light)",
                      fontStyle: "italic",
                      fontSize: "0.9rem",
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
