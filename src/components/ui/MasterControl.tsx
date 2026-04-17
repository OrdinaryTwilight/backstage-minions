// src/components/ui/MasterControl.jsx

export default function MasterControl({ onGo, disabled }) {
  return (
    <div style={{ textAlign: "center", margin: "2rem 0" }}>
      <button
        className={`btn-master-go animate-pulse-go`} // Added the pulsing glow
        onClick={onGo}
        disabled={disabled}
        style={{
          filter: "url(#sketch-wobble)",
          transition: "transform 0.1s cubic-bezier(0.4, 0, 0.2, 1)",
        }}
      >
        GO
      </button>
      <p
        className="annotation-text"
        style={{ marginTop: "1rem", fontSize: "0.8rem", opacity: 0.6 }}
      >
        {disabled ? "[ WAITING FOR STANDBY ]" : "[ READY TO FIRE ]"}
      </p>
    </div>
  );
}
