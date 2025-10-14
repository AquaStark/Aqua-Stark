'use client';

import { BubblesBackground } from '@/components';
import { FeaturedFish } from '@/components';
import { Footer } from '@/components';
import { HeroSection } from '@/components/landing/hero-section';
import { Navbar } from '@/components/landing/navbar';
import { OrientationLock } from '@/components/ui';
import { useBubbles } from '@/hooks';

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

  return (
    <OrientationLock>
      <div
        className='relative min-h-screen w-full overflow-x-hidden landing-page'
        style={{ height: '100vh' }}
      >
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

        {/* Top navbar/HUD - More compact on mobile */}
        <div className='relative z-30 h-12 sm:h-16 md:h-20 lg:h-24'>
          <Navbar />
        </div>

        {/* Main content - More compact on mobile */}
        <div className='relative z-20 flex flex-col justify-center items-center px-1 sm:px-2 md:px-4 pt-2 sm:pt-4 md:pt-6 min-h-[calc(100vh-3rem)] sm:min-h-[calc(100vh-4rem)] md:min-h-[calc(100vh-5rem)] lg:min-h-[calc(100vh-6rem)]'>
          {/* Hero section - Smaller on mobile */}
          <div className='flex items-center justify-center py-1 sm:py-2 md:py-4'>
            <HeroSection />
          </div>

          {/* Featured fish section - Smaller on mobile */}
          <div className='flex items-center justify-center py-1 sm:py-2 md:py-4'>
            <FeaturedFish />
          </div>

          {/* Footer - Smaller on mobile */}
          <div className='py-1 sm:py-2 md:py-4 mt-auto'>
            <Footer />
          </div>
        </div>
      </div>
    </OrientationLock>
  );
}
