/**
 * @file VisualSettingsContext Tests
 * @description Unit tests for the accessibility settings context.
 * Tests default settings, updates, persistence, and error boundaries.
 */

import { act, render, renderHook, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  useVisualSettings,
  VisualSettingsProvider,
} from "./VisualSettingsContext";

function wrapper({ children }: { children: React.ReactNode }) {
  return <VisualSettingsProvider>{children}</VisualSettingsProvider>;
}

describe("VisualSettingsContext", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
    // Reset DOM classes applied by applySettingsToDOM
    document.documentElement.classList.remove(
      "light-mode",
      "high-contrast-mode",
      "prefers-reduced-motion",
    );
    document.documentElement.style.removeProperty("filter");
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("throws when useVisualSettings is called outside provider", () => {
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    expect(() => renderHook(() => useVisualSettings())).toThrow(
      "useVisualSettings must be used within VisualSettingsProvider",
    );
    consoleSpy.mockRestore();
  });

  it("provides default settings on initial render", () => {
    const { result } = renderHook(() => useVisualSettings(), { wrapper });
    expect(result.current.settings.theme).toBe("dark");
    expect(result.current.settings.fontSize).toBe("medium");
    expect(result.current.settings.contrastMode).toBe("normal");
    expect(result.current.settings.colorBlindMode).toBe("none");
    expect(result.current.settings.motionPreference).toBe("full");
    expect(result.current.settings.fontFamily).toBe("system");
  });

  it("updateSetting changes a single setting", () => {
    const { result } = renderHook(() => useVisualSettings(), { wrapper });

    act(() => {
      result.current.updateSetting("theme", "light");
    });

    expect(result.current.settings.theme).toBe("light");
    // Other settings should remain unchanged
    expect(result.current.settings.fontSize).toBe("medium");
  });

  it("resetToDefaults restores all settings to defaults", () => {
    const { result } = renderHook(() => useVisualSettings(), { wrapper });

    act(() => {
      result.current.updateSetting("theme", "light");
      result.current.updateSetting("fontSize", "large");
      result.current.updateSetting("contrastMode", "high");
    });

    act(() => {
      result.current.resetToDefaults();
    });

    expect(result.current.settings.theme).toBe("dark");
    expect(result.current.settings.fontSize).toBe("medium");
    expect(result.current.settings.contrastMode).toBe("normal");
  });

  it("loads persisted settings from localStorage on mount", () => {
    localStorage.setItem(
      "a3_visual_settings",
      JSON.stringify({ theme: "light", fontSize: "large" }),
    );

    const { result } = renderHook(() => useVisualSettings(), { wrapper });

    // After mount, the saved theme and fontSize should be applied
    expect(result.current.settings.theme).toBe("light");
    expect(result.current.settings.fontSize).toBe("large");
  });

  it("silently handles corrupted localStorage data", () => {
    localStorage.setItem("a3_visual_settings", "not valid json{{{");
    const consoleSpy = vi.spyOn(console, "warn").mockImplementation(() => {});

    // Should not throw - corrupted data is ignored
    expect(() =>
      renderHook(() => useVisualSettings(), { wrapper }),
    ).not.toThrow();
    consoleSpy.mockRestore();
  });

  it("applies light-mode class to documentElement when theme is 'light'", () => {
    const { result } = renderHook(() => useVisualSettings(), { wrapper });

    act(() => {
      result.current.updateSetting("theme", "light");
    });

    expect(document.documentElement.classList.contains("light-mode")).toBe(
      true,
    );
  });

  it("removes light-mode class when theme is set back to 'dark'", () => {
    const { result } = renderHook(() => useVisualSettings(), { wrapper });

    act(() => {
      result.current.updateSetting("theme", "light");
    });
    act(() => {
      result.current.updateSetting("theme", "dark");
    });

    expect(document.documentElement.classList.contains("light-mode")).toBe(
      false,
    );
  });

  it("applies high-contrast-mode class when contrastMode is 'high'", () => {
    const { result } = renderHook(() => useVisualSettings(), { wrapper });

    act(() => {
      result.current.updateSetting("contrastMode", "high");
    });

    expect(
      document.documentElement.classList.contains("high-contrast-mode"),
    ).toBe(true);
  });

  it("applies prefers-reduced-motion class when motionPreference is 'reduced'", () => {
    const { result } = renderHook(() => useVisualSettings(), { wrapper });

    act(() => {
      result.current.updateSetting("motionPreference", "reduced");
    });

    expect(
      document.documentElement.classList.contains("prefers-reduced-motion"),
    ).toBe(true);
  });

  it("renders children inside the provider", () => {
    render(
      <VisualSettingsProvider>
        <div data-testid="child">Child content</div>
      </VisualSettingsProvider>,
    );
    expect(screen.getByTestId("child")).toBeDefined();
  });

  it("persists updated settings to localStorage", () => {
    const { result } = renderHook(() => useVisualSettings(), { wrapper });

    act(() => {
      result.current.updateSetting("fontSize", "extra-large");
    });

    const saved = JSON.parse(
      localStorage.getItem("a3_visual_settings") || "{}",
    );
    expect(saved.fontSize).toBe("extra-large");
  });
});
