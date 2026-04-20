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
  const [isDragging, setIsDragging] = useState(false);

  const isDraggingRef = useRef(false);
  const baseRef = useRef<HTMLDivElement>(null);
  const center = useRef({ x: 0, y: 0 });

  /**
   * ============================
   * Pointer input (drag joystick)
   * ============================
   */
  const handlePointerDown = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      isDraggingRef.current = true;
      setIsDragging(true);
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
    },
    [],
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
    },
    [],
  );

  const handlePointerUp = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      isDraggingRef.current = false;
      setIsDragging(false);
      e.currentTarget.releasePointerCapture(e.pointerId);
      setPosition({ x: 0, y: 0 });
    },
    [],
  );

  /**
   * ============================
   * Keyboard state (FIXED)
   * ============================
   * Only updates state flags — NO vector math here
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
   * RAF-driven keyboard vector (FIX)
   * ============================
   * This removes ALL lag/sticking issues
   */
  useEffect(() => {
    let frame: number;

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

      setKeyboardVector({
        x: dx * MAX_PULL,
        y: dy * MAX_PULL,
      });

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
  const displayPosition = isDraggingRef.current ? position : keyboardVector;

  const isActive =
    isDraggingRef.current || keyboardVector.x !== 0 || keyboardVector.y !== 0;

  return (
    <div style={{ position: "relative", touchAction: "none" }}>
      {/* Accessibility fallback */}
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
            width: "50px",
            height: "50px",
            borderRadius: "50%",
            background: isActive
              ? "var(--bui-fg-warning)"
              : "rgba(255,255,255,0.3)",

            transform: `translate(${displayPosition.x}px, ${displayPosition.y}px) scale(${computeThumbScale(
              isDraggingRef.current,
              isActive,
            )})`,

            transition: isDraggingRef.current
              ? "none"
              : "transform 0.2s cubic-bezier(0.175,0.885,0.32,1.275), background 0.2s ease",

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
