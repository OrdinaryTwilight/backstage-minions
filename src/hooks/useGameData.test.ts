import { renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import {
  useCharacter,
  useCharacterForDepartment,
  useCueSheet,
  useGameData,
  useProduction,
  useProductionLevel,
} from "./useGameData";

// Mock the static game data imports
vi.mock("../data/gameData", () => ({
  PRODUCTIONS: [
    { id: "p1", title: "Hamlet", levels: { school: { unlocked: true } } },
  ],
  CHARACTERS: [
    { id: "c1", name: "Bob", department: "lighting" },
    { id: "c2", name: "Alice", department: "sound" },
  ],
  CUE_SHEETS: {
    p1: { lighting: [{ id: "lq1" }] },
  },
}));

describe("useGameData Hooks", () => {
  it("useProduction finds production case-insensitively", () => {
    const { result } = renderHook(() => useProduction("P1"));
    expect(result.current?.title).toBe("Hamlet");
  });

  it("useCharacter finds character case-insensitively", () => {
    const { result } = renderHook(() => useCharacter("C1"));
    expect(result.current?.name).toBe("Bob");
  });

  it("useCueSheet retrieves correct cues", () => {
    const { result } = renderHook(() => useCueSheet("p1", "lighting"));
    expect(result.current.length).toBe(1);
    expect(result.current[0].id).toBe("lq1");
  });

  it("useCueSheet returns empty array if not found", () => {
    const { result } = renderHook(() => useCueSheet("p1", "sound"));
    expect(result.current).toEqual([]);
  });

  it("useProductionLevel retrieves specific level data", () => {
    const { result } = renderHook(() => useProductionLevel("p1", "school"));
    expect(result.current?.unlocked).toBe(true);
  });

  it("useCharacterForDepartment filters correctly", () => {
    const { result } = renderHook(() => useCharacterForDepartment("sound"));
    expect(result.current.length).toBe(1);
    expect(result.current[0].name).toBe("Alice");
  });

  it("useGameData returns combined data", () => {
    const { result } = renderHook(() => useGameData("p1", "c1"));
    expect(result.current.production?.title).toBe("Hamlet");
    expect(result.current.char?.name).toBe("Bob");
    expect(result.current.departmentCues.length).toBe(1);
  });
});
