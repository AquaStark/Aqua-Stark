import React from 'react';
import { Play, Pause, Plus, Trash2 } from 'lucide-react';

interface DirtDebugControlsProps {
  isSpawnerActive: boolean;
  spotCount: number;
  maxSpots: number;
  totalCreated: number;
  totalRemoved: number;
  cleanlinessScore: number;
  onToggleSpawner: () => void;
  onForceSpawn: () => void;
  onClearAll: () => void;
  className?: string;
}

export function DirtDebugControls({
  isSpawnerActive,
  spotCount,
  maxSpots,
  totalCreated,
  totalRemoved,
  cleanlinessScore,
  onToggleSpawner,
  onForceSpawn,
  onClearAll,
  className = '',
}: DirtDebugControlsProps) {
  return (
    <div className={`bg-black/80 backdrop-blur-sm rounded-lg p-4 text-white min-w-64 ${className}`}>
      <h3 className="text-lg font-bold mb-3 text-center">🧹 Dirt System Debug</h3>
      
      {/* Stats */}
      <div className="space-y-2 mb-4 text-sm">
        <div className="flex justify-between">
          <span>Active Spots:</span>
          <span className="text-blue-300">{spotCount}/{maxSpots}</span>
        </div>
        <div className="flex justify-between">
          <span>Cleanliness:</span>
          <span className={`font-bold ${cleanlinessScore > 70 ? 'text-green-400' : cleanlinessScore > 40 ? 'text-yellow-400' : 'text-red-400'}`}>
            {cleanlinessScore}%
          </span>
        </div>
        <div className="flex justify-between">
          <span>Total Created:</span>
          <span className="text-gray-300">{totalCreated}</span>
        </div>
        <div className="flex justify-between">
          <span>Total Removed:</span>
          <span className="text-gray-300">{totalRemoved}</span>
        </div>
        <div className="flex justify-between">
          <span>Spawner:</span>
          <span className={`font-bold ${isSpawnerActive ? 'text-green-400' : 'text-red-400'}`}>
            {isSpawnerActive ? 'ON' : 'OFF'}
          </span>
        </div>
      </div>

      {/* Controls */}
      <div className="space-y-2">
        <button
          onClick={onToggleSpawner}
          className={`w-full flex items-center justify-center px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            isSpawnerActive 
              ? 'bg-red-600 hover:bg-red-700 text-white' 
              : 'bg-green-600 hover:bg-green-700 text-white'
          }`}
        >
          {isSpawnerActive ? (
            <>
              <Pause className="w-4 h-4 mr-2" />
              Stop Spawner
            </>
          ) : (
            <>
              <Play className="w-4 h-4 mr-2" />
              Start Spawner
            </>
          )}
        </button>
        
        <button
          onClick={onForceSpawn}
          className="w-full flex items-center justify-center px-4 py-2 rounded-md text-sm font-medium transition-colors bg-blue-600 hover:bg-blue-700 text-white disabled:bg-gray-600 disabled:cursor-not-allowed"
          disabled={spotCount >= maxSpots}
        >
          <Plus className="w-4 h-4 mr-2" />
          Force Spawn
        </button>
        
        <button
          onClick={onClearAll}
          className="w-full flex items-center justify-center px-4 py-2 rounded-md text-sm font-medium transition-colors bg-red-600 hover:bg-red-700 text-white disabled:bg-gray-600 disabled:cursor-not-allowed"
          disabled={spotCount === 0}
        >
          <Trash2 className="w-4 h-4 mr-2" />
          Clear All
        </button>
      </div>
    </div>
  );
}
