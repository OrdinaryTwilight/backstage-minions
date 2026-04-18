// src/pages/LevelFailedPage.test.tsx
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { afterEach, describe, expect, it, vi } from "vitest";
import { GameContext } from "../context/GameContext";
import { GameState } from "../types/game";
import LevelFailedPage from "./LevelFailedPage";

const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

const mockGameState: GameState = {
  session: null,
  progress: {},
  unlockedStories: [],
  contacts: [],
  unreadContacts: [],
};

afterEach(() => {
  cleanup();
});

describe("LevelFailedPage", () => {
  it("renders the failure message and handles returning to dashboard", () => {
    const mockDispatch = vi.fn();

    render(
      <MemoryRouter>
        <GameContext.Provider
          value={{ state: mockGameState, dispatch: mockDispatch }}
        >
          <LevelFailedPage />
        </GameContext.Provider>
      </MemoryRouter>,
    );

    // Adjust the test to match the actual rendered text
    expect(screen.getByText("💔 Show stopped")).toBeDefined();

    const returnBtn = screen.getByText(/Back to Home/i); // Fixed typo: "Return to Dashboard" -> "Back to Home"
    fireEvent.click(returnBtn);

    expect(mockDispatch).toHaveBeenCalledWith({ type: "CLEAR_SESSION" });
    expect(mockNavigate).toHaveBeenCalledWith("/");
  });
});
