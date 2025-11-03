'use client';

interface FallingFishProps {
  id: string;
  x: number;
  y: number;
  speed: number;
  scale: number;
  image?: string;
}

export function FallingFish({ x, y, speed, scale, image }: FallingFishProps) {
  return (
    <div
      className='absolute transition-none pointer-events-none'
      style={{
        left: `${x}px`,
        top: `${y}px`,
        transform: `scale(${scale})`,
        width: '40px',
        height: '40px',
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
