'use client';

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
  multiplier: number;
}

interface Camera {
  y: number;
}

interface GameConfig {
  gameWidth: number;
  gameHeight: number;
}

interface MobileGameCanvasProps {
  gameRef: React.RefObject<HTMLDivElement>;
  platforms: Platform[];
  fish: Fish;
  camera: Camera;
  gameConfig: GameConfig;
}

export function MobileGameCanvas({
  gameRef,
  platforms,
  fish,
  camera,
  gameConfig,
}: MobileGameCanvasProps) {
  const getPlatformStyle = (platform: Platform) => {
    const baseStyle = {
      left: platform.x,
      top: platform.y - camera.y,
      width: platform.width,
      height: 20,
      backgroundColor: '#8B4513',
      border: '2px solid #654321',
      borderRadius: '4px',
      position: 'absolute' as const,
      willChange: 'transform',
    };

    switch (platform.type) {
      case 'spring':
        return {
          ...baseStyle,
          backgroundColor: '#FFD700',
          border: '2px solid #FFA500',
          boxShadow: platform.bounceAnimation ? '0 0 20px #FFD700' : 'none',
        };
      case 'broken':
        return {
          ...baseStyle,
          backgroundColor: '#8B4513',
          border: '2px solid #654321',
          opacity: platform.bounceAnimation ? 0.5 : 1,
        };
      default:
        return baseStyle;
    }
  };

  return (
    <div
      ref={gameRef}
      className='absolute z-30'
      style={{
        width: gameConfig.gameWidth,
        height: gameConfig.gameHeight,
        left: '0',
        top: '50%',
        transform: 'translateY(-50%)',
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
