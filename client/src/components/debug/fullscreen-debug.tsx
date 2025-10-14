import { useState, useEffect } from 'react';
import { useFullscreen } from '@/hooks/use-fullscreen';
import { Maximize, X } from 'lucide-react';

export function FullscreenDebug() {
  const { isFullscreen, enterFullscreen, isSupported, isEnabled } =
    useFullscreen();
  const [showNotification, setShowNotification] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Detect if device is mobile
  useEffect(() => {
    const checkMobile = () => {
      const mobile =
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
          navigator.userAgent
        );
      const isTouchDevice =
        'ontouchstart' in window || navigator.maxTouchPoints > 0;
      const isSmallScreen = window.innerWidth <= 768;

      setIsMobile(mobile || (isTouchDevice && isSmallScreen));
    };

    checkMobile();

    // Listen for orientation changes
    const handleOrientationChange = () => {
      setTimeout(checkMobile, 100); // Small delay to let orientation settle
    };

    window.addEventListener('orientationchange', handleOrientationChange);
    window.addEventListener('resize', handleOrientationChange);

    return () => {
      window.removeEventListener('orientationchange', handleOrientationChange);
      window.removeEventListener('resize', handleOrientationChange);
    };
  }, []);

  // Auto fullscreen logic
  useEffect(() => {
    const attemptFullscreen = async () => {
      if (isSupported && isEnabled && !isFullscreen) {
        try {
          await enterFullscreen();
        } catch (error) {
          console.log('Fullscreen failed:', error);
        }
      }
    };

    if (isMobile) {
      // On mobile, always try to go fullscreen automatically
      const timer = setTimeout(attemptFullscreen, 500);

      // Also try on first user interaction (required for iOS)
      const handleFirstInteraction = async () => {
        await attemptFullscreen();
        document.removeEventListener('touchstart', handleFirstInteraction);
        document.removeEventListener('click', handleFirstInteraction);
      };

      document.addEventListener('touchstart', handleFirstInteraction);
      document.addEventListener('click', handleFirstInteraction);

      return () => {
        clearTimeout(timer);
        document.removeEventListener('touchstart', handleFirstInteraction);
        document.removeEventListener('click', handleFirstInteraction);
      };
    } else {
      // On desktop, show notification only once if not prompted before
      const timer = setTimeout(() => {
        const hasBeenPrompted = localStorage.getItem(
          'aqua-stark-fullscreen-prompted'
        );
        const hasBeenDeclined = localStorage.getItem(
          'aqua-stark-fullscreen-declined'
        );

        // Only show notification if never prompted and never declined
        if (!hasBeenPrompted && !hasBeenDeclined) {
          setShowNotification(true);
        }
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [isSupported, isEnabled, isFullscreen, isMobile, enterFullscreen]);

  // Listen for orientation changes on mobile to re-trigger fullscreen
  useEffect(() => {
    if (!isMobile) return;

    const handleOrientationChange = async () => {
      // Wait a bit for orientation to settle
      setTimeout(async () => {
        if (isSupported && isEnabled && !isFullscreen) {
          try {
            await enterFullscreen();
          } catch (error) {
            console.log('Fullscreen on orientation change failed:', error);
          }
        }
      }, 300);
    };

    window.addEventListener('orientationchange', handleOrientationChange);
    return () =>
      window.removeEventListener('orientationchange', handleOrientationChange);
  }, [isMobile, isSupported, isEnabled, isFullscreen, enterFullscreen]);

  const handleAccept = async () => {
    localStorage.setItem('aqua-stark-fullscreen-prompted', 'true');
    setShowNotification(false);
    await enterFullscreen();
  };

  const handleDecline = () => {
    localStorage.setItem('aqua-stark-fullscreen-declined', 'true');
    setShowNotification(false);
  };

  // Don't show notification on mobile (auto fullscreen)
  if (isMobile || !showNotification) return null;

  return (
    <div className='fixed top-4 left-1/2 transform -translate-x-1/2 z-[9999] bg-blue-900/95 backdrop-blur-sm border border-blue-400/50 rounded-lg px-4 py-3 shadow-lg'>
      <div className='flex items-center gap-3'>
        <Maximize className='h-5 w-5 text-blue-300' />
        <span className='text-white font-medium'>Go Full Screen?</span>
        <button
          onClick={handleAccept}
          className='bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm transition-colors'
        >
          Yes
        </button>
        <button
          onClick={handleDecline}
          className='text-blue-300 hover:text-white transition-colors'
        >
          <X className='h-4 w-4' />
        </button>
      </div>
    </div>
  );
}
