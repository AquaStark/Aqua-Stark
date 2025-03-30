// components/ui/ProgressBar.tsx
import React from 'react';

interface ProgressBarProps {
  value: number;
  maxValue?: number;
  color?: string;
  label?: string;
  showPercentage?: boolean;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  maxValue = 100,
  color = 'bg-blue-500',
  label,
  showPercentage = true
}) => {
  const percentage = Math.min(Math.max(0, (value / maxValue) * 100), 100);

  return (
    <div className="w-full">
      {label && <div className="text-sm text-white mb-1">{label}</div>}
      <div className="relative h-4 w-full bg-blue-950/70 rounded-full overflow-hidden">
        <div 
          className={`absolute top-0 left-0 h-full ${color}`} 
          style={{ width: `${percentage}%` }}
        >
          <div className="absolute top-0 left-0 right-0 h-1/2 bg-white/30"></div>
        </div>
        {showPercentage && (
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-xs text-white">
            {Math.round(percentage)}%
          </div>
        )}
      </div>
    </div>
  );
};