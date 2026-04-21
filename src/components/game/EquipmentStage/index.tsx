import { getStageHelpText } from "../../../data/gameData";
import { Character } from "../../../types/game";
import SectionHeader from "../../ui/SectionHeader";
import ActiveLoadoutPanel from "./ActiveLoadoutPanel";
import AvailableGearList from "./AvailableGearList";
import { useEquipment } from "./useEquipment";

// FIXED: Moved static object outside the component to prevent aggressive re-rendering
const DEFAULT_CHAR: Character = {
  id: "default",
  name: "UNKNOWN",
  role: "none",
  department: "lighting",
  bio: "Placeholder character",
  icon: "👤",
  stats: {
    technical: 5,
    social: 5,
    stamina: 5,
  },
};

interface EquipmentStageProps {
  readonly onComplete: () => void;
}

export default function EquipmentStage({ onComplete }: EquipmentStageProps) {
  const { char, handleSelect } = useEquipment(onComplete);

  return (
    <div
      className="page-container animate-blueprint"
      style={{ fontFamily: "var(--font-sketch)" }}
    >
      <SectionHeader
        title="Inventory Logistics"
        subtitle="Select a gear package for this production tier."
        helpText={getStageHelpText("equipment")}
      />

      <ActiveLoadoutPanel char={char || DEFAULT_CHAR} />
      <AvailableGearList handleSelect={handleSelect} />
    </div>
  );
}
