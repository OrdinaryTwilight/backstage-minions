import { LIGHT_TYPES, PLOT_GRID_COLS } from "../../../data/gameData";
import HardwarePanel from "../../ui/HardwarePanel";

// Generates precise SVG masks for realistic light projection
const getGoboMask = (gobo: string) => {
  let svg = "";
  switch (gobo) {
    case "window":
      // 4-pane window frame
      svg =
        '<svg width="100" height="100" xmlns="http://www.w3.org/2000/svg"><rect x="15" y="15" width="30" height="30" fill="black"/><rect x="55" y="15" width="30" height="30" fill="black"/><rect x="15" y="55" width="30" height="30" fill="black"/><rect x="55" y="55" width="30" height="30" fill="black"/></svg>';
      break;
    case "stars":
      // 4 distinct 5-point stars
      svg =
        '<svg width="100" height="100" xmlns="http://www.w3.org/2000/svg"><polygon points="25,5 15,35 40,15 10,15 35,35" fill="black"/><polygon points="75,55 65,85 90,65 60,65 85,85" fill="black"/><polygon points="80,10 70,30 90,15 65,15 85,30" fill="black"/><polygon points="20,70 10,90 35,75 5,75 30,90" fill="black"/></svg>';
      break;
    case "leaves":
      // Organic dappled light / foliage breakup
      svg =
        '<svg width="100" height="100" xmlns="http://www.w3.org/2000/svg"><circle cx="25" cy="25" r="15" fill="black"/><circle cx="75" cy="20" r="18" fill="black"/><circle cx="80" cy="75" r="20" fill="black"/><circle cx="25" cy="80" r="15" fill="black"/><circle cx="50" cy="50" r="22" fill="black"/><circle cx="15" cy="50" r="10" fill="black"/><circle cx="85" cy="45" r="12" fill="black"/><circle cx="50" cy="15" r="10" fill="black"/><circle cx="50" cy="85" r="12" fill="black"/></svg>';
      break;
    case "fire":
      // Jagged flames rising from the bottom
      svg =
        '<svg width="100" height="100" xmlns="http://www.w3.org/2000/svg"><path d="M15,100 Q20,60 30,30 Q40,60 45,100 Z M40,100 Q45,50 55,10 Q65,50 70,100 Z M65,100 Q70,55 80,25 Q90,55 95,100 Z" fill="black"/></svg>';
      break;
    default:
      return "none";
  }
  return `url('data:image/svg+xml;utf8,${encodeURIComponent(svg)}')`;
};

export default function OpticalSimView({
  grid,
}: Readonly<{ grid: ({ typeId: string; gobo?: string | null } | null)[] }>) {
  return (
    <section>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          padding: "0 1rem 0.5rem",
          fontSize: "0.65rem",
          opacity: 0.6,
        }}
      >
        <span>[ STAGE RIGHT ]</span>
        <span className="annotation-text">OPTICAL_SIM_REPL</span>
        <span>[ STAGE LEFT ]</span>
      </div>
      <HardwarePanel
        style={{
          height: "100%",
          background: "#050505",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "relative",
            height: "280px",
            marginTop: "0.5rem",
            background: "rgba(255,255,255,0.02)",
            borderRadius: "4px",
          }}
        >
          {/* BEAMS */}
          {grid.map((cell, i) => {
            if (!cell) return null;
            const type = LIGHT_TYPES.find((t) => t.id === cell.typeId);
            if (!type) return null;
            const isSpot = type.id === "spot";

            return (
              <div
                key={`sim-beam-container-${cell.typeId}-${i}`}
                style={{
                  position: "absolute",
                  left: `${((i % PLOT_GRID_COLS) / (PLOT_GRID_COLS - 1)) * 100}%`,
                  top: "0",
                  bottom: "25%",
                  width: isSpot ? "16px" : "45px",
                  transform: "translateX(-50%)",
                  zIndex: 1,
                  clipPath: "polygon(50% 0%, 0% 100%, 100% 100%)",
                }}
              >
                {/* Volumetric Beam */}
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    background: `linear-gradient(to bottom, ${type.color}88, transparent)`,
                    filter: `blur(${isSpot ? "2px" : "12px"})`,
                    WebkitMaskImage: cell.gobo
                      ? getGoboMask(cell.gobo)
                      : "none",
                    WebkitMaskSize: "100% 200%",
                    WebkitMaskPosition: "top center",
                    transition: "all 0.3s ease",
                  }}
                />
              </div>
            );
          })}

          {/* FLOOR POOLS */}
          <div
            style={{
              position: "absolute",
              bottom: 0,
              width: "100%",
              height: "20%",
              zIndex: 2,
            }}
          >
            {grid.map((cell, i) => {
              if (!cell) return null;
              const type = LIGHT_TYPES.find((t) => t.id === cell.typeId);
              if (!type) return null;
              const isSpot = type.id === "spot";

              return (
                <div
                  key={`sim-pool-container-${cell.typeId}-${i}`}
                  style={{
                    position: "absolute",
                    left: `${((i % PLOT_GRID_COLS) / (PLOT_GRID_COLS - 1)) * 100}%`,
                    bottom: "25%",
                    width: isSpot ? "25px" : "45px",
                    height: isSpot ? "25px" : "16px",
                    transform: "translateX(-50%)",
                  }}
                >
                  {/* Ambient Light Bounce */}
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      background: type.color,
                      borderRadius: "50%",
                      filter: "blur(10px)",
                      opacity: 0.3,
                    }}
                  />

                  {/* Sharp Gobo Projection */}
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      background: type.color,
                      borderRadius: cell.gobo ? "0" : "50%",
                      filter: cell.gobo ? "blur(1px)" : "blur(4px)",
                      WebkitMaskImage: cell.gobo
                        ? getGoboMask(cell.gobo)
                        : "none",
                      WebkitMaskSize: "contain",
                      WebkitMaskRepeat: "no-repeat",
                      WebkitMaskPosition: "center",
                      boxShadow: cell.gobo ? "none" : `0 0 15px ${type.color}`,
                      transition: "all 0.3s ease",
                    }}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </HardwarePanel>
    </section>
  );
}
