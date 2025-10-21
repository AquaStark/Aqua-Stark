import { useState, useEffect } from 'react';
import BubbleJumperPage from '@/pages/bubble-jumper';
import MobileBubbleJumperView from '@/components/mobile/mobile-bubble-jumper-view';

/**
 * Hook that conditionally renders the appropriate Bubble Jumper view based on screen size.
 * Returns the desktop version for screens >= 1024px, mobile version otherwise.
 */
export function useResponsiveBubbleJumper() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    // Check initial screen size
    checkScreenSize();

    // Add event listener for window resize
    window.addEventListener('resize', checkScreenSize);

    // Cleanup event listener on unmount
    return () => {
      window.removeEventListener('resize', checkScreenSize);
    };
  }, []);

  return isMobile ? MobileBubbleJumperView : BubbleJumperPage;
}
