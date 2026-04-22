import Button from "../../ui/Button";

interface PauseOverlayProps {
  hasStarted: boolean;
  setIsPaused: (val: boolean) => void;
  setHasStarted: (val: boolean) => void;
}

export default function PauseOverlay({
  hasStarted,
  setIsPaused,
  setHasStarted,
}: Readonly<PauseOverlayProps>) {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.95)",
        zIndex: 5000,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <h1
        className="annotation-text"
        style={{
          fontSize: "3rem",
          color: "var(--bui-fg-warning)",
          textAlign: "center",
        }}
      >
        {hasStarted ? "STRIKE PAUSED" : "STRIKE READY"}
      </h1>
      <div
        style={{
          margin: "2rem 0",
          color: "#fff",
          maxWidth: "600px",
          textAlign: "center",
          lineHeight: "1.6",
        }}
      >
        {hasStarted ? (
          <p>Take a breather. The truck isn't leaving yet.</p>
        ) : (
          <>
            <p style={{ marginBottom: "1rem" }}>
              Properly coil the XLR audio snake before the truck leaves.
            </p>
            <div
              style={{
                padding: "12px",
                background: "rgba(255,255,255,0.1)",
                borderRadius: "8px",
                borderLeft: "4px solid var(--bui-fg-warning)",
                textAlign: "left",
              }}
            >
              <strong>💡 Pro-Tip:</strong> Heavy cables have sensitive internal
              wiring. Alternate between an <strong>"OVER"</strong> (normal loop)
              and an <strong>"UNDER"</strong> (reverse twist loop) to prevent
              the wire from tangling or breaking!
            </div>
          </>
        )}
      </div>
      <Button
        onClick={() => {
          setIsPaused(false);
          setHasStarted(true);
        }}
        variant="success"
        className="animate-pulse-go"
      >
        {hasStarted ? "RESUME COILING" : "START COILING"}
      </Button>
    </div>
  );
}
