import React, { useRef, useEffect } from 'react';
import { useDirtSystem } from '@/hooks/use-dirt-system';
import { DirtOverlay } from '@/components/game/dirt-overlay';
import { DirtCounter } from '@/components/game/dirt-counter';
import { DirtDebugControls } from '@/components/game/dirt-debug-controls';

export default function DirtDemoPage() {
  // Simular bounds del acuario (puedes ajustar el tamaño)
  const aquariumRef = useRef<HTMLDivElement>(null);
  const {
    spots,
    isSpawnerActive,
    totalSpotsCreated,
    totalSpotsRemoved,
    cleanlinessScore,
    removeDirtSpot,
    forceSpawnSpot,
    toggleSpawner,
    clearAllSpots,
    updateAquariumBounds,
    config,
  } = useDirtSystem();

  // Actualizar bounds si el tamaño del acuario cambia
  useEffect(() => {
    if (aquariumRef.current) {
      const rect = aquariumRef.current.getBoundingClientRect();
      updateAquariumBounds({
        x: 0,
        y: 0,
        width: rect.width,
        height: rect.height,
      });
    }
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-blue-400 to-blue-900 relative">
      <h1 className="text-3xl font-bold text-white mb-6">Aquarium Dirt System Demo</h1>
      <div className="flex flex-col md:flex-row gap-8 w-full max-w-5xl items-start justify-center">
        {/* Aquarium area */}
        <div
          ref={aquariumRef}
          className="relative bg-blue-200 rounded-3xl shadow-lg overflow-hidden border-4 border-blue-500"
          style={{ width: 800, height: 400 }}
        >
          {/* Overlay de suciedad */}
          <DirtOverlay spots={spots} onRemoveSpot={removeDirtSpot} />
          {/* Contador de suciedad */}
          <div className="absolute top-4 left-4 z-50">
            <DirtCounter spotCount={spots.length} maxSpots={config.maxSpots} cleanlinessScore={cleanlinessScore} />
          </div>
        </div>
        {/* Controles de debug */}
        <div className="mt-4 md:mt-0">
          <DirtDebugControls
            isSpawnerActive={isSpawnerActive}
            spotCount={spots.length}
            maxSpots={config.maxSpots}
            totalCreated={totalSpotsCreated}
            totalRemoved={totalSpotsRemoved}
            cleanlinessScore={cleanlinessScore}
            onToggleSpawner={toggleSpawner}
            onForceSpawn={forceSpawnSpot}
            onClearAll={clearAllSpots}
          />
        </div>
      </div>
      <p className="text-white/70 mt-8 text-center max-w-xl">
        Haz click sobre las manchas para limpiarlas. Usa los controles para probar el spawner, forzar suciedad o limpiar todo. Este demo es solo para pruebas visuales y de interacción.
      </p>
    </div>
  );
} 