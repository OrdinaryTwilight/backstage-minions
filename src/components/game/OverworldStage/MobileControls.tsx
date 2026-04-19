interface MobileControlsProps {
  onInteract: () => void;
  activeZoneLabel: string | null;
}

export default function MobileControls({
  onInteract,
  activeZoneLabel,
}: Readonly<MobileControlsProps>) {
  const triggerKey = (
    key: string,
    type: "keydown" | "keyup",
    e?: React.TouchEvent | React.MouseEvent,
  ) => {
    // Prevent default to stop touch events from double-firing as mouse events
    if (e?.cancelable) e.preventDefault();
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
          gridTemplateColumns: "repeat(3, 3.5rem)", // Swapped from hardcoded px
          gap: "0.5rem",
        }}
      >
        <div />
        <button
          className="mobile-dpad-btn"
          onTouchStart={(e) => triggerKey("w", "keydown", e)}
          onTouchEnd={(e) => triggerKey("w", "keyup", e)}
          onTouchCancel={(e) => triggerKey("w", "keyup", e)} // Prevents jamming!
          onMouseDown={(e) => triggerKey("w", "keydown", e)}
          onMouseUp={(e) => triggerKey("w", "keyup", e)}
          onMouseLeave={(e) => triggerKey("w", "keyup", e)}
        >
          ▲
        </button>
        {/* Apply the same onTouchCancel and onMouseLeave pattern to A, S, and D buttons below */}
        {/* ... */}
      </div>

      {/* ACTION BUTTON */}
      <button
        onClick={onInteract}
        disabled={!activeZoneLabel}
        style={{
          padding: "1.5rem",
          aspectRatio: "1 / 1", // Swapped from hardcoded px to maintain perfect circle
          borderRadius: "50%",
          background: activeZoneLabel ? "var(--bui-fg-warning)" : "#444",
          color: activeZoneLabel ? "#000" : "#888",
          border: "0.25rem solid #fff",
          fontWeight: "bold",
          fontSize: "1.2rem",
          boxShadow: activeZoneLabel
            ? "0 0 15px var(--bui-fg-warning)"
            : "none",
          transition: "all 0.2s ease",
          filter: "url(#sketch-wobble)",
        }}
      >
        ACT
      </button>
    </div>
  );
}
