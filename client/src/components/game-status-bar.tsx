"use client";

import type React from "react";
import { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

interface GameStatusBarProps {
  icon: string | React.ReactNode;
  value: number;
  maxValue?: number;
  color: string;
  label?: string;
  showPercentage?: boolean;
  animated?: boolean;
}

export function GameStatusBar({
  icon,
  value,
  maxValue = 100,
  color,
  label,
  showPercentage = true,
  animated = true,
}: GameStatusBarProps) {
  const [displayValue, setDisplayValue] = useState(value);
  const [isIncreasing, setIsIncreasing] = useState(false);
  const [isDecreasing, setIsDecreasing] = useState(false);
  const prevValueRef = useRef(value);

  const percentage = Math.min(Math.max(0, (value / maxValue) * 100), 100);

  useEffect(() => {
    if (value !== prevValueRef.current) {
      if (value > prevValueRef.current) {
        setIsIncreasing(true);
        setTimeout(() => setIsIncreasing(false), 1000);
      } else {
        setIsDecreasing(true);
        setTimeout(() => setIsDecreasing(false), 1000);
      }

      if (animated) {
        const diff = value - prevValueRef.current;
        const steps = 20;
        const increment = diff / steps;
        let currentStep = 0;

        const interval = setInterval(() => {
          currentStep++;
          setDisplayValue(prevValueRef.current + increment * currentStep);

          if (currentStep >= steps) {
            clearInterval(interval);
            setDisplayValue(value);
          }
        }, 20);
      } else {
        setDisplayValue(value);
      }

      prevValueRef.current = value;
    }
  }, [value, animated]);

  return (
    <div className="relative flex items-center gap-3 min-w-[250px]">
      <div
        className={cn(
          "relative z-10 flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br shadow-lg",
          color
        )}
      >
        {typeof icon === "string" ? (
          <span className="text-xl drop-shadow-md">{icon}</span>
        ) : (
          icon
        )}
      </div>

      <div className="flex-1">
        {label && (
          <div className="mb-1 text-sm font-bold text-white drop-shadow-md">
            {label}
          </div>
        )}

        <div className="relative w-full h-5">
          <div className="absolute inset-0 overflow-hidden border-2 rounded-full shadow-inner bg-blue-950/70 border-blue-800/50">
            <div className="absolute inset-0 border-t-2 rounded-full border-white/10"></div>
          </div>

          <div
            className={cn(
              "absolute top-0 left-0 h-full rounded-full transition-all duration-500 overflow-hidden",
              isIncreasing ? "animate-pulse" : ""
            )}
            style={{ width: `${percentage}%` }}
          >
            <div className={cn("absolute inset-0 bg-gradient-to-r", color)}>
              <div className="absolute top-0 left-0 right-0 h-1/3 bg-white/30"></div>

              <div className="absolute inset-0 overflow-hidden">
                <div
                  className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.2)_25%,rgba(255,255,255,0.2)_50%,transparent_50%,transparent_75%,rgba(255,255,255,0.2)_75%)]"
                  style={{
                    backgroundSize: "20px 20px",
                    animation: "move-stripes 2s linear infinite",
                  }}
                ></div>
              </div>
            </div>

            {isIncreasing && (
              <div className="absolute inset-0">
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute w-2 h-2 bg-white rounded-full animate-ping"
                    style={{
                      left: `${Math.random() * 100}%`,
                      top: `${Math.random() * 100}%`,
                      animationDuration: `${0.5 + Math.random()}s`,
                      animationDelay: `${i * 0.1}s`,
                    }}
                  ></div>
                ))}
              </div>
            )}
          </div>

          {showPercentage && (
            <div className="absolute font-bold text-white transform -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2 drop-shadow-md">
              {Math.round(displayValue)}%
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
