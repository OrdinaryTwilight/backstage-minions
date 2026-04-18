import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import MasterControl from "../shared/panels/MasterControl";

describe("MasterControl", () => {
  afterEach(() => {
    cleanup();
  });

  it("calls onGo when clicked and not disabled", () => {
    const mockGo = vi.fn();
    render(<MasterControl onGo={mockGo} disabled={false} />);

    const btn = screen.getByRole("button", { name: "Execute cue" });
    expect(screen.getByText("[ READY TO FIRE ]")).toBeDefined();

    fireEvent.click(btn);
    expect(mockGo).toHaveBeenCalledTimes(1);
  });

  it("does not call onGo and shows waiting status when disabled", () => {
    const mockGo = vi.fn();
    render(<MasterControl onGo={mockGo} disabled={true} />);

    const btn = screen.getByRole("button", { name: "Execute cue" });
    expect(screen.getByText("[ WAITING FOR STANDBY ]")).toBeDefined();

    fireEvent.click(btn);
    expect(mockGo).not.toHaveBeenCalled();
    expect(btn).toHaveProperty("disabled", true);
  });
});
