import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
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

describe("LevelFailedPage", () => {
  beforeEach(() => {
    mockNavigate.mockClear();
  });

  afterEach(() => {
    cleanup();
  });

  it("dispatches CLEAR_SESSION and navigates to '/' when clicking Back to Home", () => {
    const mockDispatch = vi.fn();

    const mockState: GameState = {
      session: null,
      progress: {},
      unlockedStories: [],
      contacts: [],
      unreadContacts: [],
      chatHistory: {},
      hasSeenIntro: false,
    };
    render(
      <MemoryRouter>
        <GameContext.Provider
          value={{ state: mockState, dispatch: mockDispatch }}
        >
          <LevelFailedPage />
        </GameContext.Provider>
      </MemoryRouter>,
    );

    fireEvent.click(screen.getByText("Back to Home"));

    expect(mockDispatch).toHaveBeenCalledWith({ type: "CLEAR_SESSION" });
    expect(mockNavigate).toHaveBeenCalledWith("/");
  });

  it("renders buttons correctly", () => {
    render(
      <MemoryRouter>
        <GameContext.Provider
          value={{
            state: {
              session: null,
              progress: {},
              unlockedStories: [],
              contacts: [],
              unreadContacts: [],
              chatHistory: {},
              hasSeenIntro: false,
            },
            dispatch: vi.fn(),
          }}
        >
          <LevelFailedPage />
        </GameContext.Provider>
      </MemoryRouter>,
    );

    // This now works because of the data-testid added to the component
    const container = screen.getByTestId("level-failed-page-container");
    expect(container).toBeDefined();
    expect(screen.getByText("Try Again")).toBeDefined();
    expect(screen.getByText("Back to Home")).toBeDefined();
  });

  it("navigates to '/productions' when clicking Try Again", () => {
    render(
      <MemoryRouter>
        <GameContext.Provider
          value={{
            state: {
              session: null,
              progress: {},
              unlockedStories: [],
              contacts: [],
              unreadContacts: [],
              chatHistory: {},
              hasSeenIntro: false,
            },
            dispatch: vi.fn(),
          }}
        >
          <LevelFailedPage />
        </GameContext.Provider>
      </MemoryRouter>,
    );

    const tryAgainButton = screen.getByText("Try Again");
    fireEvent.click(tryAgainButton);

    expect(mockNavigate).toHaveBeenCalledWith("/productions");
  });

  it("navigates back to '/' when Back to Home is clicked without a session", () => {
    const mockDispatch2 = vi.fn();
    render(
      <MemoryRouter>
        <GameContext.Provider
          value={{
            state: {
              session: null,
              progress: {},
              unlockedStories: [],
              contacts: [],
              unreadContacts: [],
              chatHistory: {},
              hasSeenIntro: false,
            },
            dispatch: mockDispatch2,
          }}
        >
          <LevelFailedPage />
        </GameContext.Provider>
      </MemoryRouter>,
    );

    const allButtons = screen.getAllByRole("button");
    const backBtn = allButtons.find(
      (btn) => btn.textContent === "Back to Home",
    );
    expect(backBtn).toBeDefined();
    fireEvent.click(backBtn!);
    expect(mockDispatch2).toHaveBeenCalledWith({ type: "CLEAR_SESSION" });
    expect(mockNavigate).toHaveBeenCalledWith("/");
  });
});
