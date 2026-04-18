import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useQuests } from "./useQuests";

// Mock the Game Context dispatch
vi.mock("../../../context/GameContext", () => ({
  useGame: () => ({ dispatch: vi.fn() }),
}));

describe("useQuests Hook", () => {
  beforeEach(() => {
    sessionStorage.clear();
  });

  it("initializes with empty inventory and completed quests", () => {
    const { result } = renderHook(() => useQuests());
    expect(result.current.inventory).toEqual([]);
  });

  it("handles acquiring a quest item via handleQuestChoice", () => {
    const { result } = renderHook(() => useQuests());
    const mockClear = vi.fn();

    act(() => {
      // "take_tape" is a valid choiceId in your logic
      result.current.handleQuestChoice("take_tape", mockClear);
    });

    expect(result.current.inventory).toContain("Gaff Tape");
    expect(result.current.questFeedback?.isError).toBe(false);
    expect(mockClear).toHaveBeenCalledTimes(1);
  });

  it("returns null for checkQuestIntercept if conditions aren't met", () => {
    const { result } = renderHook(() => useQuests());
    // Checking a random zone with no active quests
    const intercept = result.current.checkQuestIntercept("randomZone");
    expect(intercept).toBeNull();
  });
});
