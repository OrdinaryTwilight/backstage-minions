/**
 * @file Save Manager Hook
 * @description Handles secure import, export, and validation of game save files.
 *
 * Save Management System:
 * - **Export**: Serializes persistent game state (bypassing ephemeral session data) to a downloadable JSON file.
 * - **Import**: Reads user-uploaded JSON files and applies strict security gates before modifying state.
 * - **Security**: Enforces strict file size limits (1MB) and MIME type checks to prevent memory-exhaustion DoS attacks.
 * - **Validation**: Uses Zod schemas (`GameSaveSchema`) to sanitize payloads and prevent malicious property injections.
 * - **Migration**: Automatically processes legacy entity IDs (e.g., outdated character names) to ensure backwards compatibility.
 */

import { useRef, useState } from "react";
import { GameSaveSchema, migrateIds, useGame } from "../context/GameContext";

// Defines a strict maximum file size to prevent memory-exhaustion attacks during parsing.
const MAX_FILE_SIZE_BYTES = 1024 * 1024; // 1MB

/**
 * Custom hook to manage the extraction and restoration of persistent game data.
 * Safely bridges the application's global context with the user's local filesystem.
 *
 * @returns {Object} Save manager interface
 */
export function useSaveManager() {
  const { state, dispatch } = useGame();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [ioFeedback, setIoFeedback] = useState<{
    msg: string;
    type: "success" | "error";
  } | null>(null);

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
      setTimeout(() => setIoFeedback(null), 4000);
    } catch (err) {
      console.error("Save export failed:", err);
      setIoFeedback({ msg: "Failed to export save data.", type: "error" });
      setTimeout(() => setIoFeedback(null), 4000);
    }
  };

  const handleImportSave = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // --- SECURITY GATE 1: File Size Validation ---
    if (file.size > MAX_FILE_SIZE_BYTES) {
      setIoFeedback({
        msg: "File rejected: Size exceeds the 1MB limit.",
        type: "error",
      });
      setTimeout(() => setIoFeedback(null), 4000);
      e.target.value = "";
      return;
    }

    // --- SECURITY GATE 2: File Extension & MIME Type Validation ---
    const isJsonExtension = file.name.toLowerCase().endsWith(".json");
    const isJsonMime = file.type === "application/json";

    if (!isJsonExtension && !isJsonMime) {
      setIoFeedback({
        msg: "File rejected: Must be a valid .json file.",
        type: "error",
      });
      setTimeout(() => setIoFeedback(null), 4000);
      e.target.value = "";
      return;
    }

    try {
      const text = await file.text();
      const json = JSON.parse(text);

      // --- SECURITY GATE 3: Shape Recognition (The Fix!) ---
      // Verify the JSON object has at least ONE expected root key before letting Zod's .catch() auto-heal it.
      // This prevents players from uploading random JSON configs that get interpreted as a blank wipe.
      if (typeof json !== "object" || json === null) {
        throw new Error("Payload is not a JSON object");
      }

      const expectedKeys = [
        "progress",
        "unlockedStories",
        "contacts",
        "unreadContacts",
        "chatHistory",
      ];
      const containsValidData = expectedKeys.some((key) => key in json);

      if (!containsValidData) {
        setIoFeedback({
          msg: "File rejected: Not a recognized Backstage Minions save file.",
          type: "error",
        });
        setTimeout(() => setIoFeedback(null), 4000);
        e.target.value = "";
        return;
      }

      // --- SECURITY GATE 4: Schema Sanitization ---
      const validation = GameSaveSchema.safeParse(json);

      if (validation.success) {
        const loadedState = { ...validation.data };

        // Apply legacy ID migrations for backwards compatibility
        if (loadedState.contacts) {
          loadedState.contacts = migrateIds(loadedState.contacts);
        }
        if (loadedState.unreadContacts) {
          loadedState.unreadContacts = migrateIds(loadedState.unreadContacts);
        }

        dispatch({ type: "CLEAR_SESSION" });
        dispatch({ type: "LOAD_SAVE", payload: loadedState });

        setIoFeedback({
          msg: "Save loaded successfully! Game state restored.",
          type: "success",
        });
        setTimeout(() => setIoFeedback(null), 4000);
      } else {
        console.error("Save validation failed:", validation.error);
        setIoFeedback({
          msg: "Invalid or corrupted save file.",
          type: "error",
        });
        setTimeout(() => setIoFeedback(null), 4000);
      }
    } catch (error) {
      console.error("Save import failed:", error);
      setIoFeedback({ msg: "Failed to read save file format.", type: "error" });
      setTimeout(() => setIoFeedback(null), 4000);
    }

    e.target.value = "";
  };

  return {
    fileInputRef,
    ioFeedback,
    handleExportSave,
    handleImportSave,
  };
}
