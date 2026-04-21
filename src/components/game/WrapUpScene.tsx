import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useGame } from "../../context/GameContext";
import {
  CHARACTERS,
  Cue,
  POST_SHOW_REVIEWS,
  PRODUCTIONS,
  WRAP_UP_UI_TEXT,
} from "../../data/gameData";
import { calculateStars } from "../../utils/scoringEngine";
import Button from "../ui/Button";
import HardwarePanel from "../ui/HardwarePanel";
import SectionHeader from "../ui/SectionHeader";

interface WrapUpSceneProps {
  cueSheet?: Cue[];
}

export default function WrapUpScene({
  cueSheet = [],
}: Readonly<WrapUpSceneProps>) {
  const { state } = useGame();
  const [phase, setPhase] = useState<"dialogue" | "report">("dialogue");
  const navigate = useNavigate();

  const reportSent = useRef(false);

  const char = CHARACTERS.find((c) => c.id === state.session?.characterId);
  const score = state.session?.score || 0;
  const cuesHit = state.session?.cuesHit || 0;
  const cuesMissed = state.session?.cuesMissed || 0;
  const totalCues = cueSheet.length;

  const stars = calculateStars(state.session, totalCues);

  const getResultColor = (starCount: number): string => {
    if (starCount >= 3) return "var(--bui-fg-success)";
    if (starCount === 2) return "var(--bui-fg-warning)";
    return "var(--bui-fg-danger)";
  };

  const detailedReviewText =
    POST_SHOW_REVIEWS.success[
      stars as keyof typeof POST_SHOW_REVIEWS.success
    ] || POST_SHOW_REVIEWS.success[0];

  const shortHeaderText =
    POST_SHOW_REVIEWS.short_header[
      stars as keyof typeof POST_SHOW_REVIEWS.short_header
    ] || POST_SHOW_REVIEWS.short_header[0];

  useEffect(() => {
    if (phase === "report" && !reportSent.current) {
      const history = JSON.parse(
        sessionStorage.getItem("minion_chats") || "{}",
      );
      if (!history["sys_comms"]) history["sys_comms"] = [];

      const prod = PRODUCTIONS.find(
        (p) => p.id === state.session?.productionId,
      );
      const diffText = state.session?.difficulty
        ? state.session.difficulty.toUpperCase()
        : "UNKNOWN";
      const prodTitle = prod?.title || "Unknown Production";

      const completedQuests = state.session?.completedQuests || [];
      const questText =
        completedQuests.length > 0
          ? ` Quests Completed: ${completedQuests.length}.`
          : "";

      history["sys_comms"].push({
        sender: "System Alerts",
        text: `[POST-MORTEM REPORT] ${prodTitle} - Tier: ${diffText}: Hit ${cuesHit}/${totalCues} Cues. Final Score: ${score}. Rating: ${stars} Stars.${questText}`,
      });

      sessionStorage.setItem("minion_chats", JSON.stringify(history));
      sessionStorage.setItem("unread_messages", "true");
      globalThis.dispatchEvent(new Event("unread_messages_update"));

      reportSent.current = true; // Lock the execution
    }
  }, [phase, cuesHit, totalCues, score, stars, state.session]);

  if (phase === "report") {
    return (
      <div className="page-container animate-pop">
        <SectionHeader
          title={WRAP_UP_UI_TEXT.report_title}
          subtitle={WRAP_UP_UI_TEXT.report_subtitle}
        />

        <HardwarePanel
          style={{
            textAlign: "center",
            padding: "clamp(1.5rem, 5vw, 3rem) clamp(1rem, 4vw, 2rem)",
            maxWidth: "600px",
            margin: "0 auto",
          }}
        >
          <div
            style={{
              fontSize: "clamp(3rem, 10vw, 5rem)",
              marginBottom: "1rem",
              letterSpacing: "clamp(2px, 2vw, 10px)",
            }}
          >
            {[0, 1, 2].map((i) => {
              const starLabels = ["first", "second", "third"];
              const position = starLabels[i];
              return (
                <span
                  key={`star-${position}`}
                  style={{
                    color: i < stars ? "var(--bui-fg-warning)" : "#333",
                    textShadow:
                      i < stars ? "0 0 20px var(--bui-fg-warning)" : "none",
                  }}
                >
                  ★
                </span>
              );
            })}
          </div>

          <h2
            style={{
              fontSize: "clamp(1.5rem, 5vw, 2rem)",
              marginBottom: "2rem",
              fontFamily: "var(--font-mono)",
              color: getResultColor(stars),
            }}
          >
            {shortHeaderText}
          </h2>

          <div
            style={{
              display: "flex",
              justifyContent: "center",
              flexWrap: "wrap",
              gap: "clamp(1.5rem, 5vw, 3rem)",
              marginBottom: "3rem",
            }}
          >
            <div>
              <div
                style={{
                  fontSize: "clamp(2rem, 6vw, 2.5rem)",
                  fontWeight: "bold",
                  color: "var(--bui-fg-success)",
                }}
              >
                {score}
              </div>
              <div className="annotation-text" style={{ opacity: 0.7 }}>
                {WRAP_UP_UI_TEXT.score_label}
              </div>
            </div>
            {totalCues > 0 && (
              <div>
                <div
                  style={{
                    fontSize: "clamp(2rem, 6vw, 2.5rem)",
                    fontWeight: "bold",
                    color:
                      cuesMissed > 0
                        ? "var(--bui-fg-danger)"
                        : "var(--bui-fg-info)",
                  }}
                >
                  {cuesHit}{" "}
                  <span
                    style={{
                      fontSize: "clamp(1rem, 3vw, 1.5rem)",
                      opacity: 0.5,
                    }}
                  >
                    / {totalCues}
                  </span>
                </div>
                <div className="annotation-text" style={{ opacity: 0.7 }}>
                  {WRAP_UP_UI_TEXT.cues_label}
                </div>
              </div>
            )}
          </div>

          <Button
            onClick={() => {
              sessionStorage.removeItem("minion_inventory");
              sessionStorage.removeItem("minion_completed_quests");
              navigate("/");
            }}
            className="btn-xl"
            style={{
              width: "100%",
              background: "var(--bui-fg-info)",
              color: "#000",
            }}
          >
            {WRAP_UP_UI_TEXT.sign_out_btn}
          </Button>
        </HardwarePanel>
      </div>
    );
  }

  // DIALOGUE PHASE
  return (
    <div
      className="page-container animate-blueprint"
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "60vh",
      }}
    >
      <div style={{ textAlign: "center", maxWidth: "600px", width: "100%" }}>
        <div
          style={{
            fontSize: "clamp(4rem, 15vw, 6rem)",
            filter: "drop-shadow(0 10px 20px rgba(0,0,0,0.5))",
          }}
        >
          {char?.icon || "👤"}
        </div>
        <HardwarePanel
          style={{
            marginTop: "2rem",
            padding: "clamp(1rem, 4vw, 2rem)",
            background: "rgba(15, 23, 42, 0.9)",
          }}
        >
          <h2
            className="annotation-text"
            style={{ color: "var(--bui-fg-warning)", marginBottom: "1rem" }}
          >
            {WRAP_UP_UI_TEXT.dialogue_title}
          </h2>
          <p
            style={{
              fontSize: "clamp(1rem, 3vw, 1.2rem)",
              lineHeight: "1.6",
              color: "var(--color-pencil-light)",
            }}
          >
            "{detailedReviewText}"
          </p>
          <div style={{ marginTop: "2rem" }}>
            <Button
              onClick={() => setPhase("report")}
              style={{ width: "100%" }}
            >
              {WRAP_UP_UI_TEXT.dialogue_btn}
            </Button>
          </div>
        </HardwarePanel>
      </div>
    </div>
  );
}
