import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import HardwarePanel from "./HardwarePanel";

describe("HardwarePanel Component", () => {
  it("renders children correctly", () => {
    render(<HardwarePanel>Console Active</HardwarePanel>);
    expect(screen.getByText("Console Active")).toBeDefined();
  });

  it("renders as a div by default", () => {
    const { container } = render(<HardwarePanel>Test</HardwarePanel>);
    expect(container.querySelector("div.hardware-panel")).toBeDefined();
    expect(container.querySelector("button")).toBeNull();
  });

  it("renders as a button when variant is clickable", () => {
    const handleClick = vi.fn();
    render(
      <HardwarePanel variant="clickable" onClick={handleClick}>
        Click Me
      </HardwarePanel>,
    );

    const button = screen.getByRole("button", { name: "Click Me" });
    expect(button).toBeDefined();

    fireEvent.click(button);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
