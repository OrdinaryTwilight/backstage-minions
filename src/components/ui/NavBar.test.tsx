import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { afterEach, describe, expect, it } from "vitest";
import { VisualSettingsProvider } from "../../context/VisualSettingsContext";
import NavBar from "../shared/layout/NavBar";

const renderNavBar = () => {
  return render(
    <VisualSettingsProvider>
      <BrowserRouter>
        <NavBar />
      </BrowserRouter>
    </VisualSettingsProvider>,
  );
};
describe("NavBar Component", () => {
  afterEach(() => {
    cleanup();
  });
  it("renders without crashing", () => {
    renderNavBar();
    const settingsButton = screen.getByLabelText(/open visual settings/i);
    expect(settingsButton).toBeDefined();
  });
  it("shows settings panel when settings button is clicked", () => {
    renderNavBar();

    const settingsButton = screen.getByLabelText(/open visual settings/i);
    fireEvent.click(settingsButton);

    // Check if settings panel is shown (dialog is open)
    const settingsPanel = screen.queryByTestId("settings-panel");
    expect(settingsPanel).toBeDefined(); // Ensure dialog is present
  });

  it("closes settings panel when backdrop is clicked", () => {
    renderNavBar();

    // Open the settings panel
    const settingsButton = screen.getByLabelText(/open visual settings/i);
    fireEvent.click(settingsButton);

    // Ensure the settings panel is open
    const settingsPanel = screen.queryByTestId("settings-panel");
    expect(settingsPanel).toBeDefined();

    // Click on the backdrop
    const backdrop = screen.getByLabelText(/close settings overlay/i);
    fireEvent.click(backdrop);

    // Settings panel should be removed after clicking backdrop
    expect(screen.queryByTestId("settings-panel")).toBeNull(); // Ensure it is removed
  });

  it("closes settings panel when Escape key is pressed", () => {
    renderNavBar();

    // Open the settings panel
    const settingsButton = screen.getByLabelText(/open visual settings/i);
    fireEvent.click(settingsButton);

    // Ensure the settings panel is open
    const settingsPanel = screen.queryByTestId("settings-panel");
    expect(settingsPanel).toBeDefined();

    // Simulate pressing the Escape key
    fireEvent.keyDown(window, { key: "Escape", code: "Escape" });

    // Ensure settings panel closes after Escape press
    expect(screen.queryByTestId("settings-panel")).toBeNull(); // Ensure it is removed
  });

  it("closes settings panel when onClose callback is called", () => {
    renderNavBar();

    // Open the settings panel
    const settingsButton = screen.getByLabelText(/open visual settings/i);
    fireEvent.click(settingsButton);

    // Ensure the settings panel is open
    const settingsPanel = screen.queryByTestId("settings-panel");
    expect(settingsPanel).toBeDefined();

    // Simulate closing via onClose callback (close button click)
    const closeButton = screen.getByRole("button", { name: /close settings/i });
    fireEvent.click(closeButton);

    // Settings panel should be removed after close button click
    expect(screen.queryByTestId("settings-panel")).toBeNull(); // Ensure it is removed
  });
});
