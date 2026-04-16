// src/components/game/EquipmentStage.jsx
import { GEAR_PACKAGES } from "../../data/gameData";

export default function EquipmentStage({ onSelect }) {
  return (
    <div className="hardware-panel">
      <h2 style={{ color: "var(--bui-fg-info)" }}>
        🚚 Load-In: Gear Selection
      </h2>
      <p style={{ marginBottom: "1.5rem" }}>
        Choose your equipment package for this production.
      </p>

      <div className="bento-container">
        {GEAR_PACKAGES.map((pkg) => (
          <div
            key={pkg.id}
            className="surface-panel"
            style={{ textAlign: "center" }}
          >
            <h3 style={{ color: "var(--bui-fg-success)" }}>{pkg.label}</h3>
            <p style={{ fontSize: "0.85rem", minHeight: "3rem" }}>
              {pkg.description}
            </p>
            <div
              style={{
                margin: "1rem 0",
                fontSize: "0.8rem",
                color: "var(--color-architect-blue)",
              }}
            >
              {pkg.bonus > 0
                ? `+${pkg.bonus} Difficulty Bonus`
                : `${pkg.bonus} Point Cost`}
            </div>
            <button
              className="action-button"
              style={{ width: "100%" }}
              onClick={() => onSelect(pkg)}
            >
              Select Gear
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
