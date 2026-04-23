/**
 * @file Button Component
 * @description Reusable button component with multiple visual variants.
 * Used throughout the game for actions, navigation, and player choices.
 *
 * Variants:
 * - **default**: Standard gray button (secondary actions)
 * - **success**: Green button for positive/confirm actions
 * - **danger**: Red button for destructive/warning actions
 * - **accent**: Yellow button for primary/important actions
 *
 * @component
 */

import React from "react";

/**
 * Button Component Props
 * Extends standard HTML button attributes with additional variant styling.
 */
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "success" | "danger" | "accent";
}

export default function Button({
  children,
  variant = "default",
  className = "",
  disabled,
  style,
  ...props
}: Readonly<ButtonProps>) {
  const baseStyle: React.CSSProperties = {
    padding: "0.75rem 1.5rem",
    borderRadius: "var(--radius-sm)",
    fontWeight: "bold",
    fontFamily: "var(--font-mono)",
    cursor: disabled ? "not-allowed" : "pointer",
    transition: "all 0.2s ease",
    opacity: disabled ? 0.5 : 1,
    border: "2px solid transparent",
    outline: "none",
    ...style,
  };

  const variantStyles: Record<string, React.CSSProperties> = {
    default: {
      background: "#2d3748",
      color: "#fff",
      border: "2px solid #4a5568",
    },
    success: { background: "var(--bui-fg-success)", color: "#000" },
    danger: { background: "var(--bui-fg-danger)", color: "#fff" },
    accent: { background: "var(--bui-fg-warning)", color: "#000" },
  };

  return (
    <button
      type="button"
      className={`btn-hover-effect ${className}`}
      style={{ ...baseStyle, ...variantStyles[variant] }}
      disabled={disabled}
      aria-disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}
