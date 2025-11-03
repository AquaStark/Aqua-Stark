'use client';

interface FallingFishMobileProps {
  id: string;
  x: number;
  y: number;
  speed: number;
  scale: number;
  fishSize: number; // Base size from game constants
  image?: string;
}

export function FallingFishMobile({
  x,
  y,
  speed,
  scale,
  fishSize,
  image,
}: FallingFishMobileProps) {
  const actualSize = fishSize * scale; // Use the actual fish size from game constants

  return (
    <div
      className='absolute transition-none pointer-events-none'
      style={{
        left: `${x}px`,
        top: `${y}px`,
        width: `${actualSize}px`,
        height: `${actualSize}px`,
      }}
    >
      <img
        src={image || '/fish/fish1.png'}
        alt='Falling fish'
        className='w-full h-full object-contain drop-shadow-lg'
        style={{
          animation: `spin ${2 / speed}s linear infinite`,
        }}
      />
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
