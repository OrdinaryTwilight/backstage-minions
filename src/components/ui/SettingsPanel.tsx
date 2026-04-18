import { useState } from "react";
import { useVisualSettings } from "../../context/VisualSettingsContext";
import Button from "./Button";

interface SettingsPanelProps {
  onClose?: () => void;
}

export default function SettingsPanel({
  onClose,
}: Readonly<SettingsPanelProps>) {
  const { settings, updateSetting, resetToDefaults } = useVisualSettings();
  const [showReset, setShowReset] = useState(false);

  return (
    <dialog
      className="surface-panel animate-pop"
      style={{
        position: "fixed",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        zIndex: 9999, // Ensure it floats above the NavBar and Overworld
        margin: 0, // Remove default dialog margins
        // Rest of your existing styles...
        maxWidth: "600px",
        width: "90vw",
        maxHeight: "90vh",
        overflowY: "auto",
        padding: "2rem",
        borderRadius: "12px",
        background: "var(--color-blueprint-bg)",
        border: "2px solid var(--glass-border)",
        boxShadow: "0 20px 50px rgba(0,0,0,0.8)",
      }}
      open
      aria-labelledby="settings-title"
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "1rem",
        }}
      >
        <h2
          id="settings-title"
          className="annotation-text"
          style={{ fontSize: "1.8rem", margin: 0 }}
        >
          ⚙️ Settings
        </h2>
        {onClose && (
          <button
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              color: "var(--color-pencil-light)",
              fontSize: "1.5rem",
              cursor: "pointer",
            }}
          >
            ✕
          </button>
        )}
      </div>

      {/* --- NEW: LIVE PREVIEW BOX --- */}
      <div
        style={{
          padding: "1rem",
          background: "var(--color-surface-translucent)",
          border: "1px dashed var(--glass-border)",
          borderRadius: "8px",
          marginBottom: "2rem",
          display: "flex",
          flexDirection: "column",
          gap: "0.8rem",
        }}
      >
        <span
          className="annotation-text"
          style={{ fontSize: "0.9rem", opacity: 0.8 }}
        >
          Live Preview:
        </span>
        <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
          <div
            style={{
              flex: 1,
              textAlign: "center",
              padding: "0.5rem",
              background: "var(--bui-fg-success)",
              color: "#000",
              fontWeight: "bold",
              borderRadius: "4px",
            }}
          >
            Success
          </div>
          <div
            style={{
              flex: 1,
              textAlign: "center",
              padding: "0.5rem",
              background: "var(--bui-fg-warning)",
              color: "#000",
              fontWeight: "bold",
              borderRadius: "4px",
            }}
          >
            Warning
          </div>
          <div
            style={{
              flex: 1,
              textAlign: "center",
              padding: "0.5rem",
              background: "var(--bui-fg-danger)",
              color: "#000",
              fontWeight: "bold",
              borderRadius: "4px",
            }}
          >
            Danger
          </div>
          <div
            style={{
              flex: 1,
              textAlign: "center",
              padding: "0.5rem",
              background: "var(--bui-fg-info)",
              color: "#000",
              fontWeight: "bold",
              borderRadius: "4px",
            }}
          >
            Info
          </div>
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
        {/* --- NEW: THEME TOGGLE --- */}
        <div>
          <label
            htmlFor="theme-mode"
            className="annotation-text"
            style={{ display: "block", marginBottom: "0.5rem" }}
          >
            Color Theme
          </label>
          <select
            id="theme-mode"
            className="game-select"
            value={settings.theme}
            onChange={(e) =>
              updateSetting("theme", e.target.value as "dark" | "light")
            }
          >
            <option value="dark">Blueprint Dark (Default)</option>
            <option value="light">Paper Light</option>
          </select>
        </div>

        {/* Contrast Mode */}
        <div>
          <label
            htmlFor="contrast-mode"
            className="annotation-text"
            style={{ display: "block", marginBottom: "0.5rem" }}
          >
            Contrast Mode
          </label>
          <select
            id="contrast-mode"
            className="game-select"
            value={settings.contrastMode}
            onChange={(e) =>
              updateSetting("contrastMode", e.target.value as "normal" | "high")
            }
          >
            <option value="normal">Normal</option>
            <option value="high">High Contrast</option>
          </select>
        </div>

        {/* Color Blind Mode */}
        <div>
          <label
            htmlFor="color-blind-mode"
            className="annotation-text"
            style={{ display: "block", marginBottom: "0.5rem" }}
          >
            Color Blind Filter
          </label>
          <select
            id="color-blind-mode"
            className="game-select"
            value={settings.colorBlindMode}
            onChange={(e) =>
              updateSetting(
                "colorBlindMode",
                e.target.value as
                  | "none"
                  | "protanopia"
                  | "deuteranopia"
                  | "tritanopia",
              )
            }
          >
            <option value="none">None</option>
            <option value="protanopia">Protanopia (Red-Blind)</option>
            <option value="deuteranopia">Deuteranopia (Green-Blind)</option>
            <option value="tritanopia">Tritanopia (Blue-Blind)</option>
          </select>
        </div>

        {/* Font Size Setting */}
        <div>
          <label
            htmlFor="font-size"
            className="annotation-text"
            style={{ display: "block", marginBottom: "0.5rem" }}
          >
            Font Size
          </label>
          <select
            id="font-size"
            className="game-select"
            value={settings.fontSize}
            onChange={(e) =>
              updateSetting(
                "fontSize",
                e.target.value as "small" | "medium" | "large" | "extra-large",
              )
            }
          >
            <option value="small">Small (0.875x)</option>
            <option value="medium">Medium (1x)</option>
            <option value="large">Large (1.25x)</option>
            <option value="extra-large">Extra Large (1.5x)</option>
          </select>
        </div>

        {/* Font Family */}
        <div>
          <label
            htmlFor="font-family"
            className="annotation-text"
            style={{ display: "block", marginBottom: "0.5rem" }}
          >
            Font Family
          </label>
          <select
            id="font-family"
            className="game-select"
            value={settings.fontFamily}
            onChange={(e) =>
              updateSetting(
                "fontFamily",
                e.target.value as "system" | "serif" | "monospace",
              )
            }
          >
            <option value="system">System Default</option>
            <option value="serif">Serif (High Legibility)</option>
            <option value="monospace">Monospace (Terminal Style)</option>
          </select>
        </div>

        {/* Motion Preference */}
        <div>
          <label
            htmlFor="motion-preference"
            className="annotation-text"
            style={{ display: "block", marginBottom: "0.5rem" }}
          >
            Animation Preferences
          </label>
          <select
            id="motion-preference"
            className="game-select"
            value={settings.motionPreference}
            onChange={(e) =>
              updateSetting(
                "motionPreference",
                e.target.value as "reduced" | "full",
              )
            }
          >
            <option value="full">Full Animations</option>
            <option value="reduced">Reduced Motion</option>
          </select>
        </div>
      </div>

      {/* Action Buttons */}
      <div
        style={{
          display: "flex",
          marginTop: "2rem",
          borderTop: "1px solid var(--glass-border)",
          paddingTop: "1.5rem",
        }}
      >
        {showReset ? (
          <div style={{ display: "flex", gap: "1rem", width: "100%" }}>
            <Button
              onClick={() => {
                resetToDefaults();
                setShowReset(false);
              }}
              style={{
                background: "rgba(239,68,68,0.2)",
                border: "1px solid var(--bui-fg-danger)",
                flex: 1,
              }}
            >
              ✓ Confirm Reset
            </Button>
            <Button
              onClick={() => setShowReset(false)}
              style={{ background: "rgba(100,100,100,0.2)", flex: 1 }}
            >
              ✕ Cancel
            </Button>
          </div>
        ) : (
          <Button
            onClick={() => setShowReset(true)}
            style={{
              background: "rgba(255,165,0,0.2)",
              border: "1px solid var(--bui-fg-warning)",
              width: "100%",
            }}
          >
            🔄 Reset to Defaults
          </Button>
        )}
      </div>
    </dialog>
  );
}
