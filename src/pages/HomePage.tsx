import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../components/ui/Button";
import HardwarePanel from "../components/ui/HardwarePanel";
import { useGame } from "../context/GameContext";

export default function HomePage() {
  const navigate = useNavigate();
  const { state: gameState } = useGame();

  const hasUnread =
    gameState.unreadContacts && gameState.unreadContacts.length > 0;

  const perfectScores = Object.entries(gameState.progress || {}).filter(
    ([, prog]) => prog.stars === 3,
  );

  // UX ADDITION: Career Stats calculation based on persistent progress
  const { totalStars, totalShows } = useMemo(() => {
    let stars = 0;
    let shows = 0;
    Object.values(gameState.progress || {}).forEach((prog) => {
      stars += prog.stars;
      if (prog.completed) shows += 1;
    });
    return { totalStars: stars, totalShows: shows };
  }, [gameState.progress]);

  const hasActiveSession = !!gameState.session;

  return (
    <div
      className="page-container animate-fade-in"
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "85vh",
        textAlign: "center",
        paddingBottom: "2rem",
      }}
    >
      <div style={{ maxWidth: "800px", width: "100%" }}>
        <HardwarePanel
          style={{
            padding: "clamp(2rem, 8vw, 5rem) clamp(1rem, 4vw, 3rem)",
            background: "rgba(15, 23, 42, 0.9)",
            border: "2px solid var(--bui-fg-warning)",
            boxShadow: "0 20px 50px rgba(0,0,0,0.5)",
          }}
        >
          <h1
            style={{
              fontFamily: "var(--font-sketch)",
              fontSize: "clamp(2.5rem, 6vw, 4rem)",
              color: "var(--bui-fg-warning)",
              marginBottom: "1.5rem",
              lineHeight: 1.1,
              textShadow: "0 0 15px rgba(251, 191, 36, 0.4)",
              animation: "technical-flicker 4s infinite",
            }}
          >
            BACKSTAGE
            <br />
            MINIONS
          </h1>
          <p
            style={{
              fontSize: "clamp(1rem, 3vw, 1.15rem)",
              color: "var(--color-pencil-light)",
              marginBottom: "3rem",
              lineHeight: "1.6",
              maxWidth: "600px",
              margin: "0 auto 3rem auto",
            }}
          >
            Welcome to the shadows. Grab your headset, double-check your rig,
            and keep the show running at all costs. The cast gets the applause,
            but we hold the power.
          </p>

          <div
            style={{
              display: "flex",
              gap: "1.5rem",
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            <Button
              className="btn-xl"
              variant="accent"
              style={{
                background: "var(--bui-fg-warning)",
                color: "#000",
                fontFamily: "var(--font-sketch)",
                fontSize: "1.25rem",
              }}
              onClick={() =>
                navigate(
                  hasActiveSession
                    ? `/game/${gameState.session?.productionId}/${gameState.session?.difficulty}/${gameState.session?.characterId}`
                    : "/productions",
                )
              }
            >
              {hasActiveSession ? "Resume Shift" : "Start Shift"}
            </Button>
            <div style={{ position: "relative" }}>
              <Button
                className="btn-xl"
                style={{
                  fontFamily: "var(--font-sketch)",
                  fontSize: "1.25rem",
                }}
                onClick={() => navigate("/networks")}
              >
                Check Comms
              </Button>
              {hasUnread && (
                <span
                  className="absolute top-0 right-0 flex h-4 w-4"
                  style={{ marginTop: "-5px", marginRight: "-5px" }}
                >
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500 border-2 border-slate-900"></span>
                </span>
              )}
            </div>
          </div>
        </HardwarePanel>

        {/* CAREER STATS & ACHIEVEMENTS */}
        {(totalShows > 0 || perfectScores.length > 0) && (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
              gap: "1.5rem",
              marginTop: "2rem",
            }}
          >
            {/* Stats Panel */}
            <div
              className="animate-pop"
              style={{
                background: "rgba(15, 23, 42, 0.8)",
                border: "1px solid var(--bui-border)",
                borderRadius: "12px",
                padding: "1.5rem",
                animationDelay: "0.2s",
              }}
            >
              <h3
                style={{
                  fontFamily: "var(--font-sketch)",
                  color: "var(--bui-fg-info)",
                  marginBottom: "1rem",
                }}
              >
                Career Stats
              </h3>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-around",
                  color: "var(--color-pencil-light)",
                }}
              >
                <div>
                  <div
                    style={{
                      fontSize: "2rem",
                      fontWeight: "bold",
                      color: "#fff",
                    }}
                  >
                    {totalShows}
                  </div>
                  <div
                    style={{
                      fontSize: "0.8rem",
                      opacity: 0.7,
                      textTransform: "uppercase",
                    }}
                  >
                    Shows Wrapped
                  </div>
                </div>
                <div>
                  <div
                    style={{
                      fontSize: "2rem",
                      fontWeight: "bold",
                      color: "var(--bui-fg-warning)",
                    }}
                  >
                    {totalStars}
                  </div>
                  <div
                    style={{
                      fontSize: "0.8rem",
                      opacity: 0.7,
                      textTransform: "uppercase",
                    }}
                  >
                    Total Stars
                  </div>
                </div>
              </div>
            </div>

            {/* Commendations Panel */}
            {perfectScores.length > 0 && (
              <div
                className="animate-pop"
                style={{
                  background: "rgba(15, 23, 42, 0.8)",
                  border: "1px solid var(--bui-border)",
                  borderRadius: "12px",
                  padding: "1.5rem",
                  animationDelay: "0.5s",
                }}
              >
                <h3
                  style={{
                    fontFamily: "var(--font-sketch)",
                    color: "var(--bui-fg-info)",
                    marginBottom: "1rem",
                  }}
                >
                  Crew Commendations
                </h3>
                <div
                  style={{
                    display: "flex",
                    gap: "0.5rem",
                    justifyContent: "center",
                    flexWrap: "wrap",
                  }}
                >
                  {perfectScores.map(([levelId]) => (
                    <div
                      key={levelId}
                      title="Perfect Run!"
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        width: "40px",
                        height: "40px",
                        background: "rgba(251, 191, 36, 0.1)",
                        border: "2px solid var(--bui-fg-warning)",
                        borderRadius: "50%",
                        fontSize: "1.2rem",
                        boxShadow: "0 0 10px rgba(251, 191, 36, 0.3)",
                      }}
                    >
                      ⭐
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
