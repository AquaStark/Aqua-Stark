'use client';

import { BubblesBackground } from '@/components/bubble-background';
import { FeaturedFish } from '@/components/landing/featured-fish';
import { Footer } from '@/components/landing/footer';
import { HeroSection } from '@/components/landing/hero-section';
import { Navbar } from '@/components/landing/navbar';
import { useBubbles } from '@/hooks/use-bubbles';
import { useLoadingNavigation } from '@/hooks/use-loading-navigation';
import { useState } from 'react';
import { toast } from 'sonner';

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

  const { startGameWithLoading } = useLoadingNavigation();
  const [activeButton, setActiveButton] = useState<string | null>(null);

  const handleSidebarClick = (action: string) => {
    setActiveButton(action);
    switch (action) {
      case 'start':
        startGameWithLoading();
        break;
      case 'tutorial':
        toast.info('Tutorial coming soon!');
        break;
      case 'settings':
        toast.info('Settings coming soon!');
        break;
      case 'credits':
        // Direct navigation for credits
        window.location.href = '/credits';
        break;
      default:
        break;
    }
  };

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

      {/* Main layout - Responsive and scrollable */}
      <div className='relative z-20 flex flex-col lg:grid lg:grid-cols-[auto_1fr] gap-2 sm:gap-4 p-2 sm:p-4'>
        {/* Sidebar - Vertical Stack - Hidden on mobile, visible on desktop */}
        <aside className='hidden lg:flex flex-col justify-center gap-3 sm:gap-4'>
          <button
            onClick={() => handleSidebarClick('start')}
            className={`px-4 sm:px-6 md:px-8 py-3 sm:py-4 md:py-5 rounded-xl bg-gradient-to-b from-blue-400 to-blue-600 hover:from-blue-500 hover:to-blue-700 shadow-xl transform hover:scale-105 transition-all duration-200 border-2 sm:border-3 border-blue-300 flex items-center justify-center ${
              activeButton === 'start'
                ? 'scale-105 ring-2 sm:ring-3 ring-blue-300'
                : ''
            }`}
            title='Start Game'
            aria-label='Start Game'
            aria-pressed={activeButton === 'start'}
          >
            <span className='text-white text-sm sm:text-base md:text-lg font-bold whitespace-nowrap'>
              Start
            </span>
          </button>

          <button
            onClick={() => handleSidebarClick('tutorial')}
            className={`px-4 sm:px-6 md:px-8 py-3 sm:py-4 md:py-5 rounded-xl bg-gradient-to-b from-purple-400 to-purple-600 hover:from-purple-500 hover:to-purple-700 shadow-xl transform hover:scale-105 transition-all duration-200 border-2 sm:border-3 border-purple-300 flex items-center justify-center ${
              activeButton === 'tutorial'
                ? 'scale-105 ring-2 sm:ring-3 ring-purple-300'
                : ''
            }`}
            title='Tutorial'
          >
            <span className='text-white text-sm sm:text-base md:text-lg font-bold whitespace-nowrap'>
              Tutorial
            </span>
          </button>

          <button
            onClick={() => handleSidebarClick('settings')}
            className={`px-4 sm:px-6 md:px-8 py-3 sm:py-4 md:py-5 rounded-xl bg-gradient-to-b from-gray-400 to-gray-600 hover:from-gray-500 hover:to-gray-700 shadow-xl transform hover:scale-105 transition-all duration-200 border-2 sm:border-3 border-gray-300 flex items-center justify-center ${
              activeButton === 'settings'
                ? 'scale-105 ring-2 sm:ring-3 ring-gray-300'
                : ''
            }`}
            title='Settings'
          >
            <span className='text-white text-sm sm:text-base md:text-lg font-bold whitespace-nowrap'>
              Settings
            </span>
          </button>

          <button
            onClick={() => handleSidebarClick('credits')}
            className={`px-4 sm:px-6 md:px-8 py-3 sm:py-4 md:py-5 rounded-xl bg-gradient-to-b from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 shadow-xl transform hover:scale-105 transition-all duration-200 border-2 sm:border-3 border-yellow-300 flex items-center justify-center ${
              activeButton === 'credits'
                ? 'scale-105 ring-2 sm:ring-3 ring-yellow-300'
                : ''
            }`}
            title='Credits'
          >
            <span className='text-white text-sm sm:text-base md:text-lg font-bold whitespace-nowrap'>
              Credits
            </span>
          </button>
        </aside>

        {/* Main content - Responsive layout */}
        <main className='flex flex-col gap-4 sm:gap-6 md:gap-8 flex-1'>
          {/* Hero section */}
          <div className='flex items-center justify-center py-4 sm:py-6 md:py-8'>
            <HeroSection />
          </div>

          {/* Featured fish section */}
          <div className='flex items-center justify-center py-4 sm:py-6 md:py-8'>
            <FeaturedFish />
          </div>

          {/* Footer */}
          <div className='py-4 sm:py-6'>
            <Footer />
          </div>
        </main>
      </div>
    </div>
  );
}
