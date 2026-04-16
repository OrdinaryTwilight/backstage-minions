/**
 * StatBar: A reusable UI component for technical drafting measurements.
 * Features: Hand-drawn wobble effect and pencil-style cross-hatch shading.
 */
export default function StatBar({ label, value, maxValue = 10 }) {
  return (
    <div style={{ marginBottom: "1rem" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "0.4rem",
          fontFamily: "var(--font-sketch)", // Architects Daughter font
          fontSize: "1rem",
          color: "var(--color-architect-blue)", // Technical cyan
        }}
      >
        <span>{label}</span>
        <span>
          {value} / {maxValue}
        </span>
      </div>
      <div
        style={{
          width: "100%",
          height: "12px",
          background: "rgba(255, 255, 255, 0.05)",
          border: "1px solid var(--color-pencil-light)",
          borderRadius: "2px",
          position: "relative",
          overflow: "hidden",
          filter: "url(#sketch-wobble)", // Mimics hand-drawn line irregularities
        }}
      >
        <div
          style={{
            width: `${(value / maxValue) * 100}%`,
            height: "100%",
            background: "var(--color-pencil-light)",
            /* Pencil-shaded cross-hatch fill effect */
            backgroundImage:
              "repeating-linear-gradient(45deg, transparent, transparent 2px, rgba(0,0,0,0.2) 2px, rgba(0,0,0,0.2) 4px)",
          }}
        />
      </div>
    </div>
  );
}
