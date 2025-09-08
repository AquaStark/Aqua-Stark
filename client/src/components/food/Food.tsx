'use client';

import type React from 'react';
import { useEffect, useState } from 'react';
import type { FoodItem } from '@/types/food';

interface FoodProps {
  food: FoodItem;
  aquariumBounds: { width: number; height: number };
}

export const Food: React.FC<FoodProps> = ({ food }) => {
  const [scale, setScale] = useState(0);

  // Simple spawn animation
  useEffect(() => {
    const timer = setTimeout(() => setScale(1), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <div
        className='absolute pointer-events-none food-item'
        style={{
          left: `${food.position.x}%`,
          top: `${food.position.y}%`,
          width: '20px',
          height: '20px',
          backgroundColor: '#8B4513',
          borderRadius: '50%',
          border: '3px solid #D2691E',
          transform: `translate(-50%, -50%) scale(${scale})`,
          transition: 'transform 0.2s ease-out',
          zIndex: 30,
          boxShadow:
            '0 2px 8px rgba(0,0,0,0.3), inset 0 1px 2px rgba(255,255,255,0.4)',
        }}
      />
    </>
  );
};
