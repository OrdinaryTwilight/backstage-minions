/**
 * @file Department Badge Component
 * @description Displays character's theater department with icon and label.
 * Used on character selection and other places to show department affiliation.
 *
 * Departments represented:
 * - Lighting (🔦): Technical light operation
 * - Sound (🎧): Audio and sound design
 * - Others: Props, Wardrobe, Scenic, Management, etc.
 *
 * @component
 */

// src/components/ui/DepartmentBadge.jsx
interface DepartmentBadgeProps {
  readonly department?: string;
}

export default function DepartmentBadge({
  department,
}: Readonly<DepartmentBadgeProps>) {
  const isLighting = department === "lighting";
  return (
    <div
      className="problem-highlight"
      style={{ display: "inline-flex", alignItems: "center", gap: "8px" }}
    >
      <span style={{ fontSize: "0.8rem" }}>{isLighting ? "🔦" : "🎧"}</span>
      <span
        style={{
          fontFamily: "var(--font-sketch)",
          fontSize: "0.75rem",
          textTransform: "uppercase",
        }}
      >
        {department}
      </span>
    </div>
  );
}
