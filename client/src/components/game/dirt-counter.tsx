import React from 'react';

interface DirtCounterProps {
  spotCount: number;
  maxSpots: number;
  cleanlinessScore: number;
  className?: string;
}

export function DirtCounter({ 
  spotCount, 
  maxSpots, 
  cleanlinessScore, 
  className = '' 
}: DirtCounterProps) {
  return (
    <div className={`bg-black/70 backdrop-blur-sm rounded-lg px-4 py-2 text-white flex items-center gap-4 ${className}`}>
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium">🧹</span>
        <span className="text-sm">
          Dirt: <span className="text-orange-400 font-bold">{spotCount}/{maxSpots}</span>
        </span>
      </div>
      
      <div className="flex items-center gap-2">
        <span className="text-sm">
          Clean: <span className={`font-bold ${
            cleanlinessScore > 70 ? 'text-green-400' : 
            cleanlinessScore > 40 ? 'text-yellow-400' : 'text-red-400'
          }`}>
            {cleanlinessScore}%
          </span>
        </span>
      </div>
    </div>
  );
}
