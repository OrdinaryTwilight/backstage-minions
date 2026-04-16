// src/components/ui/SectionHeader.jsx
export default function SectionHeader({ title, subtitle, style }) {
  return (
    <header style={{ marginBottom: "2rem", ...style }}>
      <h1
        className="annotation-text"
        style={{ fontSize: "2.2rem", color: "var(--bui-fg-info)" }}
      >
        {title}
      </h1>
      {subtitle && (
        <p
          className="annotation-text"
          style={{ opacity: 0.7, marginTop: "0.5rem" }}
        >
          {subtitle}
        </p>
      )}
    </header>
  );
}
