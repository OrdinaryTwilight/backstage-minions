import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import SettingsPanel from "./SettingsPanel";

const TABS = [
  { path: "/", icon: "🏠", label: "Home" },
  { path: "/productions", icon: "🎭", label: "Shows" },
  { path: "/stories", icon: "📖", label: "Stories" },
];

export default function NavBar() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [showSettings, setShowSettings] = useState(false);

  return (
    <>
      <nav className="nav-bar">
        {TABS.map((t) => (
          <button
            key={t.path}
            onClick={() => navigate(t.path)}
            className={`nav-item ${pathname === t.path ? "active" : ""}`}
            aria-label={t.label}
          >
            <span>{t.icon}</span>
            <span>{t.label}</span>
          </button>
        ))}
        <button
          className="nav-item"
          onClick={() => setShowSettings(true)}
          aria-label="Open visual settings"
          style={{ marginLeft: "auto" }}
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
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0,0,0,0.8)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
          onClick={() => setShowSettings(false)}
          role="presentation"
        >
          <div onClick={(e) => e.stopPropagation()}>
            <SettingsPanel onClose={() => setShowSettings(false)} />
          </div>
        </div>
      )}
    </>
  );
}
