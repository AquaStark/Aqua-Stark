import type React from "react";
import type { Bubble } from "@/hooks/use-bubbles";

interface BubblesBackgroundProps {
  bubbles: Bubble[];
  className?: string;
  animationName?: string;
  customStyles?: React.CSSProperties;
}

export function BubblesBackground({
  bubbles,
  className = "",
  animationName = "float-up",
  customStyles = {},
}: BubblesBackgroundProps) {
  return (
    <div
      className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}
      style={{ ...customStyles }}
    >
      {bubbles.map((bubble) => (
        <div
          key={bubble.id}
          className="absolute rounded-full backdrop-blur-[1px]"
          style={{
            width: `${bubble.size}px`,
            height: `${bubble.size}px`,
            left: `${bubble.left}%`,
            bottom: `-80px`,
            background:
              "radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.4), rgba(255, 255, 255, 0.1))",
            boxShadow: "inset 0 0 20px rgba(255, 255, 255, 0.3)",
            animation: `${animationName} ${bubble.animationDuration}s linear infinite`,
          }}
        />
      ))}

      <style jsx="true">{`
        @keyframes ${animationName} {
          0% {
            transform: translateY(0);
            opacity: 1;
          }
          100% {
            transform: translateY(-150vh);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}
