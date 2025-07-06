import React, { useState } from "react";

type ButtonColor = "cyan" | "purple" | "green" | "pink";
type ButtonSize = "small" | "medium" | "large";

interface Neon3DButtonProps {
  children?: React.ReactNode;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  color?: ButtonColor;
  size?: ButtonSize;
  disabled?: boolean;
}

const Neon3DButton = ({
  children = "Click Me",
  onClick = () => {},
  color = "cyan",
  size = "small",
  disabled = false,
}: Neon3DButtonProps) => {
  const [isPressed, setIsPressed] = useState(false);

  const colorConfig = {
    cyan: {
      border: "border-cyan-400",
      text: "text-cyan-300",
      bg: "bg-cyan-900/20",
      textShadowColor: "#00ffff",
      boxShadowColor: "#00ffff",
    },
    purple: {
      border: "border-purple-400",
      text: "text-purple-300",
      bg: "bg-purple-900/20",
      textShadowColor: "#a855f7",
      boxShadowColor: "#a855f7",
    },
    green: {
      border: "border-green-400",
      text: "text-green-300",
      bg: "bg-green-900/20",
      textShadowColor: "#22c55e",
      boxShadowColor: "#22c55e",
    },
    pink: {
      border: "border-pink-400",
      text: "text-pink-300",
      bg: "bg-pink-900/20",
      textShadowColor: "#ec4899",
      boxShadowColor: "#ec4899",
    },
  };

  const sizeClasses = {
    small: "px-4 py-2 text-sm",
    medium: "px-6 py-3 text-base",
    large: "px-8 py-4 text-lg",
  };

  const currentColor = colorConfig[color] || colorConfig.cyan;
  const currentSize = sizeClasses[size] || sizeClasses.small;

  const buttonStyle = {
    textShadow: `0 0 10px ${currentColor.textShadowColor}`,
    boxShadow: `
      0 0 20px ${currentColor.boxShadowColor}33,
      0 0 40px ${currentColor.boxShadowColor}22,
      inset 0 1px 0 rgba(255, 255, 255, 0.2),
      inset 0 -1px 0 rgba(0, 0, 0, 0.3)
    `,
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      onMouseLeave={() => setIsPressed(false)}
      className={`
        relative
        ${currentSize}
        ${currentColor.text}
        ${currentColor.bg}
        ${currentColor.border}
        ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
        border-2
        rounded-lg
        font-bold
        uppercase
        tracking-wider
        transition-all
        duration-200
        transform
        ${isPressed ? "scale-95 translate-y-1" : "scale-100 translate-y-0"}
        ${!disabled ? "hover:scale-105" : ""}
        backdrop-blur-sm
        bg-black/30
        before:absolute
        before:inset-0
        before:rounded-lg
        before:bg-gradient-to-r
        before:from-transparent
        before:via-white/10
        before:to-transparent
        before:opacity-0
        before:transition-opacity
        before:duration-300
        ${!disabled ? "hover:before:opacity-100" : ""}
        after:absolute
        after:inset-0
        after:rounded-lg
        after:bg-gradient-to-b
        after:from-white/20
        after:to-transparent
        after:opacity-30
        overflow-hidden
      `}
      style={buttonStyle}
    >
      <span className="relative z-10">{children}</span>
    </button>
  );
};

export default Neon3DButton;
