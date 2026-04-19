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

  const toggleSelect = (id: string) => {
    setHighlightedId((prev) => (prev === id ? null : id));
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        width: "100%",
        fontFamily: "var(--font-sketch)",
      }}
    >
      <div
        className="bento-container"
        style={{
          width: "100%",
          display: "grid",
          gap: "1rem",
          fontFamily: "var(--font-sketch)",
        }}
      >
        {GEAR_PACKAGES.map((pkg) => {
          const isHighlighted = highlightedId === pkg.id;

          return (
            <HardwarePanel
              key={pkg.id}
              variant="clickable"
              onClick={() => toggleSelect(pkg.id)}
              role="button"
              tabIndex={0}
              onKeyDown={(e: React.KeyboardEvent<HTMLDivElement>) => {
                if (e.key === "Enter" || e.key === " ") {
                  toggleSelect(pkg.id);
                }
              }}
              aria-label={`Select ${pkg.label}`}
              style={{
                position: "relative",
                zIndex: isHighlighted ? 2 : 1,
                borderColor: isHighlighted
                  ? "var(--bui-fg-warning)"
                  : undefined,
                boxShadow: isHighlighted
                  ? "0 0 10px var(--bui-fg-warning)"
                  : undefined,
                transform: isHighlighted ? "scale(1.02)" : "scale(1)",
                background: isHighlighted
                  ? "rgba(255, 193, 7, 0.08)"
                  : undefined,
                transition: "all 0.2s ease",
              }}
            >
              <h3
                className="annotation-text"
                style={{
                  fontSize: "1.4rem",
                  color: "var(--bui-fg-primary)",
                  margin: 0,
                }}
              >
                {pkg.label}
              </h3>

              <p
                style={{
                  margin: "1rem 0",
                  color: "var(--bui-fg-primary)",
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
        variant={highlightedId ? "success" : "default"}
        className="animate-pulse-go"
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
