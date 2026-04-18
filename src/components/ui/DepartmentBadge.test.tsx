import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import DepartmentBadge from "./DepartmentBadge";

describe("DepartmentBadge", () => {
  afterEach(() => {
    cleanup();
  });
  it("renders the lighting emoji when department is lighting", () => {
    render(<DepartmentBadge department="lighting" />);
    expect(screen.getByText("🔦")).toBeDefined();
    expect(screen.getByText("lighting")).toBeDefined();
  });

  it("renders the sound emoji when department is not lighting", () => {
    render(<DepartmentBadge department="sound" />);
    expect(screen.getByText("🎧")).toBeDefined();
    expect(screen.getByText("sound")).toBeDefined();
  });
});
