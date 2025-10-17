import React, { useState, useMemo } from 'react';

interface SimpleDirtSpotProps {
  id: number;
  x: number;
  y: number;
  size: number;
  isSpongeMode: boolean;
  onRemove: (id: number) => void;
  onClean: (id: number) => Promise<void>;
}

// Imágenes de suciedad disponibles
const DIRT_IMAGES = ['/dirt/dirt1.png', '/dirt/dirt2.png', '/dirt/dirt3.png'];

export function SimpleDirtSpot({
  id,
  x,
  y,
  size,
  isSpongeMode,
  onRemove,
  onClean,
}: SimpleDirtSpotProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);

  // Seleccionar una imagen aleatoria para esta mancha (se mantiene fija)
  const dirtImage = useMemo(() => {
    return DIRT_IMAGES[Math.floor(Math.random() * DIRT_IMAGES.length)];
  }, [id]);

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

    try {
      // Limpiar en el backend
      await onClean(id);
    } catch (error) {
      console.error('Error cleaning spot:', error);
    }

    // Remover localmente después de un delay
    setTimeout(() => {
      onRemove(id);
    }, 300);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  return (
    <div
      className={`absolute transition-all duration-300 ${
        isRemoving ? 'animate-pulse opacity-0' : ''
      } ${isHovered ? 'scale-110 drop-shadow-lg' : ''} ${
        isSpongeMode ? 'cursor-sponge-simple' : 'cursor-pointer'
      }`}
      style={{
        left: `${x}px`,
        top: `${y}px`,
        width: `${size}px`,
        height: `${size}px`,
        transform: 'translate(-50%, -50%)',
        zIndex: 10000,
        pointerEvents: 'auto',
        backgroundImage: `url(${dirtImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        filter: isHovered ? 'brightness(1.2)' : 'brightness(1)',
        opacity: isRemoving ? 0 : 0.9,
      }}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    ></div>
  );
}
