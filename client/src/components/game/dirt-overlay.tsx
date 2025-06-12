import { DirtSpot } from './dirt-spot';
import { DirtSpot as DirtSpotType } from '@/types/dirt';

interface DirtOverlayProps {
  spots: DirtSpotType[];
  onRemoveSpot: (spotId: number) => void;
  className?: string;
}

export function DirtOverlay({ spots, onRemoveSpot, className = '' }: DirtOverlayProps) {
  return (
    <div className={`absolute inset-0 pointer-events-none z-50 ${className}`}>
      {spots.map((spot) => (
        <div key={spot.id} className="pointer-events-auto">
          <DirtSpot 
            spot={spot} 
            onRemove={onRemoveSpot}
          />
        </div>
      ))}
    </div>
  );
}
