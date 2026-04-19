import { useState } from "react";
import { GEAR_PACKAGES } from "../../../data/gameData";
import HardwarePanel from "../../ui/HardwarePanel";

interface AvailableGearListProps {
  handleSelect: (pkgId: string) => void;
}

export default function AvailableGearList({
  handleSelect,
}: Readonly<AvailableGearListProps>) {
  const [highlightedId, setHighlightedId] = useState<string | null>(null);

  const onBoxInteraction = (id: string) => {
    if (highlightedId === id) {
      handleSelect(id);
    } else {
      setHighlightedId(id);
    }
  };

  return (
    <div className="bento-container">
      {GEAR_PACKAGES.map((pkg) => {
        const isHighlighted = highlightedId === pkg.id;
        return (
          <HardwarePanel
            key={pkg.id}
            variant="clickable"
            onClick={() => onBoxInteraction(pkg.id)}
            role="button"
            tabIndex={0}
            onKeyDown={(e: React.KeyboardEvent<HTMLDivElement>) => {
              if (e.key === "Enter" || e.key === " ") onBoxInteraction(pkg.id);
            }}
            aria-label={
              isHighlighted ? `Confirm ${pkg.label}` : `Select ${pkg.label}`
            }
            style={{
              borderColor: isHighlighted ? "var(--bui-fg-warning)" : undefined,
              boxShadow: isHighlighted
                ? "0 0 10px var(--bui-fg-warning)"
                : undefined,
              transform: isHighlighted ? "scale(1.02)" : "scale(1)",
              transition: "all 0.2s ease",
            }}
          >
            <h3 className="annotation-text" style={{ fontSize: "1.4rem" }}>
              {pkg.label}
            </h3>
            {isHighlighted && (
              <span
                className="animate-flicker"
                style={{
                  color: "var(--bui-fg-warning)",
                  fontWeight: "bold",
                  display: "block",
                  marginBottom: "0.5rem",
                }}
              >
                [ TAP AGAIN TO CONFIRM ]
              </span>
            )}
            <p style={{ margin: "1rem 0", opacity: 0.8 }}>{pkg.description}</p>
            <div
              style={{
                fontSize: "0.8rem",
                color: "var(--bui-fg-info)",
                textTransform: "uppercase",
              }}
            >
              Bonus: {pkg.bonus > 0 ? `+${pkg.bonus}` : pkg.bonus} pts
            </div>
          </HardwarePanel>
        );
      })}
    </div>
  );
}
