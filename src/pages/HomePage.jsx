import { useNavigate } from "react-router-dom";
import NavBar from "../components/NavBar";
import DifficultyPill from "../components/ui/DifficultyPill"; //
import { useGame } from "../context/GameContext"; //
import { PRODUCTIONS } from "../data/gameData"; //

export default function HomePage() {
  const navigate = useNavigate();
  const { state } = useGame(); //

  const hasStarted = Object.keys(state?.progress || {}).length > 0;
  const firstProd = PRODUCTIONS[0]; //

  return (
    <div className="page-container">
      <NavBar />

      <header style={{ marginBottom: "2.5rem" }}>
        <h1
          className="annotation-text"
          style={{ fontSize: "2.2rem", color: "var(--bui-fg-info)" }}
        >
          Backstage Minions
        </h1>
        <p style={{ opacity: 0.6, fontFamily: "var(--font-main)" }}>
          Current Status: {state?.session ? "🔴 On-Call" : "⚪ Off-Duty"}
        </p>
      </header>

      <div className="desktop-two-column">
        <div className="desktop-col-main">
          {/* Daily Call Sheet */}
          <section
            className="hardware-panel"
            style={{
              borderLeft: "6px solid var(--bui-fg-danger)",
              padding: "1.5rem",
            }}
          >
            <h2
              className="annotation-text"
              style={{ color: "var(--bui-fg-danger)", marginTop: 0 }}
            >
              📌 Stage Manager's Call Sheet
            </h2>
            <div style={{ marginTop: "1rem" }}>
              {!hasStarted ? (
                <div className="list-item-row" style={{ border: "none" }}>
                  <p className="annotation-text">
                    Welcome to the crew. Start with: {firstProd.title}
                  </p>
                  <button
                    className="action-button btn-success"
                    onClick={() => navigate(`/productions/${firstProd.id}`)}
                  >
                    Begin Shift
                  </button>
                </div>
              ) : (
                <p className="annotation-text" style={{ opacity: 0.8 }}>
                  Solid work on the last run. Check the logs for your next
                  assignment.
                </p>
              )}
            </div>
          </section>

          {/* Productions List */}
          <h2
            className="annotation-text"
            style={{ marginTop: "2.5rem", marginBottom: "1rem" }}
          >
            Active Productions
          </h2>
          <div
            style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}
          >
            {PRODUCTIONS.map((p) => (
              <div
                key={p.id}
                className="hardware-panel"
                style={{ cursor: "pointer" }}
                onClick={() => navigate(`/productions/${p.id}`)}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "1.2rem",
                  }}
                >
                  <h3 style={{ fontSize: "1.3rem", margin: 0 }}>
                    {p.poster} {p.title}
                  </h3>
                  <span
                    className="problem-highlight"
                    style={{ fontSize: "0.75rem" }}
                  >
                    Enter Backstage ›
                  </span>
                </div>

                <div style={{ display: "flex", gap: "0.75rem" }}>
                  <DifficultyPill
                    label="School"
                    stars={state?.progress?.[`${p.id}_school`]?.stars || 0}
                    unlocked={p.levels.school.unlocked}
                  />
                  <DifficultyPill
                    label="Comm"
                    stars={state?.progress?.[`${p.id}_community`]?.stars || 0}
                    unlocked={p.levels.community.unlocked}
                  />
                  <DifficultyPill
                    label="Prof"
                    stars={
                      state?.progress?.[`${p.id}_professional`]?.stars || 0
                    }
                    unlocked={p.levels.professional.unlocked}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Career Stats Sidebar */}
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
                style={{
                  fontSize: "0.7rem",
                  opacity: 0.6,
                  textTransform: "uppercase",
                }}
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
                style={{
                  fontSize: "0.7rem",
                  opacity: 0.6,
                  textTransform: "uppercase",
                }}
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
        </div>
      </div>
    </div>
  );
}
