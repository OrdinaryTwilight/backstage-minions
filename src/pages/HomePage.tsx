import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../components/ui/Button";
import HardwarePanel from "../components/ui/HardwarePanel";
import { useGame } from "../context/GameContext";
import { COMMENDATION_PRAISE, PRODUCTIONS } from "../data/gameData";
import { useSaveManager } from "../hooks/useSaveManager";

// Helper function to decode the "phantom_school" ID back into UI-friendly details
const getProductionDetails = (levelId: string) => {
  for (const prod of PRODUCTIONS) {
    for (const diff of ["school", "community", "professional"]) {
      if (levelId === `${prod.id}_${diff}`) {
        return { prod, difficulty: diff };
      }
    }
  }
  return null;
};

export default function HomePage() {
  const navigate = useNavigate();
  const { state: gameState } = useGame();

  const {
    fileInputRef,
    ioFeedback: uploadFeedback,
    handleImportSave,
  } = useSaveManager();

  const hasUnread =
    gameState.unreadContacts && gameState.unreadContacts.length > 0;

  const perfectScores = Object.entries(gameState.progress || {}).filter(
    ([, prog]) => prog.stars === 3,
  );

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

          {/* ACTION BUTTONS */}
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
              onClick={() => {
                if (hasActiveSession) {
                  navigate(
                    `/game/${gameState.session?.productionId}/${gameState.session?.difficulty}/${gameState.session?.characterId}`,
                  );
                } else if (gameState.hasSeenIntro) {
                  navigate("/productions"); // Route veterans straight to the list
                } else {
                  navigate("/intro");
                }
              }}
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

            {/* UX ADDITION: Quick Load Save Button */}
            <Button
              className="btn-xl"
              variant="default"
              style={{
                fontFamily: "var(--font-sketch)",
                fontSize: "1.25rem",
                background: "rgba(255,255,255,0.1)",
              }}
              onClick={() => fileInputRef.current?.click()}
            >
              Load Game
            </Button>

            <input
              type="file"
              accept=".json"
              ref={fileInputRef}
              style={{ display: "none" }}
              onChange={handleImportSave}
              tabIndex={-1}
            />
          </div>

          <div
            aria-live="polite"
            style={{ minHeight: "1.5rem", marginTop: "1.5rem" }}
          >
            {uploadFeedback && (
              <span
                style={{
                  color:
                    uploadFeedback.type === "success"
                      ? "var(--bui-fg-success)"
                      : "var(--bui-fg-danger)",
                  fontFamily: "var(--font-mono)",
                  fontSize: "0.9rem",
                  background:
                    uploadFeedback.type === "success"
                      ? "rgba(74, 222, 128, 0.1)"
                      : "rgba(248, 113, 113, 0.1)",
                  padding: "0.5rem 1rem",
                  borderRadius: "4px",
                  border: `1px solid ${uploadFeedback.type === "success" ? "var(--bui-fg-success)" : "var(--bui-fg-danger)"}`,
                }}
              >
                {uploadFeedback.msg}
              </span>
            )}
          </div>
        </HardwarePanel>

        {/* CAREER STATS & ACHIEVEMENTS */}
        {(totalShows > 0 || perfectScores.length > 0) && (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
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
                    marginBottom: "1.5rem",
                  }}
                >
                  Crew Commendations
                </h3>

                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "1rem",
                  }}
                >
                  {perfectScores.map(([levelId]) => {
                    const details = getProductionDetails(levelId);
                    if (!details) return null;
                    const { prod, difficulty } = details;

                    // Seed a random but consistent praise quote based on the level ID
                    const quoteIndex =
                      levelId
                        .split("")
                        .reduce(
                          (acc, char) => acc + (char.codePointAt(0) ?? 0),
                          0,
                        ) % COMMENDATION_PRAISE.length;
                    const quote = COMMENDATION_PRAISE[quoteIndex];

                    return (
                      <div
                        key={levelId}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "1.2rem",
                          background: "rgba(0,0,0,0.3)",
                          padding: "1rem",
                          borderRadius: "8px",
                          borderLeft: "4px solid var(--bui-fg-warning)",
                        }}
                      >
                        <div
                          style={{
                            fontSize: "2.5rem",
                            filter:
                              "drop-shadow(0 0 5px rgba(255,255,255,0.2))",
                          }}
                        >
                          {prod.poster}
                        </div>

                        <div style={{ flex: 1, textAlign: "left" }}>
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "0.5rem",
                              marginBottom: "0.25rem",
                              flexWrap: "wrap",
                            }}
                          >
                            <strong
                              style={{
                                color: "#fff",
                                fontSize: "1.1rem",
                                fontFamily: "var(--font-sketch)",
                              }}
                            >
                              {prod.title}
                            </strong>
                            <span
                              style={{
                                fontSize: "0.75rem",
                                background: "rgba(255,255,255,0.1)",
                                padding: "2px 6px",
                                borderRadius: "4px",
                                textTransform: "uppercase",
                                color: "var(--color-pencil-light)",
                              }}
                            >
                              {difficulty}
                            </span>
                          </div>
                          <div
                            style={{
                              fontSize: "0.9rem",
                              color: "var(--bui-fg-info)",
                              fontStyle: "italic",
                              fontFamily: "var(--font-mono)",
                            }}
                          >
                            "{quote}"
                          </div>
                        </div>

                        <div
                          style={{
                            display: "flex",
                            gap: "2px",
                            color: "var(--bui-fg-warning)",
                            fontSize: "1.2rem",
                            textShadow: "0 0 10px rgba(251, 191, 36, 0.5)",
                          }}
                        >
                          ⭐⭐⭐
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
