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
