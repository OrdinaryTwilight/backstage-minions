// src/App.test.tsx
import { render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import App from "./App";

// Mock Vercel analytics to prevent environment issues in JSDOM
vi.mock("@vercel/analytics/react", () => ({ Analytics: () => null }));
vi.mock("@vercel/speed-insights/react", () => ({ SpeedInsights: () => null }));

describe("App Root", () => {
  it("renders the application root and initial home page without crashing", () => {
    // Render the real App component which includes Routers and Context Providers
    const { container } = render(<App />);

    // Check that it rendered something (the HomePage should be visible)
    expect(container).toBeDefined();
    expect(container.innerHTML).not.toBe("");
  });
});
