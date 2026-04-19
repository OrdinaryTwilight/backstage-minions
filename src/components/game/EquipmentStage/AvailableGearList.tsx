import { useState } from "react";
import { GEAR_PACKAGES } from "../../../data/gameData";
import Button from "../../ui/Button";
import HardwarePanel from "../../ui/HardwarePanel";

interface AvailableGearListProps {
  handleSelect: (pkgId: string) => void;
}

export default function AvailableGearList({
  handleSelect,
}: Readonly<AvailableGearListProps>) {
  const [highlightedId, setHighlightedId] = useState<string | null>(null);

  const selectedPkg = GEAR_PACKAGES.find((p) => p.id === highlightedId);

  const handlePanelClick = (pkgId: string) => {
    // If the same panel is clicked, deselect it
    if (pkgId === highlightedId) {
      setHighlightedId(null);
    } else {
      setHighlightedId(pkgId);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        width: "100%",
      }}
    >
      <div className="bento-container" style={{ width: "100%" }}>
        {GEAR_PACKAGES.map((pkg) => {
          const isHighlighted = highlightedId === pkg.id;
          return (
            <HardwarePanel
              key={pkg.id}
              variant="clickable"
              onClick={() => handlePanelClick(pkg.id)} // Toggle the selection
              role="button"
              tabIndex={0}
              onKeyDown={(e: React.KeyboardEvent<HTMLDivElement>) => {
                if (e.key === "Enter" || e.key === " ") {
                  handlePanelClick(pkg.id); // Toggle the selection with keyboard
                }
              }}
              aria-label={`Select ${pkg.label}`}
              style={{
                borderColor: isHighlighted
                  ? "var(--bui-fg-warning)"
                  : undefined,
                boxShadow: isHighlighted
                  ? "0 0 10px var(--bui-fg-warning)"
                  : undefined,
                transform: isHighlighted ? "scale(1.02)" : "scale(1)",
                transition: "all 0.2s ease",
              }}
            >
              <h3
                className="annotation-text"
                style={{
                  fontSize: "1.4rem",
                  color: "var(--color-pencil-light)",
                }}
              >
                {pkg.label}
              </h3>
              <p
                style={{
                  margin: "1rem 0",
                  opacity: 0.9,
                  color: "var(--color-pencil-light)",
                }}
              >
                {pkg.description}
              </p>
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

      <Button
        disabled={!highlightedId}
        onClick={() => highlightedId && handleSelect(highlightedId)}
        variant={highlightedId ? "accent" : "default"}
        className={highlightedId ? "animate-pulse-go" : "default"}
        style={{
          width: "100%",
          maxWidth: "600px",
          marginTop: "2rem",
          height: "70px",
          fontSize: "1.4rem",
          fontFamily: "var(--font-sketch)",
        }}
      >
        {selectedPkg ? `Confirm ${selectedPkg.label}` : "Select Equipment"}
      </Button>
    </div>
  );
}
