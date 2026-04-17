// src/components/ui/HardwarePanel.jsx
export default function HardwarePanel({
  children,
  variant = "",
  className = "",
  style,
  onClick, // Destructure onClick to handle accessibility
  ...props
}) {
  const isClickable = variant === "clickable" || !!onClick;

  const handleKeyDown = (e) => {
    if (onClick && (e.key === "Enter" || e.key === " ")) {
      e.preventDefault();
      onClick(e);
    }
  };

  return (
    <div
      className={`hardware-panel ${variant} ${className}`}
      style={{
        filter: "url(#sketch-wobble)",
        cursor: isClickable ? "pointer" : "default",
        ...style,
      }}
      onClick={onClick}
      onKeyDown={isClickable ? handleKeyDown : undefined}
      tabIndex={isClickable ? 0 : -1}
      role={isClickable ? "button" : undefined}
      aria-pressed={isClickable ? "false" : undefined}
      {...props}
    >
      {children}
    </div>
  );
}
