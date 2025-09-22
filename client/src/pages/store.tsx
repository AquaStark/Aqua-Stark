'use client';

import { useState, useEffect } from 'react';
import { StoreOriginal } from '@/components/store/store-original';
import { BubblesBackground } from '@/components/bubble-background';
import { useBubbles } from '@/hooks';
import { PageHeader } from '@/components/layout/page-header';
import { Footer } from '@/components/layout/footer';
import { CartSidebar } from '@/components/store/cart-sidebar';
import { CheckoutModal } from '@/components/store/checkout-modal';
import { useCartStore } from '@/store/use-cart-store';
import { Button } from '@/components/ui/button';
import { ShoppingCart } from 'lucide-react';
import { LoadingScreen } from '@/components/loading/loading-screen';

export default function StorePage() {
  const [showStore, setShowStore] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState('Initializing store...');
  const [isComplete, setIsComplete] = useState(false);

  const bubbles = useBubbles();
  const { toggleCart } = useCartStore();

  // Minimum loading time (2.5 seconds)
  const MIN_LOADING_TIME = 2500;

  // Initialize loading
  useEffect(() => {
    const startTime = Date.now();
    let currentProgress = 0;

    // Define loading steps with text changes
    const stepTexts = [
      { progress: 0, text: 'Initializing store...' },
      { progress: 20, text: 'Connecting to store API...' },
      { progress: 40, text: 'Loading store items...' },
      { progress: 60, text: 'Processing item data...' },
      { progress: 80, text: 'Loading item images...' },
      { progress: 100, text: 'Store ready!' },
    ];

    // Smooth progress animation
    const progressInterval = setInterval(() => {
      currentProgress += 1;
      setLoadingProgress(currentProgress);

      // Update text based on progress
      const currentStep = stepTexts.find(
        step => currentProgress >= step.progress
      );
      if (currentStep) {
        setCurrentStep(currentStep.text);
      }

      if (currentProgress >= 100) {
        clearInterval(progressInterval);

        // Check if minimum time has passed
        const elapsedTime = Date.now() - startTime;
        const remainingTime = MIN_LOADING_TIME - elapsedTime;

        if (remainingTime > 0) {
          setTimeout(() => {
            setIsComplete(true);
          }, remainingTime);
        } else {
          setIsComplete(true);
        }
      }
    }, 25); // Update every 25ms for smooth animation

    return () => clearInterval(progressInterval);
  }, []);

  // Handle loading completion
  const handleLoadingComplete = () => {
    setShowStore(true);
  };

  // Show loading screen
  if (!showStore) {
    return (
      <>
        {/* Loading screen visible */}
        <LoadingScreen
          onComplete={handleLoadingComplete}
          progress={loadingProgress}
          currentStep={currentStep}
          isComplete={isComplete}
          showTips={true}
        />

        {/* Store rendered in background but hidden */}
        <div
          style={{
            position: 'absolute',
            left: '-9999px',
            top: '-9999px',
            visibility: 'hidden',
            pointerEvents: 'none',
          }}
        >
          <div className='relative min-h-screen overflow-hidden bg-gradient-to-b from-blue-500 to-blue-900 animated-background'>
            <BubblesBackground bubbles={bubbles} />
            <PageHeader
              title='Aqua Stark Store'
              backTo='/'
              rightContent={
                <div className='flex items-center gap-2'>
                  <Button
                    variant='ghost'
                    className='relative text-white rounded-full hover:bg-blue-500/50'
                    onClick={toggleCart}
                  >
                    <ShoppingCart className='mr-2' />
                  </Button>
                  <div className='flex items-center px-4 py-2 border rounded-full bg-blue-700/50 border-blue-400/50'>
                    <img
                      src='/icons/coin.png'
                      alt='Coins'
                      className='w-5 h-5 mr-2'
                    />
                    <span className='font-bold text-white'>12,500</span>
                  </div>
                </div>
              }
            />
            <CartSidebar />
            <CheckoutModal />
            <main className='relative z-10'>
              <div className='px-2 sm:px-4 py-2 sm:py-4 mx-auto max-w-6xl'>
                <StoreOriginal />
              </div>
            </main>
            <Footer />
          </div>
        </div>
      </>
    );
  }

  // Show store once loading is complete
  return (
    <div className='relative min-h-screen overflow-hidden bg-gradient-to-b from-blue-500 to-blue-900 animated-background'>
      <BubblesBackground bubbles={bubbles} />

      <PageHeader
        title='Aqua Stark Store'
        backTo='/'
        rightContent={
          <div className='flex items-center gap-2'>
            <Button
              variant='ghost'
              className='relative text-white rounded-full hover:bg-blue-500/50'
              onClick={toggleCart}
            >
              <ShoppingCart className='mr-2' />
            </Button>
            <div className='flex items-center px-4 py-2 border rounded-full bg-blue-700/50 border-blue-400/50'>
              <img src='/icons/coin.png' alt='Coins' className='w-5 h-5 mr-2' />
              <span className='font-bold text-white'>12,500</span>
            </div>
          </div>
        }
      />
      <CartSidebar />
      <CheckoutModal />

      <main className='relative z-10'>
        <div className='px-2 sm:px-4 py-2 sm:py-4 mx-auto max-w-6xl'>
          <StoreOriginal />
        </div>
      </main>

      <Footer />
    </div>
  );
}
