/**
 * @file GameContext Tests
 * @description Unit tests for game state management and persistence.
 * Tests state loading, save migration, session management.
 * Uses Vitest and React Testing Library.
 */

// src/context/GameContext.test.tsx
import { act, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { GameProvider, useGame } from "./GameContext";

function TestConsumer() {
  const { state } = useGame();
  return (
    <div data-testid="state-dump">
      {state.contacts.includes("char_shane") ? "Has Shane" : "No Shane"}
    </div>
  );
}

describe("GameContext", () => {
  let getItemSpy: ReturnType<typeof vi.spyOn>;
  let setItemSpy: ReturnType<typeof vi.spyOn>;

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
      contacts: ["char_shane"],
      unreadContacts: [],
    };
    getItemSpy.mockReturnValue(JSON.stringify(mockSave));

    render(
      <GameProvider>
        <TestConsumer />
      </GameProvider>,
    );

    expect(getItemSpy).toHaveBeenCalledWith("a3_backstage_save");
    expect(screen.getByTestId("state-dump").textContent).toBe("Has Shane");
  });

  it("saves state to localStorage (excluding session) when state changes", async () => {
    vi.useFakeTimers();

    render(
      <GameProvider>
        <TestConsumer />
      </GameProvider>,
    );

    // Advance past the 1 second debounce in GameProvider's save useEffect
    await act(async () => {
      vi.advanceTimersByTime(1100);
    });

    const savedCall = setItemSpy.mock.calls.find(
      (call) => call[0] === "a3_backstage_save",
    );
    expect(savedCall).toBeDefined();
    expect(savedCall?.[1]).toContain('"progress"');
    // Session should never be serialised to localStorage
    expect(savedCall?.[1]).not.toContain('"session"');

    vi.useRealTimers();
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
    // Default initial contacts do NOT include char_shane – the app should be stable
    expect(screen.getByTestId("state-dump").textContent).toBe("No Shane");
  });
});
