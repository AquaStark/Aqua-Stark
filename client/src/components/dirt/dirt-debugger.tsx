'use client';

import { useState } from 'react';
import { DirtDebugControls } from '@/components/dirt/dirt-debug-controls';

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
  const [showDirtDebug, setShowDirtDebug] = useState(false);

  return (
    <>
      {showDirtDebug ? (
        <div className="absolute top-4 right-4 z-40">
          <DirtDebugControls
            isSpawnerActive={dirtSystem.isSpawnerActive}
            spotCount={dirtSystem.spots.length}
            maxSpots={dirtSystem.config.maxSpots}
            totalCreated={dirtSystem.totalSpotsCreated}
            totalRemoved={dirtSystem.totalSpotsRemoved}
            cleanlinessScore={dirtSystem.cleanlinessScore}
            onToggleSpawner={dirtSystem.toggleSpawner}
            onForceSpawn={dirtSystem.forceSpawnSpot}
            onClearAll={dirtSystem.clearAllSpots}
          />
          <button
            onClick={() => setShowDirtDebug(false)}
            className="mt-2 w-full text-xs text-gray-400 hover:text-white transition-colors"
            aria-label="Hide Debug Panel"
          >
            Hide Debug
          </button>
        </div>
      ) : (
        <button
          onClick={() => setShowDirtDebug(true)}
          className="absolute top-4 right-4 z-40 bg-black/50 text-white px-3 py-1 rounded text-xs hover:bg-black/70 transition-colors"
          aria-label="Show Debug Panel"
        >
          <span role="img" aria-label="Broom">
            🧹
          </span>{' '}
          Debug
        </button>
      )}
    </>
  );
}
