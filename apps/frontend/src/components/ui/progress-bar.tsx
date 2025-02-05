import React from "react";

type ProgressBarProps = {
  percentage: number;
  color: string;
};

export default function ProgressBar({ percentage, color }: ProgressBarProps) {
  return (
    <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
      <div className={`${color} h-2.5 rounded-full`} style={{ width: `${percentage}%` }}></div>
    </div>
  );
}
