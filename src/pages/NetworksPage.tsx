import { useEffect, useState } from "react";
import Button from "../components/ui/Button";
import NavBar from "../components/ui/NavBar";
import { useGame } from "../context/GameContext";
import { CHARACTERS } from "../data/characters";
import { CHAT_MESSAGES } from "../data/chatMessages";

export default function NetworksPage() {
  const { state } = useGame();
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
  >(() => {
    return JSON.parse(sessionStorage.getItem("minion_chats") || "{}");
  });
  const [inputText, setInputText] = useState("");

  useEffect(() => {
    sessionStorage.setItem("unread_messages", "false");
    globalThis.dispatchEvent(new Event("unread_messages_update"));
  }, []);

  const handleSendMessage = (e: React.SyntheticEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !activeContact) return;

    const newMsg = { sender: "You", text: inputText };
    const updatedChats = { ...sessionChats };
    if (!updatedChats[activeContact.id]) updatedChats[activeContact.id] = [];
    updatedChats[activeContact.id] = [
      ...updatedChats[activeContact.id],
      newMsg,
    ];

    setSessionChats(updatedChats);
    setInputText("");

    // Automated Reply
    setTimeout(() => {
      const replyChats = JSON.parse(
        sessionStorage.getItem("minion_chats") || "{}",
      );
      if (!replyChats[activeContact.id]) replyChats[activeContact.id] = [];
      replyChats[activeContact.id].push({
        sender: activeContact.name,
        text: "I'm a bit tied up right now. Let's catch up after strike!",
      });
      setSessionChats(replyChats);
      sessionStorage.setItem("minion_chats", JSON.stringify(replyChats));
    }, 1500);
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

  return (
    <div
      className="page-container animate-fade-in"
      style={{ paddingTop: "1rem" }}
    >
      <NavBar />
      <header style={{ marginBottom: "2rem", marginTop: "2rem" }}>
        <h1 style={{ fontSize: "2.5rem", fontFamily: "var(--font-sketch)" }}>
          Friends & Contacts
        </h1>
        <p style={{ color: "var(--color-pencil-light)", fontSize: "1.1rem" }}>
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
                      ? "rgba(30, 41, 59, 0.9)"
                      : "transparent",
                  border: "none",
                  borderBottom: "1px solid var(--bui-border)",
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
                    style={{
                      fontSize: "0.9rem",
                      color: "var(--color-pencil-light)",
                    }}
                  >
                    {contact.role}
                  </div>
                </div>
              </button>
            ))}
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
            height: "500px",
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
                {currentMessages.map((msg, i) => (
                  <div
                    key={i}
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
                    }}
                  >
                    {msg.sender !== "You" && (
                      <div
                        style={{
                          fontSize: "0.8rem",
                          opacity: 0.7,
                          marginBottom: "0.2rem",
                        }}
                      >
                        {msg.sender}
                      </div>
                    )}
                    {msg.text}
                  </div>
                ))}
              </div>
              <form
                onSubmit={handleSendMessage}
                style={{
                  padding: "1rem",
                  borderTop: "1px solid var(--bui-border)",
                  display: "flex",
                  gap: "1rem",
                }}
              >
                <input
                  type="text"
                  placeholder="Send a message..."
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  style={{
                    flex: 1,
                    background: "rgba(15, 23, 42, 0.5)",
                    border: "1px solid var(--bui-border)",
                    borderRadius: "20px",
                    padding: "0.5rem 1rem",
                    color: "inherit",
                  }}
                />
                <Button type="submit">Send</Button>
              </form>
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
}
