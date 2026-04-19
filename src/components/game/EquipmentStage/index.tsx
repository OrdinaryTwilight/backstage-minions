import { getStageHelpText } from "../../../data/gameData";
import { Character } from "../../../types/game";
import SectionHeader from "../../ui/SectionHeader";
import ActiveLoadoutPanel from "./ActiveLoadoutPanel";
import AvailableGearList from "./AvailableGearList";
import { useEquipment } from "./useEquipment";

interface EquipmentStageProps {
  readonly onComplete: () => void;
}

export default function EquipmentStage({ onComplete }: EquipmentStageProps) {
  const { char, handleSelect } = useEquipment(onComplete);
  const defaultChar: Character = {
    id: "default",
    name: "UNKNOWN",
    role: "none",
    department: "lighting", // Provide a default department
    bio: "Placeholder character",
    icon: "👤",
    stats: {
      technical: 5,
      social: 5,
      stamina: 5,
    },
  };

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

      <ActiveLoadoutPanel char={char || defaultChar} />
      <AvailableGearList handleSelect={handleSelect} />
    </div>
  );
}
