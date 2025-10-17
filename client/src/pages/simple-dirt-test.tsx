'use client';

import { useSimpleDirtSystem } from '@/hooks/use-simple-dirt-system';
import { SimpleDirtSpot } from '@/components/simple-dirt-spot';

export default function SimpleDirtTest() {
  const { spots, isSpongeMode, removeSpot, cleanSpot, toggleSpongeMode } =
    useSimpleDirtSystem();

  return (
    <div className='relative w-full h-screen overflow-hidden bg-gradient-to-b from-blue-400 to-blue-800'>
      {/* Manchas simples */}
      {spots.map(spot => (
        <SimpleDirtSpot
          key={spot.id}
          id={spot.id}
          x={spot.x}
          y={spot.y}
          size={spot.size}
          isSpongeMode={isSpongeMode}
          onRemove={removeSpot}
          onClean={cleanSpot}
        />
      ))}

      {/* Botón de modo esponja */}
      <button
        onClick={toggleSpongeMode}
        className='absolute top-4 left-4 bg-pink-500 hover:bg-pink-600 text-white px-6 py-3 rounded-lg font-bold text-lg shadow-lg transition-colors'
        style={{ zIndex: 10001 }}
      >
        {isSpongeMode ? '🧽 Modo Esponja ACTIVO' : '🧽 Activar Modo Esponja'}
      </button>

      {/* Info de estado */}
      <div
        className='absolute top-4 right-4 bg-black/80 text-white p-4 rounded-lg text-sm'
        style={{ zIndex: 10001 }}
      >
        <div className='font-bold mb-2'>Estado del Sistema:</div>
        <div>Manchas: {spots.length}</div>
        <div>Modo: {isSpongeMode ? '🧽 Esponja' : '👆 Normal'}</div>
        <div className='mt-2 text-xs text-gray-300'>
          {isSpongeMode
            ? 'Haz clic en las manchas para limpiarlas'
            : 'Activa el modo esponja primero'}
        </div>
      </div>

      {/* Instrucciones */}
      <div
        className='absolute bottom-4 left-4 bg-black/80 text-white p-4 rounded-lg text-sm max-w-md'
        style={{ zIndex: 10001 }}
      >
        <div className='font-bold mb-2'>Instrucciones:</div>
        <div>1. Haz clic en "Activar Modo Esponja"</div>
        <div>2. Haz clic en las manchas marrones</div>
        <div>3. Las manchas deberían desaparecer</div>
        <div className='mt-2 text-xs text-gray-300'>
          Si no funciona, revisa la consola del navegador
        </div>
      </div>
    </div>
  );
}
