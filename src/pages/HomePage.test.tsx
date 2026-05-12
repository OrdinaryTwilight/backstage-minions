/**
 * @file HomePage Tests
 * @description Unit tests for the HomePage component.
 * Tests heading rendering, career stats display, navigation, and session resume.
 */

import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { GameContext } from "../context/GameContext";
import { useSaveManager } from "../hooks/useSaveManager";
import { GameState } from "../types/game";

// Mock navigation
const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return { ...actual, useNavigate: () => mockNavigate };
});

// Mock narrative data so boot-sequence length is deterministic
vi.mock("../data/narrative", () => ({
  NARRATIVE: { bootSequence: ["Initializing...", "Ready."] },
}));

// Mock useSaveManager to avoid file-system side-effects
vi.mock("../hooks/useSaveManager", () => ({
  useSaveManager: vi.fn(() => ({
    fileInputRef: { current: null },
    ioFeedback: null,
    handleExportSave: vi.fn(),
    handleImportSave: vi.fn(),
  })),
}));

/** Minimal GameState that satisfies the TypeScript interface */
const blankState: GameState = {
  session: null,
  progress: {},
  unlockedStories: [],
  contacts: [],
  unreadContacts: [],
  chatHistory: {},
  hasSeenIntro: false,
};

function renderHome(stateOverrides: Partial<GameState> = {}) {
  const state = { ...blankState, ...stateOverrides };
  return render(
    <MemoryRouter>
      <GameContext.Provider value={{ state, dispatch: vi.fn() }}>
        <HomePage />
      </GameContext.Provider>
    </MemoryRouter>,
  );
}

// HomePage must be imported AFTER the mocks are declared so vi.mock hoisting works correctly
import HomePage from "./HomePage";

describe("HomePage", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    mockNavigate.mockClear();
  });

  afterEach(() => {
    vi.useRealTimers();
    cleanup();
  });

  it("renders the main heading", () => {
    renderHome();
    // The heading content is split over two lines via a <br/> but all text is in the h1
    expect(screen.getByRole("heading", { level: 1 })).toBeDefined();
  });

  it("shows 'Start Shift' button when there is no active session", () => {
    renderHome({ session: null });
    expect(screen.getByText("Start Shift")).toBeDefined();
  });

  it("shows 'Resume Shift' button when there is an active session", () => {
    renderHome({
      session: {
        productionId: "prod_phantom",
        difficulty: "school",
        characterId: "char_1",
        stages: ["equipment", "wrapup"],
        currentStageIndex: 0,
        gearId: null,
        score: 0,
        lives: 4,
        cuesHit: 0,
        cuesMissed: 0,
        plotLights: [],
        conflictsSeen: [],
        activeConflict: null,
        activeQuests: [],
        completedQuests: [],
        inventory: [],
        stress: 0,
        affinities: {},
      },
    });
    expect(screen.getByText("Resume Shift")).toBeDefined();
  });

  it("clicking 'Check Comms' navigates to /networks", () => {
    renderHome();
    fireEvent.click(screen.getByText("Check Comms"));
    expect(mockNavigate).toHaveBeenCalledWith("/networks");
  });

  it("shows 'Load Game' button", () => {
    renderHome();
    expect(screen.getByText("Load Game")).toBeDefined();
  });

  it("shows Career Stats section only when progress exists", () => {
    // No progress → no stats section
    renderHome({ progress: {} });
    expect(screen.queryByText("Career Stats")).toBeNull();

    // With a completed show → stats section renders
    cleanup();
    renderHome({ progress: { prod_school: { stars: 2, completed: true } } });
    expect(screen.getByText("Career Stats")).toBeDefined();
    expect(screen.getByText("Shows Wrapped")).toBeDefined();
    expect(screen.getByText("Total Stars")).toBeDefined();
  });

  it("navigates to intro when hasSeenIntro is false and no session", () => {
    renderHome({ hasSeenIntro: false, session: null });
    fireEvent.click(screen.getByText("Start Shift"));
    expect(mockNavigate).toHaveBeenCalledWith("/intro");
  });

  it("navigates to /productions when hasSeenIntro is true and no session", () => {
    renderHome({ hasSeenIntro: true, session: null });
    fireEvent.click(screen.getByText("Start Shift"));
    expect(mockNavigate).toHaveBeenCalledWith("/productions");
  });

  it("shows Crew Commendations section when a 3-star show exists", () => {
    renderHome({
      progress: { phantom_school: { stars: 3, completed: true } },
    });
    expect(screen.getByText("Crew Commendations")).toBeDefined();
  });

  it("does not show Crew Commendations when no 3-star shows exist", () => {
    renderHome({
      progress: { phantom_school: { stars: 2, completed: true } },
    });
    expect(screen.queryByText("Crew Commendations")).toBeNull();
  });

  it("shows unread indicator when there are unread contacts", () => {
    renderHome({ unreadContacts: ["char_1"] });
    // The pulse indicator should be in the DOM somewhere
    const pingElements = document.querySelectorAll(".animate-ping");
    expect(pingElements.length).toBeGreaterThan(0);
  });

  it("shows upload feedback message when ioFeedback is set", () => {
    vi.mocked(useSaveManager).mockReturnValueOnce({
      fileInputRef: { current: null },
      ioFeedback: { type: "success", msg: "Save loaded!" },
      handleExportSave: vi.fn(),
      handleImportSave: vi.fn(),
    });
    renderHome();
    expect(screen.getByText("Save loaded!")).toBeDefined();
  });
});
