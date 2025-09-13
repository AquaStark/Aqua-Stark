'use client';

import type React from 'react';
import { motion } from 'framer-motion';

interface Platform {
  id: number;
  x: number;
  y: number;
  width: number;
  type: 'normal' | 'spring' | 'broken';
  bounceAnimation?: boolean;
}

interface Fish {
  x: number;
  y: number;
  velocityX: number;
  velocityY: number;
  width: number;
  height: number;
  image: string;
  name: string;
  rarity: string;
}

interface GameCanvasProps {
  gameRef: React.RefObject<HTMLDivElement>;
  platforms: Platform[];
  fish: Fish;
  camera: { y: number };
  gameConfig: {
    gameWidth: number;
    gameHeight: number;
  };
}

export function GameCanvas({
  gameRef,
  platforms,
  fish,
  camera,
  gameConfig,
}: GameCanvasProps) {
  const getPlatformStyle = (platform: Platform) => {
    const baseStyle = {
      width: platform.width,
      height: 20,
      borderRadius: '8px',
      border: '2px solid rgba(255,255,255,0.4)',
      transform: `translate(${platform.x}px, ${platform.y - camera.y}px) ${
        platform.bounceAnimation ? 'scaleY(0.8)' : 'scaleY(1)'
      }`,
      transition: 'transform 0.2s ease-out',
      willChange: 'transform',
    };

    switch (platform.type) {
      case 'spring':
        return {
          ...baseStyle,
          background: 'linear-gradient(45deg, #10B981, #059669)',
          boxShadow: '0 0 10px rgba(16, 185, 129, 0.5)',
        };
      case 'broken':
        return {
          ...baseStyle,
          background: 'linear-gradient(45deg, #DC2626, #991B1B)',
          opacity: 0.7,
        };
      default:
        return {
          ...baseStyle,
          backgroundImage: 'url(/minigames/base.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundColor: '#4A90E2',
        };
    }
  };

  return (
    <div
      ref={gameRef}
      className='absolute z-30'
      style={{
        width: gameConfig.gameWidth,
        height: gameConfig.gameHeight,
        left: '50%',
        top: '50%',
        transform: 'translate(-50%, -50%)',
        overflow: 'hidden',
        border: '2px solid rgba(255,255,255,0.2)',
        borderRadius: '12px',
        background: 'rgba(0,92,153,0.3)',
      }}
    >
      {platforms
        .filter(platform => {
          const platformScreenY = platform.y - camera.y;
          return (
            platformScreenY > -50 &&
            platformScreenY < gameConfig.gameHeight + 50
          );
        })
        .map(platform => (
          <div
            key={platform.id}
            className='absolute will-change-transform'
            style={getPlatformStyle(platform)}
          />
        ))}

      <motion.div
        className='absolute z-20'
        style={{
          x: fish.x,
          y: fish.y - camera.y,
          width: fish.width,
          height: fish.height,
          willChange: 'transform',
        }}
        animate={{
          rotate: fish.velocityX > 0 ? 5 : fish.velocityX < 0 ? -5 : 0,
          scale: fish.velocityY < -10 ? 1.1 : 1,
        }}
        transition={{ duration: 0.1 }}
      >
        <img
          src={fish.image || '/placeholder.svg'}
          alt={fish.name}
          className='w-full h-full object-contain'
          style={{
            filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))',
            transform: fish.velocityX < 0 ? 'scaleX(-1)' : 'scaleX(1)',
          }}
        />
      </motion.div>
    </div>
  );
}
