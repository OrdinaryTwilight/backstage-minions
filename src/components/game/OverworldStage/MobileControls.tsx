interface MobileControlsProps {
  onInteract: () => void;
  activeZoneLabel: string | null;
}

export default function MobileControls({
  onInteract,
  activeZoneLabel,
}: Readonly<MobileControlsProps>) {
  // We use touch events to manually dispatch keyboard events so our existing logic works perfectly!
  const triggerKey = (key: string, type: "keydown" | "keyup") => {
    globalThis.dispatchEvent(new KeyboardEvent(type, { key }));
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-end",
        marginTop: "1rem",
        padding: "0.5rem",
      }}
      className="mobile-only-controls"
    >
      {/* D-PAD */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 50px)",
          gap: "5px",
        }}
      >
        <div />
        <button
          className="mobile-dpad-btn"
          onTouchStart={() => triggerKey("w", "keydown")}
          onTouchEnd={() => triggerKey("w", "keyup")}
          onMouseDown={() => triggerKey("w", "keydown")}
          onMouseUp={() => triggerKey("w", "keyup")}
        >
          ▲
        </button>
        <div />
        <button
          className="mobile-dpad-btn"
          onTouchStart={() => triggerKey("a", "keydown")}
          onTouchEnd={() => triggerKey("a", "keyup")}
          onMouseDown={() => triggerKey("a", "keydown")}
          onMouseUp={() => triggerKey("a", "keyup")}
        >
          ◀
        </button>
        <button
          className="mobile-dpad-btn"
          onTouchStart={() => triggerKey("s", "keydown")}
          onTouchEnd={() => triggerKey("s", "keyup")}
          onMouseDown={() => triggerKey("s", "keydown")}
          onMouseUp={() => triggerKey("s", "keyup")}
        >
          ▼
        </button>
        <button
          className="mobile-dpad-btn"
          onTouchStart={() => triggerKey("d", "keydown")}
          onTouchEnd={() => triggerKey("d", "keyup")}
          onMouseDown={() => triggerKey("d", "keydown")}
          onMouseUp={() => triggerKey("d", "keyup")}
        >
          ▶
        </button>
      </div>

      {/* ACTION BUTTON */}
      <button
        onClick={onInteract}
        disabled={!activeZoneLabel}
        style={{
          width: "80px",
          height: "80px",
          borderRadius: "50%",
          background: activeZoneLabel ? "var(--bui-fg-warning)" : "#444",
          color: activeZoneLabel ? "#000" : "#888",
          border: "4px solid #fff",
          fontWeight: "bold",
          fontSize: "1rem",
          boxShadow: activeZoneLabel
            ? "0 0 15px var(--bui-fg-warning)"
            : "none",
          transition: "all 0.2s ease",
        }}
      >
        ACT
      </button>
    </div>
  );
}
