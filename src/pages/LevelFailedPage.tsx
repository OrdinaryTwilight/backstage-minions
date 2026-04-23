/**
 * @file Level Failed Page
 * @description Shown when player runs out of lives during a level.
 * 
 * Failure Screen displays:
 * - Department-specific failure scenario
 * - Option to retry the level
 * - Option to return to home/productions
 * - Clears session and session storage on navigation
 * 
 * @page
 */

import { useNavigate } from "react-router-dom";
import { useGame } from "../context/GameContext";
import { CHARACTERS } from "../data/gameData";
import { POST_SHOW_REVIEWS } from "../data/reviews";

export default function LevelFailedPage() {
  const { state, dispatch } = useGame();
  const navigate = useNavigate();

  const handleBackToHome = () => {
    dispatch({ type: "CLEAR_SESSION" });
    sessionStorage.removeItem("minion_inventory");
    sessionStorage.removeItem("minion_completed_quests");
    sessionStorage.removeItem("minion_chats");
    navigate("/");
  };

  const handleTryAgain = () => {
    dispatch({ type: "CLEAR_SESSION" });
    sessionStorage.removeItem("minion_inventory");
    sessionStorage.removeItem("minion_completed_quests");
    sessionStorage.removeItem("minion_chats");
    navigate("/productions");
  };

  const playerChar = CHARACTERS.find(
    (c) => c.id === state.session?.characterId,
  );
  const dept = playerChar?.department?.toLowerCase() || "default";
  const failureText =
    POST_SHOW_REVIEWS.failure[dept as keyof typeof POST_SHOW_REVIEWS.failure] ||
    POST_SHOW_REVIEWS.failure.default;

  return (
    <div
      data-testid="level-failed-page-container"
      className="page-container"
      style={{ textAlign: "center", paddingTop: "4rem" }}
    >
      <h1
        style={{ fontSize: "2.5rem", color: "#ef4444", marginBottom: "1rem" }}
      >
        💔 Show stopped
      </h1>
      <p
        style={{
          color: "var(--text-muted)",
          fontSize: "1.1rem",
          lineHeight: "1.6",
          marginBottom: "3rem",
        }}
      >
        {failureText}
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        <button
          type="button"
          onClick={handleTryAgain}
          className="action-button btn-success"
        >
          Try Again
        </button>
        <button
          type="button"
          onClick={handleBackToHome}
          className="action-button"
          style={{ background: "var(--surface2)", color: "white" }}
        >
          Back to Home
        </button>
      </div>
    </div>
  );
}
