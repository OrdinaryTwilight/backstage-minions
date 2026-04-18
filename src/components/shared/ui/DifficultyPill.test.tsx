import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import DifficultyPill from "./DifficultyPill";

describe("DifficultyPill", () => {
  afterEach(() => {
    cleanup();
  });
  it("renders correctly when unlocked with given stars", () => {
    const { container } = render(
      <DifficultyPill label="School" stars={2} unlocked={true} />,
    );
    expect(screen.getByText("School")).toBeDefined();

    // Unlocked means no lock icon
    expect(screen.queryByText("🔒")).toBeNull();

    // Check opacity style applied for the unlocked state
    const div = container.firstChild as HTMLElement;
    expect(div.style.opacity).toBe("1");
  });

  it("renders locked state correctly", () => {
    const { container } = render(
      <DifficultyPill label="Pro" stars={0} unlocked={false} />,
    );
    expect(screen.getByText("Pro")).toBeDefined();
    expect(screen.getByText("🔒")).toBeDefined();

    // Check locked style applied
    const div = container.firstChild as HTMLElement;
    expect(div.style.opacity).toBe("0.4");
  });
});
