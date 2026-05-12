import { cleanup, fireEvent, render, screen } from "@testing-library/react";
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

  it("renders the title as an h1 element", () => {
    render(<SectionHeader title="My Heading" subtitle="" />);
    const h1 = screen.getByRole("heading", { level: 1 });
    expect(h1.textContent).toBe("My Heading");
  });

  it("does not render help button when helpText is omitted", () => {
    render(<SectionHeader title="No Help" subtitle="sub" />);
    expect(screen.queryByTitle(/technical manual/i)).toBeNull();
  });

  it("renders help toggle button when helpText is provided", () => {
    render(
      <SectionHeader title="With Help" subtitle="sub" helpText="Hint text" />,
    );
    const btn = screen.getByTitle(/technical manual/i);
    expect(btn).toBeDefined();
  });

  it("toggles help panel when help button is clicked", () => {
    render(
      <SectionHeader
        title="Toggleable"
        subtitle="sub"
        helpText="Here is the help text."
      />,
    );
    const btn = screen.getByTitle(/technical manual/i);

    // Initially help is hidden
    expect(screen.queryByText("Here is the help text.")).toBeNull();

    // Click to show
    fireEvent.click(btn);
    expect(screen.getByText("Here is the help text.")).toBeDefined();

    // Click again to hide
    fireEvent.click(btn);
    expect(screen.queryByText("Here is the help text.")).toBeNull();
  });
});
