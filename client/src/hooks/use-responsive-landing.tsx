'use client';

import { useEffect, useState } from 'react';
import LandingPage from '@/pages/landing';
import LandingMobilePage from '@/pages/landing-mobile';

export function useResponsiveLanding() {
  const [isMobile, setIsMobile] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkIsMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      setIsLoading(false);
    };

    // Check on mount
    checkIsMobile();

    // Listen for resize events
    window.addEventListener('resize', checkIsMobile);

    return () => {
      window.removeEventListener('resize', checkIsMobile);
    };
  }, []);

  if (isLoading) {
    return <div className="min-h-screen bg-blue-900 flex items-center justify-center">
      <div className="text-white text-xl">Loading...</div>
    </div>;
  }

  return isMobile ? <LandingMobilePage /> : <LandingPage />;
}
