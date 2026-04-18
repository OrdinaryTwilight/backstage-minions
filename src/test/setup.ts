// src/test/setup.ts
import * as matchers from "@testing-library/jest-dom/matchers";
import { expect, vi } from "vitest";

expect.extend(matchers);

// Fix for environments where localStorage.clear might be missing or broken
if (
  typeof globalThis.window !== "undefined" &&
  (!globalThis.localStorage || typeof globalThis.localStorage.clear !== "function")
) {
  const mockStorage: Record<string, string> = {};
  Object.defineProperty(globalThis, "localStorage", {
    value: {
      getItem: vi.fn((key) => mockStorage[key] || null),
      setItem: vi.fn((key, value) => {
        mockStorage[key] = value.toString();
      }),
      clear: vi.fn(() => {
        Object.keys(mockStorage).forEach((key) => delete mockStorage[key]);
      }),
      removeItem: vi.fn((key) => {
        delete mockStorage[key];
      }),
      key: vi.fn((i) => Object.keys(mockStorage)[i] || null),
      length: 0,
    },
    configurable: true,
    writable: true,
  });
}
