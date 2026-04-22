interface CoilVisualiserProps {
  coils: number;
  knots: number;
  targetCoils: number;
}

export default function CoilVisualiser({
  coils,
  knots,
  targetCoils,
}: Readonly<CoilVisualiserProps>) {
  return (
    <div
      aria-hidden="true"
      style={{ position: "relative", width: "250px", height: "250px" }}
    >
      {Array.from({ length: coils }).map((_, i) => (
        <svg
          key={`coil-${coils}-${i}`}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            transform: `translate(${(i % 2) * 5}px, ${(i % 3) * 5}px) rotate(${i * 35}deg) scale(${1 - i * 0.03})`,
            opacity: 0.9,
          }}
        >
          <ellipse
            cx="125"
            cy="125"
            rx="85"
            ry="110"
            fill="none"
            stroke="#1a202c"
            strokeWidth="10"
          />
          <ellipse
            cx="125"
            cy="125"
            rx="85"
            ry="110"
            fill="none"
            stroke="#e2e8f0"
            strokeWidth="4"
            strokeDasharray="30 5"
          />
        </svg>
      ))}

      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          zIndex: 10,
        }}
      >
        <span
          style={{
            fontSize: "4rem",
            fontWeight: "bold",
            color: "var(--bui-fg-warning)",
            textShadow: "2px 2px 10px #000",
          }}
        >
          {coils}/{targetCoils}
        </span>
        {knots > 0 && (
          <span
            style={{
              color: "var(--bui-fg-danger)",
              fontSize: "1rem",
              fontWeight: "bold",
              background: "#000",
              padding: "2px 8px",
              borderRadius: "4px",
            }}
          >
            Knots: {knots}
          </span>
        )}
      </div>
    </div>
  );
}
