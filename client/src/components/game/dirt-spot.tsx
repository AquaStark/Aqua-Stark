import React, { useState, useMemo } from 'react';
import { DirtSpot as DirtSpotType } from '@/types/dirt';
import { motion, AnimatePresence } from 'framer-motion';

interface DirtSpotProps {
  spot: DirtSpotType;
  onRemove: (spotId: number) => void;
  className?: string;
}

interface ParticleEffect {
  id: number;
  x: number;
  y: number;
  angle: number;
  distance: number;
}

// Genera una agrupación asimétrica de círculos verdes para simular moho
function MoldyClusterSVG({ size, opacity, seed }: { size: number; opacity: number; seed: number }) {
  // Generar "nubes" de moho con círculos aleatorios
  const circles = useMemo(() => {
    const count = 6 + Math.floor((seed % 9)); // 6-14 puntos
    const arr = [];
    for (let i = 0; i < count; i++) {
      // Aleatoriedad basada en seed y i
      const angle = ((seed * (i + 1)) % 360) * (Math.PI / 180) + Math.random() * 0.5;
      const radius = (size / 2.5) * (0.3 + Math.random() * 0.7) * (0.7 + Math.sin(seed + i));
      const cx = size / 2 + Math.cos(angle) * radius * (0.5 + Math.random() * 0.7);
      const cy = size / 2 + Math.sin(angle) * radius * (0.5 + Math.random() * 0.7);
      const r = (size / 10) * (0.5 + Math.random() * 1.2);
      const green = 120 + Math.floor(Math.random() * 60); // tono verde
      const color = `rgba(${60 + Math.floor(Math.random()*40)},${green},${40 + Math.floor(Math.random()*40)},${0.18 + Math.random()*0.5})`;
      arr.push({ cx, cy, r, color });
    }
    return arr;
  }, [size, opacity, seed]);

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ display: 'block' }}>
      <defs>
        <filter id={`blur-mold-${seed}`} x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="2.2" />
        </filter>
      </defs>
      {circles.map((c, i) => (
        <ellipse
          key={i}
          cx={c.cx}
          cy={c.cy}
          rx={c.r}
          ry={c.r * (0.7 + Math.random()*0.5)}
          fill={c.color}
          opacity={opacity}
          filter={`url(#blur-mold-${seed})`}
        />
      ))}
    </svg>
  );
}

export function DirtSpot({ spot, onRemove, className = '' }: DirtSpotProps) {
  const [isRemoving, setIsRemoving] = useState(false);
  const [particles, setParticles] = useState<ParticleEffect[]>([]);

  // Usar el id del spot como semilla para la agrupación
  const clusterSeed = useMemo(() => spot.id * 31 + Math.floor(spot.size * 7), [spot.id, spot.size]);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isRemoving) return;
    setIsRemoving(true);
    // Crear partículas con ángulo y distancia para dispersión realista
    const newParticles: ParticleEffect[] = Array.from({ length: 10 }, (_, i) => {
      const angle = (i / 10) * 2 * Math.PI;
      const distance = 30 + Math.random() * 20;
      return {
        id: i,
        x: Math.cos(angle) * distance,
        y: Math.sin(angle) * distance,
        angle,
        distance,
      };
    });
    setParticles(newParticles);
    // Eliminar tras la animación
    setTimeout(() => {
      onRemove(spot.id);
    }, 500);
  };

  return (
    <AnimatePresence>
      {!isRemoving && (
        <motion.div
          initial={{ scale: 0.3, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.2, opacity: 0, transition: { duration: 0.35 } }}
          transition={{ type: 'spring', stiffness: 300, damping: 20, duration: 0.4 }}
          className={`absolute cursor-pointer transform-gpu ${className}`}
          style={{
            left: `${spot.position.x}px`,
            top: `${spot.position.y}px`,
            transform: 'translate(-50%, -50%)',
            zIndex: 10,
          }}
          onClick={handleClick}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              handleClick(e as any);
            }
          }}
          aria-label="Click to clean dirt spot"
        >
          {/* Mancha de moho: agrupación asimétrica y aleatoria */}
          <MoldyClusterSVG size={spot.size} opacity={spot.opacity} seed={clusterSeed} />
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
        </motion.div>
      )}
      {/* Animación de limpieza y partículas */}
      {isRemoving && (
        <motion.div
          initial={{ scale: 1, opacity: 1 }}
          animate={{ scale: 0.2, opacity: 0 }}
          transition={{ duration: 0.4, ease: 'easeIn' }}
          className={`absolute pointer-events-none ${className}`}
          style={{
            left: `${spot.position.x}px`,
            top: `${spot.position.y}px`,
            transform: 'translate(-50%, -50%)',
            zIndex: 10,
          }}
        >
          <MoldyClusterSVG size={spot.size} opacity={spot.opacity} seed={clusterSeed} />
          {/* Partículas de dispersión */}
          {particles.map((particle) => (
            <motion.div
              key={particle.id}
              className="absolute w-2 h-2 bg-lime-400 rounded-full shadow-md pointer-events-none"
              initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
              animate={{
                x: particle.x,
                y: particle.y,
                opacity: 0,
                scale: 0.5 + Math.random() * 0.5,
                filter: 'blur(2px)',
              }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              style={{
                zIndex: 20,
              }}
            />
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
