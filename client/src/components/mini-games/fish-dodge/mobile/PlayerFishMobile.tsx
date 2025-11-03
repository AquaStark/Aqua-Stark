'use client';

interface PlayerFishMobileProps {
  x: number;
  y: number;
  scale: number;
  playerSize: number; // Base size from game constants
  image?: string;
  lives: number;
}

export function PlayerFishMobile({
  x,
  y,
  scale,
  playerSize,
  image,
  lives,
}: PlayerFishMobileProps) {
  const isHurt = lives < 3;
  const actualSize = playerSize * scale; // Use the actual player size from game constants

  return (
    <div
      className='absolute pointer-events-none transition-all duration-150'
      style={{
        left: `${x}px`,
        top: `${y}px`,
        width: `${actualSize}px`,
        height: `${actualSize}px`,
        filter: isHurt ? 'brightness(1.5) saturate(0.5)' : 'none',
      }}
    >
      <img
        src={image || '/fish/fish2.png'}
        alt='Player fish'
        className='w-full h-full object-contain drop-shadow-2xl'
        style={{
          filter: 'drop-shadow(0 0 8px rgba(0, 255, 255, 0.6))',
        }}
      />
    </div>
  );
}
