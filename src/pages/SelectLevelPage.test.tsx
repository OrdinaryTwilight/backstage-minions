// src/pages/SelectLevelPage.test.tsx
import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { GameContext } from "../context/GameContext";
import SelectLevelPage from "./SelectLevelPage";

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
      title: "Test Gig",
      poster: "🎟️",
      levels: {
        community: { venueId: "town_hall", unlocked: true },
        professional: { venueId: "grand_theater", unlocked: false },
      },
    },
  ],
}));

describe("SelectLevelPage", () => {
  beforeEach(() => {
    mockNavigate.mockClear();
  });

  const renderWithRouter = (
    route = "/productions/prod-1/difficulty",
    gameState = {},
  ) => {
    return render(
      <GameContext.Provider
        value={{ state: gameState as any, dispatch: vi.fn() }}
      >
        <MemoryRouter initialEntries={[route]}>
          <Routes>
            <Route
              path="/productions/:productionId/difficulty"
              element={<SelectLevelPage />}
            />
          </Routes>
        </MemoryRouter>
      </GameContext.Provider>,
    );
  };

  it("renders a not found message if production doesn't exist", () => {
    renderWithRouter("/productions/invalid-id/difficulty");
    expect(screen.getByText("Technical Briefing Not Found")).toBeDefined();
  });

  it("renders the contract tiers based on levels", () => {
    renderWithRouter();
    expect(screen.getByText("COMMUNITY CONTRACT")).toBeDefined();
    expect(screen.getByText("PROFESSIONAL CONTRACT")).toBeDefined();
    expect(screen.getByText("Venue: town hall")).toBeDefined();
  });

  it("navigates to character selection when clicking an UNLOCKED contract", () => {
    renderWithRouter();
    // In our mock, community is unlocked = true
    const communityPanel = screen.getByText("COMMUNITY CONTRACT");
    fireEvent.click(communityPanel);
    expect(mockNavigate).toHaveBeenCalledWith(
      "/productions/prod-1/difficulty/community/character",
    );
  });

  it("does not navigate when clicking a LOCKED contract", () => {
    renderWithRouter();
    // Professional is unlocked = false
    const professionalPanel = screen.getByText("PROFESSIONAL CONTRACT");
    fireEvent.click(professionalPanel);
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it("allows clicking a contract if it was completed in progress state", () => {
    // Provide progress showing professional is completed
    renderWithRouter("/productions/prod-1/difficulty", {
      progress: { "prod-1_professional": { completed: true, stars: 3 } },
    });

    const professionalPanel = screen.getByText("PROFESSIONAL CONTRACT");
    fireEvent.click(professionalPanel);
    expect(mockNavigate).toHaveBeenCalledWith(
      "/productions/prod-1/difficulty/professional/character",
    );
  });
});
