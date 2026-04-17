import { useState } from "react";
import Button from "../components/ui/Button";
import HardwarePanel from "../components/ui/HardwarePanel";
import NavBar from "../components/ui/NavBar";
import SectionHeader from "../components/ui/SectionHeader";
import { useGame } from "../context/GameContext";
import { AVAILABLE_NPCS, CHARACTERS } from "../data/characters";

export default function NetworksPage() {
  const { state } = useGame();
  const [activeContactId, setActiveContactId] = useState<string | null>(null);

  // Combine Characters and NPCs to find contact details
  const allPossibleContacts = [...CHARACTERS, ...AVAILABLE_NPCS];
  const myContacts = allPossibleContacts.filter(
    (c) => state.contacts.includes(c.id) || state.contacts.includes(c.name),
  );

  const activeContact = myContacts.find((c) => c.id === activeContactId);

  return (
    <div className="page-container animate-blueprint">
      <NavBar />
      <SectionHeader
        title="Comms Network"
        subtitle="Encrypted channels with backstage crew and local legends."
      />

      <div className="networks-layout">
        {/* --- CONTACTS LIST --- */}
        <div className="contacts-sidebar">
          {myContacts.length === 0 ? (
            <p className="annotation-text">No active frequencies found...</p>
          ) : (
            myContacts.map((contact) => (
              <HardwarePanel
                key={contact.id}
                variant="clickable"
                className={`contact-item ${activeContactId === contact.id ? "active" : ""}`}
                onClick={() => setActiveContactId(contact.id)}
              >
                <div className="contact-info">
                  <span className="contact-icon">
                    {"icon" in contact ? contact.icon : "👤"}
                  </span>
                  <div>
                    <h3 className="contact-name">{contact.name}</h3>
                    <p className="contact-role">{contact.role}</p>
                  </div>
                </div>
              </HardwarePanel>
            ))
          )}
        </div>

        {/* --- CHAT INTERFACE --- */}
        <div className="chat-terminal">
          {activeContact ? (
            <HardwarePanel className="terminal-window">
              <div className="terminal-header">
                CONNECTED: {activeContact.name.toUpperCase()} //{" "}
                {activeContact.role.toUpperCase()}
              </div>
              <div className="message-history">
                <div className="message incoming">
                  <p className="message-text">
                    {activeContact.role === "Stage Manager"
                      ? "Great job on that last focus session. The Director was actually happy for once."
                      : activeContact.role === "System Admin"
                        ? "Welcome to the Comms Network. Remember: Channel A is for Cues, Channel B is for gossip."
                        : `Hey! It's ${activeContact.name}. Ready for the next load-in?`}
                  </p>
                  <span className="timestamp">12:04 PM</span>
                </div>
              </div>
              <div className="terminal-input-area">
                <input
                  type="text"
                  placeholder="Type a secure message..."
                  className="terminal-input"
                  disabled
                />
                <Button variant="primary" style={{ minWidth: "auto" }}>
                  SEND
                </Button>
              </div>
            </HardwarePanel>
          ) : (
            <div className="terminal-placeholder">
              <p>SELECT A CONTACT TO ESTABLISH LINK</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
