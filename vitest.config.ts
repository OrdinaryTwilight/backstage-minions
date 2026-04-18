import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true,
    setupFiles: "./src/test/setup.ts",
    environment: "jsdom",
    coverage: {
      provider: "v8",
      enabled: true,
      reportsDirectory: "./coverage",
      include: ["src/**/*.{ts,tsx}"],
      // ADD the data, types, and main.tsx to the exclude list here
      exclude: [
        "src/**/*.test.{ts,tsx}",
        "src/data/**/*.{ts,tsx}",
        "src/types/**/*.{ts,tsx}",
        "src/main.tsx",
        "src/vite-env.d.ts",
      ],
      thresholds: {
        lines: 80,
        functions: 80,
        branches: 70,
        statements: 80,
      },
    },
  },
});
