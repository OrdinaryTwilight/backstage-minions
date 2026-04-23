/**
 * @file Wardrobe Stage (Costume Changes)
 * @description Two-phase wardrobe management minigame for costume department.
 *
 * Stage Phases:
 * 1. **Laundry Phase**: Sort costumes and prep for quick changes
 * 2. **Quick Change Phase**: Execute rapid costume changes under time pressure
 *
 * Mechanics:
 * - Phase 1: Organize costumes efficiently
 * - Phase 2: Time-pressure task where speed and accuracy matter
 * - Scoring: Based on efficiency and correctness
 * - Difficulty: Affects time limits and costume count
 *
 * Theater Context: Wardrobe crew manages actor costumes and quick changes.
 * This stage simulates the real-time pressure of costume changes during shows.
 *
 * @component
 */

import { useState } from "react";
import LaundrySortUI from "./LaundrySortUI";
import QuickChangeUI from "./QuickChangeUI";

export default function WardrobeStage({
  onComplete,
  difficulty = "school",
}: Readonly<{
  onComplete: () => void;
  difficulty?: string;
}>) {
  const [phase, setPhase] = useState<"laundry" | "quick_change">("laundry");

  if (phase === "laundry") {
    return (
      <LaundrySortUI
        difficulty={difficulty}
        onComplete={() => setPhase("quick_change")}
      />
    );
  }

  return <QuickChangeUI difficulty={difficulty} onComplete={onComplete} />;
}
