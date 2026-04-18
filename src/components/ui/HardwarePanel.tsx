import React from "react";

type BaseProps = {
  variant?: "default" | "clickable";
  className?: string;
  style?: React.CSSProperties;
  children: React.ReactNode;
};

type DivProps = BaseProps & React.HTMLAttributes<HTMLDivElement>;
type ButtonProps = BaseProps & React.ButtonHTMLAttributes<HTMLButtonElement>;

export default function HardwarePanel(props: Readonly<DivProps | ButtonProps>) {
  const {
    children,
    variant = "default",
    className = "",
    style,
    onClick,
    ...rest
  } = props as any;

  const isClickable = variant === "clickable" || !!onClick;

  const commonStyles: React.CSSProperties = {
    background: "var(--color-surface-base)",
    border: "1px solid var(--glass-border)",
    borderRadius: "var(--radius-md)",
    padding: "1.5rem",
    boxShadow: "var(--shadow-md)",
    cursor: isClickable ? "pointer" : "default",
    transition:
      "transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease",
    ...style,
  };

  const commonClass = `hardware-panel ${
    isClickable ? "clickable-panel" : ""
  } ${className}`;

  if (isClickable) {
    return (
      <button
        type="button"
        className={commonClass}
        style={commonStyles}
        onClick={onClick as React.MouseEventHandler<HTMLButtonElement>}
        {...(rest as React.ButtonHTMLAttributes<HTMLButtonElement>)}
      >
        {children}
      </button>
    );
  }

  return (
    <div
      className={commonClass}
      style={commonStyles}
      {...(rest as React.HTMLAttributes<HTMLDivElement>)}
    >
      {children}
    </div>
  );
}
