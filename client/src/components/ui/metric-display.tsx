// components/ui/MetricDisplay.tsx
import React from 'react';
import { cn } from "@/lib/utils";
import { FaArrowUp, FaArrowDown } from 'react-icons/fa';

interface MetricDisplayProps extends React.HTMLAttributes<HTMLDivElement> {
  icon: React.ReactNode;
  label: string;
  value: number | string;
  change?: number;
}

export const MetricDisplay: React.FC<MetricDisplayProps> = ({
  icon,
  label,
  value,
  change,
  className,
  ...props
}) => {
  const isPositive = change !== undefined && change >= 0;

  return (
    <div 
      className={cn(
        'flex items-center space-x-4 bg-blue-800/30 p-4 rounded-lg',
        className
      )}
      {...props}
    >
      <div className="w-12 h-12 bg-blue-700/50 rounded-full flex items-center justify-center">
        {icon}
      </div>
      <div className="flex-1">
        <div className="text-sm text-blue-200 mb-1">{label}</div>
        <div className="flex items-center space-x-2">
          <span className="text-xl font-semibold text-white">{value}</span>
          {change !== undefined && (
            <div className={`flex items-center ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
              {isPositive ? <FaArrowUp /> : <FaArrowDown />}
              <span className="text-xs ml-1">{Math.abs(change)}%</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};