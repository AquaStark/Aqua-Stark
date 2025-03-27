import type React from "react";
import type { Bubble } from "@/hooks/useBubbles";

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
      className={`absolute inset-0 overflow-hidden ${className}`}
      style={{ ...customStyles }}
    >
      {bubbles.map((bubble) => (
        <div
          key={bubble.id}
          className="absolute rounded-full pointer-events-none backdrop-blur-[1px]"
          style={{
            width: `${bubble.size}px`,
            height: `${bubble.size}px`,
            left: `${bubble.left}%`,
            bottom: "-100px",
            background:
              "radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.4), rgba(255, 255, 255, 0.1))",
            boxShadow: "inset 0 0 20px rgba(255, 255, 255, 0.3)",
            animation: `${animationName} ${bubble.animationDuration}s ease-in-out infinite`,
          }}
        />
      ))}

      <style jsx>{`
        @keyframes ${animationName} {
          0% {
            transform: translateY(0) scale(1);
            opacity: 0;
          }
          20% {
            opacity: 0.8;
          }
          50% {
            transform: translateY(-50vh) scale(1.2);
            opacity: 0.6;
          }
          80% {
            opacity: 0.3;
          }
          100% {
            transform: translateY(-100vh) scale(1.4);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}
