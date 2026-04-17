import { ButtonHTMLAttributes, CSSProperties, ReactNode } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: string;
  className?: string;
  style?: CSSProperties;
}

export default function Button({
  children,
  variant = "",
  className = "",
  style,
  ...props
}: ButtonProps) {
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
