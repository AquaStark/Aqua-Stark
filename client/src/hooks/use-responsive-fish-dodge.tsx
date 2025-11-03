import { useEffect, useState } from 'react';
import FishDodgePage from '@/pages/fish-dodge';
import { MobileFishDodgeView } from '@/components/mobile/mobile-fish-dodge-view';

export function useResponsiveFishDodge() {
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

  return isMobile ? <MobileFishDodgeView /> : <FishDodgePage />;
}
