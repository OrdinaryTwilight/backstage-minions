import { useGame } from "../../context/GameContext";
import { GEAR_PACKAGES } from "../../data/gameData";
import HardwarePanel from "../ui/HardwarePanel";
import SectionHeader from "../ui/SectionHeader";

export default function EquipmentStage({ onComplete }) {
  const { dispatch } = useGame();

  function handleSelect(pkg) {
    // Save selection to state
    dispatch({ type: "SET_GEAR", gearId: pkg.id });
    // Advance to the next stage (Planning)
    onComplete();
  }

  return (
    <div className="page-container animate-blueprint">
      <SectionHeader
        title="Inventory Logistics"
        subtitle="Select a gear package for this production tier."
      />

      <div className="bento-container">
        {GEAR_PACKAGES.map((pkg) => (
          <HardwarePanel
            key={pkg.id}
            variant="clickable"
            /* FIX: Pass a function reference, do not call it immediately */
            onClick={() => handleSelect(pkg)}
          >
            <h3 className="annotation-text" style={{ fontSize: "1.4rem" }}>
              {pkg.label}
            </h3>
            <p style={{ margin: "1rem 0", opacity: 0.8 }}>{pkg.description}</p>
            <div
              style={{
                fontSize: "0.7rem",
                color: "var(--bui-fg-info)",
                textTransform: "uppercase",
              }}
            >
              Bonus: {pkg.bonus > 0 ? `+${pkg.bonus}` : pkg.bonus} pts
            </div>
          </HardwarePanel>
        ))}
      </div>
    </div>
  );
}
