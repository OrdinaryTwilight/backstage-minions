import SectionHeader from "../../shared/ui/SectionHeader";
import ActiveLoadoutPanel from "./ActiveLoadoutPanel";
import AvailableGearList from "./AvailableGearList";
import { useEquipment } from "./useEquipment";

interface EquipmentStageProps {
  readonly onComplete: () => void;
}

export default function EquipmentStage({ onComplete }: EquipmentStageProps) {
  const { char, handleSelect } = useEquipment(onComplete);

  return (
    <div className="page-container animate-blueprint">
      <SectionHeader
        title="Inventory Logistics"
        subtitle="Select a gear package for this production tier."
        helpText="Choose your gear wisely. Higher quality gear provides score bonuses but may reduce your starting 'Lives'."
      />

      {/* Only render if 'char' is defined */}
      {char ? (
        <>
          <ActiveLoadoutPanel char={char} />
          <AvailableGearList handleSelect={handleSelect} />
        </>
      ) : (
        <p>Loading character data...</p> // or some fallback UI if 'char' is undefined
      )}
    </div>
  );
}
