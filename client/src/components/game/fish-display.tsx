'use client';

import { Fish } from '@/components/aquarium/fish';

interface FishDisplayProps {
  fish: Array<{
    id: number;
    position: { x: number; y: number };
    facingLeft: boolean;
    behaviorState:
      | 'idle'
      | 'darting'
      | 'hovering'
      | 'turning'
      | 'feeding'
      | 'exploring'
      | 'playful';
    name: string;
    image: string;
    rarity: string;
    generation: number;
    lastFedTimestamp?: Date | string | number | null;
    lastUpdated?: Date | string | number | null;
  }>;
  cleanlinessScore?: number;
}

export function FishDisplay({ fish, cleanlinessScore }: FishDisplayProps) {
  return (
    <div className='relative w-full h-full'>
      {fish.map(fishState => (
        <Fish
          key={fishState.id}
          fish={{
            id: fishState.id,
            name: fishState.name,
            image: fishState.image,
            rarity: fishState.rarity,
            generation: fishState.generation,
            position: fishState.position,
            lastFedTimestamp: fishState.lastFedTimestamp,
            lastUpdated: fishState.lastUpdated,
          }}
          position={fishState.position}
          facingLeft={fishState.facingLeft}
          behaviorState={fishState.behaviorState}
          cleanlinessScore={cleanlinessScore}
          style={{
            filter:
              fishState.behaviorState === 'feeding'
                ? 'brightness(1.2) drop-shadow(0 0 8px rgba(255,215,0,0.6))'
                : 'none',
          }}
        />
      ))}
    </div>
  );
}
