import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
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
  const [hasUnread, setHasUnread] = useState(false);

  // Escape key closes modal (proper global handler)
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

  // Listen for custom event to update unread messages badge
  useEffect(() => {
    const checkUnread = () =>
      setHasUnread(sessionStorage.getItem("unread_messages") === "true");
    checkUnread();
    globalThis.addEventListener("unread_messages_update", checkUnread);
    return () =>
      globalThis.removeEventListener("unread_messages_update", checkUnread);
  }, []);

  return (
    <>
      <nav className="nav-bar">
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
          {/* Backdrop (now a real button → fixes a11y warning) */}
          <button
            type="button"
            aria-label="Close settings overlay"
            onClick={() => setShowSettings(false)}
            className="settings-backdrop"
            style={{
              position: "absolute",
              inset: 0,
              background: "rgba(0,0,0,0.8)",
              border: "none",
              padding: 0,
              cursor: "pointer",
            }}
          />

          {/* Modal content */}
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
