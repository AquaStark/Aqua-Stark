import React, { useState, useRef, useMemo } from 'react';
import {
  DirtSpot as DirtSpotType,
  ParticleEffect,
  BubbleEffect,
  getDirtTypeConfig,
} from '@/types';

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
  const [particles, setParticles] = useState<ParticleEffect[]>([]);
  const [bubbles, setBubbles] = useState<BubbleEffect[]>([]);
  const [clickRipples, setClickRipples] = useState<
    { id: number; x: number; y: number }[]
  >([]);
  const spotRef = useRef<HTMLDivElement>(null);

  // Generate organic shape using multiple overlapping circles
  const generateOrganicShape = () => {
    const baseSize = spot.size || 20;
    const shapes = [];
    const shapeCount = Math.floor(baseSize / 8) + 2; // More shapes for larger spots

    for (let i = 0; i < shapeCount; i++) {
      const angle = (i / shapeCount) * Math.PI * 2;
      const variation = 0.3 + Math.random() * 0.4; // Size variation
      const offset = (Math.random() - 0.5) * baseSize * 0.3; // Position variation

      shapes.push({
        size: baseSize * variation,
        x: Math.cos(angle) * offset,
        y: Math.sin(angle) * offset,
        opacity: 0.6 + Math.random() * 0.4,
      });
    }
    return shapes;
  };

  const organicShapes = useMemo(generateOrganicShape, [spot.size]);

  // Calculate spot age and intensity
  const age = spot.createdAt ? (Date.now() - spot.createdAt) / 1000 : 0;
  const intensity = Math.min(1, age / 30); // Intensifies over 30 seconds
  const baseOpacity = spot.opacity || 0.8;
  const currentOpacity = Math.min(1, baseOpacity + intensity * 0.3);

  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (isRemoving) return;

    // Only allow cleaning in sponge mode
    if (!isSpongeMode) return;

    const rect = spotRef.current?.getBoundingClientRect();
    if (rect) {
      const clickX = e.clientX - rect.left - rect.width / 2;
      const clickY = e.clientY - rect.top - rect.height / 2;

      // Add click ripple effect
      const rippleId = Date.now();
      setClickRipples(prev => [
        ...prev,
        { id: rippleId, x: clickX, y: clickY },
      ]);

      // Remove ripple after animation
      setTimeout(() => {
        setClickRipples(prev => prev.filter(r => r.id !== rippleId));
      }, 600);
    }

    setIsRemoving(true);

    // Generate enhanced particle effects
    const particleCount = Math.floor((spot.size || 20) / 3) + 6;
    const newParticles: ParticleEffect[] = Array.from(
      { length: particleCount },
      (_, i) => {
        const angle =
          (i / particleCount) * Math.PI * 2 + (Math.random() - 0.5) * 0.5;
        const speed = 2 + Math.random() * 3;
        const colors = ['#8B4513', '#D2691E', '#CD853F', '#F4A460', '#DEB887'];

        return {
          id: i,
          x: 0,
          y: 0,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          life: 1,
          size: 2 + Math.random() * 3,
          color: colors[Math.floor(Math.random() * colors.length)],
        };
      }
    );

    // Generate cleaning bubbles
    const bubbleCount = Math.floor((spot.size || 20) / 4) + 3;
    const newBubbles: BubbleEffect[] = Array.from(
      { length: bubbleCount },
      (_, i) => ({
        id: i,
        x: (Math.random() - 0.5) * (spot.size || 20),
        y: (Math.random() - 0.5) * (spot.size || 20),
        size: 4 + Math.random() * 8,
        delay: i * 50,
      })
    );

    setParticles(newParticles);
    setBubbles(newBubbles);

    // Animate particles
    const animateParticles = () => {
      setParticles(prev =>
        prev
          .map(p => ({
            ...p,
            x: p.x + p.vx,
            y: p.y + p.vy,
            vx: p.vx * 0.98, // Slow down over time
            vy: p.vy * 0.98 + 0.1, // Add gravity
            life: p.life - 0.02,
          }))
          .filter(p => p.life > 0)
      );
    };

    const particleInterval = setInterval(animateParticles, 16);

    // Call the clean function if provided, otherwise just remove
    if (onClean) {
      try {
        await onClean(spot.id);
      } catch (error) {
        console.error('Error cleaning spot:', error);
      }
    }

    // Remove spot after cleaning animation
    setTimeout(() => {
      clearInterval(particleInterval);
      onRemove(spot.id);
    }, 400);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      const rect = spotRef.current?.getBoundingClientRect();
      handleClick({
        preventDefault: () => {},
        stopPropagation: () => {},
        clientX: rect ? rect.left + rect.width / 2 : 0,
        clientY: rect ? rect.top + rect.height / 2 : 0,
      } as unknown as React.MouseEvent);
    }
  };

  // Get dirt color based on age and type
  const getDirtColors = () => {
    const colors = getDirtTypeConfig(spot.type).baseColors;
    const intensityBoost = intensity * 40;

    return colors.map(color => {
      // Darken colors based on age/intensity
      const hex = color.replace('#', '');
      const r = Math.max(0, parseInt(hex.substr(0, 2), 16) - intensityBoost);
      const g = Math.max(0, parseInt(hex.substr(2, 2), 16) - intensityBoost);
      const b = Math.max(0, parseInt(hex.substr(4, 2), 16) - intensityBoost);
      return `rgb(${r}, ${g}, ${b})`;
    });
  };

  const [primaryColor, secondaryColor, darkColor] = getDirtColors();

  return (
    <div
      ref={spotRef}
      className={`absolute transform-gpu transition-all duration-300 select-none ${
        isSpongeMode ? 'cursor-pointer' : 'cursor-default'
      } ${isRemoving ? 'animate-pulse' : isHovered ? 'scale-105' : ''} ${
        isSpongeMode && isHovered ? 'ring-2 ring-blue-400 ring-opacity-50' : ''
      } ${className}`}
      style={{
        left: `${spot.position.x}px`,
        top: `${spot.position.y}px`,
        transform: 'translate(-50%, -50%)',
        zIndex: isHovered ? 10 : 1,
      }}
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      role='button'
      tabIndex={0}
      onKeyDown={handleKeyDown}
      aria-label={`Clean ${spot.type || 'dirt'} spot (${Math.round(currentOpacity * 100)}% intensity)`}
      data-testid={`dirt-spot-${spot.id}`}
    >
      {/* Organic dirt shapes */}
      <div className='relative'>
        {organicShapes.map((shape, index) => (
          <div
            key={index}
            className={`absolute rounded-full transition-all duration-300 ${
              isRemoving ? 'scale-0 opacity-0' : ''
            }`}
            style={{
              width: `${shape.size}px`,
              height: `${shape.size}px`,
              left: `${shape.x}px`,
              top: `${shape.y}px`,
              transform: 'translate(-50%, -50%)',
              opacity: shape.opacity * currentOpacity,
              background: `radial-gradient(circle at 35% 35%, 
                ${primaryColor} 0%, 
                ${secondaryColor} 50%, 
                ${darkColor} 100%)`,
              filter: 'blur(0.5px)',
              boxShadow: `inset 0 0 ${shape.size * 0.2}px rgba(0,0,0,0.3)`,
            }}
          />
        ))}

        {/* Surface texture overlay */}
        <div
          className={`absolute inset-0 rounded-full pointer-events-none transition-opacity duration-300 ${
            isRemoving ? 'opacity-0' : ''
          }`}
          style={{
            width: `${spot.size}px`,
            height: `${spot.size}px`,
            transform: 'translate(-50%, -50%)',
            background: `
              radial-gradient(circle at 25% 25%, transparent 20%, rgba(0,0,0,0.1) 60%),
              radial-gradient(circle at 75% 75%, transparent 30%, rgba(255,255,255,0.05) 70%),
              radial-gradient(circle at 60% 40%, transparent 40%, rgba(0,0,0,0.08) 80%)
            `,
            opacity: currentOpacity * 0.8,
          }}
        />

        {/* Age indicator (subtle darkening around edges) */}
        {intensity > 0.3 && (
          <div
            className='absolute inset-0 rounded-full pointer-events-none'
            style={{
              width: `${(spot.size || 20) + 2}px`,
              height: `${(spot.size || 20) + 2}px`,
              transform: 'translate(-50%, -50%)',
              background: `radial-gradient(circle, transparent 70%, rgba(0,0,0,${intensity * 0.2}) 100%)`,
              opacity: currentOpacity,
            }}
          />
        )}
      </div>

      {/* Hover effect glow */}
      {isHovered && !isRemoving && (
        <div
          className='absolute inset-0 rounded-full pointer-events-none animate-pulse'
          style={{
            width: `${(spot.size || 20) + 12}px`,
            height: `${(spot.size || 20) + 12}px`,
            transform: 'translate(-50%, -50%)',
            border: '2px solid rgba(59, 130, 246, 0.6)',
            boxShadow: '0 0 10px rgba(59, 130, 246, 0.4)',
          }}
        />
      )}

      {/* Click ripple effects */}
      {clickRipples.map(ripple => (
        <div
          key={ripple.id}
          className='absolute pointer-events-none animate-ping'
          style={{
            left: `${ripple.x}px`,
            top: `${ripple.y}px`,
            width: '20px',
            height: '20px',
            transform: 'translate(-50%, -50%)',
            border: '2px solid rgba(59, 130, 246, 0.8)',
            borderRadius: '50%',
            animationDuration: '0.6s',
          }}
        />
      ))}

      {/* Cleaning particles */}
      {particles.map(p => (
        <div
          key={p.id}
          className='absolute pointer-events-none rounded-full'
          style={{
            left: `${p.x}px`,
            top: `${p.y}px`,
            width: `${p.size}px`,
            height: `${p.size}px`,
            backgroundColor: p.color,
            opacity: p.life,
            transform: 'translate(-50%, -50%)',
          }}
        />
      ))}

      {/* Cleaning bubbles */}
      {bubbles.map(b => (
        <div
          key={b.id}
          className='absolute pointer-events-none rounded-full bg-blue-200/60 animate-bounce'
          style={{
            left: `${b.x}px`,
            top: `${b.y}px`,
            width: `${b.size}px`,
            height: `${b.size}px`,
            transform: 'translate(-50%, -50%)',
            animationDelay: `${b.delay}ms`,
            animationDuration: '0.8s',
            animationFillMode: 'both',
          }}
        />
      ))}

      {/* Debug info */}
      {isDebugMode && (
        <div
          className='absolute top-full left-1/2 transform -translate-x-1/2 bg-black/80 text-white text-xs p-1 rounded mt-1 pointer-events-none'
          style={{ whiteSpace: 'nowrap' }}
        >
          ID:{spot.id} | Age:{age.toFixed(1)}s | Size:{spot.size}px
        </div>
      )}
    </div>
  );
}
