/**
 * @file Button Component Tests
 * @description Unit tests for reusable Button component.
 * Tests rendering, variants, disabled state, click handlers.
 * Uses Vitest and React Testing Library.
 */

import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import Button from "./Button";

describe("Button Component", () => {
  it("renders children correctly", () => {
    render(<Button>Click Me</Button>);

    const button = screen.getByRole("button", { name: /click me/i });

    expect(button).not.toBeNull();
  });

  it("is disabled when disabled prop is true", () => {
    const handleClick = vi.fn();

    render(
      <Button disabled onClick={handleClick}>
        Disabled
      </Button>,
    );

    const button = screen.getByRole("button", { name: /disabled/i });

    // no toBeDisabled → use native DOM property
    expect((button as HTMLButtonElement).disabled).toBe(true);

    fireEvent.click(button);

    expect(handleClick).toHaveBeenCalledTimes(0);
  });

  it("applies the correct variant styles", () => {
    render(<Button variant="danger">Danger Btn</Button>);

    const button = screen.getByRole("button", { name: /danger btn/i });

    // no toHaveStyle → use DOM style property
    expect(button.style.background).toBe("var(--bui-fg-danger)");
  });
});
