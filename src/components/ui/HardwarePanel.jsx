export default function HardwarePanel({
  children,
  variant = "",
  className = "", // Capture className separately
  style,
  ...props
}) {
  return (
    <div
      // Merge all classes together
      className={`hardware-panel ${variant} ${className}`}
      style={{ filter: "url(#sketch-wobble)", ...style }}
      {...props}
    >
      {children}
    </div>
  );
}
