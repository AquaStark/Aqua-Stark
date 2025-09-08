'use client';

import type React from 'react';
import { useEffect, useState } from 'react';

interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  size: number;
  color: string;
  rotation: number;
  rotationSpeed: number;
  type: 'coin' | 'sparkle' | 'bubble';
  scale: number;
  opacity: number;
}

interface FoodParticlesProps {
  position: { x: number; y: number };
  trigger: boolean;
  onComplete: () => void;
}

export const FoodParticles: React.FC<FoodParticlesProps> = ({
  position,
  trigger,
  onComplete,
}) => {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    if (!trigger) return;

    // Create diverse particles
    const newParticles: Particle[] = [];
    const coinColors = ['#FFD700', '#FFA500', '#FF8C00', '#DAA520', '#B8860B'];
    const sparkleColors = ['#FFFFFF', '#FFFF00', '#FFE4B5', '#F0E68C'];

    // Create coin particles (main effect)
    for (let i = 0; i < 12; i++) {
      const angle = (i / 12) * Math.PI * 2 + (Math.random() - 0.5) * 0.3;
      const speed = 3 + Math.random() * 4;
      newParticles.push({
        id: i,
        x: position.x,
        y: position.y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 2, // Initial upward bias
        life: 1,
        size: 6 + Math.random() * 4,
        color: coinColors[Math.floor(Math.random() * coinColors.length)],
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 10,
        type: 'coin',
        scale: 1,
        opacity: 1,
      });
    }

    // Create sparkle particles (secondary effect)
    for (let i = 0; i < 8; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 2 + Math.random() * 3;
      newParticles.push({
        id: i + 12,
        x: position.x + (Math.random() - 0.5) * 2,
        y: position.y + (Math.random() - 0.5) * 2,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 1,
        life: 1,
        size: 3 + Math.random() * 2,
        color: sparkleColors[Math.floor(Math.random() * sparkleColors.length)],
        rotation: 0,
        rotationSpeed: 0,
        type: 'sparkle',
        scale: 1,
        opacity: 1,
      });
    }

    // Create bubble particles (tertiary effect)
    for (let i = 0; i < 6; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 1 + Math.random() * 2;
      newParticles.push({
        id: i + 20,
        x: position.x + (Math.random() - 0.5) * 3,
        y: position.y + (Math.random() - 0.5) * 3,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 0.5,
        life: 1,
        size: 4 + Math.random() * 3,
        color: 'rgba(255, 255, 255, 0.6)',
        rotation: 0,
        rotationSpeed: 0,
        type: 'bubble',
        scale: 1,
        opacity: 0.6,
      });
    }

    setParticles(newParticles);

    // Animate particles with physics
    let animationId: number;
    const animate = () => {
      setParticles(prev => {
        const updated = prev
          .map(particle => {
            const newParticle = { ...particle };

            // Update position
            newParticle.x += newParticle.vx * 0.6;
            newParticle.y += newParticle.vy * 0.6;

            // Apply gravity and air resistance
            newParticle.vy += 0.15; // Gravity
            newParticle.vx *= 0.98; // Air resistance
            newParticle.vy *= 0.98;

            // Update rotation for coins
            if (newParticle.type === 'coin') {
              newParticle.rotation += newParticle.rotationSpeed;
            }

            // Update life and visual properties
            newParticle.life -= 0.025;

            // Different fade patterns for different particle types
            switch (newParticle.type) {
              case 'coin':
                newParticle.opacity = newParticle.life * 0.9;
                newParticle.scale = 1 + (1 - newParticle.life) * 0.3; // Slight growth
                break;
              case 'sparkle':
                newParticle.opacity = newParticle.life * newParticle.life; // Faster fade
                newParticle.scale =
                  1 + Math.sin(Date.now() * 0.01 + newParticle.id) * 0.2; // Twinkling
                break;
              case 'bubble':
                newParticle.opacity = newParticle.life * 0.4;
                newParticle.scale = 1 + (1 - newParticle.life) * 0.5; // Growth
                break;
            }

            return newParticle;
          })
          .filter(particle => particle.life > 0);

        if (updated.length === 0) {
          onComplete();
          return [];
        }

        animationId = requestAnimationFrame(animate);
        return updated;
      });
    };

    animationId = requestAnimationFrame(animate);

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, [trigger, position, onComplete]);

  return (
    <>
      {particles.map(particle => {
        // Render different particle types
        switch (particle.type) {
          case 'coin':
            return (
              <div
                key={particle.id}
                className='absolute pointer-events-none'
                style={{
                  left: `${particle.x}%`,
                  top: `${particle.y}%`,
                  width: `${particle.size}px`,
                  height: `${particle.size}px`,
                  backgroundColor: particle.color,
                  borderRadius: '50%',
                  opacity: particle.opacity,
                  transform: `translate(-50%, -50%) scale(${particle.scale}) rotate(${particle.rotation}deg)`,
                  zIndex: 60,
                  boxShadow: `0 0 ${particle.size * 0.5}px ${
                    particle.color
                  }, inset 0 1px 2px rgba(255,255,255,0.8)`,
                  border: '1px solid rgba(255,255,255,0.3)',
                }}
              />
            );

          case 'sparkle':
            return (
              <div
                key={particle.id}
                className='absolute pointer-events-none'
                style={{
                  left: `${particle.x}%`,
                  top: `${particle.y}%`,
                  width: `${particle.size}px`,
                  height: `${particle.size}px`,
                  opacity: particle.opacity,
                  transform: `translate(-50%, -50%) scale(${particle.scale})`,
                  zIndex: 65,
                }}
              >
                {/* Star shape using CSS */}
                <div
                  style={{
                    width: '100%',
                    height: '100%',
                    background: particle.color,
                    clipPath:
                      'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)',
                    filter: `drop-shadow(0 0 ${particle.size * 0.3}px ${
                      particle.color
                    })`,
                  }}
                />
              </div>
            );

          case 'bubble':
            return (
              <div
                key={particle.id}
                className='absolute pointer-events-none'
                style={{
                  left: `${particle.x}%`,
                  top: `${particle.y}%`,
                  width: `${particle.size}px`,
                  height: `${particle.size}px`,
                  backgroundColor: 'transparent',
                  border: '1px solid rgba(255,255,255,0.8)',
                  borderRadius: '50%',
                  opacity: particle.opacity,
                  transform: `translate(-50%, -50%) scale(${particle.scale})`,
                  zIndex: 55,
                  background:
                    'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.8), rgba(255,255,255,0.1))',
                }}
              />
            );

          default:
            return null;
        }
      })}
    </>
  );
};
