// src/components/ui/StatBar.test.tsx
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import StatBar from "./StatBar";

describe("StatBar", () => {
  it("renders label and correct width based on percentage", () => {
    // 5 out of 10 should yield a 50% width
    const { container } = render(
      <StatBar label="Health" value={5} maxValue={10} />,
    );
    expect(screen.getByText("Health")).toBeDefined();

    // Check if the inner bar has 50% width
    const fillBar = container.querySelector('div[style*="width: 50%"]');
    expect(fillBar).not.toBeNull();
  });
});
