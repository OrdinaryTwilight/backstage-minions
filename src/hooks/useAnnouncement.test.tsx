/**
 * @file useAnnouncement Hook Tests
 * @description Tests for the WCAG accessibility announcement hook.
 */

import { act, render, renderHook, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { useAnnouncement } from "./useAnnouncement";

/** Wrapper component that exposes the announce function via a container ref */
function makeTestHarness() {
  const api = {
    announce: (/* msg: string */) => {
      /* set by hook */
    },
  };

  function TestComponent() {
    const { announce, AnnouncementRegion } = useAnnouncement();
    // Stable assignment via closure � api.announce points to the hook's announce
    Object.assign(api, { announce });
    return <AnnouncementRegion />;
  }

  return { api, TestComponent };
}

describe("useAnnouncement", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it("returns an announce function and AnnouncementRegion component", () => {
    const { result } = renderHook(() => useAnnouncement());
    expect(typeof result.current.announce).toBe("function");
    expect(typeof result.current.AnnouncementRegion).toBe("function");
  });

  it("AnnouncementRegion renders a sr-only aria-live region", () => {
    const { result } = renderHook(() => useAnnouncement());
    const { AnnouncementRegion } = result.current;
    render(<AnnouncementRegion />);
    const element = document.querySelector("[aria-live='polite']");
    expect(element).not.toBeNull();
    expect(element?.getAttribute("aria-atomic")).toBe("true");
  });

  it("announce() eventually sets the region text", async () => {
    const { api, TestComponent } = makeTestHarness();
    render(<TestComponent />);
    act(() => {
      api.announce("Cue missed!");
    });
    await waitFor(
      () => {
        expect(
          document.querySelector("[aria-live='polite']")?.textContent,
        ).toBe("Cue missed!");
      },
      { timeout: 500 },
    );
  });

  it("announce() can be called multiple times", async () => {
    const { api, TestComponent } = makeTestHarness();
    render(<TestComponent />);
    act(() => {
      api.announce("First");
    });
    await waitFor(
      () => {
        expect(
          document.querySelector("[aria-live='polite']")?.textContent,
        ).toBe("First");
      },
      { timeout: 500 },
    );
    act(() => {
      api.announce("Second");
    });
    await waitFor(
      () => {
        expect(
          document.querySelector("[aria-live='polite']")?.textContent,
        ).toBe("Second");
      },
      { timeout: 500 },
    );
  });
});
