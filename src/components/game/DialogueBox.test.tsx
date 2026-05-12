import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
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

  afterEach(() => {
    vi.useRealTimers();
  });

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

    // Speaker name is shown in uppercase
    expect(screen.getByText("ALICE")).toBeDefined();
    // Fallback text appears when dialogue is empty
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

    // Buttons use aria-label for accessible name (choice text without the decorative ▶ prefix)
    const yesButtons = screen.getAllByRole("button", { name: "Yes" });
    expect(yesButtons.length).toBeGreaterThan(0);

    fireEvent.click(yesButtons[0]);

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

  it("renders a timer bar when timeLimitMs is provided", () => {
    render(
      <DialogueBox
        speaker="Timer"
        text="Quick!"
        choices={testChoices}
        onChoice={mockOnChoice}
        timeLimitMs={2000}
      />,
    );
    // The timer element should be present
    expect(screen.getByRole("timer")).toBeDefined();
  });

  it("auto-selects last choice when timer expires", async () => {
    const onChoice = vi.fn();
    vi.useFakeTimers();
    render(
      <DialogueBox
        speaker="Auto"
        text="Time up"
        choices={testChoices}
        onChoice={onChoice}
        timeLimitMs={100}
      />,
    );
    await act(async () => {
      vi.advanceTimersByTime(200);
    });
    // The last choice (index 1, "No") should have been selected
    expect(onChoice).toHaveBeenCalledWith(testChoices[testChoices.length - 1]);
    vi.useRealTimers();
  });

  it("prevents double-selection if choice already selected before timer fires", async () => {
    const onChoice = vi.fn();
    vi.useFakeTimers();
    render(
      <DialogueBox
        speaker="Race"
        text="Choose fast"
        choices={testChoices}
        onChoice={onChoice}
        timeLimitMs={500}
      />,
    );
    // Click a choice before timer fires
    const yesBtn = screen.getAllByRole("button", { name: "Yes" })[0];
    fireEvent.click(yesBtn);
    expect(onChoice).toHaveBeenCalledTimes(1);

    // Advance timer past limit — should NOT call onChoice again
    await act(async () => {
      vi.advanceTimersByTime(600);
    });
    expect(onChoice).toHaveBeenCalledTimes(1);
    vi.useRealTimers();
  });
});
