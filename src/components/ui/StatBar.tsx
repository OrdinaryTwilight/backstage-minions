interface StatBarProps {
  label: string;
  value: number;
  maxValue?: number;
}

export default function StatBar({
  label,
  value,
  maxValue = 10,
}: Readonly<StatBarProps>) {
  return (
    <div style={{ marginBottom: "1rem", width: "100%" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "0.4rem",
          fontFamily: "var(--font-sketch)",
          color: "var(--color-architect-blue)",
        }}
      >
        <span>{label}</span>
        <span id={`${label}-value`}>
          {value} / {maxValue}
        </span>
      </div>

      {/* FIX: Native semantic progress for screen readers, visually hidden */}
      <progress
        value={value}
        max={maxValue}
        aria-label={label}
        aria-describedby={`${label}-value`}
        style={{
          position: "absolute",
          width: "1px",
          height: "1px",
          padding: 0,
          margin: "-1px",
          overflow: "hidden",
          clip: "rect(0,0,0,0)",
          whiteSpace: "nowrap",
          border: 0,
        }}
      />

      {/* Visual Bar hidden from screen readers */}
      <div
        aria-hidden="true"
        style={{
          width: "100%",
          height: "12px",
          background: "rgba(255, 255, 255, 0.05)",
          border: "1px solid var(--color-pencil-light)",
          borderRadius: "2px",
          overflow: "hidden",
          filter: "url(#sketch-wobble)",
        }}
      >
        <div
          style={{
            width: `${(value / maxValue) * 100}%`,
            height: "100%",
            background: "var(--color-pencil-light)",
            backgroundImage:
              "repeating-linear-gradient(45deg, transparent, transparent 2px, rgba(0,0,0,0.2) 2px, rgba(0,0,0,0.2) 4px)",
            animation: "stat-fill 1s ease-out forwards",
          }}
        />
      </div>
    </div>
  );
}
