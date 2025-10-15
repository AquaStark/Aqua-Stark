import React, { useState } from 'react';
import { DirtSpotType } from '@/constants';

interface DirtSpotProps {
  spot: DirtSpotType;
  onRemove: (spotId: number) => void;
  onClean?: (spotId: number) => void;
  isSpongeMode?: boolean;
  className?: string;
  isDebugMode?: boolean;
}

export function DirtSpot({
  spot,
  onRemove,
  onClean,
  isSpongeMode = false,
  className = '',
  isDebugMode = false,
}: DirtSpotProps) {
  const [isRemoving, setIsRemoving] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // Function to get dirt image based on spot properties
  const getDirtImage = () => {
    const id = spot.id || 0;
    const intId = Math.floor(Math.abs(id));
    const imageIndex = (intId % 3) + 1;
    
    // RUTA CORRECTA: las imágenes están en /public/dirt/
    return `/dirt/dirt${imageIndex}.png`;
  };

  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (isRemoving) {
      return;
    }
    if (!isSpongeMode) {
      return;
    }

    setIsRemoving(true);

    if (onClean) {
      try {
        await onClean(spot.id);
      } catch (error) {
        console.error('Error cleaning:', error);
      }
    }

    setTimeout(() => {
      onRemove(spot.id);
    }, 300);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleClick(e as any);
    }
  };

  const baseOpacity = spot.opacity || 0.8;
  const currentOpacity = Math.min(1, baseOpacity);

  return (
    <div
      className={`absolute transform-gpu transition-all duration-300 select-none ${
        isSpongeMode ? 'cursor-sponge-simple' : 'cursor-pointer'
      } ${
        isRemoving ? 'animate-pulse' : isHovered ? 'scale-110 drop-shadow-lg brightness-110 ring-4 ring-yellow-400 ring-opacity-50' : ''
      } ${className}`}
      style={{
        left: `${spot.position.x}px`,
        top: `${spot.position.y}px`,
        transform: 'translate(-50%, -50%)',
        zIndex: 10000,
        pointerEvents: 'auto', // SIEMPRE permitir hover y clicks
      }}
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      role='button'
      tabIndex={0}
      onKeyDown={handleKeyDown}
      aria-label={`Clean dirt spot (${Math.round(currentOpacity * 100)}% intensity)`}
      data-testid={`dirt-spot-${spot.id}`}
    >
      {/* Dirt image - FORZAR USO DE IMÁGENES */}
      <img
        src={getDirtImage()}
        alt='Dirt spot'
        className={`transition-all duration-300 ${
          isRemoving ? 'scale-0 opacity-0' : ''
        }`}
        style={{
          width: `${spot.size || 300}px`,
          height: `${spot.size || 300}px`,
          opacity: currentOpacity,
          objectFit: 'contain',
          filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.4))',
          display: 'block',
        }}
        onError={e => {
          // Fallback visual inmediato
          const target = e.target as HTMLImageElement;
          target.style.display = 'none';
          const fallback = document.createElement('div');
          fallback.style.cssText = `
            width: ${spot.size || 300}px;
            height: ${spot.size || 300}px;
            background: linear-gradient(45deg, #8B4513, #A0522D);
            border-radius: 50%;
            opacity: ${currentOpacity};
            box-shadow: inset 0 0 20px rgba(0,0,0,0.5), 0 0 10px rgba(139,69,19,0.8);
            border: 3px solid #654321;
          `;
          target.parentNode?.appendChild(fallback);
        }}
      />

      {/* Debug info */}
      {isDebugMode && (
        <div className='absolute -top-8 left-1/2 transform -translate-x-1/2 bg-black/70 text-white text-xs px-2 py-1 rounded whitespace-nowrap'>
          ID: {spot.id} | Size: {Math.round(spot.size || 300)}px
        </div>
      )}
    </div>
  );
}
