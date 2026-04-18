import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { GameContext } from "../context/GameContext";
import { GameState } from "../types/game";
import HomePage from "./HomePage";

// 1. Mock the Router Navigation
const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// 2. Mock the narrative data so the sequence length is predictable
vi.mock("../data/narrative", () => ({
  NARRATIVE: {
    bootSequence: ["Initializing...", "Ready."],
  },
}));

describe("HomePage", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    mockNavigate.mockClear();
  });

  afterEach(() => {
    vi.useRealTimers();
    cleanup();
  });

  it("skips boot sequence for returning players", () => {
    // A returning player has progress saved
    const returningState: GameState = {
      session: null,
      progress: { p1_school: { stars: 3, completed: true } },
      unlockedStories: [],
      contacts: [],
      unreadContacts: [],
    };

    render(
      <MemoryRouter>
        <GameContext.Provider
          value={{ state: returningState, dispatch: vi.fn() }}
        >
          <HomePage />
        </GameContext.Provider>
      </MemoryRouter>,
    );

    // Should immediately show dashboard
    expect(screen.getByText("BACKSTAGE MINIONS")).toBeDefined();
    expect(screen.getByText("Active Contracts")).toBeDefined();
  });

  it("plays boot sequence for new players, handles skip button", () => {
    // New players have empty progress
    const newState: GameState = {
      session: null,
      progress: {},
      unlockedStories: [],
      contacts: [],
      unreadContacts: [],
    };

    render(
      <MemoryRouter>
        <GameContext.Provider value={{ state: newState, dispatch: vi.fn() }}>
          <HomePage />
        </GameContext.Provider>
      </MemoryRouter>,
    );

    // Should show the terminal skip button first
    const skipBtn = screen.getByText("[SKIP BOOT SEQUENCE]");
    expect(skipBtn).toBeDefined();

    // Clicking skip should immediately reveal dashboard
    fireEvent.click(skipBtn);
    expect(screen.getByText("BACKSTAGE MINIONS")).toBeDefined();
  });

  it("navigates to correct routes when dashboard panels are clicked", () => {
    const returningState: GameState = {
      session: null,
      progress: { a: { stars: 1, completed: true } },
      unlockedStories: [],
      contacts: [],
      unreadContacts: ["contact1"],
    };

    render(
      <MemoryRouter>
        <GameContext.Provider
          value={{ state: returningState, dispatch: vi.fn() }}
        >
          <HomePage />
        </GameContext.Provider>
      </MemoryRouter>,
    );

    // Unread contacts should show badge
    expect(screen.getByText("1 UNREAD")).toBeDefined();

    // Click Active Contracts
    fireEvent.click(screen.getByText("Active Contracts"));
    expect(mockNavigate).toHaveBeenCalledWith("/productions");

    // Click Comms Network
    fireEvent.click(screen.getByText("Comms Network"));
    expect(mockNavigate).toHaveBeenCalledWith("/networks");
  });
});
