import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    setupFiles: "./src/test/setup.ts",
    environment: "jsdom",
    coverage: {
      provider: "v8",
      enabled: true,
      reportsDirectory: "./coverage",
      include: ["src/**/*.{ts,tsx}"],
      exclude: ["src/**/*.test.{ts,tsx}"],
      thresholds: {
        lines: 80,
        functions: 80,
        branches: 70,
        statements: 80,
      },
    },
  },
});
