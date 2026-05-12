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
      exclude: [
        // Test infrastructure
        "src/**/*.test.{ts,tsx}",
        "src/test/**",
        // Entry points – not meaningfully unit-testable
        "src/main.tsx",
        "src/App.tsx",
        // Pure data files (no executable logic, only constant declarations)
        "src/data/**",
        // TypeScript type declaration files (no runtime code)
        "src/types/**",
        // Complex interactive game minigame components (UI-heavy, physics-based)
        "src/components/game/CableCoilingStage/**",
        "src/components/game/CueExecutionStage/**",
        "src/components/game/ScenicStage/**",
        "src/components/game/WardrobeStage/**",
        "src/components/game/EquipmentStage/**",
        "src/components/game/PlanningStage/**",
        "src/components/game/SoundDesignStage/**",
        "src/components/game/StageManagementStage/**",
        "src/components/game/OverworldStage/index.tsx",
        "src/components/game/OverworldStage/useGameLoop.ts",
        "src/components/game/OverworldStage/MapViewport.tsx",
        "src/components/game/OverworldStage/MobileControls.tsx",
        "src/components/game/OverworldStage/HeadsetHUD.tsx",
        "src/components/game/OverworldStage/useInteraction.ts",
        "src/components/game/OverworldStage/useComms.ts",
        "src/components/game/OverworldStage/constants.ts",
        "src/components/game/OverworldStage/types.ts",
        "src/components/game/OverworldStage/utils.ts",
        // Complex stateful components (require integration testing)
        "src/components/game/DialogueManager.tsx",
        "src/components/game/WrapUpScene.tsx",
        "src/components/game/StageViewport.tsx",
        "src/components/ui/EquipmentMixer.tsx",
        "src/components/ui/CueStack.tsx",
        "src/components/ui/DepartmentMixer.tsx",
        // Page-level orchestration (router-dependent, tested via integration)
        "src/pages/GameLevelPage/**",
        "src/pages/IntroPage.tsx",
        "src/pages/ProductionsPage.tsx",
        "src/pages/SelectCharacterPage.tsx",
        "src/pages/SelectLevelPage.tsx",
        "src/pages/StoriesPage.tsx",
      ],
      thresholds: {
        lines: 80,
        functions: 75,
        branches: 65,
        statements: 80,
      },
    },
  },
});
