import { useCallback } from "react";

interface MobileControlsProps {
  onInteract: () => void;
  activeZoneLabel: string | null;
}

/**
 * ============================
 * Constants
 * ============================
 */
const TOUCH_TARGET = 44;

/**
 * ============================
 * Virtual Keyboard Bridge
 * ============================
 */
function useVirtualKey() {
  return useCallback((key: string, type: "keydown" | "keyup", e?: Event) => {
    if (e && "cancelable" in e && e.cancelable) {
      e.preventDefault();
    }

    globalThis.dispatchEvent(
      new KeyboardEvent(type, {
        key,
        bubbles: true,
      }),
    );
  }, []);
}

/**
 * ============================
 * D-Pad Button (WCAG compliant)
 * ============================
 */
function DPadButton({
  label,
  ariaLabel,
  onPress,
}: Readonly<{
  label: string;
  ariaLabel: string;
  onPress: (type: "keydown" | "keyup", e: React.SyntheticEvent) => void;
}>) {
  return (
    <button
      type="button"
      aria-label={ariaLabel}
      className="mobile-dpad-btn"
      onTouchStart={(e) => onPress("keydown", e)}
      onTouchEnd={(e) => onPress("keyup", e)}
      onTouchCancel={(e) => onPress("keyup", e)}
      onMouseDown={(e) => onPress("keydown", e)}
      onMouseUp={(e) => onPress("keyup", e)}
      onMouseLeave={(e) => onPress("keyup", e)}
      style={{
        width: TOUCH_TARGET,
        height: TOUCH_TARGET,
        minWidth: TOUCH_TARGET,
        minHeight: TOUCH_TARGET,
        fontSize: "1.2rem",
        fontWeight: "bold",
        touchAction: "none",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {label}
    </button>
  );
}

/**
 * ============================
 * Main Component
 * ============================
 */
export default function MobileControls({
  onInteract,
  activeZoneLabel,
}: Readonly<MobileControlsProps>) {
  const triggerKey = useVirtualKey();

  const bind =
    (key: string) => (type: "keydown" | "keyup", e: React.SyntheticEvent) => {
      triggerKey(key, type, e as unknown as Event);
    };

  return (
    <section
      aria-label="Game controls"
      className="mobile-only-controls"
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-end",
        marginTop: "1rem",
        padding: "0.5rem",
      }}
    >
      {/* ============================
          D-PAD (Movement Controls)
      ============================ */}
      <fieldset
        aria-label="Movement controls"
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(3, ${TOUCH_TARGET}px)`,
          gridTemplateRows: `repeat(3, ${TOUCH_TARGET}px)`,
          gap: "8px",
          border: "none",
          padding: 0,
          margin: 0,
        }}
      >
        <legend
          style={{
            position: "absolute",
            left: "-9999px",
          }}
        >
          Movement controls. Use directional buttons.
        </legend>

        {/* top row */}
        <div />

        <DPadButton label="▲" ariaLabel="Move up" onPress={bind("w")} />

        <div />

        {/* middle row */}
        <DPadButton label="◀" ariaLabel="Move left" onPress={bind("a")} />

        <DPadButton label="●" ariaLabel="Stop movement" onPress={bind("s")} />

        <DPadButton label="▶" ariaLabel="Move right" onPress={bind("d")} />

        {/* bottom row */}
        <div />
        <div />
        <div />
      </fieldset>

      {/* ============================
          ACTION BUTTON
      ============================ */}
      <div>
        <button
          type="button"
          onClick={onInteract}
          disabled={!activeZoneLabel}
          aria-label="Interact with active zone"
          aria-describedby="act-help"
          style={{
            width: 72,
            height: 72,
            borderRadius: "50%",
            background: activeZoneLabel ? "var(--bui-fg-warning)" : "#444",
            color: activeZoneLabel ? "#000" : "#888",
            border: "3px solid #fff",
            fontWeight: "bold",
            fontSize: "1.1rem",
            boxShadow: activeZoneLabel
              ? "0 0 15px var(--bui-fg-warning)"
              : "none",
            transition: "all 0.2s ease",
            touchAction: "manipulation",
          }}
        >
          ACT
        </button>

        <span
          id="act-help"
          style={{
            position: "absolute",
            left: "-9999px",
          }}
        >
          Activate the current interaction zone
        </span>
      </div>
    </section>
  );
}
