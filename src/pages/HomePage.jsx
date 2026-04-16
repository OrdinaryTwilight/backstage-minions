// Inside src/pages/HomePage.jsx - Career Log Section
<div className="desktop-col-side">
  <section
    className="hardware-panel"
    style={{ height: "100%", textAlign: "center" }}
  >
    <h2
      className="annotation-text"
      style={{ fontSize: "1.3rem", marginBottom: "1.5rem" }}
    >
      Career Log
    </h2>

    {/* Contacts Link - Currently placeholder navigation */}
    <HardwarePanel
      variant="clickable"
      style={{ marginBottom: "1rem", padding: "1rem" }}
      onClick={() => navigate("/stories")} // Linking to stories for now as no contacts page exists
    >
      <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>👥</div>
      <div className="annotation-text" style={{ fontSize: "1.2rem" }}>
        {state?.contacts?.length || 0}
      </div>
      <div
        style={{ fontSize: "0.7rem", opacity: 0.6, textTransform: "uppercase" }}
      >
        Network
      </div>
    </HardwarePanel>

    {/* Stories Link */}
    <HardwarePanel
      variant="clickable"
      style={{ marginBottom: "1rem", padding: "1rem" }}
      onClick={() => navigate("/stories")}
    >
      <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>📖</div>
      <div className="annotation-text" style={{ fontSize: "1.2rem" }}>
        {state?.unlockedStories?.length || 0}
      </div>
      <div
        style={{ fontSize: "0.7rem", opacity: 0.6, textTransform: "uppercase" }}
      >
        Stories
      </div>
    </HardwarePanel>

    {/* Current Rank - Static Display */}
    <div
      className="surface-panel"
      style={{
        background: "rgba(56, 189, 248, 0.1)",
        border: "1px solid var(--color-architect-blue)",
        padding: "1rem",
        borderRadius: "var(--radius-md)",
      }}
    >
      <div
        style={{
          fontSize: "0.65rem",
          color: "var(--color-architect-blue)",
          textTransform: "uppercase",
          marginBottom: "4px",
        }}
      >
        Current Rank
      </div>
      <div className="annotation-text" style={{ fontSize: "1.2rem" }}>
        {state?.contacts?.length > 4 ? "Booth Legend" : "Junior Tech"}
      </div>
    </div>
  </section>
</div>;
