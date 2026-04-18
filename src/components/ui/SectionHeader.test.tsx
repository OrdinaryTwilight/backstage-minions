import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import SectionHeader from "./SectionHeader";

afterEach(() => {
  cleanup();
});

describe("SectionHeader", () => {
  it("renders title and subtitle correctly", () => {
    render(<SectionHeader title="Main Title" subtitle="Sub Title" />);
    expect(screen.getByText("Main Title")).toBeDefined();
    expect(screen.getByText("Sub Title")).toBeDefined();
  });

  it("does not render subtitle when empty", () => {
    render(<SectionHeader title="Just Title" subtitle="" />);

    expect(screen.getByText("Just Title")).toBeDefined();

    // no subtitle should exist at all
    const subtitle = screen.queryByText(
      (_, element) => element?.tagName.toLowerCase() === "p",
    );

    expect(subtitle).toBeNull();
  });
});
