interface ChannelStripProps {
  ch: number;
  isDead: boolean;
  inputSource?: string;
  outputBuses: string[];
  patch: Record<string, Record<string, number>>;
  handlePatch: (type: string, source: string, target: number) => void;
  level: number;
  setLevel: (value: number) => void;
}

export default function ChannelStrip({
  ch,
  isDead,
  inputSource,
  outputBuses,
  patch,
  handlePatch,
  level,
  setLevel,
}: Readonly<ChannelStripProps>) {
  // ✅ Extracted logic (fixes Sonar warning)
  let scribbleText: string;
  if (isDead) {
    scribbleText = "DEAD";
  } else if (inputSource) {
    scribbleText = inputSource.substring(0, 8);
  } else {
    scribbleText = "NO IN";
  }

  const scribbleColor =
    inputSource && !isDead ? "var(--bui-fg-success)" : "#555";

  return (
    <div
      style={{
        position: "relative",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        width: "55px",
        background: isDead ? "#3b2121" : "#2d3748",
        padding: "10px 4px",
        borderRadius: "4px",
        border: isDead ? "2px solid var(--bui-fg-danger)" : "1px solid #4a5568",
      }}
    >
      {/* Scribble Strip */}
      <div
        style={{
          background: "#000",
          width: "100%",
          height: "24px",
          borderRadius: "2px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: "8px",
          border: "1px solid #111",
          overflow: "hidden",
        }}
      >
        <span
          style={{
            fontSize: "0.45rem",
            fontFamily: "var(--font-mono)",
            color: scribbleColor,
            whiteSpace: "nowrap",
            textTransform: "uppercase",
          }}
        >
          {scribbleText}
        </span>
      </div>

      {/* Channel Label */}
      <div
        style={{
          fontSize: "0.7rem",
          fontWeight: "bold",
          marginBottom: "10px",
          color: isDead ? "var(--bui-fg-danger)" : "#fff",
        }}
      >
        CH {ch}
      </div>

      {/* Output Routing */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "6px",
          flex: 1,
          alignItems: "center",
        }}
      >
        {outputBuses.map((bus, index) => {
          const isActive = patch.outputs[bus] === ch;

          let btnBg = "#718096";
          if (isActive) {
            btnBg = index === 0 ? "#e53e3e" : "#d69e2e";
          }
          if (isDead) {
            btnBg = "#2d3748";
          }

          return (
            <button
              key={bus}
              type="button"
              disabled={isDead}
              onClick={() => handlePatch("outputs", bus, ch)}
              aria-pressed={isActive}
              aria-label={`Route to ${bus}`}
              style={{
                position: "relative",
                width: "35px",
                height: "18px",
                borderRadius: "2px",
                border: isActive ? "2px solid #fff" : "1px solid transparent",
                cursor: isDead ? "not-allowed" : "pointer",
                background: btnBg,
                boxShadow: isActive
                  ? "inset 0 2px 4px rgba(0,0,0,0.6), 0 0 5px rgba(255,255,255,0.5)"
                  : "0 2px 4px rgba(0,0,0,0.4)",
                opacity: isDead ? 0.3 : 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {isActive && (
                <div
                  aria-hidden="true"
                  style={{
                    width: "6px",
                    height: "6px",
                    borderRadius: "50%",
                    background: "#fff",
                  }}
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Fader */}
      <div
        style={{
          marginTop: "15px",
          height: "100px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
        }}
      >
        <input
          type="range"
          min="0"
          max="100"
          disabled={isDead}
          value={isDead ? 0 : level}
          aria-label={`Channel ${ch} Volume`}
          onChange={(e) => setLevel(Number.parseInt(e.target.value))}
          style={{
            writingMode: "vertical-lr",
            direction: "rtl",
            height: "90px",
            width: "8px",
            cursor: isDead ? "not-allowed" : "ns-resize",
            opacity: isDead ? 0.3 : 1,
          }}
        />
      </div>
    </div>
  );
}
