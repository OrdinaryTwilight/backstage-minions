// src/context/GameContext.test.tsx
import { render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { GameProvider, useGame } from "./GameContext";

function TestConsumer() {
  const { state } = useGame();
  return (
    <div data-testid="state-dump">
      {state.contacts.includes("char_ben") ? "Has Ben" : "No Ben"}
    </div>
  );
}

describe("GameContext", () => {
  let getItemSpy: any;
  let setItemSpy: any;

  beforeEach(() => {
    // Spy on the instance directly instead of Storage.prototype
    getItemSpy = vi.spyOn(globalThis.localStorage, "getItem");
    setItemSpy = vi.spyOn(globalThis.localStorage, "setItem");

    globalThis.localStorage.clear();
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("throws an error if useGame is used outside of GameProvider", () => {
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    expect(() => render(<TestConsumer />)).toThrow(
      "useGame must be used within a GameProvider",
    );
    consoleSpy.mockRestore();
  });

  it("loads saved state from localStorage on mount", () => {
    const mockSave = {
      progress: {},
      unlockedStories: [],
      contacts: ["char_ben"],
      unreadContacts: [],
    };
    getItemSpy.mockReturnValue(JSON.stringify(mockSave));

    render(
      <GameProvider>
        <TestConsumer />
      </GameProvider>,
    );

    expect(getItemSpy).toHaveBeenCalledWith("a3_backstage_save");
    expect(screen.getByTestId("state-dump").textContent).toBe("Has Ben");
  });

  it("saves state to localStorage (excluding session) when state changes", () => {
    render(
      <GameProvider>
        <TestConsumer />
      </GameProvider>,
    );

    expect(setItemSpy).toHaveBeenCalledWith(
      "a3_backstage_save",
      expect.stringContaining('"progress"'),
    );

    const savedString = setItemSpy.mock.calls[0][1];
    expect(savedString).not.toContain('"session"');
  });

  it("silently ignores corrupted localStorage data", () => {
    getItemSpy.mockReturnValue("{ corrupted json");
    expect(() =>
      render(
        <GameProvider>
          <TestConsumer />
        </GameProvider>,
      ),
    ).not.toThrow();
    // Default initial state contains "char_ben"
    expect(screen.getByTestId("state-dump").textContent).toBe("Has Ben");
  });
});
