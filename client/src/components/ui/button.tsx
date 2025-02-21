import React from "react";

type ButtonColor = "blue" | "red" | "green" | "yellow" | "teal" | "inactive" ;


const buttonVariants: Record<ButtonColor, { normal: string; hover: string; active: string }> = {
  blue: {
    normal: "/textures/buttons/square/ButtonDarkBlue.svg",
    hover: "/textures/buttons/square/ButtonDarkBlueHover.svg",
    active: "/textures/buttons/square/ButtonDarkBlueDown.svg",
  },
  red: {
    normal: "/textures/buttons/square/ButtonRed.svg",
    hover: "/textures/buttons/square/ButtonRedHover.svg",
    active: "/textures/buttons/square/ButtonRedDown.svg",
  },
  green: {
    normal: "/textures/buttons/square/ButtonGreen.svg",
    hover: "/textures/buttons/square/ButtonGreenHover.svg",
    active: "/textures/buttons/square/ButtonGreenDown.svg",
  },
  yellow: {
    normal: "/textures/buttons/square/ButtonYellow.svg",
    hover: "/textures/buttons/square/ButtonYellowHover.svg",
    active: "/textures/buttons/square/ButtonYellowDown.svg",
  },
  teal: {
    normal: "/textures/buttons/square/ButtonTeal.svg",
    hover: "/textures/buttons/square/ButtonTealHover.svg",
    active: "/textures/buttons/square/ButtonTealDown.svg",
  },
  inactive: {
    normal: "/textures/buttons/square/ButtonInactive.svg",
    hover: "/textures/buttons/square/ButtonInactive.svg",
    active: "/textures/buttons/square/ButtonInactive.svg",
  },
};

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  color?: ButtonColor;
  iconSrc?: string;
  children?: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({ color = "blue", iconSrc, children, className = "", ...props }) => {
  const variant = buttonVariants[color];

  return (
    <button
      className={`relative flex items-center justify-center w-[80px] h-[80px] text-white text-lg font-semibold
                  transition-transform transform active:scale-95 bg-no-repeat bg-center bg-contain ${className}`}
      style={{ backgroundImage: `url(${variant.normal})` }}
      onMouseOver={(e) => (e.currentTarget.style.backgroundImage = `url(${variant.hover})`)}
      onMouseOut={(e) => (e.currentTarget.style.backgroundImage = `url(${variant.normal})`)}
      onMouseDown={(e) => (e.currentTarget.style.backgroundImage = `url(${variant.active})`)}
      onMouseUp={(e) => (e.currentTarget.style.backgroundImage = `url(${variant.hover})`)}
      {...props}
    >
      {iconSrc ? (
        <img src={iconSrc} alt="icon" className="w-2/3 h-2/3 object-contain" />
      ) : (
        children
      )}
    </button>
  );
};

export default Button;
