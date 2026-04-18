// src/pages/ProductionsPage.test.tsx
import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { GameContext } from "../context/GameContext";
import ProductionsPage from "./ProductionsPage";

const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

vi.mock("../data/gameData", () => ({
  PRODUCTIONS: [
    {
      id: "prod-1",
      title: "Test Production",
      poster: "🎭",
      description: "A test description.",
      learnMoreUrl: "https://example.com",
      levels: {
        school: { venueId: "high_school", unlocked: true },
        community: { venueId: "church", unlocked: false },
        professional: { venueId: "church", unlocked: false },
      },
    },
  ],
  VENUES: {
    high_school: {
      name: "Westview High Auditorium",
      description:
        "Dusty curtains and a flickering lighting board from 1998. It builds character.",
    },
    church: {
      name: "Grace Community Sanctuary",
      description:
        "State-of-the-art digital soundboards, but absolutely zero backstage space.",
    },
  },
}));

describe("ProductionsPage", () => {
  beforeEach(() => {
    mockNavigate.mockClear();
  });

  const renderWithRouter = (route = "/productions/prod-1", gameState = {}) => {
    return render(
      <GameContext.Provider
        value={{ state: gameState as any, dispatch: vi.fn() }}
      >
        <MemoryRouter initialEntries={[route]}>
          <Routes>
            <Route
              path="/productions/:productionId"
              element={<ProductionsPage />}
            />
          </Routes>
        </MemoryRouter>
      </GameContext.Provider>,
    );
  };

  it("renders a not found message if production doesn't exist", () => {
    renderWithRouter("/productions/invalid-id");
    expect(screen.getByText("Briefing not found.")).toBeDefined();
  });

  it("renders the playbill correctly", () => {
    renderWithRouter();

    // Test for title and description
    expect(screen.getByText(/Test Production/i)).toBeDefined();
    expect(screen.getByText(/A test description./i)).toBeDefined();

    // Check for venue name
    expect(screen.getByText(/Westview High Auditorium/i)).toBeDefined();
  });

  it("navigates back to archives when back button is clicked", () => {
    renderWithRouter();
    fireEvent.click(screen.getByText("‹ Back to Archives"));
    expect(mockNavigate).toHaveBeenCalledWith("/productions");
  });

  it("navigates to difficulty selection when an UNLOCKED act is clicked", () => {
    renderWithRouter();
    // School is unlocked by default in our mock
    const schoolBtn = screen.getByRole("button", { name: /ACT I: school/i });
    fireEvent.click(schoolBtn);
    expect(mockNavigate).toHaveBeenCalledWith(
      "/productions/prod-1/difficulty/school",
    );
  });

  it("does not navigate when a LOCKED act is clicked", () => {
    renderWithRouter();
    // Community is locked by default and has no prior progress
    const communityBtn = screen.getByRole("button", {
      name: /ACT II: community/i,
    }) as HTMLButtonElement; // Explicitly cast it to a button element

    // Ensure the button is disabled
    expect(communityBtn.disabled).toBe(true);

    fireEvent.click(communityBtn);

    // Ensure the navigate function was not called
    expect(mockNavigate).not.toHaveBeenCalled();

    // Check if the unlock message appears
    expect(
      screen.getByText(/Clear Act 1 \(school\) to unlock./i),
    ).toBeDefined();
  });

  it("unlocks community act if school act is completed in state", () => {
    // Provide progress showing school is completed
    renderWithRouter("/productions/prod-1", {
      progress: { "prod-1_school": { completed: true, stars: 3 } },
    });

    const communityBtn = screen.getByRole("button", {
      name: /ACT II: community/i,
    }) as HTMLButtonElement;

    // Ensure the button is enabled after progress
    expect(communityBtn.disabled).toBe(false);

    fireEvent.click(communityBtn);
    expect(mockNavigate).toHaveBeenCalledWith(
      "/productions/prod-1/difficulty/community",
    );
  });
});
