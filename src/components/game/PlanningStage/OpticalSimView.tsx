import { LIGHT_TYPES, PLOT_GRID_COLS } from "../../../data/gameData";
import HardwarePanel from "../../ui/HardwarePanel";

export default function OpticalSimView({ grid }: Readonly<{ grid: any[] }>) {
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
          {/* Beams */}
          {grid.map((cell, i) => {
            if (!cell) return null;
            const type = LIGHT_TYPES.find((t) => t.id === cell.typeId);
            if (!type) return null;
            const isSpot = type.id === "spot";
            return (
              <div
                key={`sim-beam-${i}`}
                style={{
                  position: "absolute",
                  left: `${((i % PLOT_GRID_COLS) / (PLOT_GRID_COLS - 1)) * 100}%`,
                  top: "0",
                  bottom: "25%",
                  width: isSpot ? "12px" : "45px",
                  height: "100%",
                  background: `linear-gradient(to bottom, ${type.color}66, transparent)`,
                  clipPath: "polygon(50% 0%, 0% 100%, 100% 100%)",
                  transform: "translateX(-50%)",
                  opacity: 0.5,
                  filter: `blur(${isSpot ? "1px" : "12px"})`,
                  zIndex: 1,
                  transition: "all 0.3s ease",
                }}
              />
            );
          })}
          {/* Floor Pools */}
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
              return (
                <div
                  key={`sim-pool-${i}`}
                  style={{
                    position: "absolute",
                    left: `${((i % PLOT_GRID_COLS) / (PLOT_GRID_COLS - 1)) * 100}%`,
                    bottom: "25%",
                    width: type.id === "spot" ? "12px" : "45px",
                    height: "8px",
                    background: type.color,
                    borderRadius: "50%",
                    filter: "blur(5px)",
                    transform: "translateX(-50%)",
                    boxShadow: `0 0 20px ${type.color}`,
                    transition: "all 0.3s ease",
                  }}
                />
              );
            })}
          </div>
        </div>
      </HardwarePanel>
    </section>
  );
}
