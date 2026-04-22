import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useGame } from "../../context/GameContext";

export default function ShowControlNav() {
  const [showQuitConfirm, setShowQuitConfirm] = useState(false);
  const navigate = useNavigate();
  const { dispatch } = useGame();

  const handleAbandonClick = () => {
    setShowQuitConfirm(true);
    // UX FIX: Priority 4 - Broadcast a pause event so background minigames halt
    globalThis.dispatchEvent(new Event("global_pause_request"));
  };

  const handleCancelAbandon = () => {
    setShowQuitConfirm(false);
    // UX FIX: Priority 4 - Broadcast resume event
    globalThis.dispatchEvent(new Event("global_resume_request"));
  };

  const handleQuit = () => {
    dispatch({ type: "CLEAR_SESSION" });
    sessionStorage.removeItem("minion_inventory");
    sessionStorage.removeItem("minion_completed_quests");
    sessionStorage.removeItem("minion_chats");
    sessionStorage.removeItem("unread_messages");
    navigate("/");
  };

  return (
    <div
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        background: "var(--color-surface-translucent)",
        borderTop: "1px solid var(--glass-border)",
        padding: "10px",
        display: "flex",
        justifyContent: "center",
        zIndex: 5000,
        backdropFilter: "blur(10px)",
      }}
    >
      {showQuitConfirm ? (
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <span style={{ color: "var(--bui-fg-danger)", fontWeight: "bold" }}>
            Abandon show?
          </span>
          <button
            type="button"
            onClick={handleQuit}
            style={{
              background: "var(--bui-fg-danger)",
              color: "#fff",
              padding: "5px 15px",
              border: "none",
              borderRadius: "4px",
              fontWeight: "bold",
              cursor: "pointer",
              fontFamily: "var(--font-sketch)",
            }}
          >
            Yes, Quit
          </button>
          <button
            type="button"
            onClick={handleCancelAbandon}
            style={{
              background: "#444",
              color: "#fff",
              padding: "5px 15px",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              fontFamily: "var(--font-sketch)",
            }}
          >
            Cancel
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={handleAbandonClick}
          style={{
            background: "transparent",
            color: "var(--color-pencil-light)",
            padding: "5px 15px",
            border: "1px solid var(--glass-border)",
            borderRadius: "4px",
            cursor: "pointer",
            fontFamily: "var(--font-sketch)",
          }}
        >
          ⏏ Abandon Show
        </button>
      )}
    </div>
  );
}
