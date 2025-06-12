import React, { useState } from 'react';
import { DirtSpot as DirtSpotType } from '@/types/dirt';

interface DirtSpotProps {
  spot: DirtSpotType;
  onRemove: (spotId: number) => void;
  className?: string;
}

interface ParticleEffect {
  id: number;
  x: number;
  y: number;
}

export function DirtSpot({ spot, onRemove, className = '' }: DirtSpotProps) {
  const [isRemoving, setIsRemoving] = useState(false);
  const [particles, setParticles] = useState<ParticleEffect[]>([]);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isRemoving) return;
    
    setIsRemoving(true);
    
    // Create particle effect
    const newParticles: ParticleEffect[] = Array.from({ length: 8 }, (_, i) => ({
      id: i,
      x: Math.random() * 40 - 20, // -20 to 20
      y: Math.random() * 40 - 20,
    }));
    
    setParticles(newParticles);
    
    // Remove after animation
    setTimeout(() => {
      onRemove(spot.id);
    }, 300);
  };
  return (
    <div
      className={`absolute cursor-pointer transform-gpu transition-all duration-300 hover:scale-110 ${isRemoving ? 'animate-pulse scale-0' : ''} ${className}`}
      style={{
        left: `${spot.position.x}px`,
        top: `${spot.position.y}px`,
        transform: 'translate(-50%, -50%)',
      }}
      onClick={handleClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          handleClick(e as any);
        }      }}
      aria-label="Click to clean dirt spot"
    >
      {/* Main dirt spot */}
      <div
        className="relative bg-gradient-to-br from-amber-900 via-amber-800 to-amber-950 rounded-full shadow-lg border border-amber-700/50"
        style={{
          width: `${spot.size}px`,
          height: `${spot.size}px`,
          opacity: spot.opacity,
          background: `radial-gradient(circle at 30% 30%, 
            rgba(139, 69, 19, ${spot.opacity}) 0%, 
            rgba(101, 67, 33, ${spot.opacity}) 40%, 
            rgba(62, 39, 35, ${spot.opacity}) 70%, 
            rgba(45, 25, 22, ${spot.opacity}) 100%)`,
        }}
      >
        {/* Texture overlay */}
        <div 
          className="absolute inset-0 rounded-full"
          style={{
            background: `radial-gradient(circle at 20% 20%, transparent 30%, rgba(0,0,0,0.2) 80%), 
                        radial-gradient(circle at 80% 60%, transparent 40%, rgba(0,0,0,0.1) 90%)`,
          }}
        />
        
        {/* Highlight */}
        <div
          className="absolute top-1 left-1 w-2 h-2 bg-amber-600/40 rounded-full blur-sm"
          style={{ opacity: spot.opacity * 0.6 }}
        />
      </div>

      {/* Particle effects */}
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute w-1 h-1 bg-amber-600 rounded-full animate-ping pointer-events-none"
          style={{
            left: `${particle.x}px`,
            top: `${particle.y}px`,
            animationDelay: `${particle.id * 50}ms`,
            animationDuration: '0.5s',
          }}
        />
      ))}

      {/* Hover effect ring */}
      <div 
        className="absolute inset-0 rounded-full border-2 border-blue-400/0 hover:border-blue-400/60 transition-all duration-200 pointer-events-none"
        style={{
          width: `${spot.size + 8}px`,
          height: `${spot.size + 8}px`,
          left: '-4px',
          top: '-4px',
        }}
      />
    </div>
  );
}
