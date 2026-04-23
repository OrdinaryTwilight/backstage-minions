/**
 * @file Settings Panel Component
 * @description Accessibility and user preferences modal dialog.
 * 
 * Settings Features:
 * - **Display**: Font size, contrast, color blind mode, theme
 * - **Motion**: Respect browser reduce-motion preferences
 * - **Fonts**: System or dyslexia-friendly font option
 * - **Save/Load**: Export/import game saves as JSON
 * - **Reset**: Clear all settings or game data
 * - **A11y**: Keyboard dismissal, semantic dialog element
 * 
 * Integrates with VisualSettingsContext for global accessibility settings.
 * Handles save/load via file I/O with user feedback.
 * 
 * @component
 */

import { useEffect, useRef, useState } from "react";
import { GameSaveSchema, migrateIds, useGame } from "../../context/GameContext";
import { useVisualSettings } from "../../context/VisualSettingsContext";
import Button from "./Button";

interface SettingsPanelProps {
  onClose?: () => void;
}

export default function SettingsPanel({
  onClose,
}: Readonly<SettingsPanelProps>) {
  const { state, dispatch } = useGame();
  const { settings, updateSetting, resetToDefaults } = useVisualSettings();
  const [showReset, setShowReset] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [ioFeedback, setIoFeedback] = useState<{
    msg: string;
    type: "success" | "error";
  } | null>(null);

  // --- Strict A11y Fix: Global Event Listeners ---
  useEffect(() => {
    const handleOutsideInteraction = (e: MouseEvent | TouchEvent) => {
      if (dialogRef.current && !dialogRef.current.contains(e.target as Node)) {
        onClose?.();
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose?.();
      }
    };

    if (onClose) {
      document.addEventListener("mousedown", handleOutsideInteraction);
      document.addEventListener("touchstart", handleOutsideInteraction);
      document.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.removeEventListener("mousedown", handleOutsideInteraction);
      document.removeEventListener("touchstart", handleOutsideInteraction);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  // --- Data Management Logic ---
  const handleErase = () => {
    const confirm = globalThis.confirm(
      "Are you absolutely sure? This will wipe all progress and contacts. This cannot be undone.",
    );
    if (confirm) {
      dispatch({ type: "CLEAR_SESSION" });
      localStorage.clear();
      sessionStorage.clear();
      globalThis.location.reload();
    }
  };

  const handleExportSave = () => {
    try {
      const { session, ...persistentData } = state;
      const jsonString = JSON.stringify(persistentData, null, 2);
      const blob = new Blob([jsonString], { type: "application/json" });
      const url = URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = `backstage-minions-save-${new Date().toISOString().split("T")[0]}.json`;
      a.click();

      URL.revokeObjectURL(url);
      setIoFeedback({
        msg: "Save file exported successfully!",
        type: "success",
      });
    } catch (err) {
      console.error("Save export failed:", err);
      setIoFeedback({ msg: "Failed to export save data.", type: "error" });
    }
  };

  const handleImportSave = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      const json = JSON.parse(text);
      const validation = GameSaveSchema.safeParse(json);

      if (validation.success) {
        const loadedState = { ...validation.data };

        if (loadedState.contacts)
          loadedState.contacts = migrateIds(loadedState.contacts);
        if (loadedState.unreadContacts)
          loadedState.unreadContacts = migrateIds(loadedState.unreadContacts);

        dispatch({ type: "CLEAR_SESSION" });
        dispatch({ type: "LOAD_SAVE", payload: loadedState });

        setIoFeedback({
          msg: "Save loaded successfully! Game state restored.",
          type: "success",
        });
      } else {
        console.error("Save validation failed:", validation.error);
        setIoFeedback({
          msg: "Invalid or corrupted save file.",
          type: "error",
        });
      }
    } catch (error) {
      console.error("Save import failed:", error);
      setIoFeedback({ msg: "Failed to read save file format.", type: "error" });
    }

    e.target.value = "";
  };

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        backdropFilter: "blur(4px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 99999,
      }}
    >
      <dialog
        ref={dialogRef}
        className="surface-panel animate-pop"
        open
        style={{
          position: "relative",
          margin: 0,
          display: "block",
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
              aria-label="Close settings"
            >
              ✕
            </button>
          )}
        </div>

        {/* Live Preview Box */}
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

        <div
          style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}
        >
          {/* Theme Toggle */}
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
              <option value="dark">Dark Mode (Default)</option>
              <option value="light">Light Mode</option>
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
                updateSetting(
                  "contrastMode",
                  e.target.value as "normal" | "high",
                )
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
                  e.target.value as
                    | "small"
                    | "medium"
                    | "large"
                    | "extra-large",
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
              Font
            </label>
            <select
              id="font-family"
              className="game-select"
              value={settings.fontFamily}
              onChange={(e) =>
                updateSetting(
                  "fontFamily",
                  e.target.value as "system" | "opendyslexic",
                )
              }
            >
              <option value="system">System Default</option>
              <option value="opendyslexic">OpenDyslexic</option>
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
              🔄 Reset Visuals to Defaults
            </Button>
          )}
        </div>

        <hr style={{ borderColor: "var(--glass-border)", margin: "2rem 0" }} />

        {/* DATA MANAGEMENT */}
        <div>
          <h3
            className="annotation-text"
            style={{ color: "var(--color-pencil-light)", marginBottom: "1rem" }}
          >
            Data Management
          </h3>

          <div aria-live="polite">
            {ioFeedback && (
              <div
                style={{
                  padding: "0.75rem",
                  marginBottom: "1rem",
                  borderRadius: "4px",
                  fontSize: "0.9rem",
                  fontWeight: "bold",
                  textAlign: "center",
                  background:
                    ioFeedback.type === "success"
                      ? "rgba(74, 222, 128, 0.2)"
                      : "rgba(248, 113, 113, 0.2)",
                  color:
                    ioFeedback.type === "success"
                      ? "var(--bui-fg-success)"
                      : "var(--bui-fg-danger)",
                  border: `1px solid ${ioFeedback.type === "success" ? "var(--bui-fg-success)" : "var(--bui-fg-danger)"}`,
                }}
              >
                {ioFeedback.msg}
              </div>
            )}
          </div>

          <div
            style={{
              display: "flex",
              gap: "1rem",
              marginBottom: "1rem",
              flexWrap: "wrap",
            }}
          >
            <Button
              variant="default"
              onClick={handleExportSave}
              style={{ flex: 1, padding: "0.5rem" }}
            >
              ↓ Download Save
            </Button>
            <Button
              variant="default"
              onClick={() => fileInputRef.current?.click()}
              style={{ flex: 1, padding: "0.5rem" }}
            >
              ↑ Upload Save
            </Button>

            <input
              type="file"
              accept=".json"
              ref={fileInputRef}
              style={{ display: "none" }}
              onChange={handleImportSave}
              tabIndex={-1}
            />
          </div>

          <Button
            variant="danger"
            onClick={handleErase}
            style={{ width: "100%" }}
          >
            Erase All Progress
          </Button>
        </div>
      </dialog>
    </div>
  );
}
