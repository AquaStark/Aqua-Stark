import type React from "react";

interface FishTankProps {
  children: React.ReactNode;
  className?: string;
  shadow?: boolean;
}

export function FishTank({
  children,
  className = "",
  shadow = true,
}: FishTankProps) {
  return (
    <div
      className={`relative w-full h-48 flex items-center justify-center ${className}`}
    >
      {/* Background layer of the tank */}
      <div className="absolute inset-0 z-0">
        <img
          src="/fish/fish-tank.svg"
          alt="Fish Tank Background"
          className="w-full h-full object-contain opacity-50"
        />
      </div>

      {/* Fish Container (inside the tank) */}
      <div className="absolute z-10 w-full h-full flex items-center justify-center">
        <div className="relative w-4/5 h-4/5 flex items-center justify-center">
          {/* Add a subtle shadow/depth effect */}
          {/* biome-ignore lint/style/useSelfClosingElements: <explanation> */}
          {shadow && (
            <div className="absolute inset-0 bg-blue-900/20 rounded-full filter blur-md"></div>
          )}
          {/* Fish with scaling and movement effect */}
          <div className="transform scale-75 hover:scale-90 transition-all duration-500 ease-in-out">
            {children}
          </div>
        </div>
      </div>

      {/* Foreground layer of the tank (glass effect) */}
      <img
        src="/fish/fish-tank.svg"
        alt="Fish Tank Overlay"
        className="absolute inset-0 w-full h-full object-contain z-20 pointer-events-none mix-blend-overlay"
      />
    </div>
  );
}
