'use client';

import { BubblesBackground } from '@/components/bubble-background';
import { FeaturedFish } from '@/components/landing/featured-fish';
import { Footer } from '@/components/landing/footer';
import { HeroSection } from '@/components/landing/hero-section';
import { Navbar } from '@/components/landing/navbar';
import { useBubbles } from '@/hooks/use-bubbles';

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

      {/* Top navbar/HUD - Compact */}
      <div className='relative z-30 h-16 sm:h-20 md:h-24 lg:h-28'>
        <Navbar />
      </div>

      {/* Main content - Centered and positioned higher */}
      <div className='relative z-20 flex flex-col justify-center items-center px-2 sm:px-4 pt-4 sm:pt-6 md:pt-8 min-h-[calc(100vh-5rem)] lg:min-h-[calc(100vh-8rem)]'>
        {/* Hero section */}
        <div className='flex items-center justify-center py-2 sm:py-4 md:py-6'>
          <HeroSection />
        </div>

        {/* Featured fish section */}
        <div className='flex items-center justify-center py-2 sm:py-4 md:py-6'>
          <FeaturedFish />
        </div>

        {/* Footer */}
        <div className='py-2 sm:py-4 mt-auto'>
          <Footer />
        </div>
      </div>
    </div>
  );
}
