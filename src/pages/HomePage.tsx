import { useNavigate } from "react-router-dom";
import DifficultyPill from "../components/ui/DifficultyPill";
import HardwarePanel from "../components/ui/HardwarePanel";
import NavBar from "../components/ui/NavBar";
import { useGame } from "../context/GameContext";
import { PRODUCTIONS } from "../data/gameData";

export default function HomePage() {
  const navigate = useNavigate();
  const { state } = useGame();
  const hasStarted = Object.keys(state?.progress || {}).length > 0;
  const firstProd = PRODUCTIONS[0];

  return (
    <div className="page-container">
      {/* NavBar stays fixed to the viewport */}
      <NavBar />

      {/* Animation wrapper moved inside to prevent breaking fixed positioning */}
      <div className="animate-blueprint">
        <header style={{ marginBottom: "2.5rem" }}>
          <h1
            className="annotation-text animate-flicker"
            style={{ fontSize: "2.2rem", color: "var(--bui-fg-info)" }}
          >
            Backstage Minions
          </h1>
          <div 
            style={{ display: "flex", alignItems: "center", opacity: 0.6 }}
            role="status"
            aria-live="polite"
            aria-label={`Current status: ${state?.session ? "On-Call" : "Off-Duty"}`}
          >
            <span
              className={`status-indicator ${state?.session ? "status-on-call" : "status-off-duty"}`}
              aria-hidden="true"
            />
            Current Status: {state?.session ? "On-Call" : "Off-Duty"}
          </div>
        </header>

        <div className="desktop-two-column">
          <div className="desktop-col-main">
            {/* These will now correctly show their borders */}
            <HardwarePanel
              className="animate-pop"
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
                      Accept your first contract: {firstProd.title}
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
                    Maintain current rig. Archival data updated.
                  </p>
                )}
              </div>
            </HardwarePanel>

            <h2
              className="annotation-text"
              style={{ marginTop: "2.5rem", marginBottom: "1rem" }}
            >
              Work Orders
            </h2>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "1.5rem",
              }}
              role="region"
              aria-label="Available production work orders"
            >
              {PRODUCTIONS.map((p, idx) => (
                <HardwarePanel
                  key={p.id}
                  className="animate-blueprint"
                  style={{ cursor: "pointer", animationDelay: `${0.1 * idx}s` }}
                  onClick={() => navigate(`/productions/${p.id}`)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e: React.KeyboardEvent<HTMLDivElement>) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      navigate(`/productions/${p.id}`);
                    }
                  }}
                  aria-label={`View production: ${p.title}`}
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
                      aria-hidden="true"
                    >
                      DEPLOY ›
                    </span>
                  </div>
                  <div style={{ display: "flex", gap: "0.75rem" }}>
                    <DifficultyPill
                      label="School"
                      stars={state?.progress?.[`${p.id}_school`]?.stars || 0}
                      unlocked={p.levels.school?.unlocked ?? false}
                    />
                    <DifficultyPill
                      label="Comm"
                      stars={state?.progress?.[`${p.id}_community`]?.stars || 0}
                      unlocked={p.levels.community?.unlocked ?? false}
                    />
                    <DifficultyPill
                      label="Prof"
                      stars={
                        state?.progress?.[`${p.id}_professional`]?.stars || 0
                      }
                      unlocked={p.levels.professional?.unlocked ?? false}
                    />
                  </div>
                </HardwarePanel>
              ))}
            </div>
          </div>

          <div className="desktop-col-side">
            <HardwarePanel style={{ textAlign: "center" }}>
              <h2
                className="annotation-text"
                style={{ fontSize: "1.3rem", marginBottom: "1.5rem" }}
              >
                Career Log
              </h2>

              <div
                className="surface-panel"
                style={{
                  marginBottom: "1rem",
                  padding: "1rem",
                  borderRadius: "8px",
                  background: "rgba(255,255,255,0.02)",
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

              <HardwarePanel
                variant="clickable"
                style={{ marginBottom: "1rem", padding: "1rem", cursor: "pointer" }}
                onClick={() => navigate("/stories")}
                role="button"
                tabIndex={0}
                onKeyDown={(e: React.KeyboardEvent<HTMLDivElement>) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    navigate("/stories");
                  }
                }}
                aria-label={`View unlocked stories. ${state?.unlockedStories?.length || 0} stories available.`}
              >
                <div style={{ fontSize: "2rem" }} aria-hidden="true">📖</div>
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
            </HardwarePanel>
          </div>
        </div>
      </div>
    </div>
  );
}
