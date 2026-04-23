/**
 * @file Equipment Stage (Gear Selection)
 * @description Opening stage where players select equipment package.
 * Equipment choice affects difficulty multiplier for entire session.
 * 
 * Equipment Packages:
 * - **Budget Surplus**: Harder (0.8x multiplier, narrower cue windows)
 * - **Standard Rental**: Normal difficulty (1.0x multiplier)
 * - **Premium State-of-the-Art**: Easier (1.2x multiplier, wider cue windows)
 * 
 * Mechanics:
 * - Display selected character's loadout
 * - Show available gear packages
 * - Set difficulty multiplier before main show begins
 * - Cost/benefit trade-off encourages strategy
 * 
 * @component
 */

import { getStageHelpText } from "../../../data/gameData";
import { Character } from "../../../types/game";
import SectionHeader from "../../ui/SectionHeader";
import ActiveLoadoutPanel from "./ActiveLoadoutPanel";
import AvailableGearList from "./AvailableGearList";
import { useEquipment } from "./useEquipment";

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
