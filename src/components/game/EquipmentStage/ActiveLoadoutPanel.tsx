interface ActiveLoadoutPanelProps {
  char: any;
}

export default function ActiveLoadoutPanel({ char }: ActiveLoadoutPanelProps) {
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
          LOCATION: WESTVIEW_LOADING_DOCK
        </p>
      </div>
    </div>
  );
}
