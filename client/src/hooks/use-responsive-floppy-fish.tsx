import { useEffect, useState } from 'react';
import FloppyFishGamePage from '@/pages/floppy-fish';
import { MobileFloppyFishView } from '@/components/mobile/mobile-floppy-fish-view';

export function useResponsiveFloppyFish() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 1024; // lg breakpoint
      setIsMobile(mobile);
    };

    // Check on mount
    checkMobile();

    // Add event listener for window resize
    window.addEventListener('resize', checkMobile);

    // Cleanup
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return isMobile ? <MobileFloppyFishView /> : <FloppyFishGamePage />;
}
