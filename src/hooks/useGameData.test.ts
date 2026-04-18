import { renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { useGameData } from "./useGameData";

// Mock the external data so tests don't break if gameData changes
vi.mock("../data/productions", () => ({
  PRODUCTIONS: [{ id: "test-prod", title: "Test Play", cues: [] }],
}));
vi.mock("../data/characters", () => ({
  CHARACTERS: [
    { id: "test-char", name: "Test Minion", department: "lighting" },
  ],
}));

describe("useGameData Hook", () => {
  it("returns nulls if productionId or charId are invalid", () => {
    const { result } = renderHook(() => useGameData("invalid", "invalid"));
    expect(result.current.production).toBeUndefined();
    expect(result.current.char).toBeUndefined();
  });

  it("returns correct data when valid IDs are provided", () => {
    const { result } = renderHook(() => useGameData("test-prod", "test-char"));
    expect(result.current.production?.title).toBe("Test Play");
    expect(result.current.char?.name).toBe("Test Minion");
  });
});
