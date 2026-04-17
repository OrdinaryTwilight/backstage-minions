// src/components/ui/Button.jsx
export default function Button({
  children,
  variant = "",
  className = "",
  style,
  ...props
}) {
  const variantClass = variant ? `btn-${variant}` : "";

  return (
    <button
      className={`btn ${variantClass} ${className}`}
      style={{ filter: "url(#sketch-wobble)", ...style }}
      {...props}
    >
      {children}
    </button>
  );
}
