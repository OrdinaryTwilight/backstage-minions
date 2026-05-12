/**
 * @file ProductionsListPage Tests
 * @description Unit tests for the productions list/callboard page.
 * Tests search/filter, navigation, and production card rendering.
 */

import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return { ...actual, useNavigate: () => mockNavigate };
});

// Mock NavBar and SectionHeader to isolate the page logic
vi.mock("../components/ui/NavBar", () => ({
  default: () => <nav aria-label="Navigation" />,
}));

vi.mock("../components/ui/SectionHeader", () => ({
  default: ({ title }: { title: string }) => <h1>{title}</h1>,
}));

// Provide a predictable production list for testing
vi.mock("../data/gameData", () => ({
  PRODUCTIONS: [
    {
      id: "prod_phantom",
      title: "Phantom of the Opera",
      poster: "🎭",
      description: "A classic.",
      learnMoreUrl: "#",
      levels: { school: { unlocked: true }, community: { unlocked: false } },
    },
    {
      id: "prod_hamlet",
      title: "Hamlet",
      poster: "💀",
      description: "The Danish prince.",
      learnMoreUrl: "#",
      levels: { school: { unlocked: true } },
    },
  ],
}));

import ProductionsListPage from "./ProductionsListPage";

describe("ProductionsListPage", () => {
  beforeEach(() => {
    mockNavigate.mockClear();
  });

  afterEach(() => {
    cleanup();
  });

  it("renders the 'Active Productions' heading", () => {
    render(
      <MemoryRouter>
        <ProductionsListPage />
      </MemoryRouter>,
    );
    expect(screen.getByText("Active Productions")).toBeDefined();
  });

  it("renders all production cards", () => {
    render(
      <MemoryRouter>
        <ProductionsListPage />
      </MemoryRouter>,
    );
    expect(screen.getByText("Phantom of the Opera")).toBeDefined();
    expect(screen.getByText("Hamlet")).toBeDefined();
  });

  it("filters productions by search query", () => {
    render(
      <MemoryRouter>
        <ProductionsListPage />
      </MemoryRouter>,
    );

    const input = screen.getByPlaceholderText(/search/i);
    fireEvent.change(input, { target: { value: "hamlet" } });

    expect(screen.queryByText("Phantom of the Opera")).toBeNull();
    expect(screen.getByText("Hamlet")).toBeDefined();
  });

  it("shows all productions when search query is cleared", () => {
    render(
      <MemoryRouter>
        <ProductionsListPage />
      </MemoryRouter>,
    );

    const input = screen.getByPlaceholderText(/search/i);
    fireEvent.change(input, { target: { value: "hamlet" } });
    fireEvent.change(input, { target: { value: "" } });

    expect(screen.getByText("Phantom of the Opera")).toBeDefined();
    expect(screen.getByText("Hamlet")).toBeDefined();
  });

  it("navigates to the production page when a card is clicked", () => {
    render(
      <MemoryRouter>
        <ProductionsListPage />
      </MemoryRouter>,
    );

    const phantomCard = screen.getByText("Phantom of the Opera");
    fireEvent.click(phantomCard.closest("button") ?? phantomCard);

    expect(mockNavigate).toHaveBeenCalledWith("/productions/prod_phantom");
  });
});
