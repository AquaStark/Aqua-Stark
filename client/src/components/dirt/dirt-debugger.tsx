'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp, Bug, Play, Pause, Plus, Trash2 } from 'lucide-react';

interface DirtDebuggerProps {
  dirtSystem: {
    isSpawnerActive: boolean;
    spots: any[];
    config: { maxSpots: number };
    totalSpotsCreated: number;
    totalSpotsRemoved: number;
    cleanlinessScore: number;
    toggleSpawner: () => void;
    forceSpawnSpot: () => void;
    clearAllSpots: () => void;
  };
}

export function DirtDebugger({ dirtSystem }: DirtDebuggerProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isCollapsing, setIsCollapsing] = useState(false);

  const handleToggle = () => {
    if (isExpanded) {
      setIsCollapsing(true);
      // Small delay to show collapse animation
      setTimeout(() => {
        setIsExpanded(false);
        setIsCollapsing(false);
      }, 200);
    } else {
      setIsExpanded(true);
    }
  };

  const getCleanlinessColor = (score: number) => {
    if (score >= 80) return 'text-green-400';
    if (score >= 60) return 'text-yellow-400';
    if (score >= 40) return 'text-orange-400';
    return 'text-red-400';
  };

  const getCleanlinessLabel = (score: number) => {
    if (score >= 90) return 'Pristine';
    if (score >= 80) return 'Very Clean';
    if (score >= 70) return 'Clean';
    if (score >= 60) return 'Acceptable';
    if (score >= 50) return 'Needs Attention';
    if (score >= 30) return 'Dirty';
    return 'Very Dirty';
  };

  return (
    <div className="absolute top-4 right-4 z-40 font-mono">
      {/* Main Toggle Button */}
      <button
        onClick={handleToggle}
        className={`
          flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium
          transition-all duration-200 ease-in-out transform
          ${isExpanded 
            ? 'bg-gray-900/95 text-white shadow-lg backdrop-blur-sm' 
            : 'bg-black/60 text-gray-200 hover:bg-black/80 hover:scale-105'
          }
          border border-gray-700/50 hover:border-gray-600/70
        `}
        aria-label={isExpanded ? "Collapse Debug Panel" : "Expand Debug Panel"}
        aria-expanded={isExpanded}
      >
        <Bug className="w-3 h-3" />
        <span>Dirt Debug</span>
        {isExpanded ? (
          <ChevronUp className="w-3 h-3" />
        ) : (
          <ChevronDown className="w-3 h-3" />
        )}
      </button>

      {/* Expanded Debug Panel */}
      <div 
        className={`
          mt-2 transition-all duration-200 ease-in-out origin-top
          ${isExpanded 
            ? 'opacity-100 scale-100 translate-y-0' 
            : isCollapsing 
              ? 'opacity-0 scale-95 -translate-y-2' 
              : 'opacity-0 scale-95 -translate-y-2 pointer-events-none'
          }
        `}
      >
        <div className="bg-gray-900/95 backdrop-blur-sm border border-gray-700/50 rounded-lg p-4 shadow-xl min-w-[280px]">
          {/* Status Overview */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-white font-semibold text-sm">System Status</h3>
              <div className={`flex items-center gap-1 ${dirtSystem.isSpawnerActive ? 'text-green-400' : 'text-red-400'}`}>
                {dirtSystem.isSpawnerActive ? <Play className="w-3 h-3" /> : <Pause className="w-3 h-3" />}
                <span className="text-xs">
                  {dirtSystem.isSpawnerActive ? 'Active' : 'Paused'}
                </span>
              </div>
            </div>
            
            {/* Cleanliness Score */}
            <div className="bg-gray-800/80 rounded p-3 mb-3">
              <div className="flex items-center justify-between mb-1">
                <span className="text-gray-300 text-xs">Cleanliness</span>
                <span className={`text-sm font-bold ${getCleanlinessColor(dirtSystem.cleanlinessScore)}`}>
                  {dirtSystem.cleanlinessScore}%
                </span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2 mb-1">
                <div 
                  className={`h-2 rounded-full transition-all duration-300 ${
                    dirtSystem.cleanlinessScore >= 80 ? 'bg-green-400' :
                    dirtSystem.cleanlinessScore >= 60 ? 'bg-yellow-400' :
                    dirtSystem.cleanlinessScore >= 40 ? 'bg-orange-400' : 'bg-red-400'
                  }`}
                  style={{ width: `${dirtSystem.cleanlinessScore}%` }}
                />
              </div>
              <span className={`text-xs ${getCleanlinessColor(dirtSystem.cleanlinessScore)}`}>
                {getCleanlinessLabel(dirtSystem.cleanlinessScore)}
              </span>
            </div>
          </div>

          {/* Dirt Spots Info */}
          <div className="mb-4">
            <h4 className="text-white text-sm font-medium mb-2">Dirt Spots</h4>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="bg-gray-800/60 rounded p-2">
                <div className="text-gray-400">Current</div>
                <div className="text-white font-bold">
                  {dirtSystem.spots.length}/{dirtSystem.config.maxSpots}
                </div>
              </div>
              <div className="bg-gray-800/60 rounded p-2">
                <div className="text-gray-400">Created</div>
                <div className="text-green-400 font-bold">{dirtSystem.totalSpotsCreated}</div>
              </div>
              <div className="bg-gray-800/60 rounded p-2">
                <div className="text-gray-400">Removed</div>
                <div className="text-blue-400 font-bold">{dirtSystem.totalSpotsRemoved}</div>
              </div>
              <div className="bg-gray-800/60 rounded p-2">
                <div className="text-gray-400">Efficiency</div>
                <div className="text-purple-400 font-bold">
                  {dirtSystem.totalSpotsCreated > 0 
                    ? Math.round((dirtSystem.totalSpotsRemoved / dirtSystem.totalSpotsCreated) * 100)
                    : 0
                  }%
                </div>
              </div>
            </div>
          </div>

          {/* Control Buttons */}
          <div className="space-y-2">
            <button
              onClick={dirtSystem.toggleSpawner}
              className={`
                w-full flex items-center justify-center gap-2 px-3 py-2 rounded text-xs font-medium
                transition-all duration-150 hover:scale-[1.02]
                ${dirtSystem.isSpawnerActive 
                  ? 'bg-red-600 hover:bg-red-700 text-white' 
                  : 'bg-green-600 hover:bg-green-700 text-white'
                }
              `}
              aria-pressed={dirtSystem.isSpawnerActive}
              role="switch"
              aria-label={`Dirt spawner is currently ${dirtSystem.isSpawnerActive ? 'active' : 'inactive'}`}
            >
              {dirtSystem.isSpawnerActive ? (
                <>
                  <Pause className="w-3 h-3" />
                  Stop Spawner
                </>
              ) : (
                <>
                  <Play className="w-3 h-3" />
                  Start Spawner
                </>
              )}
            </button>

            <button
              onClick={dirtSystem.forceSpawnSpot}
              disabled={dirtSystem.spots.length >= dirtSystem.config.maxSpots}
              className="
                w-full flex items-center justify-center gap-2 px-3 py-2 rounded text-xs font-medium
                bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed
                text-white transition-all duration-150 hover:scale-[1.02] disabled:hover:scale-100
              "
              aria-label={`Force spawn dirt spot (${dirtSystem.spots.length}/${dirtSystem.config.maxSpots} spots)`}
            >
              <Plus className="w-3 h-3" />
              Force Spawn
            </button>

            <button
              onClick={dirtSystem.clearAllSpots}
              disabled={dirtSystem.spots.length === 0}
              className="
                w-full flex items-center justify-center gap-2 px-3 py-2 rounded text-xs font-medium
                bg-red-600 hover:bg-red-700 disabled:bg-gray-600 disabled:cursor-not-allowed
                text-white transition-all duration-150 hover:scale-[1.02] disabled:hover:scale-100
              "
              aria-label={`Clear all ${dirtSystem.spots.length} dirt spots`}
            >
              <Trash2 className="w-3 h-3" />
              Clear All
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}