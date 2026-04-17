import { useState } from "react";
import { useVisualSettings } from "../../context/VisualSettingsContext";
import Button from "./Button";

interface SettingsPanelProps {
  onClose?: () => void;
}

export default function SettingsPanel({ onClose }: SettingsPanelProps) {
  const { settings, updateSetting, resetToDefaults } = useVisualSettings();
  const [showReset, setShowReset] = useState(false);

  return (
    <div
      className="surface-panel"
      style={{
        maxWidth: "600px",
        padding: "2rem",
        borderRadius: "8px",
        background: "rgba(0,0,0,0.9)",
        border: "2px solid var(--glass-border)",
      }}
      role="dialog"
      aria-labelledby="settings-title"
      aria-describedby="settings-description"
    >
      <h2
        id="settings-title"
        className="annotation-text"
        style={{ fontSize: "1.5rem", marginBottom: "0.5rem" }}
      >
        ⚙️ Visual Settings
      </h2>
      <p
        id="settings-description"
        style={{ opacity: 0.6, marginBottom: "1.5rem" }}
      >
        Customize your visual experience for better accessibility
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
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
            value={settings.fontSize}
            onChange={(e) =>
              updateSetting(
                "fontSize",
                e.target.value as "small" | "medium" | "large" | "extra-large"
              )
            }
            style={{
              width: "100%",
              padding: "0.5rem",
              background: "rgba(255,255,255,0.05)",
              border: "1px solid var(--glass-border)",
              color: "var(--color-pencil-light)",
              borderRadius: "4px",
              fontSize: "1rem",
              cursor: "pointer",
            }}
            aria-describedby="font-size-help"
          >
            <option value="small">Small (0.875x)</option>
            <option value="medium">Medium (1x)</option>
            <option value="large">Large (1.25x)</option>
            <option value="extra-large">Extra Large (1.5x)</option>
          </select>
          <p
            id="font-size-help"
            style={{ fontSize: "0.8rem", opacity: 0.5, marginTop: "0.25rem" }}
          >
            Scales all text globally across the interface
          </p>
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
            value={settings.contrastMode}
            onChange={(e) =>
              updateSetting("contrastMode", e.target.value as "normal" | "high")
            }
            style={{
              width: "100%",
              padding: "0.5rem",
              background: "rgba(255,255,255,0.05)",
              border: "1px solid var(--glass-border)",
              color: "var(--color-pencil-light)",
              borderRadius: "4px",
              fontSize: "1rem",
              cursor: "pointer",
            }}
            aria-describedby="contrast-help"
          >
            <option value="normal">Normal</option>
            <option value="high">High Contrast</option>
          </select>
          <p
            id="contrast-help"
            style={{ fontSize: "0.8rem", opacity: 0.5, marginTop: "0.25rem" }}
          >
            Increases color contrast for better readability
          </p>
        </div>

        {/* Color Blind Mode */}
        <div>
          <label
            htmlFor="color-blind-mode"
            className="annotation-text"
            style={{ display: "block", marginBottom: "0.5rem" }}
          >
            Color Blind Simulation
          </label>
          <select
            id="color-blind-mode"
            value={settings.colorBlindMode}
            onChange={(e) =>
              updateSetting(
                "colorBlindMode",
                e.target.value as
                  | "none"
                  | "protanopia"
                  | "deuteranopia"
                  | "tritanopia"
              )
            }
            style={{
              width: "100%",
              padding: "0.5rem",
              background: "rgba(255,255,255,0.05)",
              border: "1px solid var(--glass-border)",
              color: "var(--color-pencil-light)",
              borderRadius: "4px",
              fontSize: "1rem",
              cursor: "pointer",
            }}
            aria-describedby="color-blind-help"
          >
            <option value="none">None</option>
            <option value="protanopia">Protanopia (Red-Blind)</option>
            <option value="deuteranopia">Deuteranopia (Green-Blind)</option>
            <option value="tritanopia">Tritanopia (Blue-Blind)</option>
          </select>
          <p
            id="color-blind-help"
            style={{ fontSize: "0.8rem", opacity: 0.5, marginTop: "0.25rem" }}
          >
            Simulates color blindness for testing accessibility
          </p>
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
            value={settings.motionPreference}
            onChange={(e) =>
              updateSetting(
                "motionPreference",
                e.target.value as "reduced" | "full"
              )
            }
            style={{
              width: "100%",
              padding: "0.5rem",
              background: "rgba(255,255,255,0.05)",
              border: "1px solid var(--glass-border)",
              color: "var(--color-pencil-light)",
              borderRadius: "4px",
              fontSize: "1rem",
              cursor: "pointer",
            }}
            aria-describedby="motion-help"
          >
            <option value="full">Full Animations</option>
            <option value="reduced">Reduced Motion</option>
          </select>
          <p
            id="motion-help"
            style={{ fontSize: "0.8rem", opacity: 0.5, marginTop: "0.25rem" }}
          >
            Reduces animations for those sensitive to motion
          </p>
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
            value={settings.fontFamily}
            onChange={(e) =>
              updateSetting(
                "fontFamily",
                e.target.value as "system" | "serif" | "monospace"
              )
            }
            style={{
              width: "100%",
              padding: "0.5rem",
              background: "rgba(255,255,255,0.05)",
              border: "1px solid var(--glass-border)",
              color: "var(--color-pencil-light)",
              borderRadius: "4px",
              fontSize: "1rem",
              cursor: "pointer",
            }}
            aria-describedby="font-family-help"
          >
            <option value="system">System Default</option>
            <option value="serif">Serif</option>
            <option value="monospace">Monospace</option>
          </select>
          <p
            id="font-family-help"
            style={{ fontSize: "0.8rem", opacity: 0.5, marginTop: "0.25rem" }}
          >
            Changes the overall typeface used throughout the interface
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div
        style={{
          display: "flex",
          gap: "1rem",
          marginTop: "2rem",
          justifyContent: "space-between",
        }}
      >
        <div style={{ display: "flex", gap: "1rem" }}>
          {!showReset ? (
            <Button
              onClick={() => setShowReset(true)}
              style={{
                background: "rgba(255,165,0,0.2)",
                border: "1px solid var(--bui-fg-warning)",
              }}
              aria-label="Reset visual settings to defaults"
            >
              🔄 Reset to Defaults
            </Button>
          ) : (
            <>
              <Button
                onClick={() => {
                  resetToDefaults();
                  setShowReset(false);
                }}
                style={{
                  background: "rgba(239,68,68,0.2)",
                  border: "1px solid var(--bui-fg-danger)",
                }}
                aria-label="Confirm reset to defaults"
              >
                ✓ Confirm Reset
              </Button>
              <Button
                onClick={() => setShowReset(false)}
                style={{
                  background: "rgba(100,100,100,0.2)",
                }}
                aria-label="Cancel reset"
              >
                ✕ Cancel
              </Button>
            </>
          )}
        </div>
        {onClose && (
          <Button
            variant="accent"
            onClick={onClose}
            aria-label="Close settings panel"
          >
            Close
          </Button>
        )}
      </div>
    </div>
  );
}
