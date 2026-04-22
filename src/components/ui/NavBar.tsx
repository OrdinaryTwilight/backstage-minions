import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useGame } from "../../context/GameContext";
import SettingsPanel from "./SettingsPanel";

const TABS = [
  { path: "/", icon: "🏠", label: "Home" },
  { path: "/productions", icon: "🎭", label: "Shows" },
  { path: "/stories", icon: "📚", label: "Stories" },
  { path: "/networks", icon: "📱", label: "Contacts" },
];

export default function NavBar() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [showSettings, setShowSettings] = useState(false);
  const { state } = useGame();

  const hasUnread = state?.unreadContacts && state.unreadContacts.length > 0;
  const session = state?.session;

  useEffect(() => {
    if (!showSettings) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setShowSettings(false);
      }
    };

    globalThis.addEventListener("keydown", onKeyDown);
    return () => globalThis.removeEventListener("keydown", onKeyDown);
  }, [showSettings]);

  return (
    <>
      <nav
        className="nav-bar"
        style={{
          flexWrap: "wrap",
          height: "auto",
          minHeight: "70px",
          padding: "0 1rem",
        }}
      >
        {/* Navigation Tabs */}
        <div
          style={{ display: "flex", flex: 1, justifyContent: "space-around" }}
        >
          {TABS.map((t) => (
            <button
              key={t.path}
              type="button"
              onClick={() => navigate(t.path)}
              className={`nav-item ${pathname === t.path ? "active" : ""}`}
              style={{ position: "relative" }}
            >
              <span>{t.icon}</span>
              <span>{t.label}</span>
              {t.path === "/networks" && hasUnread && (
                <span
                  style={{
                    position: "absolute",
                    top: "0.5rem",
                    right: "0.5rem",
                    width: "10px",
                    height: "10px",
                    borderRadius: "50%",
                    background: "var(--bui-fg-danger)",
                  }}
                />
              )}
            </button>
          ))}

          <button
            type="button"
            className="nav-item"
            onClick={() => setShowSettings(true)}
            aria-label="Open visual settings"
          >
            <span>⚙️</span>
            <span>Settings</span>
          </button>
        </div>

        {session && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "1rem",
              borderLeft: "1px solid var(--glass-border)",
              paddingLeft: "1rem",
              marginLeft: "0.5rem",
            }}
          >
            <div
              role="status"
              aria-label={`Current Stress Level: ${session.stress} percent`}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-end",
              }}
            >
              <span
                style={{
                  fontSize: "0.65rem",
                  textTransform: "uppercase",
                  fontFamily: "var(--font-mono)",
                  fontWeight: "bold",
                  color:
                    session.stress >= 75
                      ? "var(--bui-fg-danger)"
                      : "var(--color-pencil-light)",
                }}
              >
                Stress
              </span>
              <div
                style={{
                  width: "80px",
                  height: "6px",
                  background: "rgba(0,0,0,0.5)",
                  borderRadius: "3px",
                  overflow: "hidden",
                  border: "1px solid var(--glass-border)",
                  marginTop: "2px",
                }}
              >
                <div
                  style={{
                    width: `${session.stress}%`,
                    height: "100%",
                    background:
                      session.stress >= 75
                        ? "var(--bui-fg-danger)"
                        : session.stress >= 50
                          ? "var(--bui-fg-warning)"
                          : "var(--bui-fg-success)",
                    transition: "width 0.3s ease, background 0.3s ease",
                  }}
                />
              </div>
            </div>
            <div
              role="status"
              aria-label={`Current Score: ${session.score} points`}
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "1rem",
                fontWeight: "bold",
                color: "var(--bui-fg-success)",
              }}
            >
              {session.score}
            </div>
          </div>
        )}
      </nav>

      {/* Settings Modal */}
      {showSettings && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
        >
          <button
            type="button"
            aria-label="Close settings overlay"
            onClick={() => setShowSettings(false)}
            className="settings-backdrop"
            style={{
              position: "absolute",
              inset: 0,
              background: "rgba(0,0,0,0.5)",
              backdropFilter: "blur(5px)",
              border: "none",
              padding: 0,
              cursor: "pointer",
            }}
          />
          <dialog
            open
            style={{
              position: "relative",
              zIndex: 1,
              background: "transparent",
              border: "none",
              padding: 0,
              margin: 0,
              display: "block",
            }}
          >
            <SettingsPanel onClose={() => setShowSettings(false)} />
          </dialog>
        </div>
      )}
    </>
  );
}
