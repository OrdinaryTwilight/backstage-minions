import "../../styles/animations.css";

interface SpinnerProps {
  size?: "small" | "medium" | "large";
  color?: string;
  label?: string;
}

export default function Spinner({
  size = "medium",
  color = "var(--bui-fg-warning)",
  label = "Loading...",
}: Readonly<SpinnerProps>) {
  const sizeMap = {
    small: "20px",
    medium: "40px",
    large: "60px",
  };

  const spinnerSize = sizeMap[size];

  return (
    <div
      role="status"
      aria-live="polite"
      style={{
        display: "inline-block",
        width: spinnerSize,
        height: spinnerSize,
        position: "relative",
      }}
    >
      {/* Visible animated spinner */}
      <div
        className="animate-spin"
        aria-hidden="true"
        style={{
          width: "100%",
          height: "100%",
          border: `3px solid rgba(255,255,255,0.1)`,
          borderTopColor: color,
          borderRadius: "50%",
        }}
      />

      <span
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
      >
        {label}
      </span>
    </div>
  );
}
