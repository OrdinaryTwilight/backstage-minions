interface MasterControlProps {
  onGo: () => void;
  disabled: boolean;
  style?: React.CSSProperties;
}

export default function MasterControl({
  onGo,
  disabled,
  style,
}: Readonly<MasterControlProps>) {
  return (
    <div style={{ textAlign: "center", margin: "2rem 0", ...style }}>
      <button
        type="button" // FIX: Prevent accidental form submission reloads
        className={`btn-master-go animate-pulse-go`}
        onClick={onGo}
        disabled={disabled}
        aria-label="Execute cue"
        aria-pressed={!disabled}
        aria-describedby="master-status"
        style={{
          filter: "url(#sketch-wobble)",
          transition: "transform 0.1s cubic-bezier(0.4, 0, 0.2, 1)",
        }}
      >
        GO
      </button>
      <p
        id="master-status"
        className="annotation-text"
        style={{ marginTop: "1rem", fontSize: "0.8rem", opacity: 0.6 }}
        role="status"
        aria-live="polite"
      >
        {disabled ? "[ WAITING FOR STANDBY ]" : "[ READY TO FIRE ]"}
      </p>
    </div>
  );
}
