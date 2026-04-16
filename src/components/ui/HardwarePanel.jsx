// src/components/ui/HardwarePanel.jsx
export default function HardwarePanel({
  children,
  variant = "",
  style,
  ...props
}) {
  return (
    <div
      className={`hardware-panel ${variant}`}
      style={{ filter: "url(#sketch-wobble)", ...style }}
      {...props}
    >
      {children}
    </div>
  );
}
