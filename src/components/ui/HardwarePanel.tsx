import { CSSProperties, ReactNode } from "react";

interface HardwarePanelProps {
  children: ReactNode;
  variant?: string;
  className?: string;
  style?: CSSProperties;
  onClick?: (e: React.MouseEvent<HTMLDivElement> | React.KeyboardEvent<HTMLDivElement>) => void;
  [key: string]: unknown;
}

export default function HardwarePanel({
  children,
  variant = "",
  className = "",
  style,
  onClick,
  ...props
}: HardwarePanelProps) {
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
