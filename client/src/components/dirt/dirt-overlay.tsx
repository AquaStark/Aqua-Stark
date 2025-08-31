import { memo } from 'react';
import { DirtSpot } from './dirt-spot';
import { DirtSpot as DirtSpotType } from '@/types/dirt';

interface DirtOverlayProps {
  spots: DirtSpotType[];
  onRemoveSpot: (spotId: number) => void;
  className?: string;
  isDebugMode?: boolean;
}

// Memoized component to prevent unnecessary re-renders when spots array reference changes
export const DirtOverlay = memo(function DirtOverlay({
  spots,
  onRemoveSpot,
  className = '',
  isDebugMode = false,
}: DirtOverlayProps) {
  // Early return if no spots to render
  if (spots.length === 0) {
    return null;
  }

  return (
    <div
      className={`absolute inset-0 pointer-events-none ${className}`}
      role='application'
      aria-label={`Dirt overlay with ${spots.length} dirt spot${spots.length === 1 ? '' : 's'}`}
      data-testid='dirt-overlay'
    >
      {/* Render spots grouped by layers for better visual depth */}
      {spots.map(spot => (
        <DirtSpot
          key={spot.id}
          spot={spot}
          onRemove={onRemoveSpot}
          isDebugMode={isDebugMode}
          className='pointer-events-auto'
        />
      ))}

      {/* Debug info overlay (only visible in debug mode) */}
      {isDebugMode && spots.length > 0 && (
        <div
          className='absolute top-2 left-2 bg-black/70 text-white text-xs p-2 rounded pointer-events-none z-10'
          role='status'
          aria-live='polite'
        >
          <div>Active Spots: {spots.length}</div>
          <div>Total Area: {calculateTotalDirtArea(spots).toFixed(1)}%</div>
          <div>Avg Age: {calculateAverageAge(spots).toFixed(1)}s</div>
        </div>
      )}
    </div>
  );
});

// Helper function to calculate total dirt coverage area
function calculateTotalDirtArea(spots: DirtSpotType[]): number {
  if (spots.length === 0) return 0;

  // Estimate total area coverage based on spot sizes
  // Assuming each spot covers a circular area with radius = size
  const totalArea = spots.reduce((sum, spot) => {
    const radius = spot.size || 20; // Default size if not specified
    const area = Math.PI * Math.pow(radius, 2);
    return sum + area;
  }, 0);

  // Convert to percentage of screen (assuming 1920x1080 viewport)
  const screenArea = 1920 * 1080;
  return (totalArea / screenArea) * 100;
}

// Helper function to calculate average spot age
function calculateAverageAge(spots: DirtSpotType[]): number {
  if (spots.length === 0) return 0;

  const now = Date.now();
  const totalAge = spots.reduce((sum, spot) => {
    const createdAt = spot.createdAt || now;
    return sum + (now - createdAt);
  }, 0);

  return totalAge / spots.length / 1000; // Convert to seconds
}

// Export default for backward compatibility
export default DirtOverlay;
