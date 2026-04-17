import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function ShowControlNav() {
  const [showQuitConfirm, setShowQuitConfirm] = useState(false);
  const navigate = useNavigate();

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
            Abandon show? You will fail!
          </span>
          <button
            onClick={() => navigate("/")}
            style={{
              background: "var(--bui-fg-danger)",
              color: "#fff",
              padding: "5px 15px",
              border: "none",
              borderRadius: "4px",
              fontWeight: "bold",
              cursor: "pointer",
            }}
          >
            Yes, Quit
          </button>
          <button
            onClick={() => setShowQuitConfirm(false)}
            style={{
              background: "#444",
              color: "#fff",
              padding: "5px 15px",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Cancel
          </button>
        </div>
      ) : (
        <button
          onClick={() => setShowQuitConfirm(true)}
          style={{
            background: "transparent",
            color: "var(--color-pencil-light)",
            padding: "5px 15px",
            border: "1px solid var(--glass-border)",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          ⏏ Leave Show (Home)
        </button>
      )}
    </div>
  );
}
