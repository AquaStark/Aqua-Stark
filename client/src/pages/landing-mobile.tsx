'use client';

import { BubblesBackground } from '@/components';
import { FeaturedFishMobile } from '@/components/landing/featured-fish-mobile';
import { Footer } from '@/components';
import { HeroSection } from '@/components/landing/hero-section';
import { NavbarMobile } from '@/components/landing/navbar-mobile';
import { useBubbles } from '@/hooks';
import { usePulseAnimation } from '@/hooks/use-pulse-animation';

export default function LandingMobilePage() {
  // Bubbles configuration for background effect
  const bubbles = useBubbles({
    initialCount: 6,
    maxBubbles: 10,
    minSize: 2,
    maxSize: 8,
    minDuration: 8,
    maxDuration: 15,
    interval: 1500,
  });

  // Pulse animation for connect button
  const { isPulsing, triggerPulse } = usePulseAnimation({ duration: 3000 });

  return (
    <div className='relative min-h-screen w-full overflow-hidden landing-page'>
      {/* Background image */}
      <div
        className='fixed inset-0 bg-cover bg-center bg-no-repeat'
        style={{
          backgroundImage: 'url("/backgrounds/initaial-background.webp")',
          filter: 'brightness(0.8)',
        }}
      />

      {/* Water movement effect */}
      <div className='fixed inset-0 water-movement'></div>

      {/* Bubbles background effect */}
      <div className='fixed inset-0 pointer-events-none'>
        <BubblesBackground bubbles={bubbles} />
      </div>

      {/* Top navbar/HUD - Mobile optimized */}
      <div className='relative z-30 h-12' style={{ marginTop: '20px' }}>
        <NavbarMobile isPulsing={isPulsing} />
      </div>

      {/* Main content - Mobile optimized */}
      <div className='relative z-20 flex flex-col justify-center items-center px-3 pt-1 pb-16 min-h-[calc(100vh-4rem)]'>
        {/* Hero section - Mobile optimized */}
        <div className='flex items-center justify-center pt-0 pb-0 sm:py-1 md:py-2 flex-1'>
          <HeroSection onTriggerPulse={triggerPulse} />
        </div>

        {/* Featured fish section - Mobile optimized */}
        <div className='flex items-center justify-center pt-0 pb-2 flex-1 -mt-24 sm:-mt-12 md:-mt-6 lg:mt-0'>
          <FeaturedFishMobile />
        </div>
      </div>

      {/* Footer - Fixed at bottom */}
      <Footer />
    </div>
  );
}
