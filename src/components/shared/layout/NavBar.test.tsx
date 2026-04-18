import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { afterEach, describe, expect, it, vi } from "vitest";
import NavBar from "./NavBar";

// Mock SettingsPanel to avoid testing it here
vi.mock("./SettingsPanel", () => ({
  default: ({ onClose }: { onClose: () => void }) => (
    <div data-testid="settings-panel">
      <button onClick={onClose}>Close Settings</button>
    </div>
  ),
}));

const renderNavBar = () => {
  return render(
    <BrowserRouter>
      <NavBar />
    </BrowserRouter>,
  );
};

afterEach(() => {
  cleanup();
});

describe("NavBar Component", () => {
  it("renders all navigation tabs", () => {
    renderNavBar();

    expect(screen.getByLabelText(/home/i)).not.toBeNull();
    expect(screen.getByLabelText(/shows/i)).not.toBeNull();
    expect(screen.getByLabelText(/stories/i)).not.toBeNull();
  });

  it("renders settings button", () => {
    renderNavBar();

    expect(screen.getByLabelText(/open visual settings/i)).not.toBeNull();
  });

  it("renders navigation icons", () => {
    renderNavBar();

    const buttons = screen.getAllByRole("button");
    const icons = buttons.map((btn) => btn.textContent);

    expect(icons.some((text) => text?.includes("🏠"))).toBe(true);
    expect(icons.some((text) => text?.includes("🎭"))).toBe(true);
    expect(icons.some((text) => text?.includes("📚"))).toBe(true);
    expect(icons.some((text) => text?.includes("⚙️"))).toBe(true);
  });

  it("shows settings panel when settings button is clicked", () => {
    renderNavBar();

    const settingsButtons = screen.getAllByLabelText(/open visual settings/i);
    fireEvent.click(settingsButtons[0]);

    expect(screen.getByTestId("settings-panel")).not.toBeNull();
  });

  it("closes settings panel when backdrop is clicked", () => {
    renderNavBar();

    const settingsButtons = screen.getAllByLabelText(/open visual settings/i);
    fireEvent.click(settingsButtons[0]);

    expect(screen.getByTestId("settings-panel")).not.toBeNull();

    const backdrop = screen.getByLabelText(/close settings overlay/i);
    fireEvent.click(backdrop);

    // Settings panel should be removed
    expect(screen.queryByTestId("settings-panel")).toBeNull();
  });

  it("closes settings panel when Escape key is pressed", () => {
    renderNavBar();

    const settingsButtons = screen.getAllByLabelText(/open visual settings/i);
    fireEvent.click(settingsButtons[0]);

    expect(screen.getByTestId("settings-panel")).not.toBeNull();

    fireEvent.keyDown(window, { key: "Escape" });

    expect(screen.queryByTestId("settings-panel")).toBeNull();
  });

  it("closes settings panel when onClose callback is called", () => {
    renderNavBar();

    const settingsButtons = screen.getAllByLabelText(/open visual settings/i);
    fireEvent.click(settingsButtons[0]);

    expect(screen.getByTestId("settings-panel")).not.toBeNull();

    const closeButtons = screen.getAllByRole("button", {
      name: /close settings/i,
    });
    fireEvent.click(closeButtons[0]);

    expect(screen.queryByTestId("settings-panel")).toBeNull();
  });

  it("does not add keydown listener when settings are closed", () => {
    const addEventListenerSpy = vi.spyOn(globalThis, "addEventListener");
    const removeEventListenerSpy = vi.spyOn(globalThis, "removeEventListener");

    renderNavBar();

    // Settings are closed by default, so no listener should be added
    expect(
      addEventListenerSpy.mock.calls.some(
        (call) =>
          call[0] === "keydown" && call[1].toString().includes("Escape"),
      ),
    ).toBe(false);

    addEventListenerSpy.mockRestore();
    removeEventListenerSpy.mockRestore();
  });
});
