import { act, cleanup, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import CommsTerminal from "./CommsTerminal";

describe("CommsTerminal", () => {
  beforeEach(() => {
    vi.useFakeTimers(); // Intercept setInterval
  });

  afterEach(() => {
    vi.useRealTimers();
    cleanup();
  });

  it("renders the header initially", () => {
    render(<CommsTerminal />);
    expect(screen.getByText("[ COMMS_CHANNEL_01 ]")).toBeDefined();
  });

  it("adds messages over time", () => {
    render(<CommsTerminal />);

    // Fast forward 9 seconds to trigger the first interval (8000ms)
    act(() => {
      vi.advanceTimersByTime(9000);
    });

    // The component slices to the last 3 messages, so it should have at least 1 now
    const colons = screen.getAllByText(/:/);
    expect(colons.length).toBeGreaterThan(0);
  });
});
