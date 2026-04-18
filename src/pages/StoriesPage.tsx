// src/pages/StoriesPage.jsx
import { useState } from "react";
import HardwarePanel from "../components/ui/HardwarePanel";
import NavBar from "../components/ui/NavBar";
import SectionHeader from "../components/ui/SectionHeader";
import { useGame } from "../context/GameContext";
import { STORIES } from "../data/gameData";
import type { Story } from "../types/game";

export default function StoriesPage() {
  const { state } = useGame();
  const [selected, setSelected] = useState<Story | null>(null);

  const unlocked = STORIES.filter((s) =>
    state?.unlockedStories?.includes(s.id),
  );
  const locked = STORIES.filter((s) => !state?.unlockedStories?.includes(s.id));

  return (
    <div className="page-container">
      <NavBar />

      {/* Wrapper for the animation so it doesn't break the Navbar */}
      <div className="content-reveal">
        <SectionHeader
          title="Technical Lore"
          subtitle="Deep dives into the technical theatre archives."
        />

        {selected ? (
          <HardwarePanel style={{ position: "relative" }}>
            <button
              onClick={() => setSelected(null)}
              className="action-button"
              style={{ marginBottom: "1.5rem" }}
              aria-label="Return to story index"
            >
              ← Return to Index
            </button>
            <h2
              className="annotation-text"
              style={{ fontSize: "1.8rem", marginBottom: "1rem" }}
            >
              {selected.title}
            </h2>
            <article
              style={{
                whiteSpace: "pre-wrap",
                lineHeight: "1.8",
                opacity: 0.9,
              }}
              aria-label={`Story: ${selected.title}`}
            >
              {selected.content}
            </article>
          </HardwarePanel>
        ) : (
          <>
            <section style={{ marginBottom: "2.5rem" }}>
              <h2
                className="annotation-text"
                style={{ color: "var(--bui-fg-success)", marginBottom: "1rem" }}
              >
                Available Records
              </h2>
              <div className="bento-container">
                {unlocked.map((s) => (
                  <HardwarePanel
                    key={s.id}
                    variant="clickable"
                    onClick={() => setSelected(s)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e: React.KeyboardEvent<HTMLDivElement>) => {
                      if (e.key === "Enter" || e.key === " ") {
                        setSelected(s);
                      }
                    }}
                    aria-label={`Read story: ${s.title}. ${s.content.slice(0, 100)}...`}
                  >
                    <h3 style={{ margin: "0 0 0.5rem 0" }}>{s.title}</h3>
                    <p style={{ fontSize: "0.85rem", opacity: 0.7 }}>
                      {s.content.slice(0, 100)}…
                    </p>
                  </HardwarePanel>
                ))}
              </div>
            </section>

            <section>
              <h2
                className="annotation-text"
                style={{ opacity: 0.5, marginBottom: "1rem" }}
              >
                Classified Data
              </h2>
              <div className="bento-container">
                {locked.map((s) => (
                  <HardwarePanel
                    key={s.id}
                    variant="locked"
                    style={{ opacity: 0.4 }}
                    aria-disabled="true"
                    aria-label={`Locked story: ${s.title}. Requires ${s.unlockedBy.difficulty} difficulty with ${s.unlockedBy.minStars} stars to unlock.`}
                  >
                    <h3 style={{ margin: 0 }}>🔒 {s.title}</h3>
                    <p style={{ fontSize: "0.75rem", marginTop: "8px" }}>
                      Clearance: {s.unlockedBy.difficulty} /{" "}
                      {s.unlockedBy.minStars}★
                    </p>
                  </HardwarePanel>
                ))}
              </div>
            </section>
          </>
        )}
      </div>
    </div>
  );
}
