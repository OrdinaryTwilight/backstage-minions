import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { Spinner } from "./Spinner";

describe("Spinner", () => {
  afterEach(() => {
    cleanup();
  });
  it("renders the hourglass emoji", () => {
    render(<Spinner />);
    expect(screen.getByText("⏳")).toBeDefined();
  });
});
