import { LIGHT_TYPES, PLOT_GRID_COLS } from "../../../data/gameData";
import HardwarePanel from "../../shared/panels/HardwarePanel";

export default function PlotPlanView({
  grid,
  placeLight,
}: Readonly<{
  grid: any[];
  placeLight: (i: number) => void;
}>) {
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
        <span className="annotation-text">PLOT_PLAN_VIEW</span>
        <span>[ STAGE LEFT ]</span>
      </div>
      <HardwarePanel style={{ borderLeft: "4px solid var(--bui-fg-info)" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: `repeat(${PLOT_GRID_COLS}, 1fr)`,
            gap: "8px",
          }}
        >
          {grid.map((cell, i) => {
            const lt = cell
              ? LIGHT_TYPES.find((t) => t.id === cell.typeId)
              : null;
            return (
              <button
                key={`plot-cell-${i}`}
                onClick={() => placeLight(i)}
                className="plot-cell"
                style={{
                  background: lt ? `${lt.color}22` : "rgba(0,0,0,0.1)",
                  borderColor: lt ? lt.color : "var(--glass-border)",
                  aspectRatio: "1",
                }}
              >
                {lt ? lt.icon : ""}
              </button>
            );
          })}
        </div>
      </HardwarePanel>
    </section>
  );
}
