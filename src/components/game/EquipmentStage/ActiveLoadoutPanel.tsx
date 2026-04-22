import { useGame } from "../../../context/GameContext";
import { Character } from "../../../data/types";

interface ActiveLoadoutPanelProps {
  readonly char: Character;
}

export default function ActiveLoadoutPanel({
  char,
}: Readonly<ActiveLoadoutPanelProps>) {
  const { state } = useGame();

  // UX FIX: Priority 3 - Dynamically adjust the RPG location text to preserve immersion
  const difficulty = state.session?.difficulty || "school";
  const locationMap: Record<string, string> = {
    school: "WESTVIEW_HIGH_LOADING_DOCK",
    community: "CIVIC_CENTER_ALLEYWAY",
    professional: "GRAND_APOLLO_BAY_4",
  };
  const locationText = locationMap[difficulty];

  return (
    <div
      className="rpg-scene-header"
      style={{
        display: "flex",
        alignItems: "center",
        gap: "1rem",
        marginBottom: "2rem",
      }}
    >
      <span className="walking-icon" style={{ fontSize: "2.5rem" }}>
        {char?.icon || "👤"}
      </span>
      <div>
        <p className="annotation-text" style={{ margin: 0 }}>
          OPERATOR: {char?.name?.toUpperCase() || "UNKNOWN"}
        </p>
        <p
          className="annotation-text"
          style={{ opacity: 0.5, fontSize: "0.7rem" }}
        >
          LOCATION: {locationText}
        </p>
      </div>
    </div>
  );
}
