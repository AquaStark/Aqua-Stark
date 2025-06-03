import { motion } from 'framer-motion';
import { FishType } from '@/types/game';
import { useEffect, useState, useRef } from 'react';

interface FishProps {
  fish: FishType;
  position: {
    x: number;
    y: number;
  };
  facingLeft: boolean;
  behaviorState: 'idle' | 'darting' | 'hovering' | 'turning' | 'seeking_food' | 'eating' | 'satisfied';
}

// Define valid rarity types for type safety
type RarityType = 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary' | 'exotic';

export function Fish({ fish, position, facingLeft, behaviorState }: FishProps) {
  // Track previous facing direction to detect changes for flip animation
  const prevFacingLeftRef = useRef(facingLeft);
  const [isFlipping, setIsFlipping] = useState(false);
  
  // Apply flip animation when direction changes
  useEffect(() => {
    if (prevFacingLeftRef.current !== facingLeft) {
      // Direction changed, trigger flip animation
      setIsFlipping(true);
      
      // Clear animation after it completes
      const timer = setTimeout(() => {
        setIsFlipping(false);
      }, 400); // Match animation duration
      
      // Update ref to current direction
      prevFacingLeftRef.current = facingLeft;
      
      return () => clearTimeout(timer);
    }
  }, [facingLeft]);

  // Calculate fish size based on rarity
  const getFishSize = () => {
    const rarityFactor: Record<RarityType, number> = {
      'common': 80,
      'uncommon': 90,
      'rare': 100,
      'epic': 110,
      'legendary': 120,
      'exotic': 130
    };
    
    // Get the lowercase rarity and check if it's a valid key
    const rarityKey = fish.rarity.toLowerCase() as RarityType;
    
    // Default to medium size if rarity is not recognized
    const baseSize = rarityFactor[rarityKey] || 100;
    
    return Math.round(baseSize);
  };
  
  const fishSize = getFishSize();

  // IMPORTANT: Determine the correct image to use based on direction
  // The non-flipped images (fish1.png, fish2.png, etc.) are for LEFT movement
  // The flipped images (fish1-flip.png, fish2-flip.png, etc.) are for RIGHT movement
  const getCorrectFishImage = () => {
    // Extract the base image path without extension
    const originalImagePath = fish.image || "/fish/fish1.png";
    
    // Define fallback image to ensure we always have something to display
    const fallbackImage = "/fish/fish1.png";
    
    try {
      // List of known valid fish images to prevent 404 errors
      const knownValidFish = [
        "/fish/fish1.png",
        "/fish/fish2.png",
        "/fish/fish3.png",
        "/fish/fish4.png"
      ];
      
      // Check if fish is moving right (not facing left)
      if (!facingLeft) {
        // For RIGHT movement, use flipped images
        
        // Check if the original path is a known fish image
        const isKnownFish = knownValidFish.some(validPath => 
          originalImagePath.endsWith(validPath));
        
        if (isKnownFish) {
          // Use the corresponding flip image for known fish
          return originalImagePath.replace('.png', '-flip.png');
        } else {
          // For unknown fish images, just use a guaranteed flip image to avoid 404
          return "/fish/fish1-flip.png";
        }
      } else {
        // For LEFT movement, ensure we use non-flipped images
        
        // If the image already has -flip in it but we need to face LEFT, use non-flipped version
        if (originalImagePath.includes('-flip.')) {
          return originalImagePath.replace('-flip.', '.');
        }
        
        // Otherwise use the original image
        return originalImagePath;
      }
    } catch (error) {
      console.error("Error determining fish image:", error);
      return fallbackImage;
    }
  };

  // Get the correct image based on direction
  const fishImage = getCorrectFishImage();
  
  // Handle image loading errors
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    // If image fails to load, fall back to a guaranteed image
    e.currentTarget.src = "/fish/fish1.png";
  };

  // Determine bubble position based on facing direction
  const bubblePosition = facingLeft ? 'right-[-5px]' : 'left-[-5px]';
  
  // Use animation class based on state and direction
  const stateClass = 
    behaviorState === 'darting' ? 'animate-swim-dart' : 
    behaviorState === 'hovering' ? 'animate-hover' :
    behaviorState === 'eating' ? 'animate-eating' :
    behaviorState === 'seeking_food' ? 'animate-swim-dart' : 'animate-swim-idle';
  
  // Combine state class with direction for animations
  const animationClass = `${stateClass}`;
  
  // Add flip animation class when direction changes
  const flipClass = isFlipping ? 'fish-flipping' : '';
  
  // Add eating animation class
  const eatingClass = behaviorState === 'eating' ? 'fish-eating' : '';

  return (
    <motion.div
      className="absolute cursor-pointer group"
      style={{ 
        left: `${position.x}%`, 
        top: `${position.y}%`,
        zIndex: behaviorState === 'darting' || behaviorState === 'seeking_food' ? 10 : 1
      }}
      // Use motion to animate position changes smoothly
      transition={{
        type: "spring",
        stiffness: 100,
        damping: 15,
        mass: 0.8
      }}
    >
      <div className="relative">
        <motion.div
          // Enhance eating animation
          animate={{
            rotate: behaviorState === 'darting' || behaviorState === 'seeking_food' ? [-1, 1, -1] : 
                  behaviorState === 'hovering' ? [-0.5, 0.5, -0.5] : 
                  behaviorState === 'eating' ? [-5, 5, -5] : [-1, 1, -1],
            y: behaviorState === 'darting' || behaviorState === 'seeking_food' ? [0, 1, 0] : 
               behaviorState === 'hovering' ? [0, 2, 0] : 
               behaviorState === 'eating' ? [0, 3, 0] : [0, 2, 0],
            scale: behaviorState === 'eating' ? [1, 1.1, 1] : 1
          }}
          transition={{ 
            duration: behaviorState === 'darting' || behaviorState === 'seeking_food' ? 0.5 : 
                      behaviorState === 'hovering' ? 3 : 
                      behaviorState === 'eating' ? 0.3 : 2, 
            repeat: behaviorState === 'eating' ? 3 : Infinity,
            ease: "easeInOut",
            delay: 0
          }}
          style={{
            display: 'inline-block',
          }}
        >
          <div className={`relative ${animationClass} ${eatingClass}`}>
            <img
              src={fishImage}
              alt={fish.name}
              width={fishSize}
              height={fishSize}
              className={`transition-all hover:scale-105 fish-image ${flipClass}`}
              style={{
                filter: behaviorState === 'darting' || behaviorState === 'seeking_food' ? 'brightness(1.1)' : 
                       behaviorState === 'eating' ? 'brightness(1.3)' : 'brightness(1.0)',
              }}
              onError={handleImageError}
            />
            
            {/* Eating effect */}
            {behaviorState === 'eating' && (
              <motion.div
                className="absolute inset-0"
                initial={{ scale: 1, opacity: 0 }}
                animate={{ scale: 1.5, opacity: 0 }}
                transition={{ duration: 0.3, repeat: 3 }}
              >
                <div className="w-full h-full rounded-full bg-yellow-300/30" />
              </motion.div>
            )}
            
            {/* Very subtle glow for depth */}
            <div 
              className="absolute top-0 left-0 w-full h-full rounded-full opacity-10 -z-10"
              style={{
                background: `radial-gradient(circle, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0) 70%)`,
                transform: 'scale(1.05)',
              }}
            />
          </div>
        </motion.div>
        
        {/* Tooltip on hover */}
        <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 game-container p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-20">
          <div className="font-bold text-white">{fish.name}</div>
          <div className="text-xs text-white/80">
            Rarity: {fish.rarity} • Gen {fish.generation}
          </div>
        </div>
        
        {/* Only show bubbles when darting */}
        {behaviorState === 'darting' && (
          <motion.div
            className={`absolute ${bubblePosition} top-1/2 -translate-y-1/2`}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ 
              opacity: [0, 0.4, 0],
              scale: [0, 0.7, 0.9],
              x: facingLeft ? [0, -7] : [0, 7]
            }}
            transition={{
              duration: 0.7,
              repeat: Infinity,
              repeatDelay: 0.3,
              ease: "easeInOut"
            }}
          >
            <div className="w-1.5 h-1.5 bg-white/25 rounded-full" />
          </motion.div>
        )}
      </div>
    </motion.div>
  );
} 