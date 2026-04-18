import { Cue } from "../../../data/types";
import Button from "../../ui/Button";

interface CueTimelineHUDProps {
  smMessage: string;
  elapsedMs: number;
  maxShowTime: number;
  cueSheet: Cue[];
  currentIdx: number;
  cueResults: Record<string, { hit: boolean }>;
  isReady: boolean;
  handleReady: () => void;
}

export default function CueTimelineHUD({
  smMessage,
  elapsedMs,
  maxShowTime,
  cueSheet,
  currentIdx,
  cueResults,
  isReady,
  handleReady,
}: Readonly<CueTimelineHUDProps>) {
  return (
    <div
      style={{
        position: "sticky",
        top: "0px",
        zIndex: 1000,
        marginBottom: "2rem",
        padding: "1rem",
        background: "rgba(15, 23, 42, 0.95)",
        borderRadius: "0 0 8px 8px",
        borderBottom: "2px solid var(--bui-fg-info)",
        borderLeft: "2px solid var(--bui-fg-info)",
        borderRight: "2px solid var(--bui-fg-info)",
        backdropFilter: "blur(10px)",
        boxShadow: "0 10px 20px rgba(0,0,0,0.5)",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "10px",
          marginBottom: "1rem",
        }}
      >
        <div
          style={{
            display: "flex",
            gap: "10px",
            alignItems: "center",
            background: "#000",
            padding: "8px",
            borderRadius: "4px",
            border: "1px solid #333",
          }}
        >
          <div
            style={{
              background: "var(--bui-fg-danger)",
              color: "#fff",
              padding: "2px 6px",
              borderRadius: "4px",
              fontSize: "0.8rem",
              fontWeight: "bold",
            }}
          >
            SM COMMS
          </div>
          <div
            style={{
              color: "var(--color-pencil-light)",
              fontFamily: "var(--font-mono)",
              flex: 1,
            }}
          >
            {smMessage}
          </div>
          {isReady && (
            <div
              style={{
                color: "var(--bui-fg-info)",
                fontWeight: "bold",
                fontFamily: "var(--font-mono)",
                minWidth: "60px",
                textAlign: "right",
              }}
            >
              {(elapsedMs / 1000).toFixed(1)}s
            </div>
          )}
        </div>
        {!isReady && (
          <div>
            <Button
              onClick={handleReady}
              style={{
                display: "inline-block",
                padding: "6px 16px",
                background: "var(--bui-fg-success)",
                color: "#000",
                fontSize: "0.9rem",
                fontWeight: "bold",
              }}
            >
              "I'm Patched and Ready, SM." (Start Show)
            </Button>
          </div>
        )}
      </div>

      <div
        style={{
          position: "relative",
          width: "100%",
          height: "20px",
          background: "#222",
          borderRadius: "4px",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            left: `${(elapsedMs / maxShowTime) * 100}%`,
            top: 0,
            bottom: 0,
            width: "3px",
            background: "var(--bui-fg-info)",
            zIndex: 10,
            boxShadow: "0 0 10px var(--bui-fg-info)",
          }}
        />
        {cueSheet.map((cue, i) => {
          const isPast = i < currentIdx;
          const isCurrent = i === currentIdx;
          const leftPct = (cue.targetMs / maxShowTime) * 100;
          const windowWidthPct = ((cue.windowMs || 1000) / maxShowTime) * 100;

          // Extract styles and conditions
          const cueBackground = isCurrent
            ? "rgba(251, 191, 36, 0.2)"
            : "transparent";

          const circleSize = isCurrent ? "12px" : "8px";
          let circleColor;
          if (isPast) {
            circleColor = cueResults[cue.id]?.hit
              ? "var(--bui-fg-success)"
              : "var(--bui-fg-danger)";
          } else if (isCurrent) {
            circleColor = "var(--bui-fg-warning)";
          } else {
            circleColor = "#555";
          }

          const borderStyle = isCurrent ? "2px solid #fff" : "none";
          const boxShadow = isCurrent
            ? "0 0 10px var(--bui-fg-warning)"
            : "none";

          const widthStyle = `${windowWidthPct}vw`;

          return (
            <div
              key={cue.id}
              style={{
                position: "absolute",
                left: `${leftPct}%`,
                top: "50%",
                transform: "translate(-50%, -50%)",
                zIndex: 5,
              }}
            >
              <div
                style={{
                  position: "absolute",
                  left: "50%",
                  top: "50%",
                  transform: "translate(-50%, -50%)",
                  width: widthStyle,
                  maxWidth: "40px",
                  height: "20px",
                  background: cueBackground,
                }}
              />
              <div
                style={{
                  width: circleSize,
                  height: circleSize,
                  borderRadius: "50%",
                  background: circleColor,
                  border: borderStyle,
                  boxShadow: boxShadow,
                }}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
