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
              style={{
                padding: 0,
                borderColor: isHighlighted
                  ? "var(--bui-fg-warning)"
                  : undefined,
                boxShadow: isHighlighted
                  ? "0 0 10px var(--bui-fg-warning)"
                  : undefined,
                transform: isHighlighted ? "scale(1.02)" : "scale(1)",
                transition: "all 0.2s ease",
                overflow: "hidden",
              }}
            >
              <button
                type="button"
                onClick={() => handlePanelClick(pkg.id)}
                aria-pressed={isHighlighted}
                aria-label={`Select ${pkg.label} Package. Hit Window: ${pkg.multiplier}x. Bonus: ${pkg.bonus} points`}
                style={{
                  width: "100%",
                  height: "100%",
                  background: "transparent",
                  border: "none",
                  textAlign: "left",
                  cursor: "pointer",
                  padding: "clamp(1rem, 3vw, 2rem)",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <h3
                  className="annotation-text"
                  style={{
                    fontSize: "1.4rem",
                    color: "var(--color-pencil-light)",
                    margin: 0,
                  }}
                >
                  {pkg.label}
                </h3>
                <p
                  style={{
                    margin: "1rem 0",
                    opacity: 0.9,
                    color: "var(--color-pencil-light)",
                    flex: 1,
                    fontFamily: "var(--font-mono)",
                  }}
                >
                  {pkg.description}
                </p>

                {/* UX FIX: Translate multiplier and bonus into legible terms */}
                <div
                  style={{
                    fontSize: "0.85rem",
                    color: "var(--bui-fg-info)",
                    fontFamily: "var(--font-mono)",
                    background: "rgba(0,0,0,0.3)",
                    padding: "0.5rem",
                    borderRadius: "4px",
                  }}
                >
                  <strong>Hit Window:</strong> {pkg.multiplier}x <br />
                  <strong>Score Bonus:</strong>{" "}
                  {pkg.bonus > 0 ? `+${pkg.bonus}` : pkg.bonus} pts
                </div>
              </button>
            </HardwarePanel>
          );
        })}
      </div>

      {/* UX FIX: Explain exactly what the stats above mean to a new player */}
      <div
        style={{
          marginTop: "1.5rem",
          padding: "1rem",
          background: "rgba(56, 189, 248, 0.1)",
          border: "1px dashed var(--bui-fg-info)",
          borderRadius: "8px",
          fontSize: "0.85rem",
          color: "var(--color-pencil-light)",
          fontFamily: "var(--font-mono)",
          maxWidth: "600px",
          textAlign: "center",
        }}
      >
        💡 <strong>GEAR GUIDE:</strong> <br />
        <strong>Hit Window</strong> affects timing precision (Higher = Easier to
        hit cues).
        <br />
        <strong>Score Bonus</strong> adds or subtracts from your final rating.
      </div>

      <Button
        type="button"
        disabled={!highlightedId}
        onClick={() => highlightedId && handleSelect(highlightedId)}
        variant={highlightedId ? "accent" : "default"}
        style={{
          width: "100%",
          maxWidth: "600px",
          marginTop: "2rem",
          height: "70px",
          fontSize: "1.4rem",
          fontFamily: "var(--font-sketch)",
          opacity: highlightedId ? 1 : 0.5,
          cursor: highlightedId ? "pointer" : "not-allowed",
        }}
      >
        {selectedPkg ? `Confirm ${selectedPkg.label}` : "Select Equipment"}
      </Button>
    </div>
  );
}
