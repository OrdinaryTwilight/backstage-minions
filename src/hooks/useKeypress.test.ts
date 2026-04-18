import { act, renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { useKeyPress } from "./useKeyPress";

describe("useKeyPress", () => {
  it("should return true when target key is pressed and false when released", () => {
    const { result } = renderHook(() => useKeyPress(["a", "A"]));
    expect(result.current).toBe(false);

    act(() => {
      globalThis.dispatchEvent(new KeyboardEvent("keydown", { key: "a" }));
    });
    expect(result.current).toBe(true);

    act(() => {
      globalThis.dispatchEvent(new KeyboardEvent("keyup", { key: "a" }));
    });
    expect(result.current).toBe(false);
  });

  it("should handle multiple target keys (e.g., Space and Enter)", () => {
    const { result } = renderHook(() => useKeyPress(["Enter", " "]));

    act(() => {
      globalThis.dispatchEvent(new KeyboardEvent("keydown", { key: " " }));
    });
    expect(result.current).toBe(true);
  });

  it("should ignore non-target keys", () => {
    const { result } = renderHook(() => useKeyPress(["Enter"]));

    act(() => {
      globalThis.dispatchEvent(new KeyboardEvent("keydown", { key: "a" }));
    });
    expect(result.current).toBe(false); // Should still be false
  });
});
