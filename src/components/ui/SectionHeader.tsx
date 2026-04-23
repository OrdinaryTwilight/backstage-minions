/**
 * @file Section Header Component
 * @description Page section header with title, subtitle, and optional help text.
 * Used on pages to introduce sections and provide context.
 * 
 * Features:
 * - Title and subtitle display
 * - Optional help text toggle button
 * - Consistent styling across pages
 * 
 * @component
 */

import { useState } from "react";

interface SectionHeaderProps {
  title: string;
  subtitle: string;
  helpText?: string;
}

export default function SectionHeader({
  title,
  subtitle,
  helpText,
}: Readonly<SectionHeaderProps>) {
  const [showHelp, setShowHelp] = useState(false);

  return (
    <header
      style={{
        marginBottom: "2rem",
        position: "relative",
        zIndex: showHelp ? 5000 : 1,
      }}
    >
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
            aria-expanded={showHelp}
          >
            ?
          </button>
        )}
      </div>

      {subtitle && (
        <p style={{ opacity: 0.7, marginTop: "0.5rem" }}>{subtitle}</p>
      )}

      {showHelp && helpText && (
        <>
          {/* Invisible backdrop to catch outside clicks */}
          <div
            style={{ position: "fixed", inset: 0, zIndex: 4999 }}
            onClick={() => setShowHelp(false)}
            aria-hidden="true"
          />
          <div
            className="tooltip-overlay"
            style={{
              zIndex: 5000,
              width: "100%",
              maxWidth: "400px",
              pointerEvents: "auto", // Allows text selection
              position: "absolute",
              top: "100%",
              left: 0,
            }}
          >
            <b>OPERATIONAL MANUAL:</b>
            {helpText}
          </div>
        </>
      )}
    </header>
  );
}
