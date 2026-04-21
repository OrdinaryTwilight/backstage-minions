import { useCallback, useEffect, useRef, useState } from "react";

interface MobileControlsProps {
  onInteract: () => void;
  activeZoneLabel: string | null;
}

const MAX_PULL = 40;

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
 * Clamp joystick movement
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

/**
 * Send synthetic key events to game system
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
 * Utility for scaling thumb
 */
function computeThumbScale(isDragging: boolean, isActive: boolean) {
  if (isDragging) return 1.1;
  if (isActive) return 1.05;
  return 1;
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
  const [isDraggingState, setIsDraggingState] = useState(false);

  const isDraggingRef = useRef(false);
  const baseRef = useRef<HTMLDivElement>(null);
  const center = useRef({ x: 0, y: 0 });

  // Track synthetic keys activated by joystick drag
  const activeDragKeys = useRef({ w: false, a: false, s: false, d: false });

  // Translate joystick coordinates to key events
  const updateJoystickKeys = useCallback(
    (pos: { x: number; y: number }) => {
      const threshold = 15; // Deadzone before movement registers
      const newKeys = {
        w: pos.y < -threshold,
        s: pos.y > threshold,
        a: pos.x < -threshold,
        d: pos.x > threshold,
      };

      (["w", "a", "s", "d"] as const).forEach((k) => {
        if (newKeys[k] !== activeDragKeys.current[k]) {
          triggerKey(k, newKeys[k] ? "keydown" : "keyup");
          activeDragKeys.current[k] = newKeys[k];
        }
      });
    },
    [triggerKey],
  );

  /**
   * ============================
   * Pointer input (drag joystick)
   * ============================
   */
  const handlePointerDown = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      isDraggingRef.current = true;
      setIsDraggingState(true);
      e.currentTarget.setPointerCapture(e.pointerId);

      if (baseRef.current) {
        const rect = baseRef.current.getBoundingClientRect();
        center.current = {
          x: rect.left + rect.width / 2,
          y: rect.top + rect.height / 2,
        };
      }

      const pos = calculateClampedPosition(
        e.clientX,
        e.clientY,
        center.current,
      );

      setPosition(pos);
      updateJoystickKeys(pos);
    },
    [updateJoystickKeys],
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (!isDraggingRef.current) return;

      const pos = calculateClampedPosition(
        e.clientX,
        e.clientY,
        center.current,
      );

      setPosition(pos);
      updateJoystickKeys(pos);
    },
    [updateJoystickKeys],
  );

  const handlePointerUp = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      isDraggingRef.current = false;
      setIsDraggingState(false);
      e.currentTarget.releasePointerCapture(e.pointerId);
      setPosition({ x: 0, y: 0 });
      updateJoystickKeys({ x: 0, y: 0 }); // Reset all keys to false
    },
    [updateJoystickKeys],
  );

  /**
   * ============================
   * Keyboard state (FIXED)
   * ============================
   */
  const pressed = useRef({ w: false, a: false, s: false, d: false });

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key in pressed.current) {
        pressed.current[e.key as keyof typeof pressed.current] = true;
      }
    };

    const up = (e: KeyboardEvent) => {
      if (e.key in pressed.current) {
        pressed.current[e.key as keyof typeof pressed.current] = false;
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
   * RAF-driven keyboard vector (OPTIMIZED)
   * ============================
   */
  useEffect(() => {
    let frame: number;
    const prevVector = { x: 0, y: 0 }; // Cache to prevent continuous renders

    const animate = () => {
      const p = pressed.current;

      let dx = 0;
      let dy = 0;

      if (p.a) dx -= 1;
      if (p.d) dx += 1;
      if (p.w) dy -= 1;
      if (p.s) dy += 1;

      if (dx !== 0 || dy !== 0) {
        const len = Math.hypot(dx, dy);
        dx /= len;
        dy /= len;
      }

      const newX = dx * MAX_PULL;
      const newY = dy * MAX_PULL;

      if (newX !== prevVector.x || newY !== prevVector.y) {
        setKeyboardVector({ x: newX, y: newY });
        prevVector.x = newX;
        prevVector.y = newY;
      }

      frame = requestAnimationFrame(animate);
    };

    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, []);

  /**
   * ============================
   * Visual state
   * ============================
   */
  const displayPosition = isDraggingState ? position : keyboardVector;

  const isActive =
    isDraggingState || keyboardVector.x !== 0 || keyboardVector.y !== 0;

  return (
    <div style={{ position: "relative", touchAction: "none" }}>
      {/* Accessibility fallback */}
      <fieldset style={srOnlyStyle}>
        <legend>Movement Controls</legend>
        {(["w", "a", "s", "d"] as const).map((k) => (
          <button
            key={k}
            type="button"
            onPointerDown={() => triggerKey(k, "keydown")}
            onPointerUp={() => triggerKey(k, "keyup")}
            onPointerLeave={() => triggerKey(k, "keyup")}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") triggerKey(k, "keydown");
            }}
            onKeyUp={(e) => {
              if (e.key === "Enter" || e.key === " ") triggerKey(k, "keyup");
            }}
          >
            Move {k.toUpperCase()}
          </button>
        ))}
      </fieldset>

      {/* Base */}
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
          background: "rgba(255,255,255,0.1)",
          border: "2px solid rgba(255,255,255,0.2)",
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
        {/* Thumb */}
        <div
          style={{
            boxSizing: "border-box",
            width: "50px",
            height: "50px",
            borderRadius: "50%",
            background: isActive
              ? "var(--bui-fg-warning)"
              : "rgba(255,255,255,0.3)",
            border: isActive
              ? "4px solid rgba(255,255,255,0.8)"
              : "4px solid transparent",

            transform: `translate(${displayPosition.x}px, ${displayPosition.y}px) scale(${computeThumbScale(
              isDraggingState,
              isActive,
            )})`,

            transition: isDraggingState
              ? "none"
              : "transform 0.2s cubic-bezier(0.175,0.885,0.32,1.275), background 0.2s ease, border 0.2s ease",

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
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-end",
        marginTop: "1rem",
        padding: "0.5rem",
      }}
    >
      <VirtualJoystick triggerKey={triggerKey} />

      <button
        type="button"
        onClick={onInteract}
        disabled={!activeZoneLabel}
        aria-label="Interact with active zone"
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
        }}
      >
        ACT
      </button>
    </section>
  );
}
