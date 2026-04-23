import Button from "../../ui/Button";
import HardwarePanel from "../../ui/HardwarePanel";
import SectionHeader from "../../ui/SectionHeader";
import { useCallboard } from "./useCallboard";

export default function CallboardPuzzle({
  onComplete,
}: Readonly<{ onComplete: () => void }>) {
  const {
    ACTORS,
    ROOMS,
    assignments,
    activeActorId,
    setActiveActorId,
    assignActorToRoom,
    validateCallboard,
    feedback,
    isSubmitted,
  } = useCallboard(onComplete);

  return (
    <div className="page-container animate-blueprint">
      <SectionHeader
        title="Pre-Show: The Callboard"
        subtitle="Assign the cast to their dressing rooms. Respect their contract riders."
      />

      <div aria-live="polite" style={{ marginBottom: "1rem" }}>
        {feedback && (
          <div
            style={{
              padding: "1rem",
              background: feedback.isError
                ? "rgba(248, 113, 113, 0.2)"
                : "rgba(74, 222, 128, 0.2)",
              border: `2px solid ${feedback.isError ? "var(--bui-fg-danger)" : "var(--bui-fg-success)"}`,
              borderRadius: "8px",
              color: "#fff",
              fontWeight: "bold",
              textAlign: "center",
            }}
          >
            {feedback.msg}
          </div>
        )}
      </div>

      <div className="desktop-two-column">
        {/* Left Column: Unassigned Actors */}
        <HardwarePanel
          style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
        >
          <h3
            className="annotation-text"
            style={{ color: "var(--bui-fg-info)" }}
          >
            1. Select Actor
          </h3>
          {ACTORS.map((actor) => {
            const isAssigned = !!assignments[actor.id];
            const isActive = activeActorId === actor.id;

            // WCAG FIX: Priority 3 - Maintained 100% opacity on text, but visually desaturated the background/border for 'assigned' states
            return (
              <Button
                key={actor.id}
                onClick={() => setActiveActorId(isActive ? null : actor.id)}
                aria-pressed={isActive}
                variant={isActive ? "accent" : "default"}
                style={{
                  justifyContent: "flex-start",
                  textAlign: "left",
                  background:
                    isAssigned && !isActive ? "rgba(0,0,0,0.5)" : undefined,
                  borderColor: isAssigned && !isActive ? "#333" : undefined,
                  color:
                    isAssigned && !isActive
                      ? "var(--color-pencil-light)"
                      : undefined,
                }}
                disabled={isSubmitted}
              >
                <div style={{ width: "100%" }}>
                  <strong>{actor.name}</strong>
                  {isAssigned && (
                    <span
                      style={{
                        marginLeft: "10px",
                        color: "var(--bui-fg-success)",
                        fontWeight: "bold",
                      }}
                    >
                      [Assigned]
                    </span>
                  )}
                  <div
                    style={{
                      fontSize: "0.8rem",
                      opacity: 0.9,
                      marginTop: "4px",
                    }}
                  >
                    Rider: {actor.trait}
                  </div>
                </div>
              </Button>
            );
          })}
        </HardwarePanel>

        {/* Right Column: Rooms */}
        <HardwarePanel
          style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
        >
          <h3
            className="annotation-text"
            style={{ color: "var(--bui-fg-warning)" }}
          >
            2. Assign to Room
          </h3>
          {ROOMS.map((room) => {
            const occupants = ACTORS.filter(
              (a) => assignments[a.id] === room.id,
            );
            const isFull = occupants.length >= room.capacity;

            return (
              <button
                key={room.id}
                type="button"
                onClick={() => assignActorToRoom(room.id)}
                disabled={!activeActorId || isSubmitted}
                style={{
                  background:
                    activeActorId && !isFull
                      ? "rgba(251, 191, 36, 0.1)"
                      : "rgba(0,0,0,0.3)",
                  border: `2px solid ${activeActorId && !isFull ? "var(--bui-fg-warning)" : "var(--glass-border)"}`,
                  borderRadius: "8px",
                  padding: "1rem",
                  textAlign: "left",
                  color: "var(--color-pencil-light)",
                  cursor: activeActorId && !isFull ? "pointer" : "not-allowed",
                  transition: "all 0.2s ease",
                }}
                aria-label={`Assign to ${room.name}. Capacity: ${occupants.length} of ${room.capacity}`}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: "0.5rem",
                  }}
                >
                  <strong className="annotation-text" style={{ color: "#fff" }}>
                    {room.name}
                  </strong>
                  <span
                    style={{
                      color: isFull
                        ? "var(--bui-fg-danger)"
                        : "var(--bui-fg-info)",
                      fontWeight: "bold",
                    }}
                  >
                    {occupants.length} / {room.capacity} Full
                  </span>
                </div>
                <ul
                  style={{
                    margin: 0,
                    paddingLeft: "1.5rem",
                    minHeight: "24px",
                  }}
                >
                  {occupants.length === 0 && (
                    <li style={{ fontStyle: "italic", opacity: 0.7 }}>Empty</li>
                  )}
                  {occupants.map((o) => (
                    <li key={o.id}>{o.name}</li>
                  ))}
                </ul>
              </button>
            );
          })}
        </HardwarePanel>
      </div>

      <div style={{ marginTop: "2rem" }}>
        <Button
          variant="success"
          onClick={validateCallboard}
          disabled={isSubmitted}
          style={{ width: "100%", padding: "1.5rem", fontSize: "1.2rem" }}
        >
          Post the Callboard
        </Button>
      </div>
    </div>
  );
}
