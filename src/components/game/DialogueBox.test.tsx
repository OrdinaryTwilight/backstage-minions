import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import DialogueBox from "./DialogueBox";

describe("DialogueBox", () => {
  it("renders dialogue text and choices", () => {
    const mockOnChoice = vi.fn();
    const choices = [
      { id: "1", text: "Yes" },
      { id: "2", text: "No" },
    ];

    render(
      <DialogueBox
        speaker="Director"
        text="Are you ready?"
        choices={choices}
        onChoice={mockOnChoice}
      />,
    );

    expect(screen.getByText("DIRECTOR")).toBeDefined();
    expect(screen.getByText("Are you ready?")).toBeDefined();

    const yesButton = screen.getByText("Yes");
    fireEvent.click(yesButton);

    expect(mockOnChoice).toHaveBeenCalledWith(choices[0]);
  });
});
