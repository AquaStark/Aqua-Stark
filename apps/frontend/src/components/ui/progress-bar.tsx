import React from "react";

type ProgressBarProps = {
  percentage: number;
  color: string;
};

export default function ProgressBar({ percentage, color }: ProgressBarProps) {
  return (
    <div className="w-full bg-transparent h-full">
      <div className={`${color} h-full rounded-full`} style={{ width: `${percentage}%` }}></div>
    </div>
  );
}
