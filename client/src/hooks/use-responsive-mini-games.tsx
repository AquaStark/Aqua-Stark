import { useEffect, useState } from 'react';
import MiniGamesPage from '@/pages/mini-games';
import { MobileMiniGamesView } from '@/components/mobile/mobile-mini-games-view';

export function useResponsiveMiniGames() {
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

  return isMobile ? <MobileMiniGamesView /> : <MiniGamesPage />;
}
