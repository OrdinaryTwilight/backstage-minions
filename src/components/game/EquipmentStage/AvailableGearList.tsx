import { GEAR_PACKAGES } from "../../../data/gameData";
import HardwarePanel from "../../shared/panels/HardwarePanel";

interface AvailableGearListProps {
  handleSelect: (pkgId: string) => void;
}

export default function AvailableGearList({
  handleSelect,
}: Readonly<AvailableGearListProps>) {
  return (
    <div className="bento-container">
      {GEAR_PACKAGES.map((pkg) => (
        <HardwarePanel
          key={pkg.id}
          variant="clickable"
          onClick={() => handleSelect(pkg.id)}
          role="button"
          tabIndex={0}
          onKeyDown={(e: React.KeyboardEvent<HTMLDivElement>) => {
            if (e.key === "Enter" || e.key === " ") handleSelect(pkg.id);
          }}
          aria-label={`Select ${pkg.label}: ${pkg.description}`}
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
  );
}
