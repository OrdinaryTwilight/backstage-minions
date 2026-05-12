import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useGame } from "../../context/GameContext";
import { useVisualSettings } from "../../context/VisualSettingsContext";
import { useSaveManager } from "../../hooks/useSaveManager";
import SettingsPanel from "./SettingsPanel";

// Mock the VisualSettingsContext
vi.mock("../../context/VisualSettingsContext", () => ({
  useVisualSettings: vi.fn(() => ({
    settings: {
      fontSize: "medium",
      contrastMode: "normal",
      colorBlindMode: "none",
      motionPreference: "full",
      fontFamily: "system",
      theme: "dark",
    },
    updateSetting: vi.fn(),
    resetToDefaults: vi.fn(),
  })),
}));

// Mock the GameContext so components using useGame() don't throw
vi.mock("../../context/GameContext", () => ({
  useGame: vi.fn(() => ({
    state: {
      session: null,
      progress: {},
      unlockedStories: [],
      contacts: [],
      unreadContacts: [],
      chatHistory: {},
      hasSeenIntro: false,
    },
    dispatch: vi.fn(),
  })),
}));

// Mock useSaveManager to avoid file-system side-effects in unit tests
vi.mock("../../hooks/useSaveManager", () => ({
  useSaveManager: vi.fn(() => ({
    fileInputRef: { current: null },
    ioFeedback: null,
    handleExportSave: vi.fn(),
    handleImportSave: vi.fn(),
  })),
}));

describe("SettingsPanel Component", () => {
  afterEach(() => {
    vi.useRealTimers();
    cleanup();
  });
  const mockOnClose = vi.fn();

  it("renders settings panel", async () => {
    render(<SettingsPanel onClose={mockOnClose} />);

    // Query the dialog element by its role "dialog"
    const panel = await screen.findByRole("dialog");

    // Check if the dialog element exists
    expect(panel).toBeDefined(); // Ensure the dialog element exists
  });

  it("renders with 'open' dialog visibility", async () => {
    render(<SettingsPanel onClose={mockOnClose} />);

    // Use findByRole to query the dialog element
    const panel = await screen.findByRole("dialog");

    // Check if the dialog is visible (i.e., it's not display: none)
    const panelStyle = globalThis.getComputedStyle(panel);
    expect(panelStyle.display).not.toBe("none"); // Ensure the dialog is visible
  });

  it("renders without error when onClose is undefined", async () => {
    render(<SettingsPanel />);

    // Use findByRole to check if the dialog is rendered
    const panel = await screen.findByRole("dialog");
    expect(panel).toBeDefined(); // Ensure the dialog element exists
  });

  it("renders only one dialog within SettingsPanel", async () => {
    render(<SettingsPanel onClose={mockOnClose} />);

    // Query all dialogs and ensure that only one dialog element exists
    const dialogs = screen.getAllByRole("dialog");

    // Filter out dialogs that are not from the `SettingsPanel`
    const settingsPanelDialogs = dialogs.filter((dialog) =>
      dialog.classList.contains("surface-panel"),
    );

    // Check if there is exactly one dialog with class `surface-panel`
    expect(settingsPanelDialogs.length).toBe(1); // Ensure only one dialog exists
  });

  it("calls onClose when the close button is clicked", async () => {
    render(<SettingsPanel onClose={mockOnClose} />);

    // The close button has aria-label="Close settings"
    const closeButton = screen.getByRole("button", { name: /close settings/i });

    closeButton.click();

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it("renders the correct number of select elements for settings", async () => {
    render(<SettingsPanel onClose={mockOnClose} />);

    // Find all select elements within the settings panel
    const selectElements = screen.getAllByRole("combobox");

    // Ensure there are 6 select elements in total (Color Theme, Contrast Mode, etc.)
    expect(selectElements.length).toBe(6); // Ensure 6 select elements
  });

  it("checks that the Reset Visuals to Defaults button is visible", async () => {
    render(<SettingsPanel onClose={mockOnClose} />);

    // The button text is '🔄 Reset Visuals to Defaults'
    const resetButton = screen.getByRole("button", {
      name: /reset visuals to defaults/i,
    });

    expect(resetButton).toBeDefined();
  });

  it("checks the dialog element has the correct title", async () => {
    render(<SettingsPanel onClose={mockOnClose} />);

    // Find the dialog title
    const title = await screen.findByRole("heading", { name: /⚙️ Settings/i });

    // Ensure the title exists and is correct
    expect(title).toBeDefined();
    expect(title.textContent).toBe("⚙️ Settings");
  });
});

describe("SettingsPanel - extended interactions", () => {
  const mockUpdateSetting = vi.fn();
  const mockResetToDefaults = vi.fn();
  const mockDispatch = vi.fn();
  const mockOnClose = vi.fn();

  beforeEach(() => {
    mockUpdateSetting.mockClear();
    mockResetToDefaults.mockClear();
    mockDispatch.mockClear();
    mockOnClose.mockClear();
  });

  afterEach(() => {
    cleanup();
  });

  it("calls updateSetting when a select is changed", async () => {
    vi.mocked(useVisualSettings).mockReturnValue({
      settings: {
        fontSize: "medium",
        contrastMode: "normal",
        colorBlindMode: "none",
        motionPreference: "full",
        fontFamily: "system",
        theme: "dark",
      },
      updateSetting: mockUpdateSetting,
      resetToDefaults: mockResetToDefaults,
    });

    render(<SettingsPanel onClose={mockOnClose} />);
    const selects = screen.getAllByRole("combobox");
    // Change the first select (theme)
    fireEvent.change(selects[0], { target: { value: "light" } });
    expect(mockUpdateSetting).toHaveBeenCalledWith("theme", "light");
  });

  it("shows confirm/cancel reset buttons when Reset button is clicked", async () => {
    vi.mocked(useVisualSettings).mockReturnValue({
      settings: {
        fontSize: "medium",
        contrastMode: "normal",
        colorBlindMode: "none",
        motionPreference: "full",
        fontFamily: "system",
        theme: "dark",
      },
      updateSetting: mockUpdateSetting,
      resetToDefaults: mockResetToDefaults,
    });

    render(<SettingsPanel onClose={mockOnClose} />);
    const resetButton = screen.getByRole("button", {
      name: /reset visuals to defaults/i,
    });
    fireEvent.click(resetButton);
    expect(
      screen.getByRole("button", { name: /confirm reset/i }),
    ).toBeDefined();
    expect(screen.getByRole("button", { name: /cancel/i })).toBeDefined();
  });

  it("calls resetToDefaults and hides confirm when Confirm Reset is clicked", async () => {
    vi.mocked(useVisualSettings).mockReturnValue({
      settings: {
        fontSize: "medium",
        contrastMode: "normal",
        colorBlindMode: "none",
        motionPreference: "full",
        fontFamily: "system",
        theme: "dark",
      },
      updateSetting: mockUpdateSetting,
      resetToDefaults: mockResetToDefaults,
    });

    render(<SettingsPanel onClose={mockOnClose} />);
    fireEvent.click(
      screen.getByRole("button", { name: /reset visuals to defaults/i }),
    );
    fireEvent.click(screen.getByRole("button", { name: /confirm reset/i }));
    expect(mockResetToDefaults).toHaveBeenCalledTimes(1);
    // After confirm, the reset button should be visible again
    expect(
      screen.getByRole("button", { name: /reset visuals to defaults/i }),
    ).toBeDefined();
  });

  it("hides confirm buttons when Cancel is clicked", async () => {
    vi.mocked(useVisualSettings).mockReturnValue({
      settings: {
        fontSize: "medium",
        contrastMode: "normal",
        colorBlindMode: "none",
        motionPreference: "full",
        fontFamily: "system",
        theme: "dark",
      },
      updateSetting: mockUpdateSetting,
      resetToDefaults: mockResetToDefaults,
    });

    render(<SettingsPanel onClose={mockOnClose} />);
    fireEvent.click(
      screen.getByRole("button", { name: /reset visuals to defaults/i }),
    );
    fireEvent.click(screen.getByRole("button", { name: /cancel/i }));
    expect(screen.queryByRole("button", { name: /confirm reset/i })).toBeNull();
    expect(
      screen.getByRole("button", { name: /reset visuals to defaults/i }),
    ).toBeDefined();
  });

  it("closes panel when Escape key is pressed", () => {
    render(<SettingsPanel onClose={mockOnClose} />);
    fireEvent.keyDown(document, { key: "Escape" });
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it("shows success ioFeedback when provided", () => {
    vi.mocked(useSaveManager).mockReturnValue({
      fileInputRef: { current: null },
      ioFeedback: { type: "success", msg: "Save exported!" },
      handleExportSave: vi.fn(),
      handleImportSave: vi.fn(),
    });

    render(<SettingsPanel onClose={mockOnClose} />);
    expect(screen.getByText("Save exported!")).toBeDefined();
  });

  it("calls handleExportSave when Download Save button is clicked", () => {
    const mockExport = vi.fn();
    vi.mocked(useSaveManager).mockReturnValue({
      fileInputRef: { current: null },
      ioFeedback: null,
      handleExportSave: mockExport,
      handleImportSave: vi.fn(),
    });

    render(<SettingsPanel onClose={mockOnClose} />);
    fireEvent.click(screen.getByRole("button", { name: /download save/i }));
    expect(mockExport).toHaveBeenCalledTimes(1);
  });

  it("calls confirm and dispatches CLEAR_SESSION when erasing progress", () => {
    const mockConfirmTrue = vi
      .spyOn(globalThis, "confirm")
      .mockReturnValue(true);
    // location.reload isn't easily spyable in jsdom — just ignore the reload call

    vi.mocked(useGame).mockReturnValue({
      state: {
        session: null,
        progress: {},
        unlockedStories: [],
        contacts: [],
        unreadContacts: [],
        chatHistory: {},
        hasSeenIntro: false,
      },
      dispatch: mockDispatch,
    });

    try {
      render(<SettingsPanel onClose={mockOnClose} />);
      fireEvent.click(
        screen.getByRole("button", { name: /erase all progress/i }),
      );
    } catch {
      // location.reload() throws in jsdom — that's expected
    }

    expect(mockConfirmTrue).toHaveBeenCalled();
    expect(mockDispatch).toHaveBeenCalledWith({ type: "CLEAR_SESSION" });

    mockConfirmTrue.mockRestore();
  });

  it("does not dispatch CLEAR_SESSION when erase is cancelled", () => {
    const mockConfirmFalse = vi
      .spyOn(globalThis, "confirm")
      .mockReturnValue(false);

    vi.mocked(useGame).mockReturnValue({
      state: {
        session: null,
        progress: {},
        unlockedStories: [],
        contacts: [],
        unreadContacts: [],
        chatHistory: {},
        hasSeenIntro: false,
      },
      dispatch: mockDispatch,
    });

    render(<SettingsPanel onClose={mockOnClose} />);
    fireEvent.click(
      screen.getByRole("button", { name: /erase all progress/i }),
    );

    expect(mockConfirmFalse).toHaveBeenCalled();
    expect(mockDispatch).not.toHaveBeenCalledWith({ type: "CLEAR_SESSION" });

    mockConfirmFalse.mockRestore();
  });
});
