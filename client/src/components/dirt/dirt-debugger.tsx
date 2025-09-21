'use client';

import type { DirtSpotType } from '@/types';
import { useState } from 'react';
import {
  ChevronDown,
  ChevronUp,
  Bug,
  Play,
  Pause,
  Plus,
  Trash2,
  RefreshCw,
  Droplets,
  Sparkles,
} from 'lucide-react';

interface DirtDebuggerProps {
  dirtSystem: {
    // New realistic system properties
    spots: DirtSpotType[];
    dirtLevel: number;
    isDirty: boolean;
    needsCleaning: boolean;
    cleanlinessStatus: {
      level: string;
      label: string;
      color: string;
    };
    lastCleaningTime: string | null;
    cleaningStreak: number;
    totalCleanings: number;
    hoursSinceCleaning: number;
    isLoading: boolean;
    error: string | null;

    // Actions
    cleanAquarium: (type: 'partial' | 'complete') => Promise<void>;
    removeDirtSpot: (spotId: number) => void;
    fetchDirtStatus: () => Promise<void>;

    // Legacy properties for backward compatibility (optional)
    isSpawnerActive?: boolean;
    config?: { maxSpots: number };
    totalSpotsCreated?: number;
    totalSpotsRemoved?: number;
    cleanlinessScore?: number;
    toggleSpawner?: () => void;
    forceSpawnSpot?: () => void;
    clearAllSpots?: () => void;
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

  // Helper functions for the new system
  const getCleanlinessScore = () => {
    return dirtSystem.cleanlinessScore ?? 100 - dirtSystem.dirtLevel;
  };

  const getMaxSpots = () => {
    return dirtSystem.config?.maxSpots ?? 15;
  };

  const getTotalSpotsCreated = () => {
    return dirtSystem.totalSpotsCreated ?? dirtSystem.totalCleanings;
  };

  const getTotalSpotsRemoved = () => {
    return dirtSystem.totalSpotsRemoved ?? dirtSystem.totalCleanings;
  };

  const getIsSpawnerActive = () => {
    return dirtSystem.isSpawnerActive ?? true;
  };

  return (
    <div className='absolute top-4 right-4 z-40 font-mono'>
      {/* Main Toggle Button */}
      <button
        onClick={handleToggle}
        className={`
          flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium
          transition-all duration-200 ease-in-out transform
          ${
            isExpanded
              ? 'bg-gray-900/95 text-white shadow-lg backdrop-blur-sm'
              : 'bg-black/60 text-gray-200 hover:bg-black/80 hover:scale-105'
          }
          border border-gray-700/50 hover:border-gray-600/70
        `}
        aria-label={isExpanded ? 'Collapse Debug Panel' : 'Expand Debug Panel'}
        aria-expanded={isExpanded}
      >
        <Bug className='w-3 h-3' />
        <span>Dirt Debug</span>
        {isExpanded ? (
          <ChevronUp className='w-3 h-3' />
        ) : (
          <ChevronDown className='w-3 h-3' />
        )}
      </button>

      {/* Expanded Debug Panel */}
      <div
        className={`
          mt-2 transition-all duration-200 ease-in-out origin-top
          ${
            isExpanded
              ? 'opacity-100 scale-100 translate-y-0'
              : isCollapsing
                ? 'opacity-0 scale-95 -translate-y-2'
                : 'opacity-0 scale-95 -translate-y-2 pointer-events-none'
          }
        `}
      >
        <div className='bg-gray-900/95 backdrop-blur-sm border border-gray-700/50 rounded-lg p-4 shadow-xl min-w-[280px]'>
          {/* Status Overview */}
          <div className='mb-4'>
            <div className='flex items-center justify-between mb-2'>
              <h3 className='text-white font-semibold text-sm'>
                System Status
              </h3>
              <div
                className={`flex items-center gap-1 ${getIsSpawnerActive() ? 'text-green-400' : 'text-red-400'}`}
              >
                {getIsSpawnerActive() ? (
                  <Play className='w-3 h-3' />
                ) : (
                  <Pause className='w-3 h-3' />
                )}
                <span className='text-xs'>
                  {getIsSpawnerActive() ? 'Active' : 'Paused'}
                </span>
              </div>
            </div>

            {/* Cleanliness Score */}
            <div className='bg-gray-800/80 rounded p-3 mb-3'>
              <div className='flex items-center justify-between mb-1'>
                <span className='text-gray-300 text-xs'>Cleanliness</span>
                <span
                  className={`text-sm font-bold ${getCleanlinessColor(getCleanlinessScore())}`}
                >
                  {getCleanlinessScore()}%
                </span>
              </div>
              <div className='w-full bg-gray-700 rounded-full h-2 mb-1'>
                <div
                  className={`h-2 rounded-full transition-all duration-300 ${
                    getCleanlinessScore() >= 80
                      ? 'bg-green-400'
                      : getCleanlinessScore() >= 60
                        ? 'bg-yellow-400'
                        : getCleanlinessScore() >= 40
                          ? 'bg-orange-400'
                          : 'bg-red-400'
                  }`}
                  style={{ width: `${getCleanlinessScore()}%` }}
                />
              </div>
              <span
                className={`text-xs ${getCleanlinessColor(getCleanlinessScore())}`}
              >
                {getCleanlinessLabel(getCleanlinessScore())}
              </span>
            </div>
          </div>

          {/* Dirt Spots Info */}
          <div className='mb-4'>
            <h4 className='text-white text-sm font-medium mb-2'>Dirt Spots</h4>
            <div className='grid grid-cols-2 gap-2 text-xs'>
              <div className='bg-gray-800/60 rounded p-2'>
                <div className='text-gray-400'>Current</div>
                <div className='text-white font-bold'>
                  {dirtSystem.spots.length}/{getMaxSpots()}
                </div>
              </div>
              <div className='bg-gray-800/60 rounded p-2'>
                <div className='text-gray-400'>Created</div>
                <div className='text-green-400 font-bold'>
                  {getTotalSpotsCreated()}
                </div>
              </div>
              <div className='bg-gray-800/60 rounded p-2'>
                <div className='text-gray-400'>Removed</div>
                <div className='text-blue-400 font-bold'>
                  {getTotalSpotsRemoved()}
                </div>
              </div>
              <div className='bg-gray-800/60 rounded p-2'>
                <div className='text-gray-400'>Efficiency</div>
                <div className='text-purple-400 font-bold'>
                  {getTotalSpotsCreated() > 0
                    ? Math.round(
                        (getTotalSpotsRemoved() / getTotalSpotsCreated()) * 100
                      )
                    : 0}
                  %
                </div>
              </div>
            </div>
          </div>

          {/* Control Buttons */}
          <div className='space-y-2'>
            {dirtSystem.toggleSpawner && (
              <button
                onClick={dirtSystem.toggleSpawner}
                className={`
                  w-full flex items-center justify-center gap-2 px-3 py-2 rounded text-xs font-medium
                  transition-all duration-150 hover:scale-[1.02]
                  ${
                    getIsSpawnerActive()
                      ? 'bg-red-600 hover:bg-red-700 text-white'
                      : 'bg-green-600 hover:bg-green-700 text-white'
                  }
                `}
                aria-checked={getIsSpawnerActive()}
                role='switch'
                aria-label={`Dirt spawner is currently ${getIsSpawnerActive() ? 'active' : 'inactive'}`}
              >
                {getIsSpawnerActive() ? (
                  <>
                    <Pause className='w-3 h-3' />
                    Stop Spawner
                  </>
                ) : (
                  <>
                    <Play className='w-3 h-3' />
                    Start Spawner
                  </>
                )}
              </button>
            )}

            {dirtSystem.forceSpawnSpot && (
              <button
                onClick={dirtSystem.forceSpawnSpot}
                disabled={dirtSystem.spots.length >= getMaxSpots()}
                className='
                  w-full flex items-center justify-center gap-2 px-3 py-2 rounded text-xs font-medium
                  bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed
                  text-white transition-all duration-150 hover:scale-[1.02] disabled:hover:scale-100
                '
                aria-label={`Force spawn dirt spot (${dirtSystem.spots.length}/${getMaxSpots()} spots)`}
              >
                <Plus className='w-3 h-3' />
                Force Spawn
              </button>
            )}

            {dirtSystem.clearAllSpots && (
              <button
                onClick={dirtSystem.clearAllSpots}
                disabled={dirtSystem.spots.length === 0}
                className='
                  w-full flex items-center justify-center gap-2 px-3 py-2 rounded text-xs font-medium
                  bg-red-600 hover:bg-red-700 disabled:bg-gray-600 disabled:cursor-not-allowed
                  text-white transition-all duration-150 hover:scale-[1.02] disabled:hover:scale-100
                '
                aria-label={`Clear all ${dirtSystem.spots.length} dirt spots`}
              >
                <Trash2 className='w-3 h-3' />
                Clear All
              </button>
            )}

            {/* New realistic system buttons */}
            <button
              onClick={() => dirtSystem.cleanAquarium('partial')}
              disabled={dirtSystem.isLoading || !dirtSystem.isDirty}
              className='
                w-full flex items-center justify-center gap-2 px-3 py-2 rounded text-xs font-medium
                bg-yellow-600 hover:bg-yellow-700 disabled:bg-gray-600 disabled:cursor-not-allowed
                text-white transition-all duration-150 hover:scale-[1.02] disabled:hover:scale-100
              '
              aria-label='Partial cleaning'
            >
              <Droplets className='w-3 h-3' />
              Partial Clean
            </button>

            <button
              onClick={() => dirtSystem.cleanAquarium('complete')}
              disabled={dirtSystem.isLoading}
              className='
                w-full flex items-center justify-center gap-2 px-3 py-2 rounded text-xs font-medium
                bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed
                text-white transition-all duration-150 hover:scale-[1.02] disabled:hover:scale-100
              '
              aria-label='Complete cleaning'
            >
              <Sparkles className='w-3 h-3' />
              Complete Clean
            </button>

            <button
              onClick={dirtSystem.fetchDirtStatus}
              disabled={dirtSystem.isLoading}
              className='
                w-full flex items-center justify-center gap-2 px-3 py-2 rounded text-xs font-medium
                bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 disabled:cursor-not-allowed
                text-white transition-all duration-150 hover:scale-[1.02] disabled:hover:scale-100
              '
              aria-label='Refresh dirt status'
            >
              <RefreshCw className='w-3 h-3' />
              Refresh
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
