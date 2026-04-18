import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import DialogueBox from "./DialogueBox";

interface TestChoice {
  id: string;
  text: string;
}

describe("DialogueBox", () => {
  const mockOnChoice = vi.fn();
  const testChoices: TestChoice[] = [
    { id: "1", text: "Yes" },
    { id: "2", text: "No" },
  ];

  it("renders with empty speaker name", () => {
    render(
      <DialogueBox
        speaker=""
        text="Hello"
        choices={testChoices}
        onChoice={mockOnChoice}
      />,
    );

    // Assert that the dialogue text is rendered
    expect(screen.getByText(/hello/i)).toBeDefined();
  });

  it("renders with empty dialogue text", () => {
    render(
      <DialogueBox
        speaker="Alice"
        text=""
        choices={testChoices}
        onChoice={mockOnChoice}
      />,
    );

    // Assert that the speaker's name is rendered
    expect(screen.getByText("ALICE")).toBeDefined();
    // Assert that fallback text appears if text is empty
    expect(screen.getByText("No dialogue")).toBeDefined();
  });

  it("renders with choices", () => {
    render(
      <DialogueBox
        speaker="Bob"
        text="What do you choose?"
        choices={testChoices}
        onChoice={mockOnChoice}
      />,
    );

    // Assert that buttons with choices are rendered
    const yesButtons = screen.getAllByRole("button", { name: "Yes" });
    expect(yesButtons.length).toBeGreaterThan(0); // Ensure at least one "Yes" button is rendered

    // Click the first "Yes" button
    fireEvent.click(yesButtons[0]);

    // Check that the mock function was called with the correct choice
    expect(mockOnChoice).toHaveBeenCalledWith(testChoices[0]);
  });

  it("renders with icon", () => {
    render(
      <DialogueBox
        speaker="Charlie"
        text="Hello with icon"
        icon="😊"
        choices={testChoices}
        onChoice={mockOnChoice}
      />,
    );

    // Assert that the dialogue text is rendered
    expect(screen.getByText(/hello with icon/i)).toBeDefined();
  });
});
