import { useState } from "react";

interface SectionHeaderProps {
  title: string;
  subtitle: string;
  helpText?: string;
}

export default function SectionHeader({ title, subtitle, helpText }: Readonly<SectionHeaderProps>) {
  const [showHelp, setShowHelp] = useState(false);

  return (
    <header style={{ marginBottom: "2rem", position: "relative" }}>
      <div style={{ display: "flex", alignItems: "center" }}>
        <h1
          className="annotation-text"
          style={{ fontSize: "1.8rem", margin: 0 }}
        >
          {title}
        </h1>
        {helpText && (
          <button
            className="help-trigger"
            onClick={() => setShowHelp(!showHelp)}
            title="Toggle Technical Manual"
          >
            ?
          </button>
        )}
      </div>

      <p style={{ opacity: 0.7, marginTop: "0.5rem" }}>{subtitle}</p>

      {showHelp && helpText && (
        <div className="tooltip-overlay">
          <b>OPERATIONAL MANUAL:</b>
          {helpText}
        </div>
      )}
    </header>
  );
}
