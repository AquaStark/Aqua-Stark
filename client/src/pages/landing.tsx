'use client';

import { BubblesBackground } from '@/components';
import { FeaturedFish } from '@/components';
import { Footer } from '@/components';
import { HeroSection } from '@/components/landing/hero-section';
import { Navbar } from '@/components/landing/navbar';
import { useBubbles } from '@/hooks';
import { usePulseAnimation } from '@/hooks/use-pulse-animation';

export default function LandingPage() {
  // Bubbles configuration for background effect
  const bubbles = useBubbles({
    initialCount: 8,
    maxBubbles: 15,
    minSize: 3,
    maxSize: 12,
    minDuration: 10,
    maxDuration: 20,
    interval: 1200,
  });

  // Pulse animation for connect button
  const { isPulsing, triggerPulse } = usePulseAnimation({ duration: 3000 });

  return (
    <div
      className='relative min-h-screen w-full overflow-hidden landing-page'
      style={{ height: '100vh', width: '100vw' }}
    >
      {/* Background image */}
      <div
        className='fixed inset-0 bg-cover bg-center bg-no-repeat'
        style={{
          backgroundImage: 'url("/backgrounds/initaial-background.webp")',
          filter: 'brightness(0.8)',
          width: '100vw',
          height: '100vh',
        }}
      />

      {/* Water movement effect */}
      <div
        className='fixed inset-0 water-movement'
        style={{ width: '100vw', height: '100vh' }}
      ></div>

      {/* Bubbles background effect */}
      <div
        className='fixed inset-0 pointer-events-none'
        style={{ width: '100vw', height: '100vh' }}
      >
        <BubblesBackground bubbles={bubbles} />
      </div>

      {/* Top navbar/HUD - Ultra compact on mobile */}
      <div className='relative z-30 h-10 sm:h-12 md:h-16 lg:h-20'>
        <Navbar isPulsing={isPulsing} />
      </div>

      {/* Main content - Ultra compact on mobile */}
      <div className='relative z-20 flex flex-col justify-center items-center px-0.5 sm:px-1 md:px-2 lg:px-8 pt-1 sm:pt-2 md:pt-4 pb-16 sm:pb-20 md:pb-24 min-h-[calc(100vh-2.5rem)] sm:min-h-[calc(100vh-3rem)] md:min-h-[calc(100vh-4rem)] lg:min-h-[calc(100vh-5rem)]'>
        {/* Hero section - Ultra small on mobile */}
        <div className='flex items-center justify-center py-0.5 sm:py-1 md:py-2'>
          <HeroSection onTriggerPulse={triggerPulse} />
        </div>

        {/* Featured fish section - Ultra small on mobile */}
        <div className='flex items-center justify-center py-0.5 sm:py-1 md:py-2'>
          <FeaturedFish />
        </div>
      </div>

      {/* Footer - Fixed at bottom */}
      <Footer />
    </div>
  );
}
