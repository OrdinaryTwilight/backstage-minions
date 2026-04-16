// src/pages/HomePage.jsx
import { useNavigate } from "react-router-dom";
import NavBar from "../components/NavBar";
import DifficultyPill from "../components/ui/DifficultyPill";
import HardwarePanel from "../components/ui/HardwarePanel";
import { useGame } from "../context/GameContext";
import { PRODUCTIONS } from "../data/gameData";

export default function HomePage() {
  const navigate = useNavigate();
  const { state } = useGame();
  const hasStarted = Object.keys(state?.progress || {}).length > 0;
  const firstProd = PRODUCTIONS[0];

  return (
    <div className="page-container animate-blueprint">
      <NavBar />

      <header style={{ marginBottom: "2.5rem" }}>
        <h1
          className="annotation-text animate-flicker"
          style={{ fontSize: "2.2rem", color: "var(--bui-fg-info)" }}
        >
          Backstage Minions
        </h1>
        <div style={{ display: "flex", alignItems: "center", opacity: 0.6 }}>
          <span
            className={`status-indicator ${state?.session ? "status-on-call" : "status-off-duty"}`}
          />
          Current Status: {state?.session ? "Active Shift" : "Off-Duty"}
        </div>
      </header>

      <div className="desktop-two-column">
        <div className="desktop-col-main">
          {/* Daily Call Sheet */}
          <section
            className="hardware-panel animate-pop"
            style={{ borderLeft: "6px solid var(--bui-fg-danger)" }}
          >
            <h2
              className="annotation-text"
              style={{ color: "var(--bui-fg-danger)", marginTop: 0 }}
            >
              📌 Call Sheet
            </h2>
            <div style={{ marginTop: "1rem" }}>
              {!hasStarted ? (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <p className="annotation-text">
                    New Contract Available: {firstProd.title}
                  </p>
                  <button
                    className="action-button btn-success"
                    onClick={() => navigate(`/productions/${firstProd.id}`)}
                  >
                    Accept
                  </button>
                </div>
              ) : (
                <p className="annotation-text" style={{ opacity: 0.8 }}>
                  Maintain current gear. Check archives for updates.
                </p>
              )}
            </div>
          </section>

          <h2
            className="annotation-text"
            style={{ marginTop: "2.5rem", marginBottom: "1rem" }}
          >
            Active Work Orders
          </h2>
          <div
            style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}
          >
            {PRODUCTIONS.map((p, idx) => (
              <div
                key={p.id}
                className="hardware-panel animate-blueprint"
                style={{ cursor: "pointer", animationDelay: `${0.1 * idx}s` }}
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
                    DEPLOY ›
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

        {/* Career Log Sidebar */}
        <div className="desktop-col-side">
          <section className="hardware-panel" style={{ textAlign: "center" }}>
            <h2
              className="annotation-text"
              style={{ fontSize: "1.3rem", marginBottom: "1.5rem" }}
            >
              Career Log
            </h2>

            {/* Network Panel: Static display as requested */}
            <div
              className="surface-panel"
              style={{
                marginBottom: "1rem",
                padding: "1rem",
                borderRadius: "8px",
              }}
            >
              <div style={{ fontSize: "2rem" }}>👥</div>
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
            </div>

            {/* Stories Panel: The only interactive link in the log */}
            <HardwarePanel
              variant="clickable"
              style={{
                marginBottom: "1rem",
                padding: "1rem",
                transition: "transform 0.2s ease",
              }}
              onClick={() => navigate("/stories")}
            >
              <div style={{ fontSize: "2rem" }}>📖</div>
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
          </section>
        </div>
      </div>
    </div>
  );
}
