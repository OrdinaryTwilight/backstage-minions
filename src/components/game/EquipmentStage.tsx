import { useGame } from "../../context/GameContext";
import { CHARACTERS, GEAR_PACKAGES } from "../../data/gameData"; // Import CHARACTERS
import HardwarePanel from "../ui/HardwarePanel";
import SectionHeader from "../ui/SectionHeader";

interface EquipmentStageProps {
  onComplete: () => void;
}

export default function EquipmentStage({ onComplete }: EquipmentStageProps) {
  const { state, dispatch } = useGame();

  // Find the active character to display their RPG icon
  const char = CHARACTERS.find(c => c.id === state.session?.characterId);

  function handleSelect(pkg: typeof GEAR_PACKAGES[0]) {
    dispatch({ type: "SET_GEAR", gearId: pkg.id });
    onComplete();
  }

  return (
    <div className="page-container animate-blueprint">
      <SectionHeader
        title="Inventory Logistics"
        subtitle="Select a gear package for this production tier."
        helpText="Choose your gear wisely. Higher quality gear provides score bonuses but may reduce your starting 'Lives'."
      />
      
      <div className="rpg-scene-header" style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
        {/* Added safety check for char */}
        <span className="walking-icon" style={{ fontSize: '2.5rem' }}>{char?.icon || "👤"}</span>
        <div>
          <p className="annotation-text" style={{ margin: 0 }}>OPERATOR: {char?.name?.toUpperCase() || "UNKNOWN"}</p>
          <p className="annotation-text" style={{ opacity: 0.5, fontSize: '0.7rem' }}>LOCATION: WESTVIEW_LOADING_DOCK</p>
        </div>
      </div>

      <div className="bento-container">
        {GEAR_PACKAGES.map((pkg) => (
          <HardwarePanel
            key={pkg.id}
            variant="clickable"
            onClick={() => handleSelect(pkg)}
          >
            <h3 className="annotation-text" style={{ fontSize: "1.4rem" }}>{pkg.label}</h3>
            <p style={{ margin: "1rem 0", opacity: 0.8 }}>{pkg.description}</p>
            <div style={{ fontSize: "0.7rem", color: "var(--bui-fg-info)", textTransform: "uppercase" }}>
              Bonus: {pkg.bonus > 0 ? `+${pkg.bonus}` : pkg.bonus} pts
            </div>
          </HardwarePanel>
        ))}
      </div>
    </div>
  );
}