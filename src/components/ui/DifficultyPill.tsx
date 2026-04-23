/**
 * @file Difficulty Pill Component
 * @description Displays level progress and unlock status for a single difficulty tier.
 * Shows stars earned and whether level is playable (unlocked).
 * Used on progress dashboard and level selection pages.
 *
 * Visual states:
 * - **Unlocked**: Full opacity, normal styling
 * - **Locked**: Reduced opacity, grayscale, dashed border
 * - **Stars**: 0-3 stars displayed with emoji
 *
 * @component
 */

/**
 * DifficultyPill: A reusable UI component for displaying level progress.
 * Used in the HomePage dashboard and SelectLevelPage.
 */
interface DifficultyPillProps {
  label: string;
  stars: number;
  unlocked: boolean;
}

export default function DifficultyPill({
  label,
  stars,
  unlocked,
}: Readonly<DifficultyPillProps>) {
  return (
    <div
      style={{
        flex: 1,
        padding: "10px",
        background: unlocked
          ? "var(--color-surface-translucent)"
          : "transparent",
        borderRadius: "12px",
        textAlign: "center",
        border: unlocked
          ? "1px solid var(--glass-border)"
          : "1px dashed var(--color-text-dim)",
        opacity: unlocked ? 1 : 0.4,
        filter: unlocked ? "none" : "grayscale(1)",
      }}
    >
      <div
        style={{
          fontSize: "0.65rem",
          textTransform: "uppercase",
          letterSpacing: "1px",
          marginBottom: "6px",
          color: unlocked ? "var(--color-architect-blue)" : "inherit",
        }}
      >
        {label}
      </div>
      <div style={{ color: "var(--bui-fg-warning)", fontSize: "1rem" }}>
        {unlocked
          ? Array.from({ length: 3 }).map((_, i) => (
              <span
                key={`star-${i}-${stars}`}
                style={{ opacity: i < stars ? 1 : 0.2 }}
              >
                ★
              </span>
            ))
          : "🔒"}
      </div>
    </div>
  );
}
