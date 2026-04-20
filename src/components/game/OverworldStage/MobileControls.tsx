import { useCallback, useEffect, useRef, useState } from "react";

interface MobileControlsProps {
  onInteract: () => void;
  activeZoneLabel: string | null;
}

/**
 * ============================
 * Constants & Accessibility
 * ============================
 */
const MAX_PULL = 40;
const DEAD_ZONE = 10;

const srOnlyStyle: React.CSSProperties = {
  position: "absolute",
  width: "1px",
  height: "1px",
  padding: "0",
  margin: "-1px",
  overflow: "hidden",
  clip: "rect(0, 0, 0, 0)",
  whiteSpace: "nowrap",
  borderWidth: "0",
};

/**
 * ============================
 * Math Helpers
 * ============================
 */
function calculateClampedPosition(
  clientX: number,
  clientY: number,
  center: { x: number; y: number },
) {
  const dx = clientX - center.x;
  const dy = clientY - center.y;
  const distance = Math.hypot(dx, dy);

  if (distance <= MAX_PULL) return { x: dx, y: dy };

  const ratio = MAX_PULL / distance;
  return { x: dx * ratio, y: dy * ratio };
}

function updateDirectionalKeys(
  dx: number,
  dy: number,
  activeKeys: Record<string, boolean>,
  triggerKey: (k: string, t: "keydown" | "keyup") => void,
) {
  const newKeys = { w: false, a: false, s: false, d: false };

  if (Math.hypot(dx, dy) > DEAD_ZONE) {
    if (dx < -DEAD_ZONE) newKeys.a = true;
    if (dx > DEAD_ZONE) newKeys.d = true;
    if (dy < -DEAD_ZONE) newKeys.w = true;
    if (dy > DEAD_ZONE) newKeys.s = true;
  }

  (["w", "a", "s", "d"] as const).forEach((key) => {
    if (newKeys[key] !== activeKeys[key]) {
      triggerKey(key, newKeys[key] ? "keydown" : "keyup");
      activeKeys[key] = newKeys[key];
    }
  });
}

/**
 * ============================
 * Virtual Keyboard Bridge
 * ============================
 */
function useVirtualKey() {
  return useCallback((key: string, type: "keydown" | "keyup") => {
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
 * Virtual Joystick
 * ============================
 */
function VirtualJoystick({
  triggerKey,
}: Readonly<{ triggerKey: (k: string, t: "keydown" | "keyup") => void }>) {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [keyboardVector, setKeyboardVector] = useState({ x: 0, y: 0 });

  const isDragging = useRef(false);
  const center = useRef({ x: 0, y: 0 });
  const activeKeys = useRef({ w: false, a: false, s: false, d: false });
  const baseRef = useRef<HTMLDivElement>(null);

  /**
   * ============================
   * Pointer (touch/mouse)
   * ============================
   */
  const handlePointerDown = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      isDragging.current = true;
      e.currentTarget.setPointerCapture(e.pointerId);

      if (baseRef.current) {
        const rect = baseRef.current.getBoundingClientRect();
        center.current = {
          x: rect.left + rect.width / 2,
          y: rect.top + rect.height / 2,
        };
      }

      const newPos = calculateClampedPosition(
        e.clientX,
        e.clientY,
        center.current,
      );
      setPosition(newPos);
      updateDirectionalKeys(newPos.x, newPos.y, activeKeys.current, triggerKey);
    },
    [triggerKey],
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (!isDragging.current) return;

      const newPos = calculateClampedPosition(
        e.clientX,
        e.clientY,
        center.current,
      );
      setPosition(newPos);
      updateDirectionalKeys(newPos.x, newPos.y, activeKeys.current, triggerKey);
    },
    [triggerKey],
  );

  const handlePointerUp = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      isDragging.current = false;
      e.currentTarget.releasePointerCapture(e.pointerId);

      setPosition({ x: 0, y: 0 });
      updateDirectionalKeys(0, 0, activeKeys.current, triggerKey);
    },
    [triggerKey],
  );

  /**
   * ============================
   * Keyboard → Joystick sync
   * ============================
   */
  useEffect(() => {
    const pressed = { w: false, a: false, s: false, d: false };

    const updateVector = () => {
      let dx = 0;
      let dy = 0;

      if (pressed.a) dx -= 1;
      if (pressed.d) dx += 1;
      if (pressed.w) dy -= 1;
      if (pressed.s) dy += 1;

      if (dx !== 0 || dy !== 0) {
        const len = Math.hypot(dx, dy);
        dx /= len;
        dy /= len;
      }

      setKeyboardVector({
        x: dx * MAX_PULL,
        y: dy * MAX_PULL,
      });
    };

    const down = (e: KeyboardEvent) => {
      if (e.key in pressed) {
        pressed[e.key as keyof typeof pressed] = true;
        updateVector();
      }
    };

    const up = (e: KeyboardEvent) => {
      if (e.key in pressed) {
        pressed[e.key as keyof typeof pressed] = false;
        updateVector();
      }
    };

    globalThis.addEventListener("keydown", down);
    globalThis.addEventListener("keyup", up);

    return () => {
      globalThis.removeEventListener("keydown", down);
      globalThis.removeEventListener("keyup", up);
    };
  }, []);

  /**
   * ============================
   * Derived Visual State
   * ============================
   */
  const displayPosition = isDragging.current ? position : keyboardVector;

  const isActive =
    isDragging.current || keyboardVector.x !== 0 || keyboardVector.y !== 0;

  /**
   * ============================
   * Render
   * ============================
   */
  return (
    <div style={{ position: "relative", touchAction: "none" }}>
      {/* Screen-reader controls */}
      <fieldset style={srOnlyStyle}>
        <legend>Movement Controls</legend>
        {(["w", "a", "s", "d"] as const).map((k) => (
          <button
            key={k}
            type="button"
            onKeyDown={() => triggerKey(k, "keydown")}
            onKeyUp={() => triggerKey(k, "keyup")}
          >
            Move {k.toUpperCase()}
          </button>
        ))}
      </fieldset>

      {/* Joystick Base */}
      <div
        ref={baseRef}
        aria-hidden="true"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        style={{
          width: "120px",
          height: "120px",
          borderRadius: "50%",
          background: "rgba(255, 255, 255, 0.1)",
          border: "2px solid rgba(255, 255, 255, 0.2)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          cursor: "pointer",
          boxShadow: isActive
            ? "inset 0 0 25px rgba(0,0,0,0.6), 0 0 15px var(--bui-fg-warning)"
            : "inset 0 0 20px rgba(0,0,0,0.5)",
          transition: "box-shadow 0.2s ease",
        }}
      >
        {/* Joystick Thumb */}
        <div
          style={{
            width: "50px",
            height: "50px",
            borderRadius: "50%",
            background: isActive
              ? "var(--bui-fg-warning)"
              : "rgba(255,255,255,0.3)",
            transform: `translate(${displayPosition.x}px, ${displayPosition.y}px) scale(${
              isDragging.current ? 1.1 : isActive ? 1.05 : 1
            })`,
            transition: isDragging.current
              ? "none"
              : "transform 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275), background 0.2s ease",
            position: "absolute",
            boxShadow: isActive
              ? `
                0 0 10px var(--bui-fg-warning),
                0 0 25px var(--bui-fg-warning),
                0 0 45px var(--bui-fg-warning),
                0 4px 12px rgba(0,0,0,0.6)
              `
              : "0 4px 10px rgba(0,0,0,0.4)",
          }}
        />
      </div>
    </div>
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
      <VirtualJoystick triggerKey={triggerKey} />

      <div>
        <button
          type="button"
          onClick={onInteract}
          disabled={!activeZoneLabel}
          aria-label="Interact with active zone"
          aria-describedby="act-help"
          style={{
            width: 80,
            height: 80,
            borderRadius: "50%",
            background: activeZoneLabel ? "var(--bui-fg-warning)" : "#444",
            color: activeZoneLabel ? "#000" : "#888",
            border: "4px solid rgba(255,255,255,0.8)",
            fontWeight: "bold",
            fontSize: "1.2rem",
            boxShadow: activeZoneLabel
              ? "0 0 20px var(--bui-fg-warning)"
              : "inset 0 0 10px rgba(0,0,0,0.5)",
            transition: "all 0.2s ease",
            touchAction: "manipulation",
          }}
        >
          ACT
        </button>

        <span id="act-help" style={srOnlyStyle}>
          Activate the current interaction zone
        </span>
      </div>
    </section>
  );
}
