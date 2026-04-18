import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";
import { GameContext } from "../context/GameContext";
import StoriesPage from "./StoriesPage";

vi.mock("../data/gameData", () => ({
  STORIES: [
    {
      id: "story-1",
      title: "The Ghost Light",
      content: "It was a dark and stormy night in the theater...",
      unlockedBy: { difficulty: "school", minStars: 1 },
    },
    {
      id: "story-2",
      title: "The Blown Lamp",
      content: "A 1000W lamp blew out during the quietest scene.",
      unlockedBy: { difficulty: "community", minStars: 3 },
    },
  ],
}));

describe("StoriesPage", () => {
  const renderStories = (unlockedStories: string[] = []) => {
    return render(
      <GameContext.Provider
        value={{ state: { unlockedStories } as any, dispatch: vi.fn() }}
      >
        <MemoryRouter>
          <StoriesPage />
        </MemoryRouter>
      </GameContext.Provider>,
    );
  };

  it("renders unlocked and locked stories correctly", () => {
    // Unlock only story-1
    renderStories(["story-1"]);

    // Unlocked section
    expect(screen.getByText("Available Records")).toBeDefined();
    expect(screen.getByText("The Ghost Light")).toBeDefined();

    // Use a more flexible matcher to find the content text (avoiding exact match issues)
    expect(
      screen.getByText(/It was a dark and stormy night in the theater.../i),
    ).toBeDefined();

    // Locked section
    expect(screen.getByText("Classified Data")).toBeDefined();
    expect(screen.getByText("🔒 The Blown Lamp")).toBeDefined();
    expect(screen.getByText("Clearance: community / 3★")).toBeDefined();
  });

  it("opens a story when an unlocked story card is clicked", () => {
    renderStories(["story-1"]);

    const storyCard = screen.getByText("The Ghost Light");
    fireEvent.click(storyCard);

    // Should transition to reading view
    expect(screen.getByText("← Return to Index")).toBeDefined();
    expect(screen.queryByText("Available Records")).toBeNull(); // Index title should be hidden
  });

  it("returns to the index when 'Return to Index' is clicked", () => {
    renderStories(["story-1"]);

    // Open story
    fireEvent.click(screen.getByText("The Ghost Light"));

    // Go back
    fireEvent.click(screen.getByText("← Return to Index"));

    // Should see index again
    expect(screen.getByText("Available Records")).toBeDefined();
  });

  it("allows keyboard navigation (Enter/Space) to open an unlocked story", () => {
    renderStories(["story-1"]);
    const storyCard = screen.getByRole("button", {
      name: /Read story: The Ghost Light/i,
    });

    // Trigger Enter key
    fireEvent.keyDown(storyCard, { key: "Enter", code: "Enter" });
    expect(screen.getByText("← Return to Index")).toBeDefined();
  });
});
