import React, { useState } from 'react';
import { DirtSpot as DirtSpotType } from '@/types/dirt';

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
    
    // Convert ID to integer to avoid decimal issues
    const intId = Math.floor(Math.abs(id));
    
    // Use ID to create variation in image selection (1, 2, or 3)
    const imageIndex = (intId % 3) + 1;
    
    // RUTA CORRECTA: las imágenes están en /public/dirt/
    return `/dirt/dirt${imageIndex}.png`;
  };

  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (isRemoving) return;

    // Only allow cleaning in sponge mode
    if (!isSpongeMode) return;

    setIsRemoving(true);

    // Call the clean function if provided
    if (onClean) {
      try {
        await onClean(spot.id);
      } catch (error) {
        console.error('Error cleaning spot:', error);
      }
    }

    // Remove spot after a short delay
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

  // CONSOLE LOG PARA DEBUG DE POSICIONES
  console.log(`🎯 DIRT SPOT RENDER:`, {
    id: spot.id,
    position: spot.position,
    size: spot.size,
    left: `${spot.position.x}px`,
    top: `${spot.position.y}px`,
    transform: 'translate(-50%, -50%)'
  });

  return (
    <div
      className={`absolute transform-gpu transition-all duration-300 select-none ${
        isSpongeMode ? 'cursor-pointer' : 'cursor-default'
      } ${
        isRemoving ? 'animate-pulse' : isHovered ? 'scale-105' : ''
      } ${className}`}
      style={{
        left: `${spot.position.x}px`,
        top: `${spot.position.y}px`,
        transform: 'translate(-50%, -50%)',
        zIndex: isHovered ? 10 : 1,
        pointerEvents: isSpongeMode ? 'auto' : 'none',
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
        alt="Dirt spot"
        className={`transition-all duration-300 ${
          isRemoving ? 'scale-0 opacity-0' : ''
        }`}
        style={{
          width: `${spot.size || 150}px`,
          height: `${spot.size || 150}px`,
          opacity: currentOpacity,
          objectFit: 'contain',
          filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))',
          display: 'block',
        }}
        onError={(e) => {
          // Fallback visual inmediato
          const target = e.target as HTMLImageElement;
          target.style.display = 'none';
          const fallback = document.createElement('div');
          fallback.style.cssText = `
            width: ${spot.size || 150}px;
            height: ${spot.size || 150}px;
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
        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-black/70 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
          ID: {spot.id} | Size: {Math.round(spot.size || 150)}px
        </div>
      )}
    </div>
  );
}
