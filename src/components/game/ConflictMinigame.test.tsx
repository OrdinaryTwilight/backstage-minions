/**
 * @file ConflictMinigame Tests
 * @description Unit tests for the conflict resolution UI component.
 * Tests choice rendering, outcome dispatch, stress effects, and contact unlocking.
 */

import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { Conflict } from "../../types/game";
import ConflictMinigame from "./ConflictMinigame";

const mockDispatch = vi.fn();

vi.mock("../../context/GameContext", () => ({
  useGame: () => ({ dispatch: mockDispatch }),
}));

vi.mock("../../hooks/useAnnouncement", () => ({
  useAnnouncement: () => ({
    announce: vi.fn(),
    AnnouncementRegion: () => null,
  }),
}));

// Stub out character data look-ups used for the speaker icon
vi.mock("../../data/characters", () => ({
  CHARACTERS: [],
  AVAILABLE_NPCS: [],
  NPC_ICONS: {},
  parseDialogueTags: (s: string) => s,
  resolveCharacterName: (id: string) => id,
}));

const mockConflict: Conflict = {
  id: "conflict_test",
  trigger: "planning",
  npc: "npc_test",
  description: "The director wants a word.",
  choices: [
    {
      id: "c1",
      text: "Apologize",
      outcome: "resolved",
      pointDelta: 20,
      aftermathText: "They nodded.",
    },
    {
      id: "c2",
      text: "Stand firm",
      outcome: "neutral",
      pointDelta: 0,
      aftermathText: "Awkward silence.",
    },
    {
      id: "c3",
      text: "Walk away",
      outcome: "escalated",
      pointDelta: -10,
      aftermathText: "Things got worse.",
    },
  ],
};

const mockConflictWithSideEffect: Conflict = {
  ...mockConflict,
  id: "conflict_ally",
  choices: [
    {
      id: "c_ally",
      text: "Support them",
      outcome: "resolved",
      pointDelta: 15,
      aftermathText: "They became your ally!",
      sideEffect: "ally_gained",
    },
  ],
};

describe("ConflictMinigame", () => {
  beforeEach(() => {
    mockDispatch.mockClear();
  });

  it("renders the conflict description", () => {
    render(<ConflictMinigame conflict={mockConflict} onResolved={vi.fn()} />);
    expect(screen.getByText(/The director wants a word/i)).toBeDefined();
  });

  it("renders all shuffled choices as buttons", () => {
    render(<ConflictMinigame conflict={mockConflict} onResolved={vi.fn()} />);
    // All 3 choices should appear somewhere on screen
    expect(screen.getByText(/Apologize/i)).toBeDefined();
    expect(screen.getByText(/Stand firm/i)).toBeDefined();
    expect(screen.getByText(/Walk away/i)).toBeDefined();
  });

  it("dispatches ADD_SCORE when a choice is made", () => {
    render(<ConflictMinigame conflict={mockConflict} onResolved={vi.fn()} />);
    fireEvent.click(screen.getByText(/Apologize/i));
    expect(mockDispatch).toHaveBeenCalledWith({ type: "ADD_SCORE", delta: 20 });
  });

  it("dispatches UPDATE_STRESS -15 for a 'resolved' outcome", () => {
    render(<ConflictMinigame conflict={mockConflict} onResolved={vi.fn()} />);
    fireEvent.click(screen.getByText(/Apologize/i));
    expect(mockDispatch).toHaveBeenCalledWith({
      type: "UPDATE_STRESS",
      delta: -15,
    });
  });

  it("dispatches UPDATE_STRESS +25 for an 'escalated' outcome", () => {
    render(<ConflictMinigame conflict={mockConflict} onResolved={vi.fn()} />);
    fireEvent.click(screen.getByText(/Walk away/i));
    expect(mockDispatch).toHaveBeenCalledWith({
      type: "UPDATE_STRESS",
      delta: 25,
    });
  });

  it("does NOT dispatch UPDATE_STRESS for a 'neutral' outcome", () => {
    render(<ConflictMinigame conflict={mockConflict} onResolved={vi.fn()} />);
    fireEvent.click(screen.getByText(/Stand firm/i));
    const stressCalls = mockDispatch.mock.calls.filter(
      ([a]) => a.type === "UPDATE_STRESS",
    );
    expect(stressCalls).toHaveLength(0);
  });

  it("dispatches ADD_CONTACT when sideEffect is 'ally_gained'", () => {
    render(
      <ConflictMinigame
        conflict={mockConflictWithSideEffect}
        onResolved={vi.fn()}
      />,
    );
    fireEvent.click(screen.getByText(/Support them/i));
    expect(mockDispatch).toHaveBeenCalledWith({
      type: "ADD_CONTACT",
      contactId: "npc_test",
    });
  });

  it("shows aftermath text and a Continue button after choice", () => {
    render(<ConflictMinigame conflict={mockConflict} onResolved={vi.fn()} />);
    fireEvent.click(screen.getByText(/Apologize/i));
    expect(screen.getByText(/They nodded/i)).toBeDefined();
    expect(screen.getByRole("button", { name: /Continue/i })).toBeDefined();
  });

  it("calls onResolved with the outcome when Continue is clicked", () => {
    const onResolved = vi.fn();
    render(
      <ConflictMinigame conflict={mockConflict} onResolved={onResolved} />,
    );
    fireEvent.click(screen.getByText(/Apologize/i));
    fireEvent.click(screen.getByRole("button", { name: /Continue/i }));
    expect(onResolved).toHaveBeenCalledWith("resolved");
  });
});
