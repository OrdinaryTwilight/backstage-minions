// src/components/ui/Button.jsx
export default function Button({
  children,
  variant = "",
  className = "",
  style,
  ...props
}) {
  const baseClass = variant ? `btn-${variant}` : "action-button";
  return (
    <button
      className={`${baseClass} ${className}`}
      style={{ filter: "url(#sketch-wobble)", ...style }}
      {...props}
    >
      {children}
    </button>
  );
}
