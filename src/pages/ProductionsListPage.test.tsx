// src/pages/ProductionsListPage.test.tsx
import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import ProductionsListPage from "./ProductionsListPage";

// Mock the productions data
vi.mock("../data/gameData", () => ({
  PRODUCTIONS: [
    {
      id: "prod-1",
      title: "Phantom of the Opera",
      description: "A classic.",
      poster: "🎭",
    },
    {
      id: "prod-2",
      title: "Les Misérables",
      description: "A revolution.",
      poster: "🥖",
    },
  ],
}));

const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe("ProductionsListPage", () => {
  beforeEach(() => {
    mockNavigate.mockClear();
  });

  it("renders the list of productions", () => {
    render(
      <MemoryRouter>
        <ProductionsListPage />
      </MemoryRouter>,
    );
    expect(screen.getByText("Phantom of the Opera")).toBeDefined();
    expect(screen.getByText("Les Misérables")).toBeDefined();
  });

  it("filters productions based on search input", () => {
    render(
      <MemoryRouter>
        <ProductionsListPage />
      </MemoryRouter>,
    );

    const searchInput = screen.getByPlaceholderText("Search archives...");
    fireEvent.change(searchInput, { target: { value: "Phantom" } });

    expect(screen.getByText("Phantom of the Opera")).toBeDefined();
    // Les Misérables should be filtered out
    expect(screen.queryByText("Les Misérables")).toBeNull();
  });

  it("navigates to the production details page on click", () => {
    render(
      <MemoryRouter>
        <ProductionsListPage />
      </MemoryRouter>,
    );

    const phantomPanel = screen.getByText("Phantom of the Opera");
    fireEvent.click(phantomPanel);

    expect(mockNavigate).toHaveBeenCalledWith("/productions/prod-1");
  });
});
