import { cleanup, render, screen } from "@testing-library/react";
import { afterEach } from "node:test";
import { BrowserRouter } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";
import NetworksPage from "./NetworksPage";

// Mock dependencies
vi.mock("../context/GameContext", () => ({
  useGame: vi.fn(() => ({
    state: {
      networks: [],
      contacts: ["char_shane", "char_sam"],
      unreadContacts: ["char_shane"],
    },
    dispatch: vi.fn(),
  })),
}));

const renderWithRouter = (component: React.ReactNode) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe("NetworksPage Component", () => {
  afterEach(() => {
    cleanup();
  });

  it("renders networks page", () => {
    renderWithRouter(<NetworksPage />);

    const pageHeading = screen.getByRole("heading", { name: /network/i });
    expect(pageHeading).toBeTruthy(); // Check if the element is truthy (exists)
  });

  it("displays page title or heading", () => {
    renderWithRouter(<NetworksPage />);

    const headings = screen.queryAllByRole("heading");
    expect(headings).toHaveLength(3); // Ensure there is at least one heading
  });

  it("renders without crashing", () => {
    expect(() => {
      renderWithRouter(<NetworksPage />);
    }).not.toThrow();
  });
});
