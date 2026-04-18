// src/pages/SelectCharacterPage.test.tsx
import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { GameContext } from "../context/GameContext";
import SelectCharacterPage from "./SelectCharacterPage";

// Mock data to provide consistent test cases
vi.mock("../data/gameData", () => ({
  CHARACTERS: [
    {
      id: "char-1",
      name: "Ben",
      department: "Lighting",
      icon: "💡",
      bio: "Loves lights.",
      stats: { technical: 5, social: 3, stamina: 4 },
    },
    {
      id: "char-2",
      name: "Casey",
      department: "Sound",
      icon: "🎧",
      bio: "Loves sound.",
      stats: { technical: 4, social: 4, stamina: 5 },
    },
  ],
  CUE_SHEETS: {
    "prod-1": { Lighting: [], Sound: [] },
  },
}));

const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe("SelectCharacterPage", () => {
  const mockDispatch = vi.fn();

  const renderWithRouter = (
    initialRoute = "/productions/prod-1/difficulty/community/character",
  ) => {
    return render(
      <GameContext.Provider
        value={{ state: {} as any, dispatch: mockDispatch }}
      >
        <MemoryRouter initialEntries={[initialRoute]}>
          <Routes>
            <Route
              path="/productions/:productionId/difficulty/:difficulty/character"
              element={<SelectCharacterPage />}
            />
          </Routes>
        </MemoryRouter>
      </GameContext.Provider>,
    );
  };

  beforeEach(() => {
    mockNavigate.mockClear();
    mockDispatch.mockClear();
  });

  it("renders the first available character correctly", () => {
    renderWithRouter();
    expect(screen.getByText("Ben")).toBeDefined();
    expect(screen.getByText('"Loves lights."')).toBeDefined();
  });

  it("cycles through characters using carousel buttons", () => {
    renderWithRouter();

    // It should start with Ben
    expect(screen.getByText("Ben")).toBeDefined();

    // Click Next
    const nextBtn = screen.getByText("›");
    fireEvent.click(nextBtn);
    expect(screen.getByText("Casey")).toBeDefined();

    // Click Prev (Should loop back to Ben, since there are only 2)
    const prevBtn = screen.getByText("‹");
    fireEvent.click(prevBtn);
    expect(screen.getByText("Ben")).toBeDefined();
  });

  it("dispatches START_SESSION and navigates when Sign Contract is clicked", () => {
    renderWithRouter();

    const signButton = screen.getByText("Sign Contract & Initialise");
    fireEvent.click(signButton);

    expect(mockDispatch).toHaveBeenCalledWith({
      type: "START_SESSION",
      productionId: "prod-1",
      difficulty: "community",
      characterId: "char-1",
    });

    expect(mockNavigate).toHaveBeenCalledWith("/game/prod-1/community/char-1");
  });

  it("shows an error state if no production or character is found", () => {
    // Render with an invalid production ID
    renderWithRouter(
      "/productions/invalid-prod/difficulty/community/character",
    );
    expect(screen.getByText("No Personnel Found")).toBeDefined();
  });
});
