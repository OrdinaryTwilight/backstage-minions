/**
 * @file Stage Viewport Component
 * @description Renders a visual representation of theater stage lighting during Cue Execution and Planning stages.
 * Shows stage floor with animated light beams to provide visual feedback during timing-based minigames.
 * 
 * Visual Representation:
 * - Stage floor (black strip at bottom)
 * - Light beams (vertical gradients representing different light types)
 * - Positioned based on light fixture arrangement
 * - Different colors/styles for different light types (Fader, Par, Spot, etc.)
 * 
 * @component
 */

interface StageViewportProps {
  lights: ({ typeId: string } | null)[]; 
  cues: { id: string }[];
  currentCueIndex: number;
}

/**
 * StageViewport Component
 * Displays stage lighting visualization with animated beams.
 * Part of the Cue Execution and Planning stage UIs.
 */
export default function StageViewport({
  lights = [],
  cues = [],
  currentCueIndex,
}: Readonly<StageViewportProps>) {
  const currentCue = cues[currentCueIndex];

  return (
    <div className="stage-viewport tech-glow" style={{ marginBottom: "2rem" }}>
      <div
        className="booth-frame"
        style={{
          position: "relative",
          height: "200px",
          background: "#050505",
          border: "2px solid #333",
          overflow: "hidden",
        }}
      >
        <div
          className="stage-floor"
          style={{
            position: "absolute",
            bottom: 0,
            width: "100%",
            height: "20px",
            background: "#111",
          }}
        />

        {lights.map(
          (l, i) =>
            l && (
              <div
                key={`light-${l.typeId}-${i}`}
                className={`beam beam-${l.typeId}`}
                style={{
                  position: "absolute",
                  left: `${(i % 5) * 20 + 10}%`,
                  top: 0,
                  width: "15%",
                  height: "100%",
                  background:
                    "linear-gradient(to bottom, rgba(255,255,255,0.1), transparent)",
                  clipPath: "polygon(50% 0%, 0% 100%, 100% 100%)",
                  opacity: 0.3,
                }}
              />
            ),
        )}

        <div
          className="viewport-overlay"
          style={{
            position: "absolute",
            top: "10px",
            left: "10px",
            right: "10px",
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <span className="annotation-text" style={{ fontSize: "0.6rem" }}>
            [ LIVE_FEED_CAM_01 ]
          </span>
          {currentCue && (
            <span
              className="annotation-text"
              style={{ fontSize: "0.6rem", color: "var(--bui-fg-warning)" }}
            >
              ACTIVE_CUE: {currentCue.id}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
