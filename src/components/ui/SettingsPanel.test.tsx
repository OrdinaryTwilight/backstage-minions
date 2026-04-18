import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import SettingsPanel from "./SettingsPanel";

// Mock the VisualSettingsContext
vi.mock("../../context/VisualSettingsContext", () => ({
  useVisualSettings: vi.fn(() => ({
    settings: {
      colorblindMode: false,
      animationSpeed: 1,
    },
    updateSetting: vi.fn(),
    resetToDefaults: vi.fn(),
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
    const panelStyle = window.getComputedStyle(panel);
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

    // Find the close button using the aria-label or name text
    const closeButton = screen.getByRole("button", { name: /✕/i });

    // Click the close button
    closeButton.click();

    // Ensure the onClose function was called once
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it("renders the correct number of select elements for settings", async () => {
    render(<SettingsPanel onClose={mockOnClose} />);

    // Find all select elements within the settings panel
    const selectElements = screen.getAllByRole("combobox");

    // Ensure there are 6 select elements in total (Color Theme, Contrast Mode, etc.)
    expect(selectElements.length).toBe(6); // Ensure 6 select elements
  });

  it("checks that the Reset to Defaults button is visible", async () => {
    render(<SettingsPanel onClose={mockOnClose} />);

    // Find the Reset to Defaults button
    const resetButton = screen.getByRole("button", {
      name: /🔄 Reset to Defaults/i,
    });

    // Ensure the button is rendered
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
